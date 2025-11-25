import './App.css'
import { Outlet, useNavigate } from "react-router-dom";
import NavBar from './components/navBar';
import { useEffect, useState } from 'react';

// const apiUrl = import.meta.env.VITE_API_URL;

export type Auth = {
  email: string | null;
  accessToken: string | null;
}

export type AuthContext = {
  auth: Auth;
}

export type AuthOutletContext = {
  contextState: AuthContext;
  contextSetState: (a: AuthContext | null) => void;
}

function App() {
  const navigate = useNavigate();

  const [auth, setAuth] = useState<AuthContext | null>(null);

  useEffect(() => {
    console.log('auth ' + auth?.auth.email + ' ' + auth?.auth.accessToken);

    const storedEmail = localStorage.getItem('email');
    const storedToken = localStorage.getItem('accessToken');
    console.log(storedEmail + " " + storedToken);
    setAuth({auth:{email: storedEmail, accessToken: storedToken}})
  }, [])

  const handleAuthToNull = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('accessToken');
    setAuth(null);
    navigate('/');
  }

  return (
    <>
      <NavBar auth={auth} handleAuthToNull={handleAuthToNull}/>
      <div>
        <Outlet context={{contextState: auth, contextSetState: setAuth}}/>
      </div>
    </>
  )
}

export default App
