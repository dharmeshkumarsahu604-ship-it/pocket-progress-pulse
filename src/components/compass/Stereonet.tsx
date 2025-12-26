import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CompassReadingData } from './CompassReading';

interface StereonetProps {
  readings: CompassReadingData[];
  size?: number;
  title?: string;
}

// Convert strike/dip to stereonet pole coordinates
const strikedipToPole = (strike: number, dip: number): { x: number; y: number } => {
  // Convert to radians
  const strikeRad = (strike * Math.PI) / 180;
  const dipRad = (dip * Math.PI) / 180;
  
  // Pole trend is strike + 90 (dip direction)
  const poleTrend = strikeRad + Math.PI / 2;
  // Pole plunge is 90 - dip
  const polePlunge = Math.PI / 2 - dipRad;
  
  // Equal-area (Schmidt) projection
  const r = Math.sqrt(2) * Math.sin(polePlunge / 2);
  const x = r * Math.sin(poleTrend);
  const y = -r * Math.cos(poleTrend);
  
  return { x, y };
};

// Convert trend/plunge to stereonet coordinates
const trendPlungeToPoint = (trend: number, plunge: number): { x: number; y: number } => {
  const trendRad = (trend * Math.PI) / 180;
  const plungeRad = (plunge * Math.PI) / 180;
  
  // Equal-area projection
  const r = Math.sqrt(2) * Math.sin((Math.PI / 2 - plungeRad) / 2);
  const x = r * Math.sin(trendRad);
  const y = -r * Math.cos(trendRad);
  
  return { x, y };
};

export const Stereonet: React.FC<StereonetProps> = ({
  readings,
  size = 220,
  title = 'Stereonet (Schmidt Net)',
}) => {
  const radius = size / 2 - 25;
  const centerX = size / 2;
  const centerY = size / 2;

  const points = useMemo(() => {
    return readings.map((reading, index) => {
      if (reading.strike !== null && reading.dip !== null) {
        const pole = strikedipToPole(reading.strike, reading.dip);
        return {
          ...pole,
          type: 'pole' as const,
          index,
          reading,
        };
      } else if (reading.trend !== null && reading.plunge !== null) {
        const point = trendPlungeToPoint(reading.trend, reading.plunge);
        return {
          ...point,
          type: 'line' as const,
          index,
          reading,
        };
      }
      return null;
    }).filter((p): p is NonNullable<typeof p> => p !== null);
  }, [readings]);

  // Generate great circle arcs for the net
  const greatCircles = useMemo(() => {
    const circles = [];
    for (let dip = 10; dip < 90; dip += 10) {
      circles.push(dip);
    }
    return circles;
  }, []);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center relative">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Outer circle (primitive circle) */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="text-foreground"
          />

          {/* Small circles (dip circles) */}
          {[30, 60].map((angle) => (
            <circle
              key={angle}
              cx={centerX}
              cy={centerY}
              r={radius * Math.sin((angle * Math.PI) / 180)}
              fill="none"
              stroke="currentColor"
              strokeWidth={0.5}
              className="text-muted/50"
              strokeDasharray="4,4"
            />
          ))}

          {/* Cross-hairs */}
          <line
            x1={centerX - radius}
            y1={centerY}
            x2={centerX + radius}
            y2={centerY}
            stroke="currentColor"
            strokeWidth={0.5}
            className="text-muted/70"
          />
          <line
            x1={centerX}
            y1={centerY - radius}
            x2={centerX}
            y2={centerY + radius}
            stroke="currentColor"
            strokeWidth={0.5}
            className="text-muted/70"
          />

          {/* Cardinal direction labels */}
          <text x={centerX} y={18} textAnchor="middle" className="text-xs fill-current font-bold text-foreground">
            N
          </text>
          <text x={size - 12} y={centerY + 4} textAnchor="middle" className="text-xs fill-current text-muted-foreground">
            E
          </text>
          <text x={centerX} y={size - 10} textAnchor="middle" className="text-xs fill-current text-muted-foreground">
            S
          </text>
          <text x={12} y={centerY + 4} textAnchor="middle" className="text-xs fill-current text-muted-foreground">
            W
          </text>

          {/* Plot points */}
          {points.map((point) => (
            <circle
              key={point.index}
              cx={centerX + point.x * radius}
              cy={centerY + point.y * radius}
              r={point.type === 'pole' ? 4 : 5}
              fill={point.type === 'pole' ? 'hsl(var(--primary))' : 'hsl(var(--accent))'}
              stroke="hsl(var(--background))"
              strokeWidth={1}
              className="cursor-pointer hover:opacity-80"
            >
              <title>
                {point.type === 'pole' 
                  ? `Strike: ${point.reading.strike}° Dip: ${point.reading.dip}°`
                  : `Trend: ${point.reading.trend}° Plunge: ${point.reading.plunge}°`
                }
              </title>
            </circle>
          ))}

          {/* Center point */}
          <circle cx={centerX} cy={centerY} r={2} fill="hsl(var(--foreground))" />
        </svg>

        {readings.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
            No data to plot
          </div>
        )}
      </CardContent>

      {/* Legend */}
      <div className="px-4 pb-3 flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span>Poles to planes</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-accent" />
          <span>Lines</span>
        </div>
      </div>
    </Card>
  );
};
