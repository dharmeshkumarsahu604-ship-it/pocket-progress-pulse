import { useEffect } from "react";
import { useCamera } from "@/hooks/useCamera";
import { Button } from "@/components/ui/button";
import { Camera, FlipHorizontal, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface CameraInterfaceProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
}

export const CameraInterface = ({ onCapture, onClose }: CameraInterfaceProps) => {
  const { 
    videoRef, 
    isActive, 
    error, 
    flashOn, 
    flashSupported, 
    startCamera, 
    stopCamera, 
    captureImage,
    setFlash 
  } = useCamera();

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

  const handleFlashOn = async () => {
    const success = await setFlash(true);
    if (!success && !flashSupported) {
      toast.error("Flash not supported on this device");
    }
  };

  const handleFlashOff = async () => {
    await setFlash(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background animate-fade-in">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border animate-slide-in-right">
          <h2 className="text-lg font-semibold">Camera</h2>
          <div className="flex items-center gap-2">
            {/* Flash ON Button */}
            <Button 
              variant={flashOn ? "default" : "outline"} 
              size="sm" 
              onClick={handleFlashOn}
              disabled={!isActive}
              className={`hover-scale transition-all duration-200 ${flashOn ? 'bg-warning text-warning-foreground hover:bg-warning/90' : ''}`}
              title="Turn on flash"
            >
              🔦 Flash ON
            </Button>
            {/* Flash OFF Button */}
            <Button 
              variant={!flashOn ? "default" : "outline"} 
              size="sm" 
              onClick={handleFlashOff}
              disabled={!isActive}
              className="hover-scale transition-all duration-200"
              title="Turn off flash"
            >
              ❌ Flash OFF
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="hover-scale transition-all duration-200"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
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

          {/* Flash indicator */}
          {flashOn && isActive && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-warning/90 text-warning-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 animate-fade-in">
              🔦 Flash On
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-6 border-t border-border animate-slide-in-right" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-center gap-4">
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

            {/* Flash buttons in controls area */}
            <div className="flex flex-col gap-1">
              <Button
                variant={flashOn ? "default" : "outline"}
                size="sm"
                className={`h-6 text-xs hover-scale transition-all duration-200 ${flashOn ? 'bg-warning text-warning-foreground hover:bg-warning/90' : ''}`}
                onClick={handleFlashOn}
                disabled={!isActive}
              >
                🔦 ON
              </Button>
              <Button
                variant={!flashOn ? "default" : "outline"}
                size="sm"
                className="h-6 text-xs hover-scale transition-all duration-200"
                onClick={handleFlashOff}
                disabled={!isActive}
              >
                ❌ OFF
              </Button>
            </div>
          </div>
          
          {/* Flash support indicator */}
          {isActive && !flashSupported && (
            <p className="text-xs text-muted-foreground text-center mt-3">
              Flash not available on this device
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
