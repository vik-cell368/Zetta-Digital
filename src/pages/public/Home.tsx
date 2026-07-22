import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { 
  Monitor, 
  Zap, 
  Bot, 
  TrendingUp, 
  ChevronRight, 
  Sparkles,
  Layers,
  Search,
  MessageSquare,
  CheckCircle2,
  ArrowUpRight,
  Target,
  ArrowRight,
  Workflow
} from 'lucide-react';
import { Button } from "@/components/ui/Button";

const TrustBadge = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
    {children}
  </div>
);

const FeatureCard = ({ icon: Icon, title, desc, delay = 0, to }: any) => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8 }}
      className="group p-8 rounded-3xl bg-dark-900/40 border border-white/5 hover:border-neon-500/30 transition-all duration-500 glass-card cursor-pointer"
      onClick={() => to && navigate(to)}
    >
      <div className="w-12 h-12 rounded-2xl bg-neon-500/10 flex items-center justify-center text-neon-500 mb-6 group-hover:scale-110 transition-transform duration-500">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-display font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed mb-6">{desc}</p>
      <div className="flex items-center gap-2 text-neon-500 text-[10px] uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity">
        Mehr erfahren <ArrowRight className="w-3 h-3" />
      </div>
    </motion.div>
  );
};

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const yOffset = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const [config, setConfig] = useState({
    hero: {
      title: 'Professionelle Websites & KI-Lösungen für Unternehmen.',
      subtitle: 'Wir entwickeln Websites, Chatbots und Automatisierungen, die Ihre Prozesse digitalisieren, Arbeitszeit sparen und messbar mehr Kunden bringen.',
      buttonText: 'Erstgespräch buchen'
    }
  });

  useEffect(() => {
    const savedConfig = localStorage.getItem('zetta_site_config');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, []);

  return (
    <div className="bg-dark-950 min-h-screen selection:bg-neon-500/30 overflow-x-hidden relative">
      {/* Sophisticated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{ 
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-neon-500/10 blur-[100px] rounded-full" 
        />
        <motion.div 
          animate={{ 
            opacity: [0.02, 0.05, 0.02],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 2 }}
          className="absolute bottom-0 right-0 w-[50%] h-[50%] bg-white/5 blur-[80px] rounded-full" 
        />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen pt-32 pb-20 flex flex-col items-center justify-center overflow-hidden z-10">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-40">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-neon-500/20 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-500/10 border border-neon-500/20 text-neon-500 text-[10px] uppercase tracking-widest font-bold mb-8"
          >
            <Sparkles className="w-3 h-3" />
            Zetta Digital – Premium Agentur 2026
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-8 tracking-tight leading-[1.05]"
            dangerouslySetInnerHTML={{ __html: config.hero.title.replace('KI-Lösungen', '<span class="text-transparent bg-clip-text bg-gradient-to-r from-neon-500 to-white/80">KI-Lösungen</span>') }}
          />

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            {config.hero.subtitle}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button 
              size="lg" 
              onClick={() => navigate('/booking')}
              className="h-16 px-10 rounded-2xl bg-neon-500 text-dark-950 font-bold text-lg hover:scale-105 transition-all shadow-[0_0_30px_rgba(197,160,89,0.3)] group"
            >
              {config.hero.buttonText}
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => navigate('/pricing')}
              className="h-16 px-10 rounded-2xl border-white/10 text-white font-bold text-lg hover:bg-white/5 transition-all"
            >
              Preise kalkulieren
            </Button>
          </motion.div>

          {/* Dashboard Preview Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-24 relative max-w-6xl mx-auto"
          >
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-dark-900/50 p-2 shadow-2xl">
              <div className="bg-dark-950 rounded-2xl overflow-hidden aspect-[16/9] relative group">
                <div className="absolute inset-0 flex">
                  <div className="w-64 border-r border-white/5 p-6 space-y-4 hidden md:block">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className={`h-8 rounded-lg ${i === 1 ? 'bg-neon-500/20' : 'bg-white/5'}`} />
                    ))}
                  </div>
                  <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="col-span-full h-32 rounded-2xl bg-gradient-to-r from-neon-500/10 to-transparent border border-white/5" />
                    {[1,2,3,4,5,6].map(i => (
                      <div key={i} className="h-40 rounded-2xl bg-white/5 border border-white/5" />
                    ))}
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-tr from-neon-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
            </div>
            
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 hidden lg:block glass-card p-6 border-neon-500/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Umsatzwachstum</div>
                  <div className="text-xl font-bold text-white">+127%</div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-10 -left-10 hidden lg:block glass-card p-6 border-blue-500/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">AI Chatbot</div>
                  <div className="text-xl font-bold text-white">Live Aktiv</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Simple Navigator Section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto glass-card p-1 items-center flex flex-col md:flex-row gap-1 rounded-[2.5rem] border-white/5 overflow-hidden">
            <button 
              onClick={() => navigate('/services')}
              className="flex-1 w-full py-8 px-6 hover:bg-white/5 transition-colors text-center group"
            >
              <div className="text-[10px] text-neon-500 uppercase tracking-widest font-bold mb-2">Ich brauche</div>
              <div className="text-xl font-bold text-white group-hover:text-neon-400 transition-colors">Eine Website</div>
            </button>
            <div className="w-px h-12 bg-white/10 hidden md:block" />
            <button 
              onClick={() => navigate('/ai-automation')}
              className="flex-1 w-full py-8 px-6 hover:bg-white/5 transition-colors text-center group"
            >
              <div className="text-[10px] text-neon-500 uppercase tracking-widest font-bold mb-2">Ich brauche</div>
              <div className="text-xl font-bold text-white group-hover:text-neon-400 transition-colors">KI-Automatisierung</div>
            </button>
            <div className="w-px h-12 bg-white/10 hidden md:block" />
            <button 
              onClick={() => navigate('/pricing')}
              className="flex-1 w-full py-8 px-6 bg-neon-500 hover:bg-neon-400 transition-colors text-center rounded-[2rem] group"
            >
              <div className="text-[10px] text-dark-950/60 uppercase tracking-widest font-bold mb-2">Ich möchte</div>
              <div className="text-xl font-bold text-dark-950">Preise wissen</div>
            </button>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 border-y border-white/5 bg-dark-900/20">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="text-2xl font-bold text-white tracking-tighter">REACT</span>
            <span className="text-2xl font-bold text-white tracking-tighter">STRIPE</span>
            <span className="text-2xl font-bold text-white tracking-tighter">VERCEL</span>
            <span className="text-2xl font-bold text-white tracking-tighter">OPENAI</span>
            <span className="text-2xl font-bold text-white tracking-tighter">SUPABASE</span>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-32 relative overflow-hidden z-10">
        <div className="container mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <FeatureCard 
              icon={Workflow}
              to="/services"
              title="KI Automation"
              desc="Repetitive Aufgaben eliminieren. Wir bauen Workflows, die für Sie arbeiten."
            />
            <FeatureCard 
              icon={Layers}
              to="/portfolio"
              title="Premium Design"
              desc="Ästhetik auf Apple-Niveau. Wir schaffen digitale Identitäten, die Vertrauen wecken."
            />
            <FeatureCard 
              icon={Bot}
              to="/services"
              title="KI Chatbots"
              desc="Integrierte KI-Lösungen, die Anfragen vorqualifizieren und Zeit im Support sparen."
            />
            <FeatureCard 
              icon={Search}
              to="/pricing"
              title="SEO & Sichtbarkeit"
              desc="Gefunden werden, wo Ihre Kunden suchen. Wir bringen Sie auf Seite 1."
            />
          </motion.div>
        </div>
      </section>

      {/* Strategy Section */}
      <section className="py-32 bg-dark-900/30 relative z-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2"
            >
              <TrustBadge>Positionierung</TrustBadge>
              <h2 className="text-4xl md:text-6xl font-display font-bold text-white mt-6 mb-8 tracking-tight">
                Wir verkaufen keine Webseiten. Wir verkaufen <span className="text-neon-500">Erfolg</span>.
              </h2>
              <div className="space-y-6">
                {[
                  { t: "Mehr Kunden", d: "Durch gezielte Conversion-Optimierung und Lead-Magneten." },
                  { t: "Mehr Umsatz", d: "Professioneller Auftritt für höhere Abschlussquoten." },
                  { t: "Zeitersparnis", d: "Automatisierte Prozesse durch intelligente KI-Agenten." }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors group"
                  >
                    <div className="w-6 h-6 rounded-full bg-neon-500/20 flex items-center justify-center text-neon-500 shrink-0 mt-1 group-hover:scale-110 transition-transform">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1 group-hover:text-neon-400 transition-colors">{item.t}</h4>
                      <p className="text-sm text-gray-500">{item.d}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 relative"
            >
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="aspect-square glass-card p-8 flex flex-col justify-center items-center text-center relative z-10"
              >
                <Target className="w-20 h-20 text-neon-500 mb-8" />
                <h3 className="text-3xl font-bold text-white mb-4">Ihre Zielgruppe im Fokus</h3>
                <p className="text-gray-400 max-w-sm mb-8">
                  Handwerker, Restaurants, Immobilienmakler oder Coaches – wir wissen, wie man Ihre Kunden digital überzeugt.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  {["Handwerk", "Medizin", "Coaching", "Gastro", "Startups"].map(tag => (
                    <span key={tag} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-gray-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
              <div className="absolute inset-0 bg-neon-500/10 blur-[80px] rounded-full scale-75 -z-0" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 relative">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-7xl font-display font-bold text-white mb-12 tracking-tight">
              Bereit für die <span className="text-neon-500 text-glow">digitale Zukunft</span>?
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button 
                size="lg" 
                onClick={() => navigate('/booking')}
                className="h-20 px-16 rounded-3xl bg-white text-dark-950 font-bold text-xl hover:scale-105 transition-all shadow-[0_0_50px_rgba(255,255,255,0.2)]"
              >
                Kostenlose Erstberatung
              </Button>
              <button 
                onClick={() => navigate('/pricing')}
                className="text-white font-bold flex items-center gap-2 hover:gap-3 transition-all"
              >
                Konfigurator starten <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-[10px] text-gray-500 uppercase tracking-[0.3em] font-bold">
              <span>● DSGVO Konform</span>
              <span>● Made in Germany</span>
              <span>● Support 24/7</span>
              <span>● KI-Integrierbar</span>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
