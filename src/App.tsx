import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/AdminLayout';
import Home from './pages/public/Home';
import Booking from './pages/public/Booking';
import AIAutomation from './pages/public/AIAutomation';
import Services from './pages/public/Services';
import Configurator from './pages/public/Configurator';
import Portfolio from './pages/public/Portfolio';
import FAQ from './pages/public/FAQ';
import About from './pages/public/About';
import Legal from './pages/public/Legal';
import Login from './pages/admin/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import LeadManagement from './pages/admin/LeadManagement';
import CMSView from './pages/admin/CMSView';
import ServicesView from './pages/admin/ServicesView';
import SettingsView from './pages/admin/SettingsView';
import SmoothScroll from './components/SmoothScroll';
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  return (
    <Router>
      <SmoothScroll>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="booking" element={<Booking />} />
            <Route path="services" element={<Services />} />
            <Route path="services/:slug" element={<Services />} />
            <Route path="ai-automation" element={<AIAutomation />} />
            <Route path="pricing" element={<Configurator />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="about" element={<About />} />
            <Route path="imprint" element={<Legal />} />
            <Route path="privacy" element={<Legal />} />
          </Route>

          {/* Admin Auth Route */}
          <Route path="/admin/login" element={<Login />} />

          {/* Admin Protected Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="leads" element={<LeadManagement />} />
            <Route path="services" element={<ServicesView />} />
            <Route path="cms" element={<CMSView />} />
            <Route path="settings" element={<SettingsView />} />
          </Route>
        </Routes>
      </SmoothScroll>
    </Router>
  );
}
