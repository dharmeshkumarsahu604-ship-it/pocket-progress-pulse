import { useEffect } from "react";
import { useCamera } from "@/hooks/useCamera";
import { Button } from "@/components/ui/button";
import { Camera, FlipHorizontal, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CameraInterfaceProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
}

export const CameraInterface = ({ onCapture, onClose }: CameraInterfaceProps) => {
  const { videoRef, isActive, error, startCamera, stopCamera, captureImage } = useCamera();

  useEffect(() => {
    startCamera();
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCapture = () => {
    const imageData = captureImage();
    if (imageData) {
      onCapture(imageData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background animate-fade-in">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border animate-slide-in-right">
          <h2 className="text-lg font-semibold">Camera</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="hover-scale transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Camera View */}
        <div className="flex-1 relative bg-black">
          {error ? (
            <div className="absolute inset-0 flex items-center justify-center p-4 animate-scale-in">
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover animate-fade-in"
            />
          )}

          {/* Camera Grid Overlay */}
          {isActive && (
            <div className="absolute inset-0 pointer-events-none animate-fade-in">
              <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                {[...Array(9)].map((_, i) => (
                  <div 
                    key={i} 
                    className="border border-white/20 transition-all duration-300"
                    style={{
                      animationDelay: `${i * 50}ms`
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-6 border-t border-border animate-slide-in-right" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-center gap-8">
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 hover-scale transition-all duration-200"
              disabled={!isActive}
            >
              <FlipHorizontal className="h-5 w-5" />
            </Button>

            <Button
              size="icon"
              className="h-16 w-16 rounded-full animate-pulse hover:animate-none hover:scale-110 transition-all duration-300"
              onClick={handleCapture}
              disabled={!isActive}
            >
              <Camera className="h-8 w-8" />
            </Button>

            <div className="h-12 w-12" /> {/* Spacer for symmetry */}
          </div>
        </div>
      </div>
    </div>
  );
};
