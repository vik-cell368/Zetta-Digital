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
  Globe,
  Layout
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
      title: "WIR BAUEN KEINE WEBSITES. <br /> <span class='text-cyan-500'>WIR BAUEN DIGITALEN VORSPRUNG.</span>",
      subtitle: "Hochperformante Web-Architektur trifft auf immersive 3D-Ästhetik. Für Unternehmen, die im Netz nicht nur teilnehmen, sondern den Standard definieren.",
      buttonText: "Projekt anfragen & Vision besprechen"
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
      <section className="relative min-h-screen pt-32 pb-20 flex flex-col items-center justify-center z-10 px-6" aria-labelledby="hero-title">
        <motion.div 
          style={{ opacity, scale }}
          className="container mx-auto max-w-6xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/[0.03] border border-white/10 text-cyan-500 text-[10px] uppercase tracking-[0.3em] font-black mb-12 backdrop-blur-md"
          >
            Viktor Labs // Digital Architecture & Motion
          </motion.div>

          <motion.h1 
            id="hero-title"
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
              aria-label="Projekt anfragen und Vision besprechen"
              className="h-20 px-12 rounded-full bg-white text-dark-950 font-black uppercase tracking-[0.3em] text-[10px] hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.2)] flex items-center gap-4 group"
            >
              Projekt anfragen & Vision besprechen
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </button>
            <button 
              onClick={() => navigate('/pricing')}
              aria-label="Individuellen Preis kalkulieren"
              className="h-20 px-12 rounded-full bg-white/[0.03] border border-white/10 text-white font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white/[0.08] transition-all flex items-center gap-4 backdrop-blur-sm"
            >
              Individuellen Preis kalkulieren
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Philosophy Section */}
      <section className="py-48 relative z-10" aria-labelledby="vision-title">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <article className="space-y-12">
              <div className="space-y-8">
                <div className="text-cyan-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4">Viktor Labs Vision</div>
                <h2 id="vision-title" className="text-5xl md:text-8xl font-display font-medium text-white leading-[0.95] tracking-tight">
                  ÄSTHETIK TRIFFT AUF <br /> <span className="text-slate-600 italic">WIRTSCHAFTLICHKEIT.</span>
                </h2>
                <p className="text-slate-400 text-xl md:text-2xl leading-relaxed font-light max-w-xl">
                  Eine Website ist längst keine digitale Visitenkarte mehr, sondern Ihr stärkster digitaler Vertriebskanal. Wir verbinden Architektur mit messbarem ROI.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-6">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                    <CheckCircle2 size={28} />
                  </div>
                  <div className="text-white font-bold text-xl">Absolute Transparenz</div>
                  <p className="text-slate-500 text-base font-light leading-relaxed">Faire Festpreise, modulare Optionen und null versteckte Kosten. Wir setzen auf absolute Verlässlichkeit.</p>
                </div>
                <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-6">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                    <Sparkles size={28} />
                  </div>
                  <div className="text-white font-bold text-lg">Immersive Ästhetik</div>
                  <p className="text-slate-500 text-sm font-light leading-relaxed">Modernstes Design und flüssige 3D-Interaktionen, die Besucher binden und Ihre Marke differenzieren.</p>
                </div>
                <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-6 md:col-span-2">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                    <Layout size={28} />
                  </div>
                  <div className="text-white font-bold text-lg">Sorglose Freiheit</div>
                  <p className="text-slate-500 text-sm font-light leading-relaxed">Wir halten Ihre Präsenz technisch sicher, blitzschnell und aktuell – German Engineering digital übersetzt.</p>
                </div>
              </div>
            </article>
            
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
                      <div className="text-[10px] uppercase tracking-[0.4em] text-cyan-500 font-black">Digital Boutique</div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Expertise Section */}
      <section className="py-32 relative z-10 bg-dark-950/50" aria-labelledby="expertise-title">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-end mb-24">
            <header>
              <div className="text-cyan-500 font-black uppercase tracking-[0.3em] text-[10px] mb-6">Expertise</div>
              <h2 id="expertise-title" className="text-4xl md:text-6xl font-display font-bold text-white leading-tight">
                UNSER HANDWERK. <br /> <span className="text-slate-600">IHRE WIRKUNG.</span>
              </h2>
            </header>
            <div className="max-w-md">
              <p className="text-slate-400 text-lg leading-relaxed mb-8 font-light">
                Wir verbinden tiefgreifende Ästhetik mit flüssiger Interaktion, um digitale Erlebnisse zu schaffen, die Ihre Marke online dominieren lassen.
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
              icon={Globe} 
              title="High-End Webdesign" 
              description="Von minimalistischem Schwarz-Weiß bis hin zu lebendigen, interaktiven Markenwelten. Maßgeschneidert auf Ihre Zielgruppe."
              to="/services"
            />
            <FeatureCard 
              icon={Sparkles} 
              title="Motion & 3D" 
              description="Hochwertige Animationen, die Ihre Produkte greifbar machen und die Verweildauer drastisch erhöhen."
              to="/services"
            />
            <FeatureCard 
              icon={Layout} 
              title="Rundum-Sorglos-Verwaltung" 
              description="Laufende Pflege, Performance-Optimierung und Aktualisierung. Ihre Website bleibt schnell und sicher."
              to="/services"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 relative z-10" aria-labelledby="cta-title">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="glass-card p-12 md:p-28 rounded-[5rem] text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 blur-[120px] -translate-y-1/2 translate-x-1/2 group-hover:bg-cyan-500/20 transition-all duration-700" aria-hidden="true" />
            
            <h2 id="cta-title" className="text-5xl md:text-8xl font-display font-bold text-white mb-10 relative z-10 leading-[0.85] tracking-tighter">
              BEREIT FÜR DEN <br /> <span className="text-cyan-500">NÄCHSTEN LEVEL?</span>
            </h2>
            <p className="text-slate-400 text-xl md:text-2xl max-w-2xl mx-auto mb-16 relative z-10 font-light leading-relaxed">
              Lassen Sie uns gemeinsam eine digitale Präsenz erschaffen, die Ihre Kunden begeistert.
            </p>
            <button 
              onClick={() => navigate('/booking')}
              aria-label="Kostenlose Erstberatung sichern"
              className="h-20 px-16 rounded-full bg-white text-dark-950 font-black uppercase tracking-[0.3em] text-[10px] hover:scale-105 transition-all relative z-10 shadow-2xl"
            >
              Kostenlose Erstberatung sichern
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
