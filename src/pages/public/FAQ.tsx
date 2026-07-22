import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, Search, Sparkles, MessageSquare, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQS = [
  {
    category: "Allgemein",
    items: [
      {
        q: "Was unterscheidet Zetta Digital von anderen Agenturen?",
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
    <div className="bg-dark-950 min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-24 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-500/10 border border-neon-500/20 text-neon-500 text-[10px] uppercase tracking-widest font-bold"
          >
            <Sparkles className="w-3 h-3" />
            Support & Details
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white tracking-tight">
            Häufige <span className="text-neon-500">Fragen</span>.
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            Alles, was Sie über unsere Prozesse, Preise und Technologien wissen müssen.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mt-12">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Suchen Sie nach einem Thema..."
              className="w-full h-14 bg-dark-900 border border-white/5 rounded-2xl pl-12 pr-6 text-white focus:outline-none focus:border-neon-500/50 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-16">
          {FAQS.map((category, catIdx) => (
            <div key={catIdx} className="space-y-6">
              <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-gray-500 pl-4 border-l-2 border-neon-500/30">
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
                      className={`glass-card rounded-3xl border border-white/5 overflow-hidden transition-all duration-300 ${
                        isOpen ? 'bg-white/5 border-white/10' : 'hover:border-white/10'
                      }`}
                    >
                      <button 
                        onClick={() => toggleItem(id)}
                        className="w-full p-6 md:p-8 flex items-center justify-between text-left gap-6"
                      >
                        <span className="text-lg md:text-xl font-bold text-white leading-tight">
                          {item.q}
                        </span>
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180 bg-neon-500 border-neon-500' : ''}`}>
                          {isOpen ? <Minus size={16} className="text-dark-950" /> : <Plus size={16} className="text-gray-400" />}
                        </div>
                      </button>
                      
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <div className="px-6 md:px-8 pb-8 text-gray-400 leading-relaxed text-lg border-t border-white/5 pt-6">
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
        <div className="mt-32 p-10 md:p-16 rounded-[3rem] bg-neon-500 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="text-dark-950 space-y-4">
            <h3 className="text-3xl font-display font-bold">Noch Fragen offen?</h3>
            <p className="font-medium opacity-80">Wir beraten Sie gerne persönlich und unverbindlich zu Ihrem Projekt.</p>
          </div>
          <Link to="/booking">
            <button className="h-16 px-10 rounded-2xl bg-dark-950 text-white font-bold hover:scale-105 transition-all flex items-center gap-3 shadow-2xl">
              <MessageSquare size={20} />
              Jetzt anfragen
              <ArrowRight size={18} />
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
