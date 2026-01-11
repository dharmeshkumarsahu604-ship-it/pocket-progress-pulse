import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';

// ============= TYPES =============
export type MeasurementMode = 'strike' | 'dip' | 'strike_dip' | 'trend_plunge' | 'bearing' | 'clinometer';
export type SensorAccuracy = 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN';

export interface CompassState {
  // Raw sensor values
  headingDeg: number;
  pitchDeg: number;
  rollDeg: number;
  
  // Calculated measurements
  strikeDeg: number | null;
  dipDeg: number | null;
  dipDirectionDeg: number | null;
  trendDeg: number | null;
  plungeDeg: number | null;
  bearingDeg: number | null;
  
  // Settings
  declinationDeg: number;
  useTrueNorth: boolean;
  
  // State
  isLocked: boolean;
  sensorAccuracy: SensorAccuracy;
  activeMode: MeasurementMode;
  
  // Status
  isSupported: boolean;
  permissionGranted: boolean;
  isListening: boolean;
  isDemoMode: boolean;
  error: string | null;
}

export interface SavedReading {
  id: string;
  mode: MeasurementMode;
  heading: number;
  strike: number | null;
  dip: number | null;
  dipDirection: number | null;
  trend: number | null;
  plunge: number | null;
  bearing: number | null;
  declination: number;
  timestamp: Date;
  latitude: number | null;
  longitude: number | null;
  notes: string;
  lithology: string;
  structureType: string;
  photos: string[];
}

// ============= CONSTANTS =============
const SMOOTHING_FACTOR = 0.15;
const ACCURACY_WINDOW_SIZE = 30;
const ACCURACY_HIGH_THRESHOLD = 2;
const ACCURACY_MEDIUM_THRESHOLD = 8;
const STRIKE_PITCH_THRESHOLD = 5; // degrees - device must be nearly level to take strike

// ============= UTILITY FUNCTIONS =============
const normalizeAngle = (angle: number): number => {
  return ((angle % 360) + 360) % 360;
};

const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

const toDegrees = (radians: number): number => {
  return radians * (180 / Math.PI);
};

// Low-pass filter with wrap-around handling for compass headings
const smoothAngle = (
  current: number | null,
  previous: number | null,
  factor: number
): number => {
  if (current === null) return previous ?? 0;
  if (previous === null) return current;
  
  let diff = current - previous;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  
  return normalizeAngle(previous + diff * factor);
};

// Calculate standard deviation for accuracy assessment
const calculateStdDev = (values: number[]): number => {
  if (values.length < 2) return Infinity;
  
  // Handle wrap-around for compass readings
  const sin = values.reduce((sum, v) => sum + Math.sin(toRadians(v)), 0) / values.length;
  const cos = values.reduce((sum, v) => sum + Math.cos(toRadians(v)), 0) / values.length;
  const meanAngle = toDegrees(Math.atan2(sin, cos));
  
  const squaredDiffs = values.map(v => {
    let diff = v - meanAngle;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    return diff * diff;
  });
  
  return Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / values.length);
};

// ============= MAIN HOOK =============
export const useBruntonCompass = () => {
  // ---- State ----
  const [state, setState] = useState<CompassState>({
    headingDeg: 0,
    pitchDeg: 0,
    rollDeg: 0,
    strikeDeg: null,
    dipDeg: null,
    dipDirectionDeg: null,
    trendDeg: null,
    plungeDeg: null,
    bearingDeg: null,
    declinationDeg: 0,
    useTrueNorth: true,
    isLocked: false,
    sensorAccuracy: 'UNKNOWN',
    activeMode: 'strike_dip',
    isSupported: false,
    permissionGranted: false,
    isListening: false,
    isDemoMode: false,
    error: null,
  });

  const [savedReadings, setSavedReadings] = useState<SavedReading[]>([]);
  const [location, setLocation] = useState<{ lat: number | null; lon: number | null }>({
    lat: null,
    lon: null,
  });

  // ---- Refs for sensor processing ----
  const previousHeading = useRef<number | null>(null);
  const previousPitch = useRef<number | null>(null);
  const previousRoll = useRef<number | null>(null);
  const headingHistory = useRef<number[]>([]);
  const lastAccuracyCheck = useRef<number>(0);
  const orientationHandler = useRef<((e: DeviceOrientationEvent) => void) | null>(null);
  const absoluteOrientationHandler = useRef<((e: DeviceOrientationEvent) => void) | null>(null);
  const hasAbsoluteSupport = useRef<boolean>(false);

  // ---- Permission & Initialization ----
  const checkSupport = useCallback(() => {
    const supported = 'DeviceOrientationEvent' in window;
    setState(prev => ({ ...prev, isSupported: supported }));
    return supported;
  }, []);

  const requestMotionPermission = useCallback(async (): Promise<boolean> => {
    // Check for iOS 13+ permission requirement
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === 'granted') {
          setState(prev => ({ ...prev, permissionGranted: true, error: null }));
          return true;
        } else {
          setState(prev => ({
            ...prev,
            permissionGranted: false,
            sensorAccuracy: 'LOW',
            error: 'Motion sensor permission denied',
          }));
          return false;
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: 'Failed to request motion permission',
          sensorAccuracy: 'LOW',
        }));
        return false;
      }
    }
    
    // Android/older iOS - permission not required
    setState(prev => ({ ...prev, permissionGranted: true }));
    return true;
  }, []);

  const requestLocationPermission = useCallback(async (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          resolve(true);
        },
        () => {
          resolve(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }, []);

  const checkHttps = useCallback((): boolean => {
    const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
    if (!isSecure) {
      setState(prev => ({
        ...prev,
        error: 'HTTPS required for sensor access',
        sensorAccuracy: 'LOW',
      }));
    }
    return isSecure;
  }, []);

  // ---- Tilt-Compensated Heading Calculation ----
  const calculateTiltCompensatedHeading = useCallback((
    rawHeading: number,
    pitch: number,
    roll: number
  ): number => {
    // Convert to radians
    const pitchRad = toRadians(pitch);
    const rollRad = toRadians(roll);
    
    // Apply tilt compensation
    // This accounts for the effect of device tilt on the compass reading
    const compensation = Math.sin(rollRad) * Math.tan(pitchRad);
    const compensatedHeading = rawHeading + toDegrees(compensation);
    
    return normalizeAngle(compensatedHeading);
  }, []);

  // ---- Device Orientation Handler ----
  // Calculate heading using atan2 for better magnetometer accuracy
  const calculateMagnetometerHeading = useCallback((alpha: number, beta: number, gamma: number): number => {
    // Use atan2 on magnetometer values for more accurate heading
    let heading = Math.atan2(gamma, beta);
    heading = heading * (180 / Math.PI);
    heading = (heading + 360) % 360;
    // Fix inverted direction
    heading = 360 - heading;
    return heading;
  }, []);

  const handleOrientation = useCallback((event: DeviceOrientationEvent, useAbsolute: boolean = false) => {
    // Skip updates if locked
    setState(prev => {
      if (prev.isLocked) return prev;

      // Get raw values
      let rawAlpha = event.alpha ?? 0;
      const rawBeta = event.beta ?? 0;
      const rawGamma = event.gamma ?? 0;

      // Apply smoothing
      const smoothedAlpha = smoothAngle(rawAlpha, previousHeading.current, SMOOTHING_FACTOR);
      const smoothedBeta = previousPitch.current !== null
        ? previousPitch.current + (rawBeta - previousPitch.current) * SMOOTHING_FACTOR
        : rawBeta;
      const smoothedGamma = previousRoll.current !== null
        ? previousRoll.current + (rawGamma - previousRoll.current) * SMOOTHING_FACTOR
        : rawGamma;

      // Update refs
      previousHeading.current = smoothedAlpha;
      previousPitch.current = smoothedBeta;
      previousRoll.current = smoothedGamma;

      let heading: number;
      
      if (useAbsolute || hasAbsoluteSupport.current) {
        // Use improved magnetometer-based heading calculation
        heading = calculateMagnetometerHeading(smoothedAlpha, smoothedBeta, smoothedGamma);
        // Apply smoothing to the calculated heading
        heading = smoothAngle(heading, previousHeading.current, SMOOTHING_FACTOR);
      } else {
        // Apply tilt compensation for fallback
        heading = calculateTiltCompensatedHeading(smoothedAlpha, smoothedBeta, smoothedGamma);
      }
      
      // Apply magnetic declination for true north
      if (prev.useTrueNorth) {
        heading = normalizeAngle(heading + prev.declinationDeg);
      }

      // Track heading history for accuracy calculation
      headingHistory.current.push(heading);
      if (headingHistory.current.length > ACCURACY_WINDOW_SIZE) {
        headingHistory.current.shift();
      }

      // Calculate accuracy periodically
      let accuracy = prev.sensorAccuracy;
      const now = Date.now();
      if (now - lastAccuracyCheck.current > 500) {
        const stdDev = calculateStdDev(headingHistory.current);
        if (stdDev < ACCURACY_HIGH_THRESHOLD) {
          accuracy = 'HIGH';
        } else if (stdDev < ACCURACY_MEDIUM_THRESHOLD) {
          accuracy = 'MEDIUM';
        } else {
          accuracy = 'LOW';
        }
        lastAccuracyCheck.current = now;
      }

      return {
        ...prev,
        headingDeg: Math.round(heading * 10) / 10,
        pitchDeg: Math.round(smoothedBeta * 10) / 10,
        rollDeg: Math.round(smoothedGamma * 10) / 10,
        sensorAccuracy: accuracy,
      };
    });
  }, [calculateTiltCompensatedHeading, calculateMagnetometerHeading]);

  // ---- Start/Stop Listening ----
  const startListening = useCallback(async () => {
    if (!checkSupport()) {
      setState(prev => ({ ...prev, isDemoMode: true, error: 'Device sensors not supported' }));
      toast.error('Device sensors not supported. Demo mode enabled.');
      return false;
    }

    if (!checkHttps()) {
      toast.error('HTTPS required for sensor access');
      return false;
    }

    const hasMotionPermission = await requestMotionPermission();
    if (!hasMotionPermission) {
      setState(prev => ({ ...prev, isDemoMode: true }));
      toast.error('Motion sensor permission denied. Demo mode enabled.');
      return false;
    }

    // Request location in background
    requestLocationPermission();

    // Create handlers
    const fallbackHandler = (e: DeviceOrientationEvent) => handleOrientation(e, false);
    const absoluteHandler = (e: DeviceOrientationEvent) => {
      hasAbsoluteSupport.current = true;
      // Remove fallback listener once absolute is available
      if (orientationHandler.current) {
        window.removeEventListener('deviceorientation', orientationHandler.current, true);
        orientationHandler.current = null;
      }
      handleOrientation(e, true);
    };

    // Try to use deviceorientationabsolute first (more accurate magnetometer)
    if ('ondeviceorientationabsolute' in window) {
      absoluteOrientationHandler.current = absoluteHandler;
      window.addEventListener('deviceorientationabsolute', absoluteHandler as EventListener, true);
    }

    // Also listen to regular deviceorientation as fallback
    orientationHandler.current = fallbackHandler;
    window.addEventListener('deviceorientation', fallbackHandler, true);

    setState(prev => ({ ...prev, isListening: true, isDemoMode: false, error: null }));
    toast.success('Compass sensors activated');
    return true;
  }, [checkSupport, checkHttps, requestMotionPermission, requestLocationPermission, handleOrientation]);

  const stopListening = useCallback(() => {
    if (orientationHandler.current) {
      window.removeEventListener('deviceorientation', orientationHandler.current, true);
      orientationHandler.current = null;
    }
    if (absoluteOrientationHandler.current) {
      window.removeEventListener('deviceorientationabsolute', absoluteOrientationHandler.current as EventListener, true);
      absoluteOrientationHandler.current = null;
    }
    
    previousHeading.current = null;
    previousPitch.current = null;
    previousRoll.current = null;
    headingHistory.current = [];
    hasAbsoluteSupport.current = false;
    
    setState(prev => ({ ...prev, isListening: false }));
  }, []);

  // ---- Demo Mode ----
  const enableDemoMode = useCallback(() => {
    stopListening();
    setState(prev => ({
      ...prev,
      isDemoMode: true,
      sensorAccuracy: 'HIGH',
      isSupported: true,
      permissionGranted: true,
    }));
  }, [stopListening]);

  const simulateSensorValues = useCallback((heading: number, pitch: number, roll: number) => {
    setState(prev => {
      if (!prev.isDemoMode || prev.isLocked) return prev;
      return {
        ...prev,
        headingDeg: normalizeAngle(heading),
        pitchDeg: Math.max(-90, Math.min(90, pitch)),
        rollDeg: Math.max(-90, Math.min(90, roll)),
      };
    });
  }, []);

  // ---- Mode Management ----
  const setActiveMode = useCallback((mode: MeasurementMode) => {
    setState(prev => ({ ...prev, activeMode: mode }));
  }, []);

  // ---- Lock Reading ----
  const lockReading = useCallback(() => {
    setState(prev => {
      if (prev.isDemoMode && !prev.isSupported) {
        toast.error('Cannot lock readings in demo mode without sensors');
        return prev;
      }

      const heading = Math.round(prev.headingDeg);
      const pitch = Math.abs(prev.pitchDeg);
      const clampedDip = Math.min(90, Math.round(pitch));

      let newState = { ...prev, isLocked: true };

      switch (prev.activeMode) {
        case 'strike':
          if (pitch < STRIKE_PITCH_THRESHOLD) {
            newState.strikeDeg = heading;
          } else {
            toast.warning('Device must be nearly level to measure strike');
            return prev;
          }
          break;

        case 'dip':
          newState.dipDeg = clampedDip;
          if (prev.strikeDeg !== null) {
            newState.dipDirectionDeg = normalizeAngle(prev.strikeDeg + 90);
          }
          break;

        case 'strike_dip':
          newState.strikeDeg = heading;
          newState.dipDeg = clampedDip;
          newState.dipDirectionDeg = normalizeAngle(heading + 90);
          break;

        case 'trend_plunge':
          newState.trendDeg = heading;
          newState.plungeDeg = clampedDip;
          break;

        case 'bearing':
          newState.bearingDeg = heading;
          break;

        case 'clinometer':
          newState.dipDeg = clampedDip;
          break;
      }

      toast.success('Reading locked!');
      return newState;
    });

    // Update location when locking
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        },
        () => {},
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, []);

  const unlockReading = useCallback(() => {
    setState(prev => ({ ...prev, isLocked: false }));
  }, []);

  // ---- Save Reading ----
  const saveReading = useCallback((notes: string = '', lithology: string = '', structureType: string = '', photos: string[] = []) => {
    const reading: SavedReading = {
      id: crypto.randomUUID(),
      mode: state.activeMode,
      heading: state.headingDeg,
      strike: state.strikeDeg,
      dip: state.dipDeg,
      dipDirection: state.dipDirectionDeg,
      trend: state.trendDeg,
      plunge: state.plungeDeg,
      bearing: state.bearingDeg,
      declination: state.declinationDeg,
      timestamp: new Date(),
      latitude: location.lat,
      longitude: location.lon,
      notes,
      lithology,
      structureType,
      photos,
    };

    setSavedReadings(prev => [reading, ...prev]);
    return reading;
  }, [state, location]);

  // ---- Delete Reading ----
  const deleteReading = useCallback((id: string) => {
    setSavedReadings(prev => prev.filter(r => r.id !== id));
  }, []);

  // ---- Adjust Locked Values ----
  const adjustValue = useCallback((field: 'strike' | 'dip' | 'trend' | 'plunge' | 'bearing', delta: number) => {
    setState(prev => {
      if (!prev.isLocked) return prev;

      const adjust = (val: number | null, max: number = 360): number | null => {
        if (val === null) return null;
        return normalizeAngle(val + delta) % (max + 1);
      };

      switch (field) {
        case 'strike':
          const newStrike = adjust(prev.strikeDeg);
          return {
            ...prev,
            strikeDeg: newStrike,
            dipDirectionDeg: newStrike !== null ? normalizeAngle(newStrike + 90) : null,
          };
        case 'dip':
          return { ...prev, dipDeg: Math.max(0, Math.min(90, (prev.dipDeg ?? 0) + delta)) };
        case 'trend':
          return { ...prev, trendDeg: adjust(prev.trendDeg) };
        case 'plunge':
          return { ...prev, plungeDeg: Math.max(0, Math.min(90, (prev.plungeDeg ?? 0) + delta)) };
        case 'bearing':
          return { ...prev, bearingDeg: adjust(prev.bearingDeg) };
        default:
          return prev;
      }
    });
  }, []);

  // ---- Reset ----
  const reset = useCallback(() => {
    setState(prev => ({
      ...prev,
      strikeDeg: null,
      dipDeg: null,
      dipDirectionDeg: null,
      trendDeg: null,
      plungeDeg: null,
      bearingDeg: null,
      isLocked: false,
    }));
  }, []);

  // ---- Declination ----
  const setDeclination = useCallback((value: number) => {
    setState(prev => ({ ...prev, declinationDeg: value }));
  }, []);

  const setUseTrueNorth = useCallback((value: boolean) => {
    setState(prev => ({ ...prev, useTrueNorth: value }));
  }, []);

  const autoDetectDeclination = useCallback(async () => {
    return new Promise<number>((resolve) => {
      if (!navigator.geolocation) {
        toast.error('Geolocation not available');
        resolve(0);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          // Simplified declination model for India region
          // Real implementation should use World Magnetic Model
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const baseDeclination = -1.5;
          const latFactor = (lat - 20) * 0.05;
          const lonFactor = (lon - 80) * 0.02;
          const declination = Math.round((baseDeclination + latFactor + lonFactor) * 10) / 10;
          
          setState(prev => ({ ...prev, declinationDeg: declination }));
          setLocation({ lat, lon });
          toast.success(`Declination auto-detected: ${declination}°`);
          resolve(declination);
        },
        () => {
          toast.error('Could not get location for declination');
          resolve(0);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }, []);

  // ---- Rose Diagram Data ----
  const getRoseDiagramData = useCallback(() => {
    const bins: Record<number, number> = {};
    
    // Initialize 36 bins (10° each)
    for (let i = 0; i < 36; i++) {
      bins[i * 10] = 0;
    }

    savedReadings.forEach(reading => {
      const angle = reading.strike ?? reading.trend ?? reading.heading;
      const bin = Math.floor(angle / 10) * 10;
      bins[bin] = (bins[bin] || 0) + 1;
    });

    return bins;
  }, [savedReadings]);

  // ---- Stereonet Data ----
  const getStereonetData = useCallback(() => {
    return savedReadings
      .filter(r => r.strike !== null && r.dip !== null)
      .map(reading => ({
        poleTrend: normalizeAngle((reading.strike ?? 0) + 90),
        polePlunge: 90 - (reading.dip ?? 0),
        type: reading.mode,
      }));
  }, [savedReadings]);

  // ---- Cleanup on unmount ----
  useEffect(() => {
    return () => {
      if (orientationHandler.current) {
        window.removeEventListener('deviceorientation', orientationHandler.current, true);
      }
    };
  }, []);

  // ---- Initialize on mount ----
  useEffect(() => {
    checkSupport();
  }, [checkSupport]);

  return {
    // State
    ...state,
    savedReadings,
    location,
    
    // Actions
    startListening,
    stopListening,
    enableDemoMode,
    simulateSensorValues,
    setActiveMode,
    lockReading,
    unlockReading,
    saveReading,
    deleteReading,
    adjustValue,
    reset,
    setDeclination,
    setUseTrueNorth,
    autoDetectDeclination,
    
    // Data getters
    getRoseDiagramData,
    getStereonetData,
    
    // Derived values
    clinometerAngle: Math.abs(state.pitchDeg),
    isLevel: Math.abs(state.pitchDeg) < 2 && Math.abs(state.rollDeg) < 2,
  };
};
