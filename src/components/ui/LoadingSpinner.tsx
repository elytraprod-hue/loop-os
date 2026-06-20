interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  label?: string;
}

const sizeMap = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
};

const borderMap = {
  sm: 2,
  md: 2,
  lg: 2,
  xl: 3,
};

export const LoadingSpinner = ({ size = 'md', className, label = 'Carregando…' }: LoadingSpinnerProps) => {
  const px = sizeMap[size];
  const bw = borderMap[size];
  return (
    <div
      className={className}
      style={{
        width: px,
        height: px,
        borderRadius: '50%',
        border: `${bw}px solid var(--accent)`,
        borderTopColor: 'transparent',
        animation: 'spin 1s linear infinite',
      }}
      role="status"
      aria-label={label}
    >
      <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>{label}</span>
    </div>
  );
};
