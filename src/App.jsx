import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './components/LoginPage'
import Logout from './components/Logout'
import Cookies from 'js-cookie';
import SideNav from './components/SideNav';
import Income from './components/Income';
import Savings from './components/Savings';
import Bills from './components/Bills';
import Expenses from './components/Expenses';
import ExpensesTracker from './components/ExpensesTracker';



function App() {
  const [loggedIn, setLoggedIn] = useState(Cookies.get('logged_status') ? true : false)
  const handleLogin = () => {
    setLoggedIn(true);  // Switch to Dashboard component
  };

  const handleLogout = () => {
    setLoggedIn(false); // Switch back to Login component
  };
  if (loggedIn === false) return <Login onLogin={handleLogin} />
  return (
    <>
      <Logout onLogout={handleLogout} /><br />
      ------------- Income -------------
      <Router>
        <div className="app-container">
          {/* Side Navigation */}
          <SideNav />

          {/* Main Content Area */}
          <div className="main-content">
            <Routes>
              <Route path="/income" element={<Income />} />
              <Route path="/savings" element={<Savings />} />
              <Route path="/bills" element={<Bills />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/expensestracker" element={<ExpensesTracker />} />
              <Route path="/" element={<Income />} /> {/* Default route */}
            </Routes>
          </div>
        </div>
      </Router>
    </>
  )
}

export default App
