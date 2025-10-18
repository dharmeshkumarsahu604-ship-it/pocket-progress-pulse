import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, LogOut, Settings, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface UserProfile {
  full_name: string;
  institute: string | null;
  bio: string | null;
}

interface UserRole {
  role: string;
}

export default function Profile() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userRole, setUserRole] = useState<string>("student");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("full_name, institute, bio")
          .eq("id", user.id)
          .single();

        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single();

        if (profileData) setProfile(profileData);
        if (roleData) setUserRole(roleData.role);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const fullName = profile?.full_name || "User";
  const role = userRole;

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p>Loading profile...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 max-w-2xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-2xl">
                  {fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{fullName}</h2>
                <Badge variant="secondary" className="mt-1 capitalize">
                  {role}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">{user?.email}</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                <User className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm capitalize">{role}</span>
              </div>
              {profile?.institute && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">{profile.institute}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Scanned Specimens</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Field Notes</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Voice Notes</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Bookmarks</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3">
          <Link to="/settings">
            <Button variant="outline" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </Link>
          <Button
            variant="destructive"
            onClick={handleSignOut}
            className="w-full justify-start"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
