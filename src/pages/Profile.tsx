import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, LogOut, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export default function Profile() {
  const { user, signOut } = useAuth();

  const userMetadata = user?.user_metadata || {};
  const fullName = userMetadata.full_name || "User";
  const role = userMetadata.role || "user";

  const handleSignOut = async () => {
    await signOut();
  };

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
