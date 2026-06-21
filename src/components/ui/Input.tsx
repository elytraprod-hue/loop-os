import React, { useState, useRef } from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  floatingLabel?: boolean;
  animated?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightIcon, containerClassName, id, floatingLabel = false, animated = true, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const errorId = inputId ? `${inputId}-error` : undefined;
    const hintId = inputId ? `${inputId}-hint` : undefined;
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const combinedRef = (node: HTMLInputElement) => {
      inputRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(e.target.value.length > 0);
      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
      props.onChange?.(e);
    };

    const labelClass = floatingLabel
      ? `absolute left-4 transition-all duration-200 pointer-events-none ${
          isFocused || hasValue
            ? '-top-2.5 left-3 text-xs text-orange-500 bg-[#0a0a0a] px-1'
            : 'top-3.5 text-sm text-gray-400'
        }`
      : 'text-sm font-medium text-[#c4c4c4]';

    const inputClass = animated
      ? `bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:border-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:ring-offset-2 focus:ring-offset-[#0a0a0a] transition-all duration-300 w-full ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''} ${error ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20' : ''} ${isFocused ? 'shadow-lg shadow-orange-500/10' : ''} ${className || ''}`
      : `bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:border-orange-500/50 focus:outline-none w-full ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''} ${error ? 'border-red-500/50 focus:border-red-500/50' : ''} ${className || ''}`;

    return (
      <div className={`flex flex-col gap-1 ${containerClassName || ''}`}>
        {label && !floatingLabel && (
          <label htmlFor={inputId} className="text-sm font-medium text-[#c4c4c4]">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-0 right-auto flex items-center pl-4 pointer-events-none text-gray-500 transition-colors duration-200" aria-hidden="true">
              {leftIcon}
            </div>
          )}
          <input
            ref={combinedRef}
            id={inputId}
            className={inputClass}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={
              [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined
            }
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-0 left-auto flex items-center pr-4 pointer-events-none text-gray-500 transition-colors duration-200" aria-hidden="true">
              {rightIcon}
            </div>
          )}
          {label && floatingLabel && (
            <label htmlFor={inputId} className={labelClass}>
              {label}
            </label>
          )}
        </div>
        {error && (
          <p id={errorId} className="text-xs text-red-400 animate-slideIn" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="text-xs text-gray-500">
            {hint}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export type { InputProps };
