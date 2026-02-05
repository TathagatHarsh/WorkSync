import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import "./LeaveRequest.css";

const LeaveRequest = () => {
  const [leaves, setLeaves] = useState([]);
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    type: "CASUAL",
    reason: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await api.get("/api/leaves/my");
      setLeaves(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/leaves", formData);
      setMessage("Leave request submitted successfully!");
      setFormData({
        startDate: "",
        endDate: "",
        type: "CASUAL",
        reason: "",
      });
      fetchLeaves();
    } catch (err) {
      console.error(err);
      setMessage("Failed to submit request.");
    }
  };

  return (
    <div className="leave-container">
      <div className="leave-header">
        <h2>My Leave Requests</h2>
        <p>Submit and track your time off</p>
      </div>

      <div className="leave-content">
        <div className="leave-form-card">
          <h3>Request New Leave</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Leave Type</label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              >
                <option value="CASUAL">Casual Leave</option>
                <option value="SICK">Sick Leave</option>
                <option value="ANNUAL">Annual Leave</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="date-row">
              <div className="form-group">
                <label>From</label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>To</label>
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label>Reason</label>
              <textarea
                required
                rows="3"
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                placeholder="Brief reason for your leave..."
              />
            </div>

            <button type="submit" className="submit-btn">
              Submit Request
            </button>
            {message && <p className="success-msg">{message}</p>}
          </form>
        </div>

        <div className="leave-history-card">
          <h3>History</h3>
          {leaves.length === 0 ? (
            <p className="no-data">No leave history found.</p>
          ) : (
            <div className="history-list">
              {leaves.map((leave) => (
                <div key={leave.id} className="history-item">
                  <div className="leave-info">
                    <span className={`leave-type-badge ${leave.type.toLowerCase()}`}>
                      {leave.type}
                    </span>
                    <span className="leave-dates">
                      {new Date(leave.startDate).toLocaleDateString()} -{" "}
                      {new Date(leave.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <span className={`status-badge ${leave.status.toLowerCase()}`}>
                    {leave.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveRequest;
