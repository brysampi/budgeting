import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter as Router } from 'react-router-dom'
import './index.css'
// import App from './App.jsx'
import AppRoutes from './routes/AppRoutes.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <AppRoutes />
    </Router>
  </StrictMode>,
)
