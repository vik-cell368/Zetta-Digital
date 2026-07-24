import React from 'react';
import { motion } from 'motion/react';
import { Search, PenTool, Code2, Rocket, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const STEPS = [
  {
    title: "Discovery & Strategie",
    desc: "Wir hören zu. Bevor wir eine einzige Zeile Code schreiben, verstehen wir Ihr Business, Ihre Ziele und Ihre Nutzer. Kein Raten, sondern Daten.",
    icon: Search,
    color: "cyan"
  },
  {
    title: "Konzeption & Design",
    desc: "Hier trifft Handwerk auf Ästhetik. Wir entwickeln ein Designsystem, das Ihre Marke menschlich und hochwertig repräsentiert. Keine Standard-Templates.",
    icon: PenTool,
    color: "blue"
  },
  {
    title: "Präzisions-Entwicklung",
    desc: "Mit modernsten Tech-Stacks (React, Next.js) bauen wir Lösungen, die nicht nur gut aussehen, sondern auch blitzschnell und sicher sind.",
    icon: Code2,
    color: "slate"
  },
  {
    title: "Launch & Evolution",
    desc: "Der Launch ist erst der Anfang. Wir optimieren kontinuierlich und integrieren KI-Workflows, um Ihr Wachstum nachhaltig zu sichern.",
    icon: Rocket,
    color: "cyan"
  }
];

export default function Process() {
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
            Our Methodology
          </motion.div>
          <h1 className="text-5xl md:text-8xl font-display font-medium text-white tracking-tight leading-[0.9]">
            VON DER IDEE <br /> <span className="text-slate-600">ZUR EXZEL-</span> <br /> <span className="text-white">LENZ.</span>
          </h1>
          <p className="text-slate-400 text-xl md:text-2xl font-light leading-relaxed max-w-3xl">
            Unser Prozess ist geprägt von Transparenz, Präzision und dem Fokus auf echtem Mehrwert. Wir arbeiten nicht für Sie, sondern mit Ihnen.
          </p>
        </div>

        {/* Process Steps */}
        <div className="space-y-12 mb-48">
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group flex flex-col md:flex-row gap-8 md:gap-24 p-12 md:p-20 rounded-[4rem] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-700 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              
              <div className="relative z-10 flex flex-col justify-center">
                 <span className="text-8xl md:text-9xl font-display font-black text-white/5 group-hover:text-cyan-500/10 transition-colors absolute -left-4 top-0 md:static">
                   0{i + 1}
                 </span>
              </div>

              <div className="relative z-10 flex-1 space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-cyan-500 group-hover:bg-cyan-600 group-hover:text-white transition-all duration-500">
                  <step.icon size={24} />
                </div>
                <h3 className="text-4xl md:text-5xl font-display font-medium text-white group-hover:text-cyan-500 transition-colors tracking-tight">
                  {step.title}
                </h3>
                <p className="text-slate-400 text-xl md:text-2xl font-light leading-relaxed max-w-2xl">
                  {step.desc}
                </p>
              </div>

              <div className="relative z-10 hidden lg:flex items-center">
                 <div className="w-32 h-32 rounded-full border border-white/5 flex items-center justify-center group-hover:border-cyan-500/30 transition-colors">
                    <ArrowRight size={40} className="text-slate-700 group-hover:text-cyan-500 group-hover:translate-x-2 transition-all" />
                 </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Philosophy Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-48">
           <div className="space-y-12">
              <div className="text-cyan-500 font-black uppercase tracking-[0.4em] text-[10px]">Werte & Prinzipien</div>
              <h2 className="text-4xl md:text-6xl font-display font-medium text-white tracking-tight leading-[0.9]">MENSCHLICHKEIT <br /> TRIFFT AUF <br /> <span className="text-slate-600 italic">TECHNOLOGIE.</span></h2>
              <div className="space-y-8">
                 {[
                   { t: "Kein Bullshit-Bingo", d: "Wir sprechen Ihre Sprache. Klar, ehrlich und direkt auf den Punkt." },
                   { t: "Grounded Design", d: "Ästhetik, die Vertrauen schafft. Hochwertig, zeitlos und ohne unnötiges Bling-Bling." },
                   { t: "Full Ownership", d: "Wir übernehmen Verantwortung für jedes Projekt, als wäre es unser eigenes." }
                 ].map((item, i) => (
                   <div key={i} className="space-y-2">
                      <h4 className="text-xl font-bold text-white">{item.t}</h4>
                      <p className="text-slate-400 font-light text-lg leading-relaxed">{item.d}</p>
                   </div>
                 ))}
              </div>
           </div>
           <div className="relative aspect-square">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-600/20 to-transparent blur-3xl rounded-full" />
              <div className="absolute inset-12 border border-white/10 rounded-[4rem] backdrop-blur-xl flex items-center justify-center overflow-hidden">
                 <div className="grid grid-cols-3 gap-8 p-12">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className="aspect-square bg-white/[0.03] border border-white/5 rounded-2xl animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Final Call to Action */}
        <div className="bg-white/[0.02] border border-white/5 rounded-[5rem] p-16 md:p-32 text-center space-y-12 group overflow-hidden relative">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(6,182,212,0.05),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
           <h2 className="text-5xl md:text-8xl font-display font-medium text-white relative z-10 leading-[0.9] tracking-tighter">BEREIT FÜR DEN <br /> <span className="text-slate-600 italic">NÄCHSTEN</span> <br /> SCHRITT?</h2>
           <p className="text-slate-400 text-xl md:text-2xl font-light max-w-2xl mx-auto relative z-10">Lassen Sie uns gemeinsam herausfinden, wie wir Ihr Business auf das nächste Level heben können.</p>
           <div className="pt-8 relative z-10 flex flex-col sm:flex-row justify-center gap-8">
              <Link to="/booking">
                <button className="h-24 px-16 rounded-full bg-cyan-600 text-white font-black uppercase tracking-[0.3em] text-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-4 mx-auto sm:mx-0 shadow-2xl group/btn">
                  Jetzt Gespräch buchen
                  <ArrowRight size={24} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link to="/contact">
                <button className="h-24 px-16 rounded-full bg-white/[0.03] border border-white/10 text-white font-black uppercase tracking-[0.3em] text-xs hover:bg-white/[0.08] transition-all flex items-center gap-4 mx-auto sm:mx-0">
                  Kontakt aufnehmen
                </button>
              </Link>
           </div>
        </div>

      </div>
    </div>
  );
}
