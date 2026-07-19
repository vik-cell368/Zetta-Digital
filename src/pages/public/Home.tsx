import { useState, useEffect, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Monitor, ShoppingBag, Zap, Code } from 'lucide-react';
import { Button } from "@/components/ui/Button";
import { supabase } from '@/lib/supabase';
import { getTranslatedText } from '@/lib/utils';

export default function Home() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language.split('-')[0] || 'de';
  
  const [servicesList, setServicesList] = useState<any[]>([]);

  useEffect(() => {
    async function fetchServices() {
      try {
        const { data, error } = await supabase.from('services').select('*').eq('is_active', true).limit(4);
        if (error) throw error;
        if (data && data.length > 0) {
          setServicesList(data.map(s => ({
            id: s.id,
            title: getTranslatedText(s.name, currentLang),
            desc: getTranslatedText(s.description, currentLang)
          })));
          return;
        }
      } catch (err) {
        console.warn("Home fetch failed:", err);
      }
      
      const local = localStorage.getItem('zetta_services');
      if (local) {
        const parsed = JSON.parse(local);
        if (parsed.length > 0) {
          setServicesList(parsed.filter((s: any) => s.is_active).map((s: any) => ({
            id: s.id,
            title: getTranslatedText(s.name, currentLang),
            desc: getTranslatedText(s.description, currentLang)
          })));
          return;
        }
      }
      
      setServicesList(t('services.list', { returnObjects: true }) as any[] || []);
    }
    fetchServices();
  }, [t, currentLang]);

  const getServiceIcon = (index: number) => {
    const icons = [<Monitor key="m" />, <ShoppingBag key="s" />, <Zap key="z" />, <Code key="c" />];
    return icons[index % icons.length];
  };

  return (
    <div className="bg-dark-950 min-h-screen relative overflow-x-hidden">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-black">
        Skip to content
      </a>
      
      <div id="main-content" className="relative z-10" role="main">
        {/* Act 1: Hero */}
        <section className="h-screen flex items-center justify-center relative" aria-labelledby="hero-title">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="text-center px-4"
          >
            <h1 id="hero-title" className="text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-display font-medium text-white tracking-tighter mb-6 leading-none">
              ZETTA<span className="text-neon-400">.</span>
            </h1>
            <p className="text-neon-400 font-mono tracking-[0.2em] sm:tracking-[0.4em] md:tracking-[0.6em] uppercase text-[9px] sm:text-[10px] md:text-xs opacity-80 max-w-[280px] sm:max-w-none mx-auto leading-relaxed">
              {t('home.about_title')} {t('home.about_subtitle')}
            </p>
          </motion.div>
        </section>

        {/* Act 2: AI Agents */}
        <section id="services-ai" className="min-h-[70vh] sm:min-h-screen flex items-center justify-center py-16 sm:py-20" aria-labelledby="phase2-title">
          <div className="container mx-auto px-6 max-w-6xl">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: false, margin: "-10%" }}
              className="text-left"
            >
              <span className="font-mono text-neon-400 text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] mb-4 block">
                {t('home.phase2_label')}
              </span>
              <h2 id="phase2-title" className="text-4xl sm:text-6xl md:text-8xl font-display font-medium text-white mb-6 sm:mb-8 leading-[1.1] sm:leading-[1] tracking-tighter max-w-4xl">
                {t('home.phase2_title')}
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-400 font-light max-w-2xl leading-relaxed">
                {t('home.phase2_desc')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Act 3: Architecture */}
        <section id="architecture" className="min-h-[70vh] sm:min-h-screen flex items-center justify-center py-16 sm:py-20" aria-labelledby="phase3-title">
          <div className="container mx-auto px-6 max-w-6xl">
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: false, margin: "-10%" }}
              className="text-right ml-auto"
            >
              <span className="font-mono text-neon-400 text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] mb-4 block">
                {t('home.phase3_label')}
              </span>
              <h2 id="phase3-title" className="text-4xl sm:text-6xl md:text-8xl font-display font-medium text-white mb-6 sm:mb-8 leading-[1.1] sm:leading-[1] tracking-tighter max-w-4xl ml-auto">
                {t('home.phase3_title')}
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-400 font-light max-w-2xl ml-auto leading-relaxed">
                {t('home.phase3_desc')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services Grid Section */}
        <section id="services" className="min-h-screen flex items-center justify-center py-20 sm:py-32 bg-black/40 backdrop-blur-sm" aria-labelledby="services-grid-title">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-16 sm:mb-24">
              <motion.span 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="font-mono text-neon-400 text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] mb-4 block"
              >
                {t('home.expertise')}
              </motion.span>
              <motion.h2 
                id="services-grid-title"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-3xl sm:text-5xl md:text-7xl font-display font-medium text-white tracking-tighter"
              >
                {t('home.srv_title')}
              </motion.h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
              {Array.isArray(servicesList) && servicesList.slice(0, 3).map((service, index) => (
                <motion.div
                  key={service.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  <Link to={`/services/${service.id || index}`} className="block p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-dark-900/50 border border-white/5 hover:border-neon-400/50 transition-all duration-500 overflow-hidden h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-neon-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="relative z-10">
                      <div className="text-neon-400 mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-500">
                        {getServiceIcon(index)}
                      </div>
                      <h3 className="text-lg sm:text-xl font-display font-medium text-white mb-3 sm:mb-4 tracking-tight">
                        {service.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed font-light">
                        {service.desc}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Act 4: CTA */}
        <section className="h-[80vh] sm:h-screen flex items-center justify-center py-20" aria-labelledby="phase4-title">
          <div className="text-center px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: false }}
            >
              <h2 id="phase4-title" className="text-4xl sm:text-6xl md:text-8xl font-display font-medium text-white mb-10 sm:mb-12 tracking-tighter leading-[1.1] sm:leading-none">
                {t('home.phase4_title')}
              </h2>
              <Button 
                size="lg"
                onClick={() => window.location.assign('/booking')}
                aria-label={t('home.phase4_btn')}
                className="h-16 sm:h-20 md:h-24 px-10 sm:px-16 md:px-20 rounded-full bg-white text-black font-bold tracking-[0.1em] uppercase text-sm sm:text-base md:text-xl transition-all hover:scale-105 shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:bg-neon-400 hover:text-white"
              >
                {t('home.phase4_btn')}
              </Button>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
