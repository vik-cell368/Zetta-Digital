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
    const savedConfig = localStorage.getItem('zetta_site_config');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('zetta_site_config', JSON.stringify(config));
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">CMS Management</h1>
          <p className="text-gray-500 text-sm">Visuelle Bearbeitung Ihrer Homepage ohne Programmierung.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={!hasChanges}
          className={`h-12 px-8 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition-all ${
            hasChanges ? 'bg-neon-500 text-dark-950 shadow-lg scale-105' : 'bg-white/5 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Save size={16} />
          Änderungen speichern
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Structure Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Seitenstruktur</span>
              <button className="p-2 rounded-lg bg-neon-500/10 text-neon-500 hover:bg-neon-500 hover:text-dark-950 transition-all">
                <Plus size={16} />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {sections.map((section, i) => (
                <div 
                  key={section.id}
                  onClick={() => setEditingId(section.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer group flex items-center justify-between ${
                    editingId === section.id 
                      ? 'bg-neon-500/10 border-neon-500/50 shadow-inner' 
                      : 'bg-dark-950 border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-neon-500 transition-colors">
                      {i + 1}
                    </div>
                    <div>
                      <div className={`text-sm font-bold ${editingId === section.id ? 'text-neon-500' : 'text-white'}`}>
                        {section.name}
                      </div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-widest">{section.type}</div>
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
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-neon-500/10 flex items-center justify-center text-neon-500">
                      <Layout size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Hero Section</h3>
                      <p className="text-xs text-gray-500">Inhalt der Startseite anpassen</p>
                    </div>
                  </div>
                </div>

                <div className="p-8 md:p-12 space-y-12">
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 flex items-center gap-2">
                        <Type size={12} /> Haupt-Überschrift (HTML erlaubt)
                      </label>
                      <textarea 
                        rows={2}
                        value={config.hero.title}
                        onChange={(e) => updateHero('title', e.target.value)}
                        className="w-full bg-dark-950 border border-white/5 rounded-2xl p-6 text-white focus:border-neon-500/50 transition-all font-display font-bold text-xl"
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 flex items-center gap-2">
                        <Layers size={12} /> Beschreibungstext
                      </label>
                      <textarea 
                        rows={4}
                        value={config.hero.subtitle}
                        onChange={(e) => updateHero('subtitle', e.target.value)}
                        className="w-full bg-dark-950 border border-white/5 rounded-3xl p-6 text-white focus:border-neon-500/50 transition-all text-gray-400"
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 flex items-center gap-2">
                        <MousePointer2 size={12} /> Button Text
                      </label>
                      <input 
                        type="text" 
                        value={config.hero.buttonText}
                        onChange={(e) => updateHero('buttonText', e.target.value)}
                        className="w-full h-14 bg-dark-950 border border-white/5 rounded-2xl px-6 text-white focus:border-neon-500/50 transition-all"
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
