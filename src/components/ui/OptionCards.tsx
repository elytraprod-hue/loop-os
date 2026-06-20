// src/components/ui/OptionCards.tsx
import React from 'react';
import { Card } from './Card';

interface OptionCard {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface OptionCardsProps {
  options: OptionCard[];
  selected: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

export const OptionCards = ({ options, selected, onChange, label, className }: OptionCardsProps) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-2">
          {label}
        </label>
      )}
      <div className="grid grid-cols-1 gap-3">
        {options.map((option) => (
          <Card
            key={option.value}
            className={`cursor-pointer transition-all ${selected === option.value ? 'border-accent bg-accent/5' : 'hover:border-border-hover'}`}
            onClick={() => onChange(option.value)}
          >
            <div className="flex items-center gap-3 p-4">
              {option.icon && <div className="text-accent">{option.icon}</div>}
              <div>
                <h3 className="font-medium text-text-primary">{option.label}</h3>
                {option.description && (
                  <p className="text-sm text-text-muted">{option.description}</p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
