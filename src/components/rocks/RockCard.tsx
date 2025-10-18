import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
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
}

interface RockCardProps {
  rock: Rock;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const RockCard = ({ rock, isFavorite, onToggleFavorite }: RockCardProps) => {
  return (
    <Link to={`/rocks/${rock.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative aspect-square bg-muted">
          <img
            src={rock.image_url || "/placeholder.svg"}
            alt={rock.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite(rock.id);
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
            <h3 className="font-semibold text-lg truncate">{rock.name}</h3>
            <Badge variant="secondary" className="shrink-0 capitalize">
              {rock.type}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {rock.description}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {rock.hardness && (
              <>
                <span>Hardness: {rock.hardness}</span>
                {rock.texture && <span>•</span>}
              </>
            )}
            {rock.texture && <span className="truncate">{rock.texture}</span>}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
