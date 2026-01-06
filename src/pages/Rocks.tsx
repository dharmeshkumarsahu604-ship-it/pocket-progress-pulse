import { AppLayout } from "@/components/layout/AppLayout";
import { RockCard } from "@/components/rocks/RockCard";
import { PullToRefreshIndicator } from "@/components/shared/PullToRefreshIndicator";
import { useSearch } from "@/hooks/useSearch";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { useState, useMemo, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database, SlidersHorizontal, Search, Mountain } from "lucide-react";
import { cn } from "@/lib/utils";

type RockType = "igneous" | "sedimentary" | "metamorphic";

interface Rock {
  id: string;
  name: string;
  type: string;
  image_url: string | null;
  description: string;
  composition: string | null;
  texture: string | null;
  color: string | null;
  formation_process: string | null;
  hardness: number | null;
  grain_size: string | null;
  uses: string | null;
  locations: string[] | null;
}

const rockTypeFilters: { value: RockType; label: string }[] = [
  { value: "igneous", label: "Igneous" },
  { value: "sedimentary", label: "Sedimentary" },
  { value: "metamorphic", label: "Metamorphic" },
];

export default function Rocks() {
  const [rocks, setRocks] = useState<Rock[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useLocalStorage<string[]>("favorite-rocks", []);
  const [selectedType, setSelectedType] = useState<RockType | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "hardness" | "texture">("name");
  
  const { searchTerm, setSearchTerm, filteredItems } = useSearch(
    rocks,
    ["name", "composition", "type", "color", "texture"]
  );

  useEffect(() => {
    fetchRocks();
  }, []);

  const fetchRocks = async () => {
    try {
      const { data, error } = await supabase
        .from("rocks")
        .select("*")
        .order("name");

      if (error) throw error;
      setRocks(data || []);
    } catch (error) {
      console.error("Error fetching rocks:", error);
      toast.error("Failed to load rocks");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await fetchRocks();
    toast.success("Rocks refreshed!");
  };

  const { pullDistance, isRefreshing, isPulling, isOverThreshold } = usePullToRefresh({
    onRefresh: handleRefresh,
    enabled: !loading,
  });

  const filteredAndSortedRocks = useMemo(() => {
    let filteredRocks = filteredItems;

    // Filter by type
    if (selectedType) {
      filteredRocks = filteredRocks.filter((rock) => rock.type === selectedType);
    }

    // Sort
    return [...filteredRocks].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "hardness":
          return (b.hardness || 0) - (a.hardness || 0);
        case "texture":
          return (a.texture || "").localeCompare(b.texture || "");
        default:
          return 0;
      }
    });
  }, [filteredItems, selectedType, sortBy]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          {/* Header Skeleton */}
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-11 w-11 rounded-xl bg-muted shimmer" />
              <div>
                <div className="h-8 w-48 mb-1 bg-muted rounded shimmer" style={{ animationDelay: '100ms' }} />
                <div className="h-4 w-72 bg-muted rounded shimmer" style={{ animationDelay: '200ms' }} />
              </div>
            </div>
          </div>
          
          {/* Search & Filter Skeleton */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-border/50 space-y-4 animate-fade-in" style={{ animationDelay: '150ms' }}>
            <div className="h-12 w-full rounded-xl bg-muted shimmer" />
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex gap-2">
                <div className="h-9 w-24 rounded-full bg-muted shimmer" style={{ animationDelay: '200ms' }} />
                <div className="h-9 w-28 rounded-full bg-muted shimmer" style={{ animationDelay: '250ms' }} />
                <div className="h-9 w-28 rounded-full bg-muted shimmer" style={{ animationDelay: '300ms' }} />
              </div>
              <div className="h-10 w-40 ml-auto bg-muted rounded shimmer" style={{ animationDelay: '350ms' }} />
            </div>
          </div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border/50 animate-fade-in"
                style={{ animationDelay: `${400 + i * 100}ms` }}
              >
                <div className="aspect-[4/3] w-full bg-muted shimmer" />
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="h-6 w-32 bg-muted rounded shimmer" />
                    <div className="h-6 w-20 rounded-full bg-muted shimmer" />
                  </div>
                  <div className="h-4 w-full bg-muted rounded shimmer" />
                  <div className="flex gap-2">
                    <div className="h-5 w-20 bg-muted rounded shimmer" />
                    <div className="h-5 w-16 bg-muted rounded shimmer" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PullToRefreshIndicator
        pullDistance={pullDistance}
        isRefreshing={isRefreshing}
        isOverThreshold={isOverThreshold}
      />
      <div className="space-y-6">
        {/* Refined Database Header */}
        <div className="animate-fade-in">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[hsl(var(--geo-brown))] to-[hsl(var(--geo-amber))] flex items-center justify-center shadow-md">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[hsl(var(--geo-text))]">
                Rock Database
              </h1>
              <p className="text-sm text-[hsl(var(--geo-text-light))]">
                Explore and study igneous, sedimentary, and metamorphic rocks
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Badge 
              variant="secondary" 
              className="bg-[hsl(var(--geo-cream))] text-[hsl(var(--geo-text))] border-0 font-medium"
            >
              <Mountain className="w-3 h-3 mr-1" />
              {rocks.length} rocks
            </Badge>
            {searchTerm && (
              <Badge 
                variant="outline" 
                className="text-[hsl(var(--geo-text-light))] border-[hsl(var(--geo-text-light))]/30"
              >
                {filteredAndSortedRocks.length} results
              </Badge>
            )}
          </div>
        </div>

        {/* Smart Search & Filter Control Panel */}
        <div 
          className="bg-white rounded-2xl p-5 shadow-sm border border-border/50 space-y-4 animate-fade-in" 
          style={{ animationDelay: '100ms' }}
        >
          {/* Elevated Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(var(--geo-text-light))]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, texture, composition, or color…"
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-[hsl(var(--geo-background))] border border-border/50 
                         text-[hsl(var(--geo-text))] placeholder:text-[hsl(var(--geo-text-light))]
                         focus:outline-none focus:ring-2 focus:ring-[hsl(var(--geo-brown))]/20 focus:border-[hsl(var(--geo-brown))]
                         transition-all duration-200"
            />
          </div>

          {/* Filter Row */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pt-2 border-t border-border/30">
            {/* Rock Type Filter Chips */}
            <div className="flex flex-wrap gap-2">
              {rockTypeFilters.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(selectedType === type.value ? null : type.value)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                    selectedType === type.value
                      ? "bg-[hsl(var(--geo-brown))] text-white shadow-sm"
                      : "bg-[hsl(var(--geo-background))] text-[hsl(var(--geo-text))] hover:bg-[hsl(var(--geo-cream))] border border-border/50"
                  )}
                >
                  {type.label}
                </button>
              ))}
              {selectedType && (
                <button
                  onClick={() => setSelectedType(null)}
                  className="px-3 py-2 rounded-full text-sm text-[hsl(var(--geo-text-light))] hover:text-[hsl(var(--geo-text))] transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <SlidersHorizontal className="w-4 h-4 text-[hsl(var(--geo-text-light))] hidden sm:block" />
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-full sm:w-44 bg-[hsl(var(--geo-background))] border-border/50">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name (A–Z)</SelectItem>
                  <SelectItem value="hardness">Hardness (High–Low)</SelectItem>
                  <SelectItem value="texture">Texture</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Rock Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAndSortedRocks.map((rock, index) => (
            <div 
              key={rock.id}
              className="animate-fade-in"
              style={{ animationDelay: `${150 + index * 40}ms` }}
            >
              <RockCard
                rock={rock}
                isFavorite={favorites.includes(rock.id)}
                onToggleFavorite={toggleFavorite}
              />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAndSortedRocks.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[hsl(var(--geo-cream))] flex items-center justify-center">
              <Mountain className="w-8 h-8 text-[hsl(var(--geo-amber))]" />
            </div>
            <h3 className="text-lg font-semibold text-[hsl(var(--geo-text))] mb-1">
              No rocks match your filters
            </h3>
            <p className="text-[hsl(var(--geo-text-light))] max-w-sm mx-auto">
              Try adjusting the rock type or search terms to find specimens
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}