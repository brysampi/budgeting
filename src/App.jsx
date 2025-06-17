import { useEffect, useState } from 'react'
import Login from './components/LoginPage'
import Logout from './components/Logout'
import Income from './components/Income';
import Cookies from 'js-cookie';
function App() {
  const [loggedIn, setLoggedIn] = useState(Cookies.get('logged_status') ? true : false)
  const handleLogin = () => {
    setLoggedIn(true);  // Switch to Dashboard component
  };

  const handleLogout = () => {
    setLoggedIn(false); // Switch back to Login component
  };
  if (loggedIn===false) return <Login onLogin={handleLogin} />
  return (
    <>
      <Logout onLogout={handleLogout} /><br />
      ------------- Income -------------
      <br />
      <Income />
      ------------- Bills -------------
      <br />
      {/* <AddBiils /> */}
      ------------- Expenses -------------
      <br />
      {/* <AddExpenses /> */}
      ------------- Expenses Tracker -------------
      <br />
      {/* <AddExpensesTracker /> */}
    </>
  )
}

export default App
