import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Play,
  Clock,
  Award,
  Search,
  Filter,
  MapPin,
  GraduationCap,
} from "lucide-react";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";

interface FieldTrip {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  difficulty_level: string;
  creator_id: string;
  site_id: string | null;
  profiles: {
    full_name: string;
  };
}

export default function FieldTrips() {
  const navigate = useNavigate();
  const [fieldTrips, setFieldTrips] = useState<FieldTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  useEffect(() => {
    fetchFieldTrips();
  }, []);

  const fetchFieldTrips = async () => {
    try {
      const { data, error } = await supabase
        .from("field_trips")
        .select(`
          *,
          profiles(full_name)
        `)
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFieldTrips(data as any || []);
    } catch (error) {
      console.error("Error fetching field trips:", error);
      toast.error("Failed to load field trips");
    } finally {
      setLoading(false);
    }
  };

  const filteredTrips = fieldTrips.filter((trip) => {
    const matchesSearch =
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty =
      !selectedDifficulty || trip.difficulty_level === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <LoadingSkeleton />
          <LoadingSkeleton />
          <LoadingSkeleton />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Virtual Field Trips</h1>
            <p className="text-muted-foreground mt-2">
              Explore geological wonders with guided 360° tours
            </p>
          </div>
          <GraduationCap className="h-12 w-12 text-primary" />
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search field trips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {["beginner", "intermediate", "advanced"].map((level) => (
              <Button
                key={level}
                variant={selectedDifficulty === level ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  setSelectedDifficulty(selectedDifficulty === level ? null : level)
                }
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {filteredTrips.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground">
                No field trips found. Check back soon!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTrips.map((trip) => (
              <Card
                key={trip.id}
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => navigate(`/field-trips/${trip.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {trip.title}
                    </CardTitle>
                    <Badge className={getDifficultyColor(trip.difficulty_level)}>
                      {trip.difficulty_level}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {trip.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {trip.duration_minutes} min
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="h-4 w-4" />
                        Interactive
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground">
                        Created by {trip.profiles?.full_name || "Educator"}
                      </p>
                    </div>

                    <Button className="w-full" size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Start Field Trip
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
