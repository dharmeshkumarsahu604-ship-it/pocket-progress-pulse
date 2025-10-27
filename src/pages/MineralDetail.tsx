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
  uses: string | null;
}

export default function MineralDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useLocalStorage<string[]>("favorite-minerals", []);
  const [mineral, setMineral] = useState<Mineral | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const fetchMineral = async () => {
      if (!id) {
        setError("No mineral ID provided");
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
          .from("minerals")
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
          setError("Mineral not found in database");
          toast.error("Mineral not found");
        } else {
          setMineral(data);
        }
      } catch (error) {
        clearTimeout(timeoutId);
        if (isMounted) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to load mineral details";
          setError(errorMessage);
          toast.error(errorMessage);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMineral();

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
          <p className="text-muted-foreground">Loading mineral details...</p>
        </div>
      </AppLayout>
    );
  }
  
  if (error || !mineral) {
    return (
      <AppLayout>
        <div className="text-center py-12 space-y-4">
          <h1 className="text-2xl font-bold mb-2">Mineral Not Found</h1>
          <p className="text-muted-foreground mb-4">
            {error || "The requested mineral could not be found."}
          </p>
          <div className="text-xs text-muted-foreground mb-4 p-4 bg-muted rounded">
            <p>Debug Info:</p>
            <p>URL: {window.location.pathname}</p>
            <p>ID Parameter: {id || "undefined"}</p>
            <p>Error: {error || "No error message"}</p>
          </div>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate("/minerals")}>Back to Minerals</Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const isFavorite = favorites.includes(mineral.id);

  const toggleFavorite = () => {
    setFavorites((prev) =>
      prev.includes(mineral.id) ? prev.filter((fav) => fav !== mineral.id) : [...prev, mineral.id]
    );
    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: mineral.name,
          text: mineral.description,
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
          <Button variant="ghost" onClick={() => navigate("/minerals")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Minerals
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
            src={mineral.image_url || "/placeholder.svg"}
            alt={mineral.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold">{mineral.name}</h1>
            {mineral.chemical_formula && (
              <p className="text-xl font-mono text-muted-foreground mt-1">
                {mineral.chemical_formula}
              </p>
            )}
          </div>
            <Badge variant="secondary" className="text-base px-4 py-1">
              Hardness: {mineral.hardness}
            </Badge>
          </div>
          <p className="text-lg text-muted-foreground">{mineral.description}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Physical Properties</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Luster</p>
                <p className="text-base">{mineral.luster}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Streak</p>
                <p className="text-base">{mineral.streak}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cleavage</p>
                <p className="text-base">{mineral.cleavage}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fracture</p>
                <p className="text-base">{mineral.fracture}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Crystal System</p>
                <p className="text-base">{mineral.crystal_system}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Color</p>
                <p className="text-base">{mineral.color || "Not specified"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {mineral.uses && (
          <Card>
            <CardHeader>
              <CardTitle>Uses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base">{mineral.uses}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
