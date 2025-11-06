import { Loader2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PullToRefreshIndicatorProps {
  pullDistance: number;
  isRefreshing: boolean;
  isOverThreshold: boolean;
  threshold?: number;
}

export const PullToRefreshIndicator = ({
  pullDistance,
  isRefreshing,
  isOverThreshold,
  threshold = 80,
}: PullToRefreshIndicatorProps) => {
  if (pullDistance === 0 && !isRefreshing) return null;

  const rotation = Math.min((pullDistance / threshold) * 360, 360);
  const opacity = Math.min(pullDistance / threshold, 1);
  const scale = Math.min(0.6 + (pullDistance / threshold) * 0.4, 1);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center pointer-events-none"
      style={{
        transform: `translateY(${Math.min(pullDistance, 80)}px)`,
        opacity: opacity,
        transition: pullDistance === 0 ? 'all 0.3s ease-out' : 'none',
      }}
    >
      <div
        className={cn(
          "bg-background border border-border rounded-full p-3 shadow-lg",
          isRefreshing && "animate-pulse"
        )}
        style={{
          transform: `scale(${scale})`,
          transition: pullDistance === 0 ? 'transform 0.3s ease-out' : 'none',
        }}
      >
        {isRefreshing ? (
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
        ) : (
          <RefreshCw
            className={cn(
              "h-6 w-6 transition-colors",
              isOverThreshold ? "text-primary" : "text-muted-foreground"
            )}
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: 'transform 0.1s ease-out',
            }}
          />
        )}
      </div>
      
      <div
        className="absolute -bottom-8 text-xs font-medium text-muted-foreground"
        style={{
          opacity: opacity,
        }}
      >
        {isRefreshing
          ? 'Refreshing...'
          : isOverThreshold
          ? 'Release to refresh'
          : 'Pull to refresh'}
      </div>
    </div>
  );
};
