import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, ArrowRight } from 'lucide-react';

import { useTranslation } from 'react-i18next';

export default function Portfolio() {
  const { t } = useTranslation();
  const [projects, setProjects] = React.useState<any[]>([]);

  React.useEffect(() => {
    const saved = localStorage.getItem('zetta_portfolio');
    if (saved) {
      const parsed = JSON.parse(saved);
      setProjects(parsed.map((p: any) => ({
        ...p,
        tags: Array.isArray(p.tags) ? p.tags : (p.tags || '').split(',').map((t: string) => t.trim()).filter(Boolean)
      })));
    } else {
      setProjects(t('portfolio.projects', { returnObjects: true }) as any[] || []);
    }
  }, [t]);

  // Default images for projects since they aren't in JSON
  const projectImages = [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=60&w=600',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=60&w=600',
    'https://images.unsplash.com/photo-1531746790731-6c087fecd05a?auto=format&fit=crop&q=60&w=600',
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=60&w=600'
  ];

  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 sm:mb-24"
        >
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif text-white mb-6 sm:mb-8 tracking-tight italic">
            {t('portfolio.title')}
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
            {t('portfolio.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16">
          {Array.isArray(projects) && projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-3xl md:rounded-[2.5rem] bg-dark-900 border border-white/5 mb-6 sm:mb-8">
                <img 
                  src={project.image || projectImages[index % projectImages.length]} 
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 to-transparent" />
                <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 right-6 sm:right-8">
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

              <div className="px-2 sm:px-4">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <span className="text-neon-500 font-mono text-[10px] uppercase tracking-[0.3em] font-medium">
                    {project.category}
                  </span>
                  <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-neon-500 transition-colors" />
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-serif text-white mb-3 sm:mb-4 italic tracking-tight group-hover:text-neon-400 transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-sm sm:text-base text-gray-400 font-light leading-relaxed mb-6">
                  {project.desc}
                </p>

                <div className="p-4 sm:p-6 bg-white/5 border border-white/5 rounded-2xl">
                  <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">Ergebnis</div>
                  <div className="text-white text-sm sm:text-base font-medium">{project.result}</div>
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
          className="mt-24 sm:mt-32 p-8 sm:p-16 bg-dark-900/40 border border-white/5 rounded-3xl md:rounded-[3rem] text-center"
        >
          <h3 className="text-3xl sm:text-4xl font-serif text-white mb-4 sm:mb-6 italic tracking-tight leading-tight">
            {t('portfolio.cta_title')}
          </h3>
          <p className="text-gray-400 font-light mb-10 sm:mb-12 max-w-xl mx-auto leading-relaxed text-base sm:text-lg">
            {t('portfolio.cta_desc')}
          </p>
          <a href="/booking" className="w-full sm:w-auto inline-flex items-center justify-center group px-10 py-5 bg-neon-500 text-dark-950 rounded-full font-bold text-base sm:text-lg hover:scale-105 transition-transform shadow-xl shadow-neon-500/10">
            {t('home.phase4_btn')}
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </div>
  );
}
