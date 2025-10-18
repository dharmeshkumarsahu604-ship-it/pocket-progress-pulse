import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export const CardSkeleton = () => (
  <Card className="p-4 space-y-3">
    <Skeleton className="h-48 w-full rounded-lg" />
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
  </Card>
);

export const ListSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

export const LoadingSkeleton = ListSkeleton;

export const DetailSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="h-64 w-full rounded-lg" />
    <Skeleton className="h-8 w-1/2" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <Skeleton className="h-20" />
      <Skeleton className="h-20" />
    </div>
  </div>
);
