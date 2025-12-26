import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger 
} from '@/components/ui/dialog';
import { MapPin, Navigation, Globe, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface DeclinationInputProps {
  declination: number;
  useTrueNorth: boolean;
  onDeclinationChange: (value: number) => void;
  onTrueNorthChange: (value: boolean) => void;
  latitude?: number | null;
  longitude?: number | null;
}

// Approximate magnetic declination calculation (simplified model)
// For accurate values, use NOAA's World Magnetic Model API
const calculateDeclination = (lat: number, lon: number, year: number = 2024): number => {
  // Very simplified model - for India region approximately
  // Real implementation should use WMM or IGRF model
  const baseDeclination = -1.5; // Base for India region
  const latFactor = (lat - 20) * 0.05;
  const lonFactor = (lon - 80) * 0.02;
  return Math.round((baseDeclination + latFactor + lonFactor) * 10) / 10;
};

export const DeclinationInput: React.FC<DeclinationInputProps> = ({
  declination,
  useTrueNorth,
  onDeclinationChange,
  onTrueNorthChange,
  latitude,
  longitude,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(declination.toString());
  const [isAutoDetecting, setIsAutoDetecting] = useState(false);

  const handleAutoDetect = async () => {
    if (!latitude || !longitude) {
      // Try to get current location
      setIsAutoDetecting(true);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const calculated = calculateDeclination(
              position.coords.latitude,
              position.coords.longitude
            );
            onDeclinationChange(calculated);
            setInputValue(calculated.toString());
            setIsAutoDetecting(false);
            toast.success(`Declination auto-detected: ${calculated}°`);
          },
          (error) => {
            setIsAutoDetecting(false);
            toast.error('Could not get location. Please enter manually.');
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
      } else {
        setIsAutoDetecting(false);
        toast.error('Geolocation not supported. Please enter manually.');
      }
      return;
    }

    const calculated = calculateDeclination(latitude, longitude);
    onDeclinationChange(calculated);
    setInputValue(calculated.toString());
    toast.success(`Declination calculated: ${calculated}°`);
  };

  const handleManualInput = () => {
    const value = parseFloat(inputValue);
    if (!isNaN(value) && value >= -180 && value <= 180) {
      onDeclinationChange(value);
      toast.success(`Declination set to ${value}°`);
    } else {
      toast.error('Please enter a valid declination (-180 to 180)');
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Globe className="h-4 w-4" />
          Magnetic Declination
        </CardTitle>
        <CardDescription className="text-xs">
          Difference between magnetic and true north
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* True North toggle */}
        <div className="flex items-center justify-between">
          <Label htmlFor="true-north" className="flex items-center gap-2">
            <Navigation className="h-4 w-4" />
            Use True North
          </Label>
          <Switch
            id="true-north"
            checked={useTrueNorth}
            onCheckedChange={onTrueNorthChange}
          />
        </div>

        {/* Declination value display */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <span className="text-sm">Current Declination</span>
          <span className="font-mono text-lg font-bold">
            {declination > 0 ? '+' : ''}{declination}°
          </span>
        </div>

        {/* Edit dialog */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <MapPin className="h-4 w-4 mr-2" />
              Configure Declination
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Magnetic Declination</DialogTitle>
              <DialogDescription>
                Set the magnetic declination for accurate true north readings.
                Declination varies by location and changes over time.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 pt-4">
              {/* Auto-detect button */}
              <Button
                variant="outline"
                className="w-full"
                onClick={handleAutoDetect}
                disabled={isAutoDetecting}
              >
                {isAutoDetecting ? (
                  'Detecting...'
                ) : (
                  <>
                    <MapPin className="h-4 w-4 mr-2" />
                    Auto-detect from Location
                  </>
                )}
              </Button>

              {/* Manual input */}
              <div className="space-y-2">
                <Label htmlFor="declination-input">Manual Entry (degrees)</Label>
                <div className="flex gap-2">
                  <Input
                    id="declination-input"
                    type="number"
                    step="0.1"
                    min="-180"
                    max="180"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="font-mono"
                  />
                  <Button onClick={handleManualInput}>
                    Set
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Positive = East, Negative = West
                </p>
              </div>

              {/* Location info */}
              {latitude && longitude && (
                <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                  <p>Current Location:</p>
                  <p className="font-mono">{latitude.toFixed(4)}°, {longitude.toFixed(4)}°</p>
                </div>
              )}

              {/* External resource link */}
              <a
                href="https://www.ngdc.noaa.gov/geomag/calculators/magcalc.shtml"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-accent hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                NOAA Magnetic Declination Calculator
              </a>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
