import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, query, getDocs, limit, doc, getDoc, setDoc, addDoc } from 'firebase/firestore';
import { Contract, BusinessSettings } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  ArrowLeft, 
  Save, 
  Download, 
  Plus, 
  Trash2, 
  User, 
  Building2, 
  Calendar as CalendarIcon,
  FileText,
  Clock,
  Briefcase,
  PenTool,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { format, addDays, parseISO } from 'date-fns';
import { formatCurrency, cn } from '@/lib/utils';
import { jsPDF } from 'jspdf';

const DEFAULT_DESCRIPTION = "Viktor Labs entwickelt für den Auftraggeber eine individuelle Softwarelösung gemäß den vereinbarten Anforderungen. Das Projekt umfasst Planung, Entwicklung, Tests und Bereitstellung der vereinbarten Funktionen.";
const DEFAULT_SCOPE = "* Konzeption und Planung\n* UI-/UX-Design\n* Frontend-Entwicklung\n* Backend-Entwicklung\n* Datenbankintegration\n* Benutzerverwaltung\n* API-Entwicklung und Integration\n* Responsive Design\n* Performance-Optimierung\n* Sicherheitsmaßnahmen\n* Fehlerbehebungen während der Entwicklungsphase\n* Deployment auf dem vereinbarten Server\n* Technische Dokumentation";
const DEFAULT_RESPONSIBILITIES = "Der Auftraggeber verpflichtet sich,\n* notwendige Informationen rechtzeitig bereitzustellen,\n* gewünschte Inhalte zu liefern,\n* Feedback innerhalb angemessener Fristen zu geben,\n* erforderliche Zugänge bereitzustellen.\n\nVerzögerungen aufgrund fehlender Mitwirkung können den Projektzeitplan entsprechend verlängern.";
const DEFAULT_TIMELINE = "1. Projektplanung\n2. Designphase\n3. Entwicklung\n4. Testphase\n5. Kundenabnahme\n6. Produktivschaltung";
const DEFAULT_DELIVERABLES = "Die Softwarelösung wird als webbasierte Applikation bereitgestellt. Nach erfolgreicher Abnahme erfolgt das Deployment auf dem vereinbarten Server.";
const DEFAULT_PAYMENT_TERMS = "Änderungen oder Erweiterungen nach Projektbeginn werden separat bewertet und nur nach schriftlicher Zustimmung umgesetzt. Dadurch entstehende Mehrkosten werden gesondert berechnet.\n\nNach Fertigstellung stellt Viktor Labs die vereinbarte Leistung zur Abnahme bereit. Erfolgt innerhalb von 14 Kalendertagen keine schriftliche Mängelmeldung, gilt die Leistung als abgenommen.";
const DEFAULT_CANCELLATION_TERMS = "Dieser Vertrag kann von beiden Parteien mit einer Frist von 30 Tagen zum Monatsende gekündigt werden. Bereits erbrachte Leistungen sind bis zum Kündigungszeitpunkt zu vergüten.";
const DEFAULT_WARRANTY = "Viktor Labs gewährleistet, dass die Software die vereinbarten Funktionen erfüllt. Die Gewährleistungsfrist beträgt 12 Monate ab Abnahme.";
const DEFAULT_OTHER = "Diese Vertragsbeilage ist Bestandteil des Hauptvertrags. Bei Widersprüchen zwischen Hauptvertrag und Beilage gelten die Regelungen des Hauptvertrags, sofern nichts anderes ausdrücklich vereinbart wurde.";

export default function ContractEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditing = !!id;
  const leadId = new URLSearchParams(location.search).get('leadId');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings | null>(null);

  const [contract, setContract] = useState<Partial<Contract>>({
    contract_number: '',
    contract_date: format(new Date(), 'yyyy-MM-dd'),
    start_date: format(new Date(), 'yyyy-MM-dd'),
    contract_type: 'Webentwicklung',
    project_name: '',
    customer_company: '',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_street: '',
    customer_zip: '',
    customer_city: '',
    customer_country: 'Deutschland',
    description: DEFAULT_DESCRIPTION,
    scope: DEFAULT_SCOPE,
    responsibilities: DEFAULT_RESPONSIBILITIES,
    timeline: DEFAULT_TIMELINE,
    deliverables: DEFAULT_DELIVERABLES,
    payment_terms: DEFAULT_PAYMENT_TERMS,
    cancellation_terms: DEFAULT_CANCELLATION_TERMS,
    warranty: DEFAULT_WARRANTY,
    other_agreements: DEFAULT_OTHER,
    payment_interval: 'one-time',
    currency: 'EUR',
    status: 'draft'
  });

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

        if (isEditing) {
          const ctDoc = await getDoc(doc(db, 'contracts', id));
          if (ctDoc.exists()) {
            const data = { id: ctDoc.id, ...ctDoc.data() } as Contract;
            setContract(prev => ({ ...prev, ...data }));
            
            // Check for auto-download
            const params = new URLSearchParams(location.search);
            if (params.get('download') === 'true') {
              setTimeout(() => {
                generatePDF(data);
                navigate(location.pathname, { replace: true });
              }, 1000);
            }
          } else {
            const local = localStorage.getItem('viktor_labs_contracts');
            if (local) {
              const contracts = JSON.parse(local) as Contract[];
              const found = contracts.find(c => c.id === id);
              if (found) setContract(prev => ({ ...prev, ...found }));
            }
          }
        } else {
          // New Contract
          if (leadId) {
            // Pre-fill from lead
            let lead: any = null;
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

            if (lead) {
              setContract(prev => ({
                ...prev,
                customer_company: lead.company || '',
                customer_name: lead.full_name || '',
                customer_email: lead.email || '',
                customer_phone: lead.phone || '',
                project_name: lead.service_id ? `Softwareentwicklung: ${lead.service_id}` : ''
              }));
            }
          }

          // Generate new contract number: CT-YYYY-XXXX
          let allContracts: Contract[] = [];
          try {
            const ctSnapshot = await getDocs(collection(db, 'contracts'));
            if (!ctSnapshot.empty) {
              allContracts = ctSnapshot.docs.map(doc => doc.data() as Contract);
            } else {
              const local = localStorage.getItem('viktor_labs_contracts');
              if (local) allContracts = JSON.parse(local);
            }
          } catch (e) {
            const local = localStorage.getItem('viktor_labs_contracts');
            if (local) allContracts = JSON.parse(local);
          }

          const currentYear = new Date().getFullYear();
          const yearContracts = allContracts.filter(c => c.contract_number?.startsWith(`CT-${currentYear}-`));
          
          let nextNumber = 1;
          if (yearContracts.length > 0) {
            const numbers = yearContracts.map(c => {
              const parts = c.contract_number.split('-');
              const num = parseInt(parts[parts.length - 1], 10);
              return isNaN(num) ? 0 : num;
            });
            nextNumber = Math.max(...numbers, 0) + 1;
          }
          
          const newNumber = `CT-${currentYear}-${nextNumber.toString().padStart(4, '0')}`;
          setContract(prev => ({ ...prev, contract_number: newNumber }));
        }
      } catch (err) {
        console.error("Load failed", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id, isEditing, leadId]);

  const updateField = (field: keyof Contract, value: any) => {
    setContract(prev => ({ ...prev, [field]: value }));
  };

  const getBase64ImageFromUrl = async (url: string): Promise<string> => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      return '';
    }
  };

  const generatePDF = async (ct: Contract) => {
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = doc.internal.pageSize.width;
    let y = 20;

    // Design: White background, black text
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, doc.internal.pageSize.height, 'F');

    // Load Logo
    let logoBase64 = '';
    try {
      logoBase64 = await getBase64ImageFromUrl('/logo.png');
    } catch (e) {
      console.warn("Logo could not be loaded for PDF", e);
    }

    // Helper functions
    const line = (thickness = 0.2, color = [0, 0, 0]) => {
      doc.setDrawColor(color[0], color[1], color[2]);
      doc.setLineWidth(thickness);
      doc.line(margin, y, pageWidth - margin, y);
      y += 10;
    };

    const addSection = (title: string, content: string) => {
      if (y > 250) { doc.addPage(); y = 20; }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text(title, margin, y);
      y += 7;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      const splitContent = doc.splitTextToSize(content, pageWidth - (margin * 2));
      doc.text(splitContent, margin, y);
      y += (splitContent.length * 5) + 10;
    };

    // 1. Header (Logo & Company Info)
    if (logoBase64) {
      doc.addImage(logoBase64, 'PNG', margin, y, 30, 30);
      y += 5;
    } else {
      // Manual Logo Recreation
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('VIKTOR', margin, y + 10);
      const viktorWidth = doc.getTextWidth('VIKTOR ');
      doc.setTextColor(59, 130, 246); // Blue equivalent
      doc.text('LABS', margin + viktorWidth, y + 10);
      
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text('DIGITAL ARCHITECTURE', margin, y + 15, { charSpace: 2 });
      y += 20;
    }

    // Left Contact Info
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    const contactX = margin;
    let contactY = y + 10;
    
    const contactDetails = [
      { label: 'E-Mail:', value: businessSettings?.business_email || '' },
      { label: 'Tel:', value: businessSettings?.business_phone || '' },
      { label: 'Web:', value: businessSettings?.website || '' },
      { label: 'USt-IdNr:', value: businessSettings?.vat_id || '' }
    ];

    contactDetails.forEach(detail => {
      if (detail.value) {
        doc.setFont('helvetica', 'normal');
        doc.text(detail.label, contactX, contactY);
        doc.text(detail.value, contactX + 20, contactY);
        contactY += 6;
      }
    });

    // Right Meta Info (Table style)
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('VERTRAGSBEILAGE', pageWidth - margin, y + 10, { align: 'right' });
    
    let metaY = y + 25;
    doc.setFontSize(9);
    const metaLabels = [
      ['Vertragsnummer:', ct.contract_number],
      ['Datum:', format(parseISO(ct.contract_date), 'dd.MM.yyyy')],
      ['Projekt:', ct.project_name]
    ];

    metaLabels.forEach(([label, value]) => {
      doc.setFont('helvetica', 'normal');
      doc.text(label, pageWidth - 80, metaY);
      doc.setFont('helvetica', 'bold');
      doc.text(value || '', pageWidth - margin, metaY, { align: 'right' });
      metaY += 6;
    });

    y = Math.max(contactY, metaY) + 10;
    line(0.1, [200, 200, 200]);

    // 2. Title & Parties
    const startY = y;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('DIENSTLEISTER', margin, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.text(businessSettings?.business_name || 'Viktor Labs', margin, y);
    y += 5;
    doc.text(businessSettings?.business_address || '', margin, y);
    
    y = startY;
    doc.setFont('helvetica', 'bold');
    doc.text('AUFTRAGGEBER', pageWidth - 80, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.text(ct.customer_company || '', pageWidth - 80, y);
    y += 5;
    if (ct.customer_name) { doc.text(ct.customer_name, pageWidth - 80, y); y += 5; }
    doc.text(`${ct.customer_zip || ''} ${ct.customer_city || ''}`, pageWidth - 80, y);
    y += 5;
    doc.text(ct.customer_street || '', pageWidth - 80, y);

    y += 20;
    line(0.1, [200, 200, 200]);

    // 3. Sections
    addSection('1. Gegenstand der Beilage', ct.description);
    addSection('2. Leistungsumfang', ct.scope);
    addSection('3. Zeitplan & Ablauf', ct.timeline);
    addSection('4. Mitwirkungspflichten', ct.responsibilities);
    addSection('5. Lieferumfang', ct.deliverables);
    addSection('6. Konditionen', ct.payment_terms);
    
    if (ct.total_price) {
      doc.setFont('helvetica', 'bold');
      doc.text(`Investition: ${formatCurrency(ct.total_price)}`, margin, y);
      y += 15;
    }

    addSection('7. Gewährleistung', ct.warranty);
    addSection('8. Schlussbestimmungen', ct.other_agreements);

    // 4. Signatures
    if (y > 230) { doc.addPage(); y = 30; }
    y += 20;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Ort, Datum:', margin, y);
    doc.text('Ort, Datum:', pageWidth - 80, y);
    y += 25;
    
    doc.line(margin, y, margin + 60, y);
    doc.line(pageWidth - 80, y, pageWidth - 20, y);
    y += 5;
    
    doc.setFont('helvetica', 'bold');
    doc.text(businessSettings?.business_name || 'Viktor Labs', margin, y);
    doc.text(ct.customer_company || '', pageWidth - 80, y);

    // 5. Footer
    const footerY = doc.internal.pageSize.height - 10;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(businessSettings?.business_name || 'Viktor Labs', margin, footerY);
    const labWidth = doc.getTextWidth(businessSettings?.business_name || 'Viktor Labs');
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(' · Digital Architecture', margin + labWidth, footerY);

    doc.text(businessSettings?.website || '', pageWidth / 2 + 10, footerY, { align: 'right' });
    doc.text(businessSettings?.business_phone || '', pageWidth / 2 + 50, footerY, { align: 'right' });
    doc.text(businessSettings?.business_email || '', pageWidth - margin, footerY, { align: 'right' });

    doc.save(`Vertrag_${ct.contract_number}.pdf`);
  };

  const handleSave = async (downloadPDF = false) => {
    setIsSaving(true);
    const finalContract = {
      ...contract,
      id: contract.id || crypto.randomUUID(),
      created_at: contract.created_at || new Date().toISOString()
    } as Contract;

    try {
      await setDoc(doc(db, 'contracts', finalContract.id), finalContract);
      
      const local = localStorage.getItem('viktor_labs_contracts');
      let contracts: Contract[] = local ? JSON.parse(local) : [];
      if (isEditing) {
        contracts = contracts.map(c => c.id === finalContract.id ? finalContract : c);
      } else {
        contracts.unshift(finalContract);
      }
      localStorage.setItem('viktor_labs_contracts', JSON.stringify(contracts));
      
      if (downloadPDF) {
        await generatePDF(finalContract);
      }
      
      if (!isEditing) navigate('/admin/contracts');
      else alert('Vertrag gespeichert');
    } catch (err) {
      console.error(err);
      try { handleFirestoreError(err, OperationType.UPDATE, 'contracts'); } catch(e) {}
      // Local fallback
      const local = localStorage.getItem('viktor_labs_contracts');
      let contracts: Contract[] = local ? JSON.parse(local) : [];
      if (isEditing) {
        contracts = contracts.map(c => c.id === finalContract.id ? finalContract : c);
      } else {
        contracts.unshift(finalContract);
      }
      localStorage.setItem('viktor_labs_contracts', JSON.stringify(contracts));
      if (downloadPDF) await generatePDF(finalContract);
      alert('Lokal gespeichert (Datenbank fehlgeschlagen)');
      if (!isEditing) navigate('/admin/contracts');
    } finally {
      setIsSaving(false);
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
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/contracts')} className="text-slate-400">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-50">
              {isEditing ? 'Vertrag bearbeiten' : 'Neuer Vertrag'}
            </h2>
            <p className="text-slate-400 font-mono text-sm">{contract.contract_number}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => handleSave(false)} isLoading={isSaving} className="bg-cyan-500 text-dark-950 font-bold px-8">
            <Save className="w-4 h-4 mr-2" />
            Speichern
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Content Sections */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Customer & Project */}
          <Card className="border-white/10 bg-dark-900/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-cyan-500" />
                <CardTitle className="text-lg">Kundendaten & Projekt</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Firmenname</label>
                  <Input value={contract.customer_company} onChange={e => updateField('customer_company', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Projektname</label>
                  <Input value={contract.project_name} onChange={e => updateField('project_name', e.target.value)} placeholder="z.B. KI-Integration Plattform" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Ansprechpartner</label>
                  <Input value={contract.customer_name} onChange={e => updateField('customer_name', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">E-Mail</label>
                  <Input type="email" value={contract.customer_email} onChange={e => updateField('customer_email', e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Straße & Hausnummer</label>
                <Input value={contract.customer_street} onChange={e => updateField('customer_street', e.target.value)} />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">PLZ</label>
                  <Input value={contract.customer_zip} onChange={e => updateField('customer_zip', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Ort</label>
                  <Input value={contract.customer_city} onChange={e => updateField('customer_city', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Land</label>
                  <Input value={contract.customer_country} onChange={e => updateField('customer_country', e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contract Content */}
          <Card className="border-white/10 bg-dark-900/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <PenTool className="w-4 h-4 text-cyan-500" />
                <CardTitle className="text-lg">Vertragsinhalt</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">1. Gegenstand (Projektbeschreibung)</label>
                <textarea 
                  className="w-full bg-dark-950 border border-white/10 rounded-xl py-3 px-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 min-h-[100px]"
                  value={contract.description}
                  onChange={e => updateField('description', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">2. Leistungsumfang</label>
                <textarea 
                  className="w-full bg-dark-950 border border-white/10 rounded-xl py-3 px-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 min-h-[150px]"
                  value={contract.scope}
                  onChange={e => updateField('scope', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">3. Projektablauf / Zeitplan</label>
                <textarea 
                  className="w-full bg-dark-950 border border-white/10 rounded-xl py-3 px-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 min-h-[100px]"
                  value={contract.timeline}
                  onChange={e => updateField('timeline', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">4. Mitwirkungspflichten</label>
                <textarea 
                  className="w-full bg-dark-950 border border-white/10 rounded-xl py-3 px-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 min-h-[100px]"
                  value={contract.responsibilities}
                  onChange={e => updateField('responsibilities', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Zahlungsbedingungen</label>
                  <textarea 
                    className="w-full bg-dark-950 border border-white/10 rounded-xl py-3 px-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 min-h-[100px]"
                    value={contract.payment_terms}
                    onChange={e => updateField('payment_terms', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Gewährleistung</label>
                  <textarea 
                    className="w-full bg-dark-950 border border-white/10 rounded-xl py-3 px-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 min-h-[100px]"
                    value={contract.warranty}
                    onChange={e => updateField('warranty', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Meta & Pricing */}
        <div className="space-y-8">
          
          {/* Contract Meta */}
          <Card className="border-white/10 bg-dark-900/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-500" />
                <CardTitle className="text-lg">Vertragsdetails</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Vertragsnummer</label>
                <Input 
                  value={contract.contract_number} 
                  onChange={e => updateField('contract_number', e.target.value)}
                  className="bg-dark-950 font-mono text-cyan-500" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Vertragsart</label>
                <select 
                  className="w-full bg-dark-950 border border-white/10 rounded-xl py-2 px-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  value={contract.contract_type}
                  onChange={e => updateField('contract_type', e.target.value)}
                >
                  <option>Webentwicklung</option>
                  <option>KI-Entwicklung</option>
                  <option>Wartungsvertrag</option>
                  <option>Hosting</option>
                  <option>Beratung</option>
                  <option>Individual-Software</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Vertragsdatum</label>
                <Input type="date" value={contract.contract_date} onChange={e => updateField('contract_date', e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Vertragsbeginn</label>
                <Input type="date" value={contract.start_date} onChange={e => updateField('start_date', e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</label>
                <select 
                  className="w-full bg-dark-950 border border-white/10 rounded-xl py-2 px-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  value={contract.status}
                  onChange={e => updateField('status', e.target.value)}
                >
                  <option value="draft">Entwurf</option>
                  <option value="sent">Gesendet</option>
                  <option value="signed">Unterschrieben</option>
                  <option value="expired">Abgelaufen</option>
                  <option value="cancelled">Storniert</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="border-white/10 bg-dark-900/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-cyan-500" />
                <CardTitle className="text-lg">Konditionen</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Gesamtpreis (optional)</label>
                <div className="relative">
                  <Input type="number" value={contract.total_price} onChange={e => updateField('total_price', parseFloat(e.target.value))} className="pl-8" />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">€</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Stundensatz</label>
                  <Input type="number" value={contract.hourly_rate} onChange={e => updateField('hourly_rate', parseFloat(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Gesch. Stunden</label>
                  <Input type="number" value={contract.estimated_hours} onChange={e => updateField('estimated_hours', parseFloat(e.target.value))} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Zahlungsintervall</label>
                <select 
                  className="w-full bg-dark-950 border border-white/10 rounded-xl py-2 px-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  value={contract.payment_interval}
                  onChange={e => updateField('payment_interval', e.target.value)}
                >
                  <option value="one-time">Einmalig</option>
                  <option value="monthly">Monatlich</option>
                  <option value="yearly">Jährlich</option>
                </select>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
