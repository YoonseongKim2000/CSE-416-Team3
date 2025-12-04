import './navBar.css'
import { Link, NavLink} from 'react-router-dom';
import type { AuthContext } from '../App';
import logo from "../assets/truvision_logo.png"

interface Props {
  auth: AuthContext | null;
  handleAuthToNull: () => void;
}

function NavBar({auth, handleAuthToNull}: Props) {
  //const { auth } = useOutletContext<AuthContext>();

  
  const handleLogOut = () => {
    console.log('logging out...')
    handleAuthToNull();
  }

  return (
    <nav className="navbar navbar-expand-md bg-body-tertiary fixed-top">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        
        {/* Left - Logo */}
        <Link to={auth ? '/home' : '/'}>
          <div className='d-flex flex-wrap align-content-center'>
            <img src={logo} alt="TrueVision" className='logo'/>
          </div>
        </Link>

        {/* Middle - Links */}
        <div className="collapse navbar-collapse justify-content-center" id="navbarSupportedContent">
          <ul className="navbar-nav mb-2 mb-md-0 p-reg">
            <li className="nav-item mx-1">
              <NavLink to='/home' className={({isActive}) => isActive ? "nav-link active-link" : "nav-link"}>
                Analyze
              </NavLink>
            </li>
            <li className="nav-item mx-1">
              <NavLink to='/features' className={({isActive}) => isActive ? "nav-link active-link" : "nav-link"}>
                Features
              </NavLink>
            </li>
            <li className="nav-item mx-1">
              <NavLink to='/pricing' className={({isActive}) => isActive ? "nav-link active-link" : "nav-link"}>
                Pricing
              </NavLink>
            </li>
            <li className="nav-item mx-1">
              <NavLink to='/api-docs' className={({isActive}) => isActive ? "nav-link active-link" : "nav-link"}>
               API
              </NavLink>
            </li>
            { auth? <li className="nav-item mx-1">
              <NavLink to='/purchase' className={({isActive}) => isActive ? "nav-link active-link" : "nav-link"}>
                Purchase
              </NavLink>
            </li> : <div></div>}
            <li className="nav-item mx-1">
              <NavLink to='/guessing-game' className={({isActive}) => isActive ? "nav-link active-link" : "nav-link"}>
                Minigame
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Right - Login */}
        { auth?.auth.accessToken ?
          <div className='nav-item p-reg'>
            <button className='nav-link dropdown-toggle dropdown d-flex flex-row align-items-center' id='nav_dropdown' type='button' data-bs-toggle="dropdown">
              <b id='nav_email'>{auth?.auth.email}</b>
            </button>
            <ul className='dropdown-menu end-0' aria-labelledby='dropdownMenuOffset' id='navbar_user_dropdown'>
              <li>
                <Link to='/account' id='account_link' className='dropdown-item text-center'> Account Settings </Link>
              </li>
              <hr id='dropdown_line'/>
              <li>
                  <div className='dropdown-item d-flex justify-content-center'>
                    <button onClick={handleLogOut} className="btn btn-outline-danger" id='logout_btn'>Log Out</button> 
                  </div>
              </li>
            </ul>
          </div>
          : <div className="d-flex p-reg">
            <Link to='/login' id="login-link" className='me-2'>
            <button className="btn btnb" id="login-btn">Log In</button>
            </Link>
            <Link to='/signup' id="signup-link">
            <button className="btn btnb" id="signup-btn">Sign Up</button>
            </Link>
          </div>
        }
      </div>
    </nav>
  );
};

export default NavBar;
