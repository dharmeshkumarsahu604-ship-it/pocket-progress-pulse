import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Mineral {
  id: string;
  name: string;
  chemical_formula: string | null;
  image_url: string | null;
  description: string;
  luster: string | null;
  hardness: number;
}

interface MineralCardProps {
  mineral: Mineral;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const MineralCard = ({ mineral, isFavorite, onToggleFavorite }: MineralCardProps) => {
  return (
    <Link to={`/minerals/${mineral.id}`} className="block group">
      <Card className="overflow-hidden transition-all duration-300 border-2 hover:border-primary/20 h-full hover-lift">
        <div className="relative aspect-square bg-muted overflow-hidden">
          <img
            src={mineral.image_url || "/placeholder.svg"}
            alt={mineral.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            loading="lazy"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite(mineral.id);
            }}
            className="absolute top-2 right-2 p-2 rounded-full bg-card/90 backdrop-blur-sm hover:bg-card transition-all duration-200 hover:scale-110"
          >
            <Heart
              className={cn(
                "h-5 w-5",
                isFavorite ? "fill-destructive text-destructive" : "text-muted-foreground"
              )}
            />
          </button>
        </div>
        <CardContent className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors duration-200">{mineral.name}</h3>
            <Badge variant="outline" className="shrink-0 font-mono text-xs">
              {mineral.hardness}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {mineral.description}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {mineral.chemical_formula && (
              <>
                <span className="font-mono">{mineral.chemical_formula}</span>
                {mineral.luster && <span>•</span>}
              </>
            )}
            {mineral.luster && <span className="truncate">{mineral.luster}</span>}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
