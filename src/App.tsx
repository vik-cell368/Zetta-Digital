import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/AdminLayout';
import Home from './pages/public/Home';
import Booking from './pages/public/Booking';
import Services from './pages/public/Services';
import Pricing from './pages/public/Pricing';
import Process from './pages/public/Process';
import Portfolio from './pages/public/Portfolio';
import FAQ from './pages/public/FAQ';
import About from './pages/public/About';
import Blog from './pages/public/Blog';
import Contact from './pages/public/Contact';
import Knowledge from './pages/public/Knowledge';
import Legal from './pages/public/Legal';
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
            <Route path="services" element={<Services />} />
            <Route path="services/:slug" element={<Services />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="process" element={<Process />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="about" element={<About />} />
            <Route path="blog" element={<Blog />} />
            <Route path="contact" element={<Contact />} />
            <Route path="knowledge" element={<Knowledge />} />
            <Route path="imprint" element={<Legal />} />
            <Route path="privacy" element={<Legal />} />
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
