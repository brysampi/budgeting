import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
// import { HashRouter as Router } from 'react-router-dom'
import './index.css'
import './css/main.css'
import './css/v2/main.css'
import './css/modal.css'
import './css/sidenav.css'
// import './css/login.css'
// import App from './App.jsx'
import AppRoutes from './routes/AppRoutes.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <AppRoutes />
    </Router>
  </StrictMode>,
)
