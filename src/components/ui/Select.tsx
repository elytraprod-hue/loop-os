import * as SelectPrimitive from '@radix-ui/react-select';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
}

export const Select = ({ value, onChange, options, placeholder = 'Selecionar…', label, error, className, disabled }: SelectProps) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</label>}
      <SelectPrimitive.Root value={value} onValueChange={onChange} disabled={disabled}>
        <SelectPrimitive.Trigger
          className={`input-base ${error ? 'input-error' : ''} ${className || ''}`.trim()}
          aria-invalid={error ? 'true' : undefined}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, width: '100%' }}>
            <SelectPrimitive.Value placeholder={placeholder} />
            <SelectPrimitive.Icon>
              <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />
            </SelectPrimitive.Icon>
          </div>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className="glass"
            style={{
              zIndex: 5002,
              borderRadius: 12,
              padding: '4px 0',
              minWidth: 'var(--radix-select-trigger-width)',
              boxShadow: '0 8px 32px rgba(0,0,0,.4)',
            }}
            position="popper"
            sideOffset={4}
          >
            <SelectPrimitive.Viewport>
              {options.map((opt) => (
                <SelectPrimitive.Item
                  key={opt.value}
                  value={opt.value}
                  disabled={opt.disabled}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px',
                    fontSize: 14,
                    cursor: opt.disabled ? 'not-allowed' : 'pointer',
                    outline: 'none',
                    color: 'var(--text-secondary)',
                    opacity: opt.disabled ? 0.5 : 1,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >
                  <SelectPrimitive.ItemText>{opt.label}</SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
      {error && <p style={{ fontSize: 12, color: 'var(--text-error)' }} role="alert">{error}</p>}
    </div>
  );
};

export type { SelectOption, SelectProps };
