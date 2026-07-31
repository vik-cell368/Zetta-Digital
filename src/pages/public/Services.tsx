import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, query, getDocs, where, orderBy } from 'firebase/firestore';
import { Service } from '@/lib/types';
import { getTranslatedText } from '@/lib/utils';
import { 
  Globe, 
  Sparkles,
  ArrowRight, 
  ArrowUpRight,
  CheckCircle2, 
  MessageSquare, 
  Layout, 
  Zap,
  Box
} from 'lucide-react';

import PriceConfigurator from '@/components/pricing/PriceConfigurator';
import SEO from '@/components/SEO';

export default function Services() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language.split('-')[0] || 'en';
  
  const [dbServices, setDbServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const q = query(
          collection(db, 'services'),
          where('is_active', '==', true),
          orderBy('created_at', 'asc')
        );
        
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
        
        if (data && data.length > 0) {
          setDbServices(data);
        } else {
          throw new Error("No services found in Firebase");
        }
      } catch (err) {
        console.warn("Failed to fetch services from Firebase, checking localStorage:", err);
        handleFirestoreError(err, OperationType.LIST, 'services');
        const localData = localStorage.getItem('viktor_labs_services');
        if (localData) {
          try {
            const parsed = JSON.parse(localData);
            setDbServices(parsed.filter((s: Service) => s.is_active));
          } catch (e) {
            console.error("Failed to parse local services", e);
          }
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchServices();
  }, []);

  const getServiceIcon = (id: string) => {
    const idLower = id.toLowerCase();
    if (idLower.includes('webdesign') || idLower.includes('website')) return Globe;
    if (idLower.includes('animation') || idLower.includes('3d')) return Sparkles;
    if (idLower.includes('management') || idLower.includes('verwaltung')) return Layout;
    if (idLower.includes('add-on') || idLower.includes('zusatz')) return Zap;
    if (idLower.includes('beratung') || idLower.includes('session')) return MessageSquare;
    return Box;
  };

  const displayServices = React.useMemo(() => {
    return dbServices.map(s => {
      let features: string[] = [];
      let process: string[] = [];
      let tech: string[] = [];

      try {
        const featData = JSON.parse(s.features || '{}');
        features = featData[currentLang] || featData['de'] || featData['en'] || [];
        if (!Array.isArray(features)) features = [];
      } catch (e) { features = []; }

      try {
        const procData = JSON.parse(s.process || '{}');
        process = procData[currentLang] || procData['de'] || procData['en'] || [];
        if (!Array.isArray(process)) process = [];
      } catch (e) { process = []; }

      try {
        const techData = JSON.parse(s.tech || '[]');
        tech = Array.isArray(techData) ? techData : [];
      } catch (e) { tech = []; }

      return {
        id: s.id,
        title: getTranslatedText(s.name, currentLang),
        description: getTranslatedText(s.description, currentLang),
        features,
        process,
        tech,
        price: s.price,
        icon: getServiceIcon(s.id)
      };
    });
  }, [dbServices, currentLang]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (slug) {
    const service = displayServices.find(s => s.id === slug);
    if (service) {
      const Icon = service.icon;

      return (
        <div className="min-h-screen bg-white">
          <SEO 
            title={service.title}
            description={service.description}
          />
          <div className="pt-44 md:pt-48 lg:pt-52 pb-32 px-6 bg-dark-900">
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
                
                <p className="text-xl md:text-3xl text-slate-400 font-light leading-relaxed max-w-4xl">
                  {service.description}
                </p>
              </motion.div>
            </div>
          </div>

          <div className="py-32 px-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-48">
              <div>
                <div className="text-cyan-600 font-black uppercase tracking-[0.4em] text-[10px] mb-12">Leistungen</div>
                <ul className="space-y-8">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-xl text-slate-600 font-light leading-relaxed">
                      <CheckCircle2 className="w-7 h-7 text-cyan-500 mr-6 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <div className="text-cyan-600 font-black uppercase tracking-[0.4em] text-[10px] mb-12">Unser Ansatz</div>
                <div className="space-y-10">
                  {service.process.map((step, index) => (
                    <div key={index} className="flex items-center group">
                      <span className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[10px] font-black text-cyan-500 mr-8 group-hover:border-cyan-500 transition-all duration-500">
                        {index + 1}
                      </span>
                      <span className="text-xl text-slate-700 font-light">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-[3rem] p-12 md:p-20 mb-48">
              <div className="text-cyan-600 font-black uppercase tracking-[0.4em] text-[10px] mb-12">Technologie & Fokus</div>
              <div className="flex flex-wrap gap-4">
                {service.tech.map((t, idx) => (
                  <span key={idx} className="px-10 py-4 rounded-full border border-slate-200 bg-white text-slate-500 text-xs font-black uppercase tracking-[0.2em] hover:text-cyan-500 hover:border-cyan-500 transition-all duration-500 cursor-default">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-dark-900 rounded-[5rem] p-16 md:p-32 text-center space-y-12 relative overflow-hidden group">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(0,123,255,0.2),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
               <h2 className="text-5xl md:text-8xl font-display font-medium text-white relative z-10 leading-[0.9] tracking-tighter uppercase">STARTEN WIR <br /> GEMEINSAM?</h2>
               <p className="text-slate-400 text-xl md:text-2xl font-light max-w-2xl mx-auto relative z-10">Lassen Sie uns Ihre Vision in eine erstklassige Website verwandeln.</p>
               <div className="pt-8 relative z-10">
                  <Link to="/booking">
                    <button className="h-16 px-12 rounded-full bg-cyan-500 text-white font-black uppercase tracking-[0.3em] text-[10px] hover:scale-105 active:scale-95 transition-all flex items-center gap-4 mx-auto shadow-[0_15px_40px_rgba(0,123,255,0.3)] group/btn">
                      Projekt anfragen
                      <ArrowRight size={24} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </Link>
               </div>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <SEO 
        title="Unsere Leistungen"
        description="Entdecken Sie unsere High-End-Services: Webdesign, 3D Animationen, Motion Design und digitale Strategie."
      />
      <div className="pt-48 pb-32 bg-dark-900 relative">
        <div className="absolute inset-0 bg-grid-white pointer-events-none opacity-40" />
        <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <header className="max-w-5xl space-y-10">
              <div className="text-cyan-500 font-black uppercase tracking-[0.4em] text-[10px]">Unsere Expertise</div>
              <h1 id="services-title" className="text-6xl md:text-8xl lg:text-[10rem] font-display font-medium text-white tracking-tight leading-[0.82] uppercase">
                UNSER HANDWERK. <br /> <span className="text-slate-600 italic">IHRE</span> <br /> <span className="text-white">WIRKUNG.</span>
              </h1>
              <p className="text-xl md:text-3xl text-slate-400 font-light leading-relaxed max-w-4xl">
                Wir entwickeln High-End-Websites mit immersiven 3D-Animationen und kompromissloser Performance. Für Unternehmen, die den Standard definieren wollen.
              </p>
            </header>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-40 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-48">
          {displayServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.article
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link to={`/services/${service.id}`} className="group block h-full">
                  <div className="bg-white border border-slate-200 rounded-[3rem] p-12 md:p-16 h-full hover:border-cyan-500/30 transition-all duration-700 flex flex-col relative overflow-hidden shadow-sm hover:shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-10 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-700 shadow-sm relative z-10">
                      <Icon size={28} />
                    </div>
                    
                    <h3 className="text-4xl font-display font-medium text-dark-900 mb-8 leading-tight tracking-tight uppercase relative z-10">
                      {service.title}
                    </h3>
                    
                    <p className="text-lg text-slate-500 font-light leading-relaxed mb-12 flex-grow relative z-10">
                      {service.description}
                    </p>
                    
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-3 text-cyan-500 font-black uppercase tracking-[0.3em] text-[10px] transform translate-x-0 group-hover:translate-x-3 transition-transform duration-500">
                        Detailansicht <ArrowRight size={14} />
                      </div>
                      <ArrowUpRight size={16} className="text-slate-300 group-hover:text-cyan-500 transition-colors" />
                    </div>
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </div>

        <div className="border-t border-slate-100 pt-48">
           <div className="bg-slate-50 rounded-[4rem] p-12 md:p-24 text-center space-y-10 border border-slate-200 shadow-sm overflow-hidden relative group">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
             
             <div className="text-cyan-600 font-black uppercase tracking-[0.4em] text-[10px] relative z-10">Transparente Investition</div>
             <h2 className="text-4xl md:text-7xl font-display font-medium text-dark-900 leading-[0.95] tracking-tight uppercase relative z-10">
               ERHALTEN SIE SOFORT EINE <br /> <span className="text-slate-400 italic">ÜBERSICHT.</span>
             </h2>
             <p className="text-slate-500 text-xl md:text-2xl font-light max-w-2xl mx-auto relative z-10 leading-relaxed">
               Nutzen Sie unseren interaktiven Kalkulator für eine sofortige, transparente Übersicht Ihrer Investition – maßgeschneidert auf Ihre Bedürfnisse.
             </p>
             
             <div className="pt-8 relative z-10">
               <Link to="/pricing">
                 <button className="h-18 px-14 rounded-full bg-dark-900 text-white font-black uppercase tracking-[0.3em] text-[10px] hover:bg-dark-800 hover:scale-[1.03] active:scale-95 transition-all flex items-center gap-4 mx-auto shadow-2xl">
                   Preise kalkulieren
                   <ArrowRight size={24} className="text-cyan-500" />
                 </button>
               </Link>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
