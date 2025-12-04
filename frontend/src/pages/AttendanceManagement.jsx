import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import "./AttendanceManagement.css";

const AttendanceManagement = () => {
  const [attendance, setAttendance] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterName, setFilterName] = useState("");
  const [currentUserRole, setCurrentUserRole] = useState("");
  
  // New state for marking attendance
  const [selectedUser, setSelectedUser] = useState("");
  const [markDate, setMarkDate] = useState(new Date().toISOString().split('T')[0]);
  const [markStatus, setMarkStatus] = useState("PRESENT");

  useEffect(() => {
    fetchData();
    const role = localStorage.getItem("role");
    setCurrentUserRole(role);
  }, []);

  const fetchData = async () => {
    try {
      const [attendanceRes, usersRes] = await Promise.all([
        api.get("/api/attendance"),
        api.get("/api/employees")
      ]);
      setAttendance(attendanceRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      setError("Failed to fetch data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter users for dropdown: HR can only see EMPLOYEEs
  const availableUsers = users.filter(user => {
    if (currentUserRole === "HR") {
      return user.role === "EMPLOYEE";
    }
    return true; // Admin sees everyone
  });

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/api/attendance/${id}`, { status: newStatus });
      setAttendance(
        attendance.map((record) =>
          record.id === id ? { ...record, status: newStatus } : record
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
      console.error(err);
    }
  };

  const handleRunDaily = async () => {
    try {
      setLoading(true);
      const res = await api.post("/api/attendance/run-daily");
      alert(res.data.message);
      fetchData(); // Refresh list
    } catch (err) {
      alert("Failed to run daily attendance check");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    if (!selectedUser || !markDate) {
      alert("Please select a user and date");
      return;
    }

    try {
      const res = await api.post("/api/attendance", {
        userId: selectedUser,
        date: markDate,
        status: markStatus
      });
      
      // Refresh attendance list
      const newRecord = {
        ...res.data,
        user: users.find(u => u.id === parseInt(selectedUser))
      };
      
      setAttendance([newRecord, ...attendance]);
      alert("Attendance marked successfully");
      
      // Reset form (optional)
      setSelectedUser("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to mark attendance.");
      console.error(err);
    }
  };

  const filteredAttendance = attendance.filter((record) => {
    const matchesDate = filterDate ? record.date.startsWith(filterDate) : true;
    const matchesName = filterName
      ? record.user.name.toLowerCase().includes(filterName.toLowerCase())
      : true;
    return matchesDate && matchesName;
  });

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="attendance-management-container">
      <div className="header-section">
        <h2>Attendance Management</h2>
        <p className="subtitle">Manage employee attendance records</p>
        <button onClick={handleRunDaily} className="run-daily-btn">
          Run Daily Attendance Check
        </button>
      </div>

      {/* Mark Attendance Section */}
      <div className="mark-attendance-section">
        <h3>Mark New Attendance</h3>
        <form onSubmit={handleMarkAttendance} className="mark-form">
          <select 
            value={selectedUser} 
            onChange={(e) => setSelectedUser(e.target.value)}
            className="mark-input"
            required
          >
            <option value="">Select Employee</option>
            {availableUsers.map(user => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
          
          <input 
            type="date" 
            value={markDate}
            onChange={(e) => setMarkDate(e.target.value)}
            className="mark-input"
            required
          />
          
          <select 
            value={markStatus} 
            onChange={(e) => setMarkStatus(e.target.value)}
            className="mark-input"
          >
            <option value="PRESENT">Present</option>
            <option value="ABSENT">Absent</option>
            <option value="LEAVE">Leave</option>
          </select>
          
          <button type="submit" className="mark-btn">Mark Attendance</button>
        </form>
      </div>

      <div className="filters">
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="filter-input"
        />
        <input
          type="text"
          placeholder="Search by employee name..."
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          className="filter-input"
        />
      </div>

      <div className="table-wrapper">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendance.map((record) => (
              <tr key={record.id}>
                <td>
                  <div className="user-info">
                    <div className="user-avatar small">
                      {record.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="user-name">{record.user.name}</div>
                      <div className="user-email">{record.user.email}</div>
                    </div>
                  </div>
                </td>
                <td>{new Date(record.date).toLocaleDateString()}</td>
                <td>
                  <span className={`status-badge ${record.status.toLowerCase()}`}>
                    {record.status}
                  </span>
                </td>
                <td>
                  <select
                    value={record.status}
                    onChange={(e) => handleStatusChange(record.id, e.target.value)}
                    className="status-select"
                  >
                    <option value="PRESENT">Present</option>
                    <option value="ABSENT">Absent</option>
                    <option value="LEAVE">Leave</option>
                  </select>
                </td>
              </tr>
            ))}
            {filteredAttendance.length === 0 && (
              <tr>
                <td colSpan="4" className="no-data">No records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceManagement;
