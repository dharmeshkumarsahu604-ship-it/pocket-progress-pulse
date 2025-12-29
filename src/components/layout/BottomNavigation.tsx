import { Home, Mountain, Gem, Camera, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Mountain, label: "Rocks", path: "/rocks" },
  { icon: Gem, label: "Minerals", path: "/minerals" },
  { icon: Camera, label: "Scan", path: "/scanner", isHighlighted: true },
  { icon: Menu, label: "More", path: "/more" },
];

export const BottomNavigation = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t border-border">
      <div className="flex justify-around items-center h-16 max-w-screen-xl mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
                          (item.path !== "/" && location.pathname.startsWith(item.path));
          const Icon = item.icon;
          
          // Special styling for Scan tab
          if (item.isHighlighted) {
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-xl transition-all flex-1 min-w-0",
                  "touch-manipulation active:scale-95"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center h-10 w-10 rounded-full -mt-4 shadow-lg transition-all",
                  isActive 
                    ? "bg-accent text-accent-foreground scale-110" 
                    : "bg-accent/90 text-accent-foreground hover:bg-accent"
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={cn(
                  "text-xs font-semibold truncate",
                  isActive ? "text-accent" : "text-accent"
                )}>{item.label}</span>
              </Link>
            );
          }
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all flex-1 min-w-0",
                "touch-manipulation active:scale-95",
                isActive
                  ? "text-primary"
                  : "text-foreground-secondary hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "fill-primary/20")} />
              <span className={cn(
                "text-xs truncate",
                isActive ? "font-semibold" : "font-medium"
              )}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
