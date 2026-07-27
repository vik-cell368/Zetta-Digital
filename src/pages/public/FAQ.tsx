import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, Search, Sparkles, MessageSquare, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQS = [
  {
    category: "Allgemein",
    items: [
      {
        q: "Was unterscheidet Viktor Labs von anderen Agenturen?",
        a: "Wir verkaufen keine 'Webseiten' – wir verkaufen digitale Wertschöpfungsketten. Als Viktor Labs entwickeln wir High-End-Websites mit immersiven 3D-Animationen und kompromissloser Performance, die Marken online dominieren lassen."
      },
      {
        q: "Wie lange dauert ein typisches Projekt?",
        a: "Eine Standard-Business-Website benötigt in der Regel 2–4 Wochen. Komplexere Projekte mit umfangreichen 3D-Modellen können 6–8 Wochen in Anspruch nehmen."
      },
      {
        q: "Kann ich die Inhalte später selbst ändern?",
        a: "Ja. Wir integrieren auf Wunsch ein einfach zu bedienendes CMS, mit dem Sie Texte und Bilder ohne Programmierkenntnisse anpassen können. Alternativ übernehmen wir das im Rahmen unserer Verwaltungs-Pakete."
      }
    ]
  },
  {
    category: "Preise & Kosten",
    items: [
      {
        q: "Wie setzen sich die Preise zusammen?",
        a: "Wir arbeiten mit transparenten Fixpreisen für die Erstellung (ab 550 € für Schwarz-Weiß) und optionalen monatlichen Gebühren für die Verwaltung (ab 59,99 €). Alle Details finden Sie in unserem Preiskalkulator."
      },
      {
        q: "Gibt es versteckte Kosten?",
        a: "Nein. Unser Angebot ist ein Fixpreis-Angebot. Kosten für Drittanbieter (z.B. Domain, Hosting) werden transparent kommuniziert."
      },
      {
        q: "Sind die monatlichen Kosten verpflichtend?",
        a: "Nein. Die Verwaltung ist optional. Sie können Ihre Website auch selbst pflegen, wir beraten Sie gerne dazu."
      }
    ]
  },
  {
    category: "Design & Animation",
    items: [
      {
        q: "Was ist der Unterschied zwischen 2D und 3D Animation?",
        a: "2D Animationen sind flache Grafiken, die sich bewegen (z.B. Icons oder Illustrationen). 3D Animationen sind räumliche Modelle, die Tiefe und eine moderne Ästhetik in Ihre Website bringen."
      },
      {
        q: "Können Sie auch personalisierte Objekte erstellen?",
        a: "Ja, wir modellieren individuelle 3D-Objekte passend zu Ihrer Branche oder Ihrem Produkt ab 299 €."
      },
      {
        q: "Wie funktioniert der Upload von PDF-Briefings?",
        a: "Über unser Formular können Sie Konzept-PDFs oder Briefings direkt per Drag-and-Drop datenschutzkonform hochladen. Dies ermöglicht uns eine präzise Vorbereitung auf unser Erstgespräch."
      },
      {
        q: "Machen Animationen die Website langsam?",
        a: "Nein. Wir nutzen modernste Technologien wie WebGL und Lottie, um flüssige Animationen bei minimaler Ladezeit zu garantieren. Sie fesseln den Blick und erhöhen die Verweildauer signifikant."
      }
    ]
  }
];

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-dark-950 min-h-screen pt-40 pb-20">
      <div className="container mx-auto px-6 max-w-4xl relative">
        
        {/* Header */}
        <div className="text-center mb-32 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/[0.03] border border-white/10 text-cyan-500 text-[10px] uppercase tracking-[0.3em] font-black backdrop-blur-md"
          >
            Support & Details
          </motion.div>
          <h1 className="text-5xl md:text-8xl font-display font-medium text-white tracking-tight leading-[0.9]">
            HÄUFIGE <br /> <span className="text-cyan-500">FRAGEN</span>.
          </h1>
          <p className="text-slate-400 text-xl md:text-2xl font-light max-w-2xl mx-auto leading-relaxed">
            Alles, was Sie über unsere Prozesse, Preise und Technologien wissen müssen. Transparent und ehrlich.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-lg mx-auto mt-16">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Wonach suchen Sie?"
              className="w-full h-20 bg-dark-900/40 backdrop-blur-xl border border-white/5 rounded-full pl-16 pr-8 text-white text-lg focus:outline-none focus:border-cyan-500/50 transition-all font-light"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-24">
          {FAQS.map((category, catIdx) => (
            <div key={catIdx} className="space-y-8">
              <h2 className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-500 pl-6 border-l-2 border-cyan-500/30">
                {category.category}
              </h2>
              <div className="space-y-4">
                {category.items.map((item, itemIdx) => {
                  const id = `${catIdx}-${itemIdx}`;
                  const isOpen = openItems.includes(id);
                  
                  if (searchTerm && !item.q.toLowerCase().includes(searchTerm.toLowerCase()) && !item.a.toLowerCase().includes(searchTerm.toLowerCase())) {
                    return null;
                  }

                  return (
                    <div 
                      key={id}
                      className={`rounded-[2.5rem] border transition-all duration-700 ${
                        isOpen ? 'bg-white/[0.04] border-white/10' : 'bg-transparent border-white/5 hover:border-white/10'
                      }`}
                    >
                      <button 
                        onClick={() => toggleItem(id)}
                        className="w-full p-8 md:p-12 flex items-center justify-between text-left gap-8"
                      >
                        <span className="text-xl md:text-2xl font-display font-medium text-white tracking-tight leading-snug">
                          {item.q}
                        </span>
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transition-all duration-500 ${isOpen ? 'rotate-180 bg-cyan-600 border-cyan-600' : 'group-hover:border-white/20'}`}>
                          {isOpen ? <Minus size={18} className="text-white" /> : <Plus size={18} className="text-slate-500" />}
                        </div>
                      </button>
                      
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                          >
                            <div className="px-8 md:px-12 pb-12 text-slate-400 leading-relaxed text-lg md:text-xl font-light border-t border-white/5 pt-8">
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

        {/* Contact Support CTA */}
        <div className="mt-48 p-12 md:p-24 rounded-[5rem] bg-cyan-600 flex flex-col lg:flex-row items-center justify-between gap-12 group overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.2),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="text-dark-950 space-y-6 relative z-10 text-center lg:text-left">
            <h3 className="text-4xl md:text-6xl font-display font-medium tracking-tighter leading-[0.9]">NOCH FRAGEN <br /> OFFEN?</h3>
            <p className="text-xl md:text-2xl font-medium opacity-80 max-w-xl">Wir beraten Sie gerne persönlich und unverbindlich zu Ihrem Projekt.</p>
          </div>
          <Link to="/booking" className="relative z-10 w-full lg:w-auto">
            <button className="w-full lg:w-auto h-24 px-16 rounded-full bg-dark-950 text-white font-black uppercase tracking-[0.3em] text-xs hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 shadow-2xl group/btn">
              <MessageSquare size={24} />
              Jetzt anfragen
              <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
