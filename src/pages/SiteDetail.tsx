import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Navigation, MapPin, Calendar, Info, Eye } from "lucide-react";
import { SiteGallery } from "@/components/sites/SiteGallery";
import { PanoramaViewer } from "@/components/sites/PanoramaViewer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getDirectionsUrl, getMapUrl } from "@/lib/maps";

interface SiteImage {
  url: string;
  caption: string;
  type: string;
  season?: string;
}

interface Hotspot {
  position: { x: number; y: number; z: number };
  title: string;
  description: string;
  feature_type: string;
}

interface PanoramaImage {
  url: string;
  title: string;
  hotspots: Hotspot[];
}

interface Site {
  id: string;
  name: string;
  description: string;
  state: string;
  district: string | null;
  latitude: number;
  longitude: number;
  image_url: string | null;
  images: SiteImage[] | null;
  panorama_images: PanoramaImage[] | null;
  rock_types: string[] | null;
  geological_formation: string | null;
  age: string | null;
  significance: string | null;
  accessibility: string | null;
  best_visit_time: string | null;
}

export default function SiteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [site, setSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPanorama, setShowPanorama] = useState(false);
  const [selectedPanorama, setSelectedPanorama] = useState<PanoramaImage | null>(null);
  
  useEffect(() => {
    fetchSite();
  }, [id]);

  const fetchSite = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from("geological_sites")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        toast.error("Site not found");
        navigate("/sites");
        return;
      }

      // Parse images and panoramas from JSON if present
      const siteData: Site = {
        ...data,
        images: data.images ? (data.images as unknown as SiteImage[]) : null,
        panorama_images: data.panorama_images ? (data.panorama_images as unknown as PanoramaImage[]) : null,
      };

      setSite(siteData);
      
      // Auto-show first panorama if available
      if (siteData.panorama_images && siteData.panorama_images.length > 0) {
        setSelectedPanorama(siteData.panorama_images[0]);
      }
    } catch (error) {
      console.error("Error fetching site:", error);
      toast.error("Failed to load site details");
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p>Loading site details...</p>
        </div>
      </AppLayout>
    );
  }

  if (!site) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Site not found</h1>
          <Button onClick={() => navigate("/sites")}>Back to Sites</Button>
        </div>
      </AppLayout>
    );
  }

  const directionsUrl = getDirectionsUrl({
    latitude: site.latitude,
    longitude: site.longitude,
  });

  const mapUrl = getMapUrl(
    {
      latitude: site.latitude,
      longitude: site.longitude,
    },
    site.name
  );

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
          <Button variant="ghost" onClick={() => navigate("/sites")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sites
          </Button>
          
          {site.panorama_images && site.panorama_images.length > 0 && (
            <Button
              variant={showPanorama ? "default" : "outline"}
              onClick={() => setShowPanorama(!showPanorama)}
            >
              <Eye className="mr-2 h-4 w-4" />
              {showPanorama ? "Hide" : "View"} 360° Panorama
            </Button>
          )}
        </div>

        {showPanorama && selectedPanorama && (
          <PanoramaViewer
            panorama={selectedPanorama}
            onClose={() => setShowPanorama(false)}
          />
        )}

        {site.images && site.images.length > 0 ? (
          <SiteGallery images={site.images} siteName={site.name} />
        ) : (
          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
            <img
              src={site.image_url || "/placeholder.svg"}
              alt={site.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <h1 className="text-4xl font-bold">{site.name}</h1>
              <div className="flex items-center gap-2 text-muted-foreground mt-2">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>
                  {site.district ? `${site.district}, ` : ""}
                  {site.state}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {site.latitude.toFixed(4)}°N, {site.longitude.toFixed(4)}°E
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <a href={mapUrl} target="_blank" rel="noopener noreferrer">
                  <MapPin className="mr-2 h-4 w-4" />
                  View on Map
                </a>
              </Button>
              <Button asChild>
                <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
                  <Navigation className="mr-2 h-4 w-4" />
                  Directions
                </a>
              </Button>
            </div>
          </div>
          <p className="text-lg text-muted-foreground">{site.description}</p>
        </div>

        {site.rock_types && site.rock_types.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Rock Types & Formations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Rock Types Found:
                </p>
                <div className="flex flex-wrap gap-2">
                  {site.rock_types.map((rock, index) => (
                    <Badge key={index} variant="secondary">
                      {rock}
                    </Badge>
                  ))}
                </div>
              </div>
              {site.geological_formation && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Geological Formation:
                  </p>
                  <p className="text-sm">{site.geological_formation}</p>
                </div>
              )}
              {site.age && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Age:
                  </p>
                  <Badge variant="outline">{site.age}</Badge>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {site.significance && (
          <Card>
            <CardHeader>
              <CardTitle>
                <Info className="inline h-5 w-5 mr-2" />
                Geological Significance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{site.significance}</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Visit Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {site.accessibility && (
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-sm font-medium text-muted-foreground">
                  Accessibility
                </span>
                <Badge variant="outline">{site.accessibility}</Badge>
              </div>
            )}
            {site.best_visit_time && (
              <div className="flex justify-between py-2">
                <span className="text-sm font-medium text-muted-foreground">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Best Time to Visit
                </span>
                <span className="text-sm font-medium">{site.best_visit_time}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
