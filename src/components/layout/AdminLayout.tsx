import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { LayoutDashboard, Users, Settings, Package, LogOut, Layers, Menu, X, Hexagon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Check transient demo session
      if (sessionStorage.getItem('_viktor_authenticated') === 'true') {
        setIsChecking(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin/login');
        return;
      }

      // Check if user is an admin
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (!adminUser) {
        await supabase.auth.signOut();
        navigate('/admin/login');
      } else {
        sessionStorage.setItem('_viktor_authenticated', 'true');
        setIsChecking(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    // Close sidebar on route change
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    sessionStorage.removeItem('_viktor_authenticated');
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Layers className="h-8 w-8 text-cyan-500/50" />
          <p className="text-slate-500 text-sm font-light">Zugriff wird überprüft...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/leads', icon: Users, label: 'Leads' },
    { path: '/admin/services', icon: Package, label: 'Leistungen' },
    { path: '/admin/cms', icon: Layers, label: 'CMS' },
    { path: '/admin/settings', icon: Settings, label: 'Einstellungen' },
  ];

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col md:flex-row relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-dark-900 via-dark-950 to-dark-950 opacity-20 pointer-events-none"></div>
      
      {/* Mobile Header */}
      <div className="md:hidden h-16 bg-dark-900/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6 sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display font-bold text-lg text-slate-50 tracking-widest uppercase">Viktor<span className="text-cyan-500 ml-1">Labs</span></span>
          <span className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest ml-2">Admin</span>
        </Link>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-dark-900/95 backdrop-blur-xl text-gray-400 flex flex-col border-r border-white/10 z-40 transition-transform duration-300 md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="h-20 hidden md:flex items-center px-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-3 group text-slate-50">
            <div className="relative">
              <Hexagon className="w-8 h-8 text-cyan-500 fill-cyan-500/10 group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-sm tracking-widest uppercase leading-none">Viktor<span className="text-cyan-500 ml-1">Labs</span></span>
              <span className="text-[9px] text-cyan-500 font-bold uppercase tracking-widest mt-1 opacity-60">Control Center</span>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 py-6 md:py-8 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] tracking-widest uppercase font-bold transition-all ${
                  isActive 
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                    : 'border border-transparent hover:bg-dark-950/50 hover:text-slate-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-gray-500 hover:text-white hover:bg-dark-950 uppercase tracking-widest text-xs"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-3" />
            Abmelden
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 relative z-10 text-gray-100 w-full overflow-x-hidden">
        <div className="flex-1 p-6 md:p-10">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
