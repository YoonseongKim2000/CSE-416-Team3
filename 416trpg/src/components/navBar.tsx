import './navBar.css'
import { Link, NavLink } from 'react-router-dom';

function NavBar() {
  return (
    <nav className="navbar navbar-expand-md bg-body-tertiary fixed-top">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        
        {/* Left - Logo */}
        <a className="navSiteName m-1" href="#">TrueVision</a>

        {/* Middle - Links */}
        <div className="collapse navbar-collapse justify-content-center" id="navbarSupportedContent">
          <ul className="navbar-nav mb-2 mb-md-0">
            <li className="nav-item">
              <NavLink to='/' className={({isActive}) => isActive ? "nav-link active-link" : "nav-link"}>
                Analyze
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to='/features' className={({isActive}) => isActive ? "nav-link active-link" : "nav-link"}>
                Features
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to='/pricing' className={({isActive}) => isActive ? "nav-link active-link" : "nav-link"}>
                Pricing
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to='/api-docs' className={({isActive}) => isActive ? "nav-link active-link" : "nav-link"}>
               API
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Right - Login */}
        <div className="d-flex">
          <Link to='/login' id="login-link" className='me-2'>
          <button className="btn" id="login-btn">Log In</button>
          </Link>
          <Link to='/signup' id="signup-link">
          <button className="btn" id="signup-btn">Sign Up</button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
