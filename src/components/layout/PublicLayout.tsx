import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, MessageSquare, Search as SearchIcon, Command, Globe, Hexagon, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState, useMemo } from 'react';
import PageTransition from "../PageTransition";
import { motion, AnimatePresence } from 'motion/react';
import CookieConsent from '../ui/CookieConsent';
import { db } from '@/lib/firebase';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { Service } from '@/lib/types';
import { getTranslatedText } from '@/lib/utils';

export default function PublicLayout() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeServices, setActiveServices] = useState<Service[]>([]);
  const currentLang = i18n.language.split('-')[0] || 'de';

  useEffect(() => {
    async function fetchServices() {
      try {
        const q = query(collection(db, 'services'), where('is_active', '==', true));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
        
        if (data.length > 0) {
          setActiveServices(data);
        } else {
          const local = localStorage.getItem('viktor_labs_services');
          if (local) {
            setActiveServices(JSON.parse(local).filter((s: Service) => s.is_active));
          }
        }
      } catch (e) {
        console.warn("PublicLayout: Services fetch failed", e);
      }
    }
    fetchServices();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Handle Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const searchItems = useMemo(() => {
    const baseItems = [
      { name: 'Home', path: '/', category: 'Seite' },
      { name: 'Leistungen', path: '/services', category: 'Seite' },
      { name: 'Preise & Kalkulator', path: '/pricing', category: 'Tool' },
      { name: 'Referenzen', path: '/portfolio', category: 'Seite' },
      { name: 'Häufige Fragen (FAQ)', path: '/faq', category: 'Support' },
      { name: 'Über uns', path: '/about', category: 'Agentur' },
      { name: 'Unser Prozess', path: '/process', category: 'Agentur' },
      { name: 'Kontakt', path: '/contact', category: 'Seite' },
      { name: 'Anfrage starten', path: '/booking', category: 'Kontakt' },
    ];

    const serviceItems = activeServices.map(s => ({
      name: getTranslatedText(s.name, currentLang),
      path: `/services/${s.id}`,
      category: 'Service'
    }));

    return [...baseItems, ...serviceItems].filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeServices, searchQuery, currentLang]);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-950 text-gray-100 font-sans selection:bg-cyan-500/30">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-cyan-500 focus:text-white focus:rounded-full focus:font-black focus:uppercase focus:tracking-widest"
      >
        Zum Inhalt springen
      </a>
      {/* Navigation */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'py-3' : 'py-5 md:py-6'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className={`mx-auto max-w-7xl rounded-full transition-all duration-500 flex items-center justify-between px-4 sm:px-6 md:px-8 h-16 md:h-18 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6)] border ${
            isScrolled 
              ? 'bg-dark-950/90 border-white/20 backdrop-blur-3xl' 
              : 'bg-dark-900/60 border-white/10 backdrop-blur-2xl'
          }`}>
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 sm:gap-3.5 group shrink-0">
              <div className="relative flex items-center justify-center px-1.5 py-1 rounded-2xl overflow-hidden shrink-0">
                <img 
                  src="/logo.png" 
                  alt="Viktor Labs Logo" 
                  className="h-9 sm:h-10 md:h-11 w-auto object-contain rounded-xl group-hover:scale-105 transition-transform duration-500" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="hidden sm:flex flex-col shrink-0">
                <span className="font-display font-medium text-base md:text-lg tracking-tight text-white leading-none whitespace-nowrap">
                  VIKTOR<span className="text-cyan-500">LABS</span>
                </span>
                <span className="text-[6.5px] md:text-[7.5px] uppercase tracking-[0.3em] text-slate-400 font-black mt-0.5 whitespace-nowrap">Digital Architecture</span>
              </div>
            </Link>

            {/* Desktop Nav (lg+ screens) */}
            <nav className="hidden lg:flex items-center gap-4 xl:gap-8 2xl:gap-10 shrink-0" aria-label="Hauptnavigation">
              {[
                { name: 'Leistungen', path: '/services' },
                { name: 'Kalkulator', path: '/pricing' },
                { name: 'Über Uns', path: '/about' },
              ].map((item) => (
                <Link 
                  key={item.path} 
                  to={item.path}
                  aria-current={location.pathname === item.path ? 'page' : undefined}
                  className={`text-[9.5px] md:text-[10px] uppercase tracking-[0.2em] font-black transition-all hover:text-cyan-500 whitespace-nowrap ${
                    location.pathname === item.path ? 'text-cyan-500' : 'text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4 shrink-0">
              <div className="hidden lg:flex items-center gap-3 xl:gap-5 2xl:gap-6 shrink-0">
                <Link to="/pricing" className="hidden 2xl:block shrink-0">
                  <button 
                    aria-label="Preiskalkulator öffnen"
                    className="text-[10px] uppercase tracking-[0.2em] font-black text-cyan-500 hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <Sparkles size={13} aria-hidden="true" />
                    Kalkulator
                  </button>
                </Link>

                <button 
                  onClick={() => setIsSearchOpen(true)}
                  aria-label="Suche öffnen (Cmd+K)"
                  className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all group shrink-0"
                >
                  <SearchIcon size={13} aria-hidden="true" />
                  <span className="text-[9.5px] uppercase tracking-wider font-bold whitespace-nowrap">Suchen</span>
                  <span className="text-[8.5px] bg-white/10 px-1.5 py-0.5 rounded flex items-center gap-0.5" aria-hidden="true">
                    <Command size={9} /> K
                  </span>
                </button>

                <div className="flex items-center gap-2.5 shrink-0 px-1">
                  {['DE', 'EN'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => changeLanguage(lang.toLowerCase())}
                      className={`text-[9.5px] md:text-[10px] font-black tracking-[0.15em] transition-colors ${
                        currentLang.toUpperCase() === lang ? 'text-cyan-500' : 'text-slate-500 hover:text-white'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>

                <Link to="/booking" className="shrink-0">
                  <button className="h-10 md:h-11 px-4 md:px-5 rounded-full bg-cyan-500 text-white text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-black hover:scale-[1.03] active:scale-95 transition-all shadow-[0_8px_25px_rgba(0,123,255,0.25)] whitespace-nowrap">
                    Beratung vereinbaren
                  </button>
                </Link>
              </div>

              {/* Mobile / Tablet Actions */}
              <div className="lg:hidden flex items-center gap-2 sm:gap-3">
                <button onClick={() => setIsSearchOpen(true)} className="p-2 text-gray-400 hover:text-white transition-colors" aria-label="Suche">
                  <SearchIcon size={18} />
                </button>
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 sm:p-2.5 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
                  aria-label="Menü umschalten"
                >
                  {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Global Search / Finder Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="absolute inset-0 bg-dark-950/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="relative w-full max-w-2xl glass-card rounded-[2.5rem] border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              <div className="p-6 border-b border-white/10 flex items-center gap-4">
                <SearchIcon className="text-cyan-500" size={24} />
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Was suchen Sie?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 text-xl font-display font-medium text-white placeholder:text-gray-600"
                />
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 bg-white/5 rounded-xl text-gray-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
                >
                  Esc
                </button>
              </div>
              <div className="max-h-[50vh] overflow-y-auto p-4 custom-scrollbar">
                {searchItems.length > 0 ? (
                  <div className="space-y-1">
                    {searchItems.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          navigate(item.path);
                          setIsSearchOpen(false);
                        }}
                        className="w-full text-left p-4 rounded-2xl hover:bg-white/5 transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-cyan-500 transition-colors">
                            <ArrowRight size={18} />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white group-hover:text-cyan-500 transition-colors">{item.name}</div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{item.category}</div>
                          </div>
                        </div>
                        <ArrowRight className="text-gray-700 group-hover:text-cyan-500 group-hover:translate-x-2 transition-all" size={16} />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center space-y-4">
                    <SearchIcon className="mx-auto text-gray-800" size={48} />
                    <p className="text-gray-500 text-sm uppercase tracking-widest font-bold">Keine Ergebnisse für "{searchQuery}"</p>
                  </div>
                )}
              </div>
              <div className="p-4 bg-dark-950/50 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                <div className="flex gap-4">
                  <span><kbd className="bg-white/5 px-1.5 py-0.5 rounded border border-white/10 mr-1">↑↓</kbd> Navigieren</span>
                  <span><kbd className="bg-white/5 px-1.5 py-0.5 rounded border border-white/10 mr-1">Enter</kbd> Auswählen</span>
                </div>
                <span>Viktor Finder v2.0</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-dark-950 flex flex-col items-center justify-center p-6 xl:hidden"
          >
            <div className="flex flex-col items-center gap-8 text-center">
              {[
                { name: 'Leistungen', path: '/services' },
                { name: 'Preise', path: '/pricing' },
                { name: 'Prozess', path: '/process' },
                { name: 'Projekte', path: '/portfolio' },
                { name: 'Über Uns', path: '/about' },
                { name: 'FAQ', path: '/faq' },
                { name: 'Kontakt', path: '/contact' },
              ].map((item) => (
                <Link 
                  key={item.path} 
                  to={item.path}
                  className="text-2xl font-display font-bold text-white hover:text-cyan-500"
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-8 flex flex-col gap-6 w-full max-w-xs">
                <Link to="/booking" className="w-full">
                  <button className="w-full h-16 rounded-2xl bg-cyan-500 text-dark-950 font-bold uppercase tracking-widest">
                    Anfrage starten
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main id="main-content" className="flex-1 flex flex-col" tabIndex={-1}>
        <AnimatePresence mode="wait">
          <PageTransition><Outlet /></PageTransition>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-dark-900 border-t border-white/5 py-24 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20 mb-20">
            <div>
              <Link to="/" className="flex items-center gap-4 mb-8 group">
                <div className="p-2 rounded-2xl overflow-hidden shrink-0">
                  <img 
                    src="/logo.png" 
                    alt="Viktor Labs Logo" 
                    className="h-14 w-auto object-contain rounded-xl" 
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="font-display font-medium text-2xl tracking-tight text-white leading-none">
                  VIKTOR<span className="text-cyan-500">LABS</span>
                </span>
              </Link>
              <p className="text-slate-400 text-sm leading-relaxed mb-10 max-w-xs font-light">
                Hochperformante Web-Architektur trifft auf immersive Ästhetik. Wir entwickeln intelligente Lösungen für Unternehmen, die den Standard im Netz setzen wollen.
              </p>
              <div className="flex items-center gap-4">
                {[1,2,3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-cyan-500/20 transition-all cursor-pointer group/social">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover/social:bg-cyan-500 transition-colors" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-white mb-10 opacity-50">Leistungen</h4>
              <ul className="space-y-5">
                {activeServices.length > 0 ? (
                  activeServices.slice(0, 4).map(s => (
                    <li key={s.id}>
                      <Link to={`/services/${s.id}`} className="text-sm text-slate-400 hover:text-cyan-500 transition-colors font-light">
                        {getTranslatedText(s.name, currentLang)}
                      </Link>
                    </li>
                  ))
                ) : (
                  <>
                    <li><Link to="/services" className="text-sm text-slate-400 hover:text-cyan-500 transition-colors font-light">Website Erstellung</Link></li>
                    <li><Link to="/services" className="text-sm text-slate-400 hover:text-cyan-500 transition-colors font-light">Design & Animation</Link></li>
                    <li><Link to="/services" className="text-sm text-slate-400 hover:text-cyan-500 transition-colors font-light">Website Verwaltung</Link></li>
                  </>
                )}
                <li><Link to="/pricing" className="text-sm text-slate-400 hover:text-cyan-500 transition-colors font-light">Preise & Optionen</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-white mb-10 opacity-50">Agentur</h4>
              <ul className="space-y-5">
                <li><Link to="/about" className="text-sm text-slate-400 hover:text-cyan-500 transition-colors font-light">Über Viktor Labs</Link></li>
                <li><Link to="/process" className="text-sm text-slate-400 hover:text-cyan-500 transition-colors font-light">Unser Prozess</Link></li>
                <li><Link to="/portfolio" className="text-sm text-slate-400 hover:text-cyan-500 transition-colors font-light">Referenzen</Link></li>
                <li><Link to="/faq" className="text-sm text-slate-400 hover:text-cyan-500 transition-colors font-light">Häufige Fragen</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-white mb-10 opacity-50">Kontakt</h4>
              <ul className="space-y-5">
                <li className="text-slate-400 text-sm font-light">contact@viktorlabs.dev</li>
                <li className="text-slate-400 text-sm font-light">+49 (0) 123 456789</li>
                <li className="pt-4">
                  <Link to="/booking" className="inline-flex h-12 px-8 rounded-full bg-cyan-500 text-white text-[10px] uppercase tracking-[0.2em] font-black items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(0,123,255,0.3)]">
                    Beratung vereinbaren
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-10">
              <Link to="/imprint" className="text-[9px] uppercase tracking-[0.3em] text-slate-600 hover:text-white transition-colors font-black">Impressum</Link>
              <Link to="/privacy" className="text-[9px] uppercase tracking-[0.3em] text-slate-600 hover:text-white transition-colors font-black">Datenschutz</Link>
            </div>
            <p className="text-[9px] uppercase tracking-[0.4em] text-slate-700 font-black">
              © {new Date().getFullYear()} VIKTOR LABS. <span className="text-slate-800">GERMAN ENGINEERING.</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Sticky Mobile Consultation Button */}
      <div className="fixed bottom-6 left-6 right-6 z-40 lg:hidden">
        <Link to="/booking">
          <button className="w-full h-16 rounded-2xl bg-white text-dark-950 font-bold shadow-2xl flex items-center justify-center gap-3">
            <MessageSquare size={20} />
            Kostenlose Beratung
          </button>
        </Link>
      </div>

      <CookieConsent />
    </div>
  );
}
