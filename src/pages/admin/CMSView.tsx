import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Save, 
  Layout, 
  Type, 
  MousePointer2, 
  Layers, 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  Plus,
  Eye,
  EyeOff,
  Check,
  CheckCircle2,
  Sparkles,
  Zap,
  RotateCcw,
  Box,
  Globe,
  FileText
} from 'lucide-react';

export interface SectionItem {
  id: string;
  name: string;
  type: string;
  visible: boolean;
}

export interface SiteConfig {
  sections: SectionItem[];
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    primaryBtn: string;
    secondaryBtn: string;
  };
  vision: {
    badge: string;
    title: string;
    subtitle: string;
    card1Title: string;
    card1Desc: string;
    card2Title: string;
    card2Desc: string;
  };
  expertise: {
    badge: string;
    title: string;
    card1Title: string;
    card1Desc: string;
    card2Title: string;
    card2Desc: string;
    card3Title: string;
    card3Desc: string;
  };
  cta: {
    title: string;
    subtitle: string;
    btnText: string;
  };
  customSections: Record<string, {
    title: string;
    subtitle: string;
    content: string;
    btnText?: string;
  }>;
}

const DEFAULT_CONFIG: SiteConfig = {
  sections: [
    { id: 'hero', name: 'Hero / Start-Header', type: 'Header', visible: true },
    { id: 'vision', name: 'Vision & Mehrwert', type: 'Philosophie', visible: true },
    { id: 'expertise', name: 'Unsere Leistungen', type: 'Angebote', visible: true },
    { id: 'cta', name: 'Finaler Call to Action', type: 'Footer', visible: true }
  ],
  hero: {
    badge: 'Digital Architecture & AI Motion',
    title: 'DIE ZUKUNFT DES WEB... NEU DEFINIERT',
    subtitle: 'Hochperformante Web-Architektur trifft auf immersive Ästhetik. Wir entwickeln intelligente Lösungen für Unternehmen, die den Standard im Netz setzen wollen.',
    primaryBtn: 'Erstgespräch buchen',
    secondaryBtn: 'Leistungen entdecken'
  },
  vision: {
    badge: 'Viktor Labs Vision',
    title: 'ÄSTHETIK TRIFFT WIRTSCHAFT.',
    subtitle: 'Eine Website ist längst keine digitale Visitenkarte mehr, sondern Ihr stärkster digitaler Vertriebskanal.',
    card1Title: 'Absolute Transparenz',
    card1Desc: 'Faire Festpreise, modulare Optionen und null versteckte Kosten.',
    card2Title: 'Immersive Ästhetik',
    card2Desc: 'Modernstes Design und flüssige 3D-Interaktionen, die Besucher binden.'
  },
  expertise: {
    badge: 'Expertise',
    title: 'UNSERE LEISTUNGEN.',
    card1Title: 'HIGH-END WEBDESIGN',
    card1Desc: 'Von minimalistischem Schwarz-Weiß bis hin zu lebendigen, interaktiven Markenwelten.',
    card2Title: 'Motion & 3D',
    card2Desc: 'Hochwertige Animationen, die Ihre Produkte greifbar machen.',
    card3Title: 'Management',
    card3Desc: 'Ihr Vertriebsteam, 24/7 im digitalen Einsatz.'
  },
  cta: {
    title: 'BEREIT FÜR DEN VORSPRUNG?',
    subtitle: 'Lassen Sie uns gemeinsam eine digitale Präsenz erschaffen, die Ihre Kunden begeistert.',
    btnText: 'Erstgespräch buchen'
  },
  customSections: {}
};

export default function CMSView() {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [editingId, setEditingId] = useState<string>('hero');
  const [hasChanges, setHasChanges] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const configDoc = await getDoc(doc(db, 'settings', 'site_config'));
        if (configDoc.exists()) {
          const parsed = configDoc.data() as SiteConfig;
          setConfig({
            ...DEFAULT_CONFIG,
            ...parsed,
            sections: parsed.sections && parsed.sections.length > 0 ? parsed.sections : DEFAULT_CONFIG.sections,
            hero: { ...DEFAULT_CONFIG.hero, ...parsed.hero },
            vision: { ...DEFAULT_CONFIG.vision, ...parsed.vision },
            expertise: { ...DEFAULT_CONFIG.expertise, ...parsed.expertise },
            cta: { ...DEFAULT_CONFIG.cta, ...parsed.cta },
            customSections: parsed.customSections || {}
          });
          localStorage.setItem('viktor_labs_site_config', JSON.stringify(parsed));
        } else {
          const savedConfig = localStorage.getItem('viktor_labs_site_config');
          if (savedConfig) {
            const parsed = JSON.parse(savedConfig);
            setConfig({
              ...DEFAULT_CONFIG,
              ...parsed
            });
          }
        }
      } catch (err) {
        console.warn("Failed fetching site config from Firebase", err);
        handleFirestoreError(err, OperationType.GET, 'settings/site_config');
        const savedConfig = localStorage.getItem('viktor_labs_site_config');
        if (savedConfig) {
          try {
            const parsed = JSON.parse(savedConfig);
            setConfig({ ...DEFAULT_CONFIG, ...parsed });
          } catch (e) {}
        }
      }
    };
    fetchConfig();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = async () => {
    try {
      await setDoc(doc(db, 'settings', 'site_config'), config);
      localStorage.setItem('viktor_labs_site_config', JSON.stringify(config));
      setHasChanges(false);
      showToast("Seitenstruktur & Inhalte gespeichert!");
    } catch (err) {
      console.error("Save failed", err);
      handleFirestoreError(err, OperationType.UPDATE, 'settings/site_config');
      localStorage.setItem('viktor_labs_site_config', JSON.stringify(config));
      setHasChanges(false);
      showToast("Lokal gespeichert (Firebase fehlgeschlagen)");
    }
  };

  const handleResetDefaults = () => {
    if (confirm("Möchten Sie alle CMS-Einstellungen auf den Standardzustand zurücksetzen?")) {
      setConfig(DEFAULT_CONFIG);
      localStorage.removeItem('viktor_labs_site_config');
      setHasChanges(false);
      showToast("Standard-Einstellungen wiederhergestellt");
    }
  };

  // Section Reordering & Visibility
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...config.sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    setConfig(prev => ({ ...prev, sections: newSections }));
    setHasChanges(true);
  };

  const toggleVisibility = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConfig(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === id ? { ...s, visible: !s.visible } : s)
    }));
    setHasChanges(true);
  };

  const addCustomSection = () => {
    const customId = 'custom_' + Date.now();
    const newSection: SectionItem = {
      id: customId,
      name: 'Neue Eigene Sektion',
      type: 'Benutzerdefiniert',
      visible: true
    };

    setConfig(prev => ({
      ...prev,
      sections: [...prev.sections, newSection],
      customSections: {
        ...prev.customSections,
        [customId]: {
          title: 'Ihre neue Überschrift',
          subtitle: 'Ein kurzer Beschreibungstext für Ihre Besucher.',
          content: 'Fügen Sie hier Ihren ausführlichen Text oder Details ein.',
          btnText: 'Erstgespräch buchen'
        }
      }
    }));

    setEditingId(customId);
    setHasChanges(true);
    showToast("Neue Sektion hinzugefügt");
  };

  const deleteSection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (id === 'hero') {
      alert("Die Hero Section darf nicht gelöscht werden.");
      return;
    }
    if (!confirm("Möchten Sie diese Sektion aus der Struktur entfernen?")) return;

    setConfig(prev => {
      const updatedCustom = { ...prev.customSections };
      delete updatedCustom[id];
      return {
        ...prev,
        sections: prev.sections.filter(s => s.id !== id),
        customSections: updatedCustom
      };
    });

    if (editingId === id) setEditingId('hero');
    setHasChanges(true);
    showToast("Sektion gelöscht");
  };

  return (
    <div className="space-y-10 relative">
      {/* Toast */}
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

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-50 mb-2">Seiten-Struktur & CMS</h1>
          <p className="text-slate-500 text-xs md:text-sm">Bearbeiten Sie Texte, Reihenfolge und Sichtbarkeit aller Sektionen auf der Website.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleResetDefaults}
            title="Zurücksetzen"
            className="h-10 md:h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
          >
            <RotateCcw size={14} />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button 
            onClick={handleSave}
            disabled={!hasChanges}
            className={`h-10 md:h-12 px-6 md:px-8 rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${
              hasChanges ? 'bg-cyan-500 text-dark-950 shadow-cyan-500/20 scale-105' : 'bg-white/5 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Save size={14} />
            Änderungen Speichern
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Structure Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card rounded-[2.5rem] border-white/10 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 flex items-center gap-2">
                <Layers size={14} className="text-cyan-400" />
                Seitenstruktur (Reihenfolge)
              </span>
              <button 
                onClick={addCustomSection}
                className="p-2.5 rounded-xl bg-cyan-500 text-dark-950 font-bold hover:bg-cyan-400 transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1 text-xs"
                title="Sektion hinzufügen"
              >
                <Plus size={16} />
                <span className="text-[10px] uppercase tracking-wider font-extrabold">Hinzufügen</span>
              </button>
            </div>

            <div className="p-4 space-y-3">
              {config.sections.map((section, i) => (
                <div 
                  key={section.id}
                  onClick={() => setEditingId(section.id)}
                  className={`p-3 md:p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                    editingId === section.id 
                      ? 'bg-cyan-500/10 border-cyan-500/50 shadow-lg shadow-cyan-500/5' 
                      : section.visible ? 'bg-dark-950 border-white/5 hover:border-white/20' : 'bg-dark-950/40 border-white/5 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-xs font-bold text-slate-400 group-hover:text-cyan-400 shrink-0">
                      {i + 1}
                    </div>
                    <div className="min-w-0">
                      <div className={`text-xs md:text-sm font-bold truncate ${editingId === section.id ? 'text-cyan-400' : 'text-slate-200'}`}>
                        {section.name}
                      </div>
                      <div className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">
                        {section.type} • {section.visible ? 'Aktiv' : 'Ausgeblendet'}
                      </div>
                    </div>
                  </div>

                  {/* Actions: Move, Toggle, Delete */}
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); moveSection(i, 'up'); }}
                      disabled={i === 0}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-slate-500 hover:text-slate-200 disabled:opacity-20 transition-all"
                      title="Nach oben verschieben"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); moveSection(i, 'down'); }}
                      disabled={i === config.sections.length - 1}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-slate-500 hover:text-slate-200 disabled:opacity-20 transition-all"
                      title="Nach unten verschieben"
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button
                      onClick={(e) => toggleVisibility(section.id, e)}
                      className={`p-1.5 rounded-lg transition-all ${
                        section.visible ? 'text-cyan-400 hover:bg-cyan-500/10' : 'text-slate-600 hover:text-slate-300'
                      }`}
                      title={section.visible ? 'Ausblenden' : 'Einblenden'}
                    >
                      {section.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    {section.id !== 'hero' && (
                      <button
                        onClick={(e) => deleteSection(section.id, e)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                        title="Löschen"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Editor Panel */}
        <div className="lg:col-span-7 space-y-8">
          <AnimatePresence mode="wait">
            {/* HERO SECTION EDITOR */}
            {editingId === 'hero' && (
              <motion.div
                key="hero"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card rounded-[2.5rem] border-white/10 overflow-hidden shadow-2xl"
              >
                <div className="p-6 md:p-8 border-b border-white/5 bg-gradient-to-br from-white/5 to-transparent flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                      <Layout size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-50">Hero / Start-Header</h3>
                      <p className="text-xs text-slate-500">Ihre Hauptbotschaft ganz oben auf der Homepage</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-8 space-y-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">
                      Top-Badge (Kleine Zeile oben)
                    </label>
                    <input 
                      type="text"
                      value={config.hero.badge}
                      onChange={(e) => {
                        setConfig(prev => ({ ...prev, hero: { ...prev.hero, badge: e.target.value } }));
                        setHasChanges(true);
                      }}
                      className="w-full bg-dark-950 border border-white/10 rounded-xl px-4 h-11 text-xs text-white focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">
                      Haupt-Überschrift (Groß)
                    </label>
                    <textarea 
                      rows={2}
                      value={config.hero.title}
                      onChange={(e) => {
                        setConfig(prev => ({ ...prev, hero: { ...prev.hero, title: e.target.value } }));
                        setHasChanges(true);
                      }}
                      className="w-full bg-dark-950 border border-white/10 rounded-xl p-4 text-sm text-white font-display font-bold focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">
                      Untertitel / Beschreibung
                    </label>
                    <textarea 
                      rows={3}
                      value={config.hero.subtitle}
                      onChange={(e) => {
                        setConfig(prev => ({ ...prev, hero: { ...prev.hero, subtitle: e.target.value } }));
                        setHasChanges(true);
                      }}
                      className="w-full bg-dark-950 border border-white/10 rounded-xl p-4 text-xs text-slate-300 focus:border-cyan-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">
                        Haupt-Button Text
                      </label>
                      <input 
                        type="text"
                        value={config.hero.primaryBtn}
                        onChange={(e) => {
                          setConfig(prev => ({ ...prev, hero: { ...prev.hero, primaryBtn: e.target.value } }));
                          setHasChanges(true);
                        }}
                        className="w-full bg-dark-950 border border-white/10 rounded-xl px-4 h-11 text-xs text-white focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">
                        Zweiter Button Text
                      </label>
                      <input 
                        type="text"
                        value={config.hero.secondaryBtn}
                        onChange={(e) => {
                          setConfig(prev => ({ ...prev, hero: { ...prev.hero, secondaryBtn: e.target.value } }));
                          setHasChanges(true);
                        }}
                        className="w-full bg-dark-950 border border-white/10 rounded-xl px-4 h-11 text-xs text-white focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* VISION SECTION EDITOR */}
            {editingId === 'vision' && (
              <motion.div
                key="vision"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card rounded-[2.5rem] border-white/10 overflow-hidden shadow-2xl"
              >
                <div className="p-6 md:p-8 border-b border-white/5 bg-gradient-to-br from-white/5 to-transparent flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-50">Vision & Vorteile</h3>
                      <p className="text-xs text-slate-500">Präsentieren Sie Ihre Philosophie und Nutzenversprechen</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-8 space-y-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">
                      Kategorie / Badge
                    </label>
                    <input 
                      type="text"
                      value={config.vision.badge}
                      onChange={(e) => {
                        setConfig(prev => ({ ...prev, vision: { ...prev.vision, badge: e.target.value } }));
                        setHasChanges(true);
                      }}
                      className="w-full bg-dark-950 border border-white/10 rounded-xl px-4 h-11 text-xs text-white focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">
                      Sektions-Überschrift
                    </label>
                    <input 
                      type="text"
                      value={config.vision.title}
                      onChange={(e) => {
                        setConfig(prev => ({ ...prev, vision: { ...prev.vision, title: e.target.value } }));
                        setHasChanges(true);
                      }}
                      className="w-full bg-dark-950 border border-white/10 rounded-xl px-4 h-11 text-xs text-white font-bold focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">
                      Beschreibungstext
                    </label>
                    <textarea 
                      rows={2}
                      value={config.vision.subtitle}
                      onChange={(e) => {
                        setConfig(prev => ({ ...prev, vision: { ...prev.vision, subtitle: e.target.value } }));
                        setHasChanges(true);
                      }}
                      className="w-full bg-dark-950 border border-white/10 rounded-xl p-4 text-xs text-slate-300 focus:border-cyan-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    <div className="space-y-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="text-xs font-bold text-cyan-400">Vorteil 1</div>
                      <input 
                        type="text"
                        placeholder="Titel Vorteil 1"
                        value={config.vision.card1Title}
                        onChange={(e) => {
                          setConfig(prev => ({ ...prev, vision: { ...prev.vision, card1Title: e.target.value } }));
                          setHasChanges(true);
                        }}
                        className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 h-10 text-xs text-white"
                      />
                      <textarea 
                        rows={2}
                        placeholder="Beschreibung Vorteil 1"
                        value={config.vision.card1Desc}
                        onChange={(e) => {
                          setConfig(prev => ({ ...prev, vision: { ...prev.vision, card1Desc: e.target.value } }));
                          setHasChanges(true);
                        }}
                        className="w-full bg-dark-950 border border-white/10 rounded-xl p-3 text-xs text-slate-300"
                      />
                    </div>

                    <div className="space-y-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="text-xs font-bold text-cyan-400">Vorteil 2</div>
                      <input 
                        type="text"
                        placeholder="Titel Vorteil 2"
                        value={config.vision.card2Title}
                        onChange={(e) => {
                          setConfig(prev => ({ ...prev, vision: { ...prev.vision, card2Title: e.target.value } }));
                          setHasChanges(true);
                        }}
                        className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 h-10 text-xs text-white"
                      />
                      <textarea 
                        rows={2}
                        placeholder="Beschreibung Vorteil 2"
                        value={config.vision.card2Desc}
                        onChange={(e) => {
                          setConfig(prev => ({ ...prev, vision: { ...prev.vision, card2Desc: e.target.value } }));
                          setHasChanges(true);
                        }}
                        className="w-full bg-dark-950 border border-white/10 rounded-xl p-3 text-xs text-slate-300"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* EXPERTISE SECTION EDITOR */}
            {editingId === 'expertise' && (
              <motion.div
                key="expertise"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card rounded-[2.5rem] border-white/10 overflow-hidden shadow-2xl"
              >
                <div className="p-6 md:p-8 border-b border-white/5 bg-gradient-to-br from-white/5 to-transparent flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                      <Box size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-50">Unsere Leistungen Showcase</h3>
                      <p className="text-xs text-slate-500">Bento-Grid Übersicht der Hauptleistungen</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-8 space-y-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">
                      Überschrift
                    </label>
                    <input 
                      type="text"
                      value={config.expertise.title}
                      onChange={(e) => {
                        setConfig(prev => ({ ...prev, expertise: { ...prev.expertise, title: e.target.value } }));
                        setHasChanges(true);
                      }}
                      className="w-full bg-dark-950 border border-white/10 rounded-xl px-4 h-11 text-xs text-white font-bold"
                    />
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                      <span className="text-xs font-bold text-cyan-400">Haupt-Kachel 1 (High-End Webdesign)</span>
                      <input 
                        type="text"
                        value={config.expertise.card1Title}
                        onChange={(e) => {
                          setConfig(prev => ({ ...prev, expertise: { ...prev.expertise, card1Title: e.target.value } }));
                          setHasChanges(true);
                        }}
                        className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 h-10 text-xs text-white"
                      />
                      <textarea 
                        rows={2}
                        value={config.expertise.card1Desc}
                        onChange={(e) => {
                          setConfig(prev => ({ ...prev, expertise: { ...prev.expertise, card1Desc: e.target.value } }));
                          setHasChanges(true);
                        }}
                        className="w-full bg-dark-950 border border-white/10 rounded-xl p-3 text-xs text-slate-300"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                        <span className="text-xs font-bold text-cyan-400">Kachel 2 (Motion & 3D)</span>
                        <input 
                          type="text"
                          value={config.expertise.card2Title}
                          onChange={(e) => {
                            setConfig(prev => ({ ...prev, expertise: { ...prev.expertise, card2Title: e.target.value } }));
                            setHasChanges(true);
                          }}
                          className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 h-10 text-xs text-white"
                        />
                        <textarea 
                          rows={2}
                          value={config.expertise.card2Desc}
                          onChange={(e) => {
                            setConfig(prev => ({ ...prev, expertise: { ...prev.expertise, card2Desc: e.target.value } }));
                            setHasChanges(true);
                          }}
                          className="w-full bg-dark-950 border border-white/10 rounded-xl p-3 text-xs text-slate-300"
                        />
                      </div>

                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                        <span className="text-xs font-bold text-cyan-400">Kachel 3 (Management)</span>
                        <input 
                          type="text"
                          value={config.expertise.card3Title}
                          onChange={(e) => {
                            setConfig(prev => ({ ...prev, expertise: { ...prev.expertise, card3Title: e.target.value } }));
                            setHasChanges(true);
                          }}
                          className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 h-10 text-xs text-white"
                        />
                        <textarea 
                          rows={2}
                          value={config.expertise.card3Desc}
                          onChange={(e) => {
                            setConfig(prev => ({ ...prev, expertise: { ...prev.expertise, card3Desc: e.target.value } }));
                            setHasChanges(true);
                          }}
                          className="w-full bg-dark-950 border border-white/10 rounded-xl p-3 text-xs text-slate-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* CTA SECTION EDITOR */}
            {editingId === 'cta' && (
              <motion.div
                key="cta"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card rounded-[2.5rem] border-white/10 overflow-hidden shadow-2xl"
              >
                <div className="p-6 md:p-8 border-b border-white/5 bg-gradient-to-br from-white/5 to-transparent flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                      <MousePointer2 size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-50">Final Call to Action Banner</h3>
                      <p className="text-xs text-slate-500">Der große Aufruf am Ende der Seite</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-8 space-y-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">
                      CTA Überschrift
                    </label>
                    <input 
                      type="text"
                      value={config.cta.title}
                      onChange={(e) => {
                        setConfig(prev => ({ ...prev, cta: { ...prev.cta, title: e.target.value } }));
                        setHasChanges(true);
                      }}
                      className="w-full bg-dark-950 border border-white/10 rounded-xl px-4 h-11 text-xs text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">
                      Untertitel / Einladung
                    </label>
                    <textarea 
                      rows={2}
                      value={config.cta.subtitle}
                      onChange={(e) => {
                        setConfig(prev => ({ ...prev, cta: { ...prev.cta, subtitle: e.target.value } }));
                        setHasChanges(true);
                      }}
                      className="w-full bg-dark-950 border border-white/10 rounded-xl p-4 text-xs text-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">
                      Button Text
                    </label>
                    <input 
                      type="text"
                      value={config.cta.btnText}
                      onChange={(e) => {
                        setConfig(prev => ({ ...prev, cta: { ...prev.cta, btnText: e.target.value } }));
                        setHasChanges(true);
                      }}
                      className="w-full bg-dark-950 border border-white/10 rounded-xl px-4 h-11 text-xs text-white font-bold"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* CUSTOM SECTION EDITOR */}
            {editingId.startsWith('custom_') && config.customSections[editingId] && (
              <motion.div
                key={editingId}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card rounded-[2.5rem] border-white/10 overflow-hidden shadow-2xl"
              >
                <div className="p-6 md:p-8 border-b border-white/5 bg-gradient-to-br from-white/5 to-transparent flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-50">Eigene Inhaltssektion</h3>
                      <p className="text-xs text-slate-500">Frei gestaltbarer Textblock auf der Startseite</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-8 space-y-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">
                      Sektions-Name in der Admin-Liste
                    </label>
                    <input 
                      type="text"
                      value={config.sections.find(s => s.id === editingId)?.name || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setConfig(prev => ({
                          ...prev,
                          sections: prev.sections.map(s => s.id === editingId ? { ...s, name: val } : s)
                        }));
                        setHasChanges(true);
                      }}
                      className="w-full bg-dark-950 border border-white/10 rounded-xl px-4 h-11 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">
                      Titel auf der Website
                    </label>
                    <input 
                      type="text"
                      value={config.customSections[editingId].title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setConfig(prev => ({
                          ...prev,
                          customSections: {
                            ...prev.customSections,
                            [editingId]: { ...prev.customSections[editingId], title: val }
                          }
                        }));
                        setHasChanges(true);
                      }}
                      className="w-full bg-dark-950 border border-white/10 rounded-xl px-4 h-11 text-xs text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">
                      Untertitel / Einleitung
                    </label>
                    <input 
                      type="text"
                      value={config.customSections[editingId].subtitle}
                      onChange={(e) => {
                        const val = e.target.value;
                        setConfig(prev => ({
                          ...prev,
                          customSections: {
                            ...prev.customSections,
                            [editingId]: { ...prev.customSections[editingId], subtitle: val }
                          }
                        }));
                        setHasChanges(true);
                      }}
                      className="w-full bg-dark-950 border border-white/10 rounded-xl px-4 h-11 text-xs text-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">
                      Haupttext / Inhalt
                    </label>
                    <textarea 
                      rows={5}
                      value={config.customSections[editingId].content}
                      onChange={(e) => {
                        const val = e.target.value;
                        setConfig(prev => ({
                          ...prev,
                          customSections: {
                            ...prev.customSections,
                            [editingId]: { ...prev.customSections[editingId], content: val }
                          }
                        }));
                        setHasChanges(true);
                      }}
                      className="w-full bg-dark-950 border border-white/10 rounded-xl p-4 text-xs text-slate-300 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">
                      Button Text (optional)
                    </label>
                    <input 
                      type="text"
                      value={config.customSections[editingId].btnText || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setConfig(prev => ({
                          ...prev,
                          customSections: {
                            ...prev.customSections,
                            [editingId]: { ...prev.customSections[editingId], btnText: val }
                          }
                        }));
                        setHasChanges(true);
                      }}
                      className="w-full bg-dark-950 border border-white/10 rounded-xl px-4 h-11 text-xs text-white"
                      placeholder="z.B. Erstgespräch buchen"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
