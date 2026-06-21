import { useEffect, useState } from 'react';

interface AnimatedToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: () => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export const AnimatedToast = ({ message, type = 'info', duration = 3000, onClose, position = 'top-right' }: AnimatedToastProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeStyles = {
    success: 'bg-green-500/20 border-green-500/50 text-green-400 glow-success',
    error: 'bg-red-500/20 border-red-500/50 text-red-400 glow-danger',
    warning: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
    info: 'bg-blue-500/20 border-blue-500/50 text-blue-400',
  };

  const iconStyles = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  const positionStyles = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  return (
    <div
      className={`fixed z-50 px-6 py-4 rounded-xl border backdrop-blur-xl shadow-2xl transition-all duration-300 glass-strong ${typeStyles[type]} ${positionStyles[position]} ${
        isVisible && !isExiting ? 'animate-slideIn' : isExiting ? 'animate-fadeOut opacity-0 translate-x-full' : 'opacity-0 translate-x-full'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg font-bold">{iconStyles[type]}</span>
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};
