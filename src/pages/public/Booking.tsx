import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Service } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Calendar as CalendarIcon, Clock, ArrowRight, ChevronRight, ChevronLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { format, parse, isAfter, startOfDay, addDays, isSameDay } from 'date-fns';
import { getDateLocale } from '@/lib/utils';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { cn, formatCurrency, getTranslatedText } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import Hero3D from '@/components/Hero3D';

type Step = 'service' | 'date' | 'time' | 'details' | 'success';

interface BookingFormData {
  full_name: string;
  email: string;
  phone: string;
  notes: string;
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

export default function Booking() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language.split('-')[0] || 'en';
  const [step, setStep] = useState<Step>('service');
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<BookingFormData>();

  useEffect(() => {
    async function fetchServices() {
      try {
        const { data } = await supabase
          .from('services')
          .select('*')
          .eq('is_active', true)
          .order('price', { ascending: false });
        
        if (data && data.length > 0) {
          setServices(data);
        } else {
          // Fallback to local storage or defaults
          const localData = localStorage.getItem('zetta_services');
          if (localData) {
            setServices(JSON.parse(localData).filter((s: any) => s.is_active));
          } else {
            setServices([
              {
                id: '1',
                name: JSON.stringify({ en: 'Website Development', de: 'Webentwicklung' }),
                description: JSON.stringify({ en: 'Modern tech stacks, lightning fast performance.', de: 'Moderne Tech-Stacks, blitzschnelle Performance.' }),
                price: 1500,
                duration_minutes: 60,
                is_active: true
              },
              {
                id: '2',
                name: JSON.stringify({ en: 'Online Shops', de: 'Online-Shops' }),
                description: JSON.stringify({ en: 'Optimized for conversion and growth.', de: 'Optimiert für Konversion und Wachstum.' }),
                price: 2500,
                duration_minutes: 90,
                is_active: true
              }
            ] as Service[]);
          }
        }
      } catch (e) {
        console.warn("Booking services fetch failed", e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchServices();
  }, []);

  const [isTimesLoading, setIsTimesLoading] = useState(false);
  
  const handleDateSelect = async (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(null);
    if (!date || !selectedService) return;
    
    // Immediate transition to time step to show loading/progress
    setStep('time');
    setAvailableTimes([]); // Reset times while loading
    setIsTimesLoading(true);
    
    try {
      const { data: appointments } = await supabase
        .from('appointments')
        .select('start_time, end_time')
        .eq('status', 'confirmed')
        .gte('start_time', startOfDay(date).toISOString())
        .lt('start_time', addDays(startOfDay(date), 1).toISOString());

      const times = [];
      const startHour = 9;
      const endHour = 17;
      
      for (let h = startHour; h < endHour; h++) {
        for (let m = 0; m < 60; m += 30) {
          const timeString = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00`;
          const slotStart = parse(`${format(date, 'yyyy-MM-dd')} ${timeString}`, 'yyyy-MM-dd HH:mm:ss', new Date());
          
          let isAvailable = true;
          // Don't allow past times if today
          if (isSameDay(date, new Date()) && !isAfter(slotStart, new Date())) {
            isAvailable = false;
          }

          if (isAvailable) {
            const serviceDuration = selectedService.duration_minutes;
            const slotEnd = new Date(slotStart.getTime() + serviceDuration * 60000);

            if (appointments && appointments.length > 0) {
              for (const appt of appointments) {
                const apptStart = new Date(appt.start_time);
                const apptEnd = new Date(appt.end_time);
                if (
                  (slotStart >= apptStart && slotStart < apptEnd) ||
                  (slotEnd > apptStart && slotEnd <= apptEnd) ||
                  (slotStart <= apptStart && slotEnd >= apptEnd)
                ) {
                  isAvailable = false;
                  break;
                }
              }
            }
          }

          if (isAvailable) {
            times.push(timeString);
          }
        }
      }
      setAvailableTimes(times);
    } catch (e) {
      console.warn("Error fetching available times", e);
      // Fallback: Show all times if Supabase fails
      const fallbackTimes = [];
      for (let h = 9; h < 17; h++) {
        fallbackTimes.push(`${h.toString().padStart(2, '0')}:00:00`);
        fallbackTimes.push(`${h.toString().padStart(2, '0')}:30:00`);
      }
      setAvailableTimes(fallbackTimes);
    } finally {
      setIsTimesLoading(false);
    }
  };

  const onSubmitDetails = async (data: BookingFormData) => {
    if (!selectedService || !selectedDate || !selectedTime) return;

    setIsSubmitting(true);
    const startDateTime = parse(
      `${format(selectedDate, 'yyyy-MM-dd')} ${selectedTime}`,
      'yyyy-MM-dd HH:mm:ss',
      new Date()
    );
    const endDateTime = new Date(startDateTime.getTime() + selectedService.duration_minutes * 60000);

    const payload = {
      service_id: selectedService.id,
      client_name: data.full_name,
      client_email: data.email,
      client_phone: data.phone,
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString(),
      status: 'pending',
      notes: data.notes
    };

    try {
      const { error } = await supabase.from('appointments').insert(payload);
      if (error) throw error;
      setStep('success');
    } catch (err) {
      console.warn("Supabase booking failed, saving to localStorage", err);
      const localApps = localStorage.getItem('zetta_appointments');
      const apps = localApps ? JSON.parse(localApps) : [];
      apps.push({ ...payload, id: crypto.randomUUID(), created_at: new Date().toISOString() });
      localStorage.setItem('zetta_appointments', JSON.stringify(apps));
      setStep('success');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-dark-950 py-12 md:py-24 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(197,160,89,0.05)_0%,transparent_50%)] pointer-events-none" />
      
      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-neon-500 block mb-4">Consultation</span>
          <h1 className="text-4xl md:text-6xl font-serif font-medium text-white tracking-tight mb-4">{t('booking.title')}</h1>
          <p className="text-gray-400 font-light max-w-lg mx-auto">Schedule an executive discussion to outline your technological trajectory.</p>
        </div>

        {/* Progress Indication */}
        {step !== 'success' && (
          <div className="flex justify-center mb-16">
            <div className="flex items-center gap-2 md:gap-4 font-mono text-xs uppercase tracking-widest overflow-x-auto pb-4 scrollbar-hide w-full max-w-2xl">
              {['service', 'date', 'time', 'details'].map((s, i, arr) => (
                <div key={s} className="flex items-center whitespace-nowrap">
                  <span className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center border transition-colors",
                    step === s ? "bg-neon-500 border-neon-500 text-dark-950 font-bold" : 
                    arr.indexOf(step) > i ? "bg-white/10 border-transparent text-white" : "border-white/20 text-gray-500"
                  )}>
                    {i + 1}
                  </span>
                  <span className={cn(
                    "ml-3 tracking-[0.2em] transition-colors hidden md:block",
                    step === s ? "text-neon-500" : 
                    arr.indexOf(step) > i ? "text-white" : "text-gray-500"
                  )}>
                    {t(`booking.step_${s}`)}
                  </span>
                  {i < arr.length - 1 && (
                    <div className="w-8 md:w-16 h-px bg-white/10 mx-2 md:mx-4" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP: SERVICE */}
          {step === 'service' && (
            <motion.div 
              key="service"
              initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}
              className="space-y-6"
            >
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map(i => <div key={i} className="animate-pulse bg-white/5 h-40 rounded-2xl"></div>)}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {services.map(service => (
                    <div 
                      key={service.id}
                      onClick={() => { setSelectedService(service); setStep('date'); }}
                      className={cn(
                        "group p-8 rounded-2xl cursor-pointer transition-all duration-500 border backdrop-blur-xl relative overflow-hidden",
                        selectedService?.id === service.id 
                          ? "bg-dark-900 border-neon-500/50 shadow-[0_0_30px_rgba(197,160,89,0.1)]" 
                          : "bg-dark-900/40 border-white/5 hover:border-neon-500/30 hover:bg-dark-900/80"
                      )}
                    >
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-serif text-2xl text-white group-hover:text-neon-400 transition-colors">{getTranslatedText(service.name, currentLang)}</h3>
                          <span className="font-sans font-light text-white">{formatCurrency(service.price)}</span>
                        </div>
                        <p className="text-sm text-gray-400 mb-8 font-light leading-relaxed line-clamp-2">{getTranslatedText(service.description, currentLang)}</p>
                        <div className="flex items-center text-xs font-mono uppercase tracking-widest text-gray-500">
                          <Clock className="w-4 h-4 mr-2" />
                          {service.duration_minutes} min
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* STEP: DATE */}
          {step === 'date' && (
            <motion.div 
              key="date"
              initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}
              className="max-w-md mx-auto"
            >
              <Button variant="ghost" onClick={() => setStep('service')} className="mb-6 -ml-4 text-gray-400 hover:text-white uppercase tracking-widest text-xs font-mono">
                <ChevronLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <div className="bg-dark-900/50 backdrop-blur-xl rounded-2xl p-8 border border-white/5 flex justify-center">
                <style>{`
                  .rdp { --rdp-cell-size: 46px; --rdp-accent-color: var(--color-neon-500); --rdp-background-color: var(--color-dark-800); margin: 0; }
                  .rdp-day_selected { font-weight: bold; color: var(--color-dark-950); }
                  .rdp-button:hover:not([disabled]):not(.rdp-day_selected) { background-color: var(--color-dark-800); }
                  .rdp-day { border-radius: 50%; font-family: var(--font-sans); }
                  .rdp-nav_button { color: white; }
                  .rdp-head_cell { color: #888; font-weight: normal; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; }
                  .rdp-caption_label { font-family: var(--font-serif); font-size: 1.25rem; }
                `}</style>
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={[{ before: new Date() }, { dayOfWeek: [0, 6] }]}
                  className="text-white"
                />
              </div>
            </motion.div>
          )}

          {/* STEP: TIME */}
          {step === 'time' && (
            <motion.div 
              key="time"
              initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}
              className="max-w-2xl mx-auto"
            >
              <Button variant="ghost" onClick={() => setStep('date')} className="mb-6 -ml-4 text-gray-400 hover:text-white uppercase tracking-widest text-xs font-mono">
                <ChevronLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              
              <div className="bg-dark-900/50 backdrop-blur-xl rounded-2xl p-8 border border-white/5">
                <h3 className="font-serif text-2xl text-white mb-8">
                  {selectedDate && format(selectedDate, 'EEEE, d. MMMM', { locale: getDateLocale(i18n.language) })}
                </h3>
                
                {isTimesLoading ? (
                  <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 text-neon-500 animate-spin" />
                  </div>
                ) : availableTimes.length === 0 ? (
                  <p className="text-gray-400 font-light">{t('booking.no_slots')}</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {availableTimes.map(time => {
                      const timeDisplay = format(parse(time, 'HH:mm:ss', new Date()), 'HH:mm');
                      const isSelected = selectedTime === time;
                      return (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={cn(
                            "py-4 rounded-xl font-mono text-sm transition-all duration-300 border",
                            isSelected 
                              ? "bg-neon-500 border-neon-500 text-dark-950 font-bold shadow-[0_0_20px_rgba(197,160,89,0.2)]" 
                              : "bg-dark-950 border-white/5 hover:border-neon-500/30 hover:bg-dark-900 text-gray-300"
                          )}
                        >
                          {timeDisplay}
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
                  className="bg-neon-500 hover:bg-neon-400 text-dark-950 font-semibold uppercase tracking-widest text-xs px-10 h-14 rounded-full transition-transform active:scale-95 disabled:opacity-50"
                >
                  {t('booking.btn_continue')} <ArrowRight className="ml-3 w-4 h-4" />
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
                <ChevronLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-2">
                  <div className="bg-dark-900/50 backdrop-blur-xl rounded-2xl p-10 border border-white/5">
                    <h2 className="text-3xl font-serif text-white mb-10">{t('booking.your_details')}</h2>
                    
                    <form id="booking-form" onSubmit={handleSubmit(onSubmitDetails)} className="space-y-8">
                      <div>
                        <label className="block text-xs uppercase tracking-widest font-mono text-gray-400 mb-3">{t('booking.form_name')}</label>
                        <Input 
                          {...register('full_name', { required: 'Name is required' })}
                          placeholder="Jane Doe"
                          error={errors.full_name?.message}
                          className="bg-dark-950 border-white/10 text-white focus-visible:ring-neon-500/50 rounded-xl h-14"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div>
                          <label className="block text-xs uppercase tracking-widest font-mono text-gray-400 mb-3">{t('booking.form_email')}</label>
                          <Input 
                            type="email"
                            {...register('email', { 
                              required: 'Email is required',
                              pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                            })}
                            placeholder="jane@example.com"
                            error={errors.email?.message}
                            className="bg-dark-950 border-white/10 text-white focus-visible:ring-neon-500/50 rounded-xl h-14"
                          />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-widest font-mono text-gray-400 mb-3">{t('booking.form_phone')}</label>
                          <Input 
                            type="tel"
                            {...register('phone', { required: 'Phone is required' })}
                            placeholder="+1 (555) 000-0000"
                            error={errors.phone?.message}
                            className="bg-dark-950 border-white/10 text-white focus-visible:ring-neon-500/50 rounded-xl h-14"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest font-mono text-gray-400 mb-3">{t('booking.form_notes')}</label>
                        <Textarea 
                          {...register('notes')}
                          placeholder={t('booking.form_notes_ph')}
                          className="bg-dark-950 border-white/10 text-white focus-visible:ring-neon-500/50 rounded-xl min-h-[120px]"
                        />
                      </div>
                    </form>
                  </div>
                </div>
                
                <div className="md:col-span-1">
                  <div className="bg-dark-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/5 sticky top-32">
                    <h2 className="text-xl font-serif text-white mb-8">{t('booking.summary')}</h2>
                    
                    <div className="space-y-8">
                      <div>
                        <div className="text-xs uppercase tracking-widest font-mono text-gray-500 mb-2">{t('booking.step_service')}</div>
                        <div className="font-sans font-light text-white">{selectedService && getTranslatedText(selectedService.name, currentLang)}</div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-widest font-mono text-gray-500 mb-2">{t('booking.step_date_time')}</div>
                        <div className="font-sans font-light text-white">
                          {selectedDate && format(selectedDate, 'd. MMMM yyyy', { locale: getDateLocale(i18n.language) })}<br/>
                          {selectedTime && format(parse(selectedTime, 'HH:mm:ss', new Date()), 'HH:mm')}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-widest font-mono text-gray-500 mb-2">{t('booking.sum_duration')}</div>
                        <div className="font-sans font-light text-white">{selectedService?.duration_minutes} {t('booking.min')}</div>
                      </div>
                      <div className="pt-8 border-t border-white/10">
                        <div className="flex justify-between items-end">
                          <span className="text-xs uppercase tracking-widest font-mono text-gray-500">{t('booking.sum_total')}</span>
                          <span className="text-3xl font-serif text-neon-400">{selectedService && formatCurrency(selectedService.price)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    form="booking-form" 
                    size="lg" 
                    className="w-full mt-8 bg-neon-500 hover:bg-neon-400 text-dark-950 font-semibold uppercase tracking-widest text-xs h-16 rounded-full transition-transform active:scale-95 shadow-[0_0_30px_rgba(197,160,89,0.1)] hover:shadow-[0_0_50px_rgba(197,160,89,0.2)]"
                    isLoading={isSubmitting}
                  >
                    {t('booking.confirm_btn')}
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
              className="bg-dark-900/50 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden"
            >
              <div className="py-32 px-8 text-center flex flex-col items-center">
                <div className="w-32 h-32 bg-dark-950 border border-white/5 rounded-full flex items-center justify-center mb-12 shadow-[0_0_50px_rgba(197,160,89,0.1)]">
                  <CheckCircle2 className="w-16 h-16 text-neon-500" />
                </div>
                <h2 className="text-5xl md:text-6xl font-serif text-white mb-6">{t('booking.success_title')}</h2>
                <p className="text-gray-400 max-w-lg mx-auto mb-16 text-xl font-light leading-relaxed">
                  {t('booking.success_desc')}
                </p>
                <Button onClick={() => window.location.href = '/'} className="bg-neon-500 text-dark-950 hover:bg-neon-400 px-12 h-16 rounded-full font-semibold uppercase tracking-widest text-xs transition-transform active:scale-95">
                  {t('booking.return_home')}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
