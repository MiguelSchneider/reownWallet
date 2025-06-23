import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App, { AppKitProvider } from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppKitProvider>
      <App />
    </AppKitProvider>
  </StrictMode>,
)
