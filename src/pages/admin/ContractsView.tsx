import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, query, getDocs, deleteDoc, doc, getDoc, orderBy, where } from 'firebase/firestore';
import { Contract, BusinessSettings } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Plus, 
  Search, 
  FileText, 
  Download, 
  Trash2, 
  ExternalLink,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  User,
  Briefcase,
  Settings as SettingsIcon,
  ChevronRight
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import { formatCurrency } from '@/lib/utils';
import { generateContractPDF } from '@/lib/pdf';

type TabType = 'contracts' | 'requests';

export default function ContractsView() {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('contracts');
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      let allContracts: Contract[] = [];
      let allApps: any[] = [];
      
      try {
        // Fetch Settings
        const settingsDoc = await getDoc(doc(db, 'settings', 'business'));
        if (settingsDoc.exists()) {
          setBusinessSettings(settingsDoc.data() as BusinessSettings);
        }

        // Fetch Contracts
        const qContracts = query(collection(db, 'contracts'), orderBy('created_at', 'desc')); 
        const contractsSnapshot = await getDocs(qContracts);
        allContracts = contractsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Contract));
        
        // Fetch Appointments (Requests)
        const qApps = query(collection(db, 'appointments'), orderBy('created_at', 'desc'));
        const appsSnapshot = await getDocs(qApps);
        allApps = appsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      } catch (err) {
        console.error("Fetch failed", err);
      }

      // Merge Contracts with LocalStorage
      try {
        const local = localStorage.getItem('viktor_labs_contracts');
        if (local) {
          const localContracts = JSON.parse(local) as Contract[];
          const dbIds = new Set(allContracts.map(c => c.id));
          const uniqueLocal = localContracts.filter(c => !dbIds.has(c.id));
          allContracts = [...allContracts, ...uniqueLocal].sort((a, b) => 
            new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
          );
        }
      } catch (e) {}

      setContracts(allContracts);
      localStorage.setItem('viktor_labs_contracts', JSON.stringify(allContracts));
      setAppointments(allApps);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const filteredContracts = contracts.filter(contract => {
    const search = searchTerm.toLowerCase();
    const nr = (contract.contract_number || '').toLowerCase();
    const comp = (contract.customer_company || '').toLowerCase();
    const proj = (contract.project_name || '').toLowerCase();
    
    const matchesSearch = nr.includes(search) || comp.includes(search) || proj.includes(search);
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const filteredAppointments = appointments.filter(app => {
    const search = searchTerm.toLowerCase();
    const name = (app.full_name || '').toLowerCase();
    const email = (app.email || '').toLowerCase();
    const company = (app.company || '').toLowerCase();
    
    return name.includes(search) || email.includes(search) || company.includes(search);
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'signed':
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider"><CheckCircle2 className="w-3 h-3" /> Unterschrieben</span>;
      case 'sent':
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold uppercase tracking-wider"><Clock className="w-3 h-3" /> Gesendet</span>;
      case 'draft':
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-500/10 text-slate-400 text-[10px] font-bold uppercase tracking-wider"><FileText className="w-3 h-3" /> Entwurf</span>;
      case 'cancelled':
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-wider"><AlertCircle className="w-3 h-3" /> Storniert</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-slate-500/10 text-slate-400 text-[10px] font-bold uppercase tracking-wider">{status}</span>;
    }
  };

  const handleDownload = async (contract: Contract) => {
    setIsDownloading(contract.id);
    try {
      await generateContractPDF(contract, businessSettings);
    } catch (err) {
      console.error("Download failed", err);
      alert("Download fehlgeschlagen.");
    } finally {
      setIsDownloading(null);
    }
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const deleteContract = async (id: string) => {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      setTimeout(() => setConfirmDeleteId(null), 3000);
      return;
    }

    console.log("Deleting contract:", id);
    setConfirmDeleteId(null);
    try {
      await deleteDoc(doc(db, 'contracts', id));
      console.log("Firebase delete successful");
      const updated = contracts.filter(c => c.id !== id);
      setContracts(updated);
      localStorage.setItem('viktor_labs_contracts', JSON.stringify(updated));
    } catch (e) {
      console.error("Delete failed", e);
      // Fallback update
      const updated = contracts.filter(c => c.id !== id);
      setContracts(updated);
      localStorage.setItem('viktor_labs_contracts', JSON.stringify(updated));
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-50">Wartungsverträge & Verwaltung</h2>
          <p className="text-slate-400">Verwalten Sie Ihre Projektverträge und Beratungsanfragen.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => navigate('/admin/leads')} variant="outline" className="border-white/10 text-slate-300">
            Alle Leads öffnen
          </Button>
          <Button onClick={() => navigate('/admin/contracts/new')} className="bg-cyan-500 text-dark-950 font-bold">
            <Plus className="w-4 h-4 mr-2" />
            Neuer Vertrag
          </Button>
        </div>
      </div>

      <div className="flex border-b border-white/5">
        <button
          onClick={() => setActiveTab('contracts')}
          className={`px-8 py-4 text-xs font-bold uppercase tracking-widest transition-colors relative ${
            activeTab === 'contracts' ? 'text-cyan-500' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Aktive Verträge
          {activeTab === 'contracts' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-8 py-4 text-xs font-bold uppercase tracking-widest transition-colors relative ${
            activeTab === 'requests' ? 'text-cyan-500' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Beratungsanfragen
          {activeTab === 'requests' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
          )}
        </button>
      </div>

      <Card className="border-white/10 bg-dark-900/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input 
                placeholder={activeTab === 'contracts' ? "Vertragsnummer, Kunde oder Projekt suchen..." : "Name, E-Mail oder Firma suchen..."} 
                className="pl-10"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            {activeTab === 'contracts' && (
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-500" />
                <select 
                  className="bg-dark-950 border border-white/10 rounded-xl py-2 px-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                >
                  <option value="all">Alle Status</option>
                  <option value="draft">Entwurf</option>
                  <option value="sent">Gesendet</option>
                  <option value="signed">Unterschrieben</option>
                  <option value="cancelled">Storniert</option>
                </select>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {activeTab === 'contracts' ? (
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-white/5">
                    <th className="pb-4 text-xs font-bold uppercase tracking-widest text-slate-500 px-4">Vertrag</th>
                    <th className="pb-4 text-xs font-bold uppercase tracking-widest text-slate-500 px-4">Kunde & Projekt</th>
                    <th className="pb-4 text-xs font-bold uppercase tracking-widest text-slate-500 px-4">Datum</th>
                    <th className="pb-4 text-xs font-bold uppercase tracking-widest text-slate-500 px-4">Status</th>
                    <th className="pb-4 text-xs font-bold uppercase tracking-widest text-slate-500 px-4 text-right">Aktionen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="py-20 text-center">
                        <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mx-auto" />
                      </td>
                    </tr>
                  ) : filteredContracts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-20 text-center text-slate-500">
                        Keine Wartungsverträge gefunden.
                      </td>
                    </tr>
                  ) : (
                    filteredContracts.map((contract) => (
                      <tr key={contract.id} className="group hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-mono text-cyan-500 font-bold">{contract.contract_number}</span>
                            <span className="text-xs text-slate-500">{contract.contract_type}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-200">{contract.customer_company}</span>
                            <span className="text-xs text-slate-500">{contract.project_name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-400">
                          {contract.contract_date ? format(parseISO(contract.contract_date), 'dd.MM.yyyy') : '-'}
                        </td>
                        <td className="py-4 px-4">
                          {getStatusBadge(contract.status)}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => navigate(`/admin/contracts/edit/${contract.id}`)}
                              className="text-slate-400 hover:text-cyan-500"
                              title="Bearbeiten"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDownload(contract)}
                              disabled={isDownloading === contract.id}
                              className="text-slate-400 hover:text-emerald-500"
                              title="PDF Herunterladen"
                            >
                              <Download className={`w-4 h-4 ${isDownloading === contract.id ? 'animate-bounce' : ''}`} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => deleteContract(contract.id)}
                              className={`h-8 w-8 p-0 transition-all ${confirmDeleteId === contract.id ? 'text-white bg-rose-500 animate-pulse w-auto px-2' : 'text-slate-400 hover:text-red-500'}`}
                              title="Löschen"
                            >
                              {confirmDeleteId === contract.id ? <span className="text-[10px] font-bold">Sicher?</span> : <Trash2 className="w-4 h-4" />}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-white/5">
                    <th className="pb-4 text-xs font-bold uppercase tracking-widest text-slate-500 px-4">Anfrage</th>
                    <th className="pb-4 text-xs font-bold uppercase tracking-widest text-slate-500 px-4">Gewählte Leistungen</th>
                    <th className="pb-4 text-xs font-bold uppercase tracking-widest text-slate-500 px-4">Termin</th>
                    <th className="pb-4 text-xs font-bold uppercase tracking-widest text-slate-500 px-4 text-right">Aktion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="py-20 text-center">
                        <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mx-auto" />
                      </td>
                    </tr>
                  ) : filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-20 text-center text-slate-500">
                        Keine Anfragen gefunden.
                      </td>
                    </tr>
                  ) : (
                    filteredAppointments.map((app) => (
                      <tr key={app.id} className="group hover:bg-white/5 transition-colors">
                        <td className="py-6 px-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-bold text-slate-50 flex items-center gap-2">
                              <User className="w-3 h-3 text-cyan-500" />
                              {app.full_name}
                            </span>
                            <span className="text-xs text-slate-500">{app.email}</span>
                            {app.company && (
                              <span className="text-[10px] text-cyan-500/70 font-mono flex items-center gap-1 mt-1">
                                <Briefcase className="w-2.5 h-2.5" />
                                {app.company}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-6 px-4">
                          <div className="flex flex-wrap gap-1.5 max-w-md">
                            {app.services_list ? app.services_list.map((s: any, idx: number) => (
                              <span key={idx} className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[10px] border border-cyan-500/20 whitespace-nowrap">
                                {s.description}
                              </span>
                            )) : (
                              <span className="text-xs text-slate-600 italic">Keine Details</span>
                            )}
                          </div>
                        </td>
                        <td className="py-6 px-4">
                          <div className="flex flex-col">
                            <span className="text-xs text-slate-200 flex items-center gap-2">
                              <Calendar className="w-3 h-3 text-cyan-500" />
                              {app.start_time ? format(parseISO(app.start_time), 'dd. MMMM yyyy', { locale: de }) : '-'}
                            </span>
                            <span className="text-[10px] text-slate-500 mt-1 pl-5">
                              {app.start_time ? format(parseISO(app.start_time), 'HH:mm') : '-'} Uhr
                            </span>
                          </div>
                        </td>
                        <td className="py-6 px-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => navigate('/admin/leads')}
                              className="text-slate-500 hover:text-slate-300 text-[10px] uppercase tracking-widest font-bold"
                            >
                              Details
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={() => navigate(`/admin/contracts/new?leadId=${app.id}`)}
                              className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500 hover:text-dark-950 text-[10px] uppercase tracking-widest font-bold transition-all"
                            >
                              <Plus className="w-3.5 h-3.5 mr-2" />
                              Vertrag erstellen
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
