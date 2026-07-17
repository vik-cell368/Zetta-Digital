import { useState, useEffect } from 'react';
import { motion, useScroll } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Monitor, ShoppingBag, Zap, Code } from 'lucide-react';
import Experience3D from "@/components/Experience3D";
import { Button } from "@/components/ui/Button";
import { supabase } from '@/lib/supabase';
import { getTranslatedText } from '@/lib/utils';

export default function Home() {
  const { t, i18n } = useTranslation();
  const [scrollOffset, setScrollOffset] = useState(0);
  
  // Use motion's useScroll for smooth tracking
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setScrollOffset(latest);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    async function fetchServices() {
      try {
        const { data } = await supabase.from('services').select('*').eq('is_active', true).order('created_at', { ascending: false });
        if (data && data.length > 0) {
          setServices(data);
        } else {
          // Fallback to local storage or defaults
          const localData = localStorage.getItem('zetta_services');
          if (localData) {
            setServices(JSON.parse(localData).filter((s: any) => s.is_active));
          } else {
            setServices([
              {
                id: '1',
                icon: <Monitor className="w-8 h-8" />,
                name: JSON.stringify({ en: 'Website Development', de: 'Webentwicklung' }),
                description: JSON.stringify({ en: 'Modern tech stacks, lightning fast performance.', de: 'Moderne Tech-Stacks, blitzschnelle Performance.' }),
              },
              {
                id: '2',
                icon: <ShoppingBag className="w-8 h-8" />,
                name: JSON.stringify({ en: 'Online Shops', de: 'Online-Shops' }),
                description: JSON.stringify({ en: 'Optimized for conversion and growth.', de: 'Optimiert für Konversion und Wachstum.' }),
              },
              {
                id: '3',
                icon: <Zap className="w-8 h-8" />,
                name: JSON.stringify({ en: 'Workflow Automation', de: 'Workflow-Automatisierung' }),
                description: JSON.stringify({ en: 'Streamline processes with intelligent tools.', de: 'Optimieren Sie Abläufe mit intelligenten Tools.' }),
              },
              {
                id: '4',
                icon: <Code className="w-8 h-8" />,
                name: JSON.stringify({ en: 'Custom Solutions', de: 'Individuelle Lösungen' }),
                description: JSON.stringify({ en: 'Interfaces that fascinate.', de: 'Interfaces, die faszinieren.' }),
              }
            ]);
          }
        }
      } catch (e) {
        console.warn("Home services fetch failed", e);
      }
    }
    fetchServices();
  }, []);

  const getServiceIcon = (index: number) => {
    const icons = [<Monitor key="m" />, <ShoppingBag key="s" />, <Zap key="z" />, <Code key="c" />];
    return icons[index % icons.length];
  };

  return (
    <div className="bg-dark-950 min-h-screen relative overflow-x-hidden">
      <Experience3D offset={scrollOffset} />
      
      <div className="relative z-10" role="main">
        {/* Act 1: Hero */}
        <section className="h-screen flex items-center justify-center" aria-labelledby="hero-title">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="text-center px-6"
          >
            <h1 id="hero-title" className="text-6xl md:text-8xl lg:text-[10rem] font-display font-medium text-white tracking-tighter mb-4 leading-none">
              ZETTA<span className="text-neon-400">.</span>
            </h1>
            <p className="text-neon-400 font-mono tracking-[0.4em] md:tracking-[0.6em] uppercase text-[10px] md:text-xs opacity-80">
              {t('home.about_title')} {t('home.about_subtitle')}
            </p>
          </motion.div>
        </section>

        {/* Act 2: AI Agents */}
        <section id="services-ai" className="min-h-screen flex items-center justify-center py-20" aria-labelledby="phase2-title">
          <div className="container mx-auto px-6 max-w-6xl">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: false, margin: "-20%" }}
              className="text-left"
            >
              <span className="font-mono text-neon-400 text-xs uppercase tracking-[0.4em] mb-4 block">
                {t('home.phase2_label', 'Automation')}
              </span>
              <h2 id="phase2-title" className="text-5xl md:text-8xl font-display font-medium text-white mb-8 leading-[1] tracking-tighter max-w-4xl">
                {t('home.phase2_title', 'AI Agents: Your sales team, 24/7.')}
              </h2>
              <p className="text-lg md:text-xl text-gray-400 font-light max-w-2xl leading-relaxed">
                {t('home.phase2_desc', 'Automate your success with intelligent systems that think, learn, and scale for you.')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Act 3: Architecture */}
        <section id="architecture" className="min-h-screen flex items-center justify-center py-20" aria-labelledby="phase3-title">
          <div className="container mx-auto px-6 max-w-6xl">
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: false, margin: "-20%" }}
              className="text-right ml-auto"
            >
              <span className="font-mono text-neon-400 text-xs uppercase tracking-[0.4em] mb-4 block">
                {t('home.phase3_label', 'Craftsmanship')}
              </span>
              <h2 id="phase3-title" className="text-5xl md:text-8xl font-display font-medium text-white mb-8 leading-[1] tracking-tighter max-w-4xl ml-auto">
                {t('home.phase3_title', 'Digital Architecture.')}
              </h2>
              <p className="text-lg md:text-xl text-gray-400 font-light max-w-2xl ml-auto leading-relaxed">
                {t('home.phase3_desc', 'We build interfaces that fascinate. Design meets uncompromising performance.')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services Grid Section */}
        <section id="services" className="min-h-screen flex items-center justify-center py-32 bg-black/40 backdrop-blur-sm" aria-labelledby="services-grid-title">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-24">
              <motion.span 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="font-mono text-neon-400 text-xs uppercase tracking-[0.4em] mb-4 block"
              >
                {t('home.expertise', 'Expertise')}
              </motion.span>
              <motion.h2 
                id="services-grid-title"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-7xl font-display font-medium text-white tracking-tighter"
              >
                {t('home.srv_title', 'Unsere Leistungen')}
              </motion.h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => (
                <motion.div
                  key={service.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative p-8 rounded-3xl bg-dark-900/50 border border-white/5 hover:border-neon-400/50 transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-neon-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative z-10">
                    <div className="text-neon-400 mb-6 group-hover:scale-110 transition-transform duration-500">
                      {service.icon || getServiceIcon(index)}
                    </div>
                    <h3 className="text-xl font-display font-medium text-white mb-4 tracking-tight">
                      {typeof service.name === 'string' ? getTranslatedText(service.name, i18n.language) : service.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed font-light">
                      {typeof service.description === 'string' ? getTranslatedText(service.description, i18n.language) : service.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Act 4: CTA */}
        <section className="h-screen flex items-center justify-center py-20" aria-labelledby="phase4-title">
          <div className="text-center px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: false }}
            >
              <h2 id="phase4-title" className="text-5xl md:text-8xl font-display font-medium text-white mb-12 tracking-tighter leading-none">
                {t('home.phase4_title', 'Ready for the next level?')}
              </h2>
              <Button 
                size="lg"
                onClick={() => window.location.assign('/booking')}
                aria-label={t('home.phase4_btn', 'Request Concept')}
                className="h-20 md:h-24 px-12 md:px-20 rounded-full bg-white text-black font-bold tracking-[0.2em] uppercase text-lg md:text-xl transition-all hover:scale-105 shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:bg-neon-400 hover:text-white"
              >
                {t('home.phase4_btn', 'Request Concept')}
              </Button>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
