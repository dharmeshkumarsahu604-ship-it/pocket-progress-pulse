import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Mic, FileText, Mountain, Gem, MapPin, ChevronRight } from "lucide-react";
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

export default function Dashboard() {
  const { user } = useAuth();
  const [scanCount, setScanCount] = useState(0);
  const [fieldNotes] = useLocalStorage<FieldNote[]>("field-notes", []);

  useEffect(() => {
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
