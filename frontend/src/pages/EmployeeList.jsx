import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import "./EmployeeList.css";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/api/employees");
      setEmployees(res.data);
    } catch (err) {
      setError("Failed to fetch employees");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await api.put(`/api/employees/${id}`, { role: newRole });
      setEmployees(
        employees.map((emp) =>
          emp.id === id ? { ...emp, role: newRole } : emp
        )
      );
    } catch (err) {
      alert("Failed to update role");
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="employee-list-container">
      <h2>Employee Directory</h2>
      {/* Add Employee Button could go here for Admin/HR */}
      
      <table className="employee-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            {role === "ADMIN" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>
                {role === "ADMIN" ? (
                  <select
                    value={emp.role}
                    onChange={(e) => handleRoleChange(emp.id, e.target.value)}
                    className="role-select"
                  >
                    <option value="HR">HR</option>
                    <option value="EMPLOYEE">Employee</option>
                  </select>
                ) : (
                  emp.role
                )}
              </td>
              {role === "ADMIN" && (
                <td>
                  <button
                    onClick={() => handleDelete(emp.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
