import React, { useState } from "react";
import "./LoginSignupForm.css";
import api from "../api/axiosConfig.js";

const LoginSignupForm = ({ onAuthSuccess = () => {} }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const res = await api.post("/signin", {
          email: formData.email,
          password: formData.password,
        });
        const token = res.data.token;
        setMessage("Login successful!");
        setMessageType("success");
        if (token) {
          onAuthSuccess(token);
        }
      } else {
        const res = await api.post("/signup", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        const token = res.data.token;
        setMessage(res.data.message || "Signup successful!");
        setMessageType("success");
        if (token) {
          onAuthSuccess(token);
        }
      }
    } catch (err) {
      console.error("Signup/Login error:", err);
      if (err.response) {
        const errorMessage = err.response.data.message || "An error occurred";
        console.error("Error details:", err.response.data);
        setMessage(errorMessage);
        setMessageType("error");
      } else if (err.request) {
        setMessage(
          "Cannot connect to server. Make sure the backend is running on http://localhost:3000"
        );
        setMessageType("error");
      } else {
        setMessage("An unexpected error occurred");
        setMessageType("error");
      }
    }
  };

  return (
    <div className="form-container">
      <div className="background-decoration">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      <div className="form-card">
        <div className="form-header">
          <h1 className="form-logo">WorkSync</h1>
          <p className="form-subtitle">
            {isLogin
              ? "Smart employee management made simple"
              : "Create your WorkSync account"}
          </p>
        </div>

        <div className="tab-buttons">
          <button
            className={`tab ${isLogin ? "active" : ""}`}
            onClick={() => {
              setIsLogin(true);
              setMessage("");
            }}
          >
            Login
          </button>
          <button
            className={`tab ${!isLogin ? "active" : ""}`}
            onClick={() => {
              setIsLogin(false);
              setMessage("");
            }}
          >
            Sign Up
          </button>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <div className="input-group">
            {!isLogin && (
              <div className="input-wrapper">
                <svg
                  className="input-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="input-field"
                  onChange={handleChange}
                  value={formData.name}
                  required
                />
              </div>
            )}

            <div className="input-wrapper">
              <svg
                className="input-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="input-field"
                onChange={handleChange}
                value={formData.email}
                required
              />
            </div>

            <div className="input-wrapper">
              <svg
                className="input-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="input-field"
                onChange={handleChange}
                value={formData.password}
                required
              />
            </div>
          </div>

          {isLogin && (
            <a href="/forgotpassword" className="forgot-link">
              Forgot password?
            </a>
          )}

          <button type="submit" className="submit-btn">
            <span>{isLogin ? "Login" : "Create Account"}</span>
            <svg
              className="btn-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </form>

        {message && (
          <div className={`message-alert ${messageType}`}>
            <span>{message}</span>
          </div>
        )}

        <div className="divider">
          <span>or</span>
        </div>

        <p className="bottom-text">
          {isLogin ? (
            <>
              Don't have a WorkSync account?{" "}
              <span className="toggle-link" onClick={() => setIsLogin(false)}>
                Sign up
              </span>
            </>
          ) : (
            <>
              Already using WorkSync?{" "}
              <span className="toggle-link" onClick={() => setIsLogin(true)}>
                Sign in
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default LoginSignupForm;
