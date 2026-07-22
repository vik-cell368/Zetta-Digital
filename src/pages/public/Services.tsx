import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { Service } from '@/lib/types';
import { getTranslatedText } from '@/lib/utils';
import { 
  Globe, 
  Bot, 
  Zap, 
  Cpu, 
  ArrowRight, 
  CheckCircle2, 
  MessageSquare, 
  Layout, 
  LineChart 
} from 'lucide-react';

export default function Services() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language.split('-')[0] || 'en';
  
  const [dbServices, setDbServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('is_active', true);
        if (error) throw error;
        if (data) setDbServices(data);
      } catch (err) {
        console.warn("Failed to fetch services from Supabase, checking localStorage:", err);
        const localData = localStorage.getItem('zetta_services');
        if (localData) {
          const parsed = JSON.parse(localData);
          setDbServices(parsed.filter((s: any) => s.is_active));
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchServices();
  }, []);

  const getServiceIcon = (id: string, index: number) => {
    const icons = [Globe, Zap, MessageSquare, Cpu, Bot, Layout, LineChart];
    if (id === 'webdesign') return Globe;
    if (id === 'ai-automation') return Zap;
    if (id === 'ai-chatbots') return MessageSquare;
    if (id === 'workflow-automation') return Cpu;
    return icons[index % icons.length];
  };

  const servicesData = {
    'webdesign': {
      id: 'webdesign',
      title: t('services.webdesign.title'),
      description: t('services.webdesign.description'),
      features: t('services.webdesign.features', { returnObjects: true }) as string[],
      process: t('services.webdesign.process', { returnObjects: true }) as string[],
      tech: t('services.webdesign.tech', { returnObjects: true }) as string[],
      faq: [
        { q: t('services.webdesign.faq_q1'), a: t('services.webdesign.faq_a1') },
        { q: t('services.webdesign.faq_q2'), a: t('services.webdesign.faq_a2') }
      ]
    },
    'ai-automation': {
      id: 'ai-automation',
      title: t('services.ai_automation.title'),
      description: t('services.ai_automation.description'),
      features: t('services.ai_automation.features', { returnObjects: true }) as string[],
      process: t('services.ai_automation.process', { returnObjects: true }) as string[],
      tech: t('services.ai_automation.tech', { returnObjects: true }) as string[],
      faq: [
        { q: t('services.ai_automation.faq_q1'), a: t('services.ai_automation.faq_a1') }
      ]
    },
    'ai-chatbots': {
      id: 'ai-chatbots',
      title: t('services.ai_chatbots.title'),
      description: t('services.ai_chatbots.description'),
      features: t('services.ai_chatbots.features', { returnObjects: true }) as string[],
      process: t('services.ai_chatbots.process', { returnObjects: true }) as string[],
      tech: t('services.ai_chatbots.tech', { returnObjects: true }) as string[],
      faq: [
        { q: t('services.ai_chatbots.faq_q1'), a: t('services.ai_chatbots.faq_a1') }
      ]
    },
    'workflow-automation': {
      id: 'workflow-automation',
      title: t('services.workflow_automation.title'),
      description: t('services.workflow_automation.description'),
      features: t('services.workflow_automation.features', { returnObjects: true }) as string[],
      process: t('services.workflow_automation.process', { returnObjects: true }) as string[],
      tech: t('services.workflow_automation.tech', { returnObjects: true }) as string[],
      faq: [
        { q: t('services.workflow_automation.faq_q1'), a: t('services.workflow_automation.faq_a1') }
      ]
    }
  };

  const displayServices = React.useMemo(() => {
    // If no DB services, return defaults
    if (!dbServices || dbServices.length === 0) {
      return Object.values(servicesData).map((s, i) => ({
        ...s,
        icon: getServiceIcon(s.id, i)
      }));
    }

    // Merge DB services with hardcoded ones
    const finalServices = Object.values(servicesData).map((fallback, i) => {
      const dbService = dbServices.find(s => s.id === fallback.id);
      if (!dbService) return { ...fallback, icon: getServiceIcon(fallback.id, i) };

      const featuresRaw = getTranslatedText(dbService.features || '', currentLang);
      const processRaw = getTranslatedText(dbService.process || '', currentLang);
      const faqsRaw = getTranslatedText(dbService.faqs || '', currentLang);

      return {
        id: dbService.id,
        title: getTranslatedText(dbService.name, currentLang) || fallback.title,
        description: getTranslatedText(dbService.description, currentLang) || fallback.description,
        features: featuresRaw ? featuresRaw.split('\n').filter(Boolean) : fallback.features,
        process: processRaw ? processRaw.split('\n').filter(Boolean) : fallback.process,
        tech: dbService.tech ? dbService.tech.split(',').map(t => t.trim()) : fallback.tech,
        faq: faqsRaw ? faqsRaw.split('\n').filter(Boolean).map(line => {
          const [q, a] = line.split('|');
          return { q: q?.trim(), a: a?.trim() };
        }).filter(item => item.q && item.a) : fallback.faq,
        icon: getServiceIcon(dbService.id, i)
      };
    });

    // Add extra services from DB
    const extraServices = dbServices
      .filter(s => !servicesData[s.id as keyof typeof servicesData])
      .map((s, i) => {
        const featuresRaw = getTranslatedText(s.features || '', currentLang);
        const processRaw = getTranslatedText(s.process || '', currentLang);
        const faqsRaw = getTranslatedText(s.faqs || '', currentLang);

        return {
          id: s.id,
          title: getTranslatedText(s.name, currentLang),
          description: getTranslatedText(s.description, currentLang),
          features: featuresRaw ? featuresRaw.split('\n').filter(Boolean) : [],
          process: processRaw ? processRaw.split('\n').filter(Boolean) : [],
          tech: s.tech ? s.tech.split(',').map(t => t.trim()) : [],
          faq: faqsRaw ? faqsRaw.split('\n').filter(Boolean).map(line => {
            const [q, a] = line.split('|');
            return { q: q?.trim(), a: a?.trim() };
          }).filter(item => item.q && item.a) : [],
          icon: getServiceIcon(s.id, i + Object.keys(servicesData).length)
        };
      });

    return [...finalServices, ...extraServices];
  }, [dbServices, currentLang, i18n.language]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <div className="w-12 h-12 border-4 border-neon-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (slug) {
    const service = displayServices.find(s => s.id === slug);
    if (service) {
      const Icon = service.icon;

      return (
        <div className="min-h-screen pt-32 pb-20 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center space-x-2 text-neon-500 mb-6">
                <Icon className="w-6 h-6" />
                <span className="text-xs font-mono uppercase tracking-[0.3em] font-medium">Service Detail</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif text-white mb-8 tracking-tight italic">
                {service.title}
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-400 font-light leading-relaxed mb-12 sm:mb-16 max-w-2xl">
                {service.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16 mb-16 sm:mb-20">
                <div>
                  <h3 className="text-lg sm:text-xl font-medium text-white mb-6 sm:mb-8 border-b border-white/10 pb-4">Hauptvorteile</h3>
                  <ul className="space-y-4">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm sm:text-base text-gray-400">
                        <CheckCircle2 className="w-5 h-5 text-neon-500 mr-3 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg sm:text-xl font-medium text-white mb-6 sm:mb-8 border-b border-white/10 pb-4">Der Ablauf</h3>
                  <div className="space-y-6">
                    {service.process.map((step, index) => (
                      <div key={index} className="flex items-center group">
                        <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-white/10 flex items-center justify-center text-[10px] sm:text-xs font-mono text-neon-500 mr-4 group-hover:border-neon-500/50 transition-colors">
                          0{index + 1}
                        </span>
                        <span className="text-sm sm:text-base text-gray-300 font-light">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-dark-900/50 backdrop-blur-md border border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-12 mb-16 sm:mb-20">
                <h3 className="text-xl sm:text-2xl font-serif text-white mb-8 italic">Technologien</h3>
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  {service.tech.map((t, idx) => (
                    <span key={idx} className="px-4 sm:px-6 py-2 rounded-full border border-white/10 bg-white/5 text-gray-300 text-xs sm:text-sm font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-16 sm:mb-20">
                <h3 className="text-2xl sm:text-3xl font-serif text-white mb-8 sm:mb-12 italic tracking-tight">Häufige Fragen</h3>
                <div className="space-y-8">
                  {service.faq.map((item, i) => (
                    <div key={i} className="border-b border-white/5 pb-6 sm:pb-8">
                      <h4 className="text-base sm:text-lg text-white mb-3 font-medium">{item.q}</h4>
                      <p className="text-sm sm:text-base text-gray-400 font-light leading-relaxed">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between p-8 sm:p-12 bg-neon-500 rounded-2xl sm:rounded-3xl text-dark-950">
                <div className="mb-8 sm:mb-0 text-center sm:text-left">
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-2 italic leading-tight">
                    {t('services.cta_title', { service: service.title })}
                  </h3>
                  <p className="text-dark-950/70 font-medium text-sm sm:text-base">{t('services.cta_subtitle')}</p>
                </div>
                <Link 
                  to="/booking"
                  className="w-full sm:w-auto px-10 py-5 bg-dark-950 text-white rounded-full font-medium flex items-center justify-center group hover:scale-105 transition-transform"
                >
                  {t('services.cta_btn')}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      );
    } else {
      // If slug exists but service not found yet, show loading instead of falling through to list
      return (
        <div className="min-h-screen flex items-center justify-center bg-dark-950">
          <div className="w-12 h-12 border-4 border-neon-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-20">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif text-white mb-8 tracking-tight italic">
              {t('services.title')}
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
              {t('services.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {displayServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link to={`/services/${service.id}`} className="group block h-full">
                    <motion.div 
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="bg-dark-900/40 backdrop-blur-md border border-white/5 rounded-3xl md:rounded-[2.5rem] p-6 sm:p-10 h-full hover:border-neon-500/30 transition-all flex flex-col group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-neon-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white/5 flex items-center justify-center text-neon-500 mb-6 sm:mb-8 group-hover:bg-neon-500 group-hover:text-dark-950 transition-all duration-500">
                        <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-serif text-white mb-4 italic group-hover:text-neon-400 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-sm sm:text-gray-400 font-light leading-relaxed mb-8 flex-grow">
                        {service.description}
                      </p>
                      <div className="flex items-center text-neon-500 font-mono text-xs uppercase tracking-[0.2em] transform translate-x-0 group-hover:translate-x-2 transition-transform">
                        {t('home.view_services')}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
