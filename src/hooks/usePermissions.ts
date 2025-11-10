import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export type PermissionType = 'camera' | 'microphone' | 'geolocation' | 'storage';

export type PermissionStatus = 'granted' | 'denied' | 'prompt' | 'unsupported';

interface PermissionState {
  status: PermissionStatus;
  error: string | null;
}

export const usePermissions = () => {
  const [permissions, setPermissions] = useState<Record<PermissionType, PermissionState>>({
    camera: { status: 'prompt', error: null },
    microphone: { status: 'prompt', error: null },
    geolocation: { status: 'prompt', error: null },
    storage: { status: 'granted', error: null }, // Web storage is always available
  });

  const checkPermission = useCallback(async (type: PermissionType): Promise<PermissionStatus> => {
    try {
      if (type === 'storage') {
        return 'granted'; // Web storage doesn't require explicit permission
      }

      if (!navigator.permissions) {
        return 'unsupported';
      }

      const permissionName = type === 'geolocation' ? 'geolocation' : type;
      const result = await navigator.permissions.query({ name: permissionName as PermissionName });
      
      setPermissions(prev => ({
        ...prev,
        [type]: { status: result.state as PermissionStatus, error: null }
      }));

      return result.state as PermissionStatus;
    } catch (error) {
      console.warn(`Permission check for ${type} not supported:`, error);
      return 'prompt';
    }
  }, []);

  const requestCameraPermission = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      // Stop the stream immediately after getting permission
      stream.getTracks().forEach(track => track.stop());
      
      setPermissions(prev => ({
        ...prev,
        camera: { status: 'granted', error: null }
      }));
      
      toast.success('Camera access granted');
      return true;
    } catch (error: any) {
      const errorMessage = error.name === 'NotAllowedError' 
        ? 'Camera permission denied. Please enable camera access in your browser settings.'
        : 'Camera not available. Please check your device settings.';
      
      setPermissions(prev => ({
        ...prev,
        camera: { status: 'denied', error: errorMessage }
      }));
      
      toast.error(errorMessage);
      return false;
    }
  }, []);

  const requestMicrophonePermission = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Stop the stream immediately after getting permission
      stream.getTracks().forEach(track => track.stop());
      
      setPermissions(prev => ({
        ...prev,
        microphone: { status: 'granted', error: null }
      }));
      
      toast.success('Microphone access granted');
      return true;
    } catch (error: any) {
      const errorMessage = error.name === 'NotAllowedError'
        ? 'Microphone permission denied. Please enable microphone access in your browser settings.'
        : 'Microphone not available. Please check your device settings.';
      
      setPermissions(prev => ({
        ...prev,
        microphone: { status: 'denied', error: errorMessage }
      }));
      
      toast.error(errorMessage);
      return false;
    }
  }, []);

  const requestGeolocationPermission = useCallback(async (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        const errorMessage = 'Geolocation is not supported by your browser';
        setPermissions(prev => ({
          ...prev,
          geolocation: { status: 'unsupported', error: errorMessage }
        }));
        toast.error(errorMessage);
        resolve(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        () => {
          setPermissions(prev => ({
            ...prev,
            geolocation: { status: 'granted', error: null }
          }));
          toast.success('Location access granted');
          resolve(true);
        },
        (error) => {
          const errorMessage = error.code === error.PERMISSION_DENIED
            ? 'Location permission denied. Please enable location access in your browser settings.'
            : 'Unable to retrieve your location. Please check your device settings.';
          
          setPermissions(prev => ({
            ...prev,
            geolocation: { status: 'denied', error: errorMessage }
          }));
          
          toast.error(errorMessage);
          resolve(false);
        }
      );
    });
  }, []);

  const requestPermission = useCallback(async (type: PermissionType): Promise<boolean> => {
    switch (type) {
      case 'camera':
        return requestCameraPermission();
      case 'microphone':
        return requestMicrophonePermission();
      case 'geolocation':
        return requestGeolocationPermission();
      case 'storage':
        return true; // Always granted for web storage
      default:
        return false;
    }
  }, [requestCameraPermission, requestMicrophonePermission, requestGeolocationPermission]);

  const requestMultiplePermissions = useCallback(async (types: PermissionType[]): Promise<Record<PermissionType, boolean>> => {
    const results: Record<string, boolean> = {};
    
    for (const type of types) {
      results[type] = await requestPermission(type);
    }
    
    return results as Record<PermissionType, boolean>;
  }, [requestPermission]);

  return {
    permissions,
    checkPermission,
    requestPermission,
    requestMultiplePermissions,
  };
};
