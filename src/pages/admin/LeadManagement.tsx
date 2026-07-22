import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  Calendar, 
  MessageSquare,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  Bot,
  FileText as FileTextIcon,
  Globe as GlobeIcon
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

const FileText = ({ size, className }: any) => <FileTextIcon size={size} className={className} />;
const Globe = ({ size, className }: any) => <GlobeIcon size={size} className={className} />;

export default function LeadManagement() {
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [filter, setFilter] = useState('Alle');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      setIsLoading(true);
      let allLeads: any[] = [];
      
      try {
        const { data: dbLeads } = await supabase
          .from('appointments')
          .select('*')
          .order('created_at', { ascending: false });
        if (dbLeads) allLeads = [...dbLeads];
      } catch (e) {
        console.warn("Supabase fetch failed", e);
      }

      try {
        const localApps = localStorage.getItem('zetta_appointments');
        if (localApps) {
          const apps = JSON.parse(localApps);
          allLeads = [...allLeads, ...apps].sort((a, b) => 
            new Date(b.created_at || b.start_time).getTime() - new Date(a.created_at || a.start_time).getTime()
          );
        }
      } catch (e) {
        console.warn("LocalStorage fetch failed", e);
      }

      // Filter for "Real Human" bookings
      // We filter out common test strings and incomplete entries
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

      setLeads(humanLeads);
      setIsLoading(false);
    };

    fetchLeads();
  }, []);

  const filteredLeads = leads.filter(lead => {
    const matchesFilter = filter === 'Alle' || lead.status === filter;
    const matchesSearch = 
      lead.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Lead Management</h1>
          <p className="text-gray-500 text-sm">Verwalten Sie Ihre eingehenden Anfragen und qualifizieren Sie Leads.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 bg-white/5 border border-white/10 rounded-xl pl-12 pr-6 text-white text-sm focus:border-neon-500/50 transition-all"
            />
          </div>
          <button className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Leads Table/List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2">
            {['Alle', 'pending', 'confirmed', 'cancelled'].map((cat) => (
              <button 
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold border transition-all whitespace-nowrap ${
                  filter === cat ? 'bg-neon-500 text-dark-950 border-neon-500' : 'bg-transparent text-gray-500 border-white/10 hover:border-white/20'
                }`}
              >
                {cat === 'pending' ? 'Neu' : cat === 'confirmed' ? 'Bestätigt' : cat === 'cancelled' ? 'Abgesagt' : cat}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {isLoading ? (
              <div className="p-12 text-center text-gray-500">Lädt...</div>
            ) : filteredLeads.length > 0 ? filteredLeads.map((lead) => (
              <motion.div 
                layout
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                className={`glass-card p-6 rounded-3xl border cursor-pointer transition-all ${
                  selectedLead?.id === lead.id ? 'bg-neon-500/10 border-neon-500/50' : 'border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
                      <Users size={20} />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-white">{lead.full_name}</div>
                      <div className="text-xs text-gray-500">{lead.email} • {new Date(lead.created_at || lead.start_time).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-white mb-1">{lead.service_id ? 'Pro' : 'Custom'}</div>
                    <div className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full ${
                      lead.status === 'pending' || lead.status === 'Neu' ? 'bg-neon-500 text-dark-950' : 'bg-white/5 text-gray-400'
                    }`}>
                      {lead.status}
                    </div>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="p-12 text-center text-gray-500 uppercase tracking-widest font-bold text-xs">
                Keine Leads gefunden
              </div>
            )}
          </div>
        </div>

        {/* Lead Details Sidebar */}
        <div className="lg:col-span-5">
          <AnimatePresence mode="wait">
            {selectedLead ? (
              <motion.div
                key={selectedLead.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card rounded-[3rem] border-white/5 overflow-hidden sticky top-32"
              >
                <div className="p-8 border-b border-white/5 bg-gradient-to-br from-white/5 to-transparent">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-20 h-20 rounded-[2rem] bg-neon-500 flex items-center justify-center text-dark-950 text-3xl font-display font-bold shadow-xl">
                      {selectedLead.full_name?.[0]}
                    </div>
                    <button className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-1">{selectedLead.full_name}</h3>
                  <p className="text-neon-500 text-sm font-bold">{selectedLead.services?.name || 'Standard Beratung'}</p>
                </div>

                <div className="p-8 space-y-10">
                  <div className="space-y-6">
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Kontakt</h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <Mail size={16} className="text-neon-500" />
                        {selectedLead.email}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <Phone size={16} className="text-neon-500" />
                        {selectedLead.phone || 'Nicht angegeben'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Notizen</h4>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-xs text-gray-400 leading-relaxed">
                      {selectedLead.notes || 'Keine Notizen vorhanden.'}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Timeline</h4>
                    </div>
                    <div className="space-y-6 pl-4 border-l border-white/10">
                      <div className="relative">
                        <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-neon-500" />
                        <div className="text-[10px] text-gray-500 mb-1">{new Date(selectedLead.created_at || selectedLead.start_time).toLocaleDateString()}</div>
                        <div className="text-xs text-white font-medium flex items-center gap-2">
                           <Bot size={12} className="text-neon-500" />
                           Lead über die Website generiert
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
                    <a 
                      href={`mailto:${selectedLead.email}`}
                      className="h-14 rounded-2xl bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest font-bold text-white hover:bg-white/10 transition-all flex items-center justify-center"
                    >
                      Nachricht senden
                    </a>
                    <button className="h-14 rounded-2xl bg-neon-500 text-dark-950 text-[10px] uppercase tracking-widest font-bold hover:scale-105 transition-all shadow-lg">
                      Status ändern
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-[600px] glass-card rounded-[3rem] border-white/5 flex flex-col items-center justify-center text-center p-10 opacity-40">
                <Users size={48} className="text-gray-500 mb-6" />
                <h3 className="text-xl font-bold text-white mb-2">Kein Lead ausgewählt</h3>
                <p className="text-gray-500 text-sm">Wählen Sie einen Lead aus der Liste aus, um Details anzuzeigen.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
