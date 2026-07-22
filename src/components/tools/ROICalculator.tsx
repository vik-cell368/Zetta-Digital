import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';

export default function ROICalculator() {
  const [employees, setEmployees] = useState(10);
  const [hourlyRate, setHourlyRate] = useState(50);
  const [manualHours, setManualHours] = useState(5);

  const weeklySavings = employees * manualHours * hourlyRate * 0.8; // 80% efficiency
  const yearlySavings = weeklySavings * 52;

  return (
    <div className="glass-card p-10 rounded-[3rem] border-white/10 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <Calculator size={120} />
      </div>
      
      <div className="relative z-10 space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neon-500/10 flex items-center justify-center text-neon-500">
            <TrendingUp size={20} />
          </div>
          <h3 className="text-2xl font-display font-bold text-white">ROI Rechner</h3>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs uppercase tracking-widest font-bold text-gray-500">
              <span>Anzahl Mitarbeiter</span>
              <span className="text-white">{employees}</span>
            </div>
            <input 
              type="range" min="1" max="100" value={employees}
              onChange={(e) => setEmployees(parseInt(e.target.value))}
              className="w-full accent-neon-500 bg-white/5 h-1 rounded-full appearance-none"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs uppercase tracking-widest font-bold text-gray-500">
              <span>Stundensatz (€)</span>
              <span className="text-white">{hourlyRate}€</span>
            </div>
            <input 
              type="range" min="20" max="200" value={hourlyRate}
              onChange={(e) => setHourlyRate(parseInt(e.target.value))}
              className="w-full accent-neon-500 bg-white/5 h-1 rounded-full appearance-none"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs uppercase tracking-widest font-bold text-gray-500">
              <span>Manuelle Std./Woche pro Mitarbeiter</span>
              <span className="text-white">{manualHours}h</span>
            </div>
            <input 
              type="range" min="1" max="40" value={manualHours}
              onChange={(e) => setManualHours(parseInt(e.target.value))}
              className="w-full accent-neon-500 bg-white/5 h-1 rounded-full appearance-none"
            />
          </div>
        </div>

        <div className="pt-8 border-t border-white/5">
          <div className="text-center space-y-2">
            <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Mögliche Ersparnis / Jahr</span>
            <motion.div 
              key={yearlySavings}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-5xl font-display font-bold text-neon-500"
            >
              {yearlySavings.toLocaleString('de-DE')} €
            </motion.div>
          </div>
        </div>

        <button className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl text-xs uppercase tracking-[0.2em] font-bold text-white hover:bg-white/10 transition-all flex items-center justify-center gap-3">
          Detailanalyse anfordern
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
