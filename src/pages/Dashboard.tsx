import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Mic, FileText, Mountain, Gem, MapPin, ChevronRight, Sparkles, Lightbulb } from "lucide-react";
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

// Geological facts for "Did You Know?" section
const geologicalFacts = [
  "The oldest known rocks on Earth are about 4 billion years old, found in northern Canada.",
  "Diamonds are formed about 150-200 kilometers below Earth's surface under extreme pressure and temperature.",
  "The Himalayan mountains grow about 5 millimeters taller every year due to tectonic plate movement.",
  "Obsidian, a volcanic glass, was used by ancient civilizations to make surgical scalpels sharper than steel.",
  "The Grand Canyon exposes rocks that are nearly 2 billion years old at its deepest points.",
  "Pumice is the only rock that can float on water due to its porous, air-filled structure.",
  "The Earth's core is as hot as the surface of the Sun, reaching temperatures of about 5,500°C.",
  "Peridot is one of the few gemstones that forms deep in the Earth's mantle, not in the crust.",
  "The Mariana Trench is so deep that if Mount Everest were placed at its bottom, the peak would still be underwater.",
  "Fossils can only form in sedimentary rocks because igneous and metamorphic rocks destroy organic remains.",
  "The largest crystal ever found was a selenite crystal in Mexico measuring 12 meters long and weighing 55 tons.",
  "Tectonic plates move at about the same rate as your fingernails grow - a few centimeters per year.",
  "The Sahara Desert was once a lush tropical region with rivers and lakes about 6,000 years ago.",
  "Iceland sits on the Mid-Atlantic Ridge where two tectonic plates are pulling apart, creating new crust.",
  "Coal is formed from ancient plant matter that has been compressed for millions of years.",
  "The mineral feldspar makes up about 60% of the Earth's crust, making it the most abundant mineral.",
  "Mount Everest contains marine limestone with fossils of sea creatures from an ancient ocean floor.",
  "Volcanic lightning occurs when ash particles collide and create static electricity during eruptions.",
  "The oldest water on Earth, found in a Canadian mine, is about 2 billion years old.",
  "Amber is fossilized tree resin that can preserve insects and plants for millions of years.",
  "The Deccan Traps in India are the result of volcanic eruptions that may have contributed to dinosaur extinction.",
  "Quartz is piezoelectric, meaning it generates electricity when pressure is applied to it.",
  "The Earth's magnetic poles have reversed hundreds of times throughout geological history.",
  "Gneiss rocks can be over 4 billion years old, making them some of the oldest materials on Earth.",
  "A single volcanic eruption can release more CO2 than all human activity in a year.",
  "The mineral halite (rock salt) forms when ancient seas evaporate, leaving behind salt deposits.",
  "Stalactites grow from the ceiling while stalagmites grow from the floor of caves.",
  "The Mohs hardness scale was created in 1812 by German geologist Friedrich Mohs.",
  "Plate tectonics recycles the ocean floor every 200 million years through subduction.",
  "The largest earthquake ever recorded was a 9.5 magnitude in Chile in 1960."
];

// Generate a deterministic "random" index based on date
function getDailyIndex(max: number, offset: number = 0): number {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate() + offset;
  return seed % max;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [scanCount, setScanCount] = useState(0);
  const [fieldNotes] = useLocalStorage<FieldNote[]>("field-notes", []);
  const [specimenOfDay, setSpecimenOfDay] = useState<SpecimenOfDay | null>(null);
  const [loadingSpecimen, setLoadingSpecimen] = useState(true);
  
  // Get daily fact using offset to ensure different from specimen
  const dailyFact = geologicalFacts[getDailyIndex(geologicalFacts.length, 7)];

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

        {/* Did You Know? */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Lightbulb className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary mb-1">Did You Know?</p>
                <p className="text-sm text-muted-foreground">{dailyFact}</p>
              </div>
            </div>
          </CardContent>
        </Card>

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
