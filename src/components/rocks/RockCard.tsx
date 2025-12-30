import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Rock {
  id: string;
  name: string;
  type: string;
  image_url: string | null;
  description: string;
  composition: string | null;
  texture: string | null;
  color: string | null;
  hardness: number | null;
  grain_size: string | null;
}

interface RockCardProps {
  rock: Rock;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

const getTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case "igneous":
      return "bg-orange-500/90 text-white";
    case "sedimentary":
      return "bg-amber-500/90 text-white";
    case "metamorphic":
      return "bg-emerald-600/90 text-white";
    default:
      return "bg-[hsl(var(--geo-text-light))]/80 text-white";
  }
};

export const RockCard = ({ rock, isFavorite, onToggleFavorite }: RockCardProps) => {
  return (
    <Link to={`/rocks/${rock.id}`} className="block group h-full">
      <Card className="overflow-hidden h-full bg-white border border-border/50 shadow-sm 
                       transition-all duration-300 hover:shadow-lg hover:border-[hsl(var(--geo-brown))]/30
                       hover:-translate-y-1 rounded-2xl">
        {/* Image Container with 4:3 aspect ratio */}
        <div className="relative aspect-[4/3] bg-[hsl(var(--geo-cream))] overflow-hidden">
          <img
            src={rock.image_url || "/placeholder.svg"}
            alt={rock.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
          
          {/* Rock Type Badge - Top Left */}
          <div className="absolute top-3 left-3">
            <Badge 
              className={cn(
                "font-medium text-xs px-2.5 py-1 shadow-sm border-0 backdrop-blur-sm capitalize",
                getTypeColor(rock.type)
              )}
            >
              {rock.type}
            </Badge>
          </div>
          
          {/* Favorite Button - Top Right */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite(rock.id);
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

          {/* Hardness Badge - Bottom Left (if available) */}
          {rock.hardness && (
            <div className="absolute bottom-3 left-3">
              <Badge 
                className="bg-white/95 text-[hsl(var(--geo-text))] font-mono font-bold text-sm px-2.5 py-1 
                           shadow-sm border-0 backdrop-blur-sm"
              >
                H: {rock.hardness}
              </Badge>
            </div>
          )}

          {/* Texture Badge - Bottom Right (if available) */}
          {rock.texture && (
            <div className="absolute bottom-3 right-3">
              <Badge 
                variant="secondary"
                className="bg-black/60 text-white text-xs px-2 py-0.5 backdrop-blur-sm border-0"
              >
                <Layers className="w-3 h-3 mr-1" />
                {rock.texture}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-4 space-y-3">
          {/* Rock Name */}
          <h3 className="font-bold text-lg text-[hsl(var(--geo-text))] group-hover:text-[hsl(var(--geo-brown))] 
                         transition-colors duration-200 line-clamp-1">
            {rock.name}
          </h3>
          
          {/* Short Description */}
          <p className="text-sm text-[hsl(var(--geo-text-light))] line-clamp-2 leading-relaxed">
            {rock.description}
          </p>
          
          {/* Key Properties Row */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {rock.composition && (
              <Badge 
                variant="outline" 
                className="text-xs bg-[hsl(var(--geo-background))] border-border/50 
                           text-[hsl(var(--geo-text))] line-clamp-1"
              >
                {rock.composition.length > 25 ? rock.composition.slice(0, 25) + "…" : rock.composition}
              </Badge>
            )}
            {rock.grain_size && (
              <Badge 
                variant="outline" 
                className="text-xs bg-[hsl(var(--geo-background))] border-border/50 
                           text-[hsl(var(--geo-text-light))]"
              >
                {rock.grain_size}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};