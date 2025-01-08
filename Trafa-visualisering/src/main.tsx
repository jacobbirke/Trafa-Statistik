import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import App from './App.tsx'
import { SpeedInsights } from "@vercel/speed-insights/next"
// import PunktlighetTagtyper from './components/PunktlighetTagtyper.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <SpeedInsights/>
    {/* <PunktlighetTagtyper/> */}
  </StrictMode>,
)
