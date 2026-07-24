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
    <div className="bg-dark-950 min-h-screen pt-40 pb-20">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header */}
        <div className="mb-32 space-y-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/[0.03] border border-white/10 text-cyan-500 text-[10px] uppercase tracking-[0.3em] font-black backdrop-blur-md"
          >
            Selected Works
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-display font-medium text-white tracking-tight leading-[0.9]"
          >
            DIGITALE <br /> <span className="text-slate-600">ERFOLGS-</span> <br /> <span className="text-white">GESCHICHTEN.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-xl md:text-2xl font-light leading-relaxed max-w-3xl"
          >
            Wir bauen keine Webseiten, wir bauen digitale Wertschöpfungsketten. Entdecken Sie eine Auswahl unserer neuesten Projekte, bei denen Effizienz auf Ästhetik trifft.
          </motion.p>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-4 mb-24">
          {['Alle', 'Webdesign', 'KI Automation', 'Chatbots'].map((cat, i) => (
            <button 
              key={cat}
              className={`px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border transition-all duration-500 ${
                i === 0 ? 'bg-white text-dark-950 border-white shadow-xl' : 'bg-transparent text-slate-500 border-white/10 hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {PROJECTS.map((project, i) => {
            const Icon = project.title.includes('AI') || project.title.includes('MedTech') ? Bot : project.title.includes('Commerce') ? Globe : Layout;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-[4rem] bg-dark-900/40 border border-white/[0.03] mb-10 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-1000" />
                  
                  {/* Abstract Schematic Icon */}
                  <div className="relative z-10 w-32 h-32 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-center justify-center text-slate-700 group-hover:text-cyan-500 group-hover:scale-110 group-hover:bg-cyan-500/5 transition-all duration-700">
                    <Icon size={64} strokeWidth={1} />
                  </div>
                  
                  <div className="absolute inset-0 flex items-end p-12 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="flex items-center gap-4 text-white font-black uppercase tracking-[0.3em] text-[10px]">
                      Case Study ansehen <ArrowRight className="w-4 h-4 translate-x-0 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                  
                  {/* Floating Stat */}
                  <div className="absolute top-8 right-8 bg-dark-950/80 backdrop-blur-xl px-8 py-4 rounded-[2rem] border border-white/10 shadow-2xl">
                     <div className="text-cyan-500 font-display font-medium text-2xl tracking-tighter">{project.stat}</div>
                  </div>
                </div>
                
                <div className="space-y-6 px-4">
                  <div className="flex items-center gap-4 text-cyan-500 text-[10px] font-black uppercase tracking-[0.4em]">
                     {project.category}
                  </div>
                  <h3 className="text-4xl font-display font-medium text-white group-hover:text-cyan-500 transition-colors tracking-tight">
                    {project.title}
                  </h3>
                  <p className="text-slate-400 text-lg md:text-xl font-light leading-relaxed max-w-xl">
                    {project.desc}
                  </p>
                  <div className="flex flex-wrap gap-3 pt-4">
                    {project.tags.map(tag => (
                      <span key={tag} className="px-6 py-2 bg-white/[0.03] rounded-full text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] border border-white/5 group-hover:border-white/10 transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Contact CTA */}
        <div className="mt-48 bg-white/[0.02] rounded-[5rem] p-16 md:p-32 border border-white/5 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(197,160,89,0.05),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="relative z-10 max-w-4xl mx-auto space-y-12">
            <h2 className="text-5xl md:text-8xl font-display font-medium text-white leading-[0.9] tracking-tighter">WANN STARTEN <br /> <span className="text-slate-600">WIR IHR</span> <br /> <span className="text-white">PROJEKT?</span></h2>
            <p className="text-slate-400 text-xl md:text-2xl font-light max-w-2xl mx-auto leading-relaxed">Haben Sie eine Vision? Wir haben die Technologie und die Strategie, um sie zur Realität zu machen.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-8 pt-6">
              <Link to="/booking">
                <button className="w-full sm:w-auto h-20 px-12 rounded-full bg-cyan-600 text-white font-black uppercase tracking-[0.2em] text-xs hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-4 group">
                  Projekt anfragen
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link to="/pricing">
                <button className="w-full sm:w-auto h-20 px-12 rounded-full bg-white/[0.03] border border-white/10 text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-white/[0.08] transition-all flex items-center justify-center">
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
