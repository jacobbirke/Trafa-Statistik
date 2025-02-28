import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import App from './App.tsx'

if (import.meta.env.PROD) {
  const meta = document.createElement('meta');
  meta.httpEquiv = "Cache-Control";
  meta.content = "no-cache, no-store, must-revalidate";
  document.head.prepend(meta);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
