import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import "./LeaveDashboard.css";

const LeaveDashboard = () => {
  const [leaves, setLeaves] = useState([]);
  const [filter, setFilter] = useState("PENDING");

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await api.get("/api/leaves");
      setLeaves(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/api/leaves/${id}/status`, { status });
      setLeaves(
        leaves.map((leave) =>
          leave.id === id ? { ...leave, status } : leave
        )
      );
    } catch (err) {
      alert("Failed to update status");
      console.error(err);
    }
  };

  const filteredLeaves = leaves.filter((leave) => {
    if (filter === "ALL") return true;
    return leave.status === filter;
  });

  return (
    <div className="leave-dashboard-container">
      <div className="dashboard-header">
        <h2>Leave Management Dashboard</h2>
        <div className="filter-tabs">
          {["PENDING", "APPROVED", "REJECTED", "ALL"].map((status) => (
            <button
              key={status}
              className={`filter-tab ${filter === status ? "active" : ""}`}
              onClick={() => setFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="requests-table-wrapper">
        <table className="requests-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Type</th>
              <th>Dates</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaves.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-requests">
                  No requests found for this filter.
                </td>
              </tr>
            ) : (
              filteredLeaves.map((leave) => (
                <tr key={leave.id}>
                  <td>
                    <div className="employee-info">
                      <span className="emp-name">{leave.user.name}</span>
                      <span className="emp-dept">{leave.user.department}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`type-badge ${leave.type.toLowerCase()}`}>
                      {leave.type}
                    </span>
                  </td>
                  <td>
                    <div className="date-range">
                      <span>{new Date(leave.startDate).toLocaleDateString()}</span>
                      <span className="arrow">→</span>
                      <span>{new Date(leave.endDate).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="reason-cell" title={leave.reason}>
                    {leave.reason}
                  </td>
                  <td>
                    <span className={`status-pill ${leave.status.toLowerCase()}`}>
                      {leave.status}
                    </span>
                  </td>
                  <td>
                    {leave.status === "PENDING" && (
                      <div className="action-buttons">
                        <button
                          className="action-btn approve"
                          onClick={() => handleStatusUpdate(leave.id, "APPROVED")}
                        >
                          Approve
                        </button>
                        <button
                          className="action-btn reject"
                          onClick={() => handleStatusUpdate(leave.id, "REJECTED")}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveDashboard;
