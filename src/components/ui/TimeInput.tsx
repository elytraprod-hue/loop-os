// src/components/ui/TimeInput.tsx
import React, { useState } from 'react';
import { Input } from './Input';

interface TimeInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
}

export const TimeInput = React.forwardRef<HTMLInputElement, TimeInputProps>(
  ({ value, onChange, label, error, ...props }, ref) => {
    const [inputValue, setInputValue] = useState<string>(value || '');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setInputValue(val);
      onChange?.(val);
    };

    return (
      <Input
        ref={ref}
        value={inputValue}
        onChange={handleChange}
        label={label}
        placeholder="00:00"
        error={error}
        {...props}
      />
    );
  }
);
