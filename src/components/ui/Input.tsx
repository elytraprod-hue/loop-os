import React from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightIcon, containerClassName, id, style, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const errorId = inputId ? `${inputId}-error` : undefined;
    const hintId = inputId ? `${inputId}-hint` : undefined;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, ...(containerClassName ? {} : undefined) }} className={containerClassName}>
        {label && (
          <label htmlFor={inputId} style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>
            {label}
          </label>
        )}
        <div style={{ position: 'relative' }}>
          {leftIcon && (
            <div style={{ position: 'absolute', inset: 0, right: 'auto', display: 'flex', alignItems: 'center', paddingLeft: 12, pointerEvents: 'none', color: 'var(--text-muted)' }} aria-hidden="true">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`input-base ${leftIcon ? 'input-has-left-icon' : ''} ${rightIcon ? 'input-has-right-icon' : ''} ${error ? 'input-error' : ''} ${className || ''}`.trim()}
            style={{
              ...(leftIcon ? { paddingLeft: 40 } : {}),
              ...(rightIcon ? { paddingRight: 40 } : {}),
              ...style,
            }}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={
              [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined
            }
            {...props}
          />
          {rightIcon && (
            <div style={{ position: 'absolute', inset: 0, left: 'auto', display: 'flex', alignItems: 'center', paddingRight: 12, pointerEvents: 'none', color: 'var(--text-muted)' }} aria-hidden="true">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={errorId} style={{ fontSize: 12, color: 'var(--text-error)' }} role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {hint}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export type { InputProps };
