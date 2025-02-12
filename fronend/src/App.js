import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './pages/admin/layout/AdminLayout';

// Public pages
import HomePage from './pages/Home';
import DonationPage from './pages/Donation';
import EventsPage from './pages/Events';
import EventDetailPage from './pages/Events/EventDetail';
import PastEventDetail from './pages/Events/PastEventDetail';

// Admin pages
import AdminLoginPage from './pages/admin/pages/LoginPage';
import AdminDashboardPage from './pages/admin/pages/DashboardPage';
import EventCreatePage from './pages/admin/pages/EventCreatePage';
import EventEditPage from './pages/admin/pages/EventEditPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

import './styles/globals.css';
import { paths } from './config/paths';

function App() {
  return (
    <AuthProvider>
      <HashRouter basename={paths.BASE_PATH}>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout>
                <Outlet />
              </AdminLayout>
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            } />
            <Route path="events/new" element={
              <ProtectedRoute>
                <EventCreatePage />
              </ProtectedRoute>
            } />
            <Route path="events/edit/:eventId" element={
              <ProtectedRoute>
                <EventEditPage />
              </ProtectedRoute>
            } />
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
          </Route>

          {/* Public Routes */}
          <Route element={<MainLayout><Outlet /></MainLayout>}>
            <Route path="/" element={<HomePage />} />
            <Route path="/donate" element={<DonationPage />} />
            <Route path="/give" element={<DonationPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:eventId" element={<EventDetailPage />} />
            <Route path="/events/past/:eventId" element={<PastEventDetail />} />
          </Route>

          {/* Catch all redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;