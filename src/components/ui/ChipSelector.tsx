interface ChipSelectorProps {
  label?: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

export const ChipSelector = ({ label, options, value, onChange }: ChipSelectorProps) => {
  return (
    <div>
      {label && <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{label}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`btn ${value === opt.value ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: 13, padding: '6px 14px' }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};
