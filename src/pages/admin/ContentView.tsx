import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Globe, Save, CheckCircle2 } from 'lucide-react';
import { updateTranslations, getDefaultResources } from '@/i18n';

const SUPPORTED_LANGS = [
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
  const [selectedLang, setSelectedLang] = useState('en');
  const [tick, setTick] = useState(0);
  const [overrides, setOverrides] = useState<Record<string, Record<string, string>>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Extract all keys from default English resources as the master list
  const defaultResources = getDefaultResources();

  const flattenKeys = (obj: any, path: string = ''): string[] => {
    if (!obj) return [];
    return Object.keys(obj).reduce((acc: string[], key: string) => {
      const newPath = path ? `${path}.${key}` : key;
      if (typeof obj[key] === 'object' && !Array.isArray(obj[key]) && obj[key] !== null) {
        acc.push(...flattenKeys(obj[key], newPath));
      } else {
        acc.push(newPath);
      }
      return acc;
    }, []);
  };

  const allKeys = flattenKeys(defaultResources.en.translation || {});

  useEffect(() => {
    try {
      const savedOverrides = localStorage.getItem('zetta_content_overrides');
      if (savedOverrides) {
        setOverrides(JSON.parse(savedOverrides));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleTextChange = (key: string, value: string) => {
    setOverrides(prev => ({
      ...prev,
      [selectedLang]: {
        ...(prev[selectedLang] || {}),
        [key]: value
      }
    }));
    setSaved(false);
    
    // Force re-render to update inputs immediately
    setTick(t => t + 1);
  };

  const handleSave = () => {
    setIsSaving(true);
    updateTranslations(overrides);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 800);
  };

  const getValue = (key: string) => {
    // Return override if exists, otherwise default
    if (overrides[selectedLang] && overrides[selectedLang][key] !== undefined) {
      return overrides[selectedLang][key];
    }
    const defaultDict = (defaultResources as any)[selectedLang]?.translation;
    if (!defaultDict) return '';

    const parts = key.split('.');
    let current = defaultDict;
    for (const part of parts) {
      if (!current || current[part] === undefined) return '';
      current = current[part];
    }
    
    if (Array.isArray(current)) return current.join(', ');
    return typeof current === 'string' ? current : '';
  };

  const filteredKeys = allKeys.filter(key => 
    key.toLowerCase().includes(searchQuery.toLowerCase()) || 
    getValue(key)?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const quickAccessGroups = [
    {
      name: 'Navigation & Fußzeile',
      keys: ['nav.services', 'nav.about', 'nav.book_consultation', 'footer.description', 'footer.rights', 'footer.slogan']
    },
    {
      name: 'Hero Sektion',
      keys: ['home.hero_badge', 'home.hero_title', 'home.hero_subtitle', 'home.hero_desc', 'home.book_free', 'home.phase4_btn']
    },
    {
      name: 'Startseite Sektionen',
      keys: [
        'home.phase2_label', 'home.phase2_title', 'home.phase2_desc',
        'home.phase3_label', 'home.phase3_title', 'home.phase3_desc',
        'home.expertise', 'home.srv_title', 'home.phase4_title'
      ]
    },
    {
      name: 'Leistungen Seite',
      keys: [
        'services.title', 'services.subtitle', 
        'services.webdesign.title', 'services.webdesign.description',
        'services.ai_automation.title', 'services.ai_automation.description',
        'services.ai_chatbots.title', 'services.ai_chatbots.description'
      ]
    },
    {
      name: 'Preise Seite',
      keys: [
        'pricing.title', 'pricing.subtitle',
        'pricing.starter.name', 'pricing.starter.price', 'pricing.starter.desc',
        'pricing.business.name', 'pricing.business.price', 'pricing.business.desc',
        'pricing.custom.name', 'pricing.custom.price',
        'pricing.individual_title', 'pricing.individual_desc', 'pricing.individual_btn'
      ]
    },
    {
      name: 'Über uns Seite',
      keys: [
        'about.title', 'about.subtitle', 
        'about.mission_title', 'about.mission_desc',
        'about.vision_title', 'about.vision_desc',
        'about.why_title'
      ]
    },
    {
      name: 'FAQ Sektion',
      keys: [
        'faq.title', 'faq.subtitle',
        'faq.cta_title', 'faq.cta_subtitle', 'faq.cta_btn'
      ]
    },
    {
      name: 'Referenzen',
      keys: [
        'portfolio.title', 'portfolio.subtitle',
        'portfolio.cta_title', 'portfolio.cta_desc'
      ]
    },
    {
      name: 'Ablauf',
      keys: [
        'process.title', 'process.subtitle',
        'process.cta_title', 'process.cta_desc'
      ]
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif text-white tracking-tight">Inhaltsverwaltung</h2>
          <p className="text-gray-400 mt-1 font-light text-sm">Bearbeiten Sie Website-Texte, Slogans und Beschreibungen in allen Sprachen.</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-neon-500 text-sm font-medium flex items-center"><CheckCircle2 className="w-4 h-4 mr-1" /> Gespeichert</span>}
          <Button onClick={handleSave} isLoading={isSaving} className="bg-neon-500 hover:bg-neon-400 text-dark-950 px-6 rounded-xl font-semibold text-xs tracking-widest uppercase">
            <Save className="w-4 h-4 mr-2" /> Inhalt speichern
          </Button>
        </div>
      </div>

      <Card className="p-6 bg-dark-900/50 backdrop-blur-md border-white/5">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Language Selector */}
          <div className="lg:w-64 flex-shrink-0 space-y-2">
            <h3 className="text-xs uppercase tracking-widest font-mono text-gray-500 mb-4 flex items-center">
              <Globe className="w-4 h-4 mr-2" /> Sprachen
            </h3>
            {SUPPORTED_LANGS.map(lang => (
              <button
                key={lang.code}
                onClick={() => setSelectedLang(lang.code)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all font-medium text-sm flex items-center justify-between ${
                  selectedLang === lang.code 
                    ? 'bg-neon-500/10 text-neon-500 border border-neon-500/20' 
                    : 'text-gray-400 hover:bg-dark-800 hover:text-white border border-transparent'
                }`}
              >
                {lang.name}
                {overrides[lang.code] && Object.keys(overrides[lang.code]).length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-neon-500"></span>
                )}
              </button>
            ))}

            <div className="pt-8 space-y-2">
              <h3 className="text-xs uppercase tracking-widest font-mono text-gray-500 mb-4">
                Schnellzugriff
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Home', 'Services', 'Footer'].map(tag => (
                  <button 
                    key={tag}
                    onClick={() => setSearchQuery(tag.toLowerCase())}
                    className="px-3 py-1 rounded-full bg-dark-800 text-[10px] text-gray-400 hover:text-white transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
                <button 
                  onClick={() => setSearchQuery('')}
                  className="px-3 py-1 rounded-full bg-dark-800 text-[10px] text-gray-400 hover:text-white transition-colors"
                >
                  Löschen
                </button>
              </div>
            </div>
          </div>

          {/* Editor */}
          <div className="flex-1 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input 
                placeholder="Suchbegriff oder Schlüssel..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-dark-950 border-white/10 text-white rounded-xl"
              />
            </div>

            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {/* Grouped Quick Access if no search */}
              {!searchQuery && quickAccessGroups.map(group => (
                <div key={group.name} className="space-y-4 pb-8 mb-8 border-b border-white/5 last:border-0">
                  <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] text-neon-500/50">{group.name}</h4>
                  {group.keys.map(key => {
                    const value = getValue(key);
                    if (value === undefined) return null;
                    return (
                      <div key={`quick-${key}`} className="bg-dark-950/50 p-4 rounded-xl border border-neon-500/10 focus-within:border-neon-500/50 transition-colors">
                        <div className="flex justify-between items-center mb-3">
                          <label className="block text-[10px] font-mono text-neon-500/50">{key}</label>
                        </div>
                        {value.length > 80 ? (
                          <Textarea 
                            value={value}
                            onChange={(e) => handleTextChange(key, e.target.value)}
                            className="bg-transparent border-none text-white focus-visible:ring-0 resize-y min-h-[60px] p-0 font-light leading-relaxed"
                          />
                        ) : (
                          <Input 
                            value={value}
                            onChange={(e) => handleTextChange(key, e.target.value)}
                            className="bg-transparent border-none text-white focus-visible:ring-0 p-0 h-auto font-light"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}

              {filteredKeys.length > 0 && searchQuery && (
                <div className="space-y-4">
                  <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] text-neon-500/50">Suchergebnisse</h4>
                  {filteredKeys.map(key => {
                    const value = getValue(key);
                    const isLongText = value && value.length > 50;

                    return (
                      <div key={key} className="bg-dark-950 p-4 rounded-xl border border-white/5 focus-within:border-neon-500/50 transition-colors">
                        <label className="block text-xs font-mono text-neon-500/70 mb-3">{key}</label>
                        {isLongText ? (
                          <Textarea 
                            value={value}
                            onChange={(e) => handleTextChange(key, e.target.value)}
                            className="bg-dark-900 border-none text-white focus-visible:ring-0 resize-y min-h-[100px]"
                          />
                        ) : (
                          <Input 
                            value={value}
                            onChange={(e) => handleTextChange(key, e.target.value)}
                            className="bg-dark-900 border-none text-white focus-visible:ring-0"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              
              {filteredKeys.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  Kein Inhalt gefunden für "{searchQuery}"
                </div>
              )}
            </div>
          </div>

        </div>
      </Card>
    </div>
  );
}
