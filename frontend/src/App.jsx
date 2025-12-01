import React, { useState, useEffect } from "react";
import { Navigate, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import api from "./api/axiosConfig";
import "./App.css";
import LoginSignupForm from "./pages/LoginSignupForm.jsx";
import EmployeeList from "./pages/EmployeeList.jsx";
import EmployeeProfile from "./pages/EmployeeProfile.jsx";
import Unauthorized from "./pages/Unauthorized.jsx";
import Navbar from "./components/Navbar.jsx";

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRoles.includes(role)) {
    return children;
  } else {
    return <Navigate to="/unauthorized" replace />;
  }
};

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [role, setRole] = useState(() => localStorage.getItem("role"));
  const navigate = useNavigate();

  const handleAuthSuccess = async (newToken) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
      setToken(newToken);
      
      try {
        // Fetch user profile to get role
        const res = await api.get("/api/employees/me", {
          headers: { Authorization: `Bearer ${newToken}` }
        });
        const userRole = res.data.role;
        localStorage.setItem("role", userRole);
        setRole(userRole);

        if (userRole === "ADMIN" || userRole === "HR") {
          navigate("/employees", { replace: true });
        } else {
          navigate("/my-profile", { replace: true });
        }
      } catch (e) {
        console.error("Failed to fetch user role", e);
        handleLogout();
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole(null);
    navigate("/", { replace: true });
  };

  return (
    <>
      {token && <Navbar onLogout={handleLogout} />}
      <Routes>
        <Route
          path="/"
          element={
            token ? (
              <Navigate to={role === "EMPLOYEE" ? "/my-profile" : "/employees"} replace />
            ) : (
              <LoginSignupForm onAuthSuccess={handleAuthSuccess} />
            )
          }
        />
        
        <Route
          path="/employees"
          element={
            <RoleBasedRoute allowedRoles={["ADMIN", "HR"]}>
              <EmployeeList />
            </RoleBasedRoute>
          }
        />
        
        <Route
          path="/my-profile"
          element={
            <RoleBasedRoute allowedRoles={["EMPLOYEE"]}>
              <EmployeeProfile />
            </RoleBasedRoute>
          }
        />

        <Route
          path="/attendance"
          element={
            <RoleBasedRoute allowedRoles={["EMPLOYEE"]}>
              <div style={{ padding: "2rem", textAlign: "center" }}>
                <h2>Attendance Page</h2>
                <p>Coming Soon...</p>
              </div>
            </RoleBasedRoute>
          }
        />

        <Route path="/unauthorized" element={<Unauthorized />} />
        
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </>
  );
}

export default App;
