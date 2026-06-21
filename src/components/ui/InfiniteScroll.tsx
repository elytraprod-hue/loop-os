import { useEffect, useRef, useState } from 'react';

interface InfiniteScrollProps {
  children: React.ReactNode;
  onLoadMore: () => void;
  hasMore: boolean;
  loading?: boolean;
  threshold?: number;
}

export const InfiniteScroll = ({ 
  children, 
  onLoadMore, 
  hasMore, 
  loading = false, 
  threshold = 100 
}: InfiniteScrollProps) => {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading) {
          setIsIntersecting(true);
          onLoadMore();
        } else {
          setIsIntersecting(false);
        }
      },
      { rootMargin: `${threshold}px` }
    );

    const sentinel = sentinelRef.current;
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [hasMore, loading, onLoadMore, threshold]);

  return (
    <div className="relative">
      {children}
      {hasMore && (
        <div ref={sentinelRef} className="w-full h-20 flex items-center justify-center">
          {loading && (
            <div className="flex items-center gap-2 text-gray-400">
              <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Carregando mais...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  threshold?: number;
  loading?: boolean;
}

export const PullToRefresh = ({ 
  children, 
  onRefresh, 
  threshold = 80, 
  loading = false 
}: PullToRefreshProps) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling) return;

    const currentY = e.touches[0].clientY;
    const distance = currentY - startY.current;

    if (distance > 0) {
      e.preventDefault();
      setPullDistance(Math.min(distance * 0.5, threshold * 1.5));
    }
  };

  const handleTouchEnd = async () => {
    setIsPulling(false);

    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(threshold);
      
      await onRefresh();
      
      setIsRefreshing(false);
      setPullDistance(0);
    } else {
      setPullDistance(0);
    }
  };

  const progress = Math.min(pullDistance / threshold, 1);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center transition-transform duration-200"
        style={{
          transform: `translateY(${pullDistance}px)`,
          height: `${threshold}px`,
        }}
      >
        <div className="flex items-center gap-2 text-orange-500">
          <div 
            className={`w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full ${
              isRefreshing || progress >= 1 ? 'animate-spin' : ''
            }`}
            style={{
              transform: `rotate(${progress * 360}deg)`,
            }}
          />
          <span className="text-sm font-medium">
            {isRefreshing ? 'Atualizando...' : progress >= 1 ? 'Solte para atualizar' : 'Puxe para atualizar'}
          </span>
        </div>
      </div>
      <div
        className="transition-transform duration-200"
        style={{ transform: `translateY(${pullDistance}px)` }}
      >
        {children}
      </div>
    </div>
  );
};
