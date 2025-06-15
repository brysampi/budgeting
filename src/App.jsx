import { useEffect, useState } from 'react'
import Login from './components/LoginPage'
import Logout from './components/Logout'
function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const handleLogin = () => {
    setLoggedIn(true);  // Switch to Dashboard component
  };

  const handleLogout = () => {
    setLoggedIn(false); // Switch back to Login component
  };
  if (!loggedIn) return <Login onLogin={handleLogin} />
  return (
    <>
      <Logout onLogout={handleLogout} />
    </>
  )
}

export default App
