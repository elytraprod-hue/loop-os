import React, { useRef, useState, useEffect } from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  hover?: boolean;
  glow?: boolean;
  tilt?: boolean;
}

const CardBase = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, glass = false, hover = false, glow = false, tilt = false, children, ...props }, ref) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [transform, setTransform] = useState('');

    useEffect(() => {
      if (!tilt || !cardRef.current) return;

      const handleMouseMove = (e: MouseEvent) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;
        setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
      };

      const handleMouseLeave = () => {
        setTransform('perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)');
      };

      const card = cardRef.current;
      card?.addEventListener('mousemove', handleMouseMove);
      card?.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        card?.removeEventListener('mousemove', handleMouseMove);
        card?.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, [tilt]);

    const glassClass = glass ? 'glass-medium' : '';
    const glowClass = glow ? 'glow-accent-hover' : '';
    const hoverClass = hover ? 'hover:bg-white/8 hover:border-white/15 cursor-pointer' : '';
    const tiltClass = tilt ? 'card-3d' : '';

    const combinedRef = (node: HTMLDivElement) => {
      cardRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    };

    return (
      <div
        ref={combinedRef}
        className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all duration-300 ${glassClass} ${glowClass} ${hoverClass} ${tiltClass} ${className || ''}`}
        style={{ transform }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CardBase.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={`flex flex-col gap-1 pb-4 ${className || ''}`} {...props}>
      {children}
    </div>
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3 ref={ref} className={`font-display font-black text-xl text-white m-0 ${className || ''}`} {...props}>
      {children}
    </h3>
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => (
    <p ref={ref} className={`text-sm text-[#c4c4c4] m-0 ${className || ''}`} {...props}>
      {children}
    </p>
  )
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={`pt-2 ${className || ''}`} {...props}>
      {children}
    </div>
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={`flex items-center gap-2 pt-4 mt-4 border-t border-white/10 ${className || ''}`} {...props}>
      {children}
    </div>
  )
);
CardFooter.displayName = 'CardFooter';

export const Card = Object.assign(CardBase, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
});

export { CardHeader, CardTitle, CardDescription, CardContent, CardFooter };

export type { CardProps };
