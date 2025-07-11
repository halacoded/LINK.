import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { logout } from "../api/storage";
import UserContext from "../context/UserContext";
import { useQuery } from "@tanstack/react-query";
import "../styles/Navbar.css";
import "../styles/NavbarHome.css";
import DashboradPage from "../pages/DashboradPage";
import PredictionsPage from "../pages/PredictionsPage";
import { getMe } from "../api/User";

const Navbar = () => {
  const [user, setUser] = useContext(UserContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getMe,
  });

  const handleLogout = () => {
    logout();
    setUser(false);
    navigate("/");
  };

  return (
    <nav className="container">
      {user ? (
        <>
          <div className="navbar">
            <Link
              to="/"
              className="navbar__logo"
              onClick={() => setActiveTab("")}
            >
              LINK.
            </Link>
          </div>

          <div className="navbar__options2">
            <div className="navbar__tabs">
              <Link
                to="#"
                className={`navbar__link2 ${
                  activeTab === "dashboard" ? "active-tab2" : ""
                }`}
                onClick={() => setActiveTab("dashboard")}
              >
                Dashboard
              </Link>

              <Link
                to="#"
                className={`navbar__link2 ${
                  activeTab === "prediction" ? "active-tab2" : ""
                }`}
                onClick={() => setActiveTab("prediction")}
              >
                Prediction
              </Link>
            </div>

            <div className="navbar__right-actions">
              {currentUser && (
                <Link to="/UpdateProfile">
                  <img
                    src={
                      currentUser.ProfileImage
                        ? `http://localhost:8000/${currentUser.ProfileImage}`
                        : "/default-avatar.png"
                    }
                    alt={currentUser.Username}
                    className="navbar__avatar"
                    style={{ cursor: "pointer" }}
                  />
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="navbar__icon-button2"
                title="Sign Out"
              >
                <img
                  src="data:image/svg+xml;utf8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNSIgaGVpZ2h0PSIyNCIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMCIgZD0iTTkuNTAyIDExLjIzOGEuNzUuNzUgMCAxIDAtLjAwNCAxLjV6bTExLjQ5MyAxLjMwNmEuNzUuNzUgMCAwIDAgLjAwMi0xLjA2MWwtNC43NjItNC43ODRhLjc1Ljc1IDAgMSAwLTEuMDYzIDEuMDU5bDQuMjMzIDQuMjUyLTQuMjUyIDQuMjMzYS43NS43NSAwIDEgMCAxLjA1OSAxLjA2M3ptLTExLjQ5Ny4xOTQgMTAuOTY2LjAyNC4wMDQtMS41LTEwLjk2Ni0uMDI0eiIvPjxwYXRoIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2Utd2lkdGg9IjIiIGQ9Ik0xNC41IDNoLTlhMiAyIDAgMCAwLTIgMnYxNS4wNTNjMCAuNTIzLjQyNC45NDcuOTQ3Ljk0N0gxNC41Ii8+PC9zdmc+"
                  alt="Sign Out"
                  className="navbar__icon2"
                />
              </button>
            </div>
          </div>

          <div className="page-content2">
            {activeTab === "dashboard" && <DashboradPage />}
            {activeTab === "prediction" && <PredictionsPage />}
          </div>
        </>
      ) : (
        <>
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
        </>
      )}
    </nav>
  );
};

export default Navbar;
