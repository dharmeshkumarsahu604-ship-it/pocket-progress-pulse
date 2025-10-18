import { AppLayout } from "@/components/layout/AppLayout";
import { useParams, useNavigate } from "react-router-dom";
import { mockRocks } from "@/data/mockRocks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, Share2 } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function RockDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useLocalStorage<string[]>("favorite-rocks", []);
  
  const rock = mockRocks.find((r) => r.id === id);
  
  if (!rock) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Rock not found</h1>
          <Button onClick={() => navigate("/rocks")}>Back to Rocks</Button>
        </div>
      </AppLayout>
    );
  }

  const isFavorite = favorites.includes(rock.id);

  const toggleFavorite = () => {
    setFavorites((prev) =>
      prev.includes(rock.id) ? prev.filter((fav) => fav !== rock.id) : [...prev, rock.id]
    );
    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: rock.name,
          text: rock.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/rocks")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Rocks
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={toggleFavorite}>
              <Heart
                className={cn(
                  "h-5 w-5",
                  isFavorite && "fill-destructive text-destructive"
                )}
              />
            </Button>
            <Button variant="outline" size="icon" onClick={handleShare}>
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="aspect-video bg-muted rounded-lg overflow-hidden">
          <img
            src={rock.image}
            alt={rock.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-4xl font-bold">{rock.name}</h1>
            <Badge variant="secondary" className="text-base px-4 py-1">
              {rock.type}
            </Badge>
          </div>
          <p className="text-lg text-muted-foreground">{rock.description}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Properties</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Composition</p>
                <p className="text-base">{rock.composition}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Texture</p>
                <p className="text-base">{rock.texture}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hardness</p>
                <p className="text-base">{rock.hardness} (Mohs scale)</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Colors</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {rock.color.map((color) => (
                    <Badge key={color} variant="outline">
                      {color}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Formation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{rock.formation}</p>
          </CardContent>
        </Card>

        {mockRocks.filter((r) => r.type === rock.type && r.id !== rock.id).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Related Rocks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {mockRocks
                  .filter((r) => r.type === rock.type && r.id !== rock.id)
                  .slice(0, 3)
                  .map((relatedRock) => (
                    <button
                      key={relatedRock.id}
                      onClick={() => navigate(`/rocks/${relatedRock.id}`)}
                      className="text-left space-y-2 group"
                    >
                      <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                        <img
                          src={relatedRock.image}
                          alt={relatedRock.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <p className="font-medium text-sm">{relatedRock.name}</p>
                    </button>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
