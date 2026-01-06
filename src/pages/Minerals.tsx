import { AppLayout } from "@/components/layout/AppLayout";
import { MineralCard } from "@/components/minerals/MineralCard";
import { SearchBar } from "@/components/shared/SearchBar";
import { PullToRefreshIndicator } from "@/components/shared/PullToRefreshIndicator";
import { useSearch } from "@/hooks/useSearch";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { useState, useMemo, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database, SlidersHorizontal, Search, Gem } from "lucide-react";

interface Mineral {
  id: string;
  name: string;
  chemical_formula: string | null;
  image_url: string | null;
  description: string;
  luster: string | null;
  hardness: number;
  color: string | null;
  streak: string | null;
  cleavage: string | null;
  fracture: string | null;
  crystal_system: string | null;
  specific_gravity: number | null;
  uses: string | null;
  locations: string[] | null;
}

export default function Minerals() {
  const [minerals, setMinerals] = useState<Mineral[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useLocalStorage<string[]>("favorite-minerals", []);
  const [hardnessRange, setHardnessRange] = useState<[number, number]>([0, 10]);
  const [sortBy, setSortBy] = useState<"name" | "hardness" | "crystal_system">("name");
  
  const { searchTerm, setSearchTerm, filteredItems } = useSearch(
    minerals,
    ["name", "chemical_formula", "luster", "color", "crystal_system"]
  );

  useEffect(() => {
    fetchMinerals();
  }, []);

  const fetchMinerals = async () => {
    try {
      const { data, error } = await supabase
        .from("minerals")
        .select("*")
        .order("name");

      if (error) throw error;
      setMinerals(data || []);
    } catch (error) {
      console.error("Error fetching minerals:", error);
      toast.error("Failed to load minerals");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await fetchMinerals();
    toast.success("Minerals refreshed!");
  };

  const { pullDistance, isRefreshing, isPulling, isOverThreshold } = usePullToRefresh({
    onRefresh: handleRefresh,
    enabled: !loading,
  });

  const filteredAndSortedMinerals = useMemo(() => {
    let filteredMinerals = filteredItems;

    // Filter by hardness
    filteredMinerals = filteredMinerals.filter(
      (mineral) => mineral.hardness >= hardnessRange[0] && mineral.hardness <= hardnessRange[1]
    );

    // Sort
    return [...filteredMinerals].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "hardness":
          return b.hardness - a.hardness;
        case "crystal_system":
          return (a.crystal_system || "").localeCompare(b.crystal_system || "");
        default:
          return 0;
      }
    });
  }, [filteredItems, hardnessRange, sortBy]);

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
              <div className="h-10 w-10 rounded-xl bg-muted shimmer" />
              <div>
                <div className="h-8 w-48 mb-1 bg-muted rounded shimmer" style={{ animationDelay: '100ms' }} />
                <div className="h-4 w-64 bg-muted rounded shimmer" style={{ animationDelay: '200ms' }} />
              </div>
            </div>
          </div>
          
          {/* Search & Filter Skeleton */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-border/50 space-y-4 animate-fade-in" style={{ animationDelay: '150ms' }}>
            <div className="h-12 w-full rounded-xl bg-muted shimmer" />
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-muted rounded shimmer" style={{ animationDelay: '200ms' }} />
                <div className="h-2 w-full bg-muted rounded shimmer" style={{ animationDelay: '250ms' }} />
              </div>
              <div className="h-10 w-40 bg-muted rounded shimmer" style={{ animationDelay: '300ms' }} />
            </div>
          </div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border/50 animate-fade-in"
                style={{ animationDelay: `${350 + i * 100}ms` }}
              >
                <div className="aspect-[4/3] w-full bg-muted shimmer" />
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="h-6 w-32 bg-muted rounded shimmer" />
                    <div className="h-6 w-10 rounded-full bg-muted shimmer" />
                  </div>
                  <div className="h-4 w-full bg-muted rounded shimmer" />
                  <div className="flex gap-2">
                    <div className="h-5 w-20 bg-muted rounded shimmer" />
                    <div className="h-5 w-16 bg-muted rounded shimmer" />
                    <div className="h-5 w-14 bg-muted rounded shimmer" />
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
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[hsl(var(--geo-green))] to-[hsl(var(--geo-brown))] flex items-center justify-center shadow-md">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[hsl(var(--geo-text))]">
                Mineral Database
              </h1>
              <p className="text-sm text-[hsl(var(--geo-text-light))]">
                Explore, compare, and study minerals
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Badge 
              variant="secondary" 
              className="bg-[hsl(var(--geo-cream))] text-[hsl(var(--geo-text))] border-0 font-medium"
            >
              <Gem className="w-3 h-3 mr-1" />
              {minerals.length} minerals
            </Badge>
            {searchTerm && (
              <Badge 
                variant="outline" 
                className="text-[hsl(var(--geo-text-light))] border-[hsl(var(--geo-text-light))]/30"
              >
                {filteredAndSortedMinerals.length} results
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
              placeholder="Search by name, formula, hardness, luster…"
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-[hsl(var(--geo-background))] border border-border/50 
                         text-[hsl(var(--geo-text))] placeholder:text-[hsl(var(--geo-text-light))]
                         focus:outline-none focus:ring-2 focus:ring-[hsl(var(--geo-green))]/20 focus:border-[hsl(var(--geo-green))]
                         transition-all duration-200"
            />
          </div>

          {/* Filter Row */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pt-2 border-t border-border/30">
            {/* Hardness Slider */}
            <div className="space-y-2 w-full sm:w-64">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[hsl(var(--geo-text))]">
                  Hardness (Mohs)
                </span>
                <span className="text-sm font-mono text-[hsl(var(--geo-amber))] bg-[hsl(var(--geo-cream))] px-2 py-0.5 rounded-md">
                  {hardnessRange[0]} – {hardnessRange[1]}
                </span>
              </div>
              <Slider
                value={hardnessRange}
                onValueChange={(value) => setHardnessRange(value as [number, number])}
                min={0}
                max={10}
                step={0.5}
                className="w-full"
              />
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
                  <SelectItem value="crystal_system">Crystal System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Mineral Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAndSortedMinerals.map((mineral, index) => (
            <div 
              key={mineral.id}
              className="animate-fade-in"
              style={{ animationDelay: `${150 + index * 40}ms` }}
            >
              <MineralCard
                mineral={mineral}
                isFavorite={favorites.includes(mineral.id)}
                onToggleFavorite={toggleFavorite}
              />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAndSortedMinerals.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[hsl(var(--geo-cream))] flex items-center justify-center">
              <Gem className="w-8 h-8 text-[hsl(var(--geo-amber))]" />
            </div>
            <h3 className="text-lg font-semibold text-[hsl(var(--geo-text))] mb-1">
              No minerals match your filters
            </h3>
            <p className="text-[hsl(var(--geo-text-light))] max-w-sm mx-auto">
              Try adjusting the hardness range or search terms to find specimens
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}