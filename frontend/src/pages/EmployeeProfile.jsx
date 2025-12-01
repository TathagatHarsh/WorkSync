import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import "./EmployeeProfile.css";

const EmployeeProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/employees/me");
      setProfile(res.data);
    } catch (err) {
      setError("Failed to fetch profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!profile) return <div>No profile found</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>My Profile</h2>
        <div className="profile-info">
          <div className="info-group">
            <label>Name</label>
            <p>{profile.name}</p>
          </div>
          <div className="info-group">
            <label>Email</label>
            <p>{profile.email}</p>
          </div>
          <div className="info-group">
            <label>Role</label>
            <p className="role-badge">{profile.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
