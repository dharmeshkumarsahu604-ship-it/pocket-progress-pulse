import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mineral } from "@/data/mockMinerals";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface MineralCardProps {
  mineral: Mineral;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const MineralCard = ({ mineral, isFavorite, onToggleFavorite }: MineralCardProps) => {
  return (
    <Link to={`/minerals/${mineral.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative aspect-square bg-muted">
          <img
            src={mineral.image}
            alt={mineral.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite(mineral.id);
            }}
            className="absolute top-2 right-2 p-2 rounded-full bg-card/90 backdrop-blur-sm hover:bg-card transition-colors"
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
            <h3 className="font-semibold text-lg truncate">{mineral.name}</h3>
            <Badge variant="outline" className="shrink-0 font-mono text-xs">
              {mineral.hardness}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {mineral.description}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-mono">{mineral.formula}</span>
            <span>•</span>
            <span className="truncate">{mineral.luster}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
