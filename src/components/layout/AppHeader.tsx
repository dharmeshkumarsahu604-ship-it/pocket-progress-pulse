import { Mountain } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const AppHeader = () => {
  const { user } = useAuth();
  const userMetadata = user?.user_metadata || {};
  const fullName = userMetadata.full_name || "User";

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-card border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 max-w-screen-xl mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <Mountain className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-foreground">Geo-Smart</span>
        </Link>
        
        <div className="flex items-center gap-2">
          {user ? (
            <Link to="/profile">
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarFallback className="text-xs">
                  {fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <Link to="/auth" className="text-sm font-medium hover:text-primary transition-colors">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
