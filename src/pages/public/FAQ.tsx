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
        a: "Wir verkaufen keine 'Webseiten' – wir verkaufen digitale Wertschöpfungsketten. Unsere Projekte sind von Grund auf auf Conversion, Geschwindigkeit und moderne Technologie (Next.js) optimiert. Zudem integrieren wir KI direkt in Ihre Workflows, um echte Zeit- und Kostenersparnis zu schaffen."
      },
      {
        q: "Wie lange dauert ein typisches Projekt?",
        a: "Eine Standard-Business-Website benötigt in der Regel 2–4 Wochen. Komplexere Projekte mit KI-Automation oder umfangreichen Backends können 6–8 Wochen in Anspruch nehmen."
      },
      {
        q: "Werden meine Daten für das KI-Training verwendet?",
        a: "Nein. Wir nutzen professionelle Schnittstellen (Enterprise APIs), bei denen Ihre Daten nicht zum Training öffentlicher Modelle verwendet werden. Ihre Geschäftsgeheimnisse bleiben sicher."
      }
    ]
  },
  {
    category: "Preise & Kosten",
    items: [
      {
        q: "Wie setzen sich die Preise zusammen?",
        a: "Wir arbeiten mit transparenten Fixpreisen für die Erstellung und optionalen monatlichen Gebühren für Wartung, Hosting und KI-Services. Alle Preise können Sie live in unserem Konfigurator kalkulieren."
      },
      {
        q: "Gibt es versteckte Kosten?",
        a: "Nein. Unser Angebot ist ein Fixpreis-Angebot. Kosten für Drittanbieter (z.B. Domain, spezielle API-Credits) werden transparent kommuniziert."
      },
      {
        q: "Bieten Sie Ratenzahlung an?",
        a: "Ja, für größere Projekte bieten wir individuelle Zahlungspläne an. Sprechen Sie uns einfach im Erstgespräch darauf an."
      }
    ]
  },
  {
    category: "Technik & SEO",
    items: [
      {
        q: "Nutzen Sie WordPress?",
        a: "In der Regel nicht. Wir setzen auf moderne Headless-Architekturen (React/Next.js). Das macht Ihre Seite schneller, sicherer und besser für Google optimiert als herkömmliche Systeme."
      },
      {
        q: "Ist die Website für Google optimiert?",
        a: "Ja, jede Seite wird nach aktuellen SEO-Standards (Core Web Vitals, semantisches HTML, Meta-Daten) entwickelt. Für maximale Sichtbarkeit bieten wir zudem unsere Premium-SEO-Pakete an."
      },
      {
        q: "Kann ich die Inhalte später selbst ändern?",
        a: "Ja. Wir integrieren auf Wunsch ein einfach zu bedienendes CMS (Content Management System), mit dem Sie Texte und Bilder ohne Programmierkenntnisse anpassen können."
      }
    ]
  },
  {
    category: "KI-Automation",
    items: [
      {
        q: "Welche Prozesse lassen sich automatisieren?",
        a: "Fast alles, was repetitiv ist: E-Mail-Beantwortung, Lead-Qualifizierung, Datenübertragung zwischen Tools, Social Media Postings oder die Erstellung von Berichten."
      },
      {
        q: "Brauche ich technisches Vorwissen für den Chatbot?",
        a: "Überhaupt nicht. Wir richten alles schlüsselfertig für Sie ein. Die Pflege der Daten ist so einfach wie das Ausfüllen eines Formulars."
      },
      {
        q: "Was passiert, wenn die KI einen Fehler macht?",
        a: "Unsere Systeme sind so eingestellt, dass sie im Zweifelsfall an einen menschlichen Mitarbeiter übergeben. Wir implementieren Sicherheitsmechanismen (Guardrails), um die Qualität der Antworten zu sichern."
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
