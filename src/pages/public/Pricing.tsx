import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Star, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PriceConfigurator from '@/components/pricing/PriceConfigurator';

export default function Pricing() {
  const { t } = useTranslation();
  const [tiers, setTiers] = React.useState<any[]>([]);

  React.useEffect(() => {
    const saved = localStorage.getItem('zetta_pricing');
    if (saved) {
      const parsed = JSON.parse(saved);
      setTiers(parsed.map((p: any) => ({
        ...p,
        features: Array.isArray(p.features) ? p.features : (p.features || '').split('\n').filter(Boolean),
        cta: t('home.phase4_btn'),
        popular: p.popular || false
      })));
    } else {
      setTiers([
        {
          name: t('pricing.starter.name'),
          price: t('pricing.starter.price'),
          description: t('pricing.starter.desc'),
          features: t('pricing.starter.features', { returnObjects: true }) as string[],
          cta: t('home.phase4_btn'),
          popular: false
        },
        {
          name: t('pricing.business.name'),
          price: t('pricing.business.price'),
          description: t('pricing.business.desc'),
          features: t('pricing.business.features', { returnObjects: true }) as string[],
          cta: t('home.phase4_btn'),
          popular: true
        },
        {
          name: t('pricing.custom.name'),
          price: t('pricing.custom.price'),
          description: t('pricing.custom.desc'),
          features: t('pricing.custom.features', { returnObjects: true }) as string[],
          cta: t('home.phase4_btn'),
          popular: false
        }
      ]);
    }
  }, [t]);

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Hero Section */}
      <section className="pt-32 pb-10 px-6 overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neon-500/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-display font-bold text-white mb-8 tracking-tight"
          >
            Einfache <span className="italic text-neon-500">Preise</span>,<br />
            keine Überraschungen.
          </motion.h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Wählen Sie zwischen unseren bewährten Paketen oder stellen Sie sich 
            Ihre digitale Strategie einfach selbst zusammen.
          </p>
        </div>
      </section>

      {/* Interactive Configurator */}
      <section className="py-20 relative bg-dark-900/20">
        <PriceConfigurator />
      </section>

      {/* Standard Tiers */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 italic">
                Oder wählen Sie ein <span className="text-neon-500">Paket</span>
              </h2>
              <p className="text-gray-400">Unsere beliebtesten Kombinationen für schnelles Wachstum.</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
              <HelpCircle size={14} className="text-neon-500" />
              Alles inklusive Setup & Support
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative bg-dark-900/40 backdrop-blur-md border ${tier.popular ? 'border-neon-500/50' : 'border-white/5'} rounded-[2.5rem] p-10 flex flex-col hover:border-white/20 transition-all duration-500`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-neon-500 rounded-full text-[10px] font-bold text-dark-950 uppercase tracking-widest flex items-center whitespace-nowrap shadow-xl">
                    <Star className="w-3 h-3 mr-1 fill-dark-950" /> Meistgewählt
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className="text-3xl font-display font-bold text-white mb-2 italic">{tier.name}</h3>
                  <p className="text-gray-400 text-sm font-medium leading-relaxed">{tier.description}</p>
                </div>

                <div className="mb-8 flex items-baseline">
                  <span className="text-4xl font-display font-bold text-white">
                    {tier.price !== 'Anfrage' && tier.price !== 'Quote' ? `€${tier.price}` : tier.price}
                  </span>
                  {tier.price !== 'Anfrage' && tier.price !== 'Quote' && <span className="text-gray-500 ml-2 font-bold text-xs uppercase tracking-widest">Einmalig</span>}
                </div>

                <ul className="space-y-4 mb-10 flex-grow">
                  {Array.isArray(tier.features) && tier.features.map(feature => (
                    <li key={feature} className="flex items-center text-gray-400 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-500 mr-4 shrink-0" />
                      <span className="font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/booking"
                  className={`w-full py-5 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all text-center flex items-center justify-center group ${
                    tier.popular 
                      ? 'bg-neon-500 text-dark-950 hover:scale-[1.02] shadow-xl shadow-neon-500/20' 
                      : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {tier.cta}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Footer */}
      <section className="py-20 border-t border-white/5 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="flex justify-center -space-x-2">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="w-10 h-10 rounded-full bg-dark-900 border-2 border-dark-950 flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-white/5" />
              </div>
            ))}
          </div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500">
            Schon über <span className="text-white">50+ Unternehmen</span> vertrauen unserer KI-Expertise
          </p>
        </div>
      </section>
    </div>
  );
}
