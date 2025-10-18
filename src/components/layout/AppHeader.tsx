import { Mountain } from "lucide-react";
import { Link } from "react-router-dom";

export const AppHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-card border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 max-w-screen-xl mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <Mountain className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-foreground">Geo-Smart</span>
        </Link>
        
        <div className="flex items-center gap-2">
          {/* User info will be added here later */}
        </div>
      </div>
    </header>
  );
};
