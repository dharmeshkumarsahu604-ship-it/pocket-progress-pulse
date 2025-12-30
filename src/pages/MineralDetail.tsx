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
  GitCompare,
  Hexagon,
  Sparkles,
  Palette,
  CircleDot,
  Layers,
  Gem,
  Wrench,
  MapPin,
  AlertTriangle,
  ChevronRight
} from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { MineralComparisonModal } from "@/components/minerals/MineralComparisonModal";
import { MineralSelector } from "@/components/minerals/MineralSelector";

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
  specific_gravity: number | null;
  uses: string | null;
  locations: string[] | null;
}

export default function MineralDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useLocalStorage<string[]>("favorite-minerals", []);
  const [mineral, setMineral] = useState<Mineral | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comparisonMinerals, setComparisonMinerals] = useState<Mineral[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [showSelector, setShowSelector] = useState(false);

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
  if (error || !mineral) {
    return (
      <AppLayout>
        <div className="text-center py-16 space-y-6 animate-fade-in">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-[hsl(var(--geo-cream))] flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-[hsl(var(--geo-amber))]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[hsl(var(--geo-text))] mb-2">Mineral Not Found</h1>
            <p className="text-[hsl(var(--geo-text-light))] max-w-md mx-auto">
              {error || "The requested mineral could not be found in our database."}
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <Button 
              onClick={() => navigate("/minerals")}
              className="bg-[hsl(var(--geo-green))] hover:bg-[hsl(var(--geo-green))]/90"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Minerals
            </Button>
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

  const handleCompare = () => {
    // Add current mineral to comparison
    setComparisonMinerals([mineral]);
    // Open selector to pick second mineral
    setShowSelector(true);
  };

  const handleSelectSecondMineral = (secondMineral: Mineral) => {
    setComparisonMinerals([mineral, secondMineral]);
    setShowComparison(true);
  };

  const handleRemoveFromComparison = (id: string) => {
    setComparisonMinerals(prev => prev.filter(m => m.id !== id));
    if (comparisonMinerals.length <= 2) {
      setShowComparison(false);
    }
  };

  const quickFacts = [
    { icon: Hexagon, label: "Crystal", value: mineral.crystal_system },
    { icon: Sparkles, label: "Luster", value: mineral.luster },
    { icon: Palette, label: "Color", value: mineral.color },
    { icon: Gem, label: "Hardness", value: mineral.hardness?.toString() },
  ].filter(fact => fact.value);

  const physicalProperties = [
    { icon: Sparkles, label: "Luster", value: mineral.luster },
    { icon: CircleDot, label: "Streak", value: mineral.streak },
    { icon: Layers, label: "Cleavage", value: mineral.cleavage },
    { icon: Gem, label: "Fracture", value: mineral.fracture },
    { icon: Hexagon, label: "Crystal System", value: mineral.crystal_system },
    { icon: Palette, label: "Color", value: mineral.color },
  ].filter(prop => prop.value);

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl mx-auto pb-24">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate("/minerals")}
          className="text-[hsl(var(--geo-text-light))] hover:text-[hsl(var(--geo-text))] -ml-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Minerals
        </Button>

        {/* Immersive Hero Section */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg animate-fade-in">
          <div className="aspect-[16/9] sm:aspect-[2/1]">
            <img
              src={mineral.image_url || "/placeholder.svg"}
              alt={mineral.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">
                  {mineral.name}
                </h1>
                {mineral.chemical_formula && (
                  <p className="text-lg sm:text-xl font-mono text-white/80">
                    {mineral.chemical_formula}
                  </p>
                )}
              </div>
              <Badge 
                className="bg-[hsl(var(--geo-green))] text-white font-bold text-base px-4 py-2 
                           rounded-full border-0 shadow-lg shrink-0"
              >
                H: {mineral.hardness}
              </Badge>
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
            {quickFacts.map((fact, index) => (
              <div 
                key={fact.label}
                className="flex-shrink-0 bg-white rounded-xl p-3 shadow-sm border border-border/50
                           flex items-center gap-3 min-w-[120px]"
              >
                <div className="w-10 h-10 rounded-lg bg-[hsl(var(--geo-cream))] flex items-center justify-center">
                  <fact.icon className="w-5 h-5 text-[hsl(var(--geo-amber))]" />
                </div>
                <div>
                  <p className="text-xs text-[hsl(var(--geo-text-light))]">{fact.label}</p>
                  <p className="text-sm font-semibold text-[hsl(var(--geo-text))] line-clamp-1">
                    {fact.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overview Card */}
        <Card className="bg-white rounded-2xl border border-border/50 shadow-sm animate-fade-in" 
              style={{ animationDelay: '150ms' }}>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[hsl(var(--geo-green))]/10 flex items-center justify-center">
                <FileText className="w-4 h-4 text-[hsl(var(--geo-green))]" />
              </div>
              <h2 className="text-lg font-bold text-[hsl(var(--geo-text))]">Overview</h2>
            </div>
            <p className="text-[hsl(var(--geo-text-light))] leading-relaxed">
              {mineral.description}
            </p>
          </CardContent>
        </Card>

        {/* Physical Properties Grid */}
        <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[hsl(var(--geo-brown))]/10 flex items-center justify-center">
              <Layers className="w-4 h-4 text-[hsl(var(--geo-brown))]" />
            </div>
            <h2 className="text-lg font-bold text-[hsl(var(--geo-text))]">Physical Properties</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {physicalProperties.map((prop) => (
              <Card 
                key={prop.label}
                className="bg-white rounded-xl border border-border/50 shadow-sm overflow-hidden"
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[hsl(var(--geo-cream))] flex items-center justify-center shrink-0">
                      <prop.icon className="w-4 h-4 text-[hsl(var(--geo-amber))]" />
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
            ))}
          </div>
        </div>

        {/* Uses & Importance */}
        {mineral.uses && (
          <Card className="bg-white rounded-2xl border border-border/50 shadow-sm animate-fade-in" 
                style={{ animationDelay: '250ms' }}>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[hsl(var(--geo-amber))]/10 flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-[hsl(var(--geo-amber))]" />
                </div>
                <h2 className="text-lg font-bold text-[hsl(var(--geo-text))]">Uses & Importance</h2>
              </div>
              <div className="space-y-2">
                {mineral.uses.split(/[,;.]/).filter(use => use.trim()).map((use, index) => (
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
        {mineral.locations && mineral.locations.length > 0 && (
          <Card className="bg-white rounded-2xl border border-border/50 shadow-sm animate-fade-in" 
                style={{ animationDelay: '300ms' }}>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[hsl(var(--geo-green))]/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-[hsl(var(--geo-green))]" />
                </div>
                <h2 className="text-lg font-bold text-[hsl(var(--geo-text))]">Occurrence</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {mineral.locations.map((location, index) => (
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

        {/* Specific Gravity (if available) */}
        {mineral.specific_gravity && (
          <Card className="bg-white rounded-2xl border border-border/50 shadow-sm animate-fade-in" 
                style={{ animationDelay: '350ms' }}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[hsl(var(--geo-brown))]/10 flex items-center justify-center">
                    <Gem className="w-4 h-4 text-[hsl(var(--geo-brown))]" />
                  </div>
                  <span className="text-[hsl(var(--geo-text-light))]">Specific Gravity</span>
                </div>
                <span className="font-bold text-[hsl(var(--geo-text))] font-mono">
                  {mineral.specific_gravity}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Floating Action Bar */}
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 animate-fade-in" 
             style={{ animationDelay: '400ms' }}>
          <div className="bg-white rounded-full shadow-lg border border-border/50 p-1.5 flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFavorite}
              className={cn(
                "rounded-full px-4 gap-2",
                isFavorite 
                  ? "bg-red-50 text-red-500 hover:bg-red-100" 
                  : "hover:bg-[hsl(var(--geo-cream))]"
              )}
            >
              <Bookmark className={cn("w-4 h-4", isFavorite && "fill-current")} />
              <span className="hidden sm:inline">Bookmark</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full px-4 gap-2 hover:bg-[hsl(var(--geo-cream))]"
              onClick={() => toast.info("Add to Notes feature coming soon!")}
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Add to Notes</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full px-4 gap-2 hover:bg-[hsl(var(--geo-amber))]/10 text-[hsl(var(--geo-amber))]"
              onClick={handleCompare}
            >
              <GitCompare className="w-4 h-4" />
              <span className="hidden sm:inline">Compare</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mineral Selector Modal */}
      <MineralSelector
        open={showSelector}
        onOpenChange={setShowSelector}
        onSelectMineral={handleSelectSecondMineral}
        excludeIds={[mineral.id]}
      />

      {/* Comparison Modal */}
      <MineralComparisonModal
        open={showComparison}
        onOpenChange={setShowComparison}
        minerals={comparisonMinerals}
        onRemoveMineral={handleRemoveFromComparison}
      />
    </AppLayout>
  );
}