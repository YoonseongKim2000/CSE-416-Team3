import './navBar.css'

function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        
        {/* Left - Logo */}
        <a className="navbar-brand" href="#">Unnamed</a>

        {/* Middle - Links */}
        <div className="collapse navbar-collapse justify-content-center" id="navbarSupportedContent">
          <ul className="navbar-nav mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">Link</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Link</a>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Dropdown
              </a>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="#">Action</a></li>
                <li><a className="dropdown-item" href="#">Another action</a></li>
                <li><a className="dropdown-item" href="#">Something else here</a></li>
              </ul>
            </li>
          </ul>
        </div>

        {/* Right - Login */}
        <div className="d-flex">
          <a className="nav-link" href="#">Login</a>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
