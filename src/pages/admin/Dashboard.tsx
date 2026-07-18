import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Appointment } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { format, parseISO, isToday, isFuture } from 'date-fns';
import { getDateLocale } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { Calendar, Users, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { i18n } = useTranslation();
  const [stats, setStats] = useState({
    upcoming: 0,
    completed: 0,
    totalServices: 0
  });
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true);
      
      const today = format(new Date(), 'yyyy-MM-dd');
      let appointments: Appointment[] = [];
      let servicesCount = 0;

      try {
        // Fetch appointments
        const { data, error } = await supabase
          .from('appointments')
          .select('*, services(name)')
          .order('appointment_date', { ascending: false })
          .order('start_time', { ascending: false });
        
        if (error) throw error;
        if (data) appointments = data;

        // Fetch services count
        const { count } = await supabase
          .from('services')
          .select('*', { count: 'exact', head: true });
        servicesCount = count || 0;
      } catch (err) {
        console.warn("Supabase dashboard fetch failed, using localStorage", err);
        const localApps = localStorage.getItem('zetta_appointments');
        if (localApps) appointments = JSON.parse(localApps);
        
        const localSvcs = localStorage.getItem('zetta_services');
        if (localSvcs) servicesCount = JSON.parse(localSvcs).length;
      }

      if (appointments) {
        const upcoming = appointments.filter(a => 
          a.status !== 'cancelled' && 
          (a.appointment_date > today || (a.appointment_date === today && a.start_time > format(new Date(), 'HH:mm:ss')))
        );
        
        const completed = appointments.filter(a => a.status === 'confirmed' && a.appointment_date < today);
        
        setStats({
          upcoming: upcoming.length,
          completed: completed.length,
          totalServices: servicesCount || 0
        });

        // Get 5 most recent upcoming/pending
        setRecentAppointments(
          upcoming
            .sort((a, b) => {
              const dateA = new Date(`${a.appointment_date}T${a.start_time}`);
              const dateB = new Date(`${b.appointment_date}T${b.start_time}`);
              return dateA.getTime() - dateB.getTime();
            })
            .slice(0, 5)
        );
      }
      
      setIsLoading(false);
    }
    
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-64 bg-dark-900 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-dark-900 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard</h1>
        <p className="text-gray-400">Willkommen im Zetta Digital Admin-Bereich.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="bg-blue-50/10 p-4 rounded-full mr-4">
              <Calendar className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Anstehende Termine</p>
              <h3 className="text-3xl font-bold text-white">{stats.upcoming}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="bg-green-50/10 p-4 rounded-full mr-4">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Abgeschlossene Sitzungen</p>
              <h3 className="text-3xl font-bold text-white">{stats.completed}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="bg-purple-50/10 p-4 rounded-full mr-4">
              <Clock className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Aktive Leistungen</p>
              <h3 className="text-3xl font-bold text-white">{stats.totalServices}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Anstehende Termine</CardTitle>
          <Link to="/admin/appointments" className="text-sm text-gray-400 hover:text-white font-medium">
            Alle ansehen
          </Link>
        </CardHeader>
        <CardContent>
          {recentAppointments.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              Keine anstehenden Termine.
            </div>
          ) : (
            <div className="space-y-4">
              {recentAppointments.map(apt => (
                <div key={apt.id} className="flex items-center justify-between p-4 border border-white/10 rounded-lg bg-dark-900/30">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-dark-950 rounded-full border border-white/10 flex flex-col items-center justify-center mr-4 shadow-sm">
                      <span className="text-xs font-bold text-white">{format(parseISO(apt.appointment_date), 'd')}</span>
                      <span className="text-[10px] uppercase text-gray-400">{format(parseISO(apt.appointment_date), 'MMM', { locale: getDateLocale(i18n.language) })}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{apt.full_name}</h4>
                      <p className="text-sm text-gray-400">
                        {apt.services?.name} • {apt.start_time.substring(0, 5)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      apt.status === 'confirmed' ? 'bg-green-900/40 text-green-400' :
                      apt.status === 'pending' ? 'bg-yellow-900/40 text-yellow-400' :
                      'bg-red-900/40 text-red-400'
                    }`}>
                      {apt.status === 'confirmed' ? 'Bestätigt' : apt.status === 'pending' ? 'Ausstehend' : 'Storniert'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
