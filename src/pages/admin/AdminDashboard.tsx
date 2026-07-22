import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  Briefcase, 
  MessageSquare, 
  FileText, 
  BarChart3, 
  Database, 
  Bot, 
  Zap, 
  Shield, 
  Eye,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [leads, setLeads] = useState<any[]>([]);
  const [stats, setStats] = useState([
    { label: 'Umsatz heute', value: '0 €', trend: 'Stabil', icon: TrendingUp },
    { label: 'Neue Leads', value: '0', trend: 'Stabil', icon: Users },
    { label: 'Offene Projekte', value: '0', trend: 'Stabil', icon: Briefcase },
    { label: 'Conversion Rate', value: '0%', trend: 'Stabil', icon: BarChart3 },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      let allLeads: any[] = [];
      
      // Try Supabase
      try {
        const { data: dbLeads } = await supabase
          .from('appointments')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
        if (dbLeads) allLeads = [...dbLeads];
      } catch (e) {
        console.warn("Supabase fetch failed", e);
      }

      // Try LocalStorage
      try {
        const localApps = localStorage.getItem('zetta_appointments');
        if (localApps) {
          const apps = JSON.parse(localApps);
          allLeads = [...allLeads, ...apps].sort((a, b) => 
            new Date(b.created_at || b.start_time).getTime() - new Date(a.created_at || a.start_time).getTime()
          ).slice(0, 5);
        }
      } catch (e) {
        console.warn("LocalStorage fetch failed", e);
      }

      // Filter for "Real Human" bookings
      const humanLeads = allLeads.filter(lead => {
        const email = lead.email?.toLowerCase() || '';
        const isTest = email.includes('test@') || 
                      email === 'test' || 
                      email.includes('example.com') ||
                      !email.includes('@');
        return !isTest;
      }).sort((a, b) => 
        new Date(b.created_at || b.start_time).getTime() - new Date(a.created_at || a.start_time).getTime()
      );

      setLeads(humanLeads.slice(0, 5));
      
      // Mock stats update based on leads count
      setStats([
        { label: 'Umsatz heute', value: `${humanLeads.length * 450} €`, trend: `+${humanLeads.length * 5}%`, icon: TrendingUp },
        { label: 'Neue Leads', value: String(humanLeads.length), trend: `+${humanLeads.length}`, icon: Users },
        { label: 'Offene Projekte', value: '8', trend: 'Stabil', icon: Briefcase },
        { label: 'Conversion Rate', value: '4.2%', trend: '+0.5%', icon: BarChart3 },
      ]);
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Guten Morgen, Admin</h1>
          <p className="text-gray-500 text-sm">Hier ist die Übersicht über Ihre digitale Infrastruktur.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-12 px-6 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all flex items-center gap-2">
            <Clock size={16} />
            Historie
          </button>
          <button className="h-12 px-6 rounded-xl bg-neon-500 text-dark-950 text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_rgba(197,160,89,0.2)] flex items-center gap-2">
            <Plus size={16} />
            Neues Projekt
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 rounded-3xl border-white/5 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <stat.icon size={64} />
            </div>
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">{stat.label}</span>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-green-500/10 text-green-500' : 'bg-white/5 text-gray-400'}`}>
                  {stat.trend}
                </span>
              </div>
              <div className="text-3xl font-display font-bold text-white">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Aktuelle Leads</h3>
              <Link to="/admin/leads" className="text-[10px] uppercase tracking-widest font-bold text-neon-500 hover:underline">Alle ansehen</Link>
            </div>
            <div className="divide-y divide-white/5">
              {leads.length > 0 ? leads.map((lead, i) => (
                <div key={i} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 font-bold">
                      {lead.full_name?.[0] || 'L'}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-neon-500 transition-colors">{lead.full_name}</div>
                      <div className="text-xs text-gray-500">{lead.email} • {lead.services?.name || 'Consultation'}</div>
                    </div>
                  </div>
                  <div className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full ${
                    lead.status === 'pending' || lead.status === 'Neu' ? 'bg-neon-500 text-dark-950' : 'border border-white/10 text-gray-400'
                  }`}>
                    {lead.status}
                  </div>
                </div>
              )) : (
                <div className="p-12 text-center text-gray-500 text-sm uppercase tracking-widest font-bold">
                  Keine Leads vorhanden
                </div>
              )}
            </div>
          </div>

          <div className="glass-card rounded-[2.5rem] border-white/5 p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-white">Wartungsverträge</h3>
              <div className="w-10 h-10 rounded-xl bg-neon-500/10 flex items-center justify-center text-neon-500">
                <CheckCircle2 size={20} />
              </div>
            </div>
            <div className="space-y-6">
              {[
                { name: 'Standard Wartung', active: 12, revenue: '708 €' },
                { name: 'KI Automation Plus', active: 5, revenue: '495 €' },
              ].map((sub, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                  <div>
                    <div className="text-sm font-bold text-white">{sub.name}</div>
                    <div className="text-xs text-gray-500">{sub.active} aktive Instanzen</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-neon-500">{sub.revenue}</div>
                    <div className="text-[10px] text-gray-500 uppercase">Pro Monat</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar Stats */}
        <div className="space-y-8">
          <div className="glass-card rounded-[2.5rem] border-white/5 p-8 bg-gradient-to-br from-white/5 to-transparent">
            <h3 className="text-sm uppercase tracking-widest font-bold text-gray-500 mb-6 flex items-center gap-2">
              <Bot size={16} className="text-neon-500" />
              Chatbot Stats
            </h3>
            <div className="space-y-8">
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-gray-400">Genauigkeit</span>
                  <span className="text-white">94%</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-neon-500 w-[94%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-gray-400">Automation Rate</span>
                  <span className="text-white">82%</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-neon-500 w-[82%]" />
                </div>
              </div>
              <div className="pt-4 grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-white">1.2k</div>
                  <div className="text-[8px] uppercase text-gray-500">Chats / Mo.</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">45s</div>
                  <div className="text-[8px] uppercase text-gray-500">Avg. Zeit</div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-[2.5rem] border-white/5 p-8">
            <h3 className="text-sm uppercase tracking-widest font-bold text-gray-500 mb-6 flex items-center gap-2">
              <Shield size={16} className="text-neon-500" />
              Sicherheit
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-xl">
                <CheckCircle2 size={16} className="text-green-500" />
                <span className="text-xs text-green-500 font-bold">2FA Aktiviert</span>
              </div>
              <div className="text-[10px] text-gray-500 leading-relaxed">
                Letzter Login: Heute, 08:42 Uhr aus Berlin (DE). 
                Keine ungewöhnlichen Aktivitäten erkannt.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
