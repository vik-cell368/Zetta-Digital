import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, limit, addDoc, getDoc, doc } from 'firebase/firestore';
import { Service, BusinessSettings, BusinessHours, BlockedDate } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ArrowRight, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Loader2,
  Upload,
  FileText,
  X,
  Monitor,
  Layout,
  Palette,
  Zap,
  Settings,
  BarChart3,
  Bot,
  Globe,
  Server,
  Sparkles,
  Info,
  Plus,
  Minus,
  Check
} from 'lucide-react';
import { format, parse, isAfter, startOfDay, addDays, isSameDay, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { cn, formatCurrency, getTranslatedText } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';

type Step = 'service' | 'date' | 'time' | 'details' | 'success';

interface BookingFormData {
  full_name: string;
  email: string;
  phone: string;
  notes: string;
  industry: string;
  company: string;
  size: string;
  startDate: string;
}

const pageVariants = {
  initial: { opacity: 0, x: 20, filter: 'blur(10px)' },
  in: { opacity: 1, x: 0, filter: 'blur(0px)' },
  out: { opacity: 0, x: -20, filter: 'blur(10px)' }
};

const pageTransition = {
  type: 'tween' as const,
  ease: 'anticipate' as const,
  duration: 0.5
};

interface Option {
  id: string;
  name: string;
  price: number;
  monthly?: boolean;
  desc?: string;
  category: string;
  required?: boolean;
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  options: Option[];
  multiple?: boolean;
}

const CONFIG_DATA: Category[] = [
  {
    id: 'base',
    name: '1. Website (Pflicht)',
    icon: <Monitor className="w-5 h-5" />,
    options: [
      { 
        id: 'p_starter', 
        name: 'Standard Website', 
        price: 550, 
        category: 'base', 
        desc: 'Inklusive 4 Seiten: Startseite, Über uns, Kontakt, Impressum & Datenschutz' 
      },
    ],
  },
  {
    id: 'pages',
    name: '2. Seitenanzahl',
    icon: <Layout className="w-5 h-5" />,
    options: [], 
  },
  {
    id: 'design',
    name: '3. Design & Branding',
    icon: <Palette className="w-5 h-5" />,
    multiple: true,
    options: [
      { id: 'd_branding', name: 'Individuelles Branding', price: 150, category: 'design' },
      { id: 'd_ui', name: 'Premium UI Design', price: 250, category: 'design' },
      { id: 'd_dark', name: 'Dark Mode', price: 80, category: 'design' },
      { id: 'd_logo', name: 'Logo Design', price: 120, category: 'design' },
    ],
  },
  {
    id: 'animations',
    name: '4. Animationen',
    icon: <Zap className="w-5 h-5" />,
    multiple: true,
    options: [
      { id: 'a_2d', name: '2D Animation', price: 80, category: 'animations' },
      { id: 'a_2d_custom', name: 'Individuelle 2D Animation', price: 200, category: 'animations' },
      { id: 'a_3d', name: '3D Animation', price: 180, category: 'animations' },
      { id: 'a_3d_custom', name: 'Individuelle 3D Animation', price: 299, category: 'animations' },
      { id: 'a_sound', name: 'Soundeffekte', price: 79, category: 'animations' },
    ],
  },
  {
    id: 'functions',
    name: '5. Funktionen',
    icon: <Settings className="w-5 h-5" />,
    multiple: true,
    options: [
      { id: 'f_form', name: 'Kontaktformular', price: 0, category: 'functions', desc: 'Inklusive' },
      { id: 'f_maps', name: 'Google Maps', price: 25, category: 'functions' },
      { id: 'f_wa', name: 'WhatsApp Button', price: 30, category: 'functions' },
      { id: 'f_booking', name: 'Terminbuchung', price: 129, category: 'functions' },
      { id: 'f_news', name: 'Newsletter', price: 120, category: 'functions' },
      { id: 'f_blog', name: 'Blog', price: 150, category: 'functions' },
      { id: 'f_lang', name: 'Mehrsprachigkeit', price: 200, category: 'functions' },
      { id: 'f_cookie', name: 'Cookie Banner', price: 0, category: 'functions', desc: 'Inklusive' },
    ],
  },
  {
    id: 'marketing',
    name: '6. Marketing',
    icon: <BarChart3 className="w-5 h-5" />,
    multiple: true,
    options: [
      { id: 'm_rev', name: 'Google Bewertungen', price: 99, category: 'marketing' },
      { id: 'm_social', name: 'Social Media Verbindung', price: 70, category: 'marketing', monthly: true, desc: '70€ / Monat' },
      { id: 'm_insta', name: 'Instagram Feed', price: 70, category: 'marketing' },
      { id: 'm_fb', name: 'Facebook Feed', price: 70, category: 'marketing' },
      { id: 'm_seo_base', name: 'SEO Basis', price: 150, category: 'marketing' },
      { id: 'm_seo_premium', name: 'Premium SEO', price: 390, category: 'marketing' },
      { id: 'm_analytics', name: 'Google Analytics', price: 70, category: 'marketing' },
    ],
  },
  {
    id: 'ai',
    name: '7. KI & Automation',
    icon: <Bot className="w-5 h-5" />,
    multiple: true,
    options: [
      { id: 'ai_bot', name: 'Chatbot Einrichtung', price: 299, category: 'ai' },
      { id: 'ai_data', name: 'Chatbot Datenpflege', price: 15, category: 'ai', desc: 'je Datensatz' },
      { id: 'ai_form', name: 'Kontaktformular-KI', price: 25, category: 'ai', monthly: true, desc: '25€ / Monat' },
      { id: 'ai_email', name: 'Email Automation', price: 49, category: 'ai', monthly: true, desc: '49€ / Monat' },
      { id: 'ai_sheets', name: 'Google Sheets Automation', price: 49, category: 'ai', monthly: true, desc: '49€ / Monat' },
      { id: 'ai_sm_auto', name: 'Social Media Automation', price: 49, category: 'ai', monthly: true, desc: '49€ / Monat' },
      { id: 'ai_crm', name: 'CRM Automation', price: 79, category: 'ai', monthly: true, desc: '79€ / Monat' },
      { id: 'ai_wa_auto', name: 'WhatsApp Automation', price: 79, category: 'ai', monthly: true, desc: '79€ / Monat' },
    ],
  },
  {
    id: 'maintenance',
    name: '8. Verwaltung',
    icon: <Globe className="w-5 h-5" />,
    options: [
      { id: 'v_none', name: 'Keine', price: 0, category: 'maintenance' },
      { id: 'v_standard', name: 'Standard Verwaltung', price: 59, category: 'maintenance', monthly: true, desc: '59€ / Monat' },
      { id: 'v_komplett', name: 'Komplett Verwaltung', price: 99, category: 'maintenance', monthly: true, desc: '99€ / Monat' },
    ],
  },
  {
    id: 'hosting',
    name: '9. Domain & Hosting',
    icon: <Server className="w-5 h-5" />,
    multiple: true,
    options: [
      { id: 'h_vercel', name: 'Vercel Subdomain', price: 0, category: 'hosting', desc: 'Kostenlos' },
      { id: 'h_de', name: '.de Domain', price: 0, category: 'hosting', desc: 'nach Anbieter' },
      { id: 'h_com', name: '.com Domain', price: 0, category: 'hosting', desc: 'nach Anbieter' },
      { id: 'h_setup', name: 'Hosting Einrichtung', price: 0, category: 'hosting', desc: 'Inklusive' },
    ],
  },
];

interface TimeSlot {
  time: string;
  isAvailable: boolean;
  isBooked: boolean;
}

export default function Booking() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const currentLang = i18n.language.split('-')[0] || 'en';
  
  const queryParams = new URLSearchParams(location.search);
  const initialServiceId = queryParams.get('serviceId');

  const [step, setStep] = useState<Step>('service');
  const [dbServices, setDbServices] = useState<Service[]>([]);
  const [selections, setSelections] = useState<Record<string, string[]>>({
    base: ['p_starter']
  });
  const [additionalPages, setAdditionalPages] = useState(0);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [businessHours, setBusinessHours] = useState<BusinessHours[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableTimes, setAvailableTimes] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<BookingFormData>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const removeFile = () => setUploadedFile(null);

  useEffect(() => {
    async function fetchInitialData() {
      setIsLoading(true);
      try {
        // 1. Fetch Services for Configurator
        try {
          const q = query(collection(db, 'services'), where('is_active', '==', true), where('is_calculator_option', '==', true));
          const snapshot = await getDocs(q);
          const services = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
          setDbServices(services);
        } catch (err) {
          console.error("Failed to fetch calculator services", err);
        }

        // 2. Fetch Settings
        try {
          const bSnapshot = await getDocs(query(collection(db, 'business_settings'), limit(1)));
          if (!bSnapshot.empty) {
            const bSettings = bSnapshot.docs[0].data() as BusinessSettings;
            const s = {
              ...bSettings,
              booking_phone_required: bSettings.booking_phone_required ?? true,
              booking_phone_visible: bSettings.booking_phone_visible ?? true,
              booking_email_required: bSettings.booking_email_required ?? true,
              booking_email_visible: bSettings.booking_email_visible ?? true
            };
            setSettings(s);
            localStorage.setItem('viktor_labs_business_settings', JSON.stringify(s));
          } else {
            const local = localStorage.getItem('viktor_labs_business_settings');
            if (local) setSettings(JSON.parse(local));
          }
        } catch (err) {
          console.warn("Settings fetch failed", err);
        }

        // 3. Fetch Hours
        try {
          const hSnapshot = await getDocs(query(collection(db, 'business_hours'), orderBy('weekday')));
          if (!hSnapshot.empty) {
            const bHours = hSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BusinessHours));
            setBusinessHours(bHours);
            localStorage.setItem('viktor_labs_business_hours', JSON.stringify(bHours));
          } else {
            const local = localStorage.getItem('viktor_labs_business_hours');
            if (local) setBusinessHours(JSON.parse(local));
            else {
              const defaults = Array.from({ length: 7 }, (_, i) => ({
                weekday: i,
                is_open: i > 0 && i < 6,
                start_time: '09:00:00',
                end_time: '17:00:00',
                id: `temp-${i}`
              }));
              setBusinessHours(defaults as BusinessHours[]);
            }
          }
        } catch (err) {
          console.warn("Hours fetch failed", err);
        }

        // 4. Fetch Blocked Dates
        try {
          const dSnapshot = await getDocs(collection(db, 'blocked_dates'));
          const bBlocked = dSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlockedDate));
          if (bBlocked.length > 0) {
            setBlockedDates(bBlocked);
            localStorage.setItem('viktor_labs_blocked_dates', JSON.stringify(bBlocked));
          } else {
            const local = localStorage.getItem('viktor_labs_blocked_dates');
            if (local) setBlockedDates(JSON.parse(local));
          }
        } catch (err) {
          console.warn("Blocked dates fetch failed", err);
        }

      } catch (err) {
        console.error("Global booking fetch error", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchInitialData();
  }, [initialServiceId]);

  const mergedConfigData = useMemo(() => {
    const data = [...CONFIG_DATA];
    
    dbServices.forEach(service => {
      const categoryId = service.category || 'functions';
      let category = data.find(c => c.id === categoryId);
      
      if (!category) {
        category = {
          id: categoryId,
          name: categoryId.charAt(0).toUpperCase() + categoryId.slice(1),
          icon: <Settings className="w-5 h-5" />,
          options: [],
          multiple: true
        };
        data.push(category);
      }

      const exists = category.options.some(o => o.id === service.id);
      if (!exists) {
        category.options.push({
          id: service.id,
          name: getTranslatedText(service.name, 'de'),
          price: service.price,
          monthly: service.is_monthly,
          desc: getTranslatedText(service.description, 'de'),
          category: categoryId
        });
      }
    });

    return data;
  }, [dbServices]);

  const toggleOption = (category: string, optionId: string, multiple?: boolean) => {
    setSelections(prev => {
      const current = prev[category] || [];
      if (multiple) {
        if (current.includes(optionId)) {
          return { ...prev, [category]: current.filter(id => id !== optionId) };
        } else {
          return { ...prev, [category]: [...current, optionId] };
        }
      } else {
        return { ...prev, [category]: [optionId] };
      }
    });
  };

  const selectedOptionsList = useMemo(() => {
    const list: Option[] = [];
    Object.entries(selections).forEach(([catId, optIds]) => {
      const cat = mergedConfigData.find(c => c.id === catId);
      if (cat) {
        optIds.forEach(id => {
          const opt = cat.options.find(o => o.id === id);
          if (opt) list.push(opt);
        });
      }
    });
    return list;
  }, [selections, mergedConfigData]);

  const totals = useMemo(() => {
    const baseTotal = selectedOptionsList.reduce(
      (acc, curr) => {
        if (curr.monthly) acc.monthly += curr.price;
        else acc.oneTime += curr.price;
        return acc;
      },
      { oneTime: 0, monthly: 0 }
    );
    baseTotal.oneTime += additionalPages * 49;
    return baseTotal;
  }, [selectedOptionsList, additionalPages]);

  const [isTimesLoading, setIsTimesLoading] = useState(false);
  
  const handleDateSelect = async (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(null);
    if (!date) return;
    
    // Default duration for strategy session if none selected
    const duration = 45; 
    
    setStep('time');
    setAvailableTimes([]); 
    setIsTimesLoading(true);
    
    try {
      const rangeStart = startOfDay(addDays(date, -1)).toISOString();
      const rangeEnd = startOfDay(addDays(date, 2)).toISOString();

      let fetchedAppointments: Array<{ start_time: string; end_time: string; status?: string }> = [];

      try {
        const q = query(
          collection(db, 'appointments'),
          where('status', 'in', ['confirmed', 'pending']),
          where('start_time', '>=', rangeStart),
          where('start_time', '<', rangeEnd)
        );
        const querySnapshot = await getDocs(q);
        fetchedAppointments = querySnapshot.docs.map(doc => doc.data() as any);
      } catch (err) {
        console.warn("Firestore appointments fetch failed", err);
      }

      const localAppsRaw = localStorage.getItem('viktor_labs_appointments');
      let localApps: Array<{ start_time?: string; end_time?: string; status?: string }> = [];
      if (localAppsRaw) {
        try {
          localApps = JSON.parse(localAppsRaw);
        } catch {
          localApps = [];
        }
      }

      const allAppointments = [
        ...fetchedAppointments,
        ...localApps.filter(a => a.start_time && a.end_time && (a.status === 'confirmed' || a.status === 'pending' || !a.status))
      ];

      const times: TimeSlot[] = [];
      const weekday = date.getDay();
      const dayShifts = businessHours.filter(h => h.weekday === weekday && h.is_open);
      const interval = settings?.slot_interval_minutes || 30;
      
      for (const shift of dayShifts) {
        const [sH, sM] = shift.start_time.split(':').map(Number);
        const [eH, eM] = shift.end_time.split(':').map(Number);
        
        let current = new Date(date);
        current.setHours(sH, sM, 0, 0);
        
        const end = new Date(date);
        end.setHours(eH, eM, 0, 0);

        while (current < end) {
          const timeString = format(current, 'HH:mm:ss');
          const slotStart = current;
          const slotEnd = new Date(slotStart.getTime() + duration * 60000);

          if (slotEnd > end) break;

          let isAvailable = true;
          let isBooked = false;

          const threeHoursFromNow = new Date(new Date().getTime() + 3 * 60 * 60000);
          if (isSameDay(date, new Date()) && !isAfter(slotStart, threeHoursFromNow)) {
            isAvailable = false;
          }

          if (allAppointments.length > 0) {
            const slotStartMs = slotStart.getTime();
            const slotEndMs = slotEnd.getTime();

            for (const appt of allAppointments) {
              if (!appt.start_time || !appt.end_time) continue;
              const apptStartMs = new Date(appt.start_time).getTime();
              const apptEndMs = new Date(appt.end_time).getTime();

              if (slotStartMs < apptEndMs && slotEndMs > apptStartMs) {
                isAvailable = false;
                isBooked = true;
                break;
              }
            }
          }

          times.push({
            time: timeString,
            isAvailable,
            isBooked
          });
          
          current = new Date(current.getTime() + interval * 60000);
        }
      }
      setAvailableTimes(times);
    } catch (e) {
      console.warn("Error processing available times", e);
      setAvailableTimes([]);
    } finally {
      setIsTimesLoading(false);
    }
  };

  const onSubmitDetails = async (data: BookingFormData) => {
    if (!selectedDate || !selectedTime) return;

    setIsSubmitting(true);
    const startDateTime = parse(
      `${format(selectedDate, 'yyyy-MM-dd')} ${selectedTime}`,
      'yyyy-MM-dd HH:mm:ss',
      new Date()
    );
    // Fixed duration for strategy session (45m)
    const endDateTime = new Date(startDateTime.getTime() + 45 * 60000);

    const servicesList = selectedOptionsList.map(o => ({
      id: o.id,
      description: o.name + (o.monthly ? ' (monatl.)' : ''),
      price: o.price
    }));

    if (additionalPages > 0) {
      servicesList.push({
        id: 'pages_extra',
        description: `${additionalPages} zusätzliche Seiten`,
        price: additionalPages * 49
      });
    }

    const fullNotes = `Konfiguration:\n` + 
                      `${selectedOptionsList.map(o => `- ${o.name} (${o.price}€)`).join('\n')}\n` +
                      `${additionalPages > 0 ? `- ${additionalPages} zusätzliche Seiten (${additionalPages * 49}€)\n` : ''}` +
                      `-------------------\n` +
                      `Branche: ${data.industry}\n` +
                      `Unternehmen: ${data.company}\n` +
                      `Größe: ${data.size}\n` +
                      `Wunschstart: ${data.startDate}\n` +
                      `-------------------\n` +
                      `Nachricht: ${data.notes}\n` +
                      `Datei: ${uploadedFile ? uploadedFile.name : 'Keine'}`;

    const payload = {
      type: 'booking',
      services_list: servicesList,
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString(),
      status: 'pending',
      notes: fullNotes,
      company: data.company,
      industry: data.industry,
      street: '', 
      zip: '',
      city: '',
      country: 'Deutschland'
    };

    try {
      const docRef = await addDoc(collection(db, 'appointments'), {
        ...payload,
        created_at: new Date().toISOString()
      });

      const localLeads = localStorage.getItem('viktor_labs_appointments');
      const leads = localLeads ? JSON.parse(localLeads) : [];
      leads.push({ ...payload, id: docRef.id, created_at: new Date().toISOString() });
      localStorage.setItem('viktor_labs_appointments', JSON.stringify(leads));

      // Send confirmation email via our API
      try {
        await fetch('/api/booking/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: data.email,
            name: data.full_name,
            date: format(selectedDate, 'd. MMMM yyyy', { locale: de }),
            time: format(parse(selectedTime, 'HH:mm:ss', new Date()), 'HH:mm'),
            services: servicesList.map(s => s.description).join(', ')
          })
        });
      } catch (emailErr) {
        console.warn("Could not send confirmation email", emailErr);
      }

      setStep('success');
    } catch (err) {
      console.warn("Firebase booking failed, saved to local lead management", err);
      // Local fallback ID
      const localId = crypto.randomUUID();
      const localLeads = localStorage.getItem('viktor_labs_appointments');
      const leads = localLeads ? JSON.parse(localLeads) : [];
      leads.push({ ...payload, id: localId, created_at: new Date().toISOString() });
      localStorage.setItem('viktor_labs_appointments', JSON.stringify(leads));
      
      handleFirestoreError(err, OperationType.CREATE, 'appointments');
      setStep('success');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-dark-950 py-12 md:py-24 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.05)_0%,transparent_50%)] pointer-events-none" />
      
      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        
        {/* Header */}
        <div className="mb-24 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/[0.03] border border-white/10 text-cyan-500 text-[10px] uppercase tracking-[0.3em] font-black backdrop-blur-md"
          >
            Consultation
          </motion.div>
          <h1 className="text-5xl md:text-8xl font-display font-medium text-white tracking-tight leading-[0.9]">{t('booking.title')}</h1>
          <p className="text-slate-400 text-xl md:text-2xl font-light max-w-2xl mx-auto leading-relaxed">Vereinbaren Sie ein Gespräch mit unseren Experten.</p>
        </div>

          <div className="flex justify-center mb-16 px-2">
            <div className="flex items-center justify-between font-mono text-[9px] md:text-xs uppercase tracking-widest w-full max-w-2xl">
              {['service', 'date', 'time', 'details'].map((s, i, arr) => {
                const isActive = step === s;
                const isCompleted = arr.indexOf(step) > i;
                
                return (
                  <div key={s} className="flex flex-col items-center gap-2 relative">
                    <span className={cn(
                      "w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center border transition-all duration-500 text-[10px]",
                      isActive ? "bg-cyan-500 border-cyan-500 text-dark-950 font-bold scale-110 shadow-[0_0_15px_rgba(6,182,212,0.3)]" : 
                      isCompleted ? "bg-white/10 border-transparent text-white" : "border-white/20 text-gray-500"
                    )}>
                      {isCompleted ? <CheckCircle2 size={14} /> : i + 1}
                    </span>
                    <span className={cn(
                      "tracking-[0.15em] transition-colors text-center absolute -bottom-6 left-1/2 -translate-x-1/2 w-20",
                      isActive ? "text-cyan-500" : isCompleted ? "text-white" : "text-gray-500"
                    )}>
                      {t(`booking.step_${s}`)}
                    </span>
                    {i < arr.length - 1 && (
                      <div className="absolute top-3.5 md:top-4 left-full w-[calc(200%-3rem)] h-px bg-white/10 -z-10" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        <AnimatePresence mode="wait">
          {/* STEP: SERVICE (CONFIGURATOR STYLE) */}
          {step === 'service' && (
            <motion.div 
              key="service"
              initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}
              className="flex flex-col lg:flex-row gap-12 items-start"
            >
              {isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center py-40 gap-4">
                  <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
                  <p className="text-slate-400 font-mono text-xs uppercase tracking-widest">Lade Konfiguration...</p>
                </div>
              ) : (
                <>
                  <div className="flex-1 space-y-16 w-full">
                    {mergedConfigData.map((category) => (
                      <section key={category.id} className="space-y-6">
                        <div className="flex items-center gap-4 mb-8">
                          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                            {category.icon}
                          </div>
                          <h2 className="text-2xl font-display font-bold text-slate-50">{category.name}</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {category.id === 'pages' ? (
                            <div className="col-span-full bg-dark-900 border border-white/5 rounded-[2.5rem] p-8 md:p-12 flex flex-col items-center justify-center space-y-8">
                              <div className="text-center">
                                <h4 className="text-2xl font-display font-bold text-white mb-3">Wie viele zusätzliche Seiten?</h4>
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8">
                                  <Check className="w-3.5 h-3.5 text-cyan-500" />
                                  <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">4 Seiten sind bereits inklusive</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-8 md:gap-12">
                                <button 
                                  onClick={() => setAdditionalPages(Math.max(0, additionalPages - 1))}
                                  className="w-14 h-14 md:w-20 md:h-20 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-cyan-500 transition-all active:scale-90 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                                >
                                  <Minus size={28} />
                                </button>
                                
                                <div className="flex flex-col items-center min-w-[140px] md:min-w-[180px]">
                                  <span className="text-7xl md:text-9xl font-display font-bold text-white leading-none tracking-tighter">
                                    {additionalPages}
                                  </span>
                                  <span className="text-[11px] uppercase tracking-[0.4em] text-cyan-500 font-black mt-6">
                                    {additionalPages === 1 ? 'Weitere Seite' : 'Weitere Seiten'}
                                  </span>
                                </div>

                                <button 
                                  onClick={() => setAdditionalPages(additionalPages + 1)}
                                  className="w-14 h-14 md:w-20 md:h-20 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-cyan-500 transition-all active:scale-90 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                                >
                                  <Plus size={28} />
                                </button>
                              </div>
                              
                              <div className="text-cyan-500 font-black text-lg bg-cyan-500/10 px-8 py-3 rounded-full border border-cyan-500/20 mt-4">
                                + {(additionalPages * 49).toLocaleString('de-DE')} €
                                <span className="text-slate-500 text-xs font-normal ml-4 uppercase tracking-widest">(49 € pro Seite)</span>
                              </div>
                            </div>
                          ) : (
                            category.options.map((option) => {
                              const isSelected = (selections[category.id] || []).includes(option.id);
                              return (
                                <button
                                  key={option.id}
                                  onClick={() => toggleOption(category.id, option.id, category.multiple)}
                                  className={`text-left p-6 rounded-[2rem] border transition-all relative group h-full flex flex-col ${
                                    isSelected 
                                      ? 'bg-cyan-500/10 border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.1)]' 
                                      : 'bg-dark-900 border-white/5 hover:border-white/10'
                                  }`}
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <span className={`text-lg font-bold ${isSelected ? 'text-cyan-500' : 'text-slate-50'}`}>
                                      {option.name}
                                    </span>
                                    {isSelected && (
                                      <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center">
                                        <Check className="w-4 h-4 text-dark-950" />
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-slate-500 text-xs mb-6 flex-1">
                                    {option.desc || (category.multiple ? 'Optional' : '')}
                                  </p>
                                  
                                  <div className="flex justify-end items-center mt-auto">
                                    <span className="text-xl font-display font-bold text-slate-50">
                                      {option.price === 0 ? 'inkl.' : `${option.price}€`}
                                      {option.monthly && <span className="text-xs text-slate-500 ml-1">/ Mo.</span>}
                                    </span>
                                  </div>
                                </button>
                              );
                            })
                          )}
                        </div>
                      </section>
                    ))}
                  </div>

                  {/* Config Sidebar */}
                  <div className="lg:w-[420px] w-full lg:sticky lg:top-32">
                    <div className="bg-dark-900 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-2xl">
                      <h3 className="text-xl font-display font-bold text-slate-50 mb-8 flex items-center gap-3">
                        <BarChart3 className="w-6 h-6 text-cyan-500" />
                        Ihre Wahl
                      </h3>
                      
                      <div className="space-y-6 mb-10 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {selectedOptionsList.length === 0 && additionalPages === 0 ? (
                          <p className="text-slate-500 text-center py-10 italic">Noch keine Optionen gewählt.</p>
                        ) : (
                          <>
                            {selectedOptionsList.map(opt => (
                              <div key={opt.id} className="flex justify-between items-start gap-4">
                                <div className="text-sm text-slate-400 font-medium">{opt.name}</div>
                                <div className="text-slate-50 font-mono text-sm whitespace-nowrap">{opt.price} €</div>
                              </div>
                            ))}
                            {additionalPages > 0 && (
                              <div className="flex justify-between items-start gap-4">
                                <div className="text-sm text-slate-400 font-medium">{additionalPages} zusätzliche Seiten</div>
                                <div className="text-slate-50 font-mono text-sm whitespace-nowrap">{additionalPages * 49} €</div>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      <div className="space-y-6 pt-8 border-t border-white/10">
                        <div className="flex justify-between items-end">
                          <div>
                            <span className="text-[10px] uppercase text-slate-500 tracking-widest font-bold block mb-1">Einmalig</span>
                            <div className="text-4xl font-display font-bold text-cyan-500">{totals.oneTime} €</div>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] uppercase text-slate-500 tracking-widest font-bold block mb-1">Monatlich</span>
                            <div className="text-2xl font-display font-bold text-slate-50">{totals.monthly} €</div>
                          </div>
                        </div>
                      </div>

                      <Button 
                        onClick={() => setStep('date')}
                        disabled={selectedOptionsList.length === 0}
                        className="w-full h-20 mt-10 bg-white text-dark-950 font-bold rounded-3xl text-xl shadow-[0_0_30px_rgba(255,255,255,0.1)] group hover:bg-cyan-500 transition-all disabled:opacity-50"
                      >
                        Termin wählen
                        <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* STEP: DATE */}
          {step === 'date' && (
            <motion.div 
              key="date"
              initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}
              className="max-w-md mx-auto px-2"
            >
              <Button variant="ghost" onClick={() => setStep('service')} className="mb-6 -ml-4 text-gray-400 hover:text-white uppercase tracking-widest text-[10px] md:text-xs font-mono">
                <ChevronLeft className="w-4 h-4 mr-2" /> Zurück
              </Button>
              <div className="bg-dark-900/50 backdrop-blur-md rounded-2xl p-4 md:p-8 border border-white/5 flex justify-center overflow-hidden">
                <style>{`
                  .rdp { --rdp-cell-size: 40px; --rdp-accent-color: var(--color-cyan-500); --rdp-background-color: var(--color-dark-800); margin: 0; }
                  @media (min-width: 768px) { .rdp { --rdp-cell-size: 46px; } }
                  .rdp-day_selected { font-weight: bold; color: var(--color-dark-950); }
                  .rdp-button:hover:not([disabled]):not(.rdp-day_selected) { background-color: var(--color-dark-800); }
                  .rdp-day { border-radius: 50%; font-family: var(--font-sans); }
                  .rdp-nav_button { color: white; }
                  .rdp-head_cell { color: #888; font-weight: normal; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; }
                  .rdp-caption_label { font-family: var(--font-serif); font-size: 1.1rem; }
                `}</style>
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  locale={de}
                  disabled={[
                    { before: new Date() },
                    ...blockedDates.map(b => parseISO(b.blocked_date)),
                    (date) => {
                      const day = businessHours.find(h => h.weekday === date.getDay());
                      return !day?.is_open;
                    }
                  ]}
                  className="text-white mx-auto"
                />
              </div>
            </motion.div>
          )}

          {/* STEP: TIME */}
          {step === 'time' && (
            <motion.div 
              key="time"
              initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}
              className="max-w-2xl mx-auto px-2"
            >
              <Button variant="ghost" onClick={() => setStep('date')} className="mb-6 -ml-4 text-gray-400 hover:text-white uppercase tracking-widest text-xs font-mono">
                <ChevronLeft className="w-4 h-4 mr-2" /> Zurück
              </Button>
              
              <div className="bg-dark-900/50 backdrop-blur-md rounded-2xl p-6 md:p-10 border border-white/5">
                <h3 className="font-serif text-xl md:text-2xl text-white mb-8">
                  {selectedDate && format(selectedDate, 'EEEE, d. MMMM', { locale: de })}
                </h3>
                
                {isTimesLoading ? (
                  <div className="flex justify-center py-20" aria-live="polite">
                    <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
                    <span className="sr-only">Lade verfügbare Zeiten...</span>
                  </div>
                ) : (selectedDate && (!businessHours.find(h => h.weekday === selectedDate.getDay())?.is_open)) ? (
                  <div className="text-center py-12 space-y-6">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto text-slate-500">
                      <X size={32} />
                    </div>
                    <div>
                      <p className="text-slate-200 font-medium text-lg">Wochenende / Geschlossen</p>
                      <p className="text-slate-500 text-sm mt-2">An diesem Tag bieten wir leider keine Termine an.</p>
                    </div>
                    <Button variant="outline" onClick={() => setStep('date')} className="border-white/10 text-slate-300">
                      Anderes Datum wählen
                    </Button>
                  </div>
                ) : availableTimes.length === 0 ? (
                  <div className="text-center py-12 space-y-6">
                    <p className="text-slate-400 font-light">{t('booking.no_slots')}</p>
                    <Button variant="outline" onClick={() => setStep('date')} className="border-white/10 text-slate-300">
                      Anderes Datum wählen
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                    {availableTimes.map(slot => {
                      const timeDisplay = format(parse(slot.time, 'HH:mm:ss', new Date()), 'HH:mm');
                      const isSelected = selectedTime === slot.time;
                      
                      if (slot.isBooked) {
                        return (
                          <div
                            key={slot.time}
                            className="py-4 px-3 rounded-xl font-mono text-center border bg-red-950/20 border-red-500/20 text-slate-500 cursor-not-allowed select-none opacity-60 flex flex-col items-center justify-center min-h-[70px]"
                          >
                            <span className="text-sm line-through decoration-red-500/50">{timeDisplay}</span>
                            <span className="text-[10px] font-sans text-red-400/80 font-bold uppercase tracking-wider mt-0.5">Belegt</span>
                          </div>
                        );
                      }

                      if (!slot.isAvailable) {
                        return (
                          <div
                            key={slot.time}
                            className="py-4 px-3 rounded-xl font-mono text-center border bg-white/[0.02] border-white/5 text-slate-600 cursor-not-allowed select-none opacity-40 flex flex-col items-center justify-center min-h-[70px]"
                          >
                            <span className="text-sm">{timeDisplay}</span>
                            <span className="text-[10px] font-sans text-slate-600 mt-0.5">Nicht verfügbar</span>
                          </div>
                        );
                      }

                      return (
                        <button
                          key={slot.time}
                          onClick={() => setSelectedTime(slot.time)}
                          aria-pressed={isSelected}
                          className={cn(
                            "py-4 px-3 rounded-xl font-mono transition-all duration-300 border active:scale-95 touch-manipulation flex flex-col items-center justify-center min-h-[70px]",
                            isSelected 
                              ? "bg-cyan-500 border-cyan-500 text-dark-950 font-bold shadow-[0_0_20px_rgba(6,182,212,0.2)]" 
                              : "bg-dark-950 border-white/5 hover:border-cyan-500/30 hover:bg-dark-900 text-slate-300"
                          )}
                        >
                          <span className="text-base">{timeDisplay}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end mt-12">
                <Button 
                  size="lg" 
                  disabled={!selectedTime} 
                  onClick={() => setStep('details')}
                  className="bg-cyan-500 hover:bg-cyan-400 text-dark-950 font-semibold uppercase tracking-widest text-xs px-10 h-14 rounded-full transition-transform active:scale-95 disabled:opacity-50"
                >
                  Weiter zur Kontaktinfo <ArrowRight className="ml-3 w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP: DETAILS */}
          {step === 'details' && (
            <motion.div 
              key="details"
              initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}
              className="space-y-6"
            >
              <Button variant="ghost" onClick={() => setStep('time')} className="mb-6 -ml-4 text-gray-400 hover:text-white uppercase tracking-widest text-xs font-mono">
                <ChevronLeft className="w-4 h-4 mr-2" /> Zurück
              </Button>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-2">
                  <div className="bg-dark-900/50 backdrop-blur-md rounded-2xl p-10 border border-white/5">
                    <h2 className="text-3xl font-display text-slate-50 mb-4">Fast geschafft.</h2>
                    <p className="text-slate-400 text-sm mb-10">Geben Sie uns noch ein paar Informationen, damit wir Ihr individuelles Angebot finalisieren können.</p>
                    
                    <form id="booking-form" onSubmit={handleSubmit(onSubmitDetails)} className="space-y-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div>
                          <label htmlFor="industry" className="block text-xs uppercase tracking-widest font-mono text-slate-400 mb-3">Branche</label>
                          <Input 
                            id="industry"
                            {...register('industry')}
                            placeholder="z.B. Gastronomie"
                            className="bg-dark-950 border-white/10 text-white focus-visible:ring-cyan-500/50 rounded-xl h-14"
                          />
                        </div>
                        <div>
                          <label htmlFor="company" className="block text-xs uppercase tracking-widest font-mono text-slate-400 mb-3">Unternehmen</label>
                          <Input 
                            id="company"
                            {...register('company')}
                            placeholder="Ihr Firmenname"
                            className="bg-dark-950 border-white/10 text-white focus-visible:ring-cyan-500/50 rounded-xl h-14"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div>
                          <label htmlFor="size" className="block text-xs uppercase tracking-widest font-mono text-slate-400 mb-3">Unternehmensgröße</label>
                          <Input 
                            id="size"
                            {...register('size')}
                            placeholder="z.B. 1-10 Mitarbeiter"
                            className="bg-dark-950 border-white/10 text-white focus-visible:ring-cyan-500/50 rounded-xl h-14"
                          />
                        </div>
                        <div>
                          <label htmlFor="startDate" className="block text-xs uppercase tracking-widest font-mono text-slate-400 mb-3">Gewünschter Start</label>
                          <Input 
                            id="startDate"
                            type="text"
                            {...register('startDate')}
                            placeholder="tt.mm.jjjj"
                            className="bg-dark-950 border-white/10 text-white focus-visible:ring-cyan-500/50 rounded-xl h-14"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="full_name" className="block text-xs uppercase tracking-widest font-mono text-slate-400 mb-3">Vollständiger Name</label>
                        <Input 
                          id="full_name"
                          {...register('full_name', { required: 'Name ist erforderlich' })}
                          placeholder="Ihr Name"
                          error={errors.full_name?.message}
                          className="bg-dark-950 border-white/10 text-white focus-visible:ring-cyan-500/50 rounded-xl h-14"
                          aria-invalid={errors.full_name ? "true" : "false"}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div>
                          <label htmlFor="email" className="block text-xs uppercase tracking-widest font-mono text-slate-400 mb-3">E-Mail Adresse</label>
                          <Input 
                            id="email"
                            type="email"
                            {...register('email', { 
                              required: 'E-Mail ist erforderlich',
                              pattern: { value: /^\S+@\S+$/i, message: 'Ungültige E-Mail' }
                            })}
                            placeholder="jane@example.com"
                            error={errors.email?.message}
                            className="bg-dark-950 border-white/10 text-white focus-visible:ring-cyan-500/50 rounded-xl h-14"
                            aria-invalid={errors.email ? "true" : "false"}
                          />
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-xs uppercase tracking-widest font-mono text-slate-400 mb-3">Telefonnummer (optional)</label>
                          <Input 
                            id="phone"
                            type="tel"
                            {...register('phone')}
                            placeholder="+49"
                            className="bg-dark-950 border-white/10 text-white focus-visible:ring-cyan-500/50 rounded-xl h-14"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="notes" className="block text-xs uppercase tracking-widest font-mono text-gray-400 mb-3">Ihre Nachricht oder spezielle Wünsche...</label>
                        <Textarea 
                          id="notes"
                          {...register('notes')}
                          placeholder="Erzählen Sie uns von Ihrem Projekt..."
                          className="bg-dark-950 border-white/10 text-white focus-visible:ring-cyan-500/50 rounded-xl min-h-[120px]"
                        />
                      </div>

                      {/* File Uploader */}
                      <div>
                        <label className="block text-xs uppercase tracking-widest font-mono text-gray-400 mb-3">
                          Vorhandene Unterlagen (PDF)
                        </label>
                        <div 
                          onClick={() => fileInputRef.current?.click()}
                          onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-cyan-500'); }}
                          onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('border-cyan-500'); }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.remove('border-cyan-500');
                            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                              setUploadedFile(e.dataTransfer.files[0]);
                            }
                          }}
                          className={cn(
                            "relative border-2 border-dashed border-white/10 rounded-2xl p-8 transition-all duration-300 cursor-pointer group flex flex-col items-center justify-center text-center",
                            uploadedFile ? "border-cyan-500/50 bg-cyan-500/5" : "hover:border-white/20 hover:bg-white/[0.02]"
                          )}
                        >
                          <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            className="hidden" 
                            accept=".pdf"
                          />
                          
                          {uploadedFile ? (
                            <div className="flex flex-col items-center space-y-4">
                              <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                                <FileText size={32} />
                              </div>
                              <div className="space-y-1">
                                <p className="text-white font-medium">{uploadedFile.name}</p>
                                <p className="text-slate-500 text-xs">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                              </div>
                              <button 
                                type="button"
                                onClick={(e) => { e.stopPropagation(); removeFile(); }}
                                className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-400 text-[10px] uppercase tracking-widest hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-all flex items-center gap-2"
                              >
                                <X size={14} /> Entfernen
                              </button>
                            </div>
                          ) : (
                            <>
                              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-slate-500 mb-6 group-hover:scale-110 group-hover:text-cyan-500 transition-all">
                                <Upload size={32} />
                              </div>
                              <p className="text-slate-300 mb-2">Keine ausgewählt</p>
                              <p className="text-slate-500 text-[10px] uppercase tracking-widest">Klicken oder PDF hierher ziehen</p>
                            </>
                          )}
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                
                <div className="md:col-span-1">
                  <div className="bg-dark-900/80 backdrop-blur-md rounded-2xl p-8 border border-white/5 sticky top-32">
                    <h2 className="text-xl font-serif text-white mb-8">Zusammenfassung</h2>
                    
                    <div className="space-y-8">
                      <div>
                        <div className="text-xs uppercase tracking-widest font-mono text-gray-500 mb-2">Gewählte Kategorien</div>
                        <div className="space-y-3">
                          {Object.entries(selections).map(([categoryId, items]) => {
                            const category = mergedConfigData.find(c => c.id === categoryId);
                            if (!category || items.length === 0) return null;
                            return (
                              <div key={categoryId} className="space-y-1">
                                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">{getTranslatedText(category.name, currentLang)}</div>
                                {items.map(itemId => {
                                  const item = category.options.find(i => i.id === itemId);
                                  return (
                                    <div key={itemId} className="text-xs text-white font-light pl-2 border-l border-cyan-500/30 flex items-center gap-2">
                                      <div className="w-1 h-1 rounded-full bg-cyan-500/50" />
                                      {item ? getTranslatedText(item.name, currentLang) : itemId}
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })}
                          {Object.keys(selections).length === 0 && (
                            <div className="text-xs text-slate-500 italic">Keine Kategorien ausgewählt</div>
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs uppercase tracking-widest font-mono text-gray-500 mb-2">Zusatzoptionen</div>
                        <div className="space-y-2">
                          {selectedOptionsList.length > 0 ? (
                            selectedOptionsList.map(o => (
                              <div key={o.id} className="text-[10px] text-cyan-400 font-bold flex items-center gap-2">
                                <Check className="w-3 h-3" />
                                {getTranslatedText(o.name, currentLang)}
                              </div>
                            ))
                          ) : (
                            <div className="text-xs text-slate-500 italic">Keine Extras gewählt</div>
                          )}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/5">
                        <div className="text-xs uppercase tracking-widest font-mono text-gray-500 mb-2">Termin</div>
                        <div className="font-sans font-light text-sm text-white">
                          {selectedDate && format(selectedDate, 'd. MMMM yyyy', { locale: de })}<br/>
                          {selectedTime && format(parse(selectedTime, 'HH:mm:ss', new Date()), 'HH:mm')} Uhr
                        </div>
                      </div>

                      <div className="pt-8 border-t border-white/10">
                        <div className="flex justify-between items-end">
                          <span className="text-xs uppercase tracking-widest font-mono text-gray-500">Investition</span>
                          <span className="text-3xl font-serif text-cyan-400">Kostenlos</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    form="booking-form" 
                    size="lg" 
                    className="w-full mt-8 bg-cyan-500 hover:bg-cyan-400 text-dark-950 font-bold uppercase tracking-widest text-xs h-16 rounded-full transition-transform active:scale-95 shadow-[0_0_30px_rgba(6,182,212,0.1)] hover:shadow-[0_0_50px_rgba(6,182,212,0.2)]"
                    isLoading={isSubmitting}
                  >
                    Beratungsgespräch anfragen
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP: SUCCESS */}
          {step === 'success' && (
            <motion.div 
              key="success"
              initial={{ scale: 0.95, opacity: 0, filter: 'blur(10px)' }}
              animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
              transition={{ type: "spring" as const, bounce: 0.4 }}
              className="bg-dark-900/50 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden"
            >
              <div className="py-32 px-8 text-center flex flex-col items-center">
                <div className="w-32 h-32 bg-dark-950 border border-white/5 rounded-full flex items-center justify-center mb-12 shadow-[0_0_50px_rgba(6,182,212,0.1)]">
                  <CheckCircle2 className="w-16 h-16 text-cyan-500" />
                </div>
                <h2 className="text-5xl md:text-6xl font-display text-slate-50 mb-6">Erfolgreich gebucht!</h2>
                <p className="text-slate-400 max-w-lg mx-auto mb-16 text-xl font-light leading-relaxed">
                  Ihre Anfrage wurde übermittelt. Wir haben Ihnen eine Bestätigungsmail mit allen Details und dem <strong>Zoom-Link</strong> für das Gespräch gesendet.
                </p>
                <Button onClick={() => navigate('/')} className="bg-cyan-500 text-dark-950 hover:bg-cyan-400 px-12 h-16 rounded-full font-semibold uppercase tracking-widest text-xs transition-transform active:scale-95">
                  Zurück zur Startseite
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
