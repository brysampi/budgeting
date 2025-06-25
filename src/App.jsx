import { use, useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Link, useSearchParams } from 'react-router-dom';
import Login from './components/LoginPage'
import Logout from './components/Logout'
import Cookies from 'js-cookie';
import SideNav from './components/SideNav';
import Income from './components/Income';
import Savings from './components/Savings';
import Bills from './components/Bills';
import Expenses from './components/Expenses';
import ExpensesTracker from './components/ExpensesTracker';
import MonthSelection from './components/MonthSelector';



function App() {
  const [loggedIn, setLoggedIn] = useState(Cookies.get('logged_status') ? true : false)
  const handleLogin = () => {
    setLoggedIn(true);  // Switch to Dashboard component
  };

  const handleLogout = () => {
    setLoggedIn(false); // Switch back to Login component
  };
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const dateParam = searchParams.get('date')
    console.log(dateParam)
  }, [])
  if (loggedIn === false) return <Login onLogin={handleLogin} />
  return (
    <>
      <Logout onLogout={handleLogout} /><br />

      <div className="app-container">
        {/* Side Navigation */}
        <SideNav />

        {/* Main Content Area */}

        <div className="main-content">
          <Routes>
            <Route path="/" element={<MonthSelection />} /> {/* Default route */}
            <Route path="/income/:paramMonth" element={<Income />} />
            <Route path="/savings/:paramMonth" element={<Savings />} />
            <Route path="/bills/:paramMonth" element={<Bills />} />
            <Route path="/expenses/:paramMonth" element={<Expenses />} />
            <Route path="/expensestracker/:paramMonth" element={<ExpensesTracker />} />
          </Routes>
        </div>

      </div>

    </>
  )
}

export default App

export function test() {

}
