import { useEffect, useRef, useState } from 'react';

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void>;
  threshold?: number;
  maxPullDistance?: number;
  enabled?: boolean;
}

export const usePullToRefresh = ({
  onRefresh,
  threshold = 80,
  maxPullDistance = 150,
  enabled = true,
}: UsePullToRefreshOptions) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [canPull, setCanPull] = useState(false);
  
  const touchStartY = useRef(0);
  const scrollableElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      // Only allow pull-to-refresh if we're at the top of the page
      const isAtTop = window.scrollY === 0 || 
                      (scrollableElement.current && scrollableElement.current.scrollTop === 0);
      
      if (isAtTop && !isRefreshing) {
        touchStartY.current = e.touches[0].clientY;
        setCanPull(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!canPull || isRefreshing) return;

      const currentY = e.touches[0].clientY;
      const distance = currentY - touchStartY.current;

      if (distance > 0) {
        // Prevent default scrolling behavior when pulling down
        if (window.scrollY === 0) {
          e.preventDefault();
        }

        // Apply resistance to the pull (gets harder to pull the further you go)
        const resistance = 2.5;
        const adjustedDistance = Math.min(
          distance / resistance,
          maxPullDistance
        );
        
        setPullDistance(adjustedDistance);
      }
    };

    const handleTouchEnd = async () => {
      if (!canPull || isRefreshing) return;

      setCanPull(false);

      if (pullDistance >= threshold) {
        setIsRefreshing(true);
        try {
          await onRefresh();
        } catch (error) {
          console.error('Refresh failed:', error);
        } finally {
          setTimeout(() => {
            setIsRefreshing(false);
            setPullDistance(0);
          }, 500);
        }
      } else {
        setPullDistance(0);
      }
    };

    // Attach listeners to the window for better touch handling
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, canPull, isRefreshing, pullDistance, threshold, maxPullDistance, onRefresh]);

  return {
    pullDistance,
    isRefreshing,
    isPulling: pullDistance > 0,
    isOverThreshold: pullDistance >= threshold,
  };
};
