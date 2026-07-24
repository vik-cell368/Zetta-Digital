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
    <div className="w-full max-w-7xl mx-auto py-32 px-6">
      <div className="text-center mb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/[0.03] border border-white/10 text-cyan-500 text-[10px] uppercase tracking-[0.3em] font-black mb-8 backdrop-blur-md"
        >
          Transparenz & Planung
        </motion.div>
        <h2 className="text-5xl md:text-8xl font-display font-medium text-white mb-8 tracking-tight leading-tight">
          INVESTITION IN <br /> <span className="text-slate-600">IHRE DIGITALE</span> <br /> <span className="text-white">PRÄSENZ.</span>
        </h2>
        <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto font-light leading-relaxed">
          Stellen Sie sich Ihre Lösung modular zusammen. Ehrlich, transparent und ohne versteckte Kosten. 
          Wir beraten Sie auf Augenhöhe, was für Ihre Ziele wirklich sinnvoll ist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Options List */}
        <div className="lg:col-span-8 space-y-6">
          {OPTIONS.map((opt, i) => {
            const isSelected = selected.includes(opt.id);
            return (
              <motion.div
                key={opt.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => toggleOption(opt.id)}
                className={`group cursor-pointer relative overflow-hidden rounded-[3rem] border-2 p-8 md:p-12 transition-all duration-700 ${
                  isSelected 
                    ? 'bg-cyan-600/10 border-cyan-500/50 shadow-[0_20px_60px_rgba(74,109,124,0.1)]' 
                    : 'bg-dark-900/20 border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12 relative z-10">
                  <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] flex items-center justify-center transition-all duration-700 shrink-0 ${
                    isSelected ? 'bg-cyan-600 text-white shadow-xl' : 'bg-white/5 text-slate-500'
                  }`}>
                    <opt.icon size={isSelected ? 32 : 28} />
                  </div>
                  
                  <div className="flex-grow w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                      <h3 className="text-2xl md:text-3xl font-display font-medium text-white tracking-tight">{opt.title}</h3>
                      <div className="text-cyan-500 font-black text-xl md:text-2xl tracking-tight">Ab €{opt.price}</div>
                    </div>
                    <p className={`text-lg md:text-xl leading-relaxed mb-8 font-light transition-colors ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {opt.simpleDesc}
                    </p>
                    <div className="flex flex-wrap gap-6">
                      <div className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-500/80">
                        <TrendingUp size={14} />
                        {opt.benefit}
                      </div>
                      <div className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                        <Info size={14} />
                        {opt.technicalDesc}
                      </div>
                    </div>
                  </div>

                  <div className={`absolute top-6 right-6 md:relative md:top-0 md:right-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 shrink-0 ${
                    isSelected ? 'bg-cyan-500 border-cyan-500 text-dark-950' : 'border-white/10 text-transparent'
                  }`}>
                    <Check size={16} strokeWidth={4} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-4 lg:sticky lg:top-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="bg-dark-900/40 backdrop-blur-3xl rounded-[4rem] border border-white/10 p-10 md:p-14 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-600/10 blur-[80px] -translate-y-1/2 translate-x-1/2" />

            <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-500 mb-10">
              Konfiguration
            </h4>

            <div className="space-y-8 mb-12">
              {selected.length > 0 ? selected.map(id => {
                const opt = OPTIONS.find(o => o.id === id);
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={id} 
                    className="flex items-center justify-between group"
                  >
                    <span className="text-slate-300 text-base font-light group-hover:text-white transition-colors">{opt?.title}</span>
                    <span className="text-white text-base font-black tracking-tight">€{opt?.price}</span>
                  </motion.div>
                );
              }) : (
                <div className="text-slate-600 text-sm italic py-4">Wählen Sie Ihre Bausteine...</div>
              )}
            </div>

            <div className="pt-10 border-t border-white/10">
              <div className="flex flex-col gap-2 mb-10">
                <span className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">Gesamtinvestition</span>
                <span className="text-5xl md:text-6xl font-display font-medium text-white tracking-tighter">€{total}</span>
              </div>

              <div className="bg-white/[0.03] rounded-[2rem] p-6 mb-10 flex items-start gap-5 border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 shrink-0">
                  <Clock size={20} />
                </div>
                <div className="text-xs text-slate-400 leading-relaxed font-light">
                  Ihr geschätzter Zeitgewinn:<br />
                  <strong className="text-white font-black text-base tracking-tight">~{selected.length * 4}h / Woche</strong>
                </div>
              </div>

              <button 
                onClick={() => window.location.href = '/booking'}
                className="w-full h-20 bg-white text-dark-950 hover:bg-cyan-500 hover:scale-[1.02] active:scale-95 transition-all rounded-full font-black uppercase tracking-[0.3em] text-xs shadow-2xl flex items-center justify-center gap-4 group"
              >
                Projekt anfragen
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <p className="mt-10 text-[10px] text-center text-slate-600 uppercase tracking-[0.3em] font-black">
                Persönliche Beratung inklusive
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
