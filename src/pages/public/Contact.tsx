import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, ArrowRight } from 'lucide-react';

export default function Contact() {
  return (
    <div className="bg-dark-950 min-h-screen pt-40 pb-20">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header */}
        <div className="mb-32 space-y-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/[0.03] border border-white/10 text-cyan-500 text-[10px] uppercase tracking-[0.3em] font-black backdrop-blur-md"
          >
            Get in touch
          </motion.div>
          <h1 className="text-5xl md:text-8xl font-display font-medium text-white tracking-tight leading-[0.9]">
            LASSEN SIE <br /> <span className="text-slate-600">UNS RE-</span> <br /> <span className="text-white">DEN.</span>
          </h1>
          <p className="text-slate-400 text-xl md:text-2xl font-light leading-relaxed max-w-3xl">
            Ob konkretes Projekt oder erste Idee – wir freuen uns darauf, von Ihnen zu hören. Menschlich, direkt und ohne Marketing-Sprech.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          {/* Info Side */}
          <div className="space-y-16">
            <div className="space-y-12">
              <div className="flex items-start gap-8 group">
                <div className="w-16 h-16 rounded-[1.5rem] bg-white/[0.03] border border-white/10 flex items-center justify-center text-cyan-500 group-hover:bg-cyan-600 group-hover:text-white transition-all duration-500">
                  <Mail size={24} />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-500 mb-2">E-Mail</div>
                  <a href="mailto:hello@viktorlabs.de" className="text-2xl md:text-3xl font-display font-medium text-white hover:text-cyan-500 transition-colors">
                    hello@viktorlabs.de
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-8 group">
                <div className="w-16 h-16 rounded-[1.5rem] bg-white/[0.03] border border-white/10 flex items-center justify-center text-cyan-500 group-hover:bg-cyan-600 group-hover:text-white transition-all duration-500">
                  <Phone size={24} />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-500 mb-2">Telefon</div>
                  <a href="tel:+49123456789" className="text-2xl md:text-3xl font-display font-medium text-white hover:text-cyan-500 transition-colors">
                    +49 123 456 789
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-8 group">
                <div className="w-16 h-16 rounded-[1.5rem] bg-white/[0.03] border border-white/10 flex items-center justify-center text-cyan-500 group-hover:bg-cyan-600 group-hover:text-white transition-all duration-500">
                  <MapPin size={24} />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-500 mb-2">Office</div>
                  <div className="text-2xl md:text-3xl font-display font-medium text-white leading-tight">
                    Technologiepark 1 <br /> 10115 Berlin, Germany
                  </div>
                </div>
              </div>
            </div>

            <div className="p-12 rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-6">
              <h3 className="text-2xl font-display font-medium text-white">Bürozeiten</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-slate-400 font-light">
                  <span>Montag — Freitag</span>
                  <span>09:00 — 18:00</span>
                </div>
                <div className="flex justify-between text-slate-500 font-light">
                  <span>Samstag — Sonntag</span>
                  <span>Nach Absprache</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-white/[0.03] border border-white/10 rounded-[4rem] p-12 md:p-16 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <form className="space-y-10 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-500">Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-dark-950 border border-white/5 rounded-2xl h-16 px-6 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-light"
                    placeholder="Ihr Name"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-500">E-Mail</label>
                  <input 
                    type="email" 
                    className="w-full bg-dark-950 border border-white/5 rounded-2xl h-16 px-6 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-light"
                    placeholder="mail@beispiel.de"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-500">Betreff</label>
                <input 
                  type="text" 
                  className="w-full bg-dark-950 border border-white/5 rounded-2xl h-16 px-6 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-light"
                  placeholder="Wie können wir helfen?"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-500">Nachricht</label>
                <textarea 
                  className="w-full bg-dark-950 border border-white/5 rounded-[2rem] p-6 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-light min-h-[200px]"
                  placeholder="Ihre Vision..."
                />
              </div>
              <button className="w-full h-20 rounded-full bg-cyan-600 text-white font-black uppercase tracking-[0.2em] text-xs hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-4 group/btn">
                Nachricht senden
                <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
