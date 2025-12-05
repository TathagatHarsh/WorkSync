import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import "./EmployeeProfile.css";

const EmployeeProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: "",
    address: "",
    department: "",
    college: "",
    joiningDate: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/employees/me");
      setProfile(res.data);
      setFormData({
        phoneNumber: res.data.phoneNumber || "",
        address: res.data.address || "",
        department: res.data.department || "",
        college: res.data.college || "",
        joiningDate: res.data.joiningDate ? res.data.joiningDate.split("T")[0] : "",
      });
    } catch (err) {
      setError("Failed to fetch profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/api/employees/me", formData);
      setProfile(res.data);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) return <div className="loading-container">Loading...</div>;
  if (error) return <div className="error-container">{error}</div>;
  if (!profile) return <div className="error-container">No profile found</div>;

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header-section">
          <div className="avatar-container">
            <div className="avatar">{getInitials(profile.name)}</div>
          </div>
          <div className="header-info">
            <h1>{profile.name}</h1>
            <p className="email">{profile.email}</p>
            <span className="role-badge">{profile.role}</span>
          </div>
          {!isEditing && (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          )}
        </div>

        <div className="profile-content">
          {isEditing ? (
            <form onSubmit={handleUpdate} className="profile-form">
              <div className="form-section">
                <h3>Edit Details</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="+1 234 567 890"
                    />
                  </div>
                  <div className="form-group">
                    <label>Department</label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      placeholder="e.g. Engineering"
                    />
                  </div>
                  <div className="form-group">
                    <label>College</label>
                    <input
                      type="text"
                      name="college"
                      value={formData.college}
                      onChange={handleChange}
                      placeholder="e.g. University of Tech"
                    />
                  </div>
                  <div className="form-group">
                    <label>Joining Date</label>
                    <input
                      type="date"
                      name="joiningDate"
                      value={formData.joiningDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="123 Main St, City, Country"
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="save-btn">
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="details-section">
              <h3>Professional Details</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <label>Department</label>
                  <p>{profile.department || "Not set"}</p>
                </div>
                <div className="detail-item">
                  <label>College</label>
                  <p>{profile.college || "Not set"}</p>
                </div>
                <div className="detail-item">
                  <label>Joining Date</label>
                  <p>
                    {profile.joiningDate
                      ? new Date(profile.joiningDate).toLocaleDateString()
                      : "Not set"}
                  </p>
                </div>
                <div className="detail-item">
                  <label>Phone</label>
                  <p>{profile.phoneNumber || "Not set"}</p>
                </div>
                <div className="detail-item full-width">
                  <label>Address</label>
                  <p>{profile.address || "Not set"}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
