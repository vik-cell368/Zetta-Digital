import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Save, 
  Layout, 
  Type, 
  Image as ImageIcon, 
  Play, 
  MousePointer2, 
  Palette, 
  Layers, 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  Plus,
  Eye,
  Check
} from 'lucide-react';

const DEFAULT_CONFIG = {
  hero: {
    title: 'Professionelle Websites & KI-Lösungen für Unternehmen.',
    subtitle: 'Wir entwickeln Websites, Chatbots und Automatisierungen, die Ihre Prozesse digitalisieren, Arbeitszeit sparen und messbar mehr Kunden bringen.',
    buttonText: 'Erstgespräch buchen'
  }
};

export default function CMSView() {
  const [editingId, setEditingId] = useState<string | null>('hero');
  const [hasChanges, setHasChanges] = useState(false);
  const [config, setConfig] = useState(DEFAULT_CONFIG);

  useEffect(() => {
    const savedConfig = localStorage.getItem('viktor_labs_site_config');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('viktor_labs_site_config', JSON.stringify(config));
    setHasChanges(false);
    alert('Änderungen gespeichert! (Die Website wurde aktualisiert)');
  };

  const updateHero = (field: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const sections = [
    { id: 'hero', name: 'Hero Section', type: 'Header' },
    { id: 'features', name: 'Features Grid', type: 'Content' },
    { id: 'roi', name: 'ROI Rechner', type: 'Tool' },
    { id: 'process', name: 'Prozess-Schritte', type: 'Content' },
    { id: 'cta', name: 'Final Call to Action', type: 'Footer' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-50 mb-2">CMS Management</h1>
          <p className="text-slate-500 text-xs md:text-sm">Visuelle Bearbeitung Ihrer Homepage ohne Programmierung.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={!hasChanges}
          className={`h-10 md:h-12 px-6 md:px-8 rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all ${
            hasChanges ? 'bg-cyan-500 text-dark-950 shadow-lg scale-105' : 'bg-white/5 text-slate-500 cursor-not-allowed'
          }`}
        >
          <Save size={14} />
          Speichern
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Structure Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Seitenstruktur</span>
              <button className="p-2 rounded-lg bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500 hover:text-dark-950 transition-all">
                <Plus size={16} />
              </button>
            </div>
            <div className="p-4 space-y-2 md:space-y-3">
              {sections.map((section, i) => (
                <div 
                  key={section.id}
                  onClick={() => setEditingId(section.id)}
                  className={`p-3 md:p-4 rounded-xl md:rounded-2xl border transition-all cursor-pointer group flex items-center justify-between ${
                    editingId === section.id 
                      ? 'bg-cyan-500/10 border-cyan-500/50 shadow-inner' 
                      : 'bg-dark-950 border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] md:text-xs text-gray-500 group-hover:text-cyan-500 transition-colors">
                      {i + 1}
                    </div>
                    <div>
                      <div className={`text-xs md:text-sm font-bold ${editingId === section.id ? 'text-cyan-500' : 'text-white'}`}>
                        {section.name}
                      </div>
                      <div className="text-[8px] md:text-[10px] text-gray-500 uppercase tracking-widest">{section.type}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Editor Panel */}
        <div className="lg:col-span-8 space-y-8">
          <AnimatePresence mode="wait">
            {editingId === 'hero' && (
              <motion.div
                key="hero"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card rounded-[3rem] border-white/5 overflow-hidden"
              >
                <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                      <Layout size={20} className="md:w-6 md:h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-slate-50">Hero Section</h3>
                      <p className="text-[10px] md:text-xs text-slate-500">Inhalt der Startseite anpassen</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-12 space-y-8 md:space-y-12">
                  <div className="space-y-6 md:space-y-8">
                    <div className="space-y-3 md:space-y-4">
                      <label className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-slate-500 flex items-center gap-2">
                        <Type size={10} className="md:w-3 md:h-3" /> Haupt-Überschrift (HTML erlaubt)
                      </label>
                      <textarea 
                        rows={2}
                        value={config.hero.title}
                        onChange={(e) => updateHero('title', e.target.value)}
                        className="w-full bg-dark-950 border border-white/5 rounded-xl md:rounded-2xl p-4 md:p-6 text-white focus:border-cyan-500/50 transition-all font-display font-bold text-lg md:text-xl"
                      />
                    </div>

                    <div className="space-y-3 md:space-y-4">
                      <label className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-slate-500 flex items-center gap-2">
                        <Layers size={10} className="md:w-3 md:h-3" /> Beschreibungstext
                      </label>
                      <textarea 
                        rows={4}
                        value={config.hero.subtitle}
                        onChange={(e) => updateHero('subtitle', e.target.value)}
                        className="w-full bg-dark-950 border border-white/5 rounded-2xl md:rounded-3xl p-4 md:p-6 text-white focus:border-cyan-500/50 transition-all text-sm md:text-base text-slate-400"
                      />
                    </div>

                    <div className="space-y-3 md:space-y-4">
                      <label className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-slate-500 flex items-center gap-2">
                        <MousePointer2 size={10} className="md:w-3 md:h-3" /> Button Text
                      </label>
                      <input 
                        type="text" 
                        value={config.hero.buttonText}
                        onChange={(e) => updateHero('buttonText', e.target.value)}
                        className="w-full h-12 md:h-14 bg-dark-950 border border-white/5 rounded-xl md:rounded-2xl px-4 md:px-6 text-xs md:text-sm text-white focus:border-cyan-500/50 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {editingId !== 'hero' && (
              <div className="glass-card rounded-[3rem] border-white/5 p-20 text-center space-y-6 opacity-40">
                <Layout size={48} className="mx-auto text-gray-600" />
                <h3 className="text-xl font-bold text-white">Sektion noch nicht implementiert</h3>
                <p className="text-gray-500 text-sm max-w-xs mx-auto">Dieser Teil des CMS wird in der nächsten Version freigeschaltet.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
