import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export const CardSkeleton = ({ delay = 0 }: { delay?: number }) => (
  <Card className="p-4 space-y-3 animate-fade-in" style={{ animationDelay: `${delay}ms` }}>
    <Skeleton className="h-48 w-full rounded-lg animate-pulse" />
    <Skeleton className="h-6 w-3/4 animate-pulse" />
    <Skeleton className="h-4 w-full animate-pulse" />
    <Skeleton className="h-4 w-2/3 animate-pulse" />
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
  <div className="space-y-6">
    <Skeleton className="h-64 w-full rounded-lg animate-pulse" />
    <Skeleton className="h-8 w-1/2 animate-pulse" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-full animate-pulse" />
      <Skeleton className="h-4 w-full animate-pulse" />
      <Skeleton className="h-4 w-3/4 animate-pulse" />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <Skeleton className="h-20 animate-pulse" />
      <Skeleton className="h-20 animate-pulse" />
    </div>
  </div>
);

export const SearchBarSkeleton = () => (
  <div className="animate-fade-in">
    <Skeleton className="h-12 w-full rounded-lg animate-pulse" />
  </div>
);

export const FilterSkeleton = () => (
  <div className="flex gap-2 animate-fade-in" style={{ animationDelay: '100ms' }}>
    <Skeleton className="h-10 w-24 rounded-full animate-pulse" />
    <Skeleton className="h-10 w-32 rounded-full animate-pulse" />
    <Skeleton className="h-10 w-28 rounded-full animate-pulse" />
  </div>
);
