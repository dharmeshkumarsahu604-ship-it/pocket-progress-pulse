import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Mic, 
  FileText, 
  MapPin, 
  MessageCircle, 
  User, 
  ChevronRight, 
  GraduationCap, 
  Compass, 
  Brain, 
  Target, 
  Zap,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const quizCategories = [
  { 
    icon: Brain, 
    label: "All Topics", 
    description: "Test your overall geology knowledge", 
    path: "/quiz" 
  },
  { 
    icon: Target, 
    label: "Rocks & Minerals", 
    description: "Identify specimens and properties", 
    path: "/quiz?topic=rocks" 
  },
  { 
    icon: Zap, 
    label: "Quick Challenge", 
    description: "5 random questions · Fast practice", 
    path: "/quiz?mode=quick" 
  },
];

const toolsAndFeatures = [
  { 
    icon: Compass, 
    label: "Brunton Compass", 
    description: "Measure strike & dip digitally",
    path: "/compass" 
  },
  { 
    icon: Mic, 
    label: "Voice Notes", 
    description: "Record observations hands-free",
    path: "/voice-notes" 
  },
  { 
    icon: FileText, 
    label: "Field Notes", 
    description: "Document geological findings",
    path: "/field-notes" 
  },
  { 
    icon: MapPin, 
    label: "Geological Sites", 
    description: "Explore important locations",
    path: "/sites" 
  },
  { 
    icon: GraduationCap, 
    label: "Virtual Field Trips", 
    description: "Learn without leaving campus",
    path: "/field-trips" 
  },
  { 
    icon: MessageCircle, 
    label: "AI Chat", 
    description: "Ask geology questions instantly",
    path: "/chat" 
  },
];

export default function More() {
  return (
    <AppLayout>
      <div className="space-y-8 pb-6">
        {/* Header Section */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-[hsl(var(--geo-text-primary))]">
            Explore More
          </h1>
          <p className="text-[hsl(var(--geo-text-secondary))]">
            Learning, tools, and advanced features
          </p>
        </div>

        {/* Quiz Section - Featured Learning Block */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[hsl(var(--geo-amber))]" />
            <h2 className="text-lg font-semibold text-[hsl(var(--geo-text-primary))]">
              Test Your Knowledge 🧠
            </h2>
          </div>
          
          <div className="grid gap-3">
            {quizCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Link key={category.label} to={category.path}>
                  <Card className="bg-card border-0 shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98] rounded-2xl overflow-hidden">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-[hsl(var(--geo-amber)/0.15)]">
                        <Icon className="h-6 w-6 text-[hsl(var(--geo-amber))]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[hsl(var(--geo-text-primary))]">
                          {category.label}
                        </h3>
                        <p className="text-sm text-[hsl(var(--geo-text-secondary))] truncate">
                          {category.description}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-[hsl(var(--geo-text-secondary))] flex-shrink-0" />
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Tools & Features - Command Grid */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-[hsl(var(--geo-text-primary))]">
            Field Tools & Features
          </h2>
          
          <div className="grid gap-3">
            {toolsAndFeatures.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link key={tool.path} to={tool.path}>
                  <Card className="bg-card border-0 shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98] rounded-2xl overflow-hidden">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-[hsl(var(--geo-green)/0.12)]">
                        <Icon className="h-6 w-6 text-[hsl(var(--geo-green))]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[hsl(var(--geo-text-primary))]">
                          {tool.label}
                        </h3>
                        <p className="text-sm text-[hsl(var(--geo-text-secondary))] truncate">
                          {tool.description}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-[hsl(var(--geo-text-secondary))] flex-shrink-0" />
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Profile & Account Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-[hsl(var(--geo-text-primary))]">
            Your Account
          </h2>
          
          <Link to="/profile">
            <Card className="bg-card border-0 shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98] rounded-2xl overflow-hidden">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-muted">
                  <User className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[hsl(var(--geo-text-primary))]">
                    Profile
                  </h3>
                  <p className="text-sm text-[hsl(var(--geo-text-secondary))] truncate">
                    View and manage your Geo-Smart identity
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-[hsl(var(--geo-text-secondary))] flex-shrink-0" />
              </CardContent>
            </Card>
          </Link>
        </section>
      </div>
    </AppLayout>
  );
}
