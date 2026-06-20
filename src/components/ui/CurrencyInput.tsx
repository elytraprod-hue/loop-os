// src/components/ui/CurrencyInput.tsx
import React, { useState } from 'react';
import { Input } from './Input';

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: number;
  onChange?: (value: number) => void;
  currency?: string;
  label?: string;
  error?: string;
}

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onChange, currency = 'USD', label, error, ...props }, ref) => {
    const [inputValue, setInputValue] = useState<string>(value?.toString() || '');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setInputValue(val);
      
      const numericValue = val === '' ? undefined : parseFloat(val);
      onChange?.(numericValue as number);
    };

    return (
      <Input
        ref={ref}
        value={inputValue}
        onChange={handleChange}
        label={label}
        placeholder="0.00"
        error={error}
        {...props}
      />
    );
  }
);
