import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/AdminLayout';
import Home from './pages/public/Home';
import Booking from './pages/public/Booking';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import AppointmentsView from './pages/admin/AppointmentsView';
import ServicesView from './pages/admin/ServicesView';
import SettingsView from './pages/admin/SettingsView';
import ContentView from './pages/admin/ContentView';
import SmoothScroll from './components/SmoothScroll';

export default function App() {
  return (
    <SmoothScroll>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="booking" element={<Booking />} />
          </Route>

          {/* Admin Auth Route */}
          <Route path="/admin/login" element={<Login />} />

          {/* Admin Protected Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="appointments" element={<AppointmentsView />} />
            <Route path="services" element={<ServicesView />} />
            <Route path="content" element={<ContentView />} />
            <Route path="settings" element={<SettingsView />} />
          </Route>
        </Routes>
      </Router>
    </SmoothScroll>
  );
}
