import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

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

      navigate("/profile"); //i need to change this to home when i creat dashbored and predict pages
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="container complete-profile">
      <h2>Complete Your Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-item">
          <label>Company</label>
          <input
            type="text"
            name="Company"
            value={formData.Company}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-item">
          <label>Role</label>
          <input
            type="text"
            name="Role"
            value={formData.Role}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-item">
          <label>Profile Image</label>
          <input type="file" name="ProfileImage" onChange={handleFileChange} />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="btn btn-primary">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default CompleteProfilePage;
