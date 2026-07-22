import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  Bot, 
  Zap, 
  Check, 
  ArrowRight, 
  Info,
  Clock,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Option {
  id: string;
  title: string;
  simpleDesc: string;
  technicalDesc: string;
  price: number;
  icon: any;
  benefit: string;
}

const OPTIONS: Option[] = [
  {
    id: 'web',
    title: 'Digitale Visitenkarte',
    simpleDesc: 'Eine moderne Website, auf der Kunden Sie finden und kontaktieren können.',
    technicalDesc: 'Premium Webdesign & SEO Optimierung',
    price: 2500,
    icon: Globe,
    benefit: 'Werden Sie bei Google gefunden'
  },
  {
    id: 'chatbot',
    title: 'Der 24/7 Mitarbeiter',
    simpleDesc: 'Ein intelligenter Chat-Assistent, der Kundenfragen beantwortet, während Sie schlafen.',
    technicalDesc: 'KI-gesteuerter Kundensupport Bot',
    price: 1500,
    icon: Bot,
    benefit: 'Keine Kundenanfrage mehr verpassen'
  },
  {
    id: 'automation',
    title: 'Die Zeitmaschine',
    simpleDesc: 'Automatisieren Sie lästige Aufgaben wie Rechnungen oder Termine und sparen Sie Stunden pro Woche.',
    technicalDesc: 'Workflow & Prozess Automation',
    price: 1200,
    icon: Zap,
    benefit: 'Sparen Sie bis zu 10h pro Woche'
  }
];

export default function PriceConfigurator() {
  const [selected, setSelected] = useState<string[]>(['web']);
  const [total, setTotal] = useState(2500);

  useEffect(() => {
    const newTotal = selected.reduce((acc, id) => {
      const opt = OPTIONS.find(o => o.id === id);
      return acc + (opt?.price || 0);
    }, 0);
    setTotal(newTotal);
  }, [selected]);

  const toggleOption = (id: string) => {
    setSelected(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id) 
        : [...prev, id]
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-20 px-6">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon-500/10 border border-neon-500/20 text-neon-500 text-[10px] uppercase tracking-widest font-bold mb-6"
        >
          <Sparkles size={12} />
          Einfach Konfigurieren
        </motion.div>
        <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
          Wählen Sie Ihre <span className="italic text-neon-500">Wachstums-Bausteine</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Kein Fachchinesisch. Wählen Sie einfach aus, was Ihr Unternehmen braucht. 
          Wir kümmern uns um die Technik.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Options List */}
        <div className="lg:col-span-2 space-y-6">
          {OPTIONS.map((opt, i) => {
            const isSelected = selected.includes(opt.id);
            return (
              <motion.div
                key={opt.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => toggleOption(opt.id)}
                className={`group cursor-pointer relative overflow-hidden rounded-[2.5rem] border-2 p-8 transition-all duration-500 ${
                  isSelected 
                    ? 'bg-neon-500/10 border-neon-500 shadow-[0_0_50px_rgba(197,160,89,0.1)]' 
                    : 'bg-dark-900/40 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-start gap-6 relative z-10">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                    isSelected ? 'bg-neon-500 text-dark-950 scale-110' : 'bg-white/5 text-gray-500'
                  }`}>
                    <opt.icon size={32} />
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl font-bold text-white">{opt.title}</h3>
                      <div className="text-neon-500 font-bold text-xl">Ab €{opt.price}</div>
                    </div>
                    <p className={`text-lg leading-relaxed mb-4 transition-colors ${isSelected ? 'text-gray-200' : 'text-gray-500'}`}>
                      {opt.simpleDesc}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neon-500/80">
                        <TrendingUp size={14} />
                        {opt.benefit}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-600">
                        <Info size={14} />
                        {opt.technicalDesc}
                      </div>
                    </div>
                  </div>

                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected ? 'bg-neon-500 border-neon-500 text-dark-950' : 'border-white/10 text-transparent'
                  }`}>
                    <Check size={16} strokeWidth={3} />
                  </div>
                </div>

                {/* Animated Background Line */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      layoutId="active-bg"
                      className="absolute inset-0 bg-gradient-to-r from-neon-500/5 via-transparent to-transparent pointer-events-none"
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Summary Card */}
        <div className="lg:sticky lg:top-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-[3rem] border border-white/10 p-10 shadow-2xl relative overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-neon-500/10 blur-[60px] -translate-y-1/2 translate-x-1/2" />

            <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-500 mb-8">
              Zusammenfassung
            </h4>

            <div className="space-y-6 mb-10">
              {selected.length > 0 ? selected.map(id => {
                const opt = OPTIONS.find(o => o.id === id);
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={id} 
                    className="flex items-center justify-between"
                  >
                    <span className="text-gray-300 text-sm font-medium">{opt?.title}</span>
                    <span className="text-white text-sm font-bold">€{opt?.price}</span>
                  </motion.div>
                );
              }) : (
                <div className="text-gray-600 text-sm italic py-4">Wählen Sie mindestens einen Baustein...</div>
              )}
            </div>

            <div className="pt-8 border-t border-white/10">
              <div className="flex items-center justify-between mb-8">
                <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Gesamt-Investment</span>
                <span className="text-4xl font-display font-bold text-white">€{total}</span>
              </div>

              <div className="bg-neon-500/10 rounded-2xl p-4 mb-8 flex items-center gap-4 border border-neon-500/20">
                <Clock className="text-neon-500" size={20} />
                <div className="text-xs text-neon-500/80 leading-relaxed">
                  Geschätzte Zeitersparnis:<br />
                  <strong className="text-neon-500 font-bold text-sm">~{selected.length * 4}h pro Woche</strong>
                </div>
              </div>

              <Button 
                onClick={() => window.location.href = '/booking'}
                className="w-full h-16 bg-white text-dark-950 hover:bg-neon-500 transition-all rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl flex items-center justify-center gap-2"
              >
                Anfrage senden
                <ArrowRight size={16} />
              </Button>
              
              <p className="mt-6 text-[10px] text-center text-gray-600 uppercase tracking-widest font-bold">
                Inkl. Design, Technik & Support
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
