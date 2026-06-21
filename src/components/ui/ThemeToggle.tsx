import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme === 'light' ? false : savedTheme === 'dark' ? true : prefersDark;
    setIsDark(initialTheme);
    document.documentElement.classList.toggle('light', !initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('light', !newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full bg-white/10 border border-white/20 transition-all duration-300 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
      aria-label="Toggle theme"
    >
      <div
        className={`absolute top-1 w-5 h-5 rounded-full bg-orange-500 shadow-lg transition-all duration-300 ${
          isDark ? 'left-1' : 'left-8'
        }`}
      >
        {isDark ? (
          <Moon size={14} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
        ) : (
          <Sun size={14} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
        )}
      </div>
    </button>
  );
};
