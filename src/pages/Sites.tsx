import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SiteCard } from "@/components/sites/SiteCard";
import { SearchBar } from "@/components/shared/SearchBar";
import { useSearch } from "@/hooks/useSearch";
import { Button } from "@/components/ui/button";
import { Map, MapPin, Mountain } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
  const [selectedState, setSelectedState] = useState<string>("all");
  const [showMap, setShowMap] = useState(false);

  const { searchTerm, setSearchTerm, filteredItems } = useSearch(
    sites,
    ["name", "state", "description", "geological_formation", "district"]
  );

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const { data, error } = await supabase
        .from("geological_sites")
        .select("*")
        .order("state")
        .order("name");

      if (error) throw error;
      setSites(data || []);
    } catch (error) {
      toast.error("Failed to load geological sites");
    } finally {
      setLoading(false);
    }
  };

  const filteredSites = filteredItems.filter((site) =>
    selectedState === "all" ? true : site.state === selectedState
  );

  // Group sites by state
  const sitesByState = filteredSites.reduce((acc, site) => {
    if (!acc[site.state]) {
      acc[site.state] = [];
    }
    acc[site.state].push(site);
    return acc;
  }, {} as Record<string, GeologicalSite[]>);

  const states = Array.from(new Set(sites.map((site) => site.state))).sort();
  const totalSites = filteredSites.length;
  const totalStates = Object.keys(sitesByState).length;

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <Mountain className="h-12 w-12 animate-pulse mx-auto text-primary" />
            <p className="text-muted-foreground">Loading geological sites...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">
                Geological Sites of India
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Explore India's rich geological heritage across {states.length} states with {sites.length} documented sites
              </p>
            </div>
            <Button variant="outline" size="lg" onClick={() => setShowMap(!showMap)}>
              <Map className="mr-2 h-5 w-5" />
              {showMap ? "List View" : "Map View"}
            </Button>
          </div>

          {/* Statistics Cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Sites</CardDescription>
                <CardTitle className="text-3xl">{totalSites}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  Documented geological locations
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>States Covered</CardDescription>
                <CardTitle className="text-3xl">{totalStates}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  Across India
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Active Filters</CardDescription>
                <CardTitle className="text-3xl">
                  {selectedState === "all" ? "0" : "1"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  {selectedState === "all" ? "Showing all sites" : `Filtered by ${selectedState}`}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="space-y-4">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by name, location, rock types, or geological formations..."
          />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Filter by State:</p>
              {selectedState !== "all" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedState("all")}
                >
                  Clear Filter
                </Button>
              )}
            </div>
            
            <Tabs value={selectedState} onValueChange={setSelectedState}>
              <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto">
                <TabsTrigger value="all" className="gap-2">
                  All States
                  <Badge variant="secondary" className="ml-1">
                    {sites.length}
                  </Badge>
                </TabsTrigger>
                {states.map((state) => {
                  const count = sites.filter(s => s.state === state).length;
                  return (
                    <TabsTrigger key={state} value={state} className="gap-2">
                      {state}
                      <Badge variant="secondary" className="ml-1">
                        {count}
                      </Badge>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Content Section */}
        {showMap ? (
          <Card>
            <CardContent className="p-0">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center space-y-2 p-6">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">Interactive map view coming soon</p>
                  <p className="text-sm text-muted-foreground">
                    View all {totalSites} geological sites on an interactive map
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : selectedState === "all" ? (
          // Show sites grouped by state
          <div className="space-y-8">
            {Object.entries(sitesByState).sort(([a], [b]) => a.localeCompare(b)).map(([state, stateSites]) => (
              <div key={state} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">{state}</h2>
                    <p className="text-sm text-muted-foreground">
                      {stateSites.length} geological {stateSites.length === 1 ? 'site' : 'sites'}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedState(state)}
                  >
                    View All
                  </Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {stateSites.slice(0, 6).map((site) => (
                    <SiteCard key={site.id} site={site} />
                  ))}
                </div>
                {stateSites.length > 6 && (
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => setSelectedState(state)}
                  >
                    View {stateSites.length - 6} more {state} sites
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          // Show all sites for selected state
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{selectedState}</h2>
              <Badge variant="secondary">{filteredSites.length} sites</Badge>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSites.map((site) => (
                <SiteCard key={site.id} site={site} />
              ))}
            </div>
          </div>
        )}

        {filteredSites.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Mountain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No sites found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filters
              </p>
              {selectedState !== "all" && (
                <Button onClick={() => setSelectedState("all")}>
                  View All Sites
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
