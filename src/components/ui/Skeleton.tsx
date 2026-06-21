import { cn } from '../../lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circle' | 'rect';
  width?: string | number;
  height?: string | number;
  shimmer?: boolean;
  pulse?: boolean;
}

export const Skeleton = ({ className, variant = 'rect', width, height, shimmer = true, pulse = false }: SkeletonProps) => {
  const variantClass = {
    text: 'h-4 rounded-md',
    circle: 'rounded-full',
    rect: 'rounded-xl',
  }[variant];

  const shimmerClass = shimmer ? 'animate-shimmer bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-[length:1000px_100%]' : 'bg-white/5';
  const pulseClass = pulse ? 'animate-pulse' : '';

  return (
    <div
      className={cn('skeleton', variantClass, shimmerClass, pulseClass, className)}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
};
