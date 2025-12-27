import React from 'react';
import { cn } from '@/lib/utils';

interface BubbleLevelProps {
  pitch: number; // Beta: front-to-back tilt (-180 to 180)
  roll: number;  // Gamma: left-to-right tilt (-90 to 90)
  size?: number;
  className?: string;
}

export const BubbleLevel: React.FC<BubbleLevelProps> = ({
  pitch,
  roll,
  size = 80,
  className,
}) => {
  // Clamp values to reasonable ranges and normalize to -1 to 1
  const normalizedPitch = Math.max(-1, Math.min(1, pitch / 45));
  const normalizedRoll = Math.max(-1, Math.min(1, roll / 45));
  
  // Calculate bubble position (inverted because bubble moves opposite to tilt)
  const bubbleX = -normalizedRoll * (size / 2 - 12);
  const bubbleY = -normalizedPitch * (size / 2 - 12);
  
  // Determine if device is level (within threshold)
  const isLevel = Math.abs(pitch) < 3 && Math.abs(roll) < 3;
  const isNearLevel = Math.abs(pitch) < 8 && Math.abs(roll) < 8;

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div 
        className={cn(
          "relative rounded-full border-2 transition-colors duration-300",
          isLevel 
            ? "border-success bg-success/10" 
            : isNearLevel 
              ? "border-warning bg-warning/10" 
              : "border-muted-foreground/50 bg-muted/30"
        )}
        style={{ width: size, height: size }}
      >
        {/* Crosshairs */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-px bg-muted-foreground/30" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-full w-px bg-muted-foreground/30" />
        </div>
        
        {/* Center target circle */}
        <div 
          className={cn(
            "absolute rounded-full border transition-colors duration-300",
            isLevel ? "border-success" : "border-muted-foreground/40"
          )}
          style={{
            width: size / 3,
            height: size / 3,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        
        {/* Bubble */}
        <div
          className={cn(
            "absolute rounded-full shadow-lg transition-all duration-100 ease-out",
            isLevel 
              ? "bg-success" 
              : isNearLevel 
                ? "bg-warning" 
                : "bg-primary"
          )}
          style={{
            width: 16,
            height: 16,
            left: '50%',
            top: '50%',
            transform: `translate(calc(-50% + ${bubbleX}px), calc(-50% + ${bubbleY}px))`,
          }}
        >
          {/* Bubble highlight */}
          <div 
            className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white/60"
          />
        </div>
      </div>
      
      {/* Label */}
      <span className={cn(
        "text-xs font-medium",
        isLevel ? "text-success" : "text-muted-foreground"
      )}>
        {isLevel ? "Level" : isNearLevel ? "Almost" : "Tilted"}
      </span>
    </div>
  );
};

interface DualBubbleLevelProps {
  pitch: number;
  roll: number;
  className?: string;
}

export const DualBubbleLevel: React.FC<DualBubbleLevelProps> = ({
  pitch,
  roll,
  className,
}) => {
  // Normalize values
  const normalizedPitch = Math.max(-1, Math.min(1, pitch / 45));
  const normalizedRoll = Math.max(-1, Math.min(1, roll / 45));
  
  const isPitchLevel = Math.abs(pitch) < 3;
  const isRollLevel = Math.abs(roll) < 3;
  const isPitchNear = Math.abs(pitch) < 8;
  const isRollNear = Math.abs(roll) < 8;

  return (
    <div className={cn("flex gap-6 justify-center items-end", className)}>
      {/* Horizontal Level (Roll - left/right tilt) */}
      <div className="flex flex-col items-center gap-2">
        <div 
          className={cn(
            "relative w-20 h-10 rounded-full border-2 overflow-hidden transition-colors duration-300",
            isRollLevel 
              ? "border-success bg-success/10" 
              : isRollNear 
                ? "border-warning bg-warning/10" 
                : "border-muted-foreground/50 bg-muted/30"
          )}
        >
          {/* Center marker */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-muted-foreground/40" />
          <div className="absolute left-1/4 top-0 h-full w-px bg-muted-foreground/20" />
          <div className="absolute left-3/4 top-0 h-full w-px bg-muted-foreground/20" />
          
          {/* Bubble */}
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full shadow-md transition-all duration-100 ease-out",
              isRollLevel 
                ? "bg-success" 
                : isRollNear 
                  ? "bg-warning" 
                  : "bg-primary"
            )}
            style={{
              left: `calc(50% + ${-normalizedRoll * 24}px)`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white/50" />
          </div>
        </div>
        <span className="text-xs text-muted-foreground font-medium">Horizontal</span>
      </div>

      {/* Vertical Level (Pitch - front/back tilt) */}
      <div className="flex flex-col items-center gap-2">
        <div 
          className={cn(
            "relative w-10 h-20 rounded-full border-2 overflow-hidden transition-colors duration-300",
            isPitchLevel 
              ? "border-success bg-success/10" 
              : isPitchNear 
                ? "border-warning bg-warning/10" 
                : "border-muted-foreground/50 bg-muted/30"
          )}
        >
          {/* Center marker */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-muted-foreground/40" />
          <div className="absolute top-1/4 left-0 w-full h-px bg-muted-foreground/20" />
          <div className="absolute top-3/4 left-0 w-full h-px bg-muted-foreground/20" />
          
          {/* Bubble */}
          <div
            className={cn(
              "absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full shadow-md transition-all duration-100 ease-out",
              isPitchLevel 
                ? "bg-success" 
                : isPitchNear 
                  ? "bg-warning" 
                  : "bg-primary"
            )}
            style={{
              top: `calc(50% + ${-normalizedPitch * 32}px)`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white/50" />
          </div>
        </div>
        <span className="text-xs text-muted-foreground font-medium">Vertical</span>
      </div>
    </div>
  );
};