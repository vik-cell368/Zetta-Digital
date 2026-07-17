import { Outlet, Link, useLocation } from 'react-router-dom';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import React, { useEffect } from 'react';
import PageTransition from "../PageTransition";
import { motion, AnimatePresence } from 'motion/react';
import WebGLBackground from '../WebGLBackground';

export default function PublicLayout() {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const hasSetLanguage = localStorage.getItem('i18nextLng');
    if (!hasSetLanguage) {
      fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => {
          if (data && data.languages) {
            const primaryLang = data.languages.split(',')[0].split('-')[0];
            const supported = ['en', 'de', 'fr', 'es', 'it', 'uk', 'ru'];
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

  const LanguageSelector = () => (
    <div className="relative flex items-center">
      
      <select 
        value={currentLang}
        onChange={changeLanguage}
        className="appearance-none bg-dark-900 border border-white/10/60 pl-8 pr-8 py-2 text-sm font-medium text-gray-300 hover:text-white hover:border-white/20 hover:shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-neon-500/20 focus:border-neon-500/50 rounded-2xl transition-all"
      >
        <option value="en">EN</option>
        <option value="de">DE</option>
        <option value="fr">FR</option>
        <option value="es">ES</option>
        <option value="it">IT</option>
        <option value="uk">UK</option>
        <option value="ru">RU</option>
      </select>
      <div className="absolute right-3 pointer-events-none">
        <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-dark-950 text-gray-100 font-sans overflow-x-hidden relative">
      
      {/* WebGL GPU Background - only if not on home page */}
      {location.pathname !== '/' && <WebGLBackground />}
      
      {/* Soft warm background gradients */}
      <div className="fixed top-0 left-[-10%] w-[50%] h-[50%] bg-dark-900 blur-[120px] pointer-events-none z-[-1]" />
      <div className="fixed bottom-0 right-[-10%] w-[50%] h-[50%] bg-dark-900 blur-[120px] pointer-events-none z-[-1]" />

      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className="sticky top-0 z-50 w-full border-b border-white/10 bg-dark-950/80 backdrop-blur-xl"
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

          <nav className="hidden md:flex items-center gap-10 text-sm font-medium">
            <Link to="/#services" className="text-gray-400 hover:text-white transition-colors uppercase tracking-widest text-xs">{t('nav.services')}</Link>
            <Link to="/#about" className="text-gray-400 hover:text-white transition-colors uppercase tracking-widest text-xs">{t('nav.about')}</Link>
            
            <div className="ml-2">
              <LanguageSelector />
            </div>

            <Link to="/booking" className="relative group overflow-hidden bg-neon-500 text-black px-8 py-3.5 hover:bg-neon-400 transition-all border border-neon-500 active:scale-95">
              <span className="relative z-10 text-xs uppercase tracking-widest font-semibold">{t('nav.book_consultation')}</span>
            </Link>
          </nav>

          {/* Mobile menu and language toggle */}
          <div className="md:hidden flex items-center gap-4">
            <LanguageSelector />
          </div>
        </div>
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
                <li className="hover:text-neon-400 transition-colors cursor-pointer">{t('footer.svc_web', 'Website Development')}</li>
                <li className="hover:text-neon-400 transition-colors cursor-pointer">{t('footer.svc_shop', 'Online Shops')}</li>
                <li className="hover:text-neon-400 transition-colors cursor-pointer">{t('footer.svc_workflow', 'Workflow Automation')}</li>
                <li className="hover:text-neon-400 transition-colors cursor-pointer">{t('footer.svc_custom', 'Custom Solutions')}</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-sans font-semibold tracking-widest uppercase mb-6 text-xs text-white">{t('footer.company')}</h4>
              <ul className="space-y-4 text-sm text-gray-400 font-light">
                <li><Link to="/admin" className="hover:text-neon-400 transition-colors">{t('footer.admin')}</Link></li>
                <li className="hover:text-neon-400 transition-colors cursor-pointer">{t('footer.privacy')}</li>
                <li className="hover:text-neon-400 transition-colors cursor-pointer">{t('footer.terms')}</li>
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
