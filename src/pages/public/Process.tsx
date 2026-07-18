import React from 'react';
import { motion } from 'motion/react';
import { Coffee, MessageCircle, PenTool, Code2, Rocket, HeartHandshake } from 'lucide-react';

import { useTranslation } from 'react-i18next';

export default function Process() {
  const { t } = useTranslation();

  const stepsList = t('process.steps', { returnObjects: true }) as any[] || [];

  const icons = [Coffee, MessageCircle, PenTool, Code2, Rocket, HeartHandshake];

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-24"
        >
          <h1 className="text-6xl md:text-8xl font-serif text-white mb-8 tracking-tight italic">
            {t('process.title')}
          </h1>
          <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
            {t('process.subtitle')}
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical line for desktop */}
          <div className="absolute left-[50%] top-0 bottom-0 w-px bg-white/5 hidden md:block" />

          <div className="space-y-24">
            {Array.isArray(stepsList) && stepsList.map((step, index) => {
              const Icon = icons[index % icons.length];
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className={`flex flex-col md:flex-row items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  {/* Content */}
                  <div className={`flex-1 w-full ${isEven ? 'md:text-right md:pr-20' : 'md:text-left md:pl-20'}`}>
                    <div className={`inline-flex items-center space-x-2 text-neon-500 mb-4 font-mono text-[10px] uppercase tracking-[0.3em] ${isEven ? 'md:flex-row-reverse md:space-x-reverse' : ''}`}>
                      <span>Dauer: {step.duration}</span>
                    </div>
                    <h3 className="text-3xl font-serif text-white mb-4 italic tracking-tight">{step.title}</h3>
                    <p className="text-gray-400 font-light leading-relaxed max-w-md mx-auto md:mx-0 inline-block">
                      {step.desc}
                    </p>
                  </div>

                  {/* Icon Node */}
                  <div className="relative z-10 my-8 md:my-0">
                    <div className="w-20 h-20 rounded-[2rem] bg-dark-900 border border-white/10 flex items-center justify-center text-neon-500 shadow-xl group hover:border-neon-500/50 transition-colors">
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-neon-500/5 rounded-full blur-2xl pointer-events-none" />
                  </div>

                  {/* Spacer */}
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-32 p-12 bg-dark-900/40 border border-white/5 rounded-[3rem] text-center max-w-3xl mx-auto"
        >
          <h3 className="text-3xl font-serif text-white mb-6 italic tracking-tight">
            {t('process.cta_title')}
          </h3>
          <p className="text-gray-400 font-light mb-10 leading-relaxed">
            {t('process.cta_desc')}
          </p>
          <a href="/booking" className="inline-flex items-center px-10 py-5 bg-neon-500 text-dark-950 rounded-full font-medium hover:scale-105 transition-transform">
            {t('home.phase4_btn')}
          </a>
        </motion.div>
      </div>
    </div>
  );
}
