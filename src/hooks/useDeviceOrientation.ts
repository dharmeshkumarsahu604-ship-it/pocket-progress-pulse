import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface DeviceOrientationState {
  alpha: number | null; // Compass heading (0-360)
  beta: number | null;  // Front-to-back tilt (-180 to 180)
  gamma: number | null; // Left-to-right tilt (-90 to 90)
  absolute: boolean;
  accuracy: 'low' | 'medium' | 'high' | 'unknown';
  isCalibrated: boolean;
  isSupported: boolean;
  permissionGranted: boolean;
  error: string | null;
}

interface UseDeviceOrientationOptions {
  magneticDeclination?: number;
  useTrueNorth?: boolean;
  smoothingFactor?: number;
}

// Low-pass filter for smoothing sensor data
const applySmoothing = (
  currentValue: number | null,
  previousValue: number | null,
  factor: number
): number | null => {
  if (currentValue === null) return previousValue;
  if (previousValue === null) return currentValue;
  
  // Handle the 360/0 wrap-around for compass headings
  let diff = currentValue - previousValue;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  
  return (previousValue + diff * factor + 360) % 360;
};

// Calculate accuracy based on sensor variance
const calculateAccuracy = (readings: number[]): 'low' | 'medium' | 'high' | 'unknown' => {
  if (readings.length < 5) return 'unknown';
  
  const mean = readings.reduce((a, b) => a + b, 0) / readings.length;
  const variance = readings.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / readings.length;
  const stdDev = Math.sqrt(variance);
  
  if (stdDev < 2) return 'high';
  if (stdDev < 8) return 'medium';
  return 'low';
};

export const useDeviceOrientation = (options: UseDeviceOrientationOptions = {}) => {
  const {
    magneticDeclination = 0,
    useTrueNorth = false,
    smoothingFactor = 0.3,
  } = options;

  const [state, setState] = useState<DeviceOrientationState>({
    alpha: null,
    beta: null,
    gamma: null,
    absolute: false,
    accuracy: 'unknown',
    isCalibrated: false,
    isSupported: false,
    permissionGranted: false,
    error: null,
  });

  const previousAlpha = useRef<number | null>(null);
  const alphaReadings = useRef<number[]>([]);
  const lastCalibrationCheck = useRef<number>(0);

  // Request permission for iOS 13+
  const requestPermission = useCallback(async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === 'granted') {
          setState(prev => ({ ...prev, permissionGranted: true }));
          return true;
        } else {
          setState(prev => ({ 
            ...prev, 
            error: 'Permission denied. Please enable motion sensors in Settings.' 
          }));
          return false;
        }
      } catch (error) {
        setState(prev => ({ 
          ...prev, 
          error: 'Failed to request permission for motion sensors.' 
        }));
        return false;
      }
    }
    // Permission not required (Android, older iOS)
    setState(prev => ({ ...prev, permissionGranted: true }));
    return true;
  }, []);

  // Handle orientation events
  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    let alpha = event.alpha;
    
    // Apply smoothing
    alpha = applySmoothing(alpha, previousAlpha.current, smoothingFactor);
    previousAlpha.current = alpha;

    // Track readings for accuracy calculation
    if (alpha !== null) {
      alphaReadings.current.push(alpha);
      if (alphaReadings.current.length > 20) {
        alphaReadings.current.shift();
      }
    }

    // Calculate accuracy periodically
    const now = Date.now();
    let accuracy = state.accuracy;
    if (now - lastCalibrationCheck.current > 500) {
      accuracy = calculateAccuracy(alphaReadings.current);
      lastCalibrationCheck.current = now;
    }

    // Apply magnetic declination for true north
    let adjustedAlpha = alpha;
    if (adjustedAlpha !== null && useTrueNorth) {
      adjustedAlpha = (adjustedAlpha + magneticDeclination + 360) % 360;
    }

    setState(prev => ({
      ...prev,
      alpha: adjustedAlpha !== null ? Math.round(adjustedAlpha * 10) / 10 : null,
      beta: event.beta !== null ? Math.round(event.beta * 10) / 10 : null,
      gamma: event.gamma !== null ? Math.round(event.gamma * 10) / 10 : null,
      absolute: event.absolute,
      accuracy,
      isCalibrated: accuracy !== 'low' && accuracy !== 'unknown',
    }));
  }, [magneticDeclination, useTrueNorth, smoothingFactor, state.accuracy]);

  // Initialize sensor
  useEffect(() => {
    // Check if DeviceOrientationEvent is supported
    if (!('DeviceOrientationEvent' in window)) {
      setState(prev => ({
        ...prev,
        isSupported: false,
        error: 'Device orientation not supported on this device.',
      }));
      return;
    }

    setState(prev => ({ ...prev, isSupported: true }));
  }, []);

  // Start listening to orientation events
  const startListening = useCallback(async () => {
    if (!state.isSupported) {
      toast.error('Device orientation not supported');
      return false;
    }

    const hasPermission = await requestPermission();
    if (!hasPermission) {
      toast.error('Permission required for compass');
      return false;
    }

    window.addEventListener('deviceorientation', handleOrientation, true);
    toast.success('Compass activated');
    return true;
  }, [state.isSupported, requestPermission, handleOrientation]);

  // Stop listening
  const stopListening = useCallback(() => {
    window.removeEventListener('deviceorientation', handleOrientation, true);
    previousAlpha.current = null;
    alphaReadings.current = [];
  }, [handleOrientation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [handleOrientation]);

  // Simulate compass for demo/desktop
  const simulateCompass = useCallback((heading: number) => {
    setState(prev => ({
      ...prev,
      alpha: heading,
      beta: 0,
      gamma: 0,
      absolute: true,
      accuracy: 'high',
      isCalibrated: true,
      isSupported: true,
      permissionGranted: true,
    }));
  }, []);

  return {
    ...state,
    startListening,
    stopListening,
    requestPermission,
    simulateCompass,
    heading: state.alpha,
    tilt: { pitch: state.beta, roll: state.gamma },
  };
};
