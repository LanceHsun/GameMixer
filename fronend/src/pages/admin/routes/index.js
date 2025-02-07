// src/pages/admin/routes/index.js
import React from 'react';
import { Route } from 'react-router-dom';
import AdminLayout from '../layout/AdminLayout';
import DashboardPage from '../pages/DashboardPage';
import EventEditPage from '../pages/EventEditPage';
import EventCreatePage from '../pages/EventCreatePage';
import LoginPage from '../pages/LoginPage';

export const adminRoutes = [
  <Route key="admin" path="/admin" element={<AdminLayout />}>
    <Route path="login" element={<LoginPage />} />
    <Route path="dashboard" element={<DashboardPage />} />
    <Route path="events/new" element={<EventCreatePage />} />
    <Route path="events/edit/:eventId" element={<EventEditPage />} />
  </Route>
];