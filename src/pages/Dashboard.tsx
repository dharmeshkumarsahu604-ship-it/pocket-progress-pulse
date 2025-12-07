import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Mic, FileText, Mountain, Gem, MapPin, ChevronRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLocalStorage } from "@/hooks/useLocalStorage";

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
  subtype?: string; // rock type (igneous, etc.) or mineral hardness
}

// Generate a deterministic "random" index based on date
function getDailyIndex(max: number): number {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  return seed % max;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [scanCount, setScanCount] = useState(0);
  const [fieldNotes] = useLocalStorage<FieldNote[]>("field-notes", []);
  const [specimenOfDay, setSpecimenOfDay] = useState<SpecimenOfDay | null>(null);
  const [loadingSpecimen, setLoadingSpecimen] = useState(true);

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
      // Fetch all rocks and minerals
      const [rocksResult, mineralsResult] = await Promise.all([
        supabase.from("rocks").select("id, name, description, image_url, type"),
        supabase.from("minerals").select("id, name, description, image_url, hardness")
      ]);

      const rocks = rocksResult.data || [];
      const minerals = mineralsResult.data || [];

      // Combine into one array
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

  if (!user) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
          <Mountain className="h-20 w-20 text-primary" />
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Welcome to Geo-Smart</h1>
            <p className="text-xl text-muted-foreground max-w-md">
              Your AI-powered geological field companion
            </p>
          </div>
          <Link to="/auth">
            <Button size="lg">Get Started</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Welcome to Geo-Smart</h1>
          <p className="text-muted-foreground">Your AI-powered geological field companion</p>
        </div>

        {/* Specimen of the Day */}
        {!loadingSpecimen && specimenOfDay && (
          <Link to={specimenOfDay.type === "rock" ? `/rocks/${specimenOfDay.id}` : `/minerals/${specimenOfDay.id}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative">
                {specimenOfDay.image_url ? (
                  <img
                    src={specimenOfDay.image_url}
                    alt={specimenOfDay.name}
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  <div className="w-full h-40 bg-muted flex items-center justify-center">
                    {specimenOfDay.type === "rock" ? (
                      <Mountain className="h-16 w-16 text-muted-foreground" />
                    ) : (
                      <Gem className="h-16 w-16 text-muted-foreground" />
                    )}
                  </div>
                )}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Specimen of the Day
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg">{specimenOfDay.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="capitalize text-xs">
                        {specimenOfDay.type}
                      </Badge>
                      {specimenOfDay.subtype && (
                        <span className="text-xs text-muted-foreground capitalize">
                          {specimenOfDay.subtype}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {specimenOfDay.description}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        )}

        {/* Quick Stats - Clickable */}
        <div className="grid grid-cols-2 gap-4">
          <Link to="/scanner">
            <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardDescription>Specimens</CardDescription>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardTitle className="text-2xl">{scanCount}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
          <Link to="/field-notes">
            <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardDescription>Field Notes</CardDescription>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardTitle className="text-2xl">{fieldNotes.length}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Link to="/scanner">
              <Button className="w-full justify-start" size="lg">
                <Camera className="mr-2 h-5 w-5" />
                Scan Specimen
              </Button>
            </Link>
            <Link to="/voice-notes">
              <Button variant="secondary" className="w-full justify-start" size="lg">
                <Mic className="mr-2 h-5 w-5" />
                Voice Note
              </Button>
            </Link>
            <Link to="/field-notes">
              <Button variant="secondary" className="w-full justify-start" size="lg">
                <FileText className="mr-2 h-5 w-5" />
                Field Note
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Featured Section */}
        <Card>
          <CardHeader>
            <CardTitle>Explore</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-3">
            <Link to="/rocks" className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
              <Mountain className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium text-center">Rocks</span>
            </Link>
            <Link to="/minerals" className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
              <Gem className="h-8 w-8 text-accent" />
              <span className="text-sm font-medium text-center">Minerals</span>
            </Link>
            <Link to="/sites" className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
              <MapPin className="h-8 w-8 text-secondary" />
              <span className="text-sm font-medium text-center">Sites</span>
            </Link>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
