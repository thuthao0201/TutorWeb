import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./../styles/Welcome.css";

export default function Welcome() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Redirect to home if already logged in
    if (isAuthenticated()) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="welcome-container">
      <h1>Chào mừng tới với Smart-Tutor</h1>
      <p>Hãy đăng nhập để truy cập vào hệ thống kết nối gia sư thông minh</p>
      <button className="login-button" onClick={handleLogin}>
        Đăng nhập
      </button>
    </div>
  );
}
