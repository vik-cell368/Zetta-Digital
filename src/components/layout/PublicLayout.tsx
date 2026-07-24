import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, MessageSquare, Search as SearchIcon, Command, Globe, Hexagon, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import PageTransition from "../PageTransition";
import { motion, AnimatePresence } from 'motion/react';
import CookieConsent from '../ui/CookieConsent';

export default function PublicLayout() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const currentLang = i18n.language.split('-')[0] || 'de';

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

  const searchItems = [
    { name: 'Home', path: '/', category: 'Seite' },
    { name: 'Leistungen', path: '/services', category: 'Seite' },
    { name: 'Webdesign', path: '/services/webdesign', category: 'Service' },
    { name: 'KI Automation', path: '/services/ai-automation', category: 'Service' },
    { name: 'KI Chatbots', path: '/services/ai-chatbots', category: 'Service' },
    { name: 'Workflow Automation', path: '/services/workflow-automation', category: 'Service' },
    { name: 'KI Automation Spezialseite', path: '/ai-automation', category: 'Seite' },
    { name: 'Preise & Kalkulator', path: '/pricing', category: 'Tool' },
    { name: 'Referenzen', path: '/portfolio', category: 'Seite' },
    { name: 'Häufige Fragen (FAQ)', path: '/faq', category: 'Support' },
    { name: 'Über uns', path: '/about', category: 'Agentur' },
    { name: 'Unser Prozess', path: '/process', category: 'Agentur' },
    { name: 'Kontakt', path: '/contact', category: 'Seite' },
    { name: 'Anfrage starten', path: '/booking', category: 'Kontakt' },
  ].filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-950 text-gray-100 font-sans selection:bg-cyan-500/30">
      
      {/* Navigation */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'py-4' : 'py-8'
        }`}
      >
        <div className="container mx-auto px-6">
          <div className={`mx-auto max-w-6xl rounded-full transition-all duration-500 flex items-center justify-between px-6 md:px-10 h-16 ${
            isScrolled ? 'glass-card border-white/10 bg-dark-900/60' : 'bg-transparent border-transparent'
          }`}>
            {/* Logo */}
            <Link to="/" className="flex items-center gap-4 group">
              <div className="relative">
                <Hexagon className="w-10 h-10 text-cyan-500 fill-cyan-500/5 group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-cyan-500/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="font-display font-medium text-2xl tracking-tight text-slate-50 flex items-center leading-none">
                Viktor<span className="text-cyan-500 ml-1 opacity-60">Labs</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-10">
              {[
                { name: 'Leistungen', path: '/services' },
                { name: 'Preise', path: '/pricing' },
                { name: 'Prozess', path: '/process' },
                { name: 'Projekte', path: '/portfolio' },
                { name: 'Über Uns', path: '/about' },
                { name: 'FAQ', path: '/faq' },
              ].map((item) => (
                <Link 
                  key={item.path} 
                  to={item.path}
                  className={`text-[11px] uppercase tracking-[0.3em] font-black transition-all hover:tracking-[0.4em] ${
                    location.pathname === item.path ? 'text-cyan-500' : 'text-slate-500 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4 md:gap-6">
              <div className="hidden lg:flex items-center gap-6">
                <Link to="/pricing" className="hidden xl:block">
                  <button className="text-[10px] uppercase tracking-[0.2em] font-black text-cyan-500 hover:text-white transition-colors flex items-center gap-2">
                    <Sparkles size={14} />
                    Kalkulator
                  </button>
                </Link>

                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all group"
                >
                  <SearchIcon size={14} />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Suchen</span>
                  <span className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                    <Command size={10} /> K
                  </span>
                </button>

                <div className="flex items-center gap-4">
                  {['DE', 'EN'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => changeLanguage(lang.toLowerCase())}
                      className={`text-[10px] font-black tracking-[0.2em] transition-colors ${
                        currentLang.toUpperCase() === lang ? 'text-cyan-500' : 'text-slate-500 hover:text-white'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
                <Link to="/booking">
                  <button className="h-14 px-10 rounded-full bg-white text-dark-950 text-[10px] uppercase tracking-[0.2em] font-black hover:bg-cyan-500 hover:scale-105 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.05)] active:scale-95">
                    Anfrage starten
                  </button>
                </Link>
              </div>

              {/* Mobile Actions */}
              <div className="lg:hidden flex items-center gap-4">
                <button onClick={() => setIsSearchOpen(true)} className="p-2 text-gray-400">
                  <SearchIcon size={20} />
                </button>
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 text-white"
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
            className="fixed inset-0 z-40 bg-dark-950 flex flex-col items-center justify-center p-6 lg:hidden"
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

      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <PageTransition><Outlet /></PageTransition>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-dark-950 border-t border-white/5 py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24 mb-20">
            <div className="col-span-1 lg:col-span-1">
              <Link to="/" className="flex items-center gap-3 mb-8 group">
                <Hexagon className="w-6 h-6 text-cyan-500 fill-cyan-500/10" />
                <span className="font-display font-bold text-xl tracking-tight text-slate-50 uppercase">
                  Viktor<span className="text-cyan-500 ml-1.5 opacity-80">Labs</span>
                </span>
              </Link>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                Wir digitalisieren Unternehmen mit High-End Websites und intelligenten KI-Lösungen. Modern, transparent und ergebnisorientiert.
              </p>
              <div className="flex items-center gap-4">
                {/* Socials placeholder */}
                {[1,2,3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-cyan-500/20 transition-colors cursor-pointer" />
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-white mb-8">Leistungen</h4>
              <ul className="space-y-4">
                <li><Link to="/services/webdesign" className="text-sm text-gray-500 hover:text-white transition-colors">Website Entwicklung</Link></li>
                <li><Link to="/services/ai-automation" className="text-sm text-gray-500 hover:text-white transition-colors">KI Automationen</Link></li>
                <li><Link to="/services/ai-chatbots" className="text-sm text-gray-500 hover:text-white transition-colors">Chatbots</Link></li>
                <li><Link to="/services/workflow-automation" className="text-sm text-gray-500 hover:text-white transition-colors">Workflow Automation</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-white mb-8">Agentur</h4>
              <ul className="space-y-4">
                <li><Link to="/about" className="text-sm text-gray-500 hover:text-white transition-colors">Über Uns</Link></li>
                <li><Link to="/process" className="text-sm text-gray-500 hover:text-white transition-colors">Unser Prozess</Link></li>
                <li><Link to="/portfolio" className="text-sm text-gray-500 hover:text-white transition-colors">Projekte</Link></li>
                <li><Link to="/pricing" className="text-sm text-gray-500 hover:text-white transition-colors">Preise</Link></li>
                <li><Link to="/faq" className="text-sm text-gray-500 hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-white mb-8">Kontakt</h4>
              <ul className="space-y-4">
                <li><Link to="/contact" className="text-sm text-gray-500 hover:text-white transition-colors">Kontaktformular</Link></li>
                <li className="text-slate-400 text-sm">hello@viktorlabs.de</li>
                <li className="text-slate-400 text-sm">+49 123 4567890</li>
                <li>
                  <Link to="/booking" className="text-sm text-cyan-500 font-bold hover:underline">
                    Jetzt Termin vereinbaren
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-8">
              <Link to="/imprint" className="text-[10px] uppercase tracking-widest text-gray-600 hover:text-white">Impressum</Link>
              <Link to="/privacy" className="text-[10px] uppercase tracking-widest text-gray-600 hover:text-white">Datenschutz</Link>
              <button className="text-[10px] uppercase tracking-widest text-gray-600 hover:text-white">Sitemap</button>
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">
              © {new Date().getFullYear()} VIKTOR LABS. ALL RIGHTS RESERVED.
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
