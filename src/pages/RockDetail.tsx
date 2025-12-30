import { AppLayout } from "@/components/layout/AppLayout";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Bookmark, 
  FileText, 
  Mountain,
  Layers,
  Palette,
  Gem,
  Wrench,
  MapPin,
  AlertTriangle,
  ChevronRight,
  Flame,
  Waves,
  Zap,
  Grid3X3
} from "lucide-react";
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
  grain_size: string | null;
  uses: string | null;
  locations: string[] | null;
}

// Get rock type badge styling
const getRockTypeStyles = (type: string) => {
  switch (type?.toLowerCase()) {
    case "igneous":
      return {
        bg: "bg-[#D97706]",
        icon: Flame,
        label: "Igneous"
      };
    case "sedimentary":
      return {
        bg: "bg-[#8B4513]",
        icon: Waves,
        label: "Sedimentary"
      };
    case "metamorphic":
      return {
        bg: "bg-[#2E7D32]",
        icon: Zap,
        label: "Metamorphic"
      };
    default:
      return {
        bg: "bg-[hsl(var(--geo-text-light))]",
        icon: Mountain,
        label: type
      };
  }
};

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
        if (error) {
          setError(null);
        }

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

  // Loading State with Skeleton
  if (loading) {
    return (
      <AppLayout>
        <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
          {/* Hero Skeleton */}
          <Skeleton className="w-full aspect-[16/9] rounded-2xl" />
          
          {/* Quick Facts Skeleton */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-32 rounded-xl flex-shrink-0" />
            ))}
          </div>
          
          {/* Overview Skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
          
          {/* Properties Skeleton */}
          <div className="grid grid-cols-2 gap-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }
  
  // Error State
  if (error || !rock) {
    return (
      <AppLayout>
        <div className="text-center py-16 space-y-6 animate-fade-in">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-[hsl(var(--geo-cream))] flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-[hsl(var(--geo-amber))]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[hsl(var(--geo-text))] mb-2">Rock Not Found</h1>
            <p className="text-[hsl(var(--geo-text-light))] max-w-md mx-auto">
              {error || "The requested rock could not be found in our database."}
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <Button 
              onClick={() => navigate("/rocks")}
              className="bg-[hsl(var(--geo-brown))] hover:bg-[hsl(var(--geo-brown))]/90"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Rocks
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const isFavorite = favorites.includes(rock.id);
  const rockTypeStyles = getRockTypeStyles(rock.type);
  const TypeIcon = rockTypeStyles.icon;

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

  const quickFacts = [
    { icon: TypeIcon, label: "Type", value: rockTypeStyles.label },
    { icon: Layers, label: "Texture", value: rock.texture },
    { icon: Grid3X3, label: "Grain Size", value: rock.grain_size },
    { icon: Gem, label: "Hardness", value: rock.hardness?.toString() },
  ].filter(fact => fact.value);

  const properties = [
    { icon: Mountain, label: "Composition", value: rock.composition },
    { icon: Layers, label: "Texture", value: rock.texture },
    { icon: Gem, label: "Hardness", value: rock.hardness ? `${rock.hardness} (Mohs)` : null },
    { icon: Palette, label: "Color", value: rock.color },
    { icon: Grid3X3, label: "Grain Size", value: rock.grain_size },
  ].filter(prop => prop.value);

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl mx-auto pb-24">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate("/rocks")}
          className="text-[hsl(var(--geo-text-light))] hover:text-[hsl(var(--geo-text))] -ml-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Rocks
        </Button>

        {/* Immersive Hero Section */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg animate-fade-in">
          <div className="aspect-[16/9] sm:aspect-[2/1]">
            <img
              src={rock.image_url || "/placeholder.svg"}
              alt={rock.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  {rock.name}
                </h1>
                <Badge 
                  className={cn(
                    "text-white font-semibold text-sm px-3 py-1.5 rounded-full border-0 shadow-lg capitalize",
                    rockTypeStyles.bg
                  )}
                >
                  <TypeIcon className="w-4 h-4 mr-1.5" />
                  {rockTypeStyles.label}
                </Badge>
              </div>
              {rock.hardness && (
                <Badge 
                  className="bg-white/95 text-[hsl(var(--geo-text))] font-mono font-bold text-base px-4 py-2 
                             rounded-full border-0 shadow-lg shrink-0 backdrop-blur-sm"
                >
                  H: {rock.hardness}
                </Badge>
              )}
            </div>
          </div>

          {/* Top Right Actions */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={toggleFavorite}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                "bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-200",
                "hover:scale-110 active:scale-95",
                isFavorite && "bg-red-50"
              )}
            >
              <Heart
                className={cn(
                  "w-5 h-5",
                  isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
                )}
              />
            </button>
            <button
              onClick={handleShare}
              className="w-10 h-10 rounded-full flex items-center justify-center
                         bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-200
                         hover:scale-110 active:scale-95"
            >
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Quick Facts Strip */}
        <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {quickFacts.map((fact) => {
              const FactIcon = fact.icon;
              return (
                <div 
                  key={fact.label}
                  className="flex-shrink-0 bg-white rounded-xl p-3 shadow-sm border border-border/50
                             flex items-center gap-3 min-w-[120px]"
                >
                  <div className="w-10 h-10 rounded-lg bg-[hsl(var(--geo-cream))] flex items-center justify-center">
                    <FactIcon className="w-5 h-5 text-[hsl(var(--geo-amber))]" />
                  </div>
                  <div>
                    <p className="text-xs text-[hsl(var(--geo-text-light))]">{fact.label}</p>
                    <p className="text-sm font-semibold text-[hsl(var(--geo-text))] line-clamp-1">
                      {fact.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Overview Card */}
        <Card className="bg-white rounded-2xl border border-border/50 shadow-sm animate-fade-in" 
              style={{ animationDelay: '150ms' }}>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[hsl(var(--geo-brown))]/10 flex items-center justify-center">
                <FileText className="w-4 h-4 text-[hsl(var(--geo-brown))]" />
              </div>
              <h2 className="text-lg font-bold text-[hsl(var(--geo-text))]">Overview</h2>
            </div>
            <p className="text-[hsl(var(--geo-text-light))] leading-relaxed">
              {rock.description}
            </p>
          </CardContent>
        </Card>

        {/* Properties Grid */}
        {properties.length > 0 && (
          <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[hsl(var(--geo-amber))]/10 flex items-center justify-center">
                <Layers className="w-4 h-4 text-[hsl(var(--geo-amber))]" />
              </div>
              <h2 className="text-lg font-bold text-[hsl(var(--geo-text))]">Properties</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {properties.map((prop) => {
                const PropIcon = prop.icon;
                return (
                  <Card 
                    key={prop.label}
                    className="bg-white rounded-xl border border-border/50 shadow-sm overflow-hidden"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[hsl(var(--geo-cream))] flex items-center justify-center shrink-0">
                          <PropIcon className="w-4 h-4 text-[hsl(var(--geo-amber))]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-[hsl(var(--geo-text-light))] mb-0.5">{prop.label}</p>
                          <p className="text-sm font-semibold text-[hsl(var(--geo-text))] line-clamp-2">
                            {prop.value}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Formation & Environment */}
        {rock.formation_process && (
          <Card className="bg-white rounded-2xl border border-border/50 shadow-sm animate-fade-in" 
                style={{ animationDelay: '250ms' }}>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[hsl(var(--geo-green))]/10 flex items-center justify-center">
                  <Mountain className="w-4 h-4 text-[hsl(var(--geo-green))]" />
                </div>
                <h2 className="text-lg font-bold text-[hsl(var(--geo-text))]">Formation & Environment</h2>
              </div>
              <div className="space-y-2">
                {rock.formation_process.split(/[.;]/).filter(s => s.trim()).map((sentence, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-[hsl(var(--geo-green))] mt-0.5 shrink-0" />
                    <p className="text-[hsl(var(--geo-text-light))] text-sm leading-relaxed">
                      {sentence.trim()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Uses & Applications */}
        {rock.uses && (
          <Card className="bg-white rounded-2xl border border-border/50 shadow-sm animate-fade-in" 
                style={{ animationDelay: '300ms' }}>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[hsl(var(--geo-amber))]/10 flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-[hsl(var(--geo-amber))]" />
                </div>
                <h2 className="text-lg font-bold text-[hsl(var(--geo-text))]">Uses & Applications</h2>
              </div>
              <div className="space-y-2">
                {rock.uses.split(/[,;.]/).filter(use => use.trim()).map((use, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-[hsl(var(--geo-amber))] mt-0.5 shrink-0" />
                    <p className="text-[hsl(var(--geo-text-light))] text-sm">{use.trim()}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Locations / Occurrence */}
        {rock.locations && rock.locations.length > 0 && (
          <Card className="bg-white rounded-2xl border border-border/50 shadow-sm animate-fade-in" 
                style={{ animationDelay: '350ms' }}>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[hsl(var(--geo-green))]/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-[hsl(var(--geo-green))]" />
                </div>
                <h2 className="text-lg font-bold text-[hsl(var(--geo-text))]">Occurrence</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {rock.locations.map((location, index) => (
                  <Badge 
                    key={index}
                    variant="outline"
                    className="bg-[hsl(var(--geo-background))] border-border/50 text-[hsl(var(--geo-text))]"
                  >
                    {location}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Floating Action Bar */}
        <div className="fixed bottom-20 left-0 right-0 flex justify-center animate-fade-in z-40"
             style={{ animationDelay: '400ms' }}>
          <div className="bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-border/50 
                          px-2 py-2 flex items-center gap-1">
            <button
              onClick={toggleFavorite}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-200",
                isFavorite 
                  ? "bg-red-50 text-red-600" 
                  : "hover:bg-[hsl(var(--geo-cream))] text-[hsl(var(--geo-text))]"
              )}
            >
              <Bookmark className={cn("w-4 h-4", isFavorite && "fill-current")} />
              <span className="text-sm font-medium">
                {isFavorite ? "Saved" : "Save"}
              </span>
            </button>
            
            <div className="w-px h-6 bg-border/50" />
            
            <button
              onClick={() => toast.info("Add to notes feature coming soon!")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-200
                         hover:bg-[hsl(var(--geo-cream))] text-[hsl(var(--geo-text))]"
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">Notes</span>
            </button>
            
            <div className="w-px h-6 bg-border/50" />
            
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-200
                         hover:bg-[hsl(var(--geo-cream))] text-[hsl(var(--geo-text))]"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-sm font-medium">Share</span>
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}