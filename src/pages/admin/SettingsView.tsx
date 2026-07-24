import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { BusinessSettings, BusinessHours, BlockedDate } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useForm } from 'react-hook-form';
import { format, parseISO } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { getDateLocale } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

const AVAILABLE_LANGS = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' },
  { code: 'it', name: 'Italiano' },
  { code: 'ru', name: 'Русский' },
  { code: 'uk', name: 'Українська' }
];

export default function SettingsView() {
  const { i18n } = useTranslation();
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [hours, setHours] = useState<BusinessHours[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [enabledLangs, setEnabledLangs] = useState<string[]>(['en', 'de']);
  
  const [isSaving, setIsSaving] = useState(false);
  
  const { register: registerSettings, handleSubmit: handleSettingsSubmit, reset: resetSettings } = useForm<BusinessSettings>();

  const [newBlockedDate, setNewBlockedDate] = useState('');
  const [newBlockedReason, setNewBlockedReason] = useState('');

  const fetchData = async () => {
    try {
      const [{ data: s, error: sErr }, { data: h, error: hErr }, { data: b, error: bErr }] = await Promise.all([
        supabase.from('business_settings').select('*').limit(1).single(),
        supabase.from('business_hours').select('*').order('weekday'),
        supabase.from('blocked_dates').select('*').order('blocked_date', { ascending: true })
      ]);
      
      if (s) {
        const settingsWithDefaults = {
          ...s,
          booking_phone_required: s.booking_phone_required ?? true,
          booking_phone_visible: s.booking_phone_visible ?? true,
          booking_email_required: s.booking_email_required ?? true,
          booking_email_visible: s.booking_email_visible ?? true
        };
        setSettings(settingsWithDefaults);
        resetSettings(settingsWithDefaults);
        if (s.enabled_languages) {
          setEnabledLangs(s.enabled_languages.split(','));
          localStorage.setItem('viktor_labs_enabled_languages', s.enabled_languages);
        }
        localStorage.setItem('viktor_labs_business_settings', JSON.stringify(settingsWithDefaults));
      } else {
        const localSettings = localStorage.getItem('viktor_labs_business_settings');
        if (localSettings) {
          const parsed = JSON.parse(localSettings);
          setSettings(parsed);
          resetSettings(parsed);
        }
      }
      
      if (h && h.length > 0) {
        // Ensure all 7 days exist in local state
        const allDays = Array.from({ length: 7 }, (_, i) => {
          const dayShifts = h.filter(hd => hd.weekday === i);
          return dayShifts.length > 0 ? dayShifts : [{ weekday: i, is_open: false, start_time: '09:00:00', end_time: '17:00:00', id: `temp-${i}` }];
        }).flat();
        setHours(allDays as BusinessHours[]);
        localStorage.setItem('viktor_labs_business_hours', JSON.stringify(allDays));
      } else {
        const localHours = localStorage.getItem('viktor_labs_business_hours');
        if (localHours) {
          setHours(JSON.parse(localHours));
        } else {
          const defaultHours = Array.from({ length: 7 }, (_, i) => ({
            weekday: i,
            is_open: i > 0 && i < 6,
            start_time: '09:00:00',
            end_time: '17:00:00',
            id: `temp-${i}`
          }));
          setHours(defaultHours as BusinessHours[]);
        }
      }
      
      if (b) setBlockedDates(b);
    } catch (err) {
      console.warn("Error fetching data from Supabase, checking local storage", err);
      // Fallback logic for complete failure
      const localSettings = localStorage.getItem('viktor_labs_business_settings');
      if (localSettings) {
        const parsed = JSON.parse(localSettings);
        setSettings(parsed);
        resetSettings(parsed);
      }
      
      const localHours = localStorage.getItem('viktor_labs_business_hours');
      if (localHours) {
        setHours(JSON.parse(localHours));
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleLanguage = (code: string) => {
    if (enabledLangs.includes(code) && enabledLangs.length === 1) return;
    const newLangs = enabledLangs.includes(code)
      ? enabledLangs.filter(c => c !== code)
      : [...enabledLangs, code];
    setEnabledLangs(newLangs);
  };

  const onSaveSettings = async (data: BusinessSettings) => {
    setIsSaving(true);
    const updatedData = {
      ...data,
      enabled_languages: enabledLangs.join(',')
    };
    localStorage.setItem('viktor_labs_enabled_languages', updatedData.enabled_languages);
    localStorage.setItem('viktor_labs_business_settings', JSON.stringify(updatedData));
    
    if (settings?.id) {
      await supabase.from('business_settings').update(updatedData).eq('id', settings.id);
    } else {
      await supabase.from('business_settings').insert(updatedData);
    }
    setIsSaving(false);
    alert('Einstellungen erfolgreich gespeichert');
    fetchData();
  };

  const handleHourChange = (index: number, field: keyof BusinessHours, value: any) => {
    const newHours = [...hours];
    newHours[index] = { ...newHours[index], [field]: value };
    setHours(newHours);
  };

  const saveHours = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem('viktor_labs_business_hours', JSON.stringify(hours));
      
      const { data: existing } = await supabase.from('business_hours').select('id');
      if (existing && existing.length > 0) {
        await supabase.from('business_hours').delete().in('id', existing.map(e => e.id));
      }
      
      const toInsert = hours.map(({ id, ...rest }) => rest);
      if (toInsert.length > 0) {
        const { error } = await supabase.from('business_hours').insert(toInsert);
        if (error) throw error;
      }
      
      alert('Öffnungszeiten erfolgreich gespeichert');
      fetchData();
    } catch (err: any) {
      console.warn("Hours save to Supabase failed, kept in local storage", err);
      alert('Öffnungszeiten lokal gespeichert (Datenbank-Verbindung fehlgeschlagen)');
      fetchData();
    } finally {
      setIsSaving(false);
    }
  };

  const addHourShift = (weekday: number) => {
    const newHours = [...hours, { 
      id: `temp-${Date.now()}`, 
      weekday, 
      is_open: true, 
      start_time: '09:00:00', 
      end_time: '17:00:00' 
    }];
    setHours(newHours.sort((a, b) => a.weekday - b.weekday || a.start_time.localeCompare(b.start_time)));
  };

  const removeHourShift = (id: string) => {
    setHours(hours.filter(h => h.id !== id));
  };

  const addBlockedDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockedDate) return;
    
    const newBlocked = {
      blocked_date: newBlockedDate,
      reason: newBlockedReason || null
    };

    const localBlocked = localStorage.getItem('viktor_labs_blocked_dates');
    const blocked = localBlocked ? JSON.parse(localBlocked) : [];
    blocked.push({ ...newBlocked, id: crypto.randomUUID() });
    localStorage.setItem('viktor_labs_blocked_dates', JSON.stringify(blocked));
    
    try {
      await supabase.from('blocked_dates').insert(newBlocked);
    } catch (e) {
      console.warn("Blocked date save to Supabase failed", e);
    }
    
    setNewBlockedDate('');
    setNewBlockedReason('');
    fetchData();
  };

  const deleteBlockedDate = async (id: string) => {
    const localBlocked = localStorage.getItem('viktor_labs_blocked_dates');
    if (localBlocked) {
      const blocked = JSON.parse(localBlocked).filter((b: any) => b.id !== id);
      localStorage.setItem('viktor_labs_blocked_dates', JSON.stringify(blocked));
    }

    try {
      await supabase.from('blocked_dates').delete().eq('id', id);
    } catch (e) {
      console.warn("Blocked date delete from Supabase failed", e);
    }
    fetchData();
  };

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    setIsChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      alert('Password updated successfully');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      alert(err.message || 'Failed to update password. Note: If you are logged in with emergency credentials, this action is restricted.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const daysOfWeek = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-50">Einstellungen</h2>
        <p className="text-slate-400">Verwalten Sie Ihr Unternehmensprofil und Ihre Verfügbarkeit.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        
        {/* Business Hours - Made Full Width and More Interactive */}
        <Card className="border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.05)]">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl text-slate-50">Öffnungszeiten & Verfügbarkeit</CardTitle>
              <CardDescription className="text-slate-500">Verwalten Sie Ihre wöchentlichen Arbeitszeiten und Pausen.</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={saveHours} isLoading={isSaving} className="bg-cyan-500 text-dark-950 font-bold">
                Alle Änderungen speichern
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {daysOfWeek.map((dayName, weekdayIndex) => {
                const dayShifts = hours.filter(h => h.weekday === weekdayIndex);
                return (
                  <div key={dayName} className="p-4 bg-dark-900/50 rounded-2xl border border-white/5 space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-slate-50 uppercase tracking-widest text-xs">{dayName}</h4>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => addHourShift(weekdayIndex)}
                        className="h-7 px-2 text-[10px] text-cyan-500 hover:text-cyan-400 hover:bg-cyan-500/10"
                      >
                        + Schicht
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {dayShifts.length === 0 ? (
                        <div className="text-[10px] text-gray-500 italic py-2 text-center bg-dark-950/50 rounded-lg">Geschlossen</div>
                      ) : (
                        dayShifts.map((h, i) => (
                          <div key={h.id} className="group relative flex flex-col gap-1 p-2 bg-dark-950 rounded-xl border border-white/5">
                            <div className="flex items-center gap-2">
                              <Input 
                                type="time" 
                                value={h.start_time.substring(0, 5)} 
                                onChange={(e) => handleHourChange(hours.indexOf(h), 'start_time', e.target.value + ':00')}
                                className="h-7 text-[10px] bg-transparent border-none p-0 focus-visible:ring-0"
                              />
                              <span className="text-[10px] text-gray-600">-</span>
                              <Input 
                                type="time" 
                                value={h.end_time.substring(0, 5)} 
                                onChange={(e) => handleHourChange(hours.indexOf(h), 'end_time', e.target.value + ':00')}
                                className="h-7 text-[10px] bg-transparent border-none p-0 focus-visible:ring-0"
                              />
                              <button 
                                onClick={() => removeHourShift(h.id)}
                                className="text-gray-600 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Business Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Unternehmensprofil</CardTitle>
            <CardDescription>Unternehmensinformationen, die für Kunden sichtbar sind.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSettingsSubmit(onSaveSettings)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-100 mb-1">Unternehmensname</label>
                <Input {...registerSettings('business_name')} placeholder="Viktor Labs" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-100 mb-1">E-Mail Adresse</label>
                <Input type="email" {...registerSettings('business_email')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-100 mb-1">Telefonnummer</label>
                <Input {...registerSettings('business_phone')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-100 mb-1">Adresse</label>
                <Input {...registerSettings('business_address')} />
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-100 mb-1">Termin-Intervall (Min)</label>
                  <Input type="number" {...registerSettings('slot_interval_minutes', { valueAsNumber: true })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-100 mb-1">Buchungsvorlauf (Std)</label>
                  <Input type="number" {...registerSettings('booking_notice_hours', { valueAsNumber: true })} />
                </div>
              </div>
              <Button type="submit" isLoading={isSaving} className="mt-4">
                Profil speichern
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Booking Form Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Buchungsformular-Felder</CardTitle>
            <CardDescription>Konfigurieren Sie, welche Informationen von Kunden abgefragt werden.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-dark-900/50 rounded-2xl border border-white/5">
                <div>
                  <h4 className="text-sm font-medium text-slate-50">E-Mail Adresse</h4>
                  <p className="text-xs text-slate-500">Muss der Kunde eine E-Mail angeben?</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest">Sichtbar</span>
                    <input 
                      type="checkbox" 
                      checked={settings?.booking_email_visible}
                      onChange={(e) => setSettings(prev => prev ? { ...prev, booking_email_visible: e.target.checked } : null)}
                      className="rounded border-white/20 text-cyan-500 focus:ring-cyan-500/50"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest">Pflicht</span>
                    <input 
                      type="checkbox" 
                      checked={settings?.booking_email_required}
                      onChange={(e) => setSettings(prev => prev ? { ...prev, booking_email_required: e.target.checked } : null)}
                      className="rounded border-white/20 text-cyan-500 focus:ring-cyan-500/50"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-dark-900/50 rounded-2xl border border-white/5">
                <div>
                  <h4 className="text-sm font-medium text-slate-50">Telefonnummer</h4>
                  <p className="text-xs text-slate-500">Muss der Kunde eine Telefonnummer angeben?</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest">Sichtbar</span>
                    <input 
                      type="checkbox" 
                      checked={settings?.booking_phone_visible}
                      onChange={(e) => setSettings(prev => prev ? { ...prev, booking_phone_visible: e.target.checked } : null)}
                      className="rounded border-white/20 text-cyan-500 focus:ring-cyan-500/50"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest">Pflicht</span>
                    <input 
                      type="checkbox" 
                      checked={settings?.booking_phone_required}
                      onChange={(e) => setSettings(prev => prev ? { ...prev, booking_phone_required: e.target.checked } : null)}
                      className="rounded border-white/20 text-cyan-500 focus:ring-cyan-500/50"
                    />
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => settings && onSaveSettings(settings)} 
                isLoading={isSaving} 
                className="w-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-500 hover:bg-cyan-500 hover:text-dark-950"
              >
                Formular-Einstellungen speichern
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Language Management */}
        <Card>
          <CardHeader>
            <CardTitle>Sprachverwaltung</CardTitle>
            <CardDescription>Aktivieren oder deaktivieren Sie Sprachen für Ihre Website.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {AVAILABLE_LANGS.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => toggleLanguage(lang.code)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    enabledLangs.includes(lang.code)
                      ? 'bg-cyan-500/10 border-cyan-500/50 text-slate-50'
                      : 'bg-dark-900/50 border-white/5 text-slate-500 hover:border-white/20'
                  }`}
                >
                  <span className="text-sm font-medium">{lang.name}</span>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    enabledLangs.includes(lang.code) ? 'border-cyan-500 bg-cyan-500' : 'border-white/20'
                  }`}>
                    {enabledLangs.includes(lang.code) && <div className="w-1.5 h-1.5 rounded-full bg-dark-950" />}
                  </div>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-gray-500 mt-4 italic">
              * Mindestens eine Sprache muss aktiviert bleiben. Änderungen werden nach dem Speichern des Profils übernommen.
            </p>
          </CardContent>
        </Card>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Blocked Dates */}
          <Card>
            <CardHeader>
              <CardTitle>Blockierte Termine</CardTitle>
              <CardDescription>Fügen Sie spezifische Daten hinzu, an denen Sie nicht verfügbar sind.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={addBlockedDate} className="flex items-end gap-2 mb-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-100 mb-1">Datum</label>
                  <Input type="date" value={newBlockedDate} onChange={e => setNewBlockedDate(e.target.value)} required />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-100 mb-1">Grund (Optional)</label>
                  <Input value={newBlockedReason} onChange={e => setNewBlockedReason(e.target.value)} placeholder="z.B. Urlaub" />
                </div>
                <Button type="submit">Hinzufügen</Button>
              </form>

              <div className="space-y-2">
                {blockedDates.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">Keine blockierten Daten.</p>
                ) : (
                  blockedDates.map(b => (
                    <div key={b.id} className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
                      <div>
                        <div className="font-medium text-sm text-white">{format(parseISO(b.blocked_date), 'd. MMM yyyy', { locale: getDateLocale(i18n.language) })}</div>
                        {b.reason && <div className="text-xs text-gray-400">{b.reason}</div>}
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => deleteBlockedDate(b.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Sicherheit</CardTitle>
              <CardDescription>Aktualisieren Sie Ihr Kontopasswort.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-100 mb-1">Neues Passwort</label>
                  <Input 
                    type="password" 
                    value={newPassword} 
                    onChange={e => setNewPassword(e.target.value)} 
                    placeholder="Mind. 6 Zeichen"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-100 mb-1">Neues Passwort bestätigen</label>
                  <Input 
                    type="password" 
                    value={confirmPassword} 
                    onChange={e => setConfirmPassword(e.target.value)} 
                  />
                </div>
                <Button type="submit" isLoading={isChangingPassword} className="w-full">
                  Passwort aktualisieren
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
