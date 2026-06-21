import './app.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { tenant } from './config/tenant';
import { TooltipProvider } from './components/ui/Tooltip';

// White label — injeta cores do tenant no :root
const root = document.documentElement;
root.style.setProperty('--accent', tenant.accentColor);
root.style.setProperty('--color-accent', tenant.accentColor);
root.style.setProperty('--color-primary', tenant.primaryColor);
root.style.setProperty('--accent-dim', `${tenant.accentColor}23`);
root.style.setProperty('--accent-border', `${tenant.accentColor}47`);
root.style.setProperty('--accent-glow', `${tenant.accentColor}2E`);
root.style.setProperty('--accent-soft', `${tenant.accentColor}0F`);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TooltipProvider>
      <App />
    </TooltipProvider>
  </StrictMode>
);
