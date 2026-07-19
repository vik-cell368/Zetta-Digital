import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, Search } from 'lucide-react';

import { useTranslation } from 'react-i18next';

export default function FAQ() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndices, setActiveIndices] = useState<string[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('zetta_faq');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Group by category for the UI
      const grouped = parsed.reduce((acc: any[], item: any) => {
        const cat = item.category || 'Allgemein';
        let group = acc.find(g => g.category === cat);
        if (!group) {
          group = { category: cat, items: [] };
          acc.push(group);
        }
        group.items.push({ q: item.question, a: item.answer });
        return acc;
      }, []);
      setFaqs(grouped);
    } else {
      setFaqs(t('faq.questions', { returnObjects: true }) as any[] || []);
    }
  }, [t]);

  const toggleAccordion = (id: string) => {
    setActiveIndices(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredFaqs = Array.isArray(faqs) ? faqs.map(group => ({
    ...group,
    items: Array.isArray(group.items) ? group.items.filter((q: any) => 
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    ) : []
  })).filter(group => group.items.length > 0) : [];

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl md:text-8xl font-serif text-white mb-8 tracking-tight italic">
            {t('faq.title')}
          </h1>
          <p className="text-xl text-gray-400 font-light leading-relaxed">
            {t('faq.subtitle')}
          </p>
        </motion.div>

        <div className="relative mb-20">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input 
            type="text"
            placeholder="Nach Antworten suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-dark-900 border border-white/5 rounded-2xl py-6 pl-16 pr-6 text-white placeholder:text-gray-600 focus:outline-none focus:border-neon-500/50 transition-colors"
          />
        </div>

        <div className="space-y-16">
          {filteredFaqs.map((group) => (
            <div key={group.category}>
              <h3 className="text-xs font-mono text-neon-500 uppercase tracking-[0.3em] mb-8 border-b border-white/5 pb-4">
                {group.category}
              </h3>
              <div className="space-y-4">
                {group.items.map((item: any, qIndex: number) => {
                  const id = `${group.category}-${qIndex}`;
                  const isOpen = activeIndices.includes(id);

                  return (
                    <div 
                      key={id}
                      className={`border border-white/5 rounded-2xl transition-all duration-300 ${isOpen ? 'bg-white/5 border-white/10' : 'bg-transparent hover:bg-white/[0.02]'}`}
                    >
                      <button
                        onClick={() => toggleAccordion(id)}
                        className="w-full text-left p-6 flex items-center justify-between group"
                      >
                        <span className={`text-lg font-medium transition-colors ${isOpen ? 'text-neon-400' : 'text-white'}`}>
                          {item.q}
                        </span>
                        <div className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180 border-neon-500' : ''}`}>
                          {isOpen ? <Minus className="w-4 h-4 text-neon-500" /> : <Plus className="w-4 h-4 text-gray-400 group-hover:text-white" />}
                        </div>
                      </button>
                      
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="p-6 pt-0 text-gray-400 font-light leading-relaxed border-t border-white/5 mt-0 mx-6">
                              {item.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {filteredFaqs.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <p>Keine Fragen gefunden, die Ihrer Suche entsprechen.</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-4 text-neon-500 hover:underline"
            >
              Suche zurücksetzen
            </button>
          </div>
        )}

        <div className="mt-32 p-12 bg-neon-500 rounded-3xl text-dark-950 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-8 md:mb-0 text-center md:text-left">
            <h3 className="text-3xl font-serif font-bold italic mb-2">
              {t('faq.cta_title')}
            </h3>
            <p className="font-medium text-dark-950/70">{t('faq.cta_subtitle')}</p>
          </div>
          <a href="/booking" className="px-10 py-5 bg-dark-950 text-white rounded-full font-bold hover:scale-105 transition-transform shadow-xl shadow-dark-950/20">
            {t('faq.cta_btn')}
          </a>
        </div>
      </div>
    </div>
  );
}
