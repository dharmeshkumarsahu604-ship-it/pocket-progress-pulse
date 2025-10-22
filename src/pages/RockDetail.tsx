import { AppLayout } from "@/components/layout/AppLayout";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, Share2 } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

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
  formation_process: string | null;
}

export default function RockDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useLocalStorage<string[]>("favorite-rocks", []);
  const [rock, setRock] = useState<Rock | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRock = async () => {
      try {
        const { data, error } = await supabase
          .from("rocks")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (error) throw error;
        setRock(data);
      } catch (error) {
        console.error("Error fetching rock:", error);
        toast.error("Failed to load rock details");
      } finally {
        setLoading(false);
      }
    };

    fetchRock();
  }, [id]);

  if (loading) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p>Loading...</p>
        </div>
      </AppLayout>
    );
  }
  
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
            src={rock.image_url || "/placeholder.svg"}
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
                <p className="text-base">{rock.composition || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Texture</p>
                <p className="text-base">{rock.texture || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hardness</p>
                <p className="text-base">{rock.hardness ? `${rock.hardness} (Mohs scale)` : "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Color</p>
                <p className="text-base">{rock.color || "Not specified"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {rock.formation_process && (
          <Card>
            <CardHeader>
              <CardTitle>Formation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{rock.formation_process}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
