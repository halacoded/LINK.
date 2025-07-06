import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/LoginPage.css";
const CompleteProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token");

  const [formData, setFormData] = useState({
    Company: "",
    Role: "",
  });
  const [ProfileImage, setProfileImage] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formPayload = new FormData();
    formPayload.append("Company", formData.Company);
    formPayload.append("Role", formData.Role);
    if (ProfileImage) formPayload.append("ProfileImage", ProfileImage);

    try {
      await axios.put("http://localhost:8000/api/users/update", formPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };
  const allowedCompanies = [
    "Huawei",
    "Kuwait University",
    "STC",
    "Zain",
    "Ooredoo",
  ];

  const allowedRoles = ["Admin", "Manager", "Engineer", "Student", "Guest"];

  return (
    <form onSubmit={handleSubmit} className="profile-form">
      <h2 className="login-title">Complete Your Profile</h2>
      <div className="form-row">
        <div className="form-item">
          <label>Company</label>
          <select
            name="Company"
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
          <label>Role</label>
          <select
            name="Role"
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
      </div>

      <div className="form-item full-width">
        <label>Profile Image</label>
        <input type="file" name="ProfileImage" onChange={handleFileChange} />
      </div>

      {error && <p className="error-message">{error}</p>}

      <button type="submit" className="btn btn-primary">
        Update Profile
      </button>
    </form>
  );
};

export default CompleteProfilePage;
