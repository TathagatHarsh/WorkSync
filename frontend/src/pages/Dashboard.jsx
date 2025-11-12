import React from "react";

const Dashboard = ({ onLogout }) => {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>EduQuery Dashboard</h1>
        <button className="logout-button" onClick={onLogout}>
          Log out
        </button>
      </header>

      <section className="dashboard-content">
        <p>Features will be added here.</p>
      </section>
    </div>
  );
};

export default Dashboard;
