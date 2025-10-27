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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const fetchRock = async () => {
      if (!id) {
        setError("No rock ID provided");
        setLoading(false);
        return;
      }

      try {
        // Clear previous error on retry
        if (error) {
          setError(null);
        }

        // Set a 5-second timeout
        timeoutId = setTimeout(() => {
          if (isMounted && loading) {
            setError("Request timeout. Please check your internet connection and try again.");
            setLoading(false);
            toast.error("Request timeout");
          }
        }, 5000);

        const { data, error: fetchError } = await supabase
          .from("rocks")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        clearTimeout(timeoutId);

        if (!isMounted) return;

        if (fetchError) {
          console.error("Supabase error:", fetchError);
          throw new Error(fetchError.message || "Database query failed");
        }

        if (!data) {
          setError("Rock not found in database");
          toast.error("Rock not found");
        } else {
          setRock(data);
        }
      } catch (error) {
        clearTimeout(timeoutId);
        if (isMounted) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to load rock details";
          setError(errorMessage);
          toast.error(errorMessage);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRock();

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [id]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading rock details...</p>
        </div>
      </AppLayout>
    );
  }
  
  if (error || !rock) {
    return (
      <AppLayout>
        <div className="text-center py-12 space-y-4">
          <h1 className="text-2xl font-bold mb-2">Rock Not Found</h1>
          <p className="text-muted-foreground mb-4">
            {error || "The requested rock could not be found."}
          </p>
          <div className="text-xs text-muted-foreground mb-4 p-4 bg-muted rounded">
            <p>Debug Info:</p>
            <p>URL: {window.location.pathname}</p>
            <p>ID Parameter: {id || "undefined"}</p>
            <p>Error: {error || "No error message"}</p>
          </div>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate("/rocks")}>Back to Rocks</Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
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
