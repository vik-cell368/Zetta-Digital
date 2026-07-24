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

import PriceConfigurator from '@/components/pricing/PriceConfigurator';

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
        const localData = localStorage.getItem('viktor_labs_services');
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
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (slug) {
    const service = displayServices.find(s => s.id === slug);
    if (service) {
      const Icon = service.icon;

      return (
        <div className="min-h-screen pt-40 pb-20 px-6 bg-dark-950">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/[0.03] border border-white/10 text-cyan-500 text-[10px] uppercase tracking-[0.3em] font-black mb-12 backdrop-blur-md">
                <Icon className="w-4 h-4" />
                Service Details
              </div>
              
              <h1 className="text-5xl md:text-8xl lg:text-9xl font-display font-medium text-white mb-12 tracking-tight leading-[0.9]">
                {service.title}
              </h1>
              
              <p className="text-xl md:text-3xl text-slate-400 font-light leading-relaxed mb-24 max-w-4xl">
                {service.description}
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-48">
                <div>
                  <div className="text-cyan-500 font-black uppercase tracking-[0.4em] text-[10px] mb-12">Vorteile</div>
                  <ul className="space-y-8">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-xl text-slate-300 font-light leading-relaxed">
                        <CheckCircle2 className="w-7 h-7 text-cyan-500 mr-6 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <div className="text-cyan-500 font-black uppercase tracking-[0.4em] text-[10px] mb-12">Prozess</div>
                  <div className="space-y-10">
                    {service.process.map((step, index) => (
                      <div key={index} className="flex items-center group">
                        <span className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-[10px] font-black text-cyan-500 mr-8 group-hover:border-cyan-500 transition-all duration-500">
                          {index + 1}
                        </span>
                        <span className="text-xl text-slate-300 font-light">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-[4rem] p-12 md:p-20 mb-48">
                <div className="text-cyan-500 font-black uppercase tracking-[0.4em] text-[10px] mb-12">Technologie-Stack</div>
                <div className="flex flex-wrap gap-4">
                  {service.tech.map((t, idx) => (
                    <span key={idx} className="px-10 py-4 rounded-full border border-white/5 bg-white/[0.03] text-slate-400 text-xs font-black uppercase tracking-[0.2em] hover:text-white hover:border-white/20 transition-all duration-500 cursor-default">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {service.faq && service.faq.length > 0 && (
                <div className="mb-48">
                  <div className="text-cyan-500 font-black uppercase tracking-[0.4em] text-[10px] mb-16">Häufig gestellte Fragen</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {service.faq.map((item, i) => (
                      <div key={i} className="bg-white/[0.02] border border-white/5 p-12 rounded-[3rem] hover:border-white/10 transition-colors">
                        <h4 className="text-2xl text-white mb-6 font-display font-medium tracking-tight">{item.q}</h4>
                        <p className="text-lg text-slate-400 font-light leading-relaxed">{item.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-cyan-600 rounded-[5rem] p-16 md:p-32 text-center space-y-12 relative overflow-hidden group">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.2),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                 <h2 className="text-5xl md:text-8xl font-display font-medium text-dark-950 relative z-10 leading-[0.9] tracking-tighter uppercase">STARTEN WIR <br /> GEMEINSAM?</h2>
                 <p className="text-dark-950/70 text-xl md:text-2xl font-medium max-w-2xl mx-auto relative z-10">{t('services.cta_subtitle')}</p>
                 <div className="pt-8 relative z-10">
                    <Link to="/booking">
                      <button className="h-24 px-16 rounded-full bg-dark-950 text-white font-black uppercase tracking-[0.3em] text-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-4 mx-auto shadow-2xl group/btn">
                        Projekt anfragen
                        <ArrowRight size={24} className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen pt-40 pb-20 bg-dark-950 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] bg-cyan-600/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-cyan-900/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-5xl mb-32 space-y-8">
            <div className="text-cyan-500 font-black uppercase tracking-[0.4em] text-[10px]">Unsere Expertise</div>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-medium text-white tracking-tighter leading-[0.85]">
              LÖSUNGEN FÜR <br /> <span className="text-slate-600 italic">EINE DIGITALE</span> <br /> <span className="text-white">ZUKUNFT.</span>
            </h1>
            <p className="text-xl md:text-3xl text-slate-400 font-light leading-relaxed max-w-4xl">
              Wir begleiten Sie von der ersten Idee bis zur technischen Umsetzung. Ehrlich, transparent und mit höchstem Anspruch an Design und Code.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-48">
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
                    <div className="bg-white/[0.02] border border-white/5 rounded-[4rem] p-12 md:p-16 h-full hover:border-cyan-500/30 transition-all duration-700 flex flex-col relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                      
                      <div className="w-20 h-20 rounded-[1.5rem] bg-cyan-500/10 flex items-center justify-center text-cyan-500 mb-12 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-700 shadow-lg">
                        <Icon size={32} />
                      </div>
                      
                      <h3 className="text-4xl font-display font-medium text-white mb-6 leading-tight tracking-tight">
                        {service.title}
                      </h3>
                      
                      <p className="text-xl text-slate-400 font-light leading-relaxed mb-12 flex-grow">
                        {service.description}
                      </p>
                      
                      <div className="flex items-center gap-3 text-cyan-500 font-black uppercase tracking-[0.3em] text-[10px] transform translate-x-0 group-hover:translate-x-3 transition-transform duration-500">
                        Details <ArrowRight size={14} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <div className="border-t border-white/5 pt-48">
             <PriceConfigurator />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
