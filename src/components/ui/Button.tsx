import React, { forwardRef, useState, useRef, useEffect } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
  asChild?: boolean;
  magnetic?: boolean;
  glow?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading, 
    isLoading, 
    disabled, 
    icon, 
    magnetic = false,
    glow = false,
    children, 
    ...props 
  }, ref) => {
    const isBusy = loading || isLoading;
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
      if (!magnetic) return;

      const handleMouseMove = (e: MouseEvent) => {
        if (!buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        setPosition({ x, y });
      };

      const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
      };

      const button = buttonRef.current;
      button?.addEventListener('mousemove', handleMouseMove);
      button?.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        button?.removeEventListener('mousemove', handleMouseMove);
        button?.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, [magnetic]);

    const variantClass = {
      primary: 'bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl px-6 py-3 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-orange-500/25',
      secondary: 'bg-white/10 hover:bg-white/15 border border-white/10 text-white rounded-xl px-6 py-3 transition-all duration-300',
      outline: 'bg-transparent hover:bg-orange-500/10 border-2 border-orange-500 text-orange-500 hover:text-orange-400 rounded-xl px-6 py-3 transition-all duration-300',
      ghost: 'bg-transparent hover:bg-white/5 text-gray-400 hover:text-white rounded-xl px-6 py-3 transition-all duration-300',
      danger: 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 hover:border-red-500/50 rounded-xl px-6 py-3 transition-all duration-300',
      success: 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 hover:border-green-500/50 rounded-xl px-6 py-3 transition-all duration-300',
      gradient: 'gradient-primary text-white font-semibold rounded-xl px-6 py-3 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-orange-500/25',
    }[variant];

    const sizeClass = {
      sm: 'px-4 py-2 text-sm min-h-[36px]',
      md: 'px-6 py-3 text-base min-h-[44px]',
      lg: 'px-8 py-4 text-lg min-h-[52px]',
    }[size];

    const magneticStyle = magnetic 
      ? { transform: `translate(${position.x * 0.3}px, ${position.y * 0.3}px)` }
      : {};

    const glowClass = glow ? 'glow-accent-hover' : '';

    const combinedRef = (node: HTMLButtonElement) => {
      buttonRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    };

    return (
      <button
        ref={combinedRef}
        className={`inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:ring-offset-2 focus:ring-offset-[#0a0a0a] ${variantClass} ${sizeClass} ${glowClass} ${className || ''}`}
        disabled={disabled || isBusy}
        aria-busy={isBusy || undefined}
        style={magneticStyle}
        {...props}
      >
        {isBusy ? (
          <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
            <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" opacity="0.75" />
          </svg>
        ) : icon ? (
          <span className="inline-flex" aria-hidden="true">{icon}</span>
        ) : null}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export type { ButtonProps };
