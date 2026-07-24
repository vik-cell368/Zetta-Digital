import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Star, HelpCircle, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PriceConfigurator from '@/components/pricing/PriceConfigurator';

export default function Pricing() {
  const { t } = useTranslation();
  const [tiers, setTiers] = React.useState<any[]>([]);

  React.useEffect(() => {
    const saved = localStorage.getItem('viktor_labs_pricing');
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
      <section className="pt-40 pb-20 px-6 overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-600/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-500 text-[10px] uppercase tracking-[0.3em] font-black mb-12"
          >
            Pricing & Plans
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl lg:text-9xl font-display font-medium text-slate-50 mb-10 tracking-tight leading-[0.9]"
          >
            KLARHEIT <span className="text-cyan-500 italic">TRIFFT</span><br />
            FAIRNESS.
          </motion.h1>
          <p className="text-slate-400 text-lg md:text-2xl max-w-3xl mx-auto font-light leading-relaxed">
            Wir glauben an transparente Partnerschaften. Keine versteckten Kosten, nur echtes Commitment für Ihren Erfolg.
          </p>
        </div>
      </section>

      {/* Interactive Configurator */}
      <section className="py-32 relative bg-dark-900/20">
        <PriceConfigurator />
      </section>

      {/* Standard Tiers */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-10">
            <div>
              <div className="text-cyan-500 font-black uppercase tracking-[0.3em] text-[10px] mb-6">Standard Pakete</div>
              <h2 className="text-4xl md:text-6xl font-display font-medium text-slate-50 tracking-tight leading-tight">
                ODER WÄHLEN SIE EIN <br /> <span className="text-slate-600 italic">FESTES PAKET</span>
              </h2>
            </div>
            <div className="max-w-xs">
              <p className="text-slate-400 text-lg leading-relaxed font-light">Unsere beliebtesten Kombinationen für schnelles Wachstum.</p>
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
                className={`relative bg-dark-900/40 backdrop-blur-2xl border ${tier.popular ? 'border-cyan-500/50 shadow-[0_20px_80px_rgba(59,130,246,0.1)]' : 'border-white/5'} rounded-[4rem] p-12 flex flex-col hover:border-white/10 transition-all duration-700`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-8 py-2.5 bg-cyan-500 rounded-full text-[10px] font-black text-dark-950 uppercase tracking-[0.3em] flex items-center whitespace-nowrap shadow-2xl shadow-cyan-500/40">
                    <Star className="w-3.5 h-3.5 mr-2 fill-dark-950" /> Meistgewählt
                  </div>
                )}
                
                <div className="mb-12">
                  <h3 className="text-4xl font-display font-bold text-slate-50 mb-4 tracking-tight">{tier.name}</h3>
                  <p className="text-slate-400 text-lg leading-relaxed font-light">{tier.description}</p>
                </div>

                <div className="mb-12 flex items-baseline">
                  <span className="text-6xl font-display font-bold text-white tracking-tighter">
                    {tier.price !== 'Anfrage' && tier.price !== 'Quote' ? `€${tier.price}` : tier.price}
                  </span>
                  {tier.price !== 'Anfrage' && tier.price !== 'Quote' && <span className="text-slate-500 ml-4 font-black text-[10px] uppercase tracking-[0.3em]">Einmalig</span>}
                </div>

                <ul className="space-y-6 mb-16 flex-grow">
                  {Array.isArray(tier.features) && tier.features.map(feature => (
                    <li key={feature} className="flex items-start text-slate-300 text-base">
                      <Check className="w-6 h-6 text-cyan-500 mr-5 shrink-0 mt-0.5 opacity-80" />
                      <span className="font-light leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/booking"
                  className={`w-full h-20 rounded-full font-black uppercase tracking-[0.3em] text-[10px] transition-all text-center flex items-center justify-center group ${
                    tier.popular 
                      ? 'bg-cyan-500 text-dark-950 hover:scale-[1.02] shadow-2xl shadow-cyan-500/40' 
                      : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
                  }`}
                >
                  Paket wählen
                  <ArrowUpRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
