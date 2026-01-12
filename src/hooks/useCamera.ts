import { useState, useRef, useCallback } from "react";

export const useCamera = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flashOn, setFlashOn] = useState(false);
  const [flashSupported, setFlashSupported] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const trackRef = useRef<MediaStreamTrack | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: 1920, height: 1080 },
        audio: false,
      });
      setStream(mediaStream);
      setIsActive(true);
      setError(null);
      
      // Store track reference for flash control
      const videoTrack = mediaStream.getVideoTracks()[0];
      trackRef.current = videoTrack;
      
      // Check if flash/torch is supported
      if (videoTrack) {
        const capabilities = videoTrack.getCapabilities() as MediaTrackCapabilities & { torch?: boolean };
        setFlashSupported(capabilities.torch === true);
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError("Failed to access camera. Please grant camera permissions.");
      console.error("Camera error:", err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    // Turn off flash before stopping
    if (trackRef.current && flashOn) {
      trackRef.current.applyConstraints({
        advanced: [{ torch: false } as MediaTrackConstraintSet]
      }).catch(() => {});
    }
    
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setStream(null);
    setIsActive(false);
    setFlashOn(false);
    trackRef.current = null;
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [stream, flashOn]);

  const toggleFlash = useCallback(async () => {
    if (!trackRef.current) {
      console.warn("No video track available for flash control");
      return false;
    }

    const capabilities = trackRef.current.getCapabilities() as MediaTrackCapabilities & { torch?: boolean };
    
    if (!capabilities.torch) {
      console.warn("Flash/torch not supported on this device");
      return false;
    }

    const newFlashState = !flashOn;
    
    try {
      await trackRef.current.applyConstraints({
        advanced: [{ torch: newFlashState } as MediaTrackConstraintSet]
      });
      setFlashOn(newFlashState);
      return true;
    } catch (err) {
      console.error("Failed to toggle flash:", err);
      return false;
    }
  }, [flashOn]);

  const captureImage = useCallback(() => {
    if (!videoRef.current || !isActive) return null;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    const context = canvas.getContext("2d");
    if (!context) return null;

    context.drawImage(videoRef.current, 0, 0);
    return canvas.toDataURL("image/jpeg", 0.95);
  }, [isActive]);

  return {
    videoRef,
    isActive,
    error,
    flashOn,
    flashSupported,
    startCamera,
    stopCamera,
    captureImage,
    toggleFlash,
  };
};
