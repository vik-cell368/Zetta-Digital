import { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  Zap,
  CheckCircle2,
  Box,
  Layers,
  ArrowUpRight,
  Sparkles,
  Layout,
  Globe,
  ArrowUpRight as ArrowIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn, getTranslatedText } from '@/lib/utils';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Service } from '@/lib/types';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/SEO';

const BentoCard = ({ 
  className, 
  children, 
  title, 
  subtitle, 
  icon: Icon,
  to 
}: { 
  className?: string, 
  children?: React.ReactNode, 
  title?: string, 
  subtitle?: string, 
  icon?: any,
  to?: string
}) => {
  const navigate = useNavigate();
  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={() => to && navigate(to)}
      role={to ? "button" : "article"}
      tabIndex={to ? 0 : undefined}
      aria-label={to ? `Mehr Informationen zu ${title}` : undefined}
      onKeyDown={(e) => {
        if (to && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          navigate(to);
        }
      }}
      className={cn(
        "group relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-200 hover:border-cyan-500/30 transition-all duration-700 cursor-pointer p-8 flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-cyan-500/50",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-transparent to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-700" />
      
      {children ? (
        children
      ) : (
        <>
          <div className="space-y-4">
            {Icon && (
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-cyan-500 group-hover:scale-110 transition-all duration-700">
                <Icon size={24} aria-hidden="true" />
              </div>
            )}
            <div>
              <h3 className="text-2xl font-display font-medium text-dark-900 mb-2 tracking-tight uppercase">{title}</h3>
              <p className="text-slate-500 text-sm font-light leading-relaxed">{subtitle}</p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-8">
            <div className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 group-hover:text-cyan-500 transition-colors">
              Details
            </div>
            <ArrowUpRight size={16} className="text-slate-300 group-hover:text-cyan-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" aria-hidden="true" />
          </div>
        </>
      )}
    </motion.article>
  );
};

const DEFAULT_CONFIG = {
  sections: [
    { id: 'hero', name: 'Hero / Start-Header', type: 'Header', visible: true },
    { id: 'vision', name: 'Vision & Mehrwert', type: 'Philosophie', visible: true },
    { id: 'expertise', name: 'Unsere Leistungen', type: 'Angebote', visible: true },
    { id: 'cta', name: 'Finaler Call to Action', type: 'Footer', visible: true }
  ],
  hero: {
    badge: 'Digital Architecture & AI Motion',
    title: 'DIE ZUKUNFT DES WEB... NEU DEFINIERT',
    subtitle: 'Hochperformante Web-Architektur trifft auf immersive Ästhetik. Wir entwickeln intelligente Lösungen für Unternehmen, die den Standard im Netz setzen wollen.',
    primaryBtn: 'Erstgespräch buchen',
    secondaryBtn: 'Leistungen entdecken'
  },
  vision: {
    badge: 'Viktor Labs Vision',
    title: 'ÄSTHETIK TRIFFT WIRTSCHAFT.',
    subtitle: 'Eine Website ist längst keine digitale Visitenkarte mehr, sondern Ihr stärkster digitaler Vertriebskanal.',
    card1Title: 'Absolute Transparenz',
    card1Desc: 'Faire Festpreise, modulare Optionen und null versteckte Kosten.',
    card2Title: 'Immersive Ästhetik',
    card2Desc: 'Modernstes Design und flüssige 3D-Interaktionen, die Besucher binden.'
  },
  expertise: {
    badge: 'Expertise',
    title: 'UNSERE LEISTUNGEN.',
    card1Title: 'HIGH-END WEBDESIGN',
    card1Desc: 'Von minimalistischem Schwarz-Weiß bis hin zu lebendigen, interaktiven Markenwelten.',
    card2Title: 'Motion & 3D',
    card2Desc: 'Hochwertige Animationen, die Ihre Produkte greifbar machen.',
    card3Title: 'Management',
    card3Desc: 'Ihr Vertriebsteam, 24/7 im digitalen Einsatz.'
  },
  cta: {
    title: 'BEREIT FÜR DEN VORSPRUNG?',
    subtitle: 'Lassen Sie uns gemeinsam eine digitale Präsenz erschaffen, die Ihre Kunden begeistert.',
    btnText: 'Erstgespräch buchen'
  },
  customSections: {} as Record<string, any>
};

export default function Home() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const currentLang = i18n.language.split('-')[0] || 'de';
  const containerRef = useRef(null);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [dbServices, setDbServices] = useState<Service[]>([]);

  useEffect(() => {
    async function fetchServices() {
      try {
        const servicesRef = collection(db, 'services');
        const q = query(
          servicesRef, 
          where('is_active', '==', true),
          orderBy('created_at', 'asc')
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
        
        if (data && data.length > 0) {
          setDbServices(data);
        } else {
          const local = localStorage.getItem('viktor_labs_services');
          if (local) {
            setDbServices(JSON.parse(local).filter((s: Service) => s.is_active));
          }
        }
      } catch (e) {
        console.warn("Home: Services fetch failed", e);
        handleFirestoreError(e, OperationType.LIST, 'services');
      }
    }
    fetchServices();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('viktor_labs_site_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConfig({
          ...DEFAULT_CONFIG,
          ...parsed,
          sections: parsed.sections || DEFAULT_CONFIG.sections,
          hero: { ...DEFAULT_CONFIG.hero, ...parsed.hero },
          vision: { ...DEFAULT_CONFIG.vision, ...parsed.vision },
          expertise: { ...DEFAULT_CONFIG.expertise, ...parsed.expertise },
          cta: { ...DEFAULT_CONFIG.cta, ...parsed.cta },
          customSections: parsed.customSections || {}
        });
      } catch (e) {
        console.warn("Failed loading site config", e);
      }
    }
  }, []);

  const visibleSections = config.sections.filter(s => s.visible !== false);

  const renderSection = (sectionId: string) => {
    if (sectionId === 'hero') {
      return (
        <section key="hero" className="relative min-h-screen pt-44 md:pt-48 lg:pt-52 pb-20 flex flex-col items-center justify-center z-10 px-6 bg-dark-900">
          <div className="absolute inset-0 bg-grid-white pointer-events-none opacity-50" />
          <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
          <div className="container mx-auto max-w-7xl relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-7 text-left">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/[0.03] border border-white/10 text-cyan-500 text-[10px] uppercase tracking-[0.4em] font-black mb-12 backdrop-blur-md"
                >
                  {config.hero.badge || 'Digital Architecture & AI Motion'}
                </motion.div>

                <motion.h1 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  className="text-4xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl 2xl:text-[8rem] font-display font-medium text-white mb-12 tracking-tight leading-[0.88] text-glow uppercase break-words min-w-0"
                >
                  {config.hero.title}
                </motion.h1>

                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 1 }}
                  className="text-xl md:text-2xl text-slate-400 max-w-xl mb-16 leading-relaxed font-light"
                >
                  {config.hero.subtitle}
                </motion.p>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 1 }}
                  className="flex flex-col sm:flex-row gap-6"
                >
                  <button 
                    onClick={() => navigate('/booking')}
                    className="h-16 px-12 rounded-full bg-cyan-500 text-white font-black uppercase tracking-[0.3em] text-[10px] hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(0,123,255,0.4)] flex items-center gap-4 group"
                  >
                    {config.hero.primaryBtn || 'Erstgespräch buchen'}
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button 
                    onClick={() => navigate('/services')}
                    className="h-16 px-12 rounded-full bg-white/[0.03] border border-white/10 text-white font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white/[0.08] transition-all flex items-center gap-4 backdrop-blur-sm"
                  >
                    {config.hero.secondaryBtn || 'Leistungen entdecken'}
                  </button>
                </motion.div>
              </div>

              <div className="lg:col-span-5 relative">
                <div className="grid grid-cols-2 gap-6 auto-rows-[280px]">
                  <BentoCard 
                    className="bg-white col-span-2 row-span-1 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]"
                    title="24/7 AI Sales"
                    subtitle="Intelligente Prozesse für maximalen ROI."
                    icon={Zap}
                    to="/services/management"
                  />
                  <BentoCard 
                    className="bg-slate-50 col-span-1 shadow-xl"
                    title="3D Design"
                    subtitle="Immersive Erlebnisse."
                    icon={Box}
                    to="/services/animation"
                  />
                  <BentoCard 
                    className="bg-slate-100 col-span-1 shadow-xl"
                    title="Safety"
                    subtitle="German Engineering."
                    icon={Layers}
                    to="/about"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }

    if (sectionId === 'vision') {
      return (
        <section key="vision" className="py-48 relative z-10 bg-white">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-24 items-center">
              <article className="space-y-12 min-w-0">
                <div className="space-y-8">
                  <div className="text-cyan-600 font-black uppercase tracking-[0.4em] text-[10px] mb-4">
                    {config.vision.badge || 'Viktor Labs Vision'}
                  </div>
                  <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-display font-medium text-dark-900 leading-[0.95] tracking-tight uppercase break-words">
                    {config.vision.title}
                  </h2>
                  <p className="text-slate-500 text-xl md:text-2xl leading-relaxed font-light max-w-xl">
                    {config.vision.subtitle}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-12 rounded-[2.5rem] bg-slate-50 border border-slate-200 space-y-6 group hover:border-cyan-500/20 transition-all shadow-sm">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 group-hover:scale-110 transition-transform">
                      <CheckCircle2 size={28} />
                    </div>
                    <div className="text-dark-900 font-bold text-xl uppercase tracking-tight">{config.vision.card1Title}</div>
                    <p className="text-slate-500 text-base font-light leading-relaxed">{config.vision.card1Desc}</p>
                  </div>
                  <div className="p-12 rounded-[2.5rem] bg-slate-50 border border-slate-200 space-y-6 group hover:border-cyan-500/20 transition-all shadow-sm">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 group-hover:scale-110 transition-transform">
                      <Sparkles size={28} />
                    </div>
                    <div className="text-dark-900 font-bold text-xl uppercase tracking-tight">{config.vision.card2Title}</div>
                    <p className="text-slate-500 text-base font-light leading-relaxed">{config.vision.card2Desc}</p>
                  </div>
                </div>
              </article>
              
              <div className="relative hidden lg:block overflow-hidden rounded-[3rem] aspect-square shadow-2xl">
                 <img 
                  src="/aesthetik.png" 
                  alt="Ästhetik trifft Wirtschaft - Viktor Labs" 
                  width="600"
                  height="600"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover hover:scale-105 transition-all duration-1000"
                  referrerPolicy="no-referrer"
                 />
                 <div className="absolute inset-0 bg-dark-900/10 hover:bg-transparent transition-all duration-700" />
              </div>
            </div>
          </div>
        </section>
      );
    }

    if (sectionId === 'expertise') {
      const getDynamicIcon = (id: string) => {
        const idLower = id.toLowerCase();
        if (idLower.includes('webdesign') || idLower.includes('website')) return Globe;
        if (idLower.includes('animation') || idLower.includes('3d')) return Sparkles;
        if (idLower.includes('management') || idLower.includes('verwaltung')) return Layout;
        if (idLower.includes('add-on') || idLower.includes('zusatz')) return Zap;
        return Zap;
      };

      const topServices = dbServices.slice(0, 3);
      const s1 = topServices[0];
      const s2 = topServices[1];
      const s3 = topServices[2];

      return (
        <section key="expertise" className="py-40 relative z-10 bg-slate-50 border-y border-slate-200 overflow-hidden">
          <div className="absolute inset-0 bg-grid-dark pointer-events-none opacity-40" />
          <div className="container mx-auto px-6 max-w-7xl relative z-10">
            <div className="text-center mb-24">
              <div className="text-cyan-600 font-black uppercase tracking-[0.4em] text-[10px] mb-6">
                {config.expertise.badge || 'Expertise'}
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-medium text-dark-900 leading-[0.92] tracking-tighter uppercase break-words">
                {config.expertise.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 grid-rows-2 gap-6 auto-rows-[400px]">
              <BentoCard 
                className="md:col-span-4 lg:col-span-4 row-span-2 !p-0 bg-dark-900 group border-none shadow-2xl overflow-hidden"
                to={s1 ? `/booking?serviceId=${s1.id}` : "/booking"}
              >
                <div className="relative h-full w-full flex flex-col">
                  <div className="p-12 pb-0 relative z-10">
                    <div className="text-cyan-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4">Core Craft</div>
                    <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-medium text-white mb-6 tracking-tight leading-none uppercase break-words">
                      {s1 ? getTranslatedText(s1.name, currentLang) : config.expertise.card1Title}
                    </h3>
                    <p className="text-slate-400 text-lg max-w-md font-light leading-relaxed">
                      {s1 ? getTranslatedText(s1.description, currentLang) : config.expertise.card1Desc}
                    </p>
                  </div>
                  <div className="mt-auto relative h-[400px]">
                     <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent z-10" />
                     <img 
                      src="/leistungen.png" 
                      alt="Web Design Showcase - Viktor Labs" 
                      width="800"
                      height="400"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-top opacity-60 group-hover:scale-105 group-hover:opacity-100 transition-all duration-1000"
                      referrerPolicy="no-referrer"
                     />
                  </div>
                </div>
              </BentoCard>

              <BentoCard 
                className="md:col-span-2 lg:col-span-2 shadow-lg"
                title={s2 ? getTranslatedText(s2.name, currentLang) : config.expertise.card2Title}
                subtitle={s2 ? getTranslatedText(s2.description, currentLang) : config.expertise.card2Desc}
                icon={s2 ? getDynamicIcon(s2.id) : Box}
                to={s2 ? `/booking?serviceId=${s2.id}` : "/booking"}
              />

              <BentoCard 
                className="md:col-span-2 lg:col-span-2 shadow-lg"
                title={s3 ? getTranslatedText(s3.name, currentLang) : config.expertise.card3Title}
                subtitle={s3 ? getTranslatedText(s3.description, currentLang) : config.expertise.card3Desc}
                icon={s3 ? getDynamicIcon(s3.id) : Zap}
                to={s3 ? `/booking?serviceId=${s3.id}` : "/booking"}
              />
            </div>
          </div>
        </section>
      );
    }

    if (sectionId === 'cta') {
      return (
        <section key="cta" className="py-40 relative z-10 bg-white overflow-hidden">
          <div className="absolute inset-0 bg-grid-dark pointer-events-none opacity-20" />
          <div className="container mx-auto px-6 max-w-5xl relative z-10">
            <div className="bg-dark-900 p-12 md:p-28 rounded-[4rem] text-center relative overflow-hidden group shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[150px] -translate-y-1/2 translate-x-1/2 group-hover:bg-cyan-500/20 transition-all duration-700" />
              
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-medium text-white mb-10 relative z-10 leading-[0.88] tracking-tighter uppercase break-words">
                {config.cta.title}
              </h2>
              <p className="text-slate-400 text-xl md:text-2xl max-w-2xl mx-auto mb-16 relative z-10 font-light leading-relaxed">
                {config.cta.subtitle}
              </p>
              <button 
                onClick={() => navigate('/booking')}
                className="h-20 px-16 rounded-full bg-cyan-500 text-white font-black uppercase tracking-[0.3em] text-[10px] hover:scale-105 active:scale-95 transition-all relative z-10 shadow-[0_20px_50px_rgba(0,123,255,0.5)] flex items-center justify-center mx-auto gap-4 group/cta"
              >
                {config.cta.btnText || 'Erstgespräch buchen'}
                <ArrowRight size={20} className="group-hover/cta:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>
      );
    }

    // Custom Section rendering
    if (sectionId.startsWith('custom_') && config.customSections[sectionId]) {
      const custom = config.customSections[sectionId];
      return (
        <section key={sectionId} className="py-32 relative z-10 bg-dark-950 border-b border-white/5 text-white">
          <div className="container mx-auto px-6 max-w-5xl text-center space-y-8">
            <h2 className="text-3xl md:text-6xl font-display font-medium tracking-tight uppercase text-cyan-400">
              {custom.title}
            </h2>
            {custom.subtitle && (
              <p className="text-xl md:text-2xl text-slate-300 font-light max-w-2xl mx-auto">
                {custom.subtitle}
              </p>
            )}
            <div className="text-slate-400 text-base md:text-lg leading-relaxed max-w-3xl mx-auto whitespace-pre-line font-light">
              {custom.content}
            </div>
            {custom.btnText && (
              <div className="pt-6">
                <button 
                  onClick={() => navigate('/booking')}
                  className="h-14 px-10 rounded-full bg-cyan-500 text-dark-950 font-black uppercase tracking-[0.2em] text-xs hover:scale-105 active:scale-95 transition-all shadow-lg shadow-cyan-500/20 inline-flex items-center gap-3"
                >
                  {custom.btnText}
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </section>
      );
    }

    return null;
  };

  return (
    <div ref={containerRef} className="relative bg-white overflow-hidden">
      <SEO 
        title="Home"
        description="High-End Webdesign, 3D Animationen & digitale Performance-Architektur von Viktor Labs. Wir definieren die Zukunft des Web neu."
      />
      {visibleSections.map(section => renderSection(section.id))}

      {/* Floating Action Button */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-10 right-10 z-[100] hidden lg:block"
      >
        <button 
          onClick={() => navigate('/booking')}
          aria-label="Erstgespräch buchen"
          className="h-20 w-20 rounded-full bg-cyan-500 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all group"
        >
          <ArrowRight size={24} className="-rotate-45 group-hover:rotate-0 transition-transform duration-500" />
        </button>
      </motion.div>
    </div>
  );
}
