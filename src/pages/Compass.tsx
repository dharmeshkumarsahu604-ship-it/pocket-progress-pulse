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
import { useDeviceOrientation } from '@/hooks/useDeviceOrientation';
import { useGeolocation } from '@/hooks/useGeolocation';
import { exportReadings } from '@/lib/compassExport';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Settings, HelpCircle, Play, Pause, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

const Compass: React.FC = () => {
  // Compass state
  const [mode, setMode] = useState<MeasurementMode>('strike_dip');
  const [isLocked, setIsLocked] = useState(false);
  const [declination, setDeclination] = useState(0);
  const [useTrueNorth, setUseTrueNorth] = useState(true);
  const [showCalibration, setShowCalibration] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [demoHeading, setDemoHeading] = useState(45);

  // Measurements
  const [strike, setStrike] = useState<number | null>(null);
  const [dip, setDip] = useState<number | null>(null);
  const [trend, setTrend] = useState<number | null>(null);
  const [plunge, setPlunge] = useState<number | null>(null);
  const [bearing, setBearing] = useState<number | null>(null);

  // Saved readings
  const [readings, setReadings] = useState<CompassReadingData[]>([]);
  const [currentReading, setCurrentReading] = useState<CompassReadingData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Auth
  const { user } = useAuth();

  // Device sensors
  const orientation = useDeviceOrientation({ magneticDeclination: declination, useTrueNorth });
  const { latitude, longitude, getCurrentLocation } = useGeolocation();

  const heading = isDemo ? demoHeading : (orientation.heading ?? 0);

  // Demo mode rotation
  useEffect(() => {
    if (!isDemo) return;
    const interval = setInterval(() => {
      setDemoHeading(prev => (prev + 0.5) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [isDemo]);

  // Start compass on mount
  useEffect(() => {
    if (!orientation.isSupported) {
      setIsDemo(true);
      toast.info('Demo mode: Device sensors not available');
    } else {
      orientation.startListening();
    }
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

        setReadings(loadedReadings);
      } catch (error) {
        console.error('Error loading readings:', error);
        toast.error('Failed to load saved readings');
      } finally {
        setIsLoading(false);
      }
    };

    loadReadings();
  }, [user]);

  // Lock reading
  const handleLock = useCallback(() => {
    const currentHeading = Math.round(heading);
    const currentTilt = Math.abs(orientation.tilt.pitch ?? 0);

    switch (mode) {
      case 'strike':
        setStrike(currentHeading);
        break;
      case 'dip':
        setDip(Math.min(90, Math.round(currentTilt)));
        break;
      case 'strike_dip':
        setStrike(currentHeading);
        setDip(Math.min(90, Math.round(currentTilt)));
        break;
      case 'trend_plunge':
        setTrend(currentHeading);
        setPlunge(Math.min(90, Math.round(currentTilt)));
        break;
      case 'bearing':
        setBearing(currentHeading);
        break;
      case 'clinometer':
        setDip(Math.min(90, Math.round(currentTilt)));
        break;
    }

    setIsLocked(true);
    getCurrentLocation();
    
    const clinometerDip = mode === 'clinometer' ? Math.min(90, Math.round(currentTilt)) : null;
    
    setCurrentReading({
      mode,
      strike: mode === 'strike' || mode === 'strike_dip' ? currentHeading : null,
      dip: mode === 'dip' || mode === 'strike_dip' || mode === 'clinometer' ? Math.min(90, Math.round(currentTilt)) : null,
      trend: mode === 'trend_plunge' ? currentHeading : null,
      plunge: mode === 'trend_plunge' ? Math.min(90, Math.round(currentTilt)) : null,
      bearing: mode === 'bearing' ? currentHeading : null,
      azimuth: mode === 'clinometer' ? 0 : currentHeading,
      timestamp: new Date(),
      latitude,
      longitude,
      notes: '',
      photos: [],
      lithology: '',
      structureType: '',
    });

    toast.success('Reading locked!');
  }, [heading, orientation.tilt, mode, latitude, longitude, getCurrentLocation]);

  const handleUnlock = () => {
    setIsLocked(false);
    setCurrentReading(null);
  };

  const handleAdjust = (field: string, delta: number) => {
    const adjust = (val: number | null, max = 360) => {
      if (val === null) return null;
      return ((val + delta) % max + max) % max;
    };

    switch (field) {
      case 'strike': setStrike(prev => adjust(prev)); break;
      case 'dip': setDip(prev => adjust(prev, 91)); break;
      case 'trend': setTrend(prev => adjust(prev)); break;
      case 'plunge': setPlunge(prev => adjust(prev, 91)); break;
      case 'bearing': setBearing(prev => adjust(prev)); break;
    }
  };

  const handleReset = () => {
    setStrike(null);
    setDip(null);
    setTrend(null);
    setPlunge(null);
    setBearing(null);
    setIsLocked(false);
    setCurrentReading(null);
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
          strike: currentReading.strike,
          dip: currentReading.dip,
          trend: currentReading.trend,
          plunge: currentReading.plunge,
          bearing: currentReading.bearing,
          azimuth: currentReading.azimuth,
          latitude: latitude,
          longitude: longitude,
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
        latitude,
        longitude,
        timestamp: new Date(data.created_at),
      };

      setReadings(prev => [savedReading, ...prev]);
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
      setReadings(prev => prev.filter(r => r.id !== id));
      toast.success('Reading deleted');
      return;
    }

    try {
      const { error } = await supabase
        .from('compass_readings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setReadings(prev => prev.filter(r => r.id !== id));
      toast.success('Reading deleted');
    } catch (error) {
      console.error('Error deleting reading:', error);
      toast.error('Failed to delete reading');
    }
  };

  const handleExport = () => {
    if (readings.length === 0) {
      toast.error('No readings to export');
      return;
    }
    exportReadings(readings, 'csv');
    toast.success('Exported as CSV');
  };

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
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsDemo(!isDemo)}>
            {isDemo ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowCalibration(true)}>
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        {/* Compass dial or Clinometer */}
        <div className="flex flex-col items-center gap-6">
          {mode === 'clinometer' ? (
            <Clinometer
              angle={orientation.tilt.pitch ?? 0}
              lockedAngle={dip}
              isLocked={isLocked}
              size={280}
            />
          ) : (
            <>
              <CompassDial
                heading={heading}
                strike={strike}
                dip={dip}
                accuracy={isDemo ? 'high' : orientation.accuracy}
                isLocked={isLocked}
                size={280}
              />
              
              {/* Bubble Level Indicators */}
              <DualBubbleLevel
                pitch={orientation.tilt.pitch ?? 0}
                roll={orientation.tilt.roll ?? 0}
              />
            </>
          )}
        </div>

        {/* Measurement panel */}
        <MeasurementPanel
          mode={mode}
          onModeChange={setMode}
          strike={strike}
          dip={dip}
          trend={trend}
          plunge={plunge}
          bearing={bearing}
          isLocked={isLocked}
          onLock={handleLock}
          onUnlock={handleUnlock}
          onAdjust={handleAdjust}
          onReset={handleReset}
          currentHeading={heading}
          currentTilt={orientation.tilt}
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
        {isLocked && currentReading && (
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
          declination={declination}
          useTrueNorth={useTrueNorth}
          onDeclinationChange={setDeclination}
          onTrueNorthChange={setUseTrueNorth}
          latitude={latitude}
          longitude={longitude}
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
              readings={readings}
              onView={() => {}}
              onDelete={handleDeleteReading}
              onExport={handleExport}
            />
          </TabsContent>
          <TabsContent value="rose">
            <RoseDiagram readings={readings} size={220} />
          </TabsContent>
          <TabsContent value="stereonet">
            <Stereonet readings={readings} size={220} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Overlays */}
      <CalibrationOverlay
        isOpen={showCalibration}
        onClose={() => setShowCalibration(false)}
        accuracy={orientation.accuracy}
      />
      <HowToUseOverlay isOpen={showHowTo} onClose={() => setShowHowTo(false)} />
    </AppLayout>
  );
};

export default Compass;
