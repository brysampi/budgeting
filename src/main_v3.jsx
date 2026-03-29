import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes_v3.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <AppRoutes />
    </Router>
  </StrictMode>
)
