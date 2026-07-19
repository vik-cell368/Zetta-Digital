import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Appointment } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { format, parseISO } from 'date-fns';
import { getDateLocale } from '@/lib/utils';
import { Check, X, Calendar, Clock, User, Mail, Phone, FileText } from 'lucide-react';
import { getTranslatedText } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export default function AppointmentsView() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language.split('-')[0] || 'en';

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('appointments')
        .select('*, services(name)')
        .order('start_time', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      if (data) setAppointments(data);
    } catch (err) {
      console.warn("Supabase fetch failed, falling back to localStorage", err);
      const localData = localStorage.getItem('zetta_appointments');
      if (localData) {
        let apps = JSON.parse(localData) as Appointment[];
        if (filter !== 'all') {
          apps = apps.filter(a => a.status === filter);
        }
        setAppointments(apps);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const saveToLocal = (newApps: Appointment[]) => {
    localStorage.setItem('zetta_appointments', JSON.stringify(newApps));
    setAppointments(newApps);
  };

  useEffect(() => {
    fetchAppointments();
  }, [filter]);

  const updateStatus = async (id: string, status: 'confirmed' | 'cancelled') => {
    try {
      const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
      if (error) throw error;
      fetchAppointments();
    } catch (err) {
      console.warn("Supabase status update failed, updating localStorage", err);
      const localData = localStorage.getItem('zetta_appointments');
      if (localData) {
        const apps = JSON.parse(localData) as Appointment[];
        const updated = apps.map(app => app.id === id ? { ...app, status } : app);
        localStorage.setItem('zetta_appointments', JSON.stringify(updated));
        
        // Update view state with filter
        let filtered = [...updated];
        if (filter !== 'all') filtered = filtered.filter(a => a.status === filter);
        setAppointments(filtered);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Termine</h2>
          <p className="text-gray-400">Verwalten Sie Ihre Buchungen und Ihren Zeitplan.</p>
        </div>
        <div className="flex space-x-2 bg-dark-900 p-1 rounded-lg">
          {(['all', 'pending', 'confirmed', 'cancelled'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
                filter === f ? 'bg-dark-950 text-white shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              {f === 'all' ? 'Alle' : f === 'pending' ? 'Ausstehend' : f === 'confirmed' ? 'Bestätigt' : 'Storniert'}
            </button>
          ))}
        </div>
      </div>

      {!isLoading && (
        <div className="space-y-4">
          {appointments.map(apt => (
            <Card key={apt.id}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  
                  {/* Left Column: Date & Status */}
                  <div className="flex items-start lg:w-1/4">
                    <div className="bg-dark-900 p-3 rounded-xl mr-4 text-center min-w-[70px]">
                      <div className="text-xs font-bold text-gray-400 uppercase">{format(parseISO(apt.start_time), 'MMM', { locale: getDateLocale(i18n.language) })}</div>
                      <div className="text-2xl font-black text-white">{format(parseISO(apt.start_time), 'd')}</div>
                    </div>
                    <div>
                      <div className="font-medium text-white">{format(parseISO(apt.start_time), 'EEEE', { locale: getDateLocale(i18n.language) })}</div>
                      <div className="flex items-center text-gray-400 text-sm mt-1">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        {format(parseISO(apt.start_time), 'HH:mm')} - {format(parseISO(apt.end_time), 'HH:mm')}
                      </div>
                      <div className="mt-2">
                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          apt.status === 'confirmed' ? 'bg-green-900/40 text-green-400' :
                          apt.status === 'pending' ? 'bg-yellow-900/40 text-yellow-400' :
                          'bg-red-900/40 text-red-400'
                        }`}>
                          {apt.status === 'confirmed' ? 'Bestätigt' : apt.status === 'pending' ? 'Ausstehend' : 'Storniert'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: Details */}
                  <div className="flex-1 space-y-3 border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-6">
                    <div className="font-semibold text-lg text-white mb-2">{getTranslatedText(apt.services?.name, currentLang)}</div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center text-sm text-gray-400">
                        <User className="w-4 h-4 mr-2 text-gray-500" />
                        {apt.full_name}
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <Phone className="w-4 h-4 mr-2 text-gray-500" />
                        {apt.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-400 sm:col-span-2">
                        <Mail className="w-4 h-4 mr-2 text-gray-500" />
                        {apt.email}
                      </div>
                      {apt.notes && (
                        <div className="flex items-start text-sm text-gray-400 sm:col-span-2 mt-2 bg-dark-900/50 p-3 rounded-md">
                          <FileText className="w-4 h-4 mr-2 text-gray-500 mt-0.5 shrink-0" />
                          <span className="italic">{apt.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex lg:flex-col justify-end gap-2 border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-6">
                    {apt.status === 'pending' && (
                      <>
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => updateStatus(apt.id, 'confirmed')}
                        >
                          <Check className="w-4 h-4 mr-1" /> Bestätigen
                        </Button>
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => updateStatus(apt.id, 'cancelled')}
                        >
                          <X className="w-4 h-4 mr-1" /> Stornieren
                        </Button>
                      </>
                    )}
                    {apt.status === 'confirmed' && (
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => updateStatus(apt.id, 'cancelled')}
                      >
                        <X className="w-4 h-4 mr-1" /> Buchung stornieren
                      </Button>
                    )}
                  </div>

                </div>
              </CardContent>
            </Card>
          ))}
          {appointments.length === 0 && (
            <div className="text-center py-12 text-gray-400 bg-dark-950 rounded-xl border border-white/10">
              Keine Termine für diesen Filter gefunden.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
