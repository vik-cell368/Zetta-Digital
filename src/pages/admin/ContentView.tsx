import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Plus, Edit2, Trash2, Globe, Save, CheckCircle2 } from 'lucide-react';
import { updateTranslations, getDefaultResources } from '@/i18n';

const ALL_LANGS = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' },
  { code: 'it', name: 'Italiano' },
  { code: 'ru', name: 'Русский' },
  { code: 'uk', name: 'Українська' }
];

export default function ContentView() {
  const { i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('services');
  const [selectedLang, setSelectedLang] = useState('en');
  const [enabledLangs, setEnabledLangs] = useState<string[]>(['en', 'de']);

  useEffect(() => {
    const savedEnabledLangs = localStorage.getItem('viktor_labs_enabled_languages');
    if (savedEnabledLangs) {
      setEnabledLangs(savedEnabledLangs.split(','));
    }
  }, []);

  const supportedLangs = ALL_LANGS.filter(l => enabledLangs.includes(l.code));

  const sections = [
    { id: 'services', name: 'Unsere Leistungen', icon: Globe },
    { id: 'pricing', name: 'Preise', icon: Save }, // Using Save as placeholder for pricing
    { id: 'portfolio', name: 'Referenzen', icon: CheckCircle2 },
    { id: 'faq', name: 'FAQ', icon: Save },
    { id: 'about', name: 'Über uns', icon: Save },
    { id: 'raw', name: 'Alle Texte (Roh)', icon: Globe }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif text-white tracking-tight">Inhaltsverwaltung</h2>
          <p className="text-gray-400 mt-1 font-light text-sm">Verwalten Sie alle Inhalte Ihrer Website an einem zentralen Ort.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4">
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => setActiveTab(section.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === section.id 
                ? 'bg-cyan-500 text-dark-950' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {section.name}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {activeTab === 'services' && <ServicesView />}
        {activeTab === 'raw' && <RawContentEditor />}
        {activeTab === 'pricing' && <PricingEditor />}
        {activeTab === 'portfolio' && <PortfolioEditor />}
        {activeTab === 'faq' && <FAQEditor />}
        {activeTab === 'about' && <AboutEditor />}
      </div>
    </div>
  );
}

// Sub-components will be defined below or moved to separate files
function RawContentEditor() {
  const { i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState('en');
  const [enabledLangs, setEnabledLangs] = useState<string[]>(['en', 'de']);
  const [overrides, setOverrides] = useState<Record<string, Record<string, string>>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const defaultResources = getDefaultResources();
  const allKeys = Object.keys(defaultResources.en.translation || {}).reduce((acc: string[], key: string) => {
    const val = (defaultResources.en.translation as any)[key];
    if (typeof val === 'object' && !Array.isArray(val)) {
      Object.keys(val).forEach(subKey => acc.push(`${key}.${subKey}`));
    } else {
      acc.push(key);
    }
    return acc;
  }, []);

  useEffect(() => {
    const savedOverrides = localStorage.getItem('viktor_labs_content_overrides');
    if (savedOverrides) setOverrides(JSON.parse(savedOverrides));
    const savedEnabledLangs = localStorage.getItem('viktor_labs_enabled_languages');
    if (savedEnabledLangs) setEnabledLangs(savedEnabledLangs.split(','));
  }, []);

  const supportedLangs = ALL_LANGS.filter(l => enabledLangs.includes(l.code));

  const handleTextChange = (key: string, value: string) => {
    setOverrides(prev => ({
      ...prev,
      [selectedLang]: { ...(prev[selectedLang] || {}), [key]: value }
    }));
    setSaved(false);
  };

  const handleSave = () => {
    setIsSaving(true);
    updateTranslations(overrides);
    setTimeout(() => { setIsSaving(false); setSaved(true); setTimeout(() => setSaved(false), 3000); }, 800);
  };

  const getValue = (key: string) => {
    if (overrides[selectedLang]?.[key] !== undefined) return overrides[selectedLang][key];
    const parts = key.split('.');
    let current = (defaultResources as any)[selectedLang]?.translation;
    for (const part of parts) { if (!current || current[part] === undefined) return ''; current = current[part]; }
    return typeof current === 'string' ? current : '';
  };

  return (
    <Card className="p-6 bg-dark-900/50 backdrop-blur-md border-white/5">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          {supportedLangs.map(lang => (
            <button
              key={lang.code}
              onClick={() => setSelectedLang(lang.code)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedLang === lang.code ? 'bg-cyan-500/20 text-cyan-500 border border-cyan-500/30' : 'text-gray-400 hover:text-white'
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
        <Button onClick={handleSave} isLoading={isSaving} size="sm">
          <Save className="w-4 h-4 mr-2" /> Speichern
        </Button>
      </div>
      <Input 
        placeholder="Suche..." 
        value={searchQuery} 
        onChange={e => setSearchQuery(e.target.value)} 
        className="mb-6 bg-dark-950 border-white/10"
      />
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {allKeys.filter(k => k.toLowerCase().includes(searchQuery.toLowerCase())).map(key => (
          <div key={key} className="space-y-1">
            <label className="text-[10px] font-mono text-gray-500">{key}</label>
            <Input 
              value={getValue(key)} 
              onChange={e => handleTextChange(key, e.target.value)}
              className="bg-dark-950 border-white/5"
            />
          </div>
        ))}
      </div>
    </Card>
  );
}

// Placeholder editors - these will be filled with logic for specific i18n keys
function PricingEditor() {
  return <ListEditor 
    title="Preispakete" 
    storageKey="viktor_labs_pricing"
    fields={[
      { id: 'name', label: 'Name', type: 'text' },
      { id: 'price', label: 'Preis', type: 'text' },
      { id: 'desc', label: 'Beschreibung', type: 'textarea' },
      { id: 'features', label: 'Features (einzelne Zeilen)', type: 'textarea' }
    ]}
  />;
}

function PortfolioEditor() {
  return <ListEditor 
    title="Referenzen" 
    storageKey="viktor_labs_portfolio"
    fields={[
      { id: 'title', label: 'Titel', type: 'text' },
      { id: 'category', label: 'Kategorie', type: 'text' },
      { id: 'desc', label: 'Beschreibung', type: 'textarea' },
      { id: 'image', label: 'Bild URL', type: 'text' },
      { id: 'result', label: 'Ergebnis', type: 'text' },
      { id: 'tags', label: 'Tags (Komma-getrennt)', type: 'text' }
    ]}
  />;
}

function FAQEditor() {
  return <ListEditor 
    title="FAQ" 
    storageKey="viktor_labs_faq"
    fields={[
      { id: 'question', label: 'Frage', type: 'text' },
      { id: 'answer', label: 'Antwort', type: 'textarea' },
      { id: 'category', label: 'Kategorie', type: 'text' }
    ]}
  />;
}

function ListEditor({ title, storageKey, fields }: { title: string, storageKey: string, fields: any[] }) {
  const [items, setItems] = useState<any[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newItem, setNewItem] = useState<any>({});

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    const parsed = saved ? JSON.parse(saved) : null;
    
    if (parsed && parsed.length > 0) {
      setItems(parsed);
    } else {
      // Load defaults if none or empty
      const defaultResources = getDefaultResources();
      const prefix = storageKey.replace('viktor_labs_', '');
      let defaults = (defaultResources.de.translation as any)[prefix];
      
      // Handle nested structures
      if (prefix === 'portfolio' && defaults?.projects) defaults = defaults.projects;
      if (prefix === 'faq' && defaults?.questions) defaults = defaults.questions;
      if (prefix === 'pricing') {
        // Filter out non-tier keys
        const tiers = { ...defaults };
        delete tiers.title;
        delete tiers.subtitle;
        delete tiers.individual_title;
        delete tiers.individual_desc;
        delete tiers.individual_btn;
        defaults = Object.values(tiers);
      }

      if (defaults && (Array.isArray(defaults) || typeof defaults === 'object')) {
        const initial = Array.isArray(defaults) ? defaults : Object.values(defaults);
        setItems(initial);
      }
    }
  }, [storageKey]);

  const save = (updated: any[]) => {
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setItems(updated);
    setEditingIndex(null);
    setNewItem({});
  };

  const handleAdd = () => {
    save([...items, { ...newItem, id: crypto.randomUUID() }]);
  };

  const handleDelete = (index: number) => {
    if (confirm('Löschen?')) {
      const updated = [...items];
      updated.splice(index, 1);
      save(updated);
    }
  };

  const handleUpdate = () => {
    const updated = [...items];
    updated[editingIndex!] = newItem;
    save(updated);
  };

  return (
    <Card className="p-6 bg-dark-900/50 border-white/5">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl text-white font-serif italic">{title}</h3>
        <Button size="sm" onClick={() => { setEditingIndex(-1); setNewItem({}); }}>
          <Plus className="w-4 h-4 mr-2" /> Hinzufügen
        </Button>
      </div>

      {(editingIndex !== null) && (
        <div className="mb-12 p-6 bg-dark-950 rounded-2xl border border-cyan-500/30 space-y-4">
          <h4 className="text-sm font-mono text-cyan-500 uppercase tracking-widest mb-4">
            {editingIndex === -1 ? 'Neues Element' : 'Bearbeiten'}
          </h4>
          <div className="grid grid-cols-1 gap-4">
            {fields.map(f => (
              <div key={f.id}>
                <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-2">{f.label}</label>
                {f.type === 'textarea' ? (
                  <Textarea 
                    value={newItem[f.id] || ''} 
                    onChange={e => setNewItem({ ...newItem, [f.id]: e.target.value })}
                    className="bg-dark-900 border-white/5 text-white min-h-[100px]"
                  />
                ) : (
                  <Input 
                    value={newItem[f.id] || ''} 
                    onChange={e => setNewItem({ ...newItem, [f.id]: e.target.value })}
                    className="bg-dark-900 border-white/5 text-white"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" onClick={() => setEditingIndex(null)}>Abbrechen</Button>
            <Button onClick={editingIndex === -1 ? handleAdd : handleUpdate}>Speichern</Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {items.map((item, i) => (
          <div key={i} className="p-4 bg-dark-950 rounded-xl border border-white/5 flex justify-between items-center">
            <div>
              <div className="text-white font-medium">{item.name || item.title || item.question || `Element ${i+1}`}</div>
              <div className="text-xs text-gray-500">{item.category || item.price || ''}</div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => { setEditingIndex(i); setNewItem(item); }}>
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="danger" onClick={() => handleDelete(i)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="text-center py-12 text-gray-500">Noch keine Einträge vorhanden.</div>}
      </div>
    </Card>
  );
}
function AboutEditor() { 
  const { i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState('de');
  const [overrides, setOverrides] = useState<Record<string, Record<string, string>>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('viktor_labs_content_overrides');
    if (saved) setOverrides(JSON.parse(saved));
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    updateTranslations(overrides);
    setTimeout(() => setIsSaving(false), 500);
  };

  const aboutKeys = [
    { key: 'about.title', label: 'Name / Titel' },
    { key: 'about.subtitle', label: 'Beschreibung / Slogan' },
    { key: 'about.mission_title', label: 'Mission Titel' },
    { key: 'about.mission_desc', label: 'Mission Beschreibung' },
    { key: 'about.vision_title', label: 'Vision Titel' },
    { key: 'about.vision_desc', label: 'Vision Beschreibung' },
    { key: 'about.why_title', label: 'Warum Zetta Titel' }
  ];

  return (
    <Card className="p-6 bg-dark-900/50 border-white/5">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl text-white font-serif italic">Über uns verwalten</h3>
        <div className="flex gap-4">
          <select 
            value={selectedLang} 
            onChange={e => setSelectedLang(e.target.value)}
            className="bg-dark-950 border-white/10 text-white text-xs rounded-lg px-3 py-1"
          >
            <option value="de">Deutsch</option>
            <option value="en">English</option>
          </select>
          <Button onClick={handleSave} isLoading={isSaving} size="sm">Speichern</Button>
        </div>
      </div>
      <div className="space-y-6">
        {aboutKeys.map(item => {
          const defaultResources = getDefaultResources();
          const parts = item.key.split('.');
          const defaultVal = (defaultResources as any)[selectedLang]?.translation[parts[0]]?.[parts[1]] || '';
          const val = overrides[selectedLang]?.[item.key] || defaultVal;
          return (
            <div key={item.key}>
              <label className="block text-xs text-gray-500 mb-2 uppercase tracking-widest">{item.label}</label>
              {val.length > 60 ? (
                <Textarea 
                  value={val} 
                  onChange={e => setOverrides(prev => ({ ...prev, [selectedLang]: { ...(prev[selectedLang] || {}), [item.key]: e.target.value } }))}
                  className="bg-dark-950 border-white/10 text-white min-h-[100px]"
                />
              ) : (
                <Input 
                  value={val} 
                  onChange={e => setOverrides(prev => ({ ...prev, [selectedLang]: { ...(prev[selectedLang] || {}), [item.key]: e.target.value } }))}
                  className="bg-dark-950 border-white/10 text-white"
                />
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function SectionEditor({ title, prefix }: { title: string, prefix: string }) {
  const { i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState('de');
  const [overrides, setOverrides] = useState<Record<string, Record<string, string>>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('viktor_labs_content_overrides');
    if (saved) setOverrides(JSON.parse(saved));
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    updateTranslations(overrides);
    setTimeout(() => setIsSaving(false), 500);
  };

  const defaultResources = getDefaultResources();
  const keys = Object.keys((defaultResources.en.translation as any)[prefix] || {}).map(k => `${prefix}.${k}`);

  return (
    <Card className="p-6 bg-dark-900/50 border-white/5">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-lg text-white font-serif">{title}</h3>
        <div className="flex gap-4">
          <select 
            value={selectedLang} 
            onChange={e => setSelectedLang(e.target.value)}
            className="bg-dark-950 border-white/10 text-white text-xs rounded-lg px-3 py-1"
          >
            <option value="de">Deutsch</option>
            <option value="en">English</option>
          </select>
          <Button onClick={handleSave} isLoading={isSaving} size="sm">Speichern</Button>
        </div>
      </div>
      <div className="space-y-6">
        {keys.map(key => {
          const val = overrides[selectedLang]?.[key] || (defaultResources as any)[selectedLang]?.translation[prefix]?.[key.split('.')[1]] || '';
          if (typeof val === 'object') return null; // Skip nested objects for this simple editor
          return (
            <div key={key}>
              <label className="block text-xs text-gray-500 mb-2 uppercase tracking-widest">{key}</label>
              {val.length > 60 ? (
                <Textarea 
                  value={val} 
                  onChange={e => setOverrides(prev => ({ ...prev, [selectedLang]: { ...(prev[selectedLang] || {}), [key]: e.target.value } }))}
                  className="bg-dark-950 border-white/10 text-white min-h-[100px]"
                />
              ) : (
                <Input 
                  value={val} 
                  onChange={e => setOverrides(prev => ({ ...prev, [selectedLang]: { ...(prev[selectedLang] || {}), [key]: e.target.value } }))}
                  className="bg-dark-950 border-white/10 text-white"
                />
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// Import ServicesView as a subcomponent or just copy logic
import ServicesView from './ServicesView';
