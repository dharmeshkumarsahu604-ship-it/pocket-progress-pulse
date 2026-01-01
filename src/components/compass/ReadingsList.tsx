import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MapPin, 
  Clock, 
  Trash2,
  Download,
  FileSpreadsheet,
  Globe,
  Map,
  FileText,
  ChevronDown
} from 'lucide-react';
import { CompassReadingData } from './CompassReading';
import { exportReadings, ExportFormat, EXPORT_FORMATS } from '@/lib/compassExport';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ReadingsListProps {
  readings: CompassReadingData[];
  onView: (reading: CompassReadingData) => void;
  onDelete: (id: string) => void;
  onExport?: () => void;
  selectedId?: string;
}

const formatMeasurement = (reading: CompassReadingData): string => {
  const parts: string[] = [];
  if (reading.strike !== null) parts.push(`S: ${reading.strike}°`);
  if (reading.dip !== null) parts.push(`D: ${reading.dip}°`);
  if (reading.trend !== null) parts.push(`T: ${reading.trend}°`);
  if (reading.plunge !== null) parts.push(`P: ${reading.plunge}°`);
  if (reading.bearing !== null) parts.push(`B: ${reading.bearing}°`);
  return parts.join(' / ') || 'No data';
};

const getModeLabel = (mode: string): string => {
  const labels: Record<string, string> = {
    strike: 'Strike',
    dip: 'Dip',
    strike_dip: 'S/D',
    trend_plunge: 'T/P',
    bearing: 'Bearing',
    clinometer: 'Clino',
  };
  return labels[mode] || mode;
};

const getFormatIcon = (format: ExportFormat) => {
  switch (format) {
    case 'csv':
      return <FileSpreadsheet className="h-4 w-4" />;
    case 'geojson':
      return <Globe className="h-4 w-4" />;
    case 'kml':
      return <Map className="h-4 w-4" />;
    case 'txt':
      return <FileText className="h-4 w-4" />;
    default:
      return <Download className="h-4 w-4" />;
  }
};

export const ReadingsList: React.FC<ReadingsListProps> = ({
  readings,
  onView,
  onDelete,
  onExport,
  selectedId,
}) => {
  const handleExport = (format: ExportFormat) => {
    if (readings.length === 0) {
      toast.error('No readings to export');
      return;
    }

    // Check if readings have coordinates for geo formats
    if ((format === 'geojson' || format === 'kml')) {
      const withCoords = readings.filter(r => r.latitude && r.longitude);
      if (withCoords.length === 0) {
        toast.error(`No readings with GPS coordinates for ${format.toUpperCase()} export`);
        return;
      }
      if (withCoords.length < readings.length) {
        toast.warning(`Exporting ${withCoords.length} of ${readings.length} readings with GPS data`);
      }
    }

    exportReadings(readings, format);
    toast.success(`Exported ${readings.length} readings as ${format.toUpperCase()}`);
  };

  if (readings.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground text-sm">
            No readings saved yet. Lock a reading to save it.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">
            Saved Readings ({readings.length})
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-3 w-3 mr-1" />
                Export
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-background z-50">
              <DropdownMenuLabel>Export Format</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {EXPORT_FORMATS.map((format) => (
                <DropdownMenuItem
                  key={format.id}
                  onClick={() => handleExport(format.id)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-3 w-full">
                    {getFormatIcon(format.id)}
                    <div className="flex-1">
                      <div className="font-medium">{format.label}</div>
                      <div className="text-xs text-muted-foreground">{format.description}</div>
                    </div>
                    <span className="text-xs text-muted-foreground">{format.extension}</span>
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5">
                <p className="text-xs text-muted-foreground">
                  GeoJSON & KML require GPS coordinates
                </p>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-2">
        <ScrollArea className="h-[300px]">
          <div className="space-y-2 p-1">
            {readings.map((reading) => (
              <div
                key={reading.id}
                className={cn(
                  "p-3 rounded-lg border cursor-pointer transition-colors",
                  selectedId === reading.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted/50"
                )}
                onClick={() => onView(reading)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-xs">
                        {getModeLabel(reading.mode)}
                      </Badge>
                      {reading.lithology && (
                        <Badge variant="outline" className="text-xs">
                          {reading.lithology}
                        </Badge>
                      )}
                      {reading.latitude && reading.longitude && (
                        <Badge variant="outline" className="text-xs text-success border-success/30">
                          <MapPin className="h-2.5 w-2.5 mr-0.5" />
                          GPS
                        </Badge>
                      )}
                    </div>
                    
                    <div className="font-mono text-sm font-bold truncate">
                      {formatMeasurement(reading)}
                    </div>
                    
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {reading.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                      {reading.latitude && reading.longitude && (
                        <span className="flex items-center gap-1">
                          {reading.latitude.toFixed(3)}°, {reading.longitude.toFixed(3)}°
                        </span>
                      )}
                    </div>
                    
                    {reading.notes && (
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {reading.notes}
                      </p>
                    )}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (reading.id) onDelete(reading.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
