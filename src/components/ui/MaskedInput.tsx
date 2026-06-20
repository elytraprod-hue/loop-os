// src/components/ui/MaskedInput.tsx
import React, { useState } from 'react';
import { Input } from './Input';

interface MaskedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  mask?: (value: string) => string;
  label?: string;
  error?: string;
}

export const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ value, onChange, mask, label, error, ...props }, ref) => {
    const [inputValue, setInputValue] = useState<string>(value || '');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value;
      if (mask) {
        val = mask(val);
      }
      setInputValue(val);
      onChange?.(val);
    };

    return (
      <Input
        ref={ref}
        value={inputValue}
        onChange={handleChange}
        label={label}
        error={error}
        {...props}
      />
    );
  }
);
