import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, query, getDocs, orderBy, limit, doc, getDoc, setDoc, addDoc } from 'firebase/firestore';
import { Invoice, InvoiceItem, BusinessSettings } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  ArrowLeft, 
  Save, 
  Download, 
  Plus, 
  Trash2, 
  Calculator, 
  User, 
  Building2, 
  Calendar as CalendarIcon,
  FileText,
  Percent,
  Search
} from 'lucide-react';
import { format, addDays, parseISO } from 'date-fns';
import { formatCurrency, cn } from '@/lib/utils';
import { jsPDF } from 'jspdf';
import { AnimatePresence } from 'motion/react';
import CalculatorPicker from '@/components/admin/CalculatorPicker';

const DEFAULT_VAT_RATE = 19;

import { CALCULATOR_OPTIONS } from '@/lib/constants';

import { generateInvoicePDF } from '@/lib/pdf';

export default function InvoiceEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditing = !!id;
  const leadId = new URLSearchParams(location.search).get('leadId');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings | null>(null);
  const [services, setServices] = useState<any[]>([]);

  const [invoice, setInvoice] = useState<Partial<Invoice>>({
    invoice_number: 'Laden...',
    invoice_date: format(new Date(), 'yyyy-MM-dd'),
    service_date: format(new Date(), 'yyyy-MM-dd'),
    due_date_days: 14,
    due_date: format(addDays(new Date(), 14), 'yyyy-MM-dd'),
    customer_company: '',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_street: '',
    customer_zip: '',
    customer_city: '',
    customer_country: 'Deutschland',
    items: [
      { id: '1', description: '', quantity: 1, unit: 'Stk', price_per_unit: 0, total_price: 0 }
    ],
    vat_rate: DEFAULT_VAT_RATE,
    status: 'draft',
    notes: ''
  });

  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load settings first
        const settingsDoc = await getDoc(doc(db, 'business_settings', 'current_settings'));
        if (settingsDoc.exists()) {
          setBusinessSettings(settingsDoc.data() as BusinessSettings);
        } else {
          const local = localStorage.getItem('viktor_labs_business_settings');
          if (local) setBusinessSettings(JSON.parse(local));
        }

        // Load services
        const svcSnapshot = await getDocs(collection(db, 'services'));
        const dbServices = svcSnapshot.docs.map(doc => doc.data());
        if (dbServices.length > 0) {
          setServices(dbServices);
        } else {
          const localServices = localStorage.getItem('viktor_labs_services');
          if (localServices) setServices(JSON.parse(localServices));
        }

        if (isEditing) {
          try {
            const invDoc = await getDoc(doc(db, 'invoices', id));
            if (invDoc.exists()) {
              const data = { id: invDoc.id, ...invDoc.data() } as Invoice;
              setInvoice(prev => ({ ...prev, ...data }));
            } else {
              const local = localStorage.getItem('viktor_labs_invoices');
              if (local) {
                const invoices = JSON.parse(local) as Invoice[];
                const found = invoices.find(inv => inv.id === id);
                if (found) setInvoice(prev => ({ ...prev, ...found }));
              }
            }
          } catch (e) {
            const local = localStorage.getItem('viktor_labs_invoices');
            if (local) {
              const invoices = JSON.parse(local) as Invoice[];
              const found = invoices.find(inv => inv.id === id);
              if (found) setInvoice(prev => ({ ...prev, ...found }));
            }
          }
        } else {
          // New Invoice
          let lead: any = null;
          if (leadId) {
            try {
              const leadDoc = await getDoc(doc(db, 'appointments', leadId));
              if (leadDoc.exists()) lead = { id: leadDoc.id, ...leadDoc.data() };
            } catch (e) {}

            if (!lead) {
              const local = localStorage.getItem('viktor_labs_appointments');
              if (local) {
                const leads = JSON.parse(local);
                lead = leads.find((l: any) => l.id === leadId);
              }
            }
          }

          // Generate new invoice number
          let allInvoices: Invoice[] = [];
          try {
            const invSnapshot = await getDocs(collection(db, 'invoices'));
            if (!invSnapshot.empty) {
              allInvoices = invSnapshot.docs.map(doc => doc.data() as Invoice);
            } else {
              const local = localStorage.getItem('viktor_labs_invoices');
              if (local) allInvoices = JSON.parse(local);
            }
          } catch (e) {
            console.error("Number fetch failed", e);
            const local = localStorage.getItem('viktor_labs_invoices');
            if (local) allInvoices = JSON.parse(local);
          }
          
          const currentYear = new Date().getFullYear();
          const yearInvoices = allInvoices.filter(inv => inv.invoice_number?.startsWith(`VL-${currentYear}-`));
          
          let nextNumber = 1;
          if (yearInvoices.length > 0) {
            const numbers = yearInvoices.map(inv => {
              const parts = (inv.invoice_number || '').split('-');
              const num = parseInt(parts[parts.length - 1], 10);
              return isNaN(num) ? 0 : num;
            });
            nextNumber = Math.max(...numbers, 0) + 1;
          }
          
          const newNumber = `VL-${currentYear}-${nextNumber.toString().padStart(4, '0')}`;
          
          // Apply everything at once
          setInvoice(prev => {
            const updated = { ...prev, invoice_number: newNumber };
            
            if (lead) {
              const items = lead.services_list?.length > 0 
                ? lead.services_list.map((s: any) => ({
                    id: s.id || crypto.randomUUID(),
                    description: s.description,
                    quantity: 1,
                    unit: 'Stk',
                    price_per_unit: s.price,
                    total_price: s.price
                  }))
                : [
                    { 
                      id: '1', 
                      description: lead.service_id ? `Service: ${lead.service_id}` : 'Beratung & Service', 
                      quantity: 1, 
                      unit: 'Stk', 
                      price_per_unit: 0, 
                      total_price: 0 
                    }
                  ];

              return {
                ...updated,
                customer_company: lead.company || '',
                customer_name: lead.full_name || '',
                customer_email: lead.email || '',
                customer_phone: lead.phone || '',
                customer_street: lead.street || '',
                customer_zip: lead.zip || '',
                customer_city: lead.city || '',
                customer_country: lead.country || 'Deutschland',
                items: items
              };
            }
            
            return updated;
          });
        }
      } catch (err) {
        console.error("Load failed", err);
        // Fallback for new invoice if number failed
        if (!isEditing) {
          const year = new Date().getFullYear();
          setInvoice(prev => ({ 
            ...prev, 
            invoice_number: prev.invoice_number === 'Laden...' ? `VL-${year}-0001` : prev.invoice_number 
          }));
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id, isEditing, leadId]);

  // Calculations
  const totals = useMemo(() => {
    const subtotal = (invoice.items || []).reduce((sum, item) => sum + item.total_price, 0);
    const vat_rate = invoice.vat_rate || 0;
    const vat_amount = (subtotal * vat_rate) / 100;
    const total_amount = subtotal + vat_amount;
    return { subtotal, vat_amount, total_amount };
  }, [invoice.items, invoice.vat_rate]);

  const updateField = (field: keyof Invoice, value: any) => {
    setInvoice(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-calculate due date if date or days change
      if (field === 'invoice_date' || field === 'due_date_days') {
        const date = field === 'invoice_date' ? parseISO(value as string) : parseISO(prev.invoice_date!);
        const days = field === 'due_date_days' ? (value as number) : prev.due_date_days!;
        updated.due_date = format(addDays(date, days), 'yyyy-MM-dd');
      }
      
      return updated;
    });
  };

  const allAvailableServices = useMemo(() => {
    const dbS = services.map(s => {
      let name = s.name;
      if (typeof s.name === 'string' && (s.name.startsWith('{') || s.name.startsWith('['))) {
        try {
          const parsed = JSON.parse(s.name);
          name = parsed.de || parsed.en || s.name;
        } catch (e) {}
      }
      return { title: name, price: s.price };
    });

    const calcS = CALCULATOR_OPTIONS.map(o => ({
      title: o.title,
      price: o.price
    }));

    return [...dbS, ...calcS];
  }, [services]);

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...(invoice.items || [])];
    const item = { ...newItems[index], [field]: value };
    
    // Auto-fill price if description matches a service
    if (field === 'description') {
      const foundService = allAvailableServices.find(s => s.title === value);
      if (foundService) {
        item.price_per_unit = foundService.price;
      }
    }

    item.total_price = (item.quantity || 0) * (item.price_per_unit || 0);
    newItems[index] = item;
    setInvoice(prev => ({ ...prev, items: newItems }));
  };

  const addCalculatorItem = (option: any) => {
    const newItem: InvoiceItem = {
      id: crypto.randomUUID(),
      description: option.title,
      quantity: 1,
      unit: 'Stk',
      price_per_unit: option.price,
      total_price: option.price
    };

    setInvoice(prev => {
      // Remove first item if it's empty
      const currentItems = prev.items || [];
      const filteredItems = currentItems.filter(item => item.description !== '' || item.price_per_unit !== 0);
      return {
        ...prev,
        items: [...filteredItems, newItem]
      };
    });
    setIsCalculatorOpen(false);
  };

  const addItem = () => {
    setInvoice(prev => ({
      ...prev,
      items: [
        ...(prev.items || []),
        { id: crypto.randomUUID(), description: '', quantity: 1, unit: 'Stk', price_per_unit: 0, total_price: 0 }
      ]
    }));
  };

  const removeItem = (index: number) => {
    const newItems = (invoice.items || []).filter((_, i) => i !== index);
    if (newItems.length === 0) {
      newItems.push({ id: crypto.randomUUID(), description: '', quantity: 1, unit: 'Stk', price_per_unit: 0, total_price: 0 });
    }
    setInvoice(prev => ({ ...prev, items: newItems }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const finalInvoice = {
      ...invoice,
      ...totals,
      id: invoice.id || crypto.randomUUID(),
      created_at: invoice.created_at || new Date().toISOString()
    } as Invoice;

    try {
      await setDoc(doc(db, 'invoices', finalInvoice.id), finalInvoice);
      
      const local = localStorage.getItem('viktor_labs_invoices');
      let invoices: Invoice[] = local ? JSON.parse(local) : [];
      if (isEditing) {
        invoices = invoices.map(inv => inv.id === finalInvoice.id ? finalInvoice : inv);
      } else {
        invoices.unshift(finalInvoice);
      }
      localStorage.setItem('viktor_labs_invoices', JSON.stringify(invoices));
      
      if (!isEditing) navigate('/admin/invoices');
      else alert('Rechnung gespeichert');
    } catch (err) {
      console.error("Save failed", err);
      const local = localStorage.getItem('viktor_labs_invoices');
      let invoices: Invoice[] = local ? JSON.parse(local) : [];
      if (isEditing) {
        invoices = invoices.map(inv => inv.id === finalInvoice.id ? finalInvoice : inv);
      } else {
        invoices.unshift(finalInvoice);
      }
      localStorage.setItem('viktor_labs_invoices', JSON.stringify(invoices));
      
      alert('Lokal gespeichert');
      if (!isEditing) navigate('/admin/invoices');
    } finally {
      setIsSaving(false);
    }
  };

  const generatePDF = async (inv: Invoice) => {
    try {
      await generateInvoicePDF(inv, businessSettings);
    } catch (e) {
      console.error("PDF gen failed", e);
      alert("PDF konnte nicht generiert werden.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/invoices')} className="text-slate-400">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-50">
              {isEditing ? 'Rechnung bearbeiten' : 'Neue Rechnung'}
            </h2>
            <p className="text-slate-400">{invoice.invoice_number}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => generatePDF(invoice as Invoice)} className="border-white/10 text-slate-200 hover:bg-white/5">
            <Download className="w-4 h-4 mr-2 text-cyan-500" />
            PDF Exportieren
          </Button>
          <Button onClick={() => handleSave()} isLoading={isSaving} className="bg-cyan-500 text-dark-950 font-bold px-8">
            <Save className="w-4 h-4 mr-2" />
            Speichern
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Customer Data */}
          <Card className="border-white/10 bg-dark-900/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-cyan-500" />
                <CardTitle className="text-lg">Kundendaten</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Firmenname</label>
                  <Input 
                    value={invoice.customer_company} 
                    onChange={e => updateField('customer_company', e.target.value)} 
                    placeholder="Beispiel GmbH"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Ansprechpartner</label>
                  <Input 
                    value={invoice.customer_name} 
                    onChange={e => updateField('customer_name', e.target.value)} 
                    placeholder="Max Mustermann"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">E-Mail</label>
                  <Input 
                    type="email" 
                    value={invoice.customer_email} 
                    onChange={e => updateField('customer_email', e.target.value)} 
                    placeholder="kunde@beispiel.de"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Telefon</label>
                  <Input 
                    value={invoice.customer_phone} 
                    onChange={e => updateField('customer_phone', e.target.value)} 
                    placeholder="+49 123 456789"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Straße & Hausnummer</label>
                <Input 
                  value={invoice.customer_street} 
                  onChange={e => updateField('customer_street', e.target.value)} 
                  placeholder="Musterstraße 123"
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">PLZ</label>
                  <Input 
                    value={invoice.customer_zip} 
                    onChange={e => updateField('customer_zip', e.target.value)} 
                    placeholder="12345"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Ort</label>
                  <Input 
                    value={invoice.customer_city} 
                    onChange={e => updateField('customer_city', e.target.value)} 
                    placeholder="Musterstadt"
                  />
                </div>
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Land</label>
                  <Input 
                    value={invoice.customer_country} 
                    onChange={e => updateField('customer_country', e.target.value)} 
                    placeholder="Deutschland"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card className="border-white/10 bg-dark-900/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-cyan-500" />
                <CardTitle className="text-lg">Leistungen</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setIsCalculatorOpen(true)} className="text-cyan-500 hover:bg-cyan-500/10">
                  <Calculator className="w-4 h-4 mr-2" />
                  Aus Kalkulator wählen
                </Button>
                <Button variant="ghost" size="sm" onClick={addItem} className="text-slate-400 hover:bg-white/5">
                  <Plus className="w-4 h-4 mr-2" />
                  Eigene Position
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {invoice.items?.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-dark-950/50 border border-white/5 rounded-2xl relative group">
                    <div className="md:col-span-5 space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Beschreibung</label>
                      <Input 
                        value={item.description} 
                        onChange={e => updateItem(index, 'description', e.target.value)} 
                        placeholder="Webdesign & Entwicklung"
                        list={`services-list-${index}`}
                      />
                      <datalist id={`services-list-${index}`}>
                        {allAvailableServices.map((s, si) => (
                          <option key={`${s.title}-${si}`} value={s.title}>
                            {formatCurrency(s.price)}
                          </option>
                        ))}
                      </datalist>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Menge</label>
                      <Input 
                        type="number" 
                        value={item.quantity} 
                        onChange={e => updateItem(index, 'quantity', parseFloat(e.target.value))} 
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Einheit</label>
                      <Input 
                        value={item.unit} 
                        onChange={e => updateItem(index, 'unit', e.target.value)} 
                        placeholder="Stk"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Einzelpreis</label>
                      <Input 
                        type="number" 
                        step="0.01" 
                        value={item.price_per_unit} 
                        onChange={e => updateItem(index, 'price_per_unit', parseFloat(e.target.value))} 
                      />
                    </div>
                    <div className="md:col-span-1 flex items-end justify-center pb-2">
                      <button 
                        onClick={() => removeItem(index)}
                        className="text-slate-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-2 border-t border-white/5 pt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Zwischensumme</span>
                  <span className="text-slate-200 font-medium">{formatCurrency(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Mehrwertsteuer</span>
                    <div className="flex items-center bg-dark-950 border border-white/10 rounded px-2 py-0.5">
                      <input 
                        type="number" 
                        value={invoice.vat_rate} 
                        onChange={e => updateField('vat_rate', parseFloat(e.target.value))}
                        className="w-8 bg-transparent border-none text-[10px] text-cyan-500 focus:outline-none p-0 text-right"
                      />
                      <span className="text-[10px] text-cyan-500/50 ml-0.5">%</span>
                    </div>
                  </div>
                  <span className="text-slate-200 font-medium">{formatCurrency(totals.vat_amount)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-white/10 pt-4 mt-4">
                  <span className="text-white">Gesamtbetrag</span>
                  <span className="text-cyan-400">{formatCurrency(totals.total_amount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Settings */}
        <div className="space-y-8">
          
          {/* Invoice Meta */}
          <Card className="border-white/10 bg-dark-900/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-500" />
                <CardTitle className="text-lg">Rechnungsdaten</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Rechnungsnummer</label>
                <Input 
                  value={invoice.invoice_number} 
                  onChange={e => updateField('invoice_number', e.target.value)}
                  className="bg-dark-950 font-mono text-cyan-500" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Rechnungsdatum</label>
                <Input 
                  type="date" 
                  value={invoice.invoice_date} 
                  onChange={e => updateField('invoice_date', e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Leistungsdatum</label>
                <Input 
                  type="date" 
                  value={invoice.service_date} 
                  onChange={e => updateField('service_date', e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Zahlungsziel (Tage)</label>
                <Input 
                  type="number" 
                  value={invoice.due_date_days} 
                  onChange={e => updateField('due_date_days', parseInt(e.target.value))} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Fällig am</label>
                <Input value={invoice.due_date ? format(parseISO(invoice.due_date), 'dd.MM.yyyy') : ''} readOnly className="bg-dark-950/50 cursor-not-allowed text-slate-500" />
              </div>
            </CardContent>
          </Card>

          {/* Status & Notes */}
          <Card className="border-white/10 bg-dark-900/50">
            <CardHeader>
              <CardTitle className="text-lg">Status & Notizen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Status</label>
                <select 
                  value={invoice.status}
                  onChange={e => updateField('status', e.target.value)}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl py-2 px-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                >
                  <option value="draft">Entwurf</option>
                  <option value="sent">Gesendet</option>
                  <option value="paid">Bezahlt</option>
                  <option value="cancelled">Storniert</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Interne Notizen</label>
                <textarea 
                  value={invoice.notes}
                  onChange={e => updateField('notes', e.target.value)}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl py-2 px-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 min-h-[100px]"
                  placeholder="Zusätzliche Informationen..."
                />
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
      {/* Calculator Picker Overlay */}
      <AnimatePresence>
        {isCalculatorOpen && (
          <CalculatorPicker 
            onSelect={addCalculatorItem} 
            onClose={() => setIsCalculatorOpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
