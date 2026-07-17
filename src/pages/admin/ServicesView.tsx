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
  const { i18n } = useTranslation();
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
      if (data) setServices(data);
    } catch (err) {
      console.warn("Supabase fetch failed, falling back to localStorage", err);
      const localData = localStorage.getItem('zetta_services');
      if (localData) {
        setServices(JSON.parse(localData));
      }
    } finally {
      setIsLoading(false);
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
    
    SUPPORTED_LANGS.forEach(lang => {
      nameObj[lang.code] = data[`name_${lang.code}`] || '';
      descObj[lang.code] = data[`description_${lang.code}`] || '';
    });

    const payload = {
      name: JSON.stringify(nameObj),
      description: JSON.stringify(descObj),
      price: data.price,
      duration_minutes: data.duration_minutes,
      is_active: data.is_active ?? true,
    };

    try {
      if (isEditing) {
        const { error } = await supabase.from('services').update(payload).eq('id', isEditing);
        if (error) throw error;
        setIsEditing(null);
        setStatusMessage("Service updated successfully");
      } else {
        const { error } = await supabase.from('services').insert(payload);
        if (error) throw error;
        setIsAdding(false);
        setStatusMessage("Service added successfully");
      }
      fetchServices();
    } catch (err) {
      console.warn("Supabase save failed, saving to localStorage", err);
      let updatedServices = [...services];
      if (isEditing) {
        updatedServices = updatedServices.map(s => s.id === isEditing ? { ...s, ...payload } : s);
        setIsEditing(null);
        setStatusMessage("Updated locally (Database offline)");
      } else {
        const newService = {
          ...payload,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString()
        } as Service;
        updatedServices = [newService, ...updatedServices];
        setIsAdding(false);
        setStatusMessage("Added locally (Database offline)");
      }
      saveToLocal(updatedServices);
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
    });
    
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
          <h2 className="text-2xl font-bold tracking-tight text-white">Services</h2>
          <p className="text-gray-400">Manage your offerings and pricing.</p>
        </div>
        <div className="flex items-center gap-4">
          {statusMessage && (
            <span className="text-xs font-mono text-neon-400 animate-pulse">{statusMessage}</span>
          )}
          {!isAdding && !isEditing && (
            <Button onClick={() => { 
              setIsAdding(true); 
              reset({ is_active: true }); 
              SUPPORTED_LANGS.forEach(l => { setValue(`name_${l.code}`, ''); setValue(`description_${l.code}`, ''); });
            }}>
              <Plus className="h-4 w-4 mr-2" /> Add Service
            </Button>
          )}
        </div>
      </div>

      {(isAdding || isEditing) && (
        <Card className="border-neon-400">
          <CardHeader>
            <CardTitle>{isEditing ? 'Edit Service' : 'Add New Service'}</CardTitle>
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
                  Auto Translate All
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
                  Auto Translate to Other Languages
                </Button>
              </div>

              {SUPPORTED_LANGS.map(lang => (
                <div key={lang.code} className={activeLangTab === lang.code ? 'block space-y-4' : 'hidden'}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-100 mb-1">Service Name ({lang.label})</label>
                      <Input {...register(`name_${lang.code}`)} placeholder="e.g. Website Development" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-100 mb-1">Description ({lang.label})</label>
                      <Textarea {...register(`description_${lang.code}`)} placeholder="Describe the service..." />
                    </div>
                  </div>
                </div>
              ))}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div>
                  <label className="block text-sm font-medium text-gray-100 mb-1">Price (USD)</label>
                  <Input type="number" {...register('price', { required: true, valueAsNumber: true })} placeholder="e.g. 5000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-100 mb-1">Duration (Minutes)</label>
                  <Input type="number" {...register('duration_minutes', { required: true, valueAsNumber: true })} placeholder="e.g. 60" />
                </div>
                <div className="flex items-center space-x-2 mt-6">
                  <input type="checkbox" id="is_active" {...register('is_active')} className="rounded border-white/20 text-white focus:ring-neon-500/50" />
                  <label htmlFor="is_active" className="text-sm font-medium text-gray-100">Active (Visible to clients)</label>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => { setIsAdding(false); setIsEditing(null); reset(); }}>
                  Cancel
                </Button>
                <Button type="submit">
                  {isEditing ? 'Update Service' : 'Save Service'}
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
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-dark-900 text-gray-100">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{getTranslatedText(service.description, currentLang)}</p>
                  <div className="flex items-center text-sm font-medium text-gray-100 space-x-4">
                    <span>{service.duration_minutes} min</span>
                    <span>•</span>
                    <span>{formatCurrency(service.price)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => toggleActive(service)}>
                    {service.is_active ? <XCircle className="w-4 h-4 mr-1" /> : <CheckCircle2 className="w-4 h-4 mr-1" />}
                    {service.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(service)}>
                    <Edit2 className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(service.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {services.length === 0 && !isAdding && (
            <div className="text-center py-12 text-gray-400 bg-dark-9500 rounded-xl border border-white/10">
              No services found. Add your first service to start accepting bookings.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
