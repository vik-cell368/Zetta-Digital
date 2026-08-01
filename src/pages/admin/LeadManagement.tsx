import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
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
  Globe as GlobeIcon,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  Copy,
  UserPlus,
  Calculator
} from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, query, getDocs, orderBy, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { cn } from '@/lib/utils';

const FileText = ({ size, className }: any) => <FileTextIcon size={size} className={className} />;
const Globe = ({ size, className }: any) => <GlobeIcon size={size} className={className} />;

export default function LeadManagement() {
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [filter, setFilter] = useState('Alle');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Status edit menu
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Notes editing
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState('');

  // New Lead Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newLead, setNewLead] = useState({
    full_name: '',
    email: '',
    phone: '',
    company: '',
    street: '',
    zip: '',
    city: '',
    country: 'Deutschland',
    notes: '',
    status: 'pending',
    services_list: [] as any[]
  });

  const [editLeadData, setEditLeadData] = useState<any>(null);

  // Toast / Feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchLeads = async () => {
    setIsLoading(true);
    let allLeads: any[] = [];
    
    try {
      const q = query(collection(db, 'appointments'));
      const querySnapshot = await getDocs(q);
      const dbLeads = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (dbLeads) allLeads = [...dbLeads];
    } catch (e) {
      console.warn("Firebase fetch failed", e);
      handleFirestoreError(e, OperationType.LIST, 'appointments');
    }

    try {
      const localApps = localStorage.getItem('viktor_labs_appointments');
      if (localApps) {
        const apps = JSON.parse(localApps);
        // Merge without duplicating IDs
        const dbIds = new Set(allLeads.map(l => l.id));
        const uniqueLocal = apps.filter((a: any) => !dbIds.has(a.id));
        allLeads = [...allLeads, ...uniqueLocal].sort((a, b) => 
          new Date(b.created_at || b.start_time || Date.now()).getTime() - new Date(a.created_at || a.start_time || Date.now()).getTime()
        );
      }
    } catch (e) {
      console.warn("LocalStorage fetch failed", e);
    }

    // Filter out obvious test noise if wanted, but keep real items
    const humanLeads = allLeads.filter(lead => {
      const email = lead.email?.toLowerCase() || '';
      // Only filter out very obvious placeholders, keep test@... if it looks like a real test
      const isTest = email === 'test' || 
                    email === 'example@example.com' ||
                    (!email.includes('@') && email.length < 3);
      return !isTest;
    }).sort((a, b) => 
      new Date(b.created_at || b.start_time || Date.now()).getTime() - new Date(a.created_at || a.start_time || Date.now()).getTime()
    );

    setLeads(humanLeads);
    setIsLoading(false);

    // Sync selected lead if editing
    if (selectedLead) {
      const updatedSel = humanLeads.find(l => l.id === selectedLead.id);
      if (updatedSel) setSelectedLead(updatedSel);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Update Status
  const handleUpdateStatus = async (leadId: string, newStatus: string) => {
    setShowStatusMenu(false);

    // Update in Firebase
    try {
      const leadRef = doc(db, 'appointments', leadId);
      await updateDoc(leadRef, { status: newStatus });
    } catch (err) {
      console.warn("Firebase update failed", err);
      handleFirestoreError(err, OperationType.UPDATE, `appointments/${leadId}`);
    }

    // Update in LocalStorage
    try {
      const localApps = localStorage.getItem('viktor_labs_appointments');
      if (localApps) {
        const apps = JSON.parse(localApps);
        const updated = apps.map((a: any) => a.id === leadId ? { ...a, status: newStatus } : a);
        localStorage.setItem('viktor_labs_appointments', JSON.stringify(updated));
      }
    } catch (err) {
      console.warn("LocalStorage update error", err);
    }

    // Update State
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(prev => ({ ...prev, status: newStatus }));
    }

    showToast(`Status auf "${newStatus === 'pending' ? 'Neu' : newStatus === 'confirmed' ? 'Bestätigt' : 'Abgesagt'}" geändert`);
  };

  // Save Notes
  const handleSaveNotes = async () => {
    if (!selectedLead) return;

    try {
      const leadRef = doc(db, 'appointments', selectedLead.id);
      await updateDoc(leadRef, { notes: editedNotes });
    } catch (err) {
      console.warn("Firebase notes update failed", err);
      handleFirestoreError(err, OperationType.UPDATE, `appointments/${selectedLead.id}`);
    }

    try {
      const localApps = localStorage.getItem('viktor_labs_appointments');
      if (localApps) {
        const apps = JSON.parse(localApps);
        const updated = apps.map((a: any) => a.id === selectedLead.id ? { ...a, notes: editedNotes } : a);
        localStorage.setItem('viktor_labs_appointments', JSON.stringify(updated));
      }
    } catch (err) {
      console.warn("LocalStorage notes update error", err);
    }

    setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, notes: editedNotes } : l));
    setSelectedLead(prev => ({ ...prev, notes: editedNotes }));
    setIsEditingNotes(false);
    showToast("Notizen gespeichert");
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Delete Lead
  const handleDeleteLead = async (leadId: string) => {
    if (confirmDeleteId !== leadId) {
      setConfirmDeleteId(leadId);
      setTimeout(() => setConfirmDeleteId(null), 3000);
      return;
    }

    console.log("Deleting lead:", leadId);
    setConfirmDeleteId(null);
    setShowMoreMenu(false);

    try {
      const leadRef = doc(db, 'appointments', leadId);
      await deleteDoc(leadRef);
      console.log("Firebase delete successful");
    } catch (err) {
      console.error("Firebase delete failed", err);
      handleFirestoreError(err, OperationType.DELETE, `appointments/${leadId}`);
    }

    try {
      const localApps = localStorage.getItem('viktor_labs_appointments');
      if (localApps) {
        const apps = JSON.parse(localApps);
        const updated = apps.filter((a: any) => a.id !== leadId);
        localStorage.setItem('viktor_labs_appointments', JSON.stringify(updated));
        console.log("LocalStorage delete successful");
      }
    } catch (err) {
      console.warn("LocalStorage delete error", err);
    }

    setLeads(prev => prev.filter(l => l.id !== leadId));
    if (selectedLead?.id === leadId) {
      setSelectedLead(null);
    }
    showToast("Lead wurde gelöscht");
  };

  // Create Manual Lead
  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.full_name || !newLead.email) {
      alert("Bitte füllen Sie Name und E-Mail aus.");
      return;
    }

    const createdLead = {
      id: 'lead_' + Date.now(),
      full_name: newLead.full_name,
      email: newLead.email,
      phone: newLead.phone,
      company: newLead.company,
      street: newLead.street,
      zip: newLead.zip,
      city: newLead.city,
      country: newLead.country,
      notes: newLead.notes,
      status: newLead.status,
      services_list: newLead.services_list,
      created_at: new Date().toISOString(),
      start_time: new Date().toISOString(),
      end_time: new Date(Date.now() + 30 * 60000).toISOString()
    };

    // Try Firebase insert
    try {
      await addDoc(collection(db, 'appointments'), createdLead);
    } catch (err) {
      console.warn("Firebase insert lead failed", err);
      handleFirestoreError(err, OperationType.CREATE, 'appointments');
    }

    // LocalStorage insert
    try {
      const localApps = localStorage.getItem('viktor_labs_appointments');
      const apps = localApps ? JSON.parse(localApps) : [];
      localStorage.setItem('viktor_labs_appointments', JSON.stringify([createdLead, ...apps]));
    } catch (err) {
      console.warn("LocalStorage insert lead failed", err);
    }

    setLeads(prev => [createdLead, ...prev]);
    setSelectedLead(createdLead);
    setShowAddModal(false);
    setNewLead({ 
      full_name: '', 
      email: '', 
      phone: '', 
      company: '', 
      street: '', 
      zip: '', 
      city: '', 
      country: 'Deutschland', 
      notes: '', 
      status: 'pending',
      services_list: []
    });
    showToast("Neuer Lead erfolgreich angelegt");
  };

  // Update Lead Details
  const handleUpdateLeadDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editLeadData) return;

    try {
      const leadRef = doc(db, 'appointments', editLeadData.id);
      await updateDoc(leadRef, editLeadData);
    } catch (err) {
      console.warn("Firebase update lead failed", err);
    }

    try {
      const localApps = localStorage.getItem('viktor_labs_appointments');
      if (localApps) {
        const apps = JSON.parse(localApps);
        const updated = apps.map((a: any) => a.id === editLeadData.id ? editLeadData : a);
        localStorage.setItem('viktor_labs_appointments', JSON.stringify(updated));
      }
    } catch (err) {
      console.warn("LocalStorage update lead failed", err);
    }

    setLeads(prev => prev.map(l => l.id === editLeadData.id ? editLeadData : l));
    setSelectedLead(editLeadData);
    setShowEditModal(false);
    showToast("Lead-Daten aktualisiert");
  };

  // Add Service to Lead
  const addServiceToLead = async (title: string, price: number) => {
    if (!selectedLead) return;

    const newService = {
      id: crypto.randomUUID(),
      description: title,
      price: price
    };

    const updatedServices = [...(selectedLead.services_list || []), newService];
    const updatedLead = { ...selectedLead, services_list: updatedServices };

    try {
      const leadRef = doc(db, 'appointments', selectedLead.id);
      await updateDoc(leadRef, { services_list: updatedServices });
    } catch (err) {}

    try {
      const localApps = localStorage.getItem('viktor_labs_appointments');
      if (localApps) {
        const apps = JSON.parse(localApps);
        const updated = apps.map((a: any) => a.id === selectedLead.id ? updatedLead : a);
        localStorage.setItem('viktor_labs_appointments', JSON.stringify(updated));
      }
    } catch (err) {}

    setLeads(prev => prev.map(l => l.id === selectedLead.id ? updatedLead : l));
    setSelectedLead(updatedLead);
    showToast("Dienstleistung hinzugefügt");
  };

  const removeServiceFromLead = async (serviceId: string) => {
    if (!selectedLead) return;

    const updatedServices = (selectedLead.services_list || []).filter((s: any) => s.id !== serviceId);
    const updatedLead = { ...selectedLead, services_list: updatedServices };

    try {
      const leadRef = doc(db, 'appointments', selectedLead.id);
      await updateDoc(leadRef, { services_list: updatedServices });
    } catch (err) {}

    try {
      const localApps = localStorage.getItem('viktor_labs_appointments');
      if (localApps) {
        const apps = JSON.parse(localApps);
        const updated = apps.map((a: any) => a.id === selectedLead.id ? updatedLead : a);
        localStorage.setItem('viktor_labs_appointments', JSON.stringify(updated));
      }
    } catch (err) {}

    setLeads(prev => prev.map(l => l.id === selectedLead.id ? updatedLead : l));
    setSelectedLead(updatedLead);
    showToast("Dienstleistung entfernt");
  };

  // Copy to Clipboard
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} kopiert!`);
  };

  const filteredLeads = leads.filter(lead => {
    const matchesFilter = filter === 'Alle' || lead.status === filter;
    const matchesSearch = 
      lead.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-10 relative">
      {/* Toast notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-8 z-50 bg-cyan-500 text-dark-950 font-bold px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs uppercase tracking-widest"
          >
            <CheckCircle2 size={18} />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-50 mb-2">Lead Management</h1>
          <p className="text-slate-500 text-xs md:text-sm">Verwalten Sie Ihre eingehenden Anfragen und qualifizieren Sie Leads.</p>
        </div>
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-500 w-3 h-3 md:w-4 md:h-4" />
            <input 
              type="text" 
              placeholder="Name, E-Mail, Firma suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 h-10 md:h-12 bg-white/5 border border-white/10 rounded-xl pl-10 md:pl-12 pr-4 md:pr-6 text-white text-xs md:text-sm focus:border-cyan-500/50 transition-all"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <button 
            onClick={() => setSearchTerm('')}
            title="Filter zurücksetzen"
            className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-cyan-500/50 transition-all shrink-0"
          >
            <Filter size={16} />
          </button>

          <button 
            onClick={() => setShowAddModal(true)}
            className="h-10 md:h-12 px-4 md:px-6 rounded-xl bg-cyan-500 text-dark-950 font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-cyan-400 transition-all active:scale-95 shadow-lg shadow-cyan-500/20 shrink-0"
          >
            <Plus size={16} />
            <span>Neuer Lead</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Leads Table/List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2 mb-4 md:mb-6 overflow-x-auto pb-2 scrollbar-hide">
            {['Alle', 'pending', 'confirmed', 'cancelled'].map((cat) => (
              <button 
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 md:px-6 py-1.5 md:py-2 rounded-full text-[8px] md:text-[10px] uppercase tracking-widest font-bold border transition-all whitespace-nowrap ${
                  filter === cat ? 'bg-cyan-500 text-dark-950 border-cyan-500 shadow-md shadow-cyan-500/20' : 'bg-transparent text-slate-500 border-white/10 hover:border-white/20 hover:text-slate-300'
                }`}
              >
                {cat === 'pending' ? 'Neu / Ausstehend' : cat === 'confirmed' ? 'Bestätigt' : cat === 'cancelled' ? 'Abgesagt' : 'Alle Leads'}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {isLoading ? (
              <div className="p-12 text-center text-gray-500">Lädt Leads...</div>
            ) : filteredLeads.length > 0 ? filteredLeads.map((lead) => (
              <motion.div 
                layout
                key={lead.id}
                onClick={() => {
                  setSelectedLead(lead);
                  setEditedNotes(lead.notes || '');
                  setIsEditingNotes(false);
                  setShowStatusMenu(false);
                  setShowMoreMenu(false);
                }}
                className={`glass-card p-4 md:p-6 rounded-2xl md:rounded-3xl border cursor-pointer transition-all ${
                  selectedLead?.id === lead.id ? 'bg-cyan-500/10 border-cyan-500/50 shadow-lg shadow-cyan-500/5' : 'border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 md:gap-4 min-w-0">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 shrink-0">
                      <Users size={16} className="md:w-5 md:h-5 text-cyan-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm md:text-lg font-bold text-slate-50 truncate flex items-center gap-2">
                        {lead.full_name}
                        {lead.company && <span className="text-xs font-normal text-slate-400">({lead.company})</span>}
                      </div>
                      <div className="text-[10px] md:text-xs text-slate-500 truncate">
                        {lead.email} • {new Date(lead.created_at || lead.start_time || Date.now()).toLocaleDateString('de-DE')}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[10px] md:text-sm font-bold text-slate-50 mb-1">{lead.service_id ? 'Pro' : 'Beratung'}</div>
                    <span className={`inline-block text-[8px] md:text-[10px] uppercase tracking-widest font-bold px-2.5 md:px-3 py-1 rounded-full ${
                      lead.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      lead.status === 'cancelled' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                      'bg-cyan-500 text-dark-950 font-black'
                    }`}>
                      {lead.status === 'confirmed' ? 'Bestätigt' : lead.status === 'cancelled' ? 'Abgesagt' : 'Neu'}
                    </span>
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
                className="glass-card rounded-[2.5rem] md:rounded-[3rem] border-white/10 overflow-hidden sticky top-28 shadow-2xl"
              >
                {/* Details Header */}
                <div className="p-6 md:p-8 border-b border-white/5 bg-gradient-to-br from-white/5 to-transparent relative">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] md:rounded-[2rem] bg-cyan-500 flex items-center justify-center text-dark-950 text-2xl md:text-3xl font-display font-bold shadow-xl shadow-cyan-500/20">
                      {selectedLead.full_name?.[0]?.toUpperCase() || 'L'}
                    </div>

                    <div className="flex items-center gap-2 relative">
                      <button 
                        onClick={() => {
                          setEditLeadData({ ...selectedLead });
                          setShowEditModal(true);
                          setShowMoreMenu(false);
                        }}
                        className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-slate-50 hover:bg-white/10 transition-all"
                        title="Lead bearbeiten"
                      >
                        <Edit3 size={18} />
                      </button>

                      <button 
                        onClick={() => setShowMoreMenu(!showMoreMenu)}
                        className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-slate-50 hover:bg-white/10 transition-all"
                        title="Mehr Optionen"
                      >
                        <MoreVertical size={18} />
                      </button>

                      <button 
                        onClick={() => setSelectedLead(null)}
                        className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-slate-50 hover:bg-white/10 transition-all lg:hidden"
                        title="Schließen"
                      >
                        <X size={18} />
                      </button>

                      {/* Dropdown Menu for More Options */}
                      {showMoreMenu && (
                        <div className="absolute right-0 top-12 w-48 bg-dark-900 border border-white/10 rounded-2xl p-2 shadow-2xl z-30">
                          <button
                            onClick={() => handleDeleteLead(selectedLead.id)}
                            className="w-full text-left px-4 py-2.5 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 font-bold transition-all"
                          >
                            <Trash2 size={14} />
                            Lead Löschen
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="text-xl md:text-2xl font-display font-bold text-slate-50 mb-1">{selectedLead.full_name}</h3>
                  <p className="text-cyan-400 text-xs md:text-sm font-bold">
                    {selectedLead.services?.name || selectedLead.service_id || 'Standard Digitale Beratung'}
                  </p>
                </div>

                <div className="p-6 md:p-8 space-y-8">
                  {/* Status Badge & Selector */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Kunde / Firma</h4>
                      <button 
                        onClick={() => {
                          setEditLeadData({ ...selectedLead });
                          setShowEditModal(true);
                        }}
                        className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider hover:underline"
                      >
                        Bearbeiten
                      </button>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
                      <div className="text-sm font-bold text-white">{selectedLead.full_name}</div>
                      {selectedLead.company && <div className="text-xs text-slate-400">{selectedLead.company}</div>}
                      {(selectedLead.street || selectedLead.city) && (
                        <div className="text-[10px] text-slate-500 pt-1">
                          {selectedLead.street && <div>{selectedLead.street}</div>}
                          {selectedLead.zip || selectedLead.city ? (
                            <div>{selectedLead.zip} {selectedLead.city}</div>
                          ) : null}
                          {selectedLead.country && <div>{selectedLead.country}</div>}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Status</h4>
                      <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full ${
                        selectedLead.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        selectedLead.status === 'cancelled' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      }`}>
                        {selectedLead.status === 'confirmed' ? 'Bestätigt' : selectedLead.status === 'cancelled' ? 'Abgesagt' : 'Ausstehend (Neu)'}
                      </span>
                    </div>

                    {/* Quick Status Switches */}
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <button
                        onClick={() => handleUpdateStatus(selectedLead.id, 'pending')}
                        className={`py-2 px-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
                          selectedLead.status === 'pending'
                            ? 'bg-cyan-500 text-dark-950 border-cyan-500 shadow-md shadow-cyan-500/20'
                            : 'bg-white/5 text-slate-400 border-white/5 hover:border-white/10'
                        }`}
                      >
                        Neu
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(selectedLead.id, 'confirmed')}
                        className={`py-2 px-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
                          selectedLead.status === 'confirmed'
                            ? 'bg-emerald-500 text-dark-950 border-emerald-500 shadow-md shadow-emerald-500/20'
                            : 'bg-white/5 text-slate-400 border-white/5 hover:border-white/10'
                        }`}
                      >
                        Bestätigt
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(selectedLead.id, 'cancelled')}
                        className={`py-2 px-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
                          selectedLead.status === 'cancelled'
                            ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/20'
                            : 'bg-white/5 text-slate-400 border-white/5 hover:border-white/10'
                        }`}
                      >
                        Abgesagt
                      </button>
                    </div>
                  </div>

                  {/* Services List */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Dienstleistungen</h4>
                      <button 
                        onClick={() => {
                          const title = prompt("Dienstleistung Bezeichnung:");
                          if (title) {
                            const priceStr = prompt("Preis in €:", "0");
                            const price = parseFloat(priceStr || "0");
                            addServiceToLead(title, isNaN(price) ? 0 : price);
                          }
                        }}
                        className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider hover:underline flex items-center gap-1"
                      >
                        <Plus size={12} />
                        Hinzufügen
                      </button>
                    </div>
                    <div className="space-y-2">
                      {selectedLead.services_list?.length > 0 ? (
                        selectedLead.services_list.map((s: any) => (
                          <div key={s.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                            <div className="flex flex-col">
                              <span className="text-xs font-medium text-slate-200">{s.description}</span>
                              <span className="text-[10px] text-cyan-500 font-bold">{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(s.price)}</span>
                            </div>
                            <button 
                              onClick={() => removeServiceFromLead(s.id)}
                              className="text-slate-600 hover:text-rose-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="text-[10px] text-slate-600 italic px-1">Keine spezifischen Leistungen hinterlegt.</div>
                      )}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Kontaktinformationen</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5 text-xs text-slate-300">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <Mail size={16} className="text-cyan-400 shrink-0" />
                          <span className="truncate">{selectedLead.email}</span>
                        </div>
                        <button 
                          onClick={() => copyToClipboard(selectedLead.email, 'E-Mail')}
                          className="p-1.5 text-slate-400 hover:text-cyan-400 transition-colors shrink-0"
                          title="E-Mail kopieren"
                        >
                          <Copy size={14} />
                        </button>
                      </div>

                      {selectedLead.phone && (
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5 text-xs text-slate-300">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <Phone size={16} className="text-cyan-400 shrink-0" />
                            <span className="truncate">{selectedLead.phone}</span>
                          </div>
                          <button 
                            onClick={() => copyToClipboard(selectedLead.phone, 'Telefonnummer')}
                            className="p-1.5 text-slate-400 hover:text-cyan-400 transition-colors shrink-0"
                            title="Telefonnummer kopieren"
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Notes Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Notizen</h4>
                      {!isEditingNotes ? (
                        <button 
                          onClick={() => {
                            setEditedNotes(selectedLead.notes || '');
                            setIsEditingNotes(true);
                          }}
                          className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider hover:underline flex items-center gap-1"
                        >
                          <Edit3 size={12} />
                          Bearbeiten
                        </button>
                      ) : (
                        <button 
                          onClick={handleSaveNotes}
                          className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider hover:underline flex items-center gap-1"
                        >
                          <Check size={12} />
                          Speichern
                        </button>
                      )}
                    </div>

                    {isEditingNotes ? (
                      <div className="space-y-2">
                        <textarea
                          rows={4}
                          value={editedNotes}
                          onChange={(e) => setEditedNotes(e.target.value)}
                          placeholder="Fügen Sie hier Notizen zum Kundengespräch oder Projekt hinzu..."
                          className="w-full bg-dark-950 border border-cyan-500/50 rounded-2xl p-4 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setIsEditingNotes(false)}
                            className="px-3 py-1.5 rounded-xl bg-white/5 text-slate-400 text-xs hover:text-white"
                          >
                            Abbrechen
                          </button>
                          <button
                            onClick={handleSaveNotes}
                            className="px-4 py-1.5 rounded-xl bg-cyan-500 text-dark-950 font-bold text-xs"
                          >
                            Speichern
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap min-h-[60px]">
                        {selectedLead.notes || <span className="text-slate-600 italic">Keine Notizen vorhanden. Klicken Sie auf "Bearbeiten", um Notizen hinzuzufügen.</span>}
                      </div>
                    )}
                  </div>

                  {/* Timeline */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Verlauf</h4>
                    <div className="space-y-4 pl-4 border-l border-white/10">
                      <div className="relative">
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                        <div className="text-[10px] text-slate-500 mb-1">
                          {new Date(selectedLead.created_at || selectedLead.start_time || Date.now()).toLocaleDateString('de-DE', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                        <div className="text-xs text-slate-200 font-medium flex items-center gap-2">
                           <Bot size={14} className="text-cyan-400" />
                           Lead Anfrage eingegangen
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Primary Actions */}
                  <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => handleDeleteLead(selectedLead.id)}
                      className={cn(
                        "h-12 md:h-14 rounded-2xl border text-[10px] uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 active:scale-95 col-span-2 mb-2",
                        confirmDeleteId === selectedLead.id 
                          ? "bg-rose-500 text-white border-rose-600 animate-pulse" 
                          : "bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white"
                      )}
                    >
                      <Trash2 size={14} />
                      {confirmDeleteId === selectedLead.id ? 'Sicher? Nochmal klicken' : 'Lead & Termin Löschen'}
                    </button>

                    <a 
                      href={`mailto:${selectedLead.email}`}
                      className="h-12 md:h-14 rounded-2xl bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest font-bold text-slate-50 hover:bg-white/10 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <Mail size={14} className="text-cyan-400" />
                      E-Mail Senden
                    </a>

                    {selectedLead.phone ? (
                      <a 
                        href={`tel:${selectedLead.phone}`}
                        className="h-12 md:h-14 rounded-2xl bg-cyan-500 text-dark-950 text-[10px] uppercase tracking-widest font-black hover:bg-cyan-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95"
                      >
                        <Phone size={14} />
                        Anrufen
                      </a>
                    ) : (
                      <button 
                        onClick={() => {
                          setEditedNotes(selectedLead.notes || '');
                          setIsEditingNotes(true);
                        }}
                        className="h-12 md:h-14 rounded-2xl bg-white/10 border border-white/10 text-[10px] uppercase tracking-widest font-bold text-slate-200 hover:bg-white/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                      >
                        <Edit3 size={14} className="text-cyan-400" />
                        Notiz Verfassen
                      </button>
                    )}
                  </div>
                  
                  {/* Create Invoice Action */}
                  <div className="pt-3">
                    <Link
                      to={`/admin/invoices/new?leadId=${selectedLead.id}`}
                      className="w-full h-12 md:h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] uppercase tracking-widest font-bold text-emerald-400 hover:bg-emerald-500 hover:text-dark-950 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <Calculator size={14} />
                      Rechnung erstellen
                    </Link>
                  </div>

                  <div className="pt-2">
                    <Link
                      to={`/admin/contracts/new?leadId=${selectedLead.id}`}
                      className="w-full h-12 md:h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-[10px] uppercase tracking-widest font-bold text-cyan-400 hover:bg-cyan-500 hover:text-dark-950 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <FileText size={14} />
                      Vertrag erstellen
                    </Link>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-[500px] glass-card rounded-[3rem] border-white/5 flex flex-col items-center justify-center text-center p-10 opacity-40">
                <Users size={48} className="text-slate-600 mb-6" />
                <h3 className="text-xl font-bold text-white mb-2">Kein Lead ausgewählt</h3>
                <p className="text-slate-500 text-xs max-w-xs">Wählen Sie einen Lead aus der linken Liste aus, um Kontaktdaten, Notizen und Status zu bearbeiten.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal: Neuer Lead Manuell Erstellen */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-dark-900 border border-white/10 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl space-y-6 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <UserPlus className="text-cyan-400" size={20} />
                  <h3 className="text-lg font-bold text-white">Neuen Lead anlegen</h3>
                </div>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateLead} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Basis-Informationen</h4>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Vollständiger Name *</label>
                      <input type="text" required value={newLead.full_name} onChange={(e) => setNewLead({ ...newLead, full_name: e.target.value })} className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:border-cyan-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">E-Mail-Adresse *</label>
                      <input type="email" required value={newLead.email} onChange={(e) => setNewLead({ ...newLead, email: e.target.value })} className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:border-cyan-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Telefonnummer</label>
                      <input type="tel" value={newLead.phone} onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })} className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:border-cyan-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Firma</label>
                      <input type="text" value={newLead.company} onChange={(e) => setNewLead({ ...newLead, company: e.target.value })} className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:border-cyan-500 focus:outline-none" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Anschrift</h4>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Straße & Hausnr.</label>
                      <input type="text" value={newLead.street} onChange={(e) => setNewLead({ ...newLead, street: e.target.value })} className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:border-cyan-500 focus:outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">PLZ</label>
                        <input type="text" value={newLead.zip} onChange={(e) => setNewLead({ ...newLead, zip: e.target.value })} className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:border-cyan-500 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Ort</label>
                        <input type="text" value={newLead.city} onChange={(e) => setNewLead({ ...newLead, city: e.target.value })} className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:border-cyan-500 focus:outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Land</label>
                      <input type="text" value={newLead.country} onChange={(e) => setNewLead({ ...newLead, country: e.target.value })} className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:border-cyan-500 focus:outline-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Notizen / Projektbeschreibung</label>
                  <textarea rows={3} value={newLead.notes} onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-cyan-500 focus:outline-none" />
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-white/5">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-5 h-11 rounded-xl bg-white/5 text-slate-300 font-bold text-xs hover:bg-white/10 transition-all">Abbrechen</button>
                  <button type="submit" className="px-6 h-11 rounded-xl bg-cyan-500 text-dark-950 font-bold text-xs uppercase tracking-wider hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20">Lead Anlegen</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Modal: Lead Bearbeiten */}
        {showEditModal && editLeadData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-dark-900 border border-white/10 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl space-y-6 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <Edit3 className="text-cyan-400" size={20} />
                  <h3 className="text-lg font-bold text-white">Lead-Daten bearbeiten</h3>
                </div>
                <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleUpdateLeadDetails} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Basis-Informationen</h4>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Vollständiger Name</label>
                      <input type="text" required value={editLeadData.full_name} onChange={(e) => setEditLeadData({ ...editLeadData, full_name: e.target.value })} className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:border-cyan-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">E-Mail-Adresse</label>
                      <input type="email" required value={editLeadData.email} onChange={(e) => setEditLeadData({ ...editLeadData, email: e.target.value })} className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:border-cyan-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Telefonnummer</label>
                      <input type="tel" value={editLeadData.phone || ''} onChange={(e) => setEditLeadData({ ...editLeadData, phone: e.target.value })} className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:border-cyan-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Firma</label>
                      <input type="text" value={editLeadData.company || ''} onChange={(e) => setEditLeadData({ ...editLeadData, company: e.target.value })} className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:border-cyan-500 focus:outline-none" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Anschrift</h4>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Straße & Hausnr.</label>
                      <input type="text" value={editLeadData.street || ''} onChange={(e) => setEditLeadData({ ...editLeadData, street: e.target.value })} className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:border-cyan-500 focus:outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">PLZ</label>
                        <input type="text" value={editLeadData.zip || ''} onChange={(e) => setEditLeadData({ ...editLeadData, zip: e.target.value })} className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:border-cyan-500 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Ort</label>
                        <input type="text" value={editLeadData.city || ''} onChange={(e) => setEditLeadData({ ...editLeadData, city: e.target.value })} className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:border-cyan-500 focus:outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Land</label>
                      <input type="text" value={editLeadData.country || ''} onChange={(e) => setEditLeadData({ ...editLeadData, country: e.target.value })} className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:border-cyan-500 focus:outline-none" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-white/5">
                  <button type="button" onClick={() => setShowEditModal(false)} className="px-5 h-11 rounded-xl bg-white/5 text-slate-300 font-bold text-xs hover:bg-white/10 transition-all">Abbrechen</button>
                  <button type="submit" className="px-6 h-11 rounded-xl bg-cyan-500 text-dark-950 font-bold text-xs uppercase tracking-wider hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20">Änderungen speichern</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

