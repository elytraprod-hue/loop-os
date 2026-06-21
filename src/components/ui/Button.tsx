import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, isLoading, disabled, icon, children, ...props }, ref) => {
    const isBusy = loading || isLoading;
    
    const variantClass = {
      primary: 'bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl px-6 py-3 transition-all',
      secondary: 'bg-white/5 hover:bg-white/10 border border-white/10 text-[#e8e8e8] rounded-xl px-6 py-3 transition-all',
      outline: 'bg-transparent hover:bg-white/5 border border-white/10 text-[#e8e8e8] rounded-xl px-6 py-3 transition-all',
      ghost: 'bg-transparent hover:bg-white/5 text-[#e8e8e8] rounded-xl px-6 py-3 transition-all',
      danger: 'bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl px-6 py-3 transition-all',
      success: 'bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl px-6 py-3 transition-all',
    }[variant];

    const sizeClass = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    }[size];

    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variantClass} ${sizeClass} ${className || ''}`}
        disabled={disabled || isBusy}
        aria-busy={isBusy || undefined}
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
