import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { LayoutDashboard, Users, Settings, Package, LogOut, Layers } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Check transient demo session
      if ((window as any)._zetta_authenticated) {
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
        (window as any)._zetta_authenticated = true;
        setIsChecking(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    (window as any)._zetta_authenticated = false;
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Layers className="h-8 w-8 text-neon-500/50" />
          <p className="text-gray-500 text-sm font-light">Zugriff wird überprüft...</p>
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
    <div className="min-h-screen bg-dark-950 flex relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-dark-900 via-dark-950 to-dark-950 opacity-20 pointer-events-none"></div>
      
      {/* Sidebar */}
      <aside className="w-64 bg-dark-900/80 backdrop-blur-md text-gray-400 flex flex-col border-r border-white/10 relative z-10">
        <div className="h-20 flex items-center px-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-3 group text-white">
            <div className="relative flex items-center justify-center w-8 h-8 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-neon-400 to-gray-400 opacity-20 rounded-lg blur-md group-hover:opacity-40 transition-opacity"></div>
              <div className="font-display font-medium tracking-wider text-xl text-white relative z-10">ZETTA</div>
            </div>
            <span className="font-display text-sm tracking-widest uppercase font-semibold">
              Zetta Admin
            </span>
          </Link>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs tracking-wider uppercase font-medium transition-all ${
                  isActive 
                    ? 'bg-neon-500/10 text-neon-400 border border-neon-500/20' 
                    : 'border border-transparent hover:bg-dark-950 hover:text-white'
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
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative z-10 text-gray-100">
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
