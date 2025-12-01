import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SiteCard } from "@/components/sites/SiteCard";
import { SiteMap } from "@/components/sites/SiteMap";
import { SearchBar } from "@/components/shared/SearchBar";
import { LoadingSkeleton, SearchBarSkeleton } from "@/components/shared/LoadingSkeleton";
import { PullToRefreshIndicator } from "@/components/shared/PullToRefreshIndicator";
import { PermissionGate } from "@/components/shared/PermissionGate";
import { useSearch } from "@/hooks/useSearch";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { Button } from "@/components/ui/button";
import { Map, MapPin, Mountain, Navigation, List } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGeolocation } from "@/hooks/useGeolocation";
import { calculateDistance, formatDistance } from "@/lib/geolocation";

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

interface GeologicalSiteWithDistance extends GeologicalSite {
  distance: number;
}

export default function Sites() {
  const [sites, setSites] = useState<GeologicalSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<string>("all");
  const [displayMode, setDisplayMode] = useState<"list" | "map">("list");
  const [viewMode, setViewMode] = useState<"all" | "nearby">("all");
  const [radius, setRadius] = useState<number>(50);

  const { searchTerm, setSearchTerm, filteredItems } = useSearch(
    sites,
    ["name", "state", "description", "geological_formation", "district"]
  );

  const { latitude, longitude, loading: locationLoading, getCurrentLocation } = useGeolocation();

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

      // De-duplicate sites by name + state + district to avoid repeated entries
      const uniqueSites = (data || []).reduce<GeologicalSite[]>((acc, site) => {
        const key = `${site.name}-${site.state}-${site.district ?? ""}`;
        if (!acc.some((s) => `${s.name}-${s.state}-${s.district ?? ""}` === key)) {
          acc.push(site as GeologicalSite);
        }
        return acc;
      }, []);

      setSites(uniqueSites);
    } catch (error) {
      toast.error("Failed to load geological sites");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await fetchSites();
    toast.success("Sites refreshed!");
  };

  const { pullDistance, isRefreshing, isPulling, isOverThreshold } = usePullToRefresh({
    onRefresh: handleRefresh,
    enabled: !loading,
  });

  // Calculate nearby sites with distances
  const nearbySites = latitude && longitude
    ? filteredItems
        .map(site => ({
          ...site,
          distance: calculateDistance(latitude, longitude, Number(site.latitude), Number(site.longitude))
        }))
        .filter(site => site.distance <= radius)
        .sort((a, b) => a.distance - b.distance)
    : [];

  const filteredSites = viewMode === "nearby"
    ? nearbySites
    : filteredItems.filter((site) =>
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
        <div className="space-y-6">
          {/* Header Skeleton */}
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="space-y-2">
                <Skeleton className="h-10 w-96 animate-pulse" />
                <Skeleton className="h-6 w-80 animate-pulse" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-10 w-32 animate-pulse" />
                <Skeleton className="h-10 w-32 animate-pulse" />
              </div>
            </div>

            {/* Statistics Cards Skeleton */}
            <div className="grid gap-4 sm:grid-cols-3 animate-fade-in" style={{ animationDelay: '100ms' }}>
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader className="pb-3">
                    <Skeleton className="h-4 w-24 animate-pulse" />
                    <Skeleton className="h-8 w-16 animate-pulse" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-3 w-full animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* View Mode Skeleton */}
          <div className="flex gap-3 flex-wrap animate-fade-in" style={{ animationDelay: '200ms' }}>
            <Skeleton className="h-10 w-28 animate-pulse" />
            <Skeleton className="h-10 w-32 animate-pulse" />
          </div>

          {/* Search Skeleton */}
          <div className="space-y-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <SearchBarSkeleton />
            <div className="space-y-3">
              <Skeleton className="h-5 w-32 animate-pulse" />
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-10 w-24 animate-pulse" />
                ))}
              </div>
            </div>
          </div>

          {/* Content Skeleton */}
          <LoadingSkeleton count={9} />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PermissionGate 
        permissions={['geolocation']}
        title="Location Permission"
        description="To show nearby geological sites, we need:"
      >
        <PullToRefreshIndicator
          pullDistance={pullDistance}
          isRefreshing={isRefreshing}
          isOverThreshold={isOverThreshold}
        />
        <div className="space-y-6">
          {/* Header Section */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">
                  Geological Sites of India
                </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                {viewMode === "nearby" && latitude && longitude
                  ? `${nearbySites.length} geological sites within ${radius}km of your location`
                  : `Explore India's rich geological heritage across ${states.length} states with ${sites.length} documented sites`}
              </p>
            </div>
            <div className="flex gap-2">
              {viewMode === "nearby" && latitude && longitude && (
                <Select value={radius.toString()} onValueChange={(value) => setRadius(Number(value))}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="25">Within 25km</SelectItem>
                    <SelectItem value="50">Within 50km</SelectItem>
                    <SelectItem value="100">Within 100km</SelectItem>
                    <SelectItem value="200">Within 200km</SelectItem>
                    <SelectItem value="500">Within 500km</SelectItem>
                  </SelectContent>
                </Select>
              )}
              <Button 
                variant={displayMode === "list" ? "default" : "outline"} 
                size="lg" 
                onClick={() => setDisplayMode("list")}
              >
                <List className="mr-2 h-5 w-5" />
                List View
              </Button>
              <Button 
                variant={displayMode === "map" ? "default" : "outline"} 
                size="lg" 
                onClick={() => setDisplayMode("map")}
              >
                <Map className="mr-2 h-5 w-5" />
                Map View
              </Button>
            </div>
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

        {/* View Mode Selector */}
        <div className="flex gap-3 flex-wrap">
          <Button
            variant={viewMode === "all" ? "default" : "outline"}
            onClick={() => setViewMode("all")}
            className="flex items-center gap-2"
          >
            <Mountain className="h-4 w-4" />
            All Sites
          </Button>
          <Button
            variant={viewMode === "nearby" ? "default" : "outline"}
            onClick={() => {
              setViewMode("nearby");
              if (!latitude && !longitude) {
                getCurrentLocation();
              }
            }}
            disabled={locationLoading}
            className="flex items-center gap-2"
          >
            <Navigation className="h-4 w-4" />
            {locationLoading ? "Getting Location..." : "Nearby Sites"}
          </Button>
        </div>

        {/* Search and Filter Section */}
        <div className="space-y-4">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by name, location, rock types, or geological formations..."
          />

          {viewMode === "all" && (
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
          )}
        </div>

        {/* Content Section */}
        {displayMode === "map" ? (
          <Card>
            <CardContent className="p-4">
              <div className="h-[600px] rounded-lg overflow-hidden">
                <SiteMap 
                  sites={filteredSites.map(site => ({
                    id: site.id,
                    name: site.name,
                    state: site.state,
                    latitude: site.latitude,
                    longitude: site.longitude,
                    rock_types: site.rock_types || [],
                    image_url: site.image_url || undefined
                  }))}
                  userLocation={latitude && longitude ? { latitude, longitude } : null}
                />
              </div>
            </CardContent>
          </Card>
        ) : viewMode === "nearby" && !latitude && !longitude ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <Navigation className="h-16 w-16 mx-auto text-muted-foreground" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Enable Location Access</h3>
                  <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                    To find geological sites near you, we need access to your location.
                  </p>
                  <Button onClick={getCurrentLocation} disabled={locationLoading} size="lg">
                    <Navigation className="mr-2 h-5 w-5" />
                    {locationLoading ? "Getting Location..." : "Enable Location"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : viewMode === "nearby" ? (
          // Nearby sites view with distances
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">Nearby Geological Sites</h2>
              <Badge variant="secondary">{nearbySites.length} sites</Badge>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {nearbySites.map((site) => (
                <div key={site.id} className="relative">
                  <SiteCard site={site} />
                  <Badge 
                    className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm shadow-lg"
                    variant="default"
                  >
                    <Navigation className="h-3 w-3 mr-1" />
                    {formatDistance(site.distance)}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
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
      </PermissionGate>
    </AppLayout>
  );
}
