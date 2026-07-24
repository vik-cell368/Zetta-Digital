import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './Button';
import { Cookie, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function CookieConsent() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('viktor_labs_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('viktor_labs_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('viktor_labs_cookie_consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-sm z-50"
        >
          <div className="bg-dark-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl shadow-black/50">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 flex items-center justify-center shrink-0">
                <Cookie className="w-5 h-5 text-cyan-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-slate-50 font-medium">Cookie-Einstellungen</h3>
                  <button onClick={() => setIsVisible(false)} className="text-slate-500 hover:text-slate-50 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  Wir verwenden Cookies, um Ihre Erfahrung zu verbessern und unseren Service zu analysieren. Mit Klick auf "Akzeptieren" stimmen Sie der Verwendung zu.
                </p>
                <div className="flex gap-3">
                  <Button onClick={handleAccept} className="flex-1 bg-cyan-500 text-dark-950 font-bold text-xs h-10 rounded-xl">
                    Akzeptieren
                  </Button>
                  <Button variant="outline" onClick={handleDecline} className="flex-1 border-white/10 text-slate-50 font-bold text-xs h-10 rounded-xl">
                    Ablehnen
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
