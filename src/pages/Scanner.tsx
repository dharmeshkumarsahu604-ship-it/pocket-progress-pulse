import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { CameraInterface } from "@/components/scanner/CameraInterface";
import { ScanResults } from "@/components/scanner/ScanResults";
import { Camera, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export default function Scanner() {
  const [showCamera, setShowCamera] = useState(false);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [savedScans, setSavedScans] = useLocalStorage<any[]>("saved-scans", []);

  const handleCapture = async (imageData: string) => {
    setScannedImage(imageData);
    setShowCamera(false);
    setIsScanning(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/identify-specimen`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            imageBase64: imageData,
          }),
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

      if (!response.ok) {
        throw new Error("Failed to identify specimen");
      }

      const result = await response.json();
      
      // Transform the result to match the expected format
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
        setScannedImage(imageData);
        setIsScanning(true);

        try {
          const response = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/identify-specimen`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
              },
              body: JSON.stringify({
                imageBase64: imageData,
              }),
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
      reader.readAsDataURL(file);
    };

    input.click();
  };

  const handleSave = () => {
    const scan = {
      id: Date.now().toString(),
      image: scannedImage,
      result: scanResult,
      date: new Date().toISOString(),
    };
    setSavedScans((prev) => [scan, ...prev]);
    toast.success("Saved to collection");
    handleReset();
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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">AI Scanner</h1>
          <p className="text-muted-foreground">
            Identify rocks and minerals with AI
          </p>
        </div>

        {!scannedImage && !isScanning && (
          <div className="space-y-4">
            <Button
              size="lg"
              onClick={() => setShowCamera(true)}
              className="w-full"
            >
              <Camera className="mr-2 h-5 w-5" />
              Open Camera
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleGallerySelect}
              className="w-full"
            >
              <ImageIcon className="mr-2 h-5 w-5" />
              Choose from Gallery
            </Button>
          </div>
        )}

        {isScanning && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-lg font-medium">Analyzing specimen...</p>
            <p className="text-sm text-muted-foreground">AI is identifying the geological specimen</p>
          </div>
        )}

        {scannedImage && scanResult && !isScanning && (
          <ScanResults
            imageData={scannedImage}
            result={scanResult}
            onBack={handleReset}
            onSave={handleSave}
          />
        )}
      </div>
    </AppLayout>
  );
}
