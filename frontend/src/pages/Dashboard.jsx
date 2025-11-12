import React from "react";

const Dashboard = ({ onLogout }) => {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>WorkSync Dashboard</h1>
        <button className="logout-button" onClick={onLogout}>
          Log out
        </button>
      </header>

      <section className="dashboard-content">
        <p>
          Welcome to WorkSync – Smart Employee Management System. Centralize
          team updates, track tasks, and streamline HR workflows from one modern
          dashboard.
        </p>
        <p>Feature modules will be added here next.</p>
      </section>
    </div>
  );
};

export default Dashboard;
