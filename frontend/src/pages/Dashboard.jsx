import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosConfig";
import "./Dashboard.css";

// Icons
const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="card-icon profile-icon"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);

const AttendanceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="card-icon attendance-icon"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);

const TaskIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="card-icon task-icon"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
);

const TeamIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="card-icon team-icon"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [attendance, setAttendance] = useState(null);
  const [employeeCount, setEmployeeCount] = useState(0);
  
  const [loading, setLoading] = useState({
    profile: true,
    attendance: true,
    tasks: true,
    stats: true,
  });

  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchData = async () => {
      const today = new Date().toISOString().split("T")[0];

      // 1. Fetch Profile (All Users)
      api.get("/api/employees/me")
        .then((res) => setUser(res.data))
        .catch((err) => console.error("Profile fetch error:", err))
        .finally(() => setLoading((prev) => ({ ...prev, profile: false })));

      // 2. Fetch Tasks (All Users)
      api.get(`/api/tasks?date=${today}`)
        .then((res) => setTasks(res.data.slice(0, 3)))
        .catch((err) => console.error("Tasks fetch error:", err))
        .finally(() => setLoading((prev) => ({ ...prev, tasks: false })));

      // 3. Role-Specific Data
      if (role === "EMPLOYEE" || role === "HR") {
        api.get(`/api/attendance/today?date=${today}`)
          .then((res) => setAttendance(res.data))
          .catch((err) => {
            console.error("Attendance fetch error:", err);
            setAttendance({ status: "Not Marked" });
          })
          .finally(() => setLoading((prev) => ({ ...prev, attendance: false })));
      }
      
      if (role === "ADMIN" || role === "HR") {
        api.get("/api/employees/count")
          .then((res) => setEmployeeCount(res.data.count))
          .catch((err) => console.error("Count fetch error:", err))
          .finally(() => setLoading((prev) => ({ ...prev, stats: false })));
      }
    };

    fetchData();
  }, [role]);

  const handleToggleTask = async (id, currentStatus) => {
    try {
      setTasks(tasks.map(t => t.id === id ? { ...t, done: !currentStatus } : t));
      await api.put(`/api/tasks/${id}`, { done: !currentStatus });
    } catch (error) {
      console.error("Error updating task:", error);
      setTasks(tasks.map(t => t.id === id ? { ...t, done: currentStatus } : t));
    }
  };

  const getAttendanceColor = (status) => {
    if (!status) return "gray";
    switch (status.toUpperCase()) {
      case "PRESENT": return "green";
      case "ABSENT": return "red";
      case "LEAVE": return "orange";
      default: return "gray";
    }
  };

  const Skeleton = ({ height = "1rem", width = "100%", style = {} }) => (
    <div className="skeleton" style={{ height, width, ...style }}></div>
  );

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>
            {loading.profile ? <Skeleton width="200px" height="2.5rem" /> : `Welcome back, ${user?.name?.split(" ")[0]}!`}
          </h1>
          <p className="date-display">
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </header>

      <div className="dashboard-grid">
        {/* --- EMPLOYEE & HR VIEW (Personal Attendance) --- */}
        {(role === "EMPLOYEE" || role === "HR") && (
          <>
            {/* Profile Card (Only for Employee, HR has other ways or can be added later if needed, but let's keep it simple for now or include it if desired. The user specifically asked for attendance) 
               Actually, let's just enable the Attendance Card for HR.
            */}
            
            {role === "EMPLOYEE" && (
            <div className="dashboard-card profile-card">
              <div className="card-header">
                <div className="header-title">
                  <div className="icon-wrapper blue">
                    <ProfileIcon />
                  </div>
                  <h3>My Profile</h3>
                </div>
                {!loading.profile && (
                  <span className={`status-pill ${user?.isProfileComplete ? "success" : "warning"}`}>
                    {user?.isProfileComplete ? "Complete" : "Incomplete"}
                  </span>
                )}
              </div>
              <div className="card-body">
                {loading.profile ? (
                  <div className="skeleton-group">
                    <Skeleton width="60%" />
                    <Skeleton width="80%" />
                  </div>
                ) : (
                  <div className="profile-info">
                    <div className="info-row">
                      <span className="label">Role</span>
                      <span className="value">{user?.role}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Department</span>
                      <span className="value">{user?.department || "Not set"}</span>
                    </div>
                    {!user?.isProfileComplete && (
                      <div className="warning-box">
                        <span className="warning-icon">⚠️</span>
                        <span>Please complete your profile details.</span>
                      </div>
                    )}
                  </div>
                )}
                <Link to="/my-profile" className="card-btn">View Profile</Link>
              </div>
            </div>
            )}

            {/* Attendance Card */}
            <div className="dashboard-card attendance-card">
              <div className="card-header">
                <div className="header-title">
                  <div className="icon-wrapper green">
                    <AttendanceIcon />
                  </div>
                  <h3>Today's Attendance</h3>
                </div>
              </div>
              <div className="card-body center-content">
                {loading.attendance ? (
                  <Skeleton height="3rem" width="50%" />
                ) : (
                  <div className="attendance-display">
                    <div className={`attendance-status ${getAttendanceColor(attendance?.status)}`}>
                      {attendance?.status || "Not Marked"}
                    </div>
                    <p className="status-helper">
                      {attendance?.status === "PRESENT" ? "You are marked present for today." : 
                       attendance?.status === "ABSENT" ? "You are marked absent for today." : 
                       "Your attendance has not been marked yet."}
                    </p>
                  </div>
                )}
                <Link to="/attendance" className="card-btn secondary">View History</Link>
              </div>
            </div>
          </>
        )}

        {/* --- ADMIN / HR VIEW --- */}
        {(role === "ADMIN" || role === "HR") && (
          <>
            {/* Employee Management Card */}
            <div className="dashboard-card stats-card">
              <div className="card-header">
                <div className="header-title">
                  <div className="icon-wrapper purple">
                    <TeamIcon />
                  </div>
                  <h3>Total Employees</h3>
                </div>
              </div>
              <div className="card-body center-content">
                {loading.stats ? (
                  <Skeleton height="4rem" width="30%" />
                ) : (
                  <div className="big-number">{employeeCount}</div>
                )}
                <Link to="/employees" className="card-btn">Manage Employees</Link>
              </div>
            </div>

            {/* Attendance Management Card */}
            <div className="dashboard-card">
              <div className="card-header">
                <div className="header-title">
                  <div className="icon-wrapper orange">
                    <AttendanceIcon />
                  </div>
                  <h3>Attendance</h3>
                </div>
              </div>
              <div className="card-body">
                <p className="card-desc">Manage employee attendance records, view daily reports, and export data.</p>
                <Link to="/attendance-management" className="card-btn secondary">View Records</Link>
              </div>
            </div>
          </>
        )}

        {/* --- COMMON: DAILY TASKS --- */}
        <div className="dashboard-card task-card">
          <div className="card-header">
            <div className="header-title">
              <div className="icon-wrapper pink">
                <TaskIcon />
              </div>
              <h3>My Tasks</h3>
            </div>
            <Link to="/todo" className="link-btn">View All</Link>
          </div>
          <div className="card-body">
            {loading.tasks ? (
              <div className="skeleton-group">
                <Skeleton />
                <Skeleton />
                <Skeleton />
              </div>
            ) : tasks.length === 0 ? (
              <div className="empty-state">
                <span className="emoji">🎉</span>
                <p>All caught up! No tasks for today.</p>
              </div>
            ) : (
              <ul className="mini-task-list">
                {tasks.map(task => (
                  <li key={task.id} className={task.done ? "done" : ""}>
                    <label className="custom-checkbox">
                      <input 
                        type="checkbox" 
                        checked={task.done} 
                        onChange={() => handleToggleTask(task.id, task.done)}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <span className="task-title">{task.title}</span>
                  </li>
                ))}
              </ul>
            )}
            <Link to="/todo" className="card-btn">Manage Tasks</Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
