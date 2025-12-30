import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Hexagon } from "lucide-react";
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
  crystal_system?: string | null;
}

interface MineralCardProps {
  mineral: Mineral;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const MineralCard = ({ mineral, isFavorite, onToggleFavorite }: MineralCardProps) => {
  return (
    <Link to={`/minerals/${mineral.id}`} className="block group h-full">
      <Card className="overflow-hidden h-full bg-white border border-border/50 shadow-sm 
                       transition-all duration-300 hover:shadow-lg hover:border-[hsl(var(--geo-green))]/30
                       hover:-translate-y-1 rounded-2xl">
        {/* Image Container with 4:3 aspect ratio */}
        <div className="relative aspect-[4/3] bg-[hsl(var(--geo-cream))] overflow-hidden">
          <img
            src={mineral.image_url || "/placeholder.svg"}
            alt={mineral.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
          
          {/* Hardness Badge - Top Left */}
          <div className="absolute top-3 left-3">
            <Badge 
              className="bg-white/95 text-[hsl(var(--geo-text))] font-mono font-bold text-sm px-2.5 py-1 
                         shadow-sm border-0 backdrop-blur-sm"
            >
              H: {mineral.hardness}
            </Badge>
          </div>
          
          {/* Favorite Button - Top Right */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite(mineral.id);
            }}
            className={cn(
              "absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center",
              "bg-white/95 backdrop-blur-sm shadow-sm transition-all duration-200",
              "hover:scale-110 active:scale-95",
              isFavorite && "bg-red-50"
            )}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={cn(
                "w-5 h-5 transition-all duration-200",
                isFavorite 
                  ? "fill-red-500 text-red-500" 
                  : "text-[hsl(var(--geo-text-light))] hover:text-red-400"
              )}
            />
          </button>

          {/* Crystal System Badge - Bottom Left (optional) */}
          {mineral.crystal_system && (
            <div className="absolute bottom-3 left-3">
              <Badge 
                variant="secondary"
                className="bg-black/60 text-white text-xs px-2 py-0.5 backdrop-blur-sm border-0"
              >
                <Hexagon className="w-3 h-3 mr-1" />
                {mineral.crystal_system}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-4 space-y-3">
          {/* Mineral Name */}
          <h3 className="font-bold text-lg text-[hsl(var(--geo-text))] group-hover:text-[hsl(var(--geo-green))] 
                         transition-colors duration-200 line-clamp-1">
            {mineral.name}
          </h3>
          
          {/* Short Description */}
          <p className="text-sm text-[hsl(var(--geo-text-light))] line-clamp-2 leading-relaxed">
            {mineral.description}
          </p>
          
          {/* Key Properties Row */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {mineral.chemical_formula && (
              <Badge 
                variant="outline" 
                className="font-mono text-xs bg-[hsl(var(--geo-background))] border-border/50 
                           text-[hsl(var(--geo-text))]"
              >
                {mineral.chemical_formula}
              </Badge>
            )}
            {mineral.luster && (
              <Badge 
                variant="outline" 
                className="text-xs bg-[hsl(var(--geo-background))] border-border/50 
                           text-[hsl(var(--geo-text-light))]"
              >
                {mineral.luster}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};