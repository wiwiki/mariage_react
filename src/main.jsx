import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { captureInviteCode } from './lib/inviteCode'
import './index.css'
import App from './App.jsx'

// Capture ?code=XXXXXX from personalized invitation links before the router
// takes over the URL.
captureInviteCode()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
