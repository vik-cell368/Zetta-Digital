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
  Sparkles,
  Layout,
  Palette,
  Box,
  Layers,
  Volume2,
  Settings,
  ShieldCheck,
  Calendar,
  Share2,
  MessageSquare,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

import { CALCULATOR_OPTIONS as OPTIONS } from '@/lib/constants';
import type { ServiceOption as Option } from '@/lib/constants';

export default function PriceConfigurator() {
  const [selected, setSelected] = useState<string[]>(['base_std']);
  const [totalSetup, setTotalSetup] = useState(550);
  const [totalMonthly, setTotalMonthly] = useState(0);

  useEffect(() => {
    let setup = 0;
    let monthly = 0;
    
    selected.forEach(id => {
      const opt = OPTIONS.find(o => o.id === id);
      if (opt) {
        setup += opt.price;
        if (opt.monthlyPrice) monthly += opt.monthlyPrice;
      }
    });
    
    setTotalSetup(setup);
    setTotalMonthly(monthly);
  }, [selected]);

  const toggleOption = (id: string) => {
    setSelected(prev => {
      const opt = OPTIONS.find(o => o.id === id);
      // Exclude logic for mutually exclusive categories (Management)
      if (opt?.category === 'Verwaltung') {
        const otherMgmtIds = OPTIONS.filter(o => o.category === 'Verwaltung' && o.id !== id).map(o => o.id);
        const filtered = prev.filter(i => !otherMgmtIds.includes(i));
        return filtered.includes(id) ? filtered.filter(i => i !== id) : [...filtered, id];
      }
      
      return prev.includes(id) 
        ? prev.filter(i => i !== id) 
        : [...prev, id];
    });
  };

  const categories: Option['category'][] = ['Basis', 'Design', 'Dienstleistung', 'Verwaltung'];

  return (
    <div className="w-full max-w-7xl mx-auto py-32 px-6">
      <div className="text-center mb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/[0.03] border border-white/10 text-cyan-500 text-[10px] uppercase tracking-[0.3em] font-black mb-8 backdrop-blur-md"
        >
          Live Preisrechner
        </motion.div>
        <h2 className="text-5xl md:text-8xl font-display font-medium text-white mb-8 tracking-tight leading-tight">
          KONFIGURIEREN SIE <br /> <span className="text-slate-600">IHR</span> <br /> <span className="text-white">PROJEKT.</span>
        </h2>
        <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto font-light leading-relaxed">
          Wählen Sie Ihre gewünschten Leistungen aus und erhalten Sie sofort eine transparente Übersicht Ihrer Investition.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Options List */}
        <div className="lg:col-span-8 space-y-16">
          {categories.map((cat) => (
            <div key={cat} className="space-y-6">
              <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-500 mb-8 border-b border-white/5 pb-4">
                {cat}
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {OPTIONS.filter(o => o.category === cat).map((opt, i) => {
                  const isSelected = selected.includes(opt.id);
                  return (
                    <motion.div
                      key={opt.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => toggleOption(opt.id)}
                      className={`group cursor-pointer relative overflow-hidden rounded-[2rem] border p-6 transition-all duration-500 ${
                        isSelected 
                          ? 'bg-cyan-600/10 border-cyan-500/50' 
                          : 'bg-dark-900/20 border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-6 relative z-10">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 shrink-0 ${
                          isSelected ? 'bg-cyan-600 text-white shadow-xl' : 'bg-white/5 text-slate-600'
                        }`}>
                          <opt.icon size={20} />
                        </div>
                        
                        <div className="flex-grow">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-lg font-display font-medium text-white">{opt.title}</h4>
                            <div className="text-white font-black text-sm">
                              {opt.price > 0 && `€${opt.price}`}
                              {opt.price > 0 && opt.monthlyPrice && ' + '}
                              {opt.monthlyPrice && `€${opt.monthlyPrice}/mtl.`}
                            </div>
                          </div>
                          <p className={`text-sm font-light transition-colors ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                            {opt.simpleDesc}
                          </p>
                        </div>

                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 shrink-0 ${
                          isSelected ? 'bg-cyan-500 border-cyan-500 text-dark-950' : 'border-white/10 text-transparent'
                        }`}>
                          <Check size={12} strokeWidth={4} />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-4 lg:sticky lg:top-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="bg-dark-900/40 backdrop-blur-3xl rounded-[3rem] border border-white/10 p-10 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-600/10 blur-[80px] -translate-y-1/2 translate-x-1/2" />

            <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-500 mb-10">
              Konfiguration
            </h4>

            <div className="space-y-6 mb-12">
              {selected.length > 0 ? selected.map(id => {
                const opt = OPTIONS.find(o => o.id === id);
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={id} 
                    className="flex items-center justify-between group"
                  >
                    <span className="text-slate-400 text-sm font-light group-hover:text-white transition-colors">{opt?.title}</span>
                    <span className="text-white text-sm font-black">
                      {opt?.price && opt.price > 0 ? `€${opt.price}` : `€${opt?.monthlyPrice}/mtl.`}
                    </span>
                  </motion.div>
                );
              }) : (
                <div className="text-slate-600 text-sm italic py-4">Wählen Sie Ihre Bausteine...</div>
              )}
            </div>

            <div className="pt-10 border-t border-white/10 space-y-8">
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <span className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">Einmalige Kosten</span>
                  <span className="text-4xl font-display font-medium text-white tracking-tight">€{totalSetup.toFixed(2)}</span>
                </div>
                
                {totalMonthly > 0 && (
                  <div className="flex flex-col gap-1">
                    <span className="text-cyan-500 font-black uppercase tracking-[0.3em] text-[10px]">Monatlich</span>
                    <span className="text-2xl font-display font-medium text-cyan-400 tracking-tight">€{totalMonthly.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <button 
                onClick={() => window.location.href = '/booking'}
                className="w-full h-16 bg-white text-dark-950 hover:bg-cyan-500 hover:scale-[1.02] active:scale-95 transition-all rounded-full font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl flex items-center justify-center gap-4 group"
              >
                Projekt anfragen
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <p className="text-[9px] text-center text-slate-600 uppercase tracking-[0.3em] font-black">
                Alle Preise verstehen sich als Richtwerte
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
