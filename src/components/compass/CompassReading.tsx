import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Save, 
  Camera, 
  Mic, 
  MapPin, 
  Tag,
  Trash2,
  Clock
} from 'lucide-react';
import { MeasurementMode } from './MeasurementPanel';

interface CompassReadingData {
  id?: string;
  mode: MeasurementMode;
  strike: number | null;
  dip: number | null;
  trend: number | null;
  plunge: number | null;
  bearing: number | null;
  azimuth: number;
  timestamp: Date;
  latitude: number | null;
  longitude: number | null;
  notes: string;
  photos: string[];
  lithology: string;
  structureType: string;
}

interface CompassReadingFormProps {
  reading: CompassReadingData;
  onReadingChange: (reading: CompassReadingData) => void;
  onSave: () => void;
  onPhotoCapture: () => void;
  onVoiceNote: () => void;
  isSaving?: boolean;
}

const LITHOLOGY_OPTIONS = [
  'Granite', 'Basalt', 'Sandstone', 'Limestone', 'Shale', 
  'Marble', 'Gneiss', 'Schist', 'Quartzite', 'Conglomerate',
  'Slate', 'Dolomite', 'Rhyolite', 'Andesite', 'Other'
];

const STRUCTURE_OPTIONS = [
  'Bedding', 'Foliation', 'Joint', 'Fault', 'Fracture',
  'Cleavage', 'Lineation', 'Fold Axis', 'Vein', 'Contact',
  'Shear Zone', 'Other'
];

export const CompassReadingForm: React.FC<CompassReadingFormProps> = ({
  reading,
  onReadingChange,
  onSave,
  onPhotoCapture,
  onVoiceNote,
  isSaving,
}) => {
  const formatReading = () => {
    const parts = [];
    if (reading.strike !== null) parts.push(`Strike: ${reading.strike}°`);
    if (reading.dip !== null) parts.push(`Dip: ${reading.dip}°`);
    if (reading.trend !== null) parts.push(`Trend: ${reading.trend}°`);
    if (reading.plunge !== null) parts.push(`Plunge: ${reading.plunge}°`);
    if (reading.bearing !== null) parts.push(`Bearing: ${reading.bearing}°`);
    return parts.join(' | ') || 'No measurement';
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Save Reading</span>
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            {reading.timestamp.toLocaleTimeString()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Reading summary */}
        <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
          <div className="font-mono text-lg font-bold text-center">
            {formatReading()}
          </div>
          <div className="text-center text-xs text-muted-foreground mt-1">
            Azimuth: {Math.round(reading.azimuth)}° | Mode: {reading.mode.replace('_', ' & ')}
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          {reading.latitude && reading.longitude ? (
            <span className="font-mono">
              {reading.latitude.toFixed(5)}°, {reading.longitude.toFixed(5)}°
            </span>
          ) : (
            <span className="text-muted-foreground">No location</span>
          )}
        </div>

        {/* Lithology selector */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Lithology / Rock Type
          </Label>
          <div className="flex flex-wrap gap-1">
            {LITHOLOGY_OPTIONS.slice(0, 8).map((option) => (
              <Badge
                key={option}
                variant={reading.lithology === option ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => onReadingChange({ ...reading, lithology: option })}
              >
                {option}
              </Badge>
            ))}
          </div>
          <Input
            placeholder="Other lithology..."
            value={!LITHOLOGY_OPTIONS.includes(reading.lithology) ? reading.lithology : ''}
            onChange={(e) => onReadingChange({ ...reading, lithology: e.target.value })}
            className="text-sm"
          />
        </div>

        {/* Structure type selector */}
        <div className="space-y-2">
          <Label>Structure Type</Label>
          <div className="flex flex-wrap gap-1">
            {STRUCTURE_OPTIONS.slice(0, 6).map((option) => (
              <Badge
                key={option}
                variant={reading.structureType === option ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => onReadingChange({ ...reading, structureType: option })}
              >
                {option}
              </Badge>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label>Field Notes</Label>
          <Textarea
            placeholder="Add observations, notes, or descriptions..."
            value={reading.notes}
            onChange={(e) => onReadingChange({ ...reading, notes: e.target.value })}
            rows={3}
            className="resize-none"
          />
        </div>

        {/* Photo and voice buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onPhotoCapture}
          >
            <Camera className="h-4 w-4 mr-2" />
            Photo ({reading.photos.length})
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={onVoiceNote}
          >
            <Mic className="h-4 w-4 mr-2" />
            Voice Note
          </Button>
        </div>

        {/* Save button */}
        <Button 
          className="w-full" 
          size="lg"
          onClick={onSave}
          disabled={isSaving}
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Reading'}
        </Button>
      </CardContent>
    </Card>
  );
};

export type { CompassReadingData };
