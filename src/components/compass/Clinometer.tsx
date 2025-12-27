import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface ClinometerProps {
  angle: number; // Current tilt angle from device sensor
  lockedAngle: number | null;
  isLocked: boolean;
  size?: number;
  className?: string;
}

export const Clinometer: React.FC<ClinometerProps> = ({
  angle,
  lockedAngle,
  isLocked,
  size = 280,
  className,
}) => {
  // Clamp angle to -90 to 90
  const clampedAngle = Math.max(-90, Math.min(90, angle));
  const displayAngle = isLocked && lockedAngle !== null ? lockedAngle : Math.abs(Math.round(clampedAngle));
  
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 30;
  
  // Generate tick marks for the semicircle (0 to 90 on both sides)
  const tickMarks = useMemo(() => {
    const marks = [];
    for (let i = -90; i <= 90; i += 5) {
      const isMajor = i % 30 === 0;
      const isMinor = i % 10 === 0;
      marks.push({
        angle: i,
        length: isMajor ? 15 : isMinor ? 10 : 5,
        width: isMajor ? 2 : 1,
        showLabel: isMajor,
      });
    }
    return marks;
  }, []);

  // Calculate position for pendulum indicator
  const pendulumAngle = (clampedAngle - 90) * (Math.PI / 180);
  const pendulumLength = radius - 20;
  const pendulumX = centerX + pendulumLength * Math.cos(pendulumAngle);
  const pendulumY = centerY + pendulumLength * Math.sin(pendulumAngle);

  // Bubble position for the arc bubble indicator
  const bubbleArcRadius = radius - 40;
  const bubbleX = centerX + bubbleArcRadius * Math.cos(pendulumAngle);
  const bubbleY = centerY + bubbleArcRadius * Math.sin(pendulumAngle);

  // Determine level status
  const isLevel = Math.abs(clampedAngle) < 2;
  const isNearLevel = Math.abs(clampedAngle) < 5;

  return (
    <div 
      className={cn(
        "relative select-none",
        isLocked && "ring-4 ring-success/50 rounded-full",
        className
      )}
      style={{ width: size, height: size }}
    >
      {/* Background circle */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-card to-muted border-4 border-border shadow-xl" />
      
      {/* Status ring */}
      <div 
        className={cn(
          "absolute inset-2 rounded-full border-2 transition-colors duration-300",
          isLevel && "border-success/50",
          isNearLevel && !isLevel && "border-warning/50",
          !isNearLevel && "border-muted"
        )} 
      />

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0"
      >
        {/* Semicircle arc for scale */}
        <path
          d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="text-muted-foreground/30"
        />

        {/* Tick marks */}
        {tickMarks.map(({ angle: tickAngle, length, width, showLabel }) => {
          const rad = (tickAngle - 90) * (Math.PI / 180);
          const x1 = centerX + (radius - length) * Math.cos(rad);
          const y1 = centerY + (radius - length) * Math.sin(rad);
          const x2 = centerX + radius * Math.cos(rad);
          const y2 = centerY + radius * Math.sin(rad);
          const labelX = centerX + (radius - 25) * Math.cos(rad);
          const labelY = centerY + (radius - 25) * Math.sin(rad);
          
          return (
            <g key={tickAngle}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="currentColor"
                strokeWidth={width}
                className="text-foreground/60"
              />
              {showLabel && (
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="text-xs fill-current text-muted-foreground font-medium"
                >
                  {Math.abs(tickAngle)}°
                </text>
              )}
            </g>
          );
        })}

        {/* Center level indicator line */}
        <line
          x1={centerX}
          y1={centerY}
          x2={centerX}
          y2={centerY - radius + 10}
          stroke="currentColor"
          strokeWidth={3}
          className={cn(
            "transition-colors duration-300",
            isLevel ? "text-success" : "text-muted-foreground/50"
          )}
        />

        {/* Locked angle indicator */}
        {isLocked && lockedAngle !== null && (
          <line
            x1={centerX}
            y1={centerY}
            x2={centerX + (radius - 30) * Math.cos((lockedAngle - 90) * Math.PI / 180)}
            y2={centerY + (radius - 30) * Math.sin((lockedAngle - 90) * Math.PI / 180)}
            stroke="hsl(var(--accent))"
            strokeWidth={4}
            strokeLinecap="round"
            className="drop-shadow-md"
          />
        )}

        {/* Pendulum line (gravity indicator) */}
        {!isLocked && (
          <>
            <line
              x1={centerX}
              y1={centerY}
              x2={pendulumX}
              y2={pendulumY}
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              strokeLinecap="round"
              className="transition-all duration-100 ease-out"
            />
            {/* Pendulum weight */}
            <circle
              cx={pendulumX}
              cy={pendulumY}
              r={8}
              fill="hsl(var(--primary))"
              className="transition-all duration-100 ease-out drop-shadow-lg"
            />
          </>
        )}

        {/* Arc bubble indicator */}
        <circle
          cx={bubbleX}
          cy={bubbleY}
          r={12}
          fill={isLevel ? "hsl(var(--success))" : isNearLevel ? "hsl(var(--warning))" : "hsl(var(--primary))"}
          className="transition-all duration-100 ease-out drop-shadow-md"
        />
        <circle
          cx={bubbleX - 3}
          cy={bubbleY - 3}
          r={4}
          fill="white"
          opacity={0.5}
        />

        {/* Center pivot point */}
        <circle
          cx={centerX}
          cy={centerY}
          r={6}
          fill="hsl(var(--foreground))"
          className="drop-shadow"
        />
      </svg>

      {/* Center display */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ paddingTop: size * 0.15 }}>
        <div className="bg-card/95 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-inner border border-border">
          <div className="text-center">
            <div className="font-mono text-4xl font-bold text-foreground tabular-nums">
              {displayAngle}°
            </div>
            <div className={cn(
              "text-xs font-medium mt-1 transition-colors duration-300",
              isLevel ? "text-success" : isNearLevel ? "text-warning" : "text-muted-foreground"
            )}>
              {isLevel ? "LEVEL" : isNearLevel ? "ALMOST LEVEL" : "DIP ANGLE"}
            </div>
          </div>
        </div>
      </div>

      {/* Lock indicator */}
      {isLocked && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-success text-success-foreground px-3 py-1 rounded-full text-xs font-bold shadow-lg">
          LOCKED
        </div>
      )}

      {/* Instruction text */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <p className="text-xs text-muted-foreground">
          {isLocked ? "Tap unlock to measure again" : "Tilt device to measure angle"}
        </p>
      </div>
    </div>
  );
};