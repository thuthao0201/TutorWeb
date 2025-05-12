import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Welcome from "../pages/Welcome";
import Login from "../pages/Login";
import Home from "../pages/Home";
import AppointmentNoti from "../pages/AppointmentNoti";
import Schedule from "../pages/Schedule";
import Wallet from "../pages/Wallet";
import Sessions from "../pages/Sessions";
import History from "../pages/History";
import Setting from "../pages/Settings.jsx";

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default function AppRouter() {
  return (
    <Routes>
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Setting />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sessions"
        element={
          <ProtectedRoute>
            <Sessions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wallet"
        element={
          <ProtectedRoute>
            <Wallet />
          </ProtectedRoute>
        }
      />
      <Route
        path="/schedule"
        element={
          <ProtectedRoute>
            <Schedule />
          </ProtectedRoute>
        }
      />
      <Route
        path="/appointmentnoti"
        element={
          <ProtectedRoute>
            <AppointmentNoti />
          </ProtectedRoute>
        }
      />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Welcome />} />
    </Routes>
  );
}
