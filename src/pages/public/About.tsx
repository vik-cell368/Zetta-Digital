import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Target, Eye, Cpu, Rocket, Shield, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const VALUES = [
  {
    icon: <Target className="w-6 h-6" />,
    title: "Ergebnisorientiert",
    desc: "Wir bauen keine Webseiten um der Webseiten willen. Jedes Projekt hat ein klares Ziel: Mehr Umsatz, mehr Leads oder mehr Zeit."
  },
  {
    icon: <Eye className="w-6 h-6" />,
    title: "Transparent",
    desc: "Keine versteckten Kosten, keine Agentur-Phrasen. Wir kommunizieren auf Augenhöhe und halten unsere Versprechen."
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    title: "Technologisch führend",
    desc: "Wir nutzen die modernsten Tech-Stacks (Next.js, KI-Automationen), um unseren Kunden einen unfairen Wettbewerbsvorteil zu verschaffen."
  }
];

export default function About() {
  return (
    <div className="bg-dark-950 min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Hero Section */}
        <div className="mb-48">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/[0.03] border border-white/10 text-cyan-500 text-[10px] uppercase tracking-[0.3em] font-black mb-12 backdrop-blur-md"
          >
            Digital Craftsmanship
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-10">
              <h1 className="text-5xl md:text-8xl font-display font-medium text-slate-50 tracking-tight leading-[0.9]">
                WIR DENKEN <br /> <span className="text-slate-600">DIGITALISIERUNG</span> <br /> <span className="text-white">MENSCHLICH.</span>
              </h1>
              <p className="text-slate-400 text-xl md:text-2xl font-light leading-relaxed max-w-xl">
                Viktor Labs wurde mit einer klaren Vision gegründet: Technologie so einzusetzen, dass sie dem Menschen dient – nicht umgekehrt. Wir bauen Brücken zwischen digitaler Effizienz und echter Partnerschaft.
              </p>
            </div>
            <div className="relative">
               {/* Abstract Architectural Composition */}
               <div className="aspect-square rounded-[5rem] overflow-hidden border border-white/[0.03] bg-dark-900/40 relative flex items-center justify-center group">
                  <div className="absolute inset-0 bg-cyan-600/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  
                  <motion.div 
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                    className="relative w-4/5 h-4/5 border border-white/[0.05] rounded-[4rem] flex items-center justify-center"
                  >
                     <div className="w-4/5 h-4/5 border border-white/[0.08] rounded-[3.5rem] flex items-center justify-center">
                        <div className="w-4/5 h-4/5 border border-white/[0.12] rounded-[3rem]" />
                     </div>
                  </motion.div>

                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="text-center space-y-4">
                        <div className="text-8xl font-display text-white/5 font-medium">VL</div>
                        <div className="text-cyan-500 font-black text-[10px] uppercase tracking-[0.4em] opacity-40">Est. 2024</div>
                     </div>
                  </div>
               </div>
               
               {/* Floating Badge */}
               <div className="absolute -bottom-10 -left-10 bg-dark-900/80 backdrop-blur-2xl p-12 rounded-[4rem] border border-white/10 shadow-2xl">
                  <div className="text-6xl font-display font-medium text-cyan-500 mb-2 tracking-tighter">100%</div>
                  <div className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-500">Passion for Design</div>
               </div>
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-48">
          <div className="lg:col-span-1 space-y-8">
             <h2 className="text-4xl md:text-5xl font-display font-medium text-slate-50 tracking-tight">WARUM <br /> <span className="text-slate-600">VIKTOR LABS?</span></h2>
             <div className="h-1 w-24 bg-cyan-600 rounded-full" />
          </div>
          <div className="lg:col-span-2 text-slate-400 text-xl md:text-2xl font-light leading-relaxed space-y-10">
            <p>
              In einer Welt, in der die digitale Präsenz über den Erfolg eines Unternehmens entscheidet, reicht "gut genug" nicht mehr aus. Viele Agenturen bauen Webseiten, die zwar schön aussehen, aber keinen geschäftlichen Nutzen bringen.
            </p>
            <p>
              Wir haben Viktor Labs gestartet, um das zu ändern. Wir kombinieren High-End Design mit messbarer Performance und menschlicher Empathie. Unser Ziel ist es, dass Ihre Website nicht nur Ihre Visitenkarte ist, sondern Ihr stärkster Partner im Business.
            </p>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-48">
          {VALUES.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/[0.02] p-14 rounded-[4rem] border border-white/5 hover:border-cyan-500/20 transition-all duration-700 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 mb-10 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-500">
                {v.icon}
              </div>
              <h3 className="text-3xl font-display font-medium text-slate-50 mb-6 tracking-tight">{v.title}</h3>
              <p className="text-slate-500 text-lg font-light leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Tech Stack Section */}
        <div className="mb-48 text-center space-y-16">
          <div className="space-y-4">
            <div className="text-cyan-500 font-black uppercase tracking-[0.4em] text-[10px]">Technologien</div>
            <h2 className="text-4xl md:text-6xl font-display font-medium text-slate-50 tracking-tight">UNSER <span className="text-slate-600">TECH STACK</span></h2>
          </div>
          <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
            {['Next.js', 'React', 'Tailwind', 'Framer Motion', 'OpenAI', 'Python', 'Supabase', 'Stripe'].map(tech => (
              <span key={tech} className="px-10 py-5 rounded-full bg-white/[0.03] border border-white/10 text-slate-400 font-black uppercase text-[10px] tracking-[0.3em] hover:text-cyan-500 hover:border-cyan-500/50 transition-all duration-500 cursor-default">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-cyan-600 rounded-[5rem] p-16 md:p-32 text-center space-y-12 relative overflow-hidden group">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.2),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
           <h2 className="text-5xl md:text-8xl font-display font-medium text-dark-950 relative z-10 leading-[0.9] tracking-tighter">LUST AUF DIE <br /> ZUKUNFT?</h2>
           <p className="text-dark-950/70 text-xl md:text-2xl font-medium max-w-2xl mx-auto relative z-10">Lassen Sie uns gemeinsam herausfinden, wie wir Ihr Unternehmen digital auf das nächste Level heben können.</p>
           <div className="pt-8 relative z-10">
              <Link to="/booking">
                <button className="h-24 px-16 rounded-full bg-dark-950 text-white font-black uppercase tracking-[0.3em] text-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-4 mx-auto shadow-2xl">
                  Erstgespräch vereinbaren
                  <ArrowRight size={24} />
                </button>
              </Link>
           </div>
        </div>

      </div>
    </div>
  );
}
