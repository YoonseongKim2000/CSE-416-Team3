import './App.css'
import { Outlet } from "react-router-dom";
import NavBar from './components/navBar';

const apiUrl = import.meta.env.VITE_API_URL;

// testing api to backend
fetch(`${apiUrl}/api/hello`)
  .then(res => res.json())
  .then(data => console.log(data));


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
