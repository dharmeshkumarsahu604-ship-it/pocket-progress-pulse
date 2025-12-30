import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  Hexagon, 
  Sparkles, 
  Palette, 
  CircleDot, 
  Layers, 
  Gem,
  Check,
  Minus
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Mineral {
  id: string;
  name: string;
  chemical_formula: string | null;
  image_url: string | null;
  description: string;
  hardness: number;
  luster: string | null;
  color: string | null;
  streak: string | null;
  cleavage: string | null;
  fracture: string | null;
  crystal_system: string | null;
  specific_gravity: number | null;
  uses: string | null;
}

interface MineralComparisonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  minerals: Mineral[];
  onRemoveMineral: (id: string) => void;
}

interface PropertyRowProps {
  label: string;
  icon: React.ElementType;
  values: (string | number | null)[];
  highlight?: boolean;
}

const PropertyRow = ({ label, icon: Icon, values, highlight }: PropertyRowProps) => {
  const isDifferent = values[0] !== values[1] && values[0] && values[1];
  
  return (
    <div className={cn(
      "grid grid-cols-[1fr_2fr_2fr] gap-3 py-3 border-b border-border/30 last:border-0",
      highlight && "bg-[hsl(var(--geo-cream))]/50"
    )}>
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-[hsl(var(--geo-amber))]" />
        <span className="text-xs font-medium text-[hsl(var(--geo-text-light))]">{label}</span>
      </div>
      {values.map((value, index) => (
        <div 
          key={index} 
          className={cn(
            "text-sm text-[hsl(var(--geo-text))]",
            isDifferent && "font-medium",
            !value && "text-[hsl(var(--geo-text-light))] italic"
          )}
        >
          {value || "Not specified"}
        </div>
      ))}
    </div>
  );
};

const ComparisonIndicator = ({ value1, value2 }: { value1: number; value2: number }) => {
  if (value1 === value2) {
    return (
      <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
        <Minus className="w-3 h-3 mr-1" />
        Equal
      </Badge>
    );
  }
  
  const isHigher = value1 > value2;
  return (
    <Badge 
      variant="outline" 
      className={cn(
        isHigher 
          ? "bg-green-50 text-green-600 border-green-200" 
          : "bg-amber-50 text-amber-600 border-amber-200"
      )}
    >
      {isHigher ? "Higher" : "Lower"}
    </Badge>
  );
};

export const MineralComparisonModal = ({ 
  open, 
  onOpenChange, 
  minerals,
  onRemoveMineral 
}: MineralComparisonModalProps) => {
  if (minerals.length < 2) return null;

  const [mineral1, mineral2] = minerals;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden p-0 gap-0">
        <DialogHeader className="p-5 pb-4 border-b border-border/50 bg-gradient-to-r from-[hsl(var(--geo-green))] to-[hsl(var(--geo-brown))]">
          <DialogTitle className="text-xl font-bold text-white">
            Mineral Comparison
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Mineral Headers */}
          <div className="grid grid-cols-[1fr_2fr_2fr] gap-3 p-4 bg-[hsl(var(--geo-background))] border-b border-border/50 sticky top-0 z-10">
            <div className="text-xs font-semibold text-[hsl(var(--geo-text-light))] uppercase tracking-wider">
              Property
            </div>
            
            {[mineral1, mineral2].map((mineral) => (
              <div key={mineral.id} className="relative">
                <div className="bg-white rounded-xl p-3 border border-border/50 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-[hsl(var(--geo-cream))] shrink-0">
                      <img
                        src={mineral.image_url || "/placeholder.svg"}
                        alt={mineral.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-[hsl(var(--geo-text))] truncate">
                        {mineral.name}
                      </h3>
                      {mineral.chemical_formula && (
                        <p className="text-xs font-mono text-[hsl(var(--geo-text-light))] truncate">
                          {mineral.chemical_formula}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveMineral(mineral.id)}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-100 text-red-500 
                             flex items-center justify-center hover:bg-red-200 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Hardness Comparison (Special) */}
          <div className="p-4 bg-white border-b border-border/50">
            <div className="grid grid-cols-[1fr_2fr_2fr] gap-3 items-center">
              <div className="flex items-center gap-2">
                <Gem className="w-4 h-4 text-[hsl(var(--geo-amber))]" />
                <span className="text-xs font-medium text-[hsl(var(--geo-text-light))]">Hardness</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-[hsl(var(--geo-text))]">
                  {mineral1.hardness}
                </span>
                <ComparisonIndicator value1={mineral1.hardness} value2={mineral2.hardness} />
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-[hsl(var(--geo-text))]">
                  {mineral2.hardness}
                </span>
                <ComparisonIndicator value1={mineral2.hardness} value2={mineral1.hardness} />
              </div>
            </div>
            
            {/* Visual Hardness Bar */}
            <div className="mt-3 grid grid-cols-[1fr_2fr_2fr] gap-3">
              <div />
              <div className="h-2 bg-[hsl(var(--geo-cream))] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[hsl(var(--geo-green))] rounded-full transition-all"
                  style={{ width: `${(mineral1.hardness / 10) * 100}%` }}
                />
              </div>
              <div className="h-2 bg-[hsl(var(--geo-cream))] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[hsl(var(--geo-amber))] rounded-full transition-all"
                  style={{ width: `${(mineral2.hardness / 10) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Property Rows */}
          <div className="p-4 bg-white">
            <PropertyRow 
              label="Crystal System" 
              icon={Hexagon} 
              values={[mineral1.crystal_system, mineral2.crystal_system]} 
            />
            <PropertyRow 
              label="Luster" 
              icon={Sparkles} 
              values={[mineral1.luster, mineral2.luster]} 
            />
            <PropertyRow 
              label="Color" 
              icon={Palette} 
              values={[mineral1.color, mineral2.color]} 
            />
            <PropertyRow 
              label="Streak" 
              icon={CircleDot} 
              values={[mineral1.streak, mineral2.streak]} 
            />
            <PropertyRow 
              label="Cleavage" 
              icon={Layers} 
              values={[mineral1.cleavage, mineral2.cleavage]} 
            />
            <PropertyRow 
              label="Fracture" 
              icon={Gem} 
              values={[mineral1.fracture, mineral2.fracture]} 
            />
            
            {/* Specific Gravity */}
            {(mineral1.specific_gravity || mineral2.specific_gravity) && (
              <div className="grid grid-cols-[1fr_2fr_2fr] gap-3 py-3 border-b border-border/30">
                <div className="flex items-center gap-2">
                  <Gem className="w-4 h-4 text-[hsl(var(--geo-amber))]" />
                  <span className="text-xs font-medium text-[hsl(var(--geo-text-light))]">Sp. Gravity</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-[hsl(var(--geo-text))]">
                    {mineral1.specific_gravity || "—"}
                  </span>
                  {mineral1.specific_gravity && mineral2.specific_gravity && (
                    <ComparisonIndicator 
                      value1={mineral1.specific_gravity} 
                      value2={mineral2.specific_gravity} 
                    />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-[hsl(var(--geo-text))]">
                    {mineral2.specific_gravity || "—"}
                  </span>
                  {mineral1.specific_gravity && mineral2.specific_gravity && (
                    <ComparisonIndicator 
                      value1={mineral2.specific_gravity} 
                      value2={mineral1.specific_gravity} 
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Uses Comparison */}
          {(mineral1.uses || mineral2.uses) && (
            <div className="p-4 bg-[hsl(var(--geo-background))] border-t border-border/50">
              <h4 className="text-sm font-semibold text-[hsl(var(--geo-text))] mb-3">
                Uses & Applications
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-3 border border-border/50">
                  <p className="text-xs text-[hsl(var(--geo-text-light))] leading-relaxed">
                    {mineral1.uses || "No uses specified"}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-3 border border-border/50">
                  <p className="text-xs text-[hsl(var(--geo-text-light))] leading-relaxed">
                    {mineral2.uses || "No uses specified"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="p-4 bg-[hsl(var(--geo-cream))] border-t border-border/50">
            <div className="flex items-center gap-2 text-sm text-[hsl(var(--geo-text))]">
              <Check className="w-4 h-4 text-[hsl(var(--geo-green))]" />
              <span>
                <strong>{mineral1.name}</strong> has a hardness of {mineral1.hardness}, 
                while <strong>{mineral2.name}</strong> has a hardness of {mineral2.hardness}.
                {mineral1.hardness > mineral2.hardness 
                  ? ` ${mineral1.name} is harder.`
                  : mineral1.hardness < mineral2.hardness
                  ? ` ${mineral2.name} is harder.`
                  : " They have equal hardness."}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border/50 bg-white">
          <Button 
            onClick={() => onOpenChange(false)}
            className="w-full bg-[hsl(var(--geo-green))] hover:bg-[hsl(var(--geo-green))]/90"
          >
            Close Comparison
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};