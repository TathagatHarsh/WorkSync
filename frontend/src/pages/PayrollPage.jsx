import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import "./PayrollPage.css";

const PayrollPage = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [salaryData, setSalaryData] = useState({
    basicSalary: "",
    allowances: 0,
    deductions: 0,
  });
  const [myPayroll, setMyPayroll] = useState(null);
  const [loading, setLoading] = useState(true);

  const role = localStorage.getItem("role");
  const isAdminOrHR = role === "ADMIN" || role === "HR";

  useEffect(() => {
    if (isAdminOrHR) {
      fetchEmployees();
    } else {
      fetchMyPayroll();
    }
  }, [role]);

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/api/employees");
      setEmployees(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMyPayroll = async () => {
    try {
      const res = await api.get("/api/payroll/my");
      setMyPayroll(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectEmp = async (emp) => {
    setSelectedEmp(emp);
    try {
      const res = await api.get(`/api/payroll/salary/${emp.id}`);
      if (res.data) {
        setSalaryData(res.data);
      } else {
        setSalaryData({ basicSalary: "", allowances: 0, deductions: 0 });
      }
    } catch (err) {
      setSalaryData({ basicSalary: "", allowances: 0, deductions: 0 });
    }
  };

  const handleSaveSalary = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/payroll/salary", {
        userId: selectedEmp.id,
        basicSalary: parseFloat(salaryData.basicSalary),
        allowances: parseFloat(salaryData.allowances),
        deductions: parseFloat(salaryData.deductions),
      });
      alert("Salary structure saved");
    } catch (err) {
      alert("Failed to save salary");
    }
  };

  const generatePayslip = async (userId) => {
    const month = new Date().toISOString().slice(0, 7); // YYYY-MM
    try {
      await api.post("/api/payroll/generate", { userId, month });
      alert(`Payslip generated for ${month}`);
    } catch (err) {
      alert("Failed to generate payslip. Ensure salary is set.");
    }
  };

  if (loading) return <div className="p-loading">Loading...</div>;

  return (
    <div className="payroll-container">
      <h2>Payroll & Salary</h2>

      {/* ADMIN / HR VIEW */}
      {isAdminOrHR && (
        <div className="admin-payroll-view">
          <div className="emp-list-card">
            <h3>Employees</h3>
            <ul className="emp-list-scroll">
              {employees.map((emp) => (
                <li 
                  key={emp.id} 
                  className={selectedEmp?.id === emp.id ? "active" : ""}
                  onClick={() => handleSelectEmp(emp)}
                >
                  {emp.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="salary-details-card">
            {selectedEmp ? (
              <>
                <h3>Manage Salary: {selectedEmp.name}</h3>
                <form onSubmit={handleSaveSalary} className="salary-form">
                  <div className="form-group">
                    <label>Basic Salary</label>
                    <input
                      type="number"
                      value={salaryData.basicSalary}
                      onChange={(e) => setSalaryData({...salaryData, basicSalary: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group row">
                    <div>
                      <label>Allowances</label>
                      <input
                        type="number"
                        value={salaryData.allowances}
                        onChange={(e) => setSalaryData({...salaryData, allowances: e.target.value})}
                      />
                    </div>
                    <div>
                      <label>Deductions</label>
                      <input
                        type="number"
                        value={salaryData.deductions}
                        onChange={(e) => setSalaryData({...salaryData, deductions: e.target.value})}
                      />
                    </div>
                  </div>
                  <button type="submit" className="save-btn">Save Structure</button>
                </form>

                <div className="actions-section">
                  <h4>Actions</h4>
                  <button 
                    className="generate-btn"
                    onClick={() => generatePayslip(selectedEmp.id)}
                  >
                    Generate Payslip (Current Month)
                  </button>
                </div>
              </>
            ) : (
              <p className="select-prompt">Select an employee to manage salary.</p>
            )}
          </div>
        </div>
      )}

      {/* EMPLOYEE VIEW */}
      {!isAdminOrHR && myPayroll && (
        <div className="emp-payroll-view">
          <div className="salary-structure-card">
            <h3>My Salary Structure</h3>
            {myPayroll.structure ? (
              <div className="structure-grid">
                <div className="s-item">
                  <span>Basic</span>
                  <strong>${myPayroll.structure.basicSalary}</strong>
                </div>
                <div className="s-item">
                  <span>Allowances</span>
                  <strong>+${myPayroll.structure.allowances}</strong>
                </div>
                <div className="s-item">
                  <span>Deductions</span>
                  <strong>-${myPayroll.structure.deductions}</strong>
                </div>
                <div className="s-item total">
                  <span>Net Salary</span>
                  <strong>
                    ${myPayroll.structure.basicSalary + 
                      myPayroll.structure.allowances - 
                      myPayroll.structure.deductions}
                  </strong>
                </div>
              </div>
            ) : (
              <p>Salary structure not set by Admin yet.</p>
            )}
          </div>

          <div className="payslip-history-card">
            <h3>Payslip History</h3>
            {myPayroll.records.length === 0 ? (
              <p>No payslips generated yet.</p>
            ) : (
              <table className="payslip-table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Total Paid</th>
                    <th>Generated On</th>
                    <th>Download</th>
                  </tr>
                </thead>
                <tbody>
                  {myPayroll.records.map((record) => (
                    <tr key={record.id}>
                      <td>{record.month}</td>
                      <td>${record.totalPaid}</td>
                      <td>{new Date(record.generatedAt).toLocaleDateString()}</td>
                      <td>
                        <button className="download-btn" onClick={() => alert("Mock PDF Download")}>
                          PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollPage;
