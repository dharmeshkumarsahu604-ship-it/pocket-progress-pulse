import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Mountain, Calendar } from "lucide-react";
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
  geological_formation?: string | null;
  age?: string | null;
}

interface SiteCardProps {
  site: GeologicalSite;
  siteIndex?: number;
  totalSitesInState?: number;
}

export const SiteCard = ({ site, siteIndex, totalSitesInState }: SiteCardProps) => {
  const getAccessibilityStyle = (accessibility: string | null) => {
    if (!accessibility) return "bg-muted text-muted-foreground";
    
    const lower = accessibility.toLowerCase();
    if (lower.includes("easy")) return "bg-success/10 text-success";
    if (lower.includes("moderate")) return "bg-warning/10 text-warning";
    if (lower.includes("difficult")) return "bg-destructive/10 text-destructive";
    return "bg-muted text-muted-foreground";
  };

  return (
    <Link to={`/sites/${site.id}`} className="block group">
      <Card className="overflow-hidden transition-all duration-300 border-2 hover:border-primary/20 h-full hover-lift">
        <div className="aspect-video bg-gradient-to-br from-muted via-muted to-primary/5 relative overflow-hidden">
          <img
            src={site.image_url || "/placeholder.svg"}
            alt={site.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          
          {site.accessibility && (
            <Badge className={`absolute top-3 right-3 shadow-lg ${getAccessibilityStyle(site.accessibility)}`}>
              {site.accessibility}
            </Badge>
          )}

          {site.age && (
            <Badge variant="secondary" className="absolute top-3 left-3 shadow-lg">
              <Calendar className="h-3 w-3 mr-1" />
              {site.age.split(' ')[0]}
            </Badge>
          )}
        </div>

        <CardContent className="p-5 space-y-3">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors flex-1">
                {site.name}
              </h3>
              {siteIndex !== undefined && totalSitesInState !== undefined && (
                <Badge variant="secondary" className="shrink-0 text-xs">
                  {site.state} · Site {siteIndex} of {totalSitesInState}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="line-clamp-1">
                {site.district ? `${site.district}, ` : ""}
                {site.state}
              </span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {site.description}
          </p>

          {site.geological_formation && (
            <div className="flex items-start gap-1.5 text-xs text-muted-foreground bg-muted/50 p-2 rounded">
              <Mountain className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2">{site.geological_formation}</span>
            </div>
          )}

          {site.rock_types && site.rock_types.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {site.rock_types.slice(0, 3).map((rock, index) => (
                <Badge key={index} variant="outline" className="text-xs font-normal">
                  {rock}
                </Badge>
              ))}
              {site.rock_types.length > 3 && (
                <Badge variant="outline" className="text-xs font-medium">
                  +{site.rock_types.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};
