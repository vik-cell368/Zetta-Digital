import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  ChevronRight, 
  Monitor, 
  Layout, 
  Palette, 
  Zap, 
  Settings, 
  BarChart3, 
  Bot, 
  Globe, 
  Server,
  ArrowRight,
  Sparkles,
  Info,
  Clock,
  Calendar,
  Building2,
  FileText,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

// --- Types ---
interface Option {
  id: string;
  name: string;
  price: number;
  monthly?: boolean;
  desc?: string;
  category: string;
  required?: boolean;
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  options: Option[];
  multiple?: boolean;
}

// --- Data ---
const CONFIG_DATA: Category[] = [
  {
    id: 'base',
    name: '1. Grundpaket (Pflicht)',
    icon: <Monitor className="w-5 h-5" />,
    options: [
      { id: 'p_starter', name: 'Starter Website', price: 550, category: 'base', desc: 'Ideal für einfache Präsenzen' },
      { id: 'p_business', name: 'Business Website', price: 990, category: 'base', desc: 'Der Standard für Unternehmen' },
      { id: 'p_premium', name: 'Premium Website', price: 1490, category: 'base', desc: 'High-End Design & Performance' },
    ],
  },
  {
    id: 'pages',
    name: '2. Zusätzliche Seiten',
    icon: <Layout className="w-5 h-5" />,
    options: [
      { id: 'page_1', name: '+1 Seite', price: 50, category: 'pages' },
      { id: 'page_5', name: '+5 Seiten', price: 220, category: 'pages' },
      { id: 'page_10', name: '+10 Seiten', price: 400, category: 'pages' },
    ],
  },
  {
    id: 'design',
    name: '3. Design & Branding',
    icon: <Palette className="w-5 h-5" />,
    multiple: true,
    options: [
      { id: 'd_branding', name: 'Individuelles Branding', price: 150, category: 'design' },
      { id: 'd_ui', name: 'Premium UI Design', price: 250, category: 'design' },
      { id: 'd_dark', name: 'Dark Mode', price: 80, category: 'design' },
      { id: 'd_logo', name: 'Logo Design', price: 120, category: 'design' },
    ],
  },
  {
    id: 'animations',
    name: '4. Animationen',
    icon: <Zap className="w-5 h-5" />,
    multiple: true,
    options: [
      { id: 'a_2d', name: '2D Animation', price: 80, category: 'animations' },
      { id: 'a_2d_custom', name: 'Individuelle 2D Animation', price: 200, category: 'animations' },
      { id: 'a_3d', name: '3D Animation', price: 180, category: 'animations' },
      { id: 'a_3d_custom', name: 'Individuelle 3D Animation', price: 299, category: 'animations' },
      { id: 'a_sound', name: 'Soundeffekte', price: 79, category: 'animations' },
    ],
  },
  {
    id: 'functions',
    name: '5. Funktionen',
    icon: <Settings className="w-5 h-5" />,
    multiple: true,
    options: [
      { id: 'f_form', name: 'Kontaktformular', price: 0, category: 'functions', desc: 'Inklusive' },
      { id: 'f_maps', name: 'Google Maps', price: 25, category: 'functions' },
      { id: 'f_wa', name: 'WhatsApp Button', price: 30, category: 'functions' },
      { id: 'f_booking', name: 'Terminbuchung', price: 129, category: 'functions' },
      { id: 'f_news', name: 'Newsletter', price: 120, category: 'functions' },
      { id: 'f_blog', name: 'Blog', price: 150, category: 'functions' },
      { id: 'f_lang', name: 'Mehrsprachigkeit', price: 200, category: 'functions' },
      { id: 'f_cookie', name: 'Cookie Banner', price: 0, category: 'functions', desc: 'Inklusive' },
    ],
  },
  {
    id: 'marketing',
    name: '6. Marketing',
    icon: <BarChart3 className="w-5 h-5" />,
    multiple: true,
    options: [
      { id: 'm_rev', name: 'Google Bewertungen', price: 99, category: 'marketing' },
      { id: 'm_social', name: 'Social Media Verbindung', price: 70, category: 'marketing', monthly: true, desc: '70€ / Monat' },
      { id: 'm_insta', name: 'Instagram Feed', price: 70, category: 'marketing' },
      { id: 'm_fb', name: 'Facebook Feed', price: 70, category: 'marketing' },
      { id: 'm_seo_base', name: 'SEO Basis', price: 150, category: 'marketing' },
      { id: 'm_seo_premium', name: 'Premium SEO', price: 390, category: 'marketing' },
      { id: 'm_analytics', name: 'Google Analytics', price: 70, category: 'marketing' },
    ],
  },
  {
    id: 'ai',
    name: '7. KI & Automation',
    icon: <Bot className="w-5 h-5" />,
    multiple: true,
    options: [
      { id: 'ai_bot', name: 'Chatbot Einrichtung', price: 299, category: 'ai' },
      { id: 'ai_data', name: 'Chatbot Datenpflege', price: 15, category: 'ai', desc: 'je Datensatz' },
      { id: 'ai_form', name: 'Kontaktformular-KI', price: 25, category: 'ai', monthly: true, desc: '25€ / Monat' },
      { id: 'ai_email', name: 'Email Automation', price: 49, category: 'ai', monthly: true, desc: '49€ / Monat' },
      { id: 'ai_sheets', name: 'Google Sheets Automation', price: 49, category: 'ai', monthly: true, desc: '49€ / Monat' },
      { id: 'ai_sm_auto', name: 'Social Media Automation', price: 49, category: 'ai', monthly: true, desc: '49€ / Monat' },
      { id: 'ai_crm', name: 'CRM Automation', price: 79, category: 'ai', monthly: true, desc: '79€ / Monat' },
      { id: 'ai_wa_auto', name: 'WhatsApp Automation', price: 79, category: 'ai', monthly: true, desc: '79€ / Monat' },
    ],
  },
  {
    id: 'maintenance',
    name: '8. Verwaltung',
    icon: <Globe className="w-5 h-5" />,
    options: [
      { id: 'v_none', name: 'Keine', price: 0, category: 'maintenance' },
      { id: 'v_standard', name: 'Standard Verwaltung', price: 59, category: 'maintenance', monthly: true, desc: '59€ / Monat' },
      { id: 'v_komplett', name: 'Komplett Verwaltung', price: 99, category: 'maintenance', monthly: true, desc: '99€ / Monat' },
    ],
  },
  {
    id: 'hosting',
    name: '9. Domain & Hosting',
    icon: <Server className="w-5 h-5" />,
    multiple: true,
    options: [
      { id: 'h_vercel', name: 'Vercel Subdomain', price: 0, category: 'hosting', desc: 'Kostenlos' },
      { id: 'h_de', name: '.de Domain', price: 0, category: 'hosting', desc: 'nach Anbieter' },
      { id: 'h_com', name: '.com Domain', price: 0, category: 'hosting', desc: 'nach Anbieter' },
      { id: 'h_setup', name: 'Hosting Einrichtung', price: 0, category: 'hosting', desc: 'Inklusive' },
    ],
  },
];

export default function Configurator() {
  const navigate = useNavigate();
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [step, setStep] = useState<'config' | 'details' | 'result'>('config');
  const [formData, setFormData] = useState({
    industry: '',
    size: '',
    startDate: '',
    name: '',
    email: '',
    phone: '',
    message: '',
    company: ''
  });

  const toggleOption = (category: string, optionId: string, multiple?: boolean) => {
    setSelections(prev => {
      const current = prev[category] || [];
      if (multiple) {
        if (current.includes(optionId)) {
          return { ...prev, [category]: current.filter(id => id !== optionId) };
        } else {
          return { ...prev, [category]: [...current, optionId] };
        }
      } else {
        return { ...prev, [category]: [optionId] };
      }
    });
  };

  const selectedOptions = useMemo(() => {
    const list: Option[] = [];
    Object.entries(selections).forEach(([catId, optIds]) => {
      const cat = CONFIG_DATA.find(c => c.id === catId);
      if (cat) {
        optIds.forEach(id => {
          const opt = cat.options.find(o => o.id === id);
          if (opt) list.push(opt);
        });
      }
    });
    return list;
  }, [selections]);

  const totals = useMemo(() => {
    return selectedOptions.reduce(
      (acc, curr) => {
        if (curr.monthly) acc.monthly += curr.price;
        else acc.oneTime += curr.price;
        return acc;
      },
      { oneTime: 0, monthly: 0 }
    );
  }, [selectedOptions]);

  const handleNext = () => {
    if (!selections['base'] || selections['base'].length === 0) {
      alert("Bitte wählen Sie zuerst ein Grundpaket aus.");
      return;
    }
    setStep('details');
    window.scrollTo(0, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('result');
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 bg-dark-950">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 text-[10px] uppercase tracking-widest font-bold mb-6"
          >
            <Sparkles className="w-3 h-3" />
            Live Preisrechner
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-display font-bold text-slate-50 mb-6 tracking-tight"
          >
            Konfigurieren Sie Ihr <span className="text-cyan-500 text-glow">Projekt</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Wählen Sie Ihre gewünschten Leistungen aus und erhalten Sie sofort eine transparente Preiskalkulation in Echtzeit.
          </motion.p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Main Content Area */}
          <div className="flex-1 space-y-16 w-full">
            <AnimatePresence mode="wait">
              {step === 'config' && (
                <motion.div
                  key="config"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-16"
                >
                  {CONFIG_DATA.map((category) => (
                    <section key={category.id} className="space-y-6">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                          {category.icon}
                        </div>
                        <h2 className="text-2xl font-display font-bold text-slate-50">{category.name}</h2>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {category.options.map((option) => {
                          const isSelected = (selections[category.id] || []).includes(option.id);
                          return (
                            <button
                              key={option.id}
                              onClick={() => toggleOption(category.id, option.id, category.multiple)}
                              className={`text-left p-6 rounded-[2rem] border transition-all relative group h-full flex flex-col ${
                                isSelected 
                                  ? 'bg-cyan-500/10 border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.1)]' 
                                  : 'bg-dark-900 border-white/5 hover:border-white/10'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span className={`text-lg font-bold ${isSelected ? 'text-cyan-500' : 'text-slate-50'}`}>
                                  {option.name}
                                </span>
                                {isSelected && (
                                  <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center">
                                    <Check className="w-4 h-4 text-dark-950" />
                                  </div>
                                )}
                              </div>
                              <p className="text-slate-500 text-xs mb-6 flex-1">{option.desc || (category.multiple ? 'Optional' : '')}</p>
                              <div className="flex justify-end items-center mt-auto">
                                <span className="text-xl font-display font-bold text-slate-50">
                                  {option.price === 0 ? 'inkl.' : `${option.price}€`}
                                  {option.monthly && <span className="text-xs text-slate-500 ml-1">/ Mo.</span>}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </section>
                  ))}
                </motion.div>
              )}

              {step === 'details' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="max-w-3xl mx-auto"
                >
                  <button onClick={() => setStep('config')} className="text-gray-500 hover:text-white flex items-center gap-2 mb-8 group">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Zurück zur Konfiguration
                  </button>

                  <div className="bg-dark-900 border border-white/10 rounded-[3rem] p-10 md:p-16 shadow-2xl">
                    <div className="mb-12">
                      <h2 className="text-3xl font-display font-bold text-slate-50 mb-4">Fast geschafft.</h2>
                      <p className="text-slate-400">Geben Sie uns noch ein paar Informationen, damit wir Ihr individuelles Angebot finalisieren können.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <label className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                            <Building2 className="w-3 h-3" /> Branche
                          </label>
                          <Input 
                            placeholder="z.B. Gastronomie" 
                            required
                            className="h-14 rounded-2xl bg-dark-950 border-white/5"
                            value={formData.industry}
                            onChange={e => setFormData({...formData, industry: e.target.value})}
                          />
                        </div>
                        <div className="space-y-4">
                          <label className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                            <Building2 className="w-3 h-3" /> Unternehmen
                          </label>
                          <Input 
                            placeholder="Ihr Firmenname" 
                            required
                            className="h-14 rounded-2xl bg-dark-950 border-white/5"
                            value={formData.company}
                            onChange={e => setFormData({...formData, company: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <label className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                            <Globe className="w-3 h-3" /> Unternehmensgröße
                          </label>
                          <Input 
                            placeholder="z.B. 1-10 Mitarbeiter" 
                            required
                            className="h-14 rounded-2xl bg-dark-950 border-white/5"
                            value={formData.size}
                            onChange={e => setFormData({...formData, size: e.target.value})}
                          />
                        </div>
                        <div className="space-y-4">
                          <label className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                            <Calendar className="w-3 h-3" /> Gewünschter Start
                          </label>
                          <Input 
                            type="date" 
                            required
                            className="h-14 rounded-2xl bg-dark-950 border-white/5"
                            value={formData.startDate}
                            onChange={e => setFormData({...formData, startDate: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div className="pt-12 border-t border-white/5 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <Input 
                            placeholder="Vollständiger Name" 
                            required
                            className="h-14 rounded-2xl bg-dark-950 border-white/5"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                          />
                          <Input 
                            type="email" 
                            placeholder="E-Mail Adresse" 
                            required
                            className="h-14 rounded-2xl bg-dark-950 border-white/5"
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                          />
                        </div>
                        <Input 
                          placeholder="Telefonnummer (optional)" 
                          className="h-14 rounded-2xl bg-dark-950 border-white/5"
                          value={formData.phone}
                          onChange={e => setFormData({...formData, phone: e.target.value})}
                        />
                        <Textarea 
                          placeholder="Ihre Nachricht oder spezielle Wünsche..." 
                          className="rounded-3xl bg-dark-950 border-white/5 p-6"
                          rows={4}
                          value={formData.message}
                          onChange={e => setFormData({...formData, message: e.target.value})}
                        />
                      </div>

                      <Button type="submit" className="w-full h-20 bg-cyan-500 text-dark-950 font-bold text-xl rounded-3xl shadow-[0_0_50px_rgba(212,175,55,0.2)] group hover:bg-gold-400">
                        Individuelles Angebot erstellen
                        <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </form>
                  </div>
                </motion.div>
              )}

              {step === 'result' && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-4xl mx-auto"
                >
                  <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-[3rem] p-12 text-center mb-12">
                    <div className="w-20 h-20 bg-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(6,182,212,0.3)]">
                      <Check className="w-12 h-12 text-dark-950" />
                    </div>
                    <h2 className="text-4xl font-display font-bold text-slate-50 mb-4">Anfrage erfolgreich!</h2>
                    <p className="text-slate-400 text-lg">Vielen Dank für Ihr Vertrauen. Hier ist Ihr vorläufiges Projekt-Angebot.</p>
                  </div>

                  <div className="bg-white text-dark-950 rounded-[3rem] overflow-hidden shadow-2xl relative">
                    {/* Visual Watermark / Logo */}
                    <div className="absolute top-10 right-10 opacity-10 pointer-events-none select-none">
                      <span className="font-display font-bold text-6xl tracking-tighter uppercase text-slate-900">Viktor Labs</span>
                    </div>

                    <div className="bg-dark-950 p-8 flex justify-between items-center">
                      <div className="text-white">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-cyan-500">Projekt ID</span>
                        <div className="text-sm font-mono text-cyan-500/80 uppercase">VIKTOR-OFFER-{Math.random().toString(36).substr(2, 6).toUpperCase()}</div>
                      </div>
                      <div className="text-right text-white">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-cyan-500">Datum</span>
                        <div className="text-sm font-mono text-cyan-500/80">{new Date().toLocaleDateString('de-DE')}</div>
                      </div>
                    </div>

                    <div className="p-12 md:p-20 space-y-12">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                        <div className="space-y-8">
                          <div>
                            <h3 className="text-xs uppercase font-bold text-gray-400 tracking-widest mb-6">Gewählte Leistungen</h3>
                            <ul className="space-y-4">
                              {selectedOptions.map(opt => (
                                <li key={opt.id} className="flex justify-between items-center group">
                                  <span className="text-dark-950 font-bold flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-cyan-500" />
                                    {opt.name}
                                  </span>
                                  <span className="text-gray-500 font-mono text-sm">{opt.price} €{opt.monthly ? '*' : ''}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
                            <h4 className="text-xs uppercase font-bold text-gray-400 tracking-widest mb-4">Zeitplan</h4>
                            <div className="flex items-center gap-3 text-dark-950 font-bold">
                              <Clock className="w-5 h-5 text-cyan-500" />
                              2–3 Wochen bis Launch
                            </div>
                          </div>
                        </div>

                        <div className="space-y-8">
                          <div className="bg-dark-950 p-10 rounded-[2.5rem] text-white space-y-8 shadow-xl">
                            <div>
                              <span className="text-[10px] uppercase text-cyan-500 tracking-widest font-bold block mb-2">Einmalige Investition</span>
                              <div className="text-5xl font-display font-bold">{totals.oneTime} €</div>
                            </div>
                            <div>
                              <span className="text-[10px] uppercase text-slate-500 tracking-widest font-bold block mb-2">Monatliche Gebühr</span>
                              <div className="text-3xl font-display font-bold text-slate-300">{totals.monthly} €</div>
                            </div>
                            <div className="pt-8 border-t border-white/5">
                              <span className="text-[10px] uppercase text-slate-500 tracking-widest font-bold block mb-2">Nächster Schritt</span>
                              <div className="text-cyan-500 font-bold flex items-center gap-2">
                                Kostenloses Beratungsgespräch <ArrowRight className="w-4 h-4" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-sm text-gray-400 italic">
                          * Monatliche Kosten beginnen erst nach Projektabnahme.
                        </div>
                        <Button className="h-14 px-8 bg-dark-950 text-white rounded-2xl flex items-center gap-3 group">
                          <FileText className="w-5 h-5" />
                          Angebot als PDF laden
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 text-center">
                    <p className="text-gray-500 text-sm mb-8">Wir haben Ihnen die Zusammenfassung auch per E-Mail gesendet.</p>
                    <Button variant="outline" onClick={() => navigate('/')} className="text-white border-white/10 hover:bg-white/5">
                      Zurück zur Startseite
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar / Summary - STICKY */}
          {step === 'config' && (
            <div className="lg:w-[420px] w-full lg:sticky lg:top-32">
              <div className="bg-dark-900 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-2xl">
                <h3 className="text-xl font-display font-bold text-slate-50 mb-8 flex items-center gap-3">
                  <BarChart3 className="w-6 h-6 text-cyan-500" />
                  Konfiguration
                </h3>
                
                <div className="space-y-6 mb-10 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {selectedOptions.length === 0 ? (
                    <p className="text-slate-500 text-center py-10 italic">Noch keine Optionen gewählt.</p>
                  ) : (
                    selectedOptions.map(opt => (
                      <div key={opt.id} className="flex justify-between items-start gap-4">
                        <div className="text-sm text-slate-400 font-medium">{opt.name}</div>
                        <div className="text-slate-50 font-mono text-sm whitespace-nowrap">{opt.price} €</div>
                      </div>
                    ))
                  )}
                </div>

                <div className="space-y-6 pt-8 border-t border-white/10">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-[10px] uppercase text-slate-500 tracking-widest font-bold block mb-1">Einmalig</span>
                      <div className="text-4xl font-display font-bold text-cyan-500">{totals.oneTime} €</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase text-slate-500 tracking-widest font-bold block mb-1">Monatlich</span>
                      <div className="text-2xl font-display font-bold text-slate-50">{totals.monthly} €</div>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleNext}
                  disabled={selectedOptions.length === 0}
                  className="w-full h-20 mt-10 bg-white text-dark-950 font-bold rounded-3xl text-xl shadow-[0_0_30px_rgba(255,255,255,0.1)] group hover:bg-cyan-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Jetzt Angebot erhalten
                  <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Button>

                <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                  <Info className="w-3 h-3" />
                  Preise zzgl. 19% MwSt.
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
