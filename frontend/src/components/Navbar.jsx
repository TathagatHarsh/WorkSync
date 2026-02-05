import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ onLogout }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">WorkSync</Link>
      </div>
      <div className="navbar-links">
        {(role === "ADMIN" || role === "HR") && (
          <>
            <Link to="/employees">Employees</Link>
            <Link to="/attendance-management">Manage Attendance</Link>
            <Link to="/leave-dashboard">Manage Leaves</Link>
            <Link to="/payroll">Payroll</Link>
            {role === "HR" && <Link to="/attendance">My Attendance</Link>}
          </>
        )}
        {role === "EMPLOYEE" && (
          <>
            <Link to="/my-profile">My Profile</Link>
            <Link to="/attendance">Attendance</Link>
            <Link to="/leave-request">Request Leave</Link>
            <Link to="/payroll">My Pay</Link>
          </>
        )}
        <Link to="/todo">To-Do List</Link>
        <button onClick={onLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
