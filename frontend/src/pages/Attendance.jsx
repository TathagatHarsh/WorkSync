import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import "./Attendance.css";

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await api.get("/api/attendance/me");
      setAttendance(res.data);
    } catch (err) {
      setError("Failed to fetch attendance records");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PRESENT": return "status-present";
      case "ABSENT": return "status-absent";
      case "LEAVE": return "status-leave";
      default: return "";
    }
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="attendance-container">
      <div className="header-section">
        <h2>My Attendance History</h2>
        <p className="subtitle">View your daily attendance records</p>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <h3>Present</h3>
          <p className="stat-value present">
            {attendance.filter(a => a.status === "PRESENT").length}
          </p>
        </div>
        <div className="stat-card">
          <h3>Absent</h3>
          <p className="stat-value absent">
            {attendance.filter(a => a.status === "ABSENT").length}
          </p>
        </div>
        <div className="stat-card">
          <h3>Leaves</h3>
          <p className="stat-value leave">
            {attendance.filter(a => a.status === "LEAVE").length}
          </p>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
              <th>Day</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((record) => (
              <tr key={record.id}>
                <td>{new Date(record.date).toLocaleDateString()}</td>
                <td>
                  <span className={`status-badge ${getStatusColor(record.status)}`}>
                    {record.status}
                  </span>
                </td>
                <td>{new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' })}</td>
              </tr>
            ))}
            {attendance.length === 0 && (
              <tr>
                <td colSpan="3" className="no-data">No attendance records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
