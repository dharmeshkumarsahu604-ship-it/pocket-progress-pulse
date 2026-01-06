import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Animated loading spinner component
export const LoadingSpinner = ({ 
  size = "default",
  className 
}: { 
  size?: "sm" | "default" | "lg";
  className?: string;
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-8 w-8",
    lg: "h-12 w-12"
  };
  
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Loader2 className={cn(sizeClasses[size], "animate-spin text-primary")} />
    </div>
  );
};

// Full page loading state
export const PageLoader = ({ message = "Loading..." }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
    <div className="relative">
      <div className="h-16 w-16 rounded-full border-4 border-primary/20 animate-pulse" />
      <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-transparent border-t-primary animate-spin" />
    </div>
    <p className="mt-4 text-muted-foreground animate-pulse">{message}</p>
  </div>
);

// Skeleton with shimmer animation
export const CardSkeleton = ({ delay = 0 }: { delay?: number }) => (
  <Card 
    className="p-4 space-y-3 animate-fade-in overflow-hidden" 
    style={{ animationDelay: `${delay}ms` }}
  >
    <Skeleton className="h-48 w-full rounded-lg shimmer" />
    <Skeleton className="h-6 w-3/4 shimmer" />
    <Skeleton className="h-4 w-full shimmer" />
    <Skeleton className="h-4 w-2/3 shimmer" />
  </Card>
);

export const ListSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} delay={i * 100} />
    ))}
  </div>
);

export const LoadingSkeleton = ListSkeleton;

export const DetailSkeleton = () => (
  <div className="space-y-6 animate-fade-in">
    <Skeleton className="h-64 w-full rounded-lg shimmer" />
    <Skeleton className="h-8 w-1/2 shimmer" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-full shimmer" />
      <Skeleton className="h-4 w-full shimmer" />
      <Skeleton className="h-4 w-3/4 shimmer" />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <Skeleton className="h-20 shimmer" />
      <Skeleton className="h-20 shimmer" />
    </div>
  </div>
);

export const SearchBarSkeleton = () => (
  <div className="animate-fade-in">
    <Skeleton className="h-12 w-full rounded-lg shimmer" />
  </div>
);

export const FilterSkeleton = () => (
  <div className="flex gap-2 animate-fade-in" style={{ animationDelay: '100ms' }}>
    <Skeleton className="h-10 w-24 rounded-full shimmer" />
    <Skeleton className="h-10 w-32 rounded-full shimmer" />
    <Skeleton className="h-10 w-28 rounded-full shimmer" />
  </div>
);

// Inline loading indicator for buttons or small areas
export const InlineLoader = ({ text = "Loading" }: { text?: string }) => (
  <div className="flex items-center gap-2">
    <Loader2 className="h-4 w-4 animate-spin" />
    <span className="animate-pulse">{text}</span>
  </div>
);

// Pulsing dot loader
export const DotLoader = () => (
  <div className="flex items-center gap-1">
    <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
    <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
    <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
  </div>
);
