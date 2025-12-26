import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Minus, 
  Plus, 
  Lock, 
  Unlock, 
  RotateCcw, 
  Compass, 
  Mountain, 
  TrendingUp,
  Navigation
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type MeasurementMode = 'strike' | 'dip' | 'strike_dip' | 'trend_plunge' | 'bearing';

interface MeasurementPanelProps {
  mode: MeasurementMode;
  onModeChange: (mode: MeasurementMode) => void;
  strike: number | null;
  dip: number | null;
  trend: number | null;
  plunge: number | null;
  bearing: number | null;
  isLocked: boolean;
  onLock: () => void;
  onUnlock: () => void;
  onAdjust: (field: 'strike' | 'dip' | 'trend' | 'plunge' | 'bearing', delta: number) => void;
  onReset: () => void;
  currentHeading: number;
  currentTilt: { pitch: number | null; roll: number | null };
}

const MODES: { id: MeasurementMode; label: string; icon: React.ReactNode; description: string }[] = [
  { id: 'strike', label: 'Strike', icon: <Compass className="h-4 w-4" />, description: 'Horizontal direction of a geological plane' },
  { id: 'dip', label: 'Dip', icon: <Mountain className="h-4 w-4" />, description: 'Maximum angle of inclination' },
  { id: 'strike_dip', label: 'Strike & Dip', icon: <Compass className="h-4 w-4" />, description: 'Full plane orientation (RHR)' },
  { id: 'trend_plunge', label: 'Trend & Plunge', icon: <TrendingUp className="h-4 w-4" />, description: 'Linear feature orientation' },
  { id: 'bearing', label: 'Bearing', icon: <Navigation className="h-4 w-4" />, description: 'Direction to a point' },
];

export const MeasurementPanel: React.FC<MeasurementPanelProps> = ({
  mode,
  onModeChange,
  strike,
  dip,
  trend,
  plunge,
  bearing,
  isLocked,
  onLock,
  onUnlock,
  onAdjust,
  onReset,
  currentHeading,
  currentTilt,
}) => {
  const renderAdjustmentControl = (
    label: string,
    value: number | null,
    field: 'strike' | 'dip' | 'trend' | 'plunge' | 'bearing',
    unit: string = '°',
    max: number = 360
  ) => (
    <div className="flex items-center justify-between gap-4 p-3 bg-muted/50 rounded-lg">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onAdjust(field, -1)}
          disabled={!isLocked}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="font-mono text-lg font-bold w-16 text-center tabular-nums">
          {value !== null ? `${value}${unit}` : '--'}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onAdjust(field, 1)}
          disabled={!isLocked}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );

  const renderModeContent = () => {
    switch (mode) {
      case 'strike':
        return renderAdjustmentControl('Strike', strike, 'strike');
      
      case 'dip':
        return renderAdjustmentControl('Dip', dip, 'dip', '°', 90);
      
      case 'strike_dip':
        return (
          <div className="space-y-2">
            {renderAdjustmentControl('Strike', strike, 'strike')}
            {renderAdjustmentControl('Dip', dip, 'dip', '°', 90)}
            <div className="text-center text-xs text-muted-foreground mt-2">
              Right-Hand Rule: Dip direction is 90° clockwise from strike
            </div>
          </div>
        );
      
      case 'trend_plunge':
        return (
          <div className="space-y-2">
            {renderAdjustmentControl('Trend', trend, 'trend')}
            {renderAdjustmentControl('Plunge', plunge, 'plunge', '°', 90)}
          </div>
        );
      
      case 'bearing':
        return renderAdjustmentControl('Bearing', bearing, 'bearing');
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Mode selector */}
      <div className="flex flex-wrap gap-2">
        {MODES.map(({ id, label, icon }) => (
          <Button
            key={id}
            variant={mode === id ? 'default' : 'outline'}
            size="sm"
            onClick={() => onModeChange(id)}
            className="flex items-center gap-1.5"
          >
            {icon}
            {label}
          </Button>
        ))}
      </div>

      {/* Current mode description */}
      <Card className="bg-accent/10 border-accent/20">
        <CardContent className="py-3">
          <p className="text-sm text-accent-foreground">
            {MODES.find(m => m.id === mode)?.description}
          </p>
        </CardContent>
      </Card>

      {/* Measurement values with adjustment */}
      <Card>
        <CardContent className="py-4 space-y-3">
          {renderModeContent()}
        </CardContent>
      </Card>

      {/* Live sensor data */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="font-mono">
            Heading: {Math.round(currentHeading)}°
          </Badge>
          {currentTilt.pitch !== null && (
            <Badge variant="outline" className="font-mono">
              Tilt: {Math.round(currentTilt.pitch)}°
            </Badge>
          )}
        </div>
      </div>

      {/* Control buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant={isLocked ? 'default' : 'outline'}
          size="lg"
          className="flex-1"
          onClick={isLocked ? onUnlock : onLock}
        >
          {isLocked ? (
            <>
              <Unlock className="h-4 w-4 mr-2" />
              Unlock
            </>
          ) : (
            <>
              <Lock className="h-4 w-4 mr-2" />
              Lock Reading
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onReset}
          className="h-11 w-11"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
