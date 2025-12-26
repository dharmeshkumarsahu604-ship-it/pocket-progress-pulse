import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface CompassDialProps {
  heading: number;
  strike?: number | null;
  dip?: number | null;
  accuracy: 'low' | 'medium' | 'high' | 'unknown';
  isLocked?: boolean;
  size?: number;
  className?: string;
}

const CARDINAL_POINTS = [
  { label: 'N', angle: 0 },
  { label: 'E', angle: 90 },
  { label: 'S', angle: 180 },
  { label: 'W', angle: 270 },
];

const INTERCARDINAL_POINTS = [
  { label: 'NE', angle: 45 },
  { label: 'SE', angle: 135 },
  { label: 'SW', angle: 225 },
  { label: 'NW', angle: 315 },
];

export const CompassDial: React.FC<CompassDialProps> = ({
  heading,
  strike = null,
  dip = null,
  accuracy,
  isLocked = false,
  size = 280,
  className,
}) => {
  const rotation = useMemo(() => -heading, [heading]);
  
  const accuracyColor = useMemo(() => {
    switch (accuracy) {
      case 'high': return 'text-success';
      case 'medium': return 'text-warning';
      case 'low': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  }, [accuracy]);

  const tickMarks = useMemo(() => {
    const marks = [];
    for (let i = 0; i < 360; i += 2) {
      const isMajor = i % 30 === 0;
      const isMinor = i % 10 === 0;
      marks.push({
        angle: i,
        length: isMajor ? 15 : isMinor ? 10 : 5,
        width: isMajor ? 2 : 1,
      });
    }
    return marks;
  }, []);

  const radius = size / 2 - 20;
  const centerX = size / 2;
  const centerY = size / 2;

  return (
    <div 
      className={cn(
        "relative select-none",
        isLocked && "ring-4 ring-success/50 rounded-full",
        className
      )}
      style={{ width: size, height: size }}
    >
      {/* Outer ring with gradient */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-card to-muted border-4 border-border shadow-xl" />
      
      {/* Accuracy indicator ring */}
      <div 
        className={cn(
          "absolute inset-2 rounded-full border-2",
          accuracy === 'high' && "border-success/50",
          accuracy === 'medium' && "border-warning/50",
          accuracy === 'low' && "border-destructive/50 animate-pulse",
          accuracy === 'unknown' && "border-muted"
        )} 
      />

      {/* Rotating compass face */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0 transition-transform duration-150 ease-out"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {/* Tick marks */}
        {tickMarks.map(({ angle, length, width }) => {
          const rad = (angle - 90) * (Math.PI / 180);
          const x1 = centerX + (radius - length) * Math.cos(rad);
          const y1 = centerY + (radius - length) * Math.sin(rad);
          const x2 = centerX + radius * Math.cos(rad);
          const y2 = centerY + radius * Math.sin(rad);
          
          return (
            <line
              key={angle}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth={width}
              className="text-foreground/60"
            />
          );
        })}

        {/* Cardinal points */}
        {CARDINAL_POINTS.map(({ label, angle }) => {
          const rad = (angle - 90) * (Math.PI / 180);
          const x = centerX + (radius - 35) * Math.cos(rad);
          const y = centerY + (radius - 35) * Math.sin(rad);
          
          return (
            <text
              key={label}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              className={cn(
                "font-bold text-lg fill-current",
                label === 'N' ? "text-destructive" : "text-foreground"
              )}
              style={{ transform: `rotate(${-rotation}deg)`, transformOrigin: `${x}px ${y}px` }}
            >
              {label}
            </text>
          );
        })}

        {/* Intercardinal points */}
        {INTERCARDINAL_POINTS.map(({ label, angle }) => {
          const rad = (angle - 90) * (Math.PI / 180);
          const x = centerX + (radius - 35) * Math.cos(rad);
          const y = centerY + (radius - 35) * Math.sin(rad);
          
          return (
            <text
              key={label}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              className="text-xs fill-current text-muted-foreground"
              style={{ transform: `rotate(${-rotation}deg)`, transformOrigin: `${x}px ${y}px` }}
            >
              {label}
            </text>
          );
        })}

        {/* Strike indicator (if set) */}
        {strike !== null && (
          <line
            x1={centerX}
            y1={centerY}
            x2={centerX + (radius - 20) * Math.sin((strike * Math.PI) / 180)}
            y2={centerY - (radius - 20) * Math.cos((strike * Math.PI) / 180)}
            stroke="hsl(var(--accent))"
            strokeWidth={3}
            strokeLinecap="round"
            className="drop-shadow-md"
          />
        )}
      </svg>

      {/* Fixed north pointer (triangle) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-b-[20px] border-l-transparent border-r-transparent border-b-destructive drop-shadow-lg" />
      </div>

      {/* Center display */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-card/95 backdrop-blur-sm rounded-full p-6 shadow-inner border border-border">
          <div className="text-center">
            <div className="font-mono text-4xl font-bold text-foreground tabular-nums">
              {Math.round(heading)}°
            </div>
            <div className={cn("text-xs font-medium mt-1", accuracyColor)}>
              {accuracy === 'unknown' ? 'Calibrating...' : accuracy.toUpperCase()}
            </div>
            {strike !== null && dip !== null && (
              <div className="mt-2 text-sm text-muted-foreground">
                <span className="text-accent font-mono">{strike}°/{dip}°</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lock indicator */}
      {isLocked && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-success text-success-foreground px-3 py-1 rounded-full text-xs font-bold shadow-lg">
          LOCKED
        </div>
      )}
    </div>
  );
};
