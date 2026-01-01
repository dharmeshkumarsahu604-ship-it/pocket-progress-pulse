import React, { useState, useEffect, useCallback } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { CompassDial } from '@/components/compass/CompassDial';
import { Clinometer } from '@/components/compass/Clinometer';
import { DualBubbleLevel } from '@/components/compass/BubbleLevel';
import { MeasurementPanel, MeasurementMode } from '@/components/compass/MeasurementPanel';
import { CalibrationOverlay } from '@/components/compass/CalibrationOverlay';
import { DeclinationInput } from '@/components/compass/DeclinationInput';
import { CompassReadingForm, CompassReadingData } from '@/components/compass/CompassReading';
import { HowToUseOverlay } from '@/components/compass/HowToUseOverlay';
import { RoseDiagram } from '@/components/compass/RoseDiagram';
import { Stereonet } from '@/components/compass/Stereonet';
import { ReadingsList } from '@/components/compass/ReadingsList';
import { useBruntonCompass } from '@/hooks/useBruntonCompass';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Settings, HelpCircle, Play, Pause, LogIn, AlertTriangle, Wifi, WifiOff, Signal } from 'lucide-react';
import { Link } from 'react-router-dom';

const Compass: React.FC = () => {
  // Use the production-ready Brunton compass hook
  const compass = useBruntonCompass();
  
  // UI state
  const [showCalibration, setShowCalibration] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);
  const [demoHeading, setDemoHeading] = useState(45);
  const [demoPitch, setDemoPitch] = useState(0);
  
  // Current reading being edited (for save form)
  const [currentReading, setCurrentReading] = useState<CompassReadingData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Readings from database
  const [dbReadings, setDbReadings] = useState<CompassReadingData[]>([]);
  
  // Auth
  const { user } = useAuth();

  // Demo mode rotation
  useEffect(() => {
    if (!compass.isDemoMode) return;
    const interval = setInterval(() => {
      setDemoHeading(prev => (prev + 0.5) % 360);
      compass.simulateSensorValues(demoHeading, demoPitch, 0);
    }, 50);
    return () => clearInterval(interval);
  }, [compass.isDemoMode, demoHeading, demoPitch, compass.simulateSensorValues]);

  // Start compass on mount
  useEffect(() => {
    const init = async () => {
      const started = await compass.startListening();
      if (!started) {
        compass.enableDemoMode();
      }
    };
    init();
    
    return () => {
      compass.stopListening();
    };
  }, []);

  // Load readings from database
  useEffect(() => {
    if (!user) return;
    
    const loadReadings = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('compass_readings')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const loadedReadings: CompassReadingData[] = (data || []).map((r) => ({
          id: r.id,
          mode: r.mode as MeasurementMode,
          strike: r.strike ? Number(r.strike) : null,
          dip: r.dip ? Number(r.dip) : null,
          trend: r.trend ? Number(r.trend) : null,
          plunge: r.plunge ? Number(r.plunge) : null,
          bearing: r.bearing ? Number(r.bearing) : null,
          azimuth: Number(r.azimuth),
          timestamp: new Date(r.created_at),
          latitude: r.latitude ? Number(r.latitude) : null,
          longitude: r.longitude ? Number(r.longitude) : null,
          notes: r.notes || '',
          photos: r.photos || [],
          lithology: r.lithology || '',
          structureType: r.structure_type || '',
        }));

        setDbReadings(loadedReadings);
      } catch (error) {
        console.error('Error loading readings:', error);
        toast.error('Failed to load saved readings');
      } finally {
        setIsLoading(false);
      }
    };

    loadReadings();
  }, [user]);

  // Lock reading and prepare for saving
  const handleLock = useCallback(() => {
    compass.lockReading();
    
    // Prepare current reading for the save form
    setCurrentReading({
      mode: compass.activeMode,
      strike: compass.strikeDeg,
      dip: compass.dipDeg,
      trend: compass.trendDeg,
      plunge: compass.plungeDeg,
      bearing: compass.bearingDeg,
      azimuth: compass.headingDeg,
      timestamp: new Date(),
      latitude: compass.location.lat,
      longitude: compass.location.lon,
      notes: '',
      photos: [],
      lithology: '',
      structureType: '',
    });
  }, [compass]);

  const handleUnlock = () => {
    compass.unlockReading();
    setCurrentReading(null);
  };

  const handleReset = () => {
    compass.reset();
    setCurrentReading(null);
  };

  const handleModeChange = (mode: MeasurementMode) => {
    compass.setActiveMode(mode);
    compass.reset();
  };

  const handleSaveReading = async () => {
    if (!currentReading) return;
    
    if (!user) {
      toast.error('Please sign in to save readings');
      return;
    }

    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('compass_readings')
        .insert({
          user_id: user.id,
          mode: currentReading.mode,
          strike: compass.strikeDeg,
          dip: compass.dipDeg,
          trend: compass.trendDeg,
          plunge: compass.plungeDeg,
          bearing: compass.bearingDeg,
          azimuth: compass.headingDeg,
          latitude: compass.location.lat,
          longitude: compass.location.lon,
          notes: currentReading.notes,
          photos: currentReading.photos,
          lithology: currentReading.lithology,
          structure_type: currentReading.structureType,
        })
        .select()
        .single();

      if (error) throw error;

      const savedReading: CompassReadingData = {
        ...currentReading,
        id: data.id,
        strike: compass.strikeDeg,
        dip: compass.dipDeg,
        trend: compass.trendDeg,
        plunge: compass.plungeDeg,
        bearing: compass.bearingDeg,
        latitude: compass.location.lat,
        longitude: compass.location.lon,
        timestamp: new Date(data.created_at),
      };

      setDbReadings(prev => [savedReading, ...prev]);
      toast.success('Reading saved to cloud!');
      handleReset();
    } catch (error) {
      console.error('Error saving reading:', error);
      toast.error('Failed to save reading');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteReading = async (id: string) => {
    if (!user) {
      setDbReadings(prev => prev.filter(r => r.id !== id));
      toast.success('Reading deleted');
      return;
    }

    try {
      const { error } = await supabase
        .from('compass_readings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDbReadings(prev => prev.filter(r => r.id !== id));
      toast.success('Reading deleted');
    } catch (error) {
      console.error('Error deleting reading:', error);
      toast.error('Failed to delete reading');
    }
  };

  const toggleDemoMode = () => {
    if (compass.isDemoMode) {
      compass.startListening();
    } else {
      compass.enableDemoMode();
    }
  };

  // Get accuracy color and icon
  const getAccuracyBadge = () => {
    switch (compass.sensorAccuracy) {
      case 'HIGH':
        return <Badge variant="default" className="bg-success text-success-foreground"><Signal className="h-3 w-3 mr-1" />HIGH</Badge>;
      case 'MEDIUM':
        return <Badge variant="default" className="bg-warning text-warning-foreground"><Signal className="h-3 w-3 mr-1" />MEDIUM</Badge>;
      case 'LOW':
        return <Badge variant="destructive"><Signal className="h-3 w-3 mr-1" />LOW</Badge>;
      default:
        return <Badge variant="outline"><Signal className="h-3 w-3 mr-1" />CALIBRATING</Badge>;
    }
  };

  // Convert accuracy to the expected format for CompassDial
  const dialAccuracy = compass.sensorAccuracy === 'UNKNOWN' ? 'unknown' : compass.sensorAccuracy.toLowerCase() as 'low' | 'medium' | 'high';

  return (
    <AppLayout>
      <div className="container max-w-lg mx-auto px-4 pb-24 space-y-6">
        {/* Header with title and controls */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">Brunton Compass</h1>
          <Button variant="outline" size="sm" onClick={() => setShowHowTo(true)}>
            <HelpCircle className="h-4 w-4 mr-1" /> Help
          </Button>
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={toggleDemoMode}>
              {compass.isDemoMode ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {compass.isDemoMode ? 'Demo' : 'Live'}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowCalibration(true)}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            {getAccuracyBadge()}
            {compass.isListening ? (
              <Badge variant="outline" className="text-success border-success"><Wifi className="h-3 w-3 mr-1" />Live</Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground"><WifiOff className="h-3 w-3 mr-1" />Off</Badge>
            )}
          </div>
        </div>

        {/* Warning banner for demo mode or errors */}
        {(compass.isDemoMode || compass.error) && (
          <Alert variant="destructive" className="bg-warning/10 border-warning text-warning-foreground">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {compass.error || 'Demo mode: Sensor data simulated. Lock & Save disabled.'}
            </AlertDescription>
          </Alert>
        )}

        {/* Compass dial or Clinometer */}
        <div className="flex flex-col items-center gap-6">
          {compass.activeMode === 'clinometer' ? (
            <Clinometer
              angle={compass.pitchDeg}
              lockedAngle={compass.dipDeg}
              isLocked={compass.isLocked}
              size={280}
            />
          ) : (
            <>
              <CompassDial
                heading={compass.headingDeg}
                strike={compass.strikeDeg}
                dip={compass.dipDeg}
                accuracy={dialAccuracy}
                isLocked={compass.isLocked}
                size={280}
              />
              
              {/* Bubble Level Indicators */}
              <DualBubbleLevel
                pitch={compass.pitchDeg}
                roll={compass.rollDeg}
              />
            </>
          )}
        </div>

        {/* Measurement panel */}
        <MeasurementPanel
          mode={compass.activeMode}
          onModeChange={handleModeChange}
          strike={compass.strikeDeg}
          dip={compass.dipDeg}
          trend={compass.trendDeg}
          plunge={compass.plungeDeg}
          bearing={compass.bearingDeg}
          isLocked={compass.isLocked}
          onLock={handleLock}
          onUnlock={handleUnlock}
          onAdjust={compass.adjustValue}
          onReset={handleReset}
          currentHeading={compass.headingDeg}
          currentTilt={{ pitch: compass.pitchDeg, roll: compass.rollDeg }}
        />

        {/* Login prompt if not signed in */}
        {!user && (
          <div className="bg-muted/50 rounded-lg p-4 text-center border border-border">
            <p className="text-sm text-muted-foreground mb-2">
              Sign in to save your readings to the cloud
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to="/auth">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Link>
            </Button>
          </div>
        )}

        {/* Save form when locked */}
        {compass.isLocked && currentReading && !compass.isDemoMode && (
          <CompassReadingForm
            reading={currentReading}
            onReadingChange={setCurrentReading}
            onSave={handleSaveReading}
            onPhotoCapture={() => toast.info('Photo capture coming soon')}
            onVoiceNote={() => toast.info('Voice notes coming soon')}
            isSaving={isSaving}
          />
        )}

        {/* Declination settings */}
        <DeclinationInput
          declination={compass.declinationDeg}
          useTrueNorth={compass.useTrueNorth}
          onDeclinationChange={compass.setDeclination}
          onTrueNorthChange={compass.setUseTrueNorth}
          latitude={compass.location.lat}
          longitude={compass.location.lon}
        />

        {/* Visualizations and readings */}
        <Tabs defaultValue="readings" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="readings">Readings</TabsTrigger>
            <TabsTrigger value="rose">Rose</TabsTrigger>
            <TabsTrigger value="stereonet">Stereonet</TabsTrigger>
          </TabsList>
          <TabsContent value="readings">
            <ReadingsList
              readings={dbReadings}
              onView={() => {}}
              onDelete={handleDeleteReading}
            />
          </TabsContent>
          <TabsContent value="rose">
            <RoseDiagram readings={dbReadings} size={220} />
          </TabsContent>
          <TabsContent value="stereonet">
            <Stereonet readings={dbReadings} size={220} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Overlays */}
      <CalibrationOverlay
        isOpen={showCalibration}
        onClose={() => setShowCalibration(false)}
        accuracy={dialAccuracy}
      />
      <HowToUseOverlay isOpen={showHowTo} onClose={() => setShowHowTo(false)} />
    </AppLayout>
  );
};

export default Compass;
