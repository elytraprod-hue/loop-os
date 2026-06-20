import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  hover?: boolean;
}

const CardBase = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, glass = false, hover = false, children, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={glass ? `glass ${className || ''}`.trim() : className}
        style={{
          borderRadius: 12,
          border: glass ? undefined : '1px solid var(--glass-border)',
          background: glass ? undefined : 'var(--surface)',
          boxShadow: glass ? undefined : '0 1px 3px rgba(0,0,0,.1)',
          transition: hover ? 'all .2s' : undefined,
          cursor: hover ? 'pointer' : undefined,
          ...style,
        }}
        onMouseEnter={hover ? (e) => { e.currentTarget.style.borderColor = 'var(--glass-border-hover)'; e.currentTarget.style.background = 'var(--surface-hover)'; } : undefined}
        onMouseLeave={hover ? (e) => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.background = 'var(--surface)'; } : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CardBase.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, style, ...props }, ref) => (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '24px 24px 0', ...style }} className={className} {...props}>
      {children}
    </div>
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, style, ...props }, ref) => (
    <h3 ref={ref} style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, color: 'var(--text-primary)', margin: 0, ...style }} className={className} {...props}>
      {children}
    </h3>
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, style, ...props }, ref) => (
    <p ref={ref} style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0, ...style }} className={className} {...props}>
      {children}
    </p>
  )
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, style, ...props }, ref) => (
    <div ref={ref} style={{ padding: '20px 24px', ...style }} className={className} {...props}>
      {children}
    </div>
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, style, ...props }, ref) => (
    <div ref={ref} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 24px 24px', ...style }} className={className} {...props}>
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
