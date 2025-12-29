import { Mountain, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export const AppHeader = () => {
  const { user } = useAuth();
  const userMetadata = user?.user_metadata || {};
  const fullName = userMetadata.full_name || "User";
  const avatarUrl = userMetadata.avatar_url;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between h-14 px-4 max-w-screen-xl mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
            <Mountain className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-foreground">Geo-Smart</span>
        </Link>
        
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button variant="ghost" size="icon" className="relative h-9 w-9">
                <Bell className="h-5 w-5 text-foreground-secondary" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent" />
              </Button>
              <Link to="/profile">
                <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-border hover:ring-primary transition-all">
                  <AvatarImage src={avatarUrl} alt={fullName} />
                  <AvatarFallback className="text-xs bg-primary text-primary-foreground font-medium">
                    {fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </>
          ) : (
            <Link to="/auth">
              <Button size="sm" variant="default">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
