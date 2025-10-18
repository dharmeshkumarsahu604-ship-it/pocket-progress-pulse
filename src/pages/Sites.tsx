import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SiteCard } from "@/components/sites/SiteCard";
import { SearchBar } from "@/components/shared/SearchBar";
import { FilterChips } from "@/components/shared/FilterChips";
import { useSearch } from "@/hooks/useSearch";
import { Button } from "@/components/ui/button";
import { Map } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GeologicalSite {
  id: string;
  name: string;
  description: string;
  country: string;
  state: string;
  district: string | null;
  latitude: number;
  longitude: number;
  image_url: string | null;
  rock_types: string[] | null;
  geological_formation: string | null;
  age: string | null;
  significance: string | null;
  accessibility: string | null;
  best_visit_time: string | null;
}

export default function Sites() {
  const [sites, setSites] = useState<GeologicalSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);

  const { searchTerm, setSearchTerm, filteredItems } = useSearch(
    sites,
    ["name", "state", "description", "geological_formation"]
  );

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const { data, error } = await supabase
        .from("geological_sites")
        .select("*")
        .order("name");

      if (error) throw error;
      setSites(data || []);
    } catch (error) {
      console.error("Error fetching sites:", error);
      toast.error("Failed to load geological sites");
    } finally {
      setLoading(false);
    }
  };

  const filteredSites = filteredItems.filter((site) =>
    selectedState ? site.state === selectedState : true
  );

  const states = Array.from(new Set(sites.map((site) => site.state)));

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p>Loading geological sites...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Geological Sites</h1>
            <p className="text-muted-foreground">
              {filteredSites.length} sites available
            </p>
          </div>
          <Button variant="outline" onClick={() => setShowMap(!showMap)}>
            <Map className="mr-2 h-4 w-4" />
            {showMap ? "List View" : "Map View"}
          </Button>
        </div>

        <div className="space-y-4">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search sites by name, rock types, or formations..."
          />

          <div className="space-y-2">
            <p className="text-sm font-medium">Filter by State:</p>
            <FilterChips
              options={states}
              selected={selectedState}
              onSelect={(state) => setSelectedState(state)}
            />
          </div>
        </div>

        {showMap ? (
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Map integration coming soon</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSites.map((site) => (
              <SiteCard key={site.id} site={site} />
            ))}
          </div>
        )}

        {filteredSites.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No sites found matching your criteria</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
