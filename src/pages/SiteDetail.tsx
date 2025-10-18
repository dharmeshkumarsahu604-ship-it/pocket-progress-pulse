import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { mockSites } from "@/data/mockSites";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Navigation, MapPin, Calendar } from "lucide-react";

export default function SiteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const site = mockSites.find((s) => s.id === id);
  
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

  const handleGetDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${site.location.latitude},${site.location.longitude}`;
    window.open(url, "_blank");
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate("/sites")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sites
        </Button>

        <div className="aspect-video bg-muted rounded-lg overflow-hidden">
          <img
            src={site.image}
            alt={site.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold">{site.name}</h1>
              <div className="flex items-center gap-2 text-muted-foreground mt-2">
                <MapPin className="h-4 w-4" />
                <span>
                  {site.location.district ? `${site.location.district}, ` : ""}
                  {site.location.state}
                </span>
              </div>
            </div>
            <Button onClick={handleGetDirections}>
              <Navigation className="mr-2 h-4 w-4" />
              Get Directions
            </Button>
          </div>
          <p className="text-lg text-muted-foreground">{site.description}</p>
        </div>

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
                {site.rockTypes.map((rock, index) => (
                  <Badge key={index} variant="secondary">
                    {rock}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Geological Formations:
              </p>
              <div className="flex flex-wrap gap-2">
                {site.formations.map((formation, index) => (
                  <Badge key={index} variant="outline">
                    {formation}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Geological Significance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{site.significance}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visit Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-sm font-medium text-muted-foreground">
                Accessibility
              </span>
              <Badge variant="outline">{site.accessibility}</Badge>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm font-medium text-muted-foreground">
                <Calendar className="inline h-4 w-4 mr-1" />
                Best Time to Visit
              </span>
              <span className="text-sm font-medium">{site.bestTimeToVisit}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
