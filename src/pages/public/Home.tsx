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
  
  const servicesList = t('services.list', { returnObjects: true }) as any[] || [];

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
                {t('home.phase2_label')}
              </span>
              <h2 id="phase2-title" className="text-5xl md:text-8xl font-display font-medium text-white mb-8 leading-[1] tracking-tighter max-w-4xl">
                {t('home.phase2_title')}
              </h2>
              <p className="text-lg md:text-xl text-gray-400 font-light max-w-2xl leading-relaxed">
                {t('home.phase2_desc')}
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
                {t('home.phase3_label')}
              </span>
              <h2 id="phase3-title" className="text-5xl md:text-8xl font-display font-medium text-white mb-8 leading-[1] tracking-tighter max-w-4xl ml-auto">
                {t('home.phase3_title')}
              </h2>
              <p className="text-lg md:text-xl text-gray-400 font-light max-w-2xl ml-auto leading-relaxed">
                {t('home.phase3_desc')}
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
                {t('home.expertise')}
              </motion.span>
              <motion.h2 
                id="services-grid-title"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-7xl font-display font-medium text-white tracking-tighter"
              >
                {t('home.srv_title')}
              </motion.h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {Array.isArray(servicesList) && servicesList.slice(0, 3).map((service, index) => (
                <motion.div
                  key={service.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  <Link to={`/services/${service.id || index}`} className="block p-8 rounded-3xl bg-dark-900/50 border border-white/5 hover:border-neon-400/50 transition-all duration-500 overflow-hidden h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-neon-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="relative z-10">
                      <div className="text-neon-400 mb-6 group-hover:scale-110 transition-transform duration-500">
                        {getServiceIcon(index)}
                      </div>
                      <h3 className="text-xl font-display font-medium text-white mb-4 tracking-tight">
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
        <section className="h-screen flex items-center justify-center py-20" aria-labelledby="phase4-title">
          <div className="text-center px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: false }}
            >
              <h2 id="phase4-title" className="text-5xl md:text-8xl font-display font-medium text-white mb-12 tracking-tighter leading-none">
                {t('home.phase4_title')}
              </h2>
              <Button 
                size="lg"
                onClick={() => window.location.assign('/booking')}
                aria-label={t('home.phase4_btn')}
                className="h-20 md:h-24 px-12 md:px-20 rounded-full bg-white text-black font-bold tracking-[0.1em] uppercase text-lg md:text-xl transition-all hover:scale-105 shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:bg-neon-400 hover:text-white"
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
