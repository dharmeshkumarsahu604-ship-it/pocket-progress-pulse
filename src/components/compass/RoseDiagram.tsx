import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CompassReadingData } from './CompassReading';

interface RoseDiagramProps {
  readings: CompassReadingData[];
  size?: number;
  title?: string;
}

export const RoseDiagram: React.FC<RoseDiagramProps> = ({
  readings,
  size = 200,
  title = 'Rose Diagram',
}) => {
  const binSize = 10; // 10-degree bins
  const binCount = 360 / binSize;

  const bins = useMemo(() => {
    const counts = new Array(binCount).fill(0);
    
    readings.forEach(reading => {
      let angle = reading.strike ?? reading.bearing ?? reading.trend;
      if (angle === null) return;
      
      // Normalize to 0-360
      angle = ((angle % 360) + 360) % 360;
      const binIndex = Math.floor(angle / binSize);
      counts[binIndex]++;
    });

    const maxCount = Math.max(...counts, 1);
    return counts.map((count, index) => ({
      startAngle: index * binSize,
      endAngle: (index + 1) * binSize,
      count,
      normalizedRadius: count / maxCount,
    }));
  }, [readings, binSize, binCount]);

  const maxRadius = size / 2 - 20;
  const centerX = size / 2;
  const centerY = size / 2;

  const createPetalPath = (bin: typeof bins[0]) => {
    if (bin.count === 0) return '';

    const startRad = ((bin.startAngle - 90) * Math.PI) / 180;
    const endRad = ((bin.endAngle - 90) * Math.PI) / 180;
    const radius = bin.normalizedRadius * maxRadius * 0.9;

    const x1 = centerX + Math.cos(startRad) * radius;
    const y1 = centerY + Math.sin(startRad) * radius;
    const x2 = centerX + Math.cos(endRad) * radius;
    const y2 = centerY + Math.sin(endRad) * radius;

    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background circles */}
          {[0.25, 0.5, 0.75, 1].map((ratio) => (
            <circle
              key={ratio}
              cx={centerX}
              cy={centerY}
              r={maxRadius * ratio * 0.9}
              fill="none"
              stroke="currentColor"
              strokeWidth={1}
              className="text-muted/30"
            />
          ))}

          {/* Cardinal directions */}
          {[0, 90, 180, 270].map((angle) => {
            const rad = ((angle - 90) * Math.PI) / 180;
            const x = centerX + Math.cos(rad) * maxRadius;
            const y = centerY + Math.sin(rad) * maxRadius;
            return (
              <line
                key={angle}
                x1={centerX}
                y1={centerY}
                x2={x}
                y2={y}
                stroke="currentColor"
                strokeWidth={1}
                className="text-muted/50"
              />
            );
          })}

          {/* Rose petals */}
          {bins.map((bin, index) => (
            <path
              key={index}
              d={createPetalPath(bin)}
              fill="hsl(var(--primary))"
              fillOpacity={0.6}
              stroke="hsl(var(--primary))"
              strokeWidth={1}
            />
          ))}

          {/* Labels */}
          <text x={centerX} y={15} textAnchor="middle" className="text-xs fill-current font-bold text-foreground">
            N
          </text>
          <text x={size - 10} y={centerY + 4} textAnchor="middle" className="text-xs fill-current text-muted-foreground">
            E
          </text>
          <text x={centerX} y={size - 8} textAnchor="middle" className="text-xs fill-current text-muted-foreground">
            S
          </text>
          <text x={10} y={centerY + 4} textAnchor="middle" className="text-xs fill-current text-muted-foreground">
            W
          </text>

          {/* Center dot */}
          <circle cx={centerX} cy={centerY} r={3} fill="hsl(var(--foreground))" />
        </svg>

        {readings.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
            No readings to display
          </div>
        )}
      </CardContent>
    </Card>
  );
};
