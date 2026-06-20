import { cn } from '../../lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circle' | 'rect';
  width?: string | number;
  height?: string | number;
}

export const Skeleton = ({ className, variant = 'rect', width, height }: SkeletonProps) => {
  const variantClass = {
    text: 'h-4 rounded-md',
    circle: 'rounded-full',
    rect: 'rounded-xl',
  }[variant];

  return (
    <div
      className={cn('skeleton', variantClass, className)}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
};
