import { ReactNode } from "react";
import { BottomNavigation } from "./BottomNavigation";
import { AppHeader } from "./AppHeader";

interface AppLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showNav?: boolean;
}

export const AppLayout = ({ 
  children, 
  showHeader = true, 
  showNav = true 
}: AppLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {showHeader && <AppHeader />}
      
      <main className={cn(
        "flex-1 w-full",
        showHeader && "pt-16",
        showNav && "pb-20"
      )}>
        <div className="container mx-auto px-4 py-6 max-w-screen-xl">
          {children}
        </div>
      </main>

      {showNav && <BottomNavigation />}
    </div>
  );
};

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
