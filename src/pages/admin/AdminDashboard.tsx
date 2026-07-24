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
        const localApps = localStorage.getItem('viktor_labs_appointments');
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

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Guten Morgen';
    if (hour < 18) return 'Guten Tag';
    return 'Guten Abend';
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-50 mb-2">{greeting()}, Admin</h1>
          <p className="text-slate-500 text-xs md:text-sm">Hier ist die Übersicht über Ihre digitale Infrastruktur.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex-1 md:flex-none h-10 md:h-12 px-4 md:px-6 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-slate-50 hover:bg-white/10 transition-all flex items-center justify-center gap-2">
            <Clock size={14} />
            Historie
          </button>
          <button className="flex-1 md:flex-none h-10 md:h-12 px-4 md:px-6 rounded-xl bg-cyan-500 text-dark-950 text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)] flex items-center justify-center gap-2">
            <Plus size={14} />
            Neues Projekt
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-5 md:p-6 rounded-2xl md:rounded-3xl border-white/5 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <stat.icon size={48} />
            </div>
            <div className="relative z-10 space-y-2 md:space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-slate-500">{stat.label}</span>
                <span className={`text-[8px] md:text-[10px] font-bold px-2 py-0.5 md:py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-green-500/10 text-green-500' : 'bg-white/5 text-slate-400'}`}>
                  {stat.trend}
                </span>
              </div>
              <div className="text-2xl md:text-3xl font-display font-bold text-slate-50">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <div className="glass-card rounded-3xl md:rounded-[2.5rem] border-white/5 overflow-hidden">
            <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-base md:text-lg font-bold text-slate-50">Aktuelle Leads</h3>
              <Link to="/admin/leads" className="text-[10px] uppercase tracking-widest font-bold text-cyan-500 hover:underline">Alle ansehen</Link>
            </div>
            <div className="divide-y divide-white/5">
              {leads.length > 0 ? leads.map((lead, i) => (
                <div key={i} className="p-4 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-white/5 transition-colors group gap-4">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 font-bold shrink-0">
                      {lead.full_name?.[0] || 'L'}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-50 group-hover:text-cyan-500 transition-colors truncate">{lead.full_name}</div>
                      <div className="text-xs text-slate-500 truncate">{lead.email} • {lead.services?.name || 'Consultation'}</div>
                    </div>
                  </div>
                  <div className={`self-start sm:self-center text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full ${
                    lead.status === 'pending' || lead.status === 'Neu' ? 'bg-cyan-500 text-dark-950' : 'border border-white/10 text-slate-400'
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
              <h3 className="text-lg font-bold text-slate-50">Wartungsverträge</h3>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
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
                    <div className="text-sm font-bold text-slate-50">{sub.name}</div>
                    <div className="text-xs text-slate-500">{sub.active} aktive Instanzen</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-cyan-500">{sub.revenue}</div>
                    <div className="text-[10px] text-slate-500 uppercase">Pro Monat</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar Stats */}
        <div className="space-y-8">
          <div className="glass-card rounded-[2.5rem] border-white/5 p-8 bg-gradient-to-br from-white/5 to-transparent">
            <h3 className="text-sm uppercase tracking-widest font-bold text-slate-500 mb-6 flex items-center gap-2">
              <Bot size={16} className="text-cyan-500" />
              Chatbot Stats
            </h3>
            <div className="space-y-8">
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-400">Genauigkeit</span>
                  <span className="text-slate-50">94%</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 w-[94%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-400">Automation Rate</span>
                  <span className="text-slate-50">82%</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 w-[82%]" />
                </div>
              </div>
              <div className="pt-4 grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-slate-50">1.2k</div>
                  <div className="text-[8px] uppercase text-slate-500">Chats / Mo.</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-slate-50">45s</div>
                  <div className="text-[8px] uppercase text-slate-500">Avg. Zeit</div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-[2.5rem] border-white/5 p-8">
            <h3 className="text-sm uppercase tracking-widest font-bold text-slate-500 mb-6 flex items-center gap-2">
              <Shield size={16} className="text-cyan-500" />
              Sicherheit
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-xl">
                <CheckCircle2 size={16} className="text-green-500" />
                <span className="text-xs text-green-500 font-bold">2FA Aktiviert</span>
              </div>
              <div className="text-[10px] text-slate-500 leading-relaxed">
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
