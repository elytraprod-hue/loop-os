// src/components/ui/ChipSelector.tsx
import { Button } from './Button';

interface ChipSelectorProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  label?: string;
  className?: string;
}

export const ChipSelector = ({ options, selected, onChange, label, className }: ChipSelectorProps) => {
  const handleToggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-2">
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Button
            key={option}
            variant={selected.includes(option) ? 'primary' : 'outline'}
            size="sm"
            onClick={() => handleToggle(option)}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
};
