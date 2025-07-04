import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import TeamManagement from './pages/TeamManagement';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import MasterParent from './pages/MasterParent';
import MasterSub from './pages/MasterSub';
import MasterType from './pages/MasterType';
import MasterFrequency from './pages/MasterFrequency';
import MasterPeriod from './pages/MasterPeriod';
import Documents from './pages/Documents';
import React from 'react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Auth />} />
        {/* <Route path="/register" element={<Register />} /> */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/management/users"
          element={
            <ProtectedRoute>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/management/team"
          element={
            <ProtectedRoute>
              <TeamManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/master/parent"
          element={
            <ProtectedRoute>
              <MasterParent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/master/sub"
          element={
            <ProtectedRoute>
              <MasterSub />
            </ProtectedRoute>
          }
        />
        <Route
          path="/master/type"
          element={
            <ProtectedRoute>
              <MasterType />
            </ProtectedRoute>
          }
        />
        <Route
          path="/master/frequency"
          element={
            <ProtectedRoute>
              <MasterFrequency />
            </ProtectedRoute>
          }
        />
        <Route
          path="/master/period"
          element={
            <ProtectedRoute>
              <MasterPeriod />
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents"
          element={
            <ProtectedRoute>
              <Documents />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
} 