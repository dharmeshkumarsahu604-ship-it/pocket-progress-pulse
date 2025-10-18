import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation } from "lucide-react";
import { GeologicalSite } from "@/data/mockSites";
import { Link } from "react-router-dom";

interface SiteCardProps {
  site: GeologicalSite;
}

export const SiteCard = ({ site }: SiteCardProps) => {
  const accessibilityColors = {
    Easy: "bg-success/10 text-success",
    Moderate: "bg-warning/10 text-warning",
    Difficult: "bg-destructive/10 text-destructive",
  };

  return (
    <Link to={`/sites/${site.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-video bg-muted relative">
          <img
            src={site.image}
            alt={site.name}
            className="w-full h-full object-cover"
          />
          <Badge className={`absolute top-2 right-2 ${accessibilityColors[site.accessibility]}`}>
            {site.accessibility}
          </Badge>
        </div>

        <CardContent className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">{site.name}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin className="h-3 w-3" />
              <span>
                {site.location.district ? `${site.location.district}, ` : ""}
                {site.location.state}
              </span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {site.description}
          </p>

          <div className="flex flex-wrap gap-1">
            {site.rockTypes.slice(0, 3).map((rock, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {rock}
              </Badge>
            ))}
            {site.rockTypes.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{site.rockTypes.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
