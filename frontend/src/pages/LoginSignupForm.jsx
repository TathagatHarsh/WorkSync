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
  const [showPassword, setShowPassword] = useState(false);

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

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setMessage("");
    setMessageType("");
    setFormData({ name: "", email: "", password: "" });
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        {/* Left Side - Form */}
        <div className={`auth-side form-side ${isLogin ? "login-mode" : "signup-mode"}`}>
          <div className="form-content">
            <div className="brand-header">
              <div className="logo-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h1>WorkSync</h1>
            </div>

            <div className="text-header">
              <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
              <p>{isLogin ? "Please enter your details to sign in" : "Start your journey with us today"}</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="input-group">
                  <label>Full Name</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    <span className="input-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </div>
                </div>
              )}

              <div className="input-group">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    name="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <span className="input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 6l-10 7L2 6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
              </div>

              <div className="input-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M1 1l22 22" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {isLogin && (
                <div className="form-actions">
                  <label className="remember-me">
                    <input type="checkbox" />
                    <span>Remember me</span>
                  </label>
                  <a href="/forgotpassword">Forgot password?</a>
                </div>
              )}

              <button type="submit" className="submit-btn">
                {isLogin ? "Sign In" : "Create Account"}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>

            {message && (
              <div className={`message-alert ${messageType}`}>
                {messageType === 'success' ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 4L12 14.01l-3-3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 8v4M12 16h.01" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                <span>{message}</span>
              </div>
            )}

            <div className="auth-footer">
              <p>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button onClick={toggleMode} className="toggle-btn">
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Decorative */}
        <div className="auth-side decorative-side">
          <div className="decorative-content">
            <div className="floating-shapes">
              <div className="shape shape-1"></div>
              <div className="shape shape-2"></div>
              <div className="shape shape-3"></div>
            </div>
            <div className="decorative-text">
              <h2>Manage Your Workforce Efficiently</h2>
              <p>Streamline your employee management process with our powerful tools and analytics.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignupForm;
