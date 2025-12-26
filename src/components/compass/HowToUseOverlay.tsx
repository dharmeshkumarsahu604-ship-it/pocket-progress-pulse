import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  X, 
  ChevronRight, 
  Compass, 
  Target, 
  Hand, 
  RotateCcw,
  Smartphone
} from 'lucide-react';

interface HowToUseOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  {
    icon: Compass,
    title: 'Hold Device Level',
    description: 'Hold your phone horizontally like a real Brunton compass. The screen should face up.',
  },
  {
    icon: Target,
    title: 'Align with Strike Direction',
    description: 'Point the top of your phone along the strike direction of the geological plane.',
  },
  {
    icon: Hand,
    title: 'Lock the Reading',
    description: 'When the compass stabilizes, tap "Lock Reading" to capture the measurement.',
  },
  {
    icon: RotateCcw,
    title: 'Measure Dip',
    description: 'For dip, rotate the phone perpendicular to strike and tilt along the dip direction.',
  },
];

const TIPS = [
  'Calibrate the compass by moving device in a figure-8 pattern',
  'Stay away from magnetic materials (metal, electronics)',
  'Use True North setting for geologically accurate readings',
  'Right-Hand Rule: Dip direction is 90° clockwise from strike',
  'Save readings with photos and notes for complete documentation',
];

export const HowToUseOverlay: React.FC<HowToUseOverlayProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-auto">
      <div className="container max-w-lg mx-auto p-4 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-background/80 backdrop-blur-sm py-2 z-10">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Compass className="h-6 w-6 text-primary" />
            How to Use Brunton Compass
          </h1>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Steps */}
        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-semibold">Step-by-Step Guide</h2>
          {STEPS.map((step, index) => (
            <Card key={index} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <CardContent className="p-4 flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    <span className="text-primary">{index + 1}.</span>
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {step.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Measurement Modes */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Measurement Modes</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { mode: 'Strike', desc: 'Horizontal direction of a plane' },
              { mode: 'Dip', desc: 'Maximum inclination angle' },
              { mode: 'Strike & Dip', desc: 'Complete plane orientation' },
              { mode: 'Trend & Plunge', desc: 'Linear feature direction' },
            ].map(({ mode, desc }, i) => (
              <Card key={mode} className="bg-muted/30">
                <CardContent className="p-3">
                  <div className="font-medium text-sm">{mode}</div>
                  <div className="text-xs text-muted-foreground">{desc}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Pro Tips</h2>
          <Card className="bg-accent/10 border-accent/20">
            <CardContent className="p-4">
              <ul className="space-y-2">
                {TIPS.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <ChevronRight className="h-4 w-4 mt-0.5 text-accent flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Demo illustration */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Holding Position</h2>
          <Card className="overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center relative">
              {/* Simple illustration */}
              <div className="relative">
                <Smartphone className="h-32 w-32 text-foreground/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full border-4 border-dashed border-primary/50 flex items-center justify-center">
                    <Compass className="h-8 w-8 text-primary" />
                  </div>
                </div>
              </div>
              <div className="absolute bottom-4 left-0 right-0 text-center text-sm text-muted-foreground">
                Hold device flat with screen facing up
              </div>
            </div>
          </Card>
        </div>

        {/* Close button */}
        <Button onClick={onClose} className="w-full" size="lg">
          Start Measuring
        </Button>
      </div>
    </div>
  );
};
