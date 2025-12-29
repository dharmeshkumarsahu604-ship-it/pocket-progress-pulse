import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Mic, FileText, MapPin, MessageCircle, User, ChevronRight, GraduationCap, Compass, Brain, Trophy, Target, Zap } from "lucide-react";

const menuItems = [
  { icon: Compass, label: "Brunton Compass", path: "/compass" },
  { icon: Mic, label: "Voice Notes", path: "/voice-notes" },
  { icon: FileText, label: "Field Notes", path: "/field-notes" },
  { icon: MapPin, label: "Geological Sites", path: "/sites" },
  { icon: GraduationCap, label: "Virtual Field Trips", path: "/field-trips" },
  { icon: MessageCircle, label: "AI Chat", path: "/chat" },
  { icon: User, label: "Profile", path: "/profile" },
];

const quizCategories = [
  { icon: Brain, label: "All Topics", description: "Test your overall geology knowledge", color: "bg-primary/10 text-primary", path: "/quiz" },
  { icon: Target, label: "Rocks & Minerals", description: "Identify specimens and properties", color: "bg-amber-500/10 text-amber-600", path: "/quiz?topic=rocks" },
  { icon: Zap, label: "Quick Challenge", description: "5 random questions", color: "bg-emerald-500/10 text-emerald-600", path: "/quiz?mode=quick" },
];

export default function More() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">More</h1>
        
        {/* Quiz Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Geology Quiz
            </h2>
            <Link to="/quiz">
              <Button variant="ghost" size="sm" className="text-primary">
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          
          <div className="grid gap-3">
            {quizCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Link key={category.label} to={category.path}>
                  <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className={cn("p-3 rounded-xl", category.color)}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{category.label}</h3>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Other Menu Items */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Tools & Features</h2>
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
      </div>
    </AppLayout>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
