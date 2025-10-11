import './App.css'
import { Outlet } from "react-router-dom";
import NavBar from './components/navBar';

// const apiUrl = import.meta.env.VITE_API_URL;


function App() {

  return (
    <>
      <NavBar />
      <div>
        <Outlet />
      </div>
    </>
  )
}

export default App
