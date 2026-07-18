import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Star } from 'lucide-react';

import { useTranslation } from 'react-i18next';

export default function Pricing() {
  const { t } = useTranslation();

  const tiers = [
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
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h1 className="text-6xl md:text-8xl font-serif text-white mb-8 tracking-tight italic">
            {t('pricing.title')}
          </h1>
          <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
            {t('pricing.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative bg-dark-900/40 backdrop-blur-md border ${tier.popular ? 'border-neon-500/50' : 'border-white/5'} rounded-[2.5rem] p-10 flex flex-col`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-neon-500 rounded-full text-[10px] font-mono font-bold text-dark-950 uppercase tracking-widest flex items-center">
                  <Star className="w-3 h-3 mr-1 fill-dark-950" /> Meistgewählt
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-2xl font-serif text-white mb-2 italic">{tier.name}</h3>
                <p className="text-gray-400 text-sm font-light leading-relaxed">{tier.description}</p>
              </div>

              <div className="mb-8 flex items-baseline">
                <span className="text-4xl font-serif text-white font-bold italic">
                  {tier.price !== 'Anfrage' && tier.price !== 'Quote' ? `€${tier.price}` : tier.price}
                </span>
                {tier.price !== 'Anfrage' && tier.price !== 'Quote' && <span className="text-gray-500 ml-2 font-light">Ab-Preis</span>}
              </div>

              <ul className="space-y-4 mb-10 flex-grow">
                {Array.isArray(tier.features) && tier.features.map(feature => (
                  <li key={feature} className="flex items-center text-gray-300 text-sm">
                    <Check className="w-4 h-4 text-neon-500 mr-3 shrink-0" />
                    <span className="font-light">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/booking"
                className={`w-full py-4 rounded-full font-medium transition-all text-center flex items-center justify-center group ${
                  tier.popular 
                    ? 'bg-neon-500 text-dark-950 hover:scale-105 shadow-lg shadow-neon-500/20' 
                    : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
                }`}
              >
                {tier.cta}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-24 bg-dark-900/20 border border-white/5 rounded-3xl p-12 text-center"
        >
          <h3 className="text-2xl font-serif text-white mb-4 italic">
            {t('pricing.individual_title')}
          </h3>
          <p className="text-gray-400 font-light mb-8 max-w-xl mx-auto">
            {t('pricing.individual_desc')}
          </p>
          <Link to="/booking" className="text-neon-500 font-mono text-sm uppercase tracking-[0.2em] hover:text-neon-400 transition-colors inline-flex items-center">
            {t('pricing.individual_btn')}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
