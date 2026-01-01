import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  Mountain, 
  Gem, 
  ChevronRight, 
  Sparkles, 
  FileText,
  Plus,
  ArrowRight,
  RefreshCw
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState, useRef, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { getDailyLearningCards, getIconForType, LearningTip } from "@/data/dailyLearningTips";

interface FieldNote {
  id: string;
  title: string;
  content: string;
  photos: string[];
  latitude?: number;
  longitude?: number;
  locationName?: string;
  weatherConditions?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface SpecimenOfDay {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  type: "rock" | "mineral";
  subtype?: string;
}

// Generate a deterministic "random" index based on date
function getDailyIndex(max: number, offset: number = 0): number {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate() + offset;
  return seed % max;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

// Get category color based on tip category
function getCategoryColor(category: LearningTip['category']): string {
  switch (category) {
    case 'rock': return 'bg-primary/10 text-primary';
    case 'mineral': return 'bg-accent/10 text-accent';
    case 'site': return 'bg-secondary/10 text-secondary';
    case 'compass': return 'bg-warning/10 text-warning';
    case 'exam': return 'bg-success/10 text-success';
    default: return 'bg-muted text-muted-foreground';
  }
}

function getCategoryLabel(category: LearningTip['category']): string {
  switch (category) {
    case 'rock': return 'Rocks';
    case 'mineral': return 'Minerals';
    case 'site': return 'Field Sites';
    case 'compass': return 'Compass';
    case 'exam': return 'Exam Prep';
    default: return 'Geology';
  }
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scanCount, setScanCount] = useState(0);
  const [fieldNotes] = useLocalStorage<FieldNote[]>("field-notes", []);
  const [specimenOfDay, setSpecimenOfDay] = useState<SpecimenOfDay | null>(null);
  const [loadingSpecimen, setLoadingSpecimen] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Get daily learning cards - memoized to prevent recalculation
  const dailyLearningCards = useMemo(() => getDailyLearningCards(), []);

  useEffect(() => {
    fetchSpecimenOfDay();
    if (user) {
      fetchScanCount();
    }
  }, [user]);

  const fetchScanCount = async () => {
    const { count } = await supabase
      .from("scan_history")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user?.id);
    
    setScanCount(count || 0);
  };

  const fetchSpecimenOfDay = async () => {
    try {
      const [rocksResult, mineralsResult] = await Promise.all([
        supabase.from("rocks").select("id, name, description, image_url, type"),
        supabase.from("minerals").select("id, name, description, image_url, hardness")
      ]);

      const rocks = rocksResult.data || [];
      const minerals = mineralsResult.data || [];

      const allSpecimens: SpecimenOfDay[] = [
        ...rocks.map(r => ({
          id: r.id,
          name: r.name,
          description: r.description,
          image_url: r.image_url,
          type: "rock" as const,
          subtype: r.type
        })),
        ...minerals.map(m => ({
          id: m.id,
          name: m.name,
          description: m.description,
          image_url: m.image_url,
          type: "mineral" as const,
          subtype: m.hardness ? `Hardness: ${m.hardness}` : undefined
        }))
      ];

      if (allSpecimens.length > 0) {
        const index = getDailyIndex(allSpecimens.length);
        setSpecimenOfDay(allSpecimens[index]);
      }
    } catch (error) {
      console.error("Error fetching specimen of the day:", error);
    } finally {
      setLoadingSpecimen(false);
    }
  };

  // Non-authenticated view
  if (!user) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center px-4">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center shadow-lg">
            <Mountain className="h-10 w-10 text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Welcome to Geo-Smart</h1>
            <p className="text-lg text-foreground-secondary max-w-md">
              Your AI-powered geological field companion
            </p>
          </div>
          <Link to="/auth">
            <Button size="lg" className="bg-gradient-to-r from-secondary to-primary hover:opacity-90 transition-opacity">
              Get Started
            </Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const userName = user.user_metadata?.full_name?.split(' ')[0] || "Explorer";

  return (
    <AppLayout>
      <div className="space-y-5 pb-2">
        {/* Personalized Greeting */}
        <div className="pt-1">
          <h1 className="text-xl font-semibold text-foreground">
            {getGreeting()} 👋
          </h1>
          <p className="text-foreground-secondary text-sm mt-0.5">
            Ready for field exploration today, {userName}?
          </p>
        </div>

        {/* Primary CTA - Identify Rock */}
        <Card 
          className="overflow-hidden border-0 shadow-lg cursor-pointer active:scale-[0.98] transition-transform"
          onClick={() => navigate("/scanner")}
        >
          <div className="bg-gradient-to-br from-secondary to-primary p-5 text-white">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Identify a Rock</h2>
                  <p className="text-white/80 text-sm mt-1">
                    Scan or upload a specimen image
                  </p>
                </div>
                <Button 
                  className="bg-white text-foreground hover:bg-white/90 font-semibold shadow-md"
                  size="sm"
                >
                  Scan Now
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <div className="opacity-20">
                <Mountain className="h-24 w-24" />
              </div>
            </div>
          </div>
        </Card>

        {/* Today's Specimen */}
        {loadingSpecimen ? (
          <Card className="p-4">
            <div className="flex gap-4 animate-pulse">
              <div className="w-24 h-24 rounded-xl bg-muted" />
              <div className="flex-1 space-y-3">
                <div className="h-4 w-20 bg-muted rounded" />
                <div className="h-6 w-32 bg-muted rounded" />
                <div className="h-4 w-full bg-muted rounded" />
              </div>
            </div>
          </Card>
        ) : specimenOfDay && (
          <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex gap-4">
                {/* Larger Image */}
                <div className="flex-shrink-0">
                  {specimenOfDay.image_url ? (
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shadow-sm">
                      <img
                        src={specimenOfDay.image_url}
                        alt={specimenOfDay.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-muted flex items-center justify-center">
                      {specimenOfDay.type === "rock" ? (
                        <Mountain className="h-10 w-10 text-muted-foreground" />
                      ) : (
                        <Gem className="h-10 w-10 text-muted-foreground" />
                      )}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge variant="secondary" className="bg-accent/10 text-accent border-0 text-xs font-medium px-2 py-0.5">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Today's Specimen
                    </Badge>
                  </div>
                  
                  <h3 className="font-bold text-lg text-foreground leading-tight">
                    {specimenOfDay.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="bg-muted text-muted-foreground border-0 capitalize text-xs px-2 py-0.5">
                      {specimenOfDay.type}
                    </Badge>
                    {specimenOfDay.subtype && (
                      <Badge variant="outline" className="bg-muted text-muted-foreground border-0 capitalize text-xs px-2 py-0.5">
                        {specimenOfDay.subtype}
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-foreground-secondary line-clamp-1 mt-2">
                    {specimenOfDay.description}
                  </p>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 mt-3">
                    <Link to={specimenOfDay.type === "rock" ? `/rocks/${specimenOfDay.id}` : `/minerals/${specimenOfDay.id}`}>
                      <Button size="sm" variant="default" className="h-8 text-xs">
                        View Details
                      </Button>
                    </Link>
                    <Link to={specimenOfDay.type === "rock" ? "/rocks" : "/minerals"}>
                      <Button size="sm" variant="outline" className="h-8 text-xs">
                        Similar {specimenOfDay.type === "rock" ? "Rocks" : "Minerals"}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Daily Learning Carousel - Rotates every 24 hours */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-semibold text-foreground">Quick Learning</h2>
            <Badge variant="outline" className="text-xs gap-1">
              <RefreshCw className="h-3 w-3" />
              Daily Tips
            </Badge>
          </div>
          <div 
            ref={carouselRef}
            className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {dailyLearningCards.map((tip, index) => {
              const Icon = getIconForType(tip.iconType);
              return (
                <Card 
                  key={tip.id} 
                  className="flex-shrink-0 w-72 border shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getCategoryColor(tip.category)}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-xs font-semibold text-foreground">
                            {tip.title}
                          </p>
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                            {getCategoryLabel(tip.category)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground leading-snug">
                          {tip.content}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Progress & Action Cards */}
        <div className="grid grid-cols-2 gap-3">
          {/* Specimens Card */}
          <Card 
            className="shadow-sm hover:shadow-md transition-shadow cursor-pointer active:scale-[0.98]"
            onClick={() => navigate("/scanner")}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Camera className="h-5 w-5 text-primary" />
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold text-foreground">{scanCount}</p>
              <p className="text-sm text-foreground-secondary">collected</p>
              <div className="flex items-center gap-1 mt-2 text-primary">
                <Plus className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">Add specimen</span>
              </div>
            </CardContent>
          </Card>

          {/* Field Notes Card */}
          <Card 
            className="shadow-sm hover:shadow-md transition-shadow cursor-pointer active:scale-[0.98]"
            onClick={() => navigate("/field-notes")}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-secondary" />
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
              {fieldNotes.length > 0 ? (
                <>
                  <p className="text-2xl font-bold text-foreground">{fieldNotes.length}</p>
                  <p className="text-sm text-foreground-secondary">field notes</p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-foreground">No notes yet</p>
                  <p className="text-xs text-foreground-secondary mt-0.5">Start documenting</p>
                </>
              )}
              <div className="flex items-center gap-1 mt-2 text-secondary">
                <ArrowRight className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">
                  {fieldNotes.length > 0 ? "View notes" : "Start first note"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Explore Section */}
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-foreground px-1">Explore</h2>
          <div className="grid grid-cols-3 gap-3">
            <Link 
              to="/rocks" 
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Mountain className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">Rocks</span>
            </Link>
            <Link 
              to="/minerals" 
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Gem className="h-6 w-6 text-accent" />
              </div>
              <span className="text-sm font-medium text-foreground">Minerals</span>
            </Link>
            <Link 
              to="/sites" 
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                <svg className="h-6 w-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-foreground">Sites</span>
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
