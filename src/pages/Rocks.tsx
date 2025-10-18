import { AppLayout } from "@/components/layout/AppLayout";
import { RockCard } from "@/components/rocks/RockCard";
import { SearchBar } from "@/components/shared/SearchBar";
import { FilterChips } from "@/components/shared/FilterChips";
import { useSearch } from "@/hooks/useSearch";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useState, useMemo, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

export default function Rocks() {
  const [rocks, setRocks] = useState<Rock[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useLocalStorage<string[]>("favorite-rocks", []);
  const [selectedType, setSelectedType] = useState<RockType | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "hardness" | "type">("name");
  
  const { searchTerm, setSearchTerm, filteredItems } = useSearch(
    rocks,
    ["name", "composition", "type", "color"]
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
        case "type":
          return a.type.localeCompare(b.type);
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
        <div className="flex items-center justify-center min-h-screen">
          <p>Loading rocks...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Rock Database</h1>
          <p className="text-muted-foreground">
            {filteredAndSortedRocks.length} specimens available
          </p>
        </div>

        <div className="space-y-4">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search rocks by name, composition, or color..."
          />

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="space-y-2 w-full sm:w-auto">
              <p className="text-sm font-medium">Filter by Type:</p>
              <FilterChips
                options={["igneous", "sedimentary", "metamorphic"]}
                selected={selectedType}
                onSelect={(type) => setSelectedType(type as RockType | null)}
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
                  <SelectItem value="type">Type</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedRocks.map((rock) => (
            <RockCard
              key={rock.id}
              rock={rock}
              isFavorite={favorites.includes(rock.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>

        {filteredAndSortedRocks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No rocks found matching your criteria</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
