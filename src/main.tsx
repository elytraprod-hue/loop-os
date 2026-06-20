// src/main.tsx
import './styles/tokens.css';
import './styles/global.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Injeta cores do tenant via CSS variables
import { tenant } from './config/tenant';
document.documentElement.style.setProperty('--color-accent', tenant.accentColor);
document.documentElement.style.setProperty('--color-primary', tenant.primaryColor);

createRoot(document.getElementById('root')!).render(
  <StrictMode><App /></StrictMode>
);
