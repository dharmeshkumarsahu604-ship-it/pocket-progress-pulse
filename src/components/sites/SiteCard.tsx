import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";

interface GeologicalSite {
  id: string;
  name: string;
  description: string;
  state: string;
  district: string | null;
  image_url: string | null;
  rock_types: string[] | null;
  accessibility: string | null;
}

interface SiteCardProps {
  site: GeologicalSite;
}

export const SiteCard = ({ site }: SiteCardProps) => {
  const getAccessibilityStyle = (accessibility: string | null) => {
    if (!accessibility) return "bg-muted text-muted-foreground";
    
    const lower = accessibility.toLowerCase();
    if (lower.includes("easy")) return "bg-success/10 text-success";
    if (lower.includes("moderate")) return "bg-warning/10 text-warning";
    if (lower.includes("difficult")) return "bg-destructive/10 text-destructive";
    return "bg-muted text-muted-foreground";
  };

  return (
    <Link to={`/sites/${site.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-video bg-muted relative">
          <img
            src={site.image_url || "/placeholder.svg"}
            alt={site.name}
            className="w-full h-full object-cover"
          />
          {site.accessibility && (
            <Badge className={`absolute top-2 right-2 ${getAccessibilityStyle(site.accessibility)}`}>
              {site.accessibility}
            </Badge>
          )}
        </div>

        <CardContent className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">{site.name}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin className="h-3 w-3" />
              <span>
                {site.district ? `${site.district}, ` : ""}
                {site.state}
              </span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {site.description}
          </p>

          {site.rock_types && site.rock_types.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {site.rock_types.slice(0, 3).map((rock, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {rock}
                </Badge>
              ))}
              {site.rock_types.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{site.rock_types.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};
