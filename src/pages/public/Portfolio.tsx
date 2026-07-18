import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, ArrowRight } from 'lucide-react';

import { useTranslation } from 'react-i18next';

export default function Portfolio() {
  const { t } = useTranslation();

  const projects = t('portfolio.projects', { returnObjects: true }) as any[] || [];

  // Default images for projects since they aren't in JSON
  const projectImages = [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1531746790731-6c087fecd05a?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800'
  ];

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
            {t('portfolio.title')}
          </h1>
          <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
            {t('portfolio.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {Array.isArray(projects) && projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-[2.5rem] bg-dark-900 border border-white/5 mb-8">
                <img 
                  src={project.image || projectImages[index % projectImages.length]} 
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(project.tags) && project.tags.map((tag: string) => (
                      <span key={tag} className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-mono text-white uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                    {!project.tags && ['Tech', 'Design', 'AI'].map(tag => (
                      <span key={tag} className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-mono text-white uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-neon-500 font-mono text-[10px] uppercase tracking-[0.3em] font-medium">
                    {project.category}
                  </span>
                  <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-neon-500 transition-colors" />
                </div>
                
                <h3 className="text-3xl font-serif text-white mb-4 italic tracking-tight group-hover:text-neon-400 transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-gray-400 font-light leading-relaxed mb-6">
                  {project.desc}
                </p>

                <div className="p-6 bg-white/5 border border-white/5 rounded-2xl">
                  <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">Ergebnis</div>
                  <div className="text-white font-medium">{project.result}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-32 p-16 bg-dark-900/40 border border-white/5 rounded-[3rem] text-center"
        >
          <h3 className="text-4xl font-serif text-white mb-6 italic tracking-tight">
            {t('portfolio.cta_title')}
          </h3>
          <p className="text-gray-400 font-light mb-12 max-w-xl mx-auto leading-relaxed text-lg">
            {t('portfolio.cta_desc')}
          </p>
          <a href="/booking" className="inline-flex items-center group px-12 py-6 bg-neon-500 text-dark-950 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl shadow-neon-500/10">
            {t('home.phase4_btn')}
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </div>
  );
}
