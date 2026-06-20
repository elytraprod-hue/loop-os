interface OptionCardsProps {
  label?: string;
  options: { value: string; label: string; description: string }[];
  value: string;
  onChange: (value: string) => void;
}

export const OptionCards = ({ label, options, value, onChange }: OptionCardsProps) => {
  return (
    <div>
      {label && <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{label}</p>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
        {options.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              style={{
                cursor: 'pointer',
                transition: 'all .2s',
                textAlign: 'left',
                padding: 16,
                borderRadius: 12,
                border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--glass-border)'}`,
                background: isSelected ? 'rgba(249,115,22,.05)' : 'transparent',
                color: 'var(--text-primary)',
              }}
              onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.borderColor = 'var(--glass-border-hover)'; }}
              onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    border: `2px solid ${isSelected ? 'var(--accent)' : 'var(--glass-border)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {isSelected && <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent)' }} />}
                </div>
                <div>
                  <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{opt.label}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{opt.description}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
