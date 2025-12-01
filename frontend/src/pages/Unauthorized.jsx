import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div style={{ textAlign: "center", padding: "4rem" }}>
      <h1>403 - Unauthorized</h1>
      <p>You do not have permission to access this page.</p>
      <Link to="/" style={{ color: "#007bff", textDecoration: "none" }}>
        Go back home
      </Link>
    </div>
  );
};

export default Unauthorized;
