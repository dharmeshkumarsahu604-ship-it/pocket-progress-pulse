import { AppLayout } from "@/components/layout/AppLayout";
import { MineralCard } from "@/components/minerals/MineralCard";
import { SearchBar } from "@/components/shared/SearchBar";
import { useSearch } from "@/hooks/useSearch";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useState, useMemo, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  const [sortBy, setSortBy] = useState<"name" | "hardness" | "formula">("name");
  
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
        case "formula":
          return (a.chemical_formula || "").localeCompare(b.chemical_formula || "");
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
        <div className="flex items-center justify-center min-h-screen">
          <p>Loading minerals...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Mineral Database</h1>
          <p className="text-muted-foreground">
            {filteredAndSortedMinerals.length} specimens available
          </p>
        </div>

        <div className="space-y-4">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search minerals by name, formula, luster..."
          />

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="space-y-3 w-full sm:w-64">
              <p className="text-sm font-medium">
                Hardness: {hardnessRange[0]} - {hardnessRange[1]}
              </p>
              <Slider
                value={hardnessRange}
                onValueChange={(value) => setHardnessRange(value as [number, number])}
                min={0}
                max={10}
                step={0.5}
                className="w-full"
              />
            </div>

            <div className="w-full sm:w-48">
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="hardness">Hardness</SelectItem>
                  <SelectItem value="formula">Formula</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedMinerals.map((mineral) => (
            <MineralCard
              key={mineral.id}
              mineral={mineral}
              isFavorite={favorites.includes(mineral.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>

        {filteredAndSortedMinerals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No minerals found matching your criteria</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
