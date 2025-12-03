import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import "./EmployeeList.css";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);

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

  const handleRoleChange = async (id, newRole, e) => {
    e.stopPropagation(); // Prevent row click when changing role
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

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Prevent row click when deleting
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await api.delete(`/api/employees/${id}`);
      setEmployees(employees.filter((emp) => emp.id !== id));
    } catch (err) {
      alert("Failed to delete employee");
      console.error(err);
    }
  };

  const handleRowClick = (employee) => {
    setSelectedEmployee(employee);
  };

  const closeModal = () => {
    setSelectedEmployee(null);
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="employee-list-container">
      <div className="header-section">
        <h2>Employee Directory</h2>
        <p className="subtitle">Manage and view all registered users</p>
      </div>
      
      <div className="table-wrapper">
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
              <tr 
                key={emp.id} 
                onClick={() => handleRowClick(emp)}
                className="clickable-row"
              >
                <td>
                  <div className="user-info">
                    <div className="user-avatar">
                      {emp.name.charAt(0).toUpperCase()}
                    </div>
                    <span>{emp.name}</span>
                  </div>
                </td>
                <td>{emp.email}</td>
                <td>
                  {role === "ADMIN" ? (
                    <select
                      value={emp.role}
                      onChange={(e) => handleRoleChange(emp.id, e.target.value, e)}
                      onClick={(e) => e.stopPropagation()}
                      className="role-select"
                    >
                      <option value="HR">HR</option>
                      <option value="EMPLOYEE">Employee</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  ) : (
                    <span className={`role-badge ${emp.role.toLowerCase()}`}>
                      {emp.role}
                    </span>
                  )}
                </td>
                {role === "ADMIN" && (
                  <td>
                    <button
                      onClick={(e) => handleDelete(emp.id, e)}
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

      {selectedEmployee && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>&times;</button>
            <div className="modal-header">
              <div className="modal-avatar">
                {selectedEmployee.name.charAt(0).toUpperCase()}
              </div>
              <h3>{selectedEmployee.name}</h3>
              <span className={`role-badge ${selectedEmployee.role.toLowerCase()}`}>
                {selectedEmployee.role}
              </span>
            </div>
            <div className="modal-body">
              <div className="detail-group">
                <label>Email Address</label>
                <p>{selectedEmployee.email}</p>
              </div>
              <div className="detail-group">
                <label>User ID</label>
                <p>{selectedEmployee.id}</p>
              </div>
              {/* Add more details here if available in the future */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
