import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CALCULATOR_OPTIONS, ServiceOption } from '@/lib/constants';
import { X, Search, Check, Calculator, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatCurrency } from '@/lib/utils';

interface CalculatorPickerProps {
  onSelect: (option: ServiceOption) => void;
  onClose: () => void;
}

export default function CalculatorPicker({ onSelect, onClose }: CalculatorPickerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = ['all', 'Basis', 'Design', 'Verwaltung', 'Dienstleistung'];

  const filteredOptions = CALCULATOR_OPTIONS.filter(opt => {
    const matchesSearch = opt.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         opt.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || opt.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-dark-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Calculator size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Leistungskatalog</h3>
              <p className="text-xs text-slate-500">Wählen Sie Leistungen aus dem Kalkulator</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-hidden flex flex-col">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <Input 
                placeholder="Leistung suchen..." 
                className="pl-10 h-11"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest font-bold whitespace-nowrap transition-all border ${
                    activeCategory === cat 
                      ? 'bg-cyan-500 border-cyan-500 text-dark-950' 
                      : 'bg-white/5 border-white/5 text-slate-500 hover:text-white hover:border-white/10'
                  }`}
                >
                  {cat === 'all' ? 'Alle' : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const Icon = opt.icon;
                return (
                  <div 
                    key={opt.id}
                    className="p-4 rounded-2xl bg-dark-950 border border-white/5 hover:border-cyan-500/30 transition-all group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 transition-colors">
                        <Icon size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{opt.title}</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                          {opt.category} • {formatCurrency(opt.price)}
                          {opt.monthlyPrice ? ` + ${formatCurrency(opt.monthlyPrice)}/mtl.` : ''}
                        </div>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => onSelect(opt)}
                      className="bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500 hover:text-dark-950 px-4"
                    >
                      <Plus size={14} className="mr-1" /> Hinzufügen
                    </Button>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-slate-500">
                Keine Leistungen gefunden.
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-white/5 bg-white/5 text-[10px] text-slate-600 font-bold uppercase tracking-widest text-center">
          Klicken Sie auf "Hinzufügen", um die Leistung in die Rechnung zu übernehmen.
        </div>
      </motion.div>
    </div>
  );
}
