import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Login           from "./pages/Login";
import Register        from "./pages/Register";
import Dashboard       from "./pages/Dashboard";
import SubmitComplaint from "./pages/SubmitComplaint";
import TrackComplaints from "./pages/TrackComplaints";
import AdminPanel      from "./pages/AdminPanel";

function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { token } = useAuth();
  return token ? <Navigate to="/dashboard" replace /> : children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/"        element={<Navigate to="/dashboard" replace />} />
      <Route path="/login"   element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register"element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/dashboard"       element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/submit-complaint"element={<PrivateRoute><SubmitComplaint /></PrivateRoute>} />
      <Route path="/track-complaints"element={<PrivateRoute><TrackComplaints /></PrivateRoute>} />
      <Route path="/admin"           element={<AdminRoute><AdminPanel /></AdminRoute>} />
      <Route path="*"        element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
