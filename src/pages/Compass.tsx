import React, { useState, useEffect, useCallback } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { CompassDial } from '@/components/compass/CompassDial';
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
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Settings, HelpCircle, Play, Pause } from 'lucide-react';

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
    }

    setIsLocked(true);
    getCurrentLocation();
    
    setCurrentReading({
      mode,
      strike: mode === 'strike' || mode === 'strike_dip' ? currentHeading : null,
      dip: mode === 'dip' || mode === 'strike_dip' ? Math.min(90, Math.round(currentTilt)) : null,
      trend: mode === 'trend_plunge' ? currentHeading : null,
      plunge: mode === 'trend_plunge' ? Math.min(90, Math.round(currentTilt)) : null,
      bearing: mode === 'bearing' ? currentHeading : null,
      azimuth: currentHeading,
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

  const handleSaveReading = () => {
    if (!currentReading) return;
    const saved = { ...currentReading, id: Date.now().toString(), latitude, longitude };
    setReadings(prev => [saved, ...prev]);
    toast.success('Reading saved!');
    handleReset();
  };

  const handleDeleteReading = (id: string) => {
    setReadings(prev => prev.filter(r => r.id !== id));
    toast.success('Reading deleted');
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

        {/* Compass dial */}
        <div className="flex justify-center">
          <CompassDial
            heading={heading}
            strike={strike}
            dip={dip}
            accuracy={isDemo ? 'high' : orientation.accuracy}
            isLocked={isLocked}
            size={280}
          />
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

        {/* Save form when locked */}
        {isLocked && currentReading && (
          <CompassReadingForm
            reading={currentReading}
            onReadingChange={setCurrentReading}
            onSave={handleSaveReading}
            onPhotoCapture={() => toast.info('Photo capture coming soon')}
            onVoiceNote={() => toast.info('Voice notes coming soon')}
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
