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
  const allKeys = Object.keys(defaultResources.en.translation || {});

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
    return defaultDict ? defaultDict[key] : '';
  };

  const filteredKeys = allKeys.filter(key => 
    key.toLowerCase().includes(searchQuery.toLowerCase()) || 
    getValue(key)?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const quickAccessKeys = [
    'home.phase2_label', 'home.phase2_title', 'home.phase2_desc',
    'home.phase3_label', 'home.phase3_title', 'home.phase3_desc',
    'home.srv_title',
    'footer.svc_web', 'home.val_eng_desc',
    'footer.svc_shop', 'home.val_growth_desc',
    'footer.svc_workflow', 'home.val_ai_desc',
    'footer.svc_custom',
    'home.phase4_title', 'home.phase4_btn'
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif text-white tracking-tight">Content Management</h2>
          <p className="text-gray-400 mt-1 font-light text-sm">Edit website copy, slogans, and descriptions across all languages.</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-neon-500 text-sm font-medium flex items-center"><CheckCircle2 className="w-4 h-4 mr-1" /> Saved</span>}
          <Button onClick={handleSave} isLoading={isSaving} className="bg-neon-500 hover:bg-neon-400 text-dark-950 px-6 rounded-xl font-semibold text-xs tracking-widest uppercase">
            <Save className="w-4 h-4 mr-2" /> Save Content
          </Button>
        </div>
      </div>

      <Card className="p-6 bg-dark-900/50 backdrop-blur-xl border-white/5">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Language Selector */}
          <div className="lg:w-64 flex-shrink-0 space-y-2">
            <h3 className="text-xs uppercase tracking-widest font-mono text-gray-500 mb-4 flex items-center">
              <Globe className="w-4 h-4 mr-2" /> Languages
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
                Quick Access
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
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Editor */}
          <div className="flex-1 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input 
                placeholder="Search content keys or text..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-dark-950 border-white/10 text-white rounded-xl"
              />
            </div>

            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {/* Highlight Quick Access if no search */}
              {!searchQuery && (
                <div className="space-y-4 pb-8 border-b border-white/5">
                  <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] text-neon-500/50">Core Experience Content</h4>
                  {quickAccessKeys.map(key => {
                    const value = getValue(key);
                    if (value === undefined) return null;
                    return (
                      <div key={`quick-${key}`} className="bg-dark-950/50 p-4 rounded-xl border border-neon-500/10 focus-within:border-neon-500/50 transition-colors">
                        <label className="block text-[10px] font-mono text-neon-500/50 mb-3">{key}</label>
                        {value.length > 50 ? (
                          <Textarea 
                            value={value}
                            onChange={(e) => handleTextChange(key, e.target.value)}
                            className="bg-transparent border-none text-white focus-visible:ring-0 resize-y min-h-[80px] p-0"
                          />
                        ) : (
                          <Input 
                            value={value}
                            onChange={(e) => handleTextChange(key, e.target.value)}
                            className="bg-transparent border-none text-white focus-visible:ring-0 p-0 h-auto"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {filteredKeys.map(key => {
                const value = getValue(key);
                const isLongText = value && value.length > 50;

                // Don't repeat quick access keys if no search
                if (!searchQuery && quickAccessKeys.includes(key)) return null;

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
              
              {filteredKeys.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No content found matching "{searchQuery}"
                </div>
              )}
            </div>
          </div>

        </div>
      </Card>
    </div>
  );
}
