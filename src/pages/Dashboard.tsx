import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Mic, FileText, Mountain, Gem, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

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

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Specimens</CardDescription>
              <CardTitle className="text-2xl">0</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Field Notes</CardDescription>
              <CardTitle className="text-2xl">0</CardTitle>
            </CardHeader>
          </Card>
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
