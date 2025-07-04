import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="container">
      <div className="navbar">
        <Link to="/" className="navbar__logo">
          LINK.
        </Link>
      </div>

      <div className="navbar__options">
        <Link to="/login" className="navbar__link">
          Login
        </Link>
        <Link to="/signup" className="navbar__link">
          SignUp
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
