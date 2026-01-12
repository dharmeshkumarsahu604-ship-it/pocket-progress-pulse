import { useState, useEffect, useCallback } from "react";
import { z } from "zod";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CameraInterface } from "@/components/scanner/CameraInterface";
import { ScanResults } from "@/components/scanner/ScanResults";
import { PermissionGate } from "@/components/shared/PermissionGate";
import { FullscreenImageViewer } from "@/components/shared/FullscreenImageViewer";
import { ImageAnnotator } from "@/components/shared/ImageAnnotator";
import { 
  Camera, 
  Image as ImageIcon, 
  Trash2, 
  Loader2, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  PenTool,
  Sun,
  Focus,
  Layers,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";
import secureLog from "@/lib/secureLogger";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// Schema for validating AI scan results before database insert
const scanResultSchema = z.object({
  name: z.string().max(200, "Name too long").default("Unknown Specimen"),
  description: z.string().max(2000, "Description too long").default("No description available"),
  type: z.enum(["rock", "mineral"]).default("rock"),
  confidence: z.number().min(0).max(100).default(50),
});

interface SavedScan {
  id: string;
  image_url: string;
  identified_as: string;
  item_type: string;
  confidence: number | null;
  notes: string | null;
  created_at: string;
}

const scanningTips = [
  { icon: Layers, text: "Plain background" },
  { icon: Sun, text: "Good lighting" },
  { icon: Focus, text: "Sharp focus" },
];

export default function Scanner() {
  const { user } = useAuth();
  const [showCamera, setShowCamera] = useState(false);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [savedScans, setSavedScans] = useState<SavedScan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedScanIndex, setSelectedScanIndex] = useState<number | null>(null);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [isAnnotatorOpen, setIsAnnotatorOpen] = useState(false);

  const selectedScan = selectedScanIndex !== null ? savedScans[selectedScanIndex] : null;

  // Navigate to next/prev scan
  const goToNextScan = useCallback(() => {
    if (selectedScanIndex !== null && selectedScanIndex < savedScans.length - 1) {
      setSelectedScanIndex(selectedScanIndex + 1);
    }
  }, [selectedScanIndex, savedScans.length]);

  const goToPrevScan = useCallback(() => {
    if (selectedScanIndex !== null && selectedScanIndex > 0) {
      setSelectedScanIndex(selectedScanIndex - 1);
    }
  }, [selectedScanIndex]);

  // Swipe gesture handlers
  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: goToNextScan,
    onSwipeRight: goToPrevScan,
  });

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedScanIndex === null) return;
      
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrevScan();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNextScan();
      } else if (e.key === "Escape") {
        closeScanDetail();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedScanIndex, goToNextScan, goToPrevScan]);

  const closeScanDetail = useCallback(() => {
    setSelectedScanIndex(null);
    setIsFullscreenOpen(false);
    setIsAnnotatorOpen(false);
  }, []);

  const openScanDetail = (scan: SavedScan) => {
    setIsFullscreenOpen(false);
    setIsAnnotatorOpen(false);
    const index = savedScans.findIndex((s) => s.id === scan.id);
    setSelectedScanIndex(index);
  };

  // Fetch saved scans on mount
  useEffect(() => {
    if (user) {
      fetchSavedScans();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchSavedScans = async () => {
    try {
      const { data, error } = await supabase
        .from("scan_history")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSavedScans(data || []);
    } catch (error) {
      secureLog.error("Error fetching saved scans", error);
      toast.error("Failed to load saved scans");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCapture = async (imageData: string) => {
    setScannedImage(imageData);
    setShowCamera(false);
    setIsScanning(true);

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        secureLog.error("Session error", sessionError);
        toast.error("Session error. Please sign in again.");
        setIsScanning(false);
        return;
      }
      
      if (!session?.access_token) {
        toast.error("Please sign in to use the scanner");
        setIsScanning(false);
        return;
      }

      const response = await fetch(
        `https://gknkwiwfwzjfcijjrlac.supabase.co/functions/v1/identify-specimen`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ imageBase64: imageData }),
        }
      );

      if (response.status === 429) {
        toast.error("Rate limit exceeded. Please try again later.");
        setIsScanning(false);
        return;
      }

      if (response.status === 402) {
        toast.error("AI service unavailable. Please contact support.");
        setIsScanning(false);
        return;
      }

      if (response.status === 401) {
        toast.error("Authentication failed. Please sign in again.");
        setIsScanning(false);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to identify specimen");
      }

      const result = await response.json();
      
      const formattedResult = {
        name: result.name || "Unknown Specimen",
        type: result.type || "Unknown",
        confidence: (result.confidence || 50) / 100,
        confidenceLevel: result.confidenceLevel || (result.confidence >= 80 ? "high" : result.confidence >= 50 ? "medium" : "low"),
        description: result.description || "No description available",
        properties: [
          { label: "Composition", value: result.composition || "Unknown" },
          { label: "Texture", value: result.texture || "Unknown" },
          { label: "Color", value: result.color || "Unknown" },
          { label: "Formation", value: result.formation || "Unknown" },
        ],
        possibleExamples: result.possibleExamples || [],
        labelDetected: result.labelDetected || false,
        labelText: result.labelText || null,
        verification: result.verification || "no_label",
        verificationNote: result.verificationNote || null,
        requiresVerification: result.requiresVerification || null,
      };

      setScanResult(formattedResult);
      setIsScanning(false);
      toast.success("Specimen identified!");
    } catch (error) {
      secureLog.error("Identification error", error);
      toast.error("Failed to identify specimen. Please try again.");
      setIsScanning(false);
    }
  };

  const handleGallerySelect = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (event) => {
        const imageData = event.target?.result as string;
        await handleCapture(imageData);
      };
      reader.readAsDataURL(file);
    };

    input.click();
  };

  const handleSave = async () => {
    if (!user || !scannedImage || !scanResult) {
      toast.error("Please sign in to save scans");
      return;
    }

    setIsSaving(true);
    try {
      const base64Data = scannedImage.split(",")[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/jpeg" });

      const fileName = `${user.id}/${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(fileName, blob);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("images")
        .getPublicUrl(fileName);

      const normalizedType = scanResult.type?.toLowerCase().includes("mineral") ? "mineral" : "rock";
      const validated = scanResultSchema.safeParse({
        name: scanResult.name,
        description: scanResult.description,
        type: normalizedType,
        confidence: Math.round(scanResult.confidence * 100),
      });

      if (!validated.success) {
        secureLog.error("Invalid scan result data", validated.error);
        toast.error("Invalid scan data. Please try again.");
        return;
      }

      const { error: insertError } = await supabase.from("scan_history").insert({
        user_id: user.id,
        image_url: publicUrl,
        identified_as: validated.data.name,
        item_type: validated.data.type,
        confidence: validated.data.confidence,
        notes: validated.data.description,
      });

      if (insertError) throw insertError;

      toast.success("Saved to collection");
      fetchSavedScans();
      handleReset();
    } catch (error) {
      secureLog.error("Error saving scan", error);
      toast.error("Failed to save scan");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const { error } = await supabase
        .from("scan_history")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setSavedScans((prev) => prev.filter((scan) => scan.id !== id));
      toast.success("Scan deleted");
    } catch (error) {
      secureLog.error("Error deleting scan", error);
      toast.error("Failed to delete scan");
    } finally {
      setDeletingId(null);
    }
  };

  const handleReset = () => {
    setScannedImage(null);
    setScanResult(null);
    setIsScanning(false);
  };

  const handleSelectAlternative = (alternativeName: string) => {
    if (!scanResult) return;
    
    // Update the current scan result with the selected alternative
    setScanResult((prev: any) => ({
      ...prev,
      name: alternativeName,
      confidence: 0.9, // User-confirmed selection gets higher confidence
      confidenceLevel: "high",
      possibleExamples: prev.possibleExamples?.filter((ex: string) => ex !== alternativeName) || [],
      requiresVerification: null, // Clear verification warning since user confirmed
    }));
    
    toast.success(`Updated identification to "${alternativeName}"`);
  };

  if (showCamera) {
    return (
      <CameraInterface
        onCapture={handleCapture}
        onClose={() => setShowCamera(false)}
      />
    );
  }

  return (
    <AppLayout>
      <PermissionGate 
        permissions={['camera', 'storage']}
        title="Scanner Permissions"
        description="The AI Scanner needs access to:"
      >
        <div className="space-y-6 pb-6">
          {/* Hero Section */}
          <div 
            className="relative rounded-2xl overflow-hidden p-6 text-white animate-fade-in"
            style={{
              background: "linear-gradient(135deg, hsl(var(--geo-green)) 0%, hsl(var(--geo-brown)) 100%)"
            }}
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-5 w-5" />
                <span className="text-white/80 text-sm font-medium">AI-Powered</span>
              </div>
              <h1 className="text-2xl font-bold">Rock & Mineral Scanner</h1>
              <p className="text-white/80 text-sm mt-1">
                Identify specimens instantly using AI
              </p>
            </div>
            {/* Decorative circles */}
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
            <div className="absolute -right-4 -bottom-12 w-24 h-24 rounded-full bg-white/5" />
          </div>

          {/* Main Scan Action */}
          {!scannedImage && !isScanning && (
            <div className="flex flex-col items-center space-y-6 py-4 animate-fade-in">
              {/* Primary Camera Button */}
              <div className="relative">
                <button
                  onClick={() => setShowCamera(true)}
                  className="relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl"
                  style={{
                    background: "hsl(var(--geo-amber))",
                    boxShadow: "0 0 0 0 hsla(var(--geo-amber), 0.4)"
                  }}
                >
                  <Camera className="h-12 w-12 text-white" />
                  {/* Pulse animation ring */}
                  <span 
                    className="absolute inset-0 rounded-full animate-ping opacity-30"
                    style={{ background: "hsl(var(--geo-amber))" }}
                  />
                </button>
              </div>
              <span className="text-lg font-semibold text-[hsl(var(--geo-text-primary))]">
                Scan Specimen
              </span>

              {/* Secondary Gallery Button */}
              <button
                onClick={handleGallerySelect}
                className="flex items-center gap-2 text-[hsl(var(--geo-text-secondary))] hover:text-[hsl(var(--geo-text-primary))] transition-colors"
              >
                <ImageIcon className="h-4 w-4" />
                <span className="text-sm">Upload from Gallery</span>
              </button>

              {/* Scanning Tips */}
              <Card className="w-full bg-[hsl(var(--geo-amber-light))] border-0 shadow-sm rounded-xl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-around">
                    {scanningTips.map((tip, index) => {
                      const Icon = tip.icon;
                      return (
                        <div key={index} className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-[hsl(var(--geo-amber))]" />
                          <span className="text-xs text-[hsl(var(--geo-text-primary))]">
                            {tip.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Scanning State */}
          {isScanning && (
            <div className="flex flex-col items-center justify-center py-16 space-y-6 animate-fade-in">
              <div className="relative">
                <div 
                  className="h-20 w-20 rounded-full border-4 border-t-transparent animate-spin"
                  style={{ borderColor: "hsl(var(--geo-amber))", borderTopColor: "transparent" }}
                />
                <Camera className="absolute inset-0 m-auto h-8 w-8 text-[hsl(var(--geo-amber))]" />
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-[hsl(var(--geo-text-primary))]">
                  Analyzing specimen...
                </p>
                <p className="text-sm text-[hsl(var(--geo-text-secondary))] mt-1">
                  AI is identifying the geological specimen
                </p>
              </div>
            </div>
          )}

          {/* Scan Results */}
          {scannedImage && scanResult && !isScanning && (
            <div className="animate-scale-in">
              <ScanResults
                imageData={scannedImage}
                result={scanResult}
                onBack={handleReset}
                onSave={handleSave}
                onSelectAlternative={handleSelectAlternative}
                isSaving={isSaving}
              />
            </div>
          )}

          {/* Recent Scans Section */}
          {!scannedImage && !isScanning && (
            <section className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[hsl(var(--geo-text-primary))]">
                  Recent Scans
                </h2>
                {savedScans.length > 0 && (
                  <span className="text-sm text-[hsl(var(--geo-text-secondary))]">
                    {savedScans.length} recent
                  </span>
                )}
              </div>
              
              {isLoading ? (
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2">
                  {[...Array(4)].map((_, i) => (
                    <div 
                      key={i} 
                      className="flex-shrink-0 w-28 h-28 bg-muted rounded-xl shimmer animate-fade-in" 
                      style={{ animationDelay: `${i * 100}ms` }}
                    />
                  ))}
                </div>
              ) : savedScans.length === 0 ? (
                <Card className="border-dashed border-2 bg-transparent">
                  <CardContent className="py-10 text-center flex flex-col items-center">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                      style={{ background: "hsl(var(--geo-amber)/0.1)" }}
                    >
                      <Camera className="h-8 w-8 text-[hsl(var(--geo-amber))]" />
                    </div>
                    <p className="text-[hsl(var(--geo-text-primary))] font-medium mb-1">
                      No scans yet
                    </p>
                    <p className="text-sm text-[hsl(var(--geo-text-secondary))] mb-4">
                      Start by scanning your first specimen
                    </p>
                    <Button
                      onClick={() => setShowCamera(true)}
                      style={{ background: "hsl(var(--geo-amber))" }}
                      className="text-white hover:opacity-90"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Scan Now
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
                  {savedScans.slice(0, 10).map((scan, index) => (
                    <div
                      key={scan.id}
                      className="relative flex-shrink-0 w-28 h-28 rounded-xl overflow-hidden cursor-pointer group transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
                      style={{ animationDelay: `${index * 50}ms` }}
                      onClick={() => openScanDetail(scan)}
                    >
                      <img
                        src={scan.image_url}
                        alt={scan.identified_as}
                        className="w-full h-full object-cover"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      {/* Scan info */}
                      <div className="absolute bottom-0 left-0 right-0 p-2">
                        <span className="text-white text-xs font-medium line-clamp-1">
                          {scan.identified_as}
                        </span>
                      </div>
                      {/* Status badge */}
                      <div className="absolute top-2 right-2">
                        <Badge 
                          variant="secondary" 
                          className={cn(
                            "text-[10px] px-1.5 py-0.5",
                            scan.item_type === 'mineral' 
                              ? 'bg-blue-500/80 text-white' 
                              : 'bg-amber-500/80 text-white'
                          )}
                        >
                          {scan.item_type === 'mineral' ? 'Mineral' : 'Rock'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Scan Detail Dialog */}
          <Dialog open={selectedScanIndex !== null} onOpenChange={(open) => !open && closeScanDetail()}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-0">
              {selectedScan && (
                <div {...swipeHandlers} className="touch-pan-y">
                  <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="flex items-center gap-2">
                      {selectedScan.identified_as}
                      <Badge variant="secondary">{selectedScan.item_type}</Badge>
                    </DialogTitle>
                    <div className="flex items-center justify-center gap-2 pt-2">
                      <span className="text-xs text-muted-foreground">
                        {(selectedScanIndex ?? 0) + 1} of {savedScans.length}
                      </span>
                    </div>
                  </DialogHeader>
                  
                  <div className="relative">
                    {selectedScanIndex !== null && selectedScanIndex > 0 && (
                      <button
                        onClick={goToPrevScan}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                        aria-label="Previous scan"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                    )}
                    {selectedScanIndex !== null && selectedScanIndex < savedScans.length - 1 && (
                      <button
                        onClick={goToNextScan}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                        aria-label="Next scan"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    )}
                    
                    <div className="overflow-hidden relative group">
                      <img
                        src={selectedScan.image_url}
                        alt={selectedScan.identified_as}
                        className="w-full h-64 object-cover transition-transform duration-200 cursor-pointer"
                        onClick={() => setIsFullscreenOpen(true)}
                      />
                      <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setIsAnnotatorOpen(true)}
                          className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                          aria-label="Annotate image"
                        >
                          <PenTool className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setIsFullscreenOpen(true)}
                          className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                          aria-label="View fullscreen"
                        >
                          <Maximize2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-4 space-y-4">
                    {selectedScan.confidence && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Confidence:</span>
                        <Badge variant={selectedScan.confidence >= 70 ? "default" : "secondary"}>
                          {selectedScan.confidence}%
                        </Badge>
                      </div>
                    )}
                    {selectedScan.notes && (
                      <div>
                        <h4 className="font-medium mb-1">Description</h4>
                        <p className="text-sm text-muted-foreground">{selectedScan.notes}</p>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        {new Date(selectedScan.created_at).toLocaleDateString()} at{" "}
                        {new Date(selectedScan.created_at).toLocaleTimeString()}
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            disabled={deletingId === selectedScan.id}
                          >
                            {deletingId === selectedScan.id ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-1" />
                            ) : (
                              <Trash2 className="h-4 w-4 mr-1" />
                            )}
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Scan</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this scan? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                handleDelete(selectedScan.id);
                                closeScanDetail();
                              }}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                    
                    <p className="text-xs text-center text-muted-foreground">
                      Swipe left/right to navigate
                    </p>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Fullscreen Image Viewer */}
          {selectedScan && (
            <>
              <FullscreenImageViewer
                src={selectedScan.image_url}
                alt={selectedScan.identified_as}
                isOpen={isFullscreenOpen}
                onClose={() => setIsFullscreenOpen(false)}
              />
              <ImageAnnotator
                src={selectedScan.image_url}
                alt={selectedScan.identified_as}
                isOpen={isAnnotatorOpen}
                onClose={() => setIsAnnotatorOpen(false)}
              />
            </>
          )}
        </div>
      </PermissionGate>
    </AppLayout>
  );
}
