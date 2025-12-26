import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { X, Smartphone, RotateCcw, CheckCircle } from 'lucide-react';

interface CalibrationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  accuracy: 'low' | 'medium' | 'high' | 'unknown';
}

export const CalibrationOverlay: React.FC<CalibrationOverlayProps> = ({
  isOpen,
  onClose,
  accuracy,
}) => {
  const [animationStep, setAnimationStep] = useState(0);
  const [calibrationProgress, setCalibrationProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setAnimationStep(0);
      setCalibrationProgress(0);
      return;
    }

    const stepInterval = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 4);
    }, 800);

    return () => clearInterval(stepInterval);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    if (accuracy === 'high') {
      setCalibrationProgress(100);
    } else if (accuracy === 'medium') {
      setCalibrationProgress(prev => Math.max(prev, 60));
    } else if (accuracy === 'low') {
      setCalibrationProgress(prev => Math.min(prev + 5, 40));
    }
  }, [accuracy, isOpen]);

  if (!isOpen) return null;

  const isCalibrated = accuracy === 'high' || accuracy === 'medium';

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-md animate-scale-in">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="flex items-center gap-2">
            {isCalibrated ? (
              <CheckCircle className="h-5 w-5 text-success" />
            ) : (
              <RotateCcw className="h-5 w-5 text-accent animate-spin-slow" />
            )}
            Compass Calibration
          </CardTitle>
          <CardDescription>
            {isCalibrated 
              ? 'Your compass is calibrated and ready to use!'
              : 'Move your device in a figure-8 pattern to calibrate the magnetometer'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Figure-8 animation */}
          <div className="relative h-48 bg-muted/30 rounded-lg overflow-hidden">
            <svg
              viewBox="0 0 200 120"
              className="w-full h-full"
            >
              {/* Figure-8 path */}
              <path
                d="M 50 60 C 50 30, 100 30, 100 60 C 100 90, 150 90, 150 60 C 150 30, 100 30, 100 60 C 100 90, 50 90, 50 60"
                fill="none"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="2"
                strokeDasharray="5,5"
                opacity="0.5"
              />
              
              {/* Animated phone icon along path */}
              <g 
                className="transition-transform duration-700"
                style={{
                  transform: `translate(${
                    animationStep === 0 ? 45 : 
                    animationStep === 1 ? 95 : 
                    animationStep === 2 ? 145 : 
                    95
                  }px, ${
                    animationStep === 0 ? 55 : 
                    animationStep === 1 ? 55 : 
                    animationStep === 2 ? 55 : 
                    55
                  }px) rotate(${
                    animationStep === 0 ? -30 :
                    animationStep === 1 ? 0 :
                    animationStep === 2 ? 30 :
                    0
                  }deg)`
                }}
              >
                <rect
                  x="-10"
                  y="-15"
                  width="20"
                  height="30"
                  rx="3"
                  fill="hsl(var(--accent))"
                  className="drop-shadow-md"
                />
                <rect
                  x="-7"
                  y="-12"
                  width="14"
                  height="20"
                  rx="1"
                  fill="hsl(var(--card))"
                />
                <circle
                  cx="0"
                  cy="11"
                  r="2"
                  fill="hsl(var(--muted))"
                />
              </g>
            </svg>
            
            {/* Instructions */}
            <div className="absolute bottom-2 left-0 right-0 text-center text-sm text-muted-foreground">
              {isCalibrated ? 'Calibration complete!' : 'Move your device slowly...'}
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Calibration Progress</span>
              <span className="font-mono">{Math.round(calibrationProgress)}%</span>
            </div>
            <Progress value={calibrationProgress} className="h-2" />
          </div>

          {/* Accuracy indicator */}
          <div className="flex items-center justify-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              accuracy === 'high' ? 'bg-success' :
              accuracy === 'medium' ? 'bg-warning' :
              accuracy === 'low' ? 'bg-destructive animate-pulse' :
              'bg-muted'
            }`} />
            <span className="text-sm font-medium">
              Accuracy: {accuracy === 'unknown' ? 'Calibrating' : accuracy.charAt(0).toUpperCase() + accuracy.slice(1)}
            </span>
          </div>

          {/* Tips */}
          <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground space-y-1">
            <p><strong>Tips for better calibration:</strong></p>
            <ul className="list-disc list-inside space-y-0.5 text-xs">
              <li>Move away from metal objects and electronics</li>
              <li>Remove phone cases with magnets</li>
              <li>Rotate device in all 3 axes</li>
              <li>Move slowly and smoothly</li>
            </ul>
          </div>

          {isCalibrated && (
            <Button onClick={onClose} className="w-full">
              Start Using Compass
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
