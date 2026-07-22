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
        <div className="mb-40">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-500/10 border border-neon-500/20 text-neon-500 text-[10px] uppercase tracking-widest font-bold mb-8"
          >
            <Users className="w-3 h-3" />
            Our Mission
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl md:text-8xl font-display font-bold text-white tracking-tight leading-[0.9]">
                Wir denken <span className="text-neon-500">Digitalisierung</span> neu.
              </h1>
              <p className="text-gray-400 text-xl leading-relaxed max-w-xl">
                Zetta Digital wurde mit einer klaren Vision gegründet: Kleine und mittelständische Unternehmen mit den Technologien auszustatten, die normalerweise nur den Silicon-Valley-Giganten vorbehalten sind.
              </p>
            </div>
            <div className="relative">
               <div className="aspect-square rounded-[4rem] overflow-hidden border border-white/5 bg-dark-900 group">
                  <img 
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800" 
                    alt="Team collaboration" 
                    className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 to-transparent" />
               </div>
               {/* Floating Badge */}
               <div className="absolute -bottom-10 -left-10 glass-card p-10 rounded-[3rem] border-white/10 shadow-2xl">
                  <div className="text-5xl font-display font-bold text-neon-500 mb-2">100%</div>
                  <div className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Passion for Digital</div>
               </div>
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-40">
          <div className="lg:col-span-1 space-y-6">
             <h2 className="text-3xl font-display font-bold text-white">Warum Zetta?</h2>
             <div className="h-1 w-20 bg-neon-500" />
          </div>
          <div className="lg:col-span-2 text-gray-400 text-lg leading-relaxed space-y-8">
            <p>
              In einer Welt, in der die digitale Präsenz über den Erfolg eines Unternehmens entscheidet, reicht "gut genug" nicht mehr aus. Viele Agenturen bauen Webseiten, die zwar schön aussehen, aber keinen geschäftlichen Nutzen bringen.
            </p>
            <p>
              Wir haben Zetta Digital gestartet, um das zu ändern. Wir kombinieren High-End Design mit messbarer Performance und intelligenter KI-Automation. Unser Ziel ist es, dass Ihre Website nicht nur Ihre Visitenkarte ist, sondern Ihr bester Mitarbeiter.
            </p>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-40">
          {VALUES.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-12 rounded-[3rem] border-white/5 hover:border-neon-500/30 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-neon-500/10 flex items-center justify-center text-neon-500 mb-8 group-hover:scale-110 transition-transform">
                {v.icon}
              </div>
              <h3 className="text-2xl font-display font-bold text-white mb-4">{v.title}</h3>
              <p className="text-gray-500 leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Tech Stack Section */}
        <div className="mb-40 text-center space-y-12">
          <h2 className="text-4xl font-display font-bold text-white">Unser <span className="text-neon-500">Tech Stack</span></h2>
          <div className="flex flex-wrap justify-center gap-6">
            {['Next.js', 'React', 'Tailwind', 'Framer Motion', 'OpenAI', 'Python', 'Supabase', 'Stripe'].map(tech => (
              <span key={tech} className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 font-mono text-sm tracking-widest hover:text-white hover:border-white/20 transition-all">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-neon-500 rounded-[4rem] p-12 md:p-24 text-center space-y-8 relative overflow-hidden">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.2),transparent_70%)]" />
           <h2 className="text-4xl md:text-6xl font-display font-bold text-dark-950 relative z-10">Lust auf die Zukunft?</h2>
           <p className="text-dark-950/70 text-xl font-medium max-w-2xl mx-auto relative z-10">Lassen Sie uns gemeinsam herausfinden, wie wir Ihr Unternehmen digital auf das nächste Level heben können.</p>
           <div className="pt-6 relative z-10">
              <Link to="/booking">
                <button className="h-16 px-12 rounded-2xl bg-dark-950 text-white font-bold text-lg hover:scale-105 transition-all flex items-center gap-3 mx-auto shadow-2xl">
                  Erstgespräch vereinbaren
                  <ArrowRight size={20} />
                </button>
              </Link>
           </div>
        </div>

      </div>
    </div>
  );
}
