import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/User";
import UserContext from "../context/UserContext";
import "../styles/LoginPage.css";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    Username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [, setUser] = useContext(UserContext);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(formData);
      setUser(true);
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container login-wrapper">
      <div className="grid-column-full">
        <div className="login-header">
          <Link to="/" className="back-button">
            &larr; Back
          </Link>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <h2 className="login-title">Welcome Back</h2>

          <div className="form-item">
            <label htmlFor="Username">Username</label>
            <input
              type="text"
              id="Username"
              value={formData.Username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-item">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="btn btn-primary">
            Sign in
          </button>
          <div className="oauth-section">
            <div className="oauth-divider">
              <span>or login with</span>
            </div>

            <div className="oauth-buttons">
              <a
                href="http://localhost:8000/auth/google"
                className="oauth-btn google"
                title="Login with Google"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="oauth-icon"
                />
                Google
              </a>

              <a
                href="http://localhost:8000/auth/github"
                className="oauth-btn github"
                title="Login with GitHub"
              >
                <img
                  src="https://www.svgrepo.com/show/475654/github-color.svg"
                  alt="GitHub"
                  className="oauth-icon"
                />
                GitHub
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
