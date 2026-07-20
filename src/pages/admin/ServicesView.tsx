import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Service } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { formatCurrency, getTranslatedText } from '@/lib/utils';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, Languages, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type ServiceFormData = {
  [key: string]: any;
  price: number;
  duration_minutes: number;
  is_active: boolean;
};

const SUPPORTED_LANGS = [
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
  { code: 'it', label: 'Italiano' },
  { code: 'uk', label: 'Українська' },
  { code: 'ru', label: 'Русский' }
];

export default function ServicesView() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language.split('-')[0] || 'en';

  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [activeLangTab, setActiveLangTab] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);

  const { register, handleSubmit, reset, setValue, getValues } = useForm<ServiceFormData>();

  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('services').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) {
        setServices(data);
        localStorage.setItem('zetta_services', JSON.stringify(data));
      } else {
        // If Supabase is empty, check localStorage
        const localData = localStorage.getItem('zetta_services');
        if (localData) {
          setServices(JSON.parse(localData));
        } else {
          seedFromDefaults();
        }
      }
    } catch (err) {
      console.warn("Supabase fetch failed, falling back to localStorage", err);
      const localData = localStorage.getItem('zetta_services');
      if (localData) {
        setServices(JSON.parse(localData));
      } else {
        // Automatically seed defaults if completely empty
        seedFromDefaults();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const seedFromDefaults = () => {
    const defaultServices = t('services.list', { returnObjects: true });
    if (Array.isArray(defaultServices)) {
      const seeded = defaultServices.map(s => ({
        id: s.id,
        name: JSON.stringify({ de: s.title, en: s.title }),
        description: JSON.stringify({ de: s.desc, en: s.desc }),
        price: 0,
        duration_minutes: 60,
        is_active: true,
        created_at: new Date().toISOString()
      })) as Service[];
      saveToLocal(seeded);
      setStatusMessage("Standard-Leistungen geladen");
    }
  };

  const saveToLocal = (newServices: Service[]) => {
    localStorage.setItem('zetta_services', JSON.stringify(newServices));
    setServices(newServices);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const onSubmit = async (data: ServiceFormData) => {
    const nameObj: Record<string, string> = {};
    const descObj: Record<string, string> = {};
    const featuresObj: Record<string, string> = {};
    const processObj: Record<string, string> = {};
    const faqsObj: Record<string, string> = {};
    
    SUPPORTED_LANGS.forEach(lang => {
      nameObj[lang.code] = data[`name_${lang.code}`] || '';
      descObj[lang.code] = data[`description_${lang.code}`] || '';
      featuresObj[lang.code] = data[`features_${lang.code}`] || '';
      processObj[lang.code] = data[`process_${lang.code}`] || '';
      faqsObj[lang.code] = data[`faqs_${lang.code}`] || '';
    });

    const payload = {
      name: JSON.stringify(nameObj),
      description: JSON.stringify(descObj),
      features: JSON.stringify(featuresObj),
      process: JSON.stringify(processObj),
      faqs: JSON.stringify(faqsObj),
      tech: data.tech || '',
      price: data.price,
      duration_minutes: data.duration_minutes,
      is_active: data.is_active ?? true,
    };

    try {
      let updatedServices = [...services];
      if (isEditing) {
        const { error } = await supabase.from('services').update(payload).eq('id', isEditing);
        if (error) {
          console.error("Supabase update error:", error);
          throw error;
        }
        updatedServices = updatedServices.map(s => s.id === isEditing ? { ...s, ...payload } : s);
        setIsEditing(null);
        setStatusMessage("Service updated successfully");
      } else {
        // Try to insert with a generated ID just in case the table doesn't auto-generate it
        const id = crypto.randomUUID();
        const { data, error } = await supabase.from('services').insert({ ...payload, id }).select().single();
        
        if (error) {
          console.error("Supabase insert error:", error);
          throw error;
        }
        
        updatedServices = [data, ...updatedServices];
        setIsAdding(false);
        setStatusMessage("Service added successfully");
      }
      saveToLocal(updatedServices);
    } catch (err: any) {
      console.warn("Supabase operation failed:", err);
      const errorMessage = err?.message || "Unknown error";
      
      // Fallback to local storage if it's truly a connection/database error
      let updatedServices = [...services];
      if (isEditing) {
        updatedServices = updatedServices.map(s => s.id === isEditing ? { ...s, ...payload } : s);
        setIsEditing(null);
        setStatusMessage(`Updated locally (Error: ${errorMessage})`);
      } else {
        const newService = {
          ...payload,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString()
        } as Service;
        updatedServices = [newService, ...updatedServices];
        setIsAdding(false);
        setStatusMessage(`Added locally (Error: ${errorMessage})`);
      }
      saveToLocal(updatedServices);
      
      // Also show an alert so the user knows why it failed
      if (errorMessage.includes("column") || errorMessage.includes("field")) {
        alert("Datenbankfehler: Die Tabellenstruktur in Supabase scheint veraltet zu sein. Bitte kontaktieren Sie den Support.");
      }
    }
    
    setTimeout(() => setStatusMessage(null), 3000);
    reset();
  };

  const handleEdit = (service: Service) => {
    setIsEditing(service.id);
    setIsAdding(false);
    
    SUPPORTED_LANGS.forEach(lang => {
      setValue(`name_${lang.code}`, getTranslatedText(service.name, lang.code));
      setValue(`description_${lang.code}`, getTranslatedText(service.description, lang.code));
      setValue(`features_${lang.code}`, getTranslatedText(service.features || '', lang.code));
      setValue(`process_${lang.code}`, getTranslatedText(service.process || '', lang.code));
      setValue(`faqs_${lang.code}`, getTranslatedText(service.faqs || '', lang.code));
    });
    
    setValue('tech', service.tech || '');
    setValue('price', service.price);
    setValue('duration_minutes', service.duration_minutes);
    setValue('is_active', service.is_active);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        const { error } = await supabase.from('services').delete().eq('id', id);
        if (error) throw error;
        fetchServices();
      } catch (err) {
        console.warn("Supabase delete failed, updating localStorage", err);
        const updatedServices = services.filter(s => s.id !== id);
        saveToLocal(updatedServices);
      }
    }
  };

  const toggleActive = async (service: Service) => {
    try {
      const { error } = await supabase.from('services').update({ is_active: !service.is_active }).eq('id', service.id);
      if (error) throw error;
      fetchServices();
    } catch (err) {
      console.warn("Supabase toggle failed, updating localStorage", err);
      const updatedServices = services.map(s => s.id === service.id ? { ...s, is_active: !s.is_active } : s);
      saveToLocal(updatedServices);
    }
  };

  const handleAutoTranslate = async () => {
    const currentName = getValues(`name_${activeLangTab}`);
    const currentDesc = getValues(`description_${activeLangTab}`);

    if (!currentName && !currentDesc) {
      alert("Please fill in the name or description first to translate.");
      return;
    }

    const targetLangs = SUPPORTED_LANGS.filter(l => l.code !== activeLangTab).map(l => l.code);
    setIsTranslating(true);

    try {
      if (currentName) {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: currentName, targetLanguages: targetLangs })
        });
        const data = await res.json();
        if (data && !data.error) {
          Object.keys(data).forEach(lang => {
            setValue(`name_${lang}`, data[lang]);
          });
        }
      }

      if (currentDesc) {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: currentDesc, targetLanguages: targetLangs })
        });
        const data = await res.json();
        if (data && !data.error) {
          Object.keys(data).forEach(lang => {
            setValue(`description_${lang}`, data[lang]);
          });
        }
      }
    } catch (err) {
      console.error("Translation failed:", err);
      alert("Auto-translation failed. Check console for details.");
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Leistungen</h2>
          <p className="text-gray-400">Verwalten Sie Ihre Angebote und Preise.</p>
        </div>
        <div className="flex items-center gap-4">
          {statusMessage && (
            <span className="text-xs font-mono text-neon-400 animate-pulse">{statusMessage}</span>
          )}
          {!isAdding && !isEditing && (
            <Button onClick={() => { 
              setIsAdding(true); 
              reset({ 
                is_active: true,
                price: 0,
                duration_minutes: 0,
                tech: ''
              }); 
              SUPPORTED_LANGS.forEach(l => { 
                setValue(`name_${l.code}`, ''); 
                setValue(`description_${l.code}`, ''); 
                setValue(`features_${l.code}`, '');
                setValue(`process_${l.code}`, '');
                setValue(`faqs_${l.code}`, '');
              });
              setActiveLangTab('de'); // Default to German for better local UX
            }}>
              <Plus className="h-4 w-4 mr-2" /> Leistung hinzufügen
            </Button>
          )}
        </div>
      </div>

      {(isAdding || isEditing) && (
        <Card className="border-neon-400">
          <CardHeader>
            <CardTitle>{isEditing ? 'Leistung bearbeiten' : 'Neue Leistung hinzufügen'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              <div className="flex justify-between items-center border-b border-white/10 mb-4">
                <div className="flex overflow-x-auto no-scrollbar">
                  {SUPPORTED_LANGS.map(lang => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setActiveLangTab(lang.code)}
                      className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                        activeLangTab === lang.code 
                          ? 'border-neon-400 text-white' 
                          : 'border-transparent text-gray-400 hover:text-gray-100'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAutoTranslate}
                  disabled={isTranslating}
                  className="mb-1 hidden sm:flex"
                >
                  {isTranslating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Languages className="h-4 w-4 mr-2" />}
                  Alle automatisch übersetzen
                </Button>
              </div>
              
              <div className="sm:hidden mb-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAutoTranslate}
                  disabled={isTranslating}
                  className="w-full"
                >
                  {isTranslating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Languages className="h-4 w-4 mr-2" />}
                  In andere Sprachen übersetzen
                </Button>
              </div>

              {SUPPORTED_LANGS.map(lang => (
                <div key={lang.code} className={activeLangTab === lang.code ? 'block space-y-4' : 'hidden'}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-100 mb-1">Name der Leistung ({lang.label}) *</label>
                      <Input {...register(`name_${lang.code}`, { required: lang.code === 'de' })} placeholder="z.B. Web-Entwicklung" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-100 mb-1">Beschreibung ({lang.label})</label>
                      <Textarea {...register(`description_${lang.code}`)} placeholder="Beschreiben Sie die Leistung..." />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-100 mb-1">Vorteile ({lang.label}) - Ein Vorteil pro Zeile</label>
                      <Textarea {...register(`features_${lang.code}`)} placeholder="Vorteil 1&#10;Vorteil 2" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-100 mb-1">Ablauf ({lang.label}) - Ein Schritt pro Zeile</label>
                      <Textarea {...register(`process_${lang.code}`)} placeholder="Schritt 1&#10;Schritt 2" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-100 mb-1">FAQs ({lang.label}) - Format: Frage|Antwort (eine pro Zeile)</label>
                      <Textarea {...register(`faqs_${lang.code}`)} placeholder="Wie lange dauert es?|Etwa 2 Wochen.&#10;Was kostet es?|Kommt auf den Umfang an." />
                    </div>
                  </div>
                </div>
              ))}

              <div className="md:col-span-2 pt-4 border-t border-white/10">
                <label className="block text-sm font-medium text-gray-100 mb-1">Technologien (Komma-getrennt)</label>
                <Input {...register('tech')} placeholder="React, Node.js, AI" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div>
                  <label className="block text-sm font-medium text-gray-100 mb-1">Preis (EUR)</label>
                  <Input type="number" {...register('price', { required: true, valueAsNumber: true })} placeholder="z.B. 5000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-100 mb-1">Dauer (Minuten)</label>
                  <Input type="number" {...register('duration_minutes', { required: true, valueAsNumber: true })} placeholder="z.B. 60" />
                </div>
                <div className="flex items-center space-x-2 mt-6">
                  <input type="checkbox" id="is_active" {...register('is_active')} className="rounded border-white/20 text-white focus:ring-neon-500/50" />
                  <label htmlFor="is_active" className="text-sm font-medium text-gray-100">Aktiv (Sichtbar für Kunden)</label>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => { setIsAdding(false); setIsEditing(null); reset(); }}>
                  Abbrechen
                </Button>
                <Button type="submit">
                  {isEditing ? 'Leistung aktualisieren' : 'Leistung speichern'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {!isLoading && (
        <div className="grid grid-cols-1 gap-4">
          {services.map(service => (
            <Card key={service.id} className={!service.is_active ? 'opacity-60 bg-dark-900/50' : ''}>
              <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg text-white">{getTranslatedText(service.name, currentLang)}</h3>
                    {service.is_active ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-900/40 text-green-400">
                        Aktiv
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-dark-900 text-gray-100">
                        Inaktiv
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{getTranslatedText(service.description, currentLang)}</p>
                  <div className="flex items-center text-sm font-medium text-gray-100 space-x-4">
                    <span>{service.duration_minutes} Min</span>
                    <span>•</span>
                    <span>{formatCurrency(service.price)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => toggleActive(service)}>
                    {service.is_active ? <XCircle className="w-4 h-4 mr-1" /> : <CheckCircle2 className="w-4 h-4 mr-1" />}
                    {service.is_active ? 'Deaktivieren' : 'Aktivieren'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(service)}>
                    <Edit2 className="w-4 h-4 mr-1" /> Bearbeiten
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(service.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {services.length === 0 && !isAdding && (
            <div className="text-center py-12 text-gray-400 bg-dark-950 rounded-xl border border-white/10">
              <p className="mb-4">Keine Leistungen gefunden. Fügen Sie Ihre erste Leistung hinzu, um Buchungen entgegenzunehmen.</p>
              <Button variant="outline" onClick={seedFromDefaults}>
                Standard-Leistungen laden
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
