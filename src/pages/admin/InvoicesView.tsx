import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, query, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { Invoice, BusinessSettings } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, Search, FileText, Download, Trash2, Edit, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import { generateInvoicePDF } from '@/lib/pdf';

export default function InvoicesView() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings | null>(null);

  const fetchInvoices = async () => {
    setIsLoading(true);
    let allInvoices: Invoice[] = [];
    
    try {
      // Fetch settings first
      const settingsDoc = await getDoc(doc(db, 'settings', 'business'));
      if (settingsDoc.exists()) {
        setBusinessSettings(settingsDoc.data() as BusinessSettings);
      }

      const q = query(collection(db, 'invoices'));
      const querySnapshot = await getDocs(q);
      allInvoices = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Invoice));
    } catch (err) {
      console.warn("Invoices fetch failed", err);
    }

    // Merge with LocalStorage
    try {
      const local = localStorage.getItem('viktor_labs_invoices');
      if (local) {
        const localInvoices = JSON.parse(local) as Invoice[];
        const dbIds = new Set(allInvoices.map(i => i.id));
        const uniqueLocal = localInvoices.filter(i => !dbIds.has(i.id));
        allInvoices = [...allInvoices, ...uniqueLocal];
      }
    } catch (e) {}

    // Sort
    allInvoices.sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    });

    setInvoices(allInvoices);
    localStorage.setItem('viktor_labs_invoices', JSON.stringify(allInvoices));
    setIsLoading(false);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDownload = async (invoice: Invoice) => {
    setIsDownloading(invoice.id);
    try {
      await generateInvoicePDF(invoice, businessSettings);
    } catch (err) {
      console.error("Download failed", err);
      alert("Download fehlgeschlagen. Bitte versuchen Sie es erneut.");
    } finally {
      setIsDownloading(null);
    }
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      setTimeout(() => setConfirmDeleteId(null), 3000);
      return;
    }

    console.log("Deleting invoice:", id);
    setConfirmDeleteId(null);
    try {
      await deleteDoc(doc(db, 'invoices', id));
      console.log("Firebase delete successful");
      
      const updated = invoices.filter(inv => inv.id !== id);
      setInvoices(updated);
      localStorage.setItem('viktor_labs_invoices', JSON.stringify(updated));
    } catch (err) {
      console.error("Delete failed", err);
      // Even if firestore fails, we update local state for better UX
      const updated = invoices.filter(inv => inv.id !== id);
      setInvoices(updated);
      localStorage.setItem('viktor_labs_invoices', JSON.stringify(updated));
    }
  };

  const filteredInvoices = invoices.filter(inv => {
    const search = searchQuery.toLowerCase();
    const nr = (inv.invoice_number || '').toLowerCase();
    const comp = (inv.customer_company || '').toLowerCase();
    const email = (inv.customer_email || '').toLowerCase();
    
    return nr.includes(search) || comp.includes(search) || email.includes(search);
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'sent': return <Clock className="w-4 h-4 text-cyan-500" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <FileText className="w-4 h-4 text-slate-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Bezahlt';
      case 'sent': return 'Gesendet';
      case 'cancelled': return 'Storniert';
      default: return 'Entwurf';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-50">Rechnungen</h2>
          <p className="text-slate-400">Erstellen und verwalten Sie Ihre Kundenrechnungen.</p>
        </div>
        <Button onClick={() => navigate('/admin/invoices/new')} className="bg-cyan-500 text-dark-950 font-bold">
          <Plus className="w-4 h-4 mr-2" />
          Neue Rechnung
        </Button>
      </div>

      <Card className="border-white/10 bg-dark-900/50 backdrop-blur-sm">
        <CardHeader className="pb-3 border-b border-white/5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium text-slate-50">Übersicht</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text"
                placeholder="Suchen..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-dark-950 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Nr.</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Kunde</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Datum</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Betrag</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={6} className="px-6 py-8 h-16 bg-white/[0.01]" />
                    </tr>
                  ))
                ) : filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-light italic">
                      Keine Rechnungen gefunden.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map(invoice => (
                    <tr key={invoice.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs text-cyan-500">{invoice.invoice_number}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-200">{invoice.customer_company}</span>
                          <span className="text-[10px] text-slate-500">{invoice.customer_email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-slate-400">
                          {format(parseISO(invoice.invoice_date), 'dd.MM.yyyy')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-slate-200">{formatCurrency(invoice.total_amount)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(invoice.status)}
                          <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                            {getStatusLabel(invoice.status)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-slate-400 hover:text-cyan-500"
                            onClick={() => navigate(`/admin/invoices/edit/${invoice.id}`)}
                            title="Bearbeiten"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-slate-400 hover:text-emerald-500"
                            onClick={() => handleDownload(invoice)}
                            disabled={isDownloading === invoice.id}
                            title="PDF Herunterladen"
                          >
                            <Download className={`w-4 h-4 ${isDownloading === invoice.id ? 'animate-bounce' : ''}`} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`h-8 w-8 p-0 transition-all ${confirmDeleteId === invoice.id ? 'text-white bg-rose-500 animate-pulse w-auto px-2' : 'text-slate-400 hover:text-red-500'}`}
                            onClick={() => handleDelete(invoice.id)}
                            title="Löschen"
                          >
                            {confirmDeleteId === invoice.id ? <span className="text-[10px] font-bold">Sicher?</span> : <Trash2 className="w-4 h-4" />}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
