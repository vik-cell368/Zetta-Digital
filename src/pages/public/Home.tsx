import { motion, useScroll, useTransform } from 'motion/react';
import { 
  ArrowUpRight, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  MessageSquare, 
  Target,
  ArrowRight,
  Hexagon,
  Layers,
  Zap,
  Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

const FeatureCard = ({ icon: Icon, title, description, to }: { icon: any, title: string, description: string, to?: string }) => {
  const navigate = useNavigate();
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group p-12 rounded-[3.5rem] bg-dark-900/40 backdrop-blur-2xl border border-white/5 hover:border-cyan-500/30 transition-all duration-500 cursor-pointer flex flex-col h-full shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
      onClick={() => to && navigate(to)}
    >
      <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 mb-10 group-hover:scale-110 transition-transform duration-500">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-3xl font-display font-bold text-white mb-6 leading-tight tracking-tight">{title}</h3>
      <p className="text-slate-400 text-lg leading-relaxed mb-10 flex-grow font-light">{description}</p>
      <div className="flex items-center gap-3 text-cyan-500 font-black uppercase tracking-[0.2em] text-[10px] transform translate-x-0 group-hover:translate-x-3 transition-all">
        Detailansicht <ArrowRight size={16} />
      </div>
    </motion.div>
  );
};

export default function Home() {
  const navigate = useNavigate();
  const [config, setConfig] = useState({
    hero: {
      title: "WIR GESTALTEN DIE ZUKUNFT. <span class='italic font-light'>GEMEINSAM.</span>",
      subtitle: "Maßgeschneiderte Web-Applikationen und KI-Lösungen, die Ihr Business menschlich voranbringen. Effizient, transparent und bodenständig.",
      buttonText: "Projekt starten"
    }
  });

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => {
    const savedConfig = localStorage.getItem('viktor_labs_site_config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        if (parsed.hero) setConfig(prev => ({ ...prev, hero: parsed.hero }));
      } catch (e) {
        console.error("Failed to parse config", e);
      }
    }
  }, []);

  return (
    <div ref={containerRef} className="relative bg-dark-950 overflow-hidden">
      {/* Subtle Background Grain & Soft Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] bg-cyan-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-cyan-900/10 blur-[100px] rounded-full" />
        <div className="absolute inset-0 bg-noise opacity-5" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen pt-32 pb-20 flex flex-col items-center justify-center z-10 px-6">
        <motion.div 
          style={{ opacity, scale }}
          className="container mx-auto max-w-6xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/[0.03] border border-white/10 text-cyan-500 text-[10px] uppercase tracking-[0.3em] font-black mb-12 backdrop-blur-md"
          >
            Digital Craftsmanship
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-6xl md:text-8xl lg:text-[9.5rem] font-display font-medium text-white mb-12 tracking-tight leading-[0.85]"
            dangerouslySetInnerHTML={{ __html: config.hero.title }}
          />

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="text-xl md:text-3xl text-slate-400 max-w-4xl mx-auto mb-20 leading-relaxed font-light"
          >
            {config.hero.subtitle}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <button 
              onClick={() => navigate('/booking')}
              className="h-20 px-12 rounded-full bg-cyan-600 text-white font-black uppercase tracking-[0.2em] text-xs hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-4"
            >
              Projekt starten
              <ArrowUpRight size={20} />
            </button>
            <button 
              onClick={() => navigate('/pricing')}
              className="h-20 px-12 rounded-full bg-white/[0.03] border border-white/10 text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-white/[0.08] transition-all flex items-center gap-4 backdrop-blur-sm"
            >
              Preise kalkulieren
            </button>
            <button 
              onClick={() => navigate('/services')}
              className="h-20 px-12 rounded-full bg-transparent text-slate-500 font-black uppercase tracking-[0.2em] text-xs hover:text-white transition-all flex items-center gap-4"
            >
              Leistungen
            </button>
          </motion.div>
        </motion.div>

        {/* Hero Bottom Stats/Badges */}
        <div className="container mx-auto max-w-6xl mt-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Projekte", val: "250+" },
              { label: "Zufriedenheit", val: "99%" },
              { label: "KI-Agenten", val: "45" },
              { label: "Experten", val: "12" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-display font-bold text-white mb-2">{stat.val}</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section - Human & Empathetic (Typographic Only) */}
      <section className="py-48 relative z-10">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <div className="space-y-8">
                <div className="text-cyan-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4">Menschlichkeit</div>
                <h2 className="text-5xl md:text-8xl font-display font-medium text-white leading-[0.95] tracking-tight">
                  WIR GLAUBEN AN <br /> <span className="text-slate-600 italic">DIE KRAFT DER</span> <br /> <span className="text-white">EMPATHIE.</span>
                </h2>
                <p className="text-slate-400 text-xl md:text-2xl leading-relaxed font-light max-w-xl">
                  Hinter jedem Algorithmus und jeder Zeile Code steht ein Mensch mit einem Ziel. Wir bauen Brücken zwischen digitaler Effizienz und echter Partnerschaft.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-6">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                    <CheckCircle2 size={28} />
                  </div>
                  <div className="text-white font-bold text-xl">Integrität</div>
                  <p className="text-slate-500 text-base font-light leading-relaxed">Ehrliche Beratung auf Augenhöhe ohne versteckte Absichten.</p>
                </div>
                <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-6">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                    <Sparkles size={28} />
                  </div>
                  <div className="text-white font-bold text-lg">Exzellenz</div>
                  <p className="text-slate-500 text-sm font-light leading-relaxed">Höchste Standards in Design und technischer Umsetzung.</p>
                </div>
              </div>
            </div>
            
            <div className="relative hidden lg:block">
              {/* Abstract Architectural Pattern */}
              <div className="aspect-square relative flex items-center justify-center">
                <div className="absolute inset-0 bg-cyan-600/5 rounded-full blur-[120px]" />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                  className="relative w-full h-full border border-white/[0.03] rounded-full flex items-center justify-center"
                >
                  <div className="w-4/5 h-4/5 border border-white/[0.05] rounded-full flex items-center justify-center">
                    <div className="w-3/5 h-3/5 border border-white/[0.08] rounded-full" />
                  </div>
                </motion.div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="text-center">
                      <div className="text-6xl font-display text-white/10 mb-2">2026</div>
                      <div className="text-[10px] uppercase tracking-[0.4em] text-cyan-500 font-black">Future Focused</div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Expertise Section */}
      <section className="py-32 relative z-10 bg-dark-950/50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-end mb-24">
            <div>
              <div className="text-cyan-500 font-black uppercase tracking-[0.3em] text-[10px] mb-6">Expertise</div>
              <h2 className="text-4xl md:text-6xl font-display font-bold text-white leading-tight">
                STRATEGY <br /> DESIGN <br /> <span className="text-slate-600">DELIVER IMPACT</span>
              </h2>
            </div>
            <div className="max-w-md">
              <p className="text-slate-400 text-lg leading-relaxed mb-8 font-light">
                Wir verbinden kreatives Design mit modernster Technologie, um digitale Erlebnisse zu schaffen, die nicht nur gut aussehen, sondern Ergebnisse liefern.
              </p>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center text-dark-950">
                  <Zap size={20} />
                </div>
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white">
                  <Globe size={20} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Layers} 
              title="KI-Integration" 
              description="Automatisieren Sie Ihre Geschäftsprozesse mit intelligenten KI-Lösungen und LLM-Integrationen."
              to="/services"
            />
            <FeatureCard 
              icon={Target} 
              title="Modern Web" 
              description="Hochperformante Web-Applikationen mit Fokus auf User Experience und Conversion-Optimierung."
              to="/services"
            />
            <FeatureCard 
              icon={TrendingUp} 
              title="Digital Growth" 
              description="Strategische Begleitung Ihrer digitalen Transformation für nachhaltiges Wachstum und Skalierung."
              to="/services"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 relative z-10">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="glass-card p-12 md:p-28 rounded-[5rem] text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 blur-[120px] -translate-y-1/2 translate-x-1/2 group-hover:bg-cyan-500/20 transition-all duration-700" />
            
            <h2 className="text-5xl md:text-8xl font-display font-bold text-white mb-10 relative z-10 leading-[0.85] tracking-tighter">
              WE SOLVE. <br /> <span className="text-cyan-500">YOU GROW.</span>
            </h2>
            <p className="text-slate-400 text-xl md:text-2xl max-w-2xl mx-auto mb-16 relative z-10 font-light leading-relaxed">
              Bereit für die digitale Zukunft? Lassen Sie uns gemeinsam etwas Außergewöhnliches schaffen.
            </p>
            <button 
              onClick={() => navigate('/booking')}
              className="h-20 px-16 rounded-full bg-white text-dark-950 font-black uppercase tracking-[0.3em] text-xs hover:scale-105 transition-all relative z-10 shadow-2xl"
            >
              Kostenlose Beratung
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
