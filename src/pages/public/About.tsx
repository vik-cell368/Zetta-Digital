import React from 'react';
import { motion } from 'motion/react';
import { Target, Eye, Cpu, Zap } from 'lucide-react';

import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center space-x-2 text-neon-500 mb-6 font-mono text-[10px] uppercase tracking-[0.3em]">
            <span>{t('nav.about')}</span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif text-white mb-8 sm:mb-12 tracking-tight italic">
            {t('about.title')}
          </h1>
          <p className="text-xl sm:text-2xl text-gray-400 font-light leading-relaxed mb-16 sm:mb-20">
            {t('about.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-24 mb-20 sm:mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-4 mb-6 sm:mb-8">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/5 rounded-2xl flex items-center justify-center text-neon-500">
                <Target className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif text-white italic tracking-tight">{t('about.mission_title')}</h3>
            </div>
            <p className="text-gray-400 font-light leading-relaxed text-base sm:text-lg">
              {t('about.mission_desc')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-4 mb-6 sm:mb-8">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/5 rounded-2xl flex items-center justify-center text-neon-500">
                <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif text-white italic tracking-tight">{t('about.vision_title')}</h3>
            </div>
            <p className="text-gray-400 font-light leading-relaxed text-base sm:text-lg">
              {t('about.vision_desc')}
            </p>
          </motion.div>
        </div>

        <div className="bg-dark-900/40 backdrop-blur-md border border-white/5 rounded-3xl md:rounded-[3rem] p-8 sm:p-16 mb-20 sm:mb-32">
          <h2 className="text-3xl sm:text-4xl font-serif text-white mb-10 sm:mb-16 italic tracking-tight text-center">
            {t('about.why_title')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12">
            {[
              { icon: Cpu, title: t('home.val_eng_title'), desc: t('home.val_eng_desc') },
              { icon: Zap, title: t('home.val_ai_title'), desc: t('home.val_ai_desc') },
              { icon: Target, title: t('home.val_growth_title'), desc: t('home.val_growth_desc') },
              { icon: Eye, title: t('home.phase3_title'), desc: t('home.phase3_desc') }
            ].map(item => (
              <div key={item.title} className="text-center sm:text-left">
                <item.icon className="w-8 h-8 text-neon-500 mb-6 mx-auto sm:mx-0" />
                <h4 className="text-xl font-serif text-white mb-4 italic">{item.title}</h4>
                <p className="text-gray-500 text-sm font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center px-4">
          <h3 className="text-[10px] font-mono text-neon-500 uppercase tracking-[0.3em] mb-12">Unsere Technologien</h3>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="text-xl sm:text-2xl font-bold text-white tracking-widest font-serif">GOOGLE GEMINI</span>
            <span className="text-xl sm:text-2xl font-bold text-white tracking-widest font-serif">REACT</span>
            <span className="text-xl sm:text-2xl font-bold text-white tracking-widest font-serif">NEXT.JS</span>
            <span className="text-xl sm:text-2xl font-bold text-white tracking-widest font-serif">NODE.JS</span>
            <span className="text-xl sm:text-2xl font-bold text-white tracking-widest font-serif">PYTHON</span>
          </div>
        </div>
      </div>
    </div>
  );
}
