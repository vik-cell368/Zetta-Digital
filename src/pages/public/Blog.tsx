import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

const posts = [
  {
    title: 'Was ist KI-Automatisierung?',
    excerpt: 'Ein tiefer Einblick in die Welt der automatisierten Prozesse und wie sie Ihr Unternehmen verändern können.',
    date: '15. Juli 2026',
    readTime: '5 Min. Lesezeit',
    category: 'KI & Automation',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800'
  },
  {
    title: 'Die Vorteile von KI-Chatbots für KMU',
    excerpt: 'Warum kleine und mittlere Unternehmen jetzt auf intelligente Assistenten setzen sollten.',
    date: '10. Juli 2026',
    readTime: '4 Min. Lesezeit',
    category: 'Chatbots',
    image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd05a?auto=format&fit=crop&q=80&w=800'
  },
  {
    title: 'Modernes Webdesign im Jahr 2026',
    excerpt: 'Geschwindigkeit, Ästhetik und KI-Integration: Das macht eine moderne Website heute aus.',
    date: '02. Juli 2026',
    readTime: '6 Min. Lesezeit',
    category: 'Webdesign',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'
  }
];

export default function Blog() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-24"
        >
          <h1 className="text-6xl md:text-8xl font-serif text-white mb-8 tracking-tight italic">Wissensbereich</h1>
          <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
            Einblicke, Ressourcen und Neuigkeiten aus der Welt von KI, Design und digitaler Automatisierung.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {posts.map((post, index) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] bg-dark-900 mb-8">
                <img 
                  src={post.image} 
                  alt={post.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-700"
                />
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-1 bg-neon-500 rounded-full text-[10px] font-mono font-bold text-dark-950 uppercase tracking-widest">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-gray-500 text-[10px] font-mono uppercase tracking-[0.2em] mb-4">
                <div className="flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-2" />
                  {post.date}
                </div>
                <div className="flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-2" />
                  {post.readTime}
                </div>
              </div>

              <h3 className="text-2xl font-serif text-white mb-4 italic tracking-tight group-hover:text-neon-400 transition-colors leading-snug">
                {post.title}
              </h3>
              
              <p className="text-gray-400 font-light leading-relaxed mb-8 line-clamp-2">
                {post.excerpt}
              </p>

              <div className="flex items-center text-neon-500 font-mono text-xs uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform">
                Weiterlesen
                <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-32 bg-white/5 border border-white/5 rounded-[3rem] p-12 flex flex-col md:flex-row items-center justify-between"
        >
          <div className="mb-8 md:mb-0 max-w-md">
            <h3 className="text-2xl font-serif text-white mb-2 italic">Bleiben Sie informiert</h3>
            <p className="text-gray-400 font-light text-sm">Erhalten Sie die neuesten Einblicke in KI und Automatisierung direkt in Ihr Postfach.</p>
          </div>
          <div className="flex w-full md:w-auto space-x-4">
            <input 
              type="email" 
              placeholder="Ihre E-Mail"
              className="bg-dark-900 border border-white/10 rounded-full px-8 py-4 text-white focus:outline-none focus:border-neon-500/50 flex-grow"
            />
            <button className="bg-neon-500 text-dark-950 px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform">
              Anmelden
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
