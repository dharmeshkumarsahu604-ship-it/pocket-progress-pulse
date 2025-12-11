import { useState, useEffect, useCallback } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CameraInterface } from "@/components/scanner/CameraInterface";
import { ScanResults } from "@/components/scanner/ScanResults";
import { PermissionGate } from "@/components/shared/PermissionGate";
import { FullscreenImageViewer } from "@/components/shared/FullscreenImageViewer";
import { ImageAnnotator } from "@/components/shared/ImageAnnotator";
import { Camera, Image as ImageIcon, Trash2, Loader2, ChevronLeft, ChevronRight, Maximize2, PenTool } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";
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

interface SavedScan {
  id: string;
  image_url: string;
  identified_as: string;
  item_type: string;
  confidence: number | null;
  notes: string | null;
  created_at: string;
}

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
  }, []);

  const openScanDetail = (scan: SavedScan) => {
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
      console.error("Error fetching saved scans:", error);
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
      // Get fresh session to ensure valid token
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        toast.error("Session error. Please sign in again.");
        setIsScanning(false);
        return;
      }
      
      if (!session?.access_token) {
        toast.error("Please sign in to use the scanner");
        setIsScanning(false);
        return;
      }

      console.log("Calling identify-specimen with valid session");

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
        description: result.description || "No description available",
        properties: [
          { label: "Composition", value: result.composition || "Unknown" },
          { label: "Texture", value: result.texture || "Unknown" },
          { label: "Color", value: result.color || "Unknown" },
          { label: "Formation", value: result.formation || "Unknown" },
        ],
      };

      setScanResult(formattedResult);
      setIsScanning(false);
      toast.success("Specimen identified!");
    } catch (error) {
      console.error("Identification error:", error);
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
      // Upload image to storage
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

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("images")
        .getPublicUrl(fileName);

      // Save to scan_history - normalize item_type to 'rock' or 'mineral'
      const normalizedType = scanResult.type.toLowerCase().includes("mineral") ? "mineral" : "rock";
      const { error: insertError } = await supabase.from("scan_history").insert({
        user_id: user.id,
        image_url: publicUrl,
        identified_as: scanResult.name,
        item_type: normalizedType,
        confidence: Math.round(scanResult.confidence * 100),
        notes: scanResult.description,
      });

      if (insertError) throw insertError;

      toast.success("Saved to collection");
      fetchSavedScans();
      handleReset();
    } catch (error) {
      console.error("Error saving scan:", error);
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
      console.error("Error deleting scan:", error);
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
        <div className="space-y-6">
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold">AI Scanner</h1>
            <p className="text-muted-foreground">
              Identify rocks and minerals with AI
            </p>
          </div>

          {!scannedImage && !isScanning && (
            <div className="space-y-4 animate-fade-in">
              <Button
                size="lg"
                onClick={() => setShowCamera(true)}
                className="w-full hover-scale transition-all duration-300"
              >
                <Camera className="mr-2 h-5 w-5" />
                Open Camera
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleGallerySelect}
                className="w-full hover-scale transition-all duration-300"
              >
                <ImageIcon className="mr-2 h-5 w-5" />
                Choose from Gallery
              </Button>
            </div>
          )}

          {isScanning && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-fade-in">
              <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-lg font-medium animate-pulse">Analyzing specimen...</p>
              <p className="text-sm text-muted-foreground">AI is identifying the geological specimen</p>
            </div>
          )}

          {scannedImage && scanResult && !isScanning && (
            <div className="animate-scale-in">
              <ScanResults
                imageData={scannedImage}
                result={scanResult}
                onBack={handleReset}
                onSave={handleSave}
                isSaving={isSaving}
              />
            </div>
          )}

          {/* Recent Scans Thumbnail Gallery */}
          {!scannedImage && !isScanning && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Recent Scans</h2>
                {savedScans.length > 0 && (
                  <span className="text-sm text-muted-foreground">{savedScans.length} scans</span>
                )}
              </div>
              
              {isLoading ? (
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="aspect-square bg-muted rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : savedScans.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="py-8 text-center">
                    <Camera className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No scans yet. Start scanning to build your collection!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {savedScans.slice(0, 12).map((scan, index) => (
                    <div
                      key={scan.id}
                      className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group hover-scale transition-all duration-200"
                      style={{ animationDelay: `${index * 50}ms` }}
                      onClick={() => openScanDetail(scan)}
                    >
                      <img
                        src={scan.image_url}
                        alt={scan.identified_as}
                        className="w-full h-full object-cover"
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-1">
                        <span className="text-white text-[10px] font-medium text-center line-clamp-2 leading-tight">
                          {scan.identified_as}
                        </span>
                        {scan.confidence && (
                          <span className="text-white/80 text-[9px] mt-0.5">
                            {scan.confidence}%
                          </span>
                        )}
                      </div>
                      {/* Type badge */}
                      <div className="absolute top-1 right-1">
                        <div className={`w-2 h-2 rounded-full ${scan.item_type === 'mineral' ? 'bg-blue-400' : 'bg-amber-500'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* View All Button */}
              {savedScans.length > 12 && (
                <Button variant="ghost" className="w-full text-sm" onClick={() => {}}>
                  View all {savedScans.length} scans
                </Button>
              )}
            </div>
          )}

          {/* Scan Detail Dialog with Swipe Navigation */}
          <Dialog open={selectedScanIndex !== null} onOpenChange={(open) => !open && closeScanDetail()}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-0">
              {selectedScan && (
                <div {...swipeHandlers} className="touch-pan-y">
                  <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="flex items-center gap-2">
                      {selectedScan.identified_as}
                      <Badge variant="secondary">{selectedScan.item_type}</Badge>
                    </DialogTitle>
                    {/* Navigation indicator */}
                    <div className="flex items-center justify-center gap-2 pt-2">
                      <span className="text-xs text-muted-foreground">
                        {(selectedScanIndex ?? 0) + 1} of {savedScans.length}
                      </span>
                    </div>
                  </DialogHeader>
                  
                  <div className="relative">
                    {/* Navigation arrows */}
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
                      {/* Action buttons */}
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
                    
                    {/* Swipe hint */}
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
