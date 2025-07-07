import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../api/User";
import UserContext from "../context/UserContext";
import "../styles/LoginPage.css";

const allowedCompanies = [
  "Huawei",
  "Kuwait University",
  "STC",
  "Zain",
  "Ooredoo",
];

const allowedRoles = ["Admin", "Manager", "Engineer", "Student", "Guest"];

const SignupPage = () => {
  const [formData, setFormData] = useState({
    Username: "",
    Email: "",
    Company: "",
    Role: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [, setUser] = useContext(UserContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signup(formData);
      setUser(true);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
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
          <h2 className="login-title">Create Your Account</h2>
          <div className="form-item">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="Username"
              value={formData.Username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-item">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="Email"
              value={formData.Email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-item">
            <label htmlFor="company">Company</label>
            <select
              id="Company"
              value={formData.Company}
              onChange={handleChange}
              required
            >
              <option value="">Select a company</option>
              {allowedCompanies.map((company, index) => (
                <option key={index} value={company}>
                  {company}
                </option>
              ))}
            </select>
          </div>
          <div className="form-item">
            <label htmlFor="role">Role</label>
            <select
              id="Role"
              value={formData.Role}
              onChange={handleChange}
              required
            >
              <option value="">Select a role</option>
              {allowedRoles.map((role, index) => (
                <option key={index} value={role}>
                  {role}
                </option>
              ))}
            </select>
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
          <div className="form-item">
            <label htmlFor="confirmPassword">Re-enter Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn btn-primary">
            Sign up
          </button>{" "}
          <div className="oauth-section">
            <div className="oauth-divider">
              <span>or sign up with</span>
            </div>

            <div className="oauth-buttons">
              <a
                href="http://localhost:8000/auth/google"
                className="oauth-btn google"
                title="Sign up with Google"
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
                title="Sign up with GitHub"
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

export default SignupPage;
