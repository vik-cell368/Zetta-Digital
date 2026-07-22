import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, ArrowRight, Sparkles, Globe, Layout, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';

const PROJECTS = [
  {
    title: "E-Commerce Revolution",
    category: "Webdesign & Conversion",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    desc: "Komplette Neugestaltung und Optimierung eines Onlineshops mit Fokus auf User Experience.",
    tags: ["Next.js", "Tailwind", "Shopify"],
    stat: "+145% Umsatz"
  },
  {
    title: "AI Logistics Suite",
    category: "KI Automation",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
    desc: "KI-gestützte Routenplanung und automatische Lagerverwaltung für ein Logistikunternehmen.",
    tags: ["OpenAI", "Python", "Dashboard"],
    stat: "60h Zeitersparnis/Wo."
  },
  {
    title: "Real Estate Premium",
    category: "Webdesign",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
    desc: "Exklusive Plattform für Luxusimmobilien mit interaktiven 3D-Rundgängen.",
    tags: ["Framer Motion", "React", "3D"],
    stat: "3x mehr Anfragen"
  },
  {
    title: "MedTech Assistant",
    category: "KI Chatbot",
    image: "https://images.unsplash.com/photo-1576091160550-2173bdb999ef?auto=format&fit=crop&q=80&w=800",
    desc: "Patienten-Onboarding und Terminbuchung via intelligentem KI-Assistenten.",
    tags: ["Chatbot", "NLP", "Security"],
    stat: "90% Automation"
  }
];

export default function Portfolio() {
  return (
    <div className="bg-dark-950 min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header */}
        <div className="mb-24 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-500/10 border border-neon-500/20 text-neon-500 text-[10px] uppercase tracking-widest font-bold"
          >
            <Sparkles className="w-3 h-3" />
            Selected Works
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-bold text-white tracking-tight"
          >
            Digitale <span className="text-neon-500">Erfolgsgeschichten</span>.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-xl max-w-2xl leading-relaxed"
          >
            Wir bauen keine Webseiten, wir bauen digitale Wertschöpfungsketten. Entdecken Sie eine Auswahl unserer neuesten Projekte.
          </motion.p>
        </div>

        {/* Filter / Categories Placeholder */}
        <div className="flex flex-wrap gap-4 mb-16">
          {['Alle', 'Webdesign', 'KI Automation', 'Chatbots'].map((cat, i) => (
            <button 
              key={cat}
              className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest border transition-all ${
                i === 0 ? 'bg-white text-dark-950 border-white' : 'bg-transparent text-gray-500 border-white/10 hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {PROJECTS.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-[2.5rem] bg-dark-900 border border-white/5 mb-8">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover:opacity-60"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-10">
                  <div className="flex items-center gap-4 text-white font-bold uppercase tracking-widest text-xs">
                    View Case Study <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
                
                {/* Floating Stat */}
                <div className="absolute top-6 right-6 glass-card p-4 rounded-2xl border-white/10 shadow-2xl">
                   <div className="text-neon-500 font-display font-bold text-lg">{project.stat}</div>
                </div>
              </div>
              
              <div className="space-y-4 px-4">
                <div className="flex items-center gap-3 text-neon-500 text-[10px] uppercase tracking-widest font-bold">
                   {project.category}
                </div>
                <h3 className="text-3xl font-display font-bold text-white group-hover:text-neon-500 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-400 leading-relaxed max-w-lg">
                  {project.desc}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-white/5 rounded-full text-[10px] text-gray-500 font-mono uppercase tracking-widest border border-white/5">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-40 bg-dark-900 rounded-[4rem] p-12 md:p-24 border border-white/5 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(197,160,89,0.1),transparent_50%)]" />
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white leading-tight">Wann starten wir Ihr <span className="text-neon-500">Projekt?</span></h2>
            <p className="text-gray-400 text-lg">Haben Sie eine Vision? Wir haben die Technologie und die Strategie, um sie zur Realität zu machen.</p>
            <div className="flex flex-wrap justify-center gap-6 pt-4">
              <Link to="/booking">
                <button className="h-16 px-10 rounded-2xl bg-neon-500 text-dark-950 font-bold hover:scale-105 transition-all flex items-center gap-3">
                  Projekt anfragen
                  <ArrowRight size={20} />
                </button>
              </Link>
              <Link to="/pricing">
                <button className="h-16 px-10 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all">
                  Preise kalkulieren
                </button>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
