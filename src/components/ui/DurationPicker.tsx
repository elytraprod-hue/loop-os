// src/components/ui/DurationPicker.tsx
import React, { useState } from 'react';
import { Input } from './Input';

interface DurationPickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: number;
  onChange?: (value: number) => void;
  label?: string;
  error?: string;
}

export const DurationPicker = React.forwardRef<HTMLInputElement, DurationPickerProps>(
  ({ value, onChange, label, error, ...props }, ref) => {
    const [inputValue, setInputValue] = useState<string>(value?.toString() || '');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setInputValue(val);
      
      const numericValue = val === '' ? undefined : parseInt(val, 10);
      onChange?.(numericValue as number);
    };

    return (
      <Input
        ref={ref}
        value={inputValue}
        onChange={handleChange}
        label={label}
        placeholder="0"
        type="number"
        error={error}
        {...props}
      />
    );
  }
);
