import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { logout } from "../api/storage";
import UserContext from "../context/UserContext";
import "../styles/Navbar.css";

const Navbar = () => {
  const [user, setUser] = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUser(false);
    navigate("/");
  };

  return (
    <nav className="container">
      <div className="navbar">
        <Link to="/" className="navbar__logo">
          LINK.
        </Link>
      </div>

      <div className="navbar__options">
        {user ? (
          <button
            onClick={handleLogout}
            className="navbar__icon-button"
            title="Sign Out"
          >
            <img
              src="data:image/svg+xml;utf8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNSIgaGVpZ2h0PSIyNCIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMCIgZD0iTTkuNTAyIDExLjIzOGEuNzUuNzUgMCAxIDAtLjAwNCAxLjV6bTExLjQ5MyAxLjMwNmEuNzUuNzUgMCAwIDAgLjAwMi0xLjA2MWwtNC43NjItNC43ODRhLjc1Ljc1IDAgMSAwLTEuMDYzIDEuMDU5bDQuMjMzIDQuMjUyLTQuMjUyIDQuMjMzYS43NS43NSAwIDEgMCAxLjA1OSAxLjA2M3ptLTExLjQ5Ny4xOTQgMTAuOTY2LjAyNC4wMDQtMS41LTEwLjk2Ni0uMDI0eiIvPjxwYXRoIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2Utd2lkdGg9IjIiIGQ9Ik0xNC41IDNoLTlhMiAyIDAgMCAwLTIgMnYxNS4wNTNjMCAuNTIzLjQyNC45NDcuOTQ3Ljk0N0gxNC41Ii8+PC9zdmc+"
              alt="Sign Out"
              className="navbar__icon"
            />
          </button>
        ) : (
          <>
            <Link to="/login" className="navbar__link">
              Login
            </Link>
            <Link to="/signup" className="navbar__link">
              SignUp
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
