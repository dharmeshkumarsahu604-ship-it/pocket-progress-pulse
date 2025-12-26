import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Mic, FileText, MapPin, MessageCircle, User, ChevronRight, GraduationCap, Compass } from "lucide-react";

const menuItems = [
  { icon: Compass, label: "Brunton Compass", path: "/compass" },
  { icon: Mic, label: "Voice Notes", path: "/voice-notes" },
  { icon: FileText, label: "Field Notes", path: "/field-notes" },
  { icon: MapPin, label: "Geological Sites", path: "/sites" },
  { icon: GraduationCap, label: "Virtual Field Trips", path: "/field-trips" },
  { icon: MessageCircle, label: "AI Chat", path: "/chat" },
  { icon: User, label: "Profile", path: "/profile" },
];

export default function More() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">More</h1>
        
        <Card>
          <CardContent className="p-0">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center justify-between p-4 hover:bg-accent transition-colors",
                    index !== menuItems.length - 1 && "border-b border-border"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-primary" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
