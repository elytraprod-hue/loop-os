import { useRef, useState } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipe?: (direction: 'left' | 'right' | 'up' | 'down') => void;
  threshold?: number;
}

interface GestureHandlerProps {
  children: React.ReactNode;
  swipeHandlers?: SwipeHandlers;
  pinchToZoom?: boolean;
  onPinch?: (scale: number) => void;
  onDoubleTap?: () => void;
  longPressDelay?: number;
  onLongPress?: () => void;
}

export const GestureHandler = ({
  children,
  swipeHandlers,
  pinchToZoom = false,
  onPinch,
  onDoubleTap,
  longPressDelay = 500,
  onLongPress,
}: GestureHandlerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });
  const [initialDistance, setInitialDistance] = useState(0);
  const [lastTap, setLastTap] = useState(0);
  const longPressTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setTouchEnd({ x: touch.clientX, y: touch.clientY });

    // Handle pinch to zoom
    if (e.touches.length === 2 && pinchToZoom) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      if (touch1 && touch2) {
        const distance = Math.hypot(
          touch1.clientX - touch2.clientX,
          touch1.clientY - touch2.clientY
        );
        setInitialDistance(distance);
      }
    }

    // Handle double tap
    const now = Date.now();
    if (now - lastTap < 300) {
      onDoubleTap?.();
    }
    setLastTap(now);

    // Handle long press
    longPressTimerRef.current = setTimeout(() => {
      onLongPress?.();
    }, longPressDelay);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    
    setTouchEnd({ x: touch.clientX, y: touch.clientY });

    // Clear long press timer on move
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }

    // Handle pinch to zoom
    if (e.touches.length === 2 && pinchToZoom && onPinch) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      if (touch1 && touch2) {
        const distance = Math.hypot(
          touch1.clientX - touch2.clientX,
          touch1.clientY - touch2.clientY
        );
        const scale = distance / initialDistance;
        onPinch(scale);
      }
    }
  };

  const handleTouchEnd = () => {
    // Clear long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }

    const deltaX = touchEnd.x - touchStart.x;
    const deltaY = touchEnd.y - touchStart.y;
    const threshold = swipeHandlers?.threshold || 50;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
          swipeHandlers?.onSwipeRight?.();
          swipeHandlers?.onSwipe?.('right');
        } else {
          swipeHandlers?.onSwipeLeft?.();
          swipeHandlers?.onSwipe?.('left');
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > threshold) {
        if (deltaY > 0) {
          swipeHandlers?.onSwipeDown?.();
          swipeHandlers?.onSwipe?.('down');
        } else {
          swipeHandlers?.onSwipeUp?.();
          swipeHandlers?.onSwipe?.('up');
        }
      }
    }
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="touch-none"
    >
      {children}
    </div>
  );
};

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
  className?: string;
}

export const SwipeableCard = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  threshold = 100,
  className = '',
}: SwipeableCardProps) => {
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    
    startX.current = touch.clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    if (!touch) return;
    
    const currentX = touch.clientX;
    const deltaX = currentX - startX.current;
    setTranslateX(deltaX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);

    if (Math.abs(translateX) > threshold) {
      if (translateX > 0) {
        onSwipeRight?.();
      } else {
        onSwipeLeft?.();
      }
    }

    setTranslateX(0);
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`transition-transform duration-200 ${className}`}
      style={{ transform: `translateX(${translateX}px)` }}
    >
      {children}
    </div>
  );
};
