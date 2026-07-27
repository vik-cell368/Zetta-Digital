import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
const PublicLayout = lazy(() => import('./components/layout/PublicLayout'));
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'));

// Public Pages
const Home = lazy(() => import('./pages/public/Home'));
const Booking = lazy(() => import('./pages/public/Booking'));
const Services = lazy(() => import('./pages/public/Services'));
const Configurator = lazy(() => import('./pages/public/Configurator'));
const Portfolio = lazy(() => import('./pages/public/Portfolio'));
const FAQ = lazy(() => import('./pages/public/FAQ'));
const About = lazy(() => import('./pages/public/About'));
const Legal = lazy(() => import('./pages/public/Legal'));
const Contact = lazy(() => import('./pages/public/Contact'));
const Process = lazy(() => import('./pages/public/Process'));

// Admin Pages
const Login = lazy(() => import('./pages/admin/Login'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const LeadManagement = lazy(() => import('./pages/admin/LeadManagement'));
const CMSView = lazy(() => import('./pages/admin/CMSView'));
const ServicesView = lazy(() => import('./pages/admin/ServicesView'));
const SettingsView = lazy(() => import('./pages/admin/SettingsView'));

import SmoothScroll from './components/SmoothScroll';
import ScrollToTop from './components/ScrollToTop';
import { migrateLocalStorage } from './lib/migration';

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="fixed inset-0 bg-dark-950 flex items-center justify-center z-[9999]">
    <div className="w-12 h-12 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
  </div>
);

export default function App() {
  useEffect(() => {
    migrateLocalStorage();
  }, []);

  return (
    <Router>
      <SmoothScroll>
        <ScrollToTop />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="booking" element={<Booking />} />
              <Route path="services" element={<Services />} />
              <Route path="services/:slug" element={<Services />} />
              <Route path="pricing" element={<Configurator />} />
              <Route path="portfolio" element={<Portfolio />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="about" element={<About />} />
              <Route path="process" element={<Process />} />
              <Route path="contact" element={<Contact />} />
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
        </Suspense>
      </SmoothScroll>
    </Router>
  );
}
