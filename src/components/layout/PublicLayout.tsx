import { Outlet, Link, useLocation } from 'react-router-dom';
import { Globe, Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import PageTransition from "../PageTransition";
import { motion, AnimatePresence } from 'motion/react';

export default function PublicLayout() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const hasSetLanguage = localStorage.getItem('i18nextLng');
    if (!hasSetLanguage) {
      fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => {
          if (data && data.languages) {
            const primaryLang = data.languages.split(',')[0].split('-')[0];
            const savedLangs = localStorage.getItem('zetta_enabled_languages');
            const supported = savedLangs ? savedLangs.split(',') : ['en', 'de', 'fr', 'es', 'it', 'uk', 'ru'];
            if (supported.includes(primaryLang)) {
              i18n.changeLanguage(primaryLang);
            }
          }
        })
        .catch(err => console.log('IP language detection failed:', err));
    }
  }, [i18n]);

  const changeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  const currentLang = i18n.language.split('-')[0];

  const [enabledLangs, setEnabledLangs] = React.useState<string[]>(['en', 'de', 'fr', 'es', 'it', 'uk', 'ru']);

  useEffect(() => {
    const savedLangs = localStorage.getItem('zetta_enabled_languages');
    if (savedLangs) {
      setEnabledLangs(savedLangs.split(','));
    }
  }, []);

  const LanguageSelector = () => (
    <div className="relative flex items-center">
      
      <select 
        value={currentLang}
        onChange={changeLanguage}
        aria-label="Change language"
        className="appearance-none bg-dark-900 border border-white/10/60 pl-8 pr-8 py-2 text-sm font-medium text-gray-300 hover:text-white hover:border-white/20 hover:shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-neon-500/20 focus:border-neon-500/50 rounded-2xl transition-all"
      >
        {enabledLangs.includes('en') && <option value="en">EN</option>}
        {enabledLangs.includes('de') && <option value="de">DE</option>}
        {enabledLangs.includes('fr') && <option value="fr">FR</option>}
        {enabledLangs.includes('es') && <option value="es">ES</option>}
        {enabledLangs.includes('it') && <option value="it">IT</option>}
        {enabledLangs.includes('uk') && <option value="uk">UK</option>}
        {enabledLangs.includes('ru') && <option value="ru">RU</option>}
      </select>
      <div className="absolute right-3 pointer-events-none">
        <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-dark-950 text-gray-100 font-sans overflow-x-hidden relative">
      
      {/* Soft warm background gradients */}
      <div className="fixed top-0 left-[-10%] w-[50%] h-[50%] bg-dark-900 blur-[120px] pointer-events-none z-[-1]" />
      <div className="fixed bottom-0 right-[-10%] w-[50%] h-[50%] bg-dark-900 blur-[120px] pointer-events-none z-[-1]" />

      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className="sticky top-0 z-50 w-full border-b border-white/10 bg-dark-950/80 backdrop-blur-md"
      >
        <div className="container mx-auto px-6 h-24 flex items-center justify-between max-w-[1400px]">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="flex flex-col">
              <span className="font-display font-semibold text-2xl tracking-[0.2em] text-white leading-none">
                ZETTA
              </span>
              <span className="text-[0.6rem] font-sans tracking-[0.4em] text-gray-500 mt-2 uppercase">
                Digital
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium" aria-label="Main Navigation">
            <Link to="/services" className="text-gray-400 hover:text-white transition-colors uppercase tracking-[0.2em] text-[10px]" aria-label="Services">{t('nav.services')}</Link>
            <Link to="/pricing" className="text-gray-400 hover:text-white transition-colors uppercase tracking-[0.2em] text-[10px]" aria-label="Pricing">Preise</Link>
            <Link to="/portfolio" className="text-gray-400 hover:text-white transition-colors uppercase tracking-[0.2em] text-[10px]" aria-label="Portfolio">Referenzen</Link>
            <Link to="/faq" className="text-gray-400 hover:text-white transition-colors uppercase tracking-[0.2em] text-[10px]" aria-label="FAQ">FAQ</Link>
            <Link to="/about" className="text-gray-400 hover:text-white transition-colors uppercase tracking-[0.2em] text-[10px]" aria-label="About">{t('nav.about')}</Link>
            
            <div className="ml-2">
              <LanguageSelector />
            </div>

            <Link to="/booking" className="relative group overflow-hidden bg-neon-500 text-black px-6 py-3 hover:bg-neon-400 transition-all border border-neon-500 active:scale-95">
              <span className="relative z-10 text-[10px] uppercase tracking-[0.2em] font-bold">{t('nav.book_consultation')}</span>
            </Link>
          </nav>

          {/* Mobile menu toggle */}
          <div className="lg:hidden flex items-center gap-4">
            <LanguageSelector />
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-white hover:text-neon-500 transition-colors"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile menu drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-white/5 bg-dark-950 overflow-hidden"
            >
              <div className="container mx-auto px-6 py-8 flex flex-col gap-6">
                <Link to="/services" className="text-gray-400 hover:text-white transition-colors uppercase tracking-[0.2em] text-xs py-2">{t('nav.services')}</Link>
                <Link to="/pricing" className="text-gray-400 hover:text-white transition-colors uppercase tracking-[0.2em] text-xs py-2">Preise</Link>
                <Link to="/portfolio" className="text-gray-400 hover:text-white transition-colors uppercase tracking-[0.2em] text-xs py-2">Referenzen</Link>
                <Link to="/faq" className="text-gray-400 hover:text-white transition-colors uppercase tracking-[0.2em] text-xs py-2">FAQ</Link>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors uppercase tracking-[0.2em] text-xs py-2">{t('nav.about')}</Link>
                <Link to="/booking" className="bg-neon-500 text-black px-6 py-4 text-center rounded-lg uppercase tracking-[0.2em] text-xs font-bold active:scale-[0.98] transition-all">
                  {t('nav.book_consultation')}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <main className="flex-1 flex flex-col relative z-10">
        <AnimatePresence mode="wait">
          <PageTransition><Outlet /></PageTransition>
        </AnimatePresence>
      </main>

      <footer className="border-t border-white/10 bg-dark-900 mt-auto relative z-10">
        <div className="container mx-auto px-6 py-20 max-w-[1400px]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="flex items-center gap-3 mb-6">
                <div className="font-display font-medium tracking-wider text-2xl text-white">
                  ZETTA
                </div>
              </Link>
              <p className="text-gray-400 text-sm max-w-sm leading-relaxed font-mono uppercase tracking-widest">
                {t('footer.description')}
              </p>
            </div>
            
            <div>
              <h4 className="font-sans font-semibold tracking-widest uppercase mb-6 text-xs text-white">{t('footer.services')}</h4>
              <ul className="space-y-4 text-sm text-gray-400 font-light">
                <li><Link to="/services/webdesign" className="hover:text-neon-400 transition-colors">Webdesign</Link></li>
                <li><Link to="/services/ai-automation" className="hover:text-neon-400 transition-colors">KI Automatisierung</Link></li>
                <li><Link to="/services/ai-chatbots" className="hover:text-neon-400 transition-colors">KI Chatbots</Link></li>
                <li><Link to="/services/workflow-automation" className="hover:text-neon-400 transition-colors">Workflow Automation</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-sans font-semibold tracking-widest uppercase mb-6 text-xs text-white">{t('footer.company')}</h4>
              <ul className="space-y-4 text-sm text-gray-400 font-light">
                <li><Link to="/about" className="hover:text-neon-400 transition-colors">Über uns</Link></li>
                <li><Link to="/process" className="hover:text-neon-400 transition-colors">Projektablauf</Link></li>
                <li><Link to="/pricing" className="hover:text-neon-400 transition-colors">Preise</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-sans font-semibold tracking-widest uppercase mb-6 text-xs text-white">Rechtliches</h4>
              <ul className="space-y-4 text-sm text-gray-400 font-light">
                <li><Link to="/imprint" className="hover:text-neon-400 transition-colors">Impressum</Link></li>
                <li><Link to="/privacy" className="hover:text-neon-400 transition-colors">Datenschutz</Link></li>
                <li><Link to="/admin" className="hover:text-neon-400 transition-colors">Admin Login</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-20 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 uppercase tracking-widest font-mono">
            <p>&copy; {new Date().getFullYear()} ZETTA DIGITAL. {t('footer.rights')}</p>
            <p className="mt-2 md:mt-0 font-mono uppercase tracking-widest text-sm">{t('footer.slogan', 'A tradition of excellence.')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
