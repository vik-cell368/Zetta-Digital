import React from 'react';
import { motion } from 'motion/react';
import { 
  Bot, 
  Zap, 
  BarChart3, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Workflow, 
  Database, 
  Mail,
  Cpu,
  MousePointer2,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

const FEATURES = [
  {
    title: "Email Automation",
    desc: "KI-gestützte Beantwortung von Anfragen und automatische Kategorisierung von E-Mails.",
    icon: <Mail className="w-6 h-6" />,
    color: "bg-blue-500"
  },
  {
    title: "Workflow Optimierung",
    desc: "Verbinden Sie Ihre Tools (Zapier, Make) mit KI, um repetitive Aufgaben zu eliminieren.",
    icon: <Workflow className="w-6 h-6" />,
    color: "bg-purple-500"
  },
  {
    title: "KI-Datenanalyse",
    desc: "Lassen Sie die KI Ihre Verkaufszahlen analysieren und Trends vorhersagen.",
    icon: <Database className="w-5 h-5" />,
    color: "bg-cyan-500"
  },
  {
    title: "Intelligente Formulare",
    desc: "Qualifizieren Sie Leads automatisch vor, bevor sie in Ihrem Posteingang landen.",
    icon: <CheckCircle2 className="w-6 h-6" />,
    color: "bg-green-500"
  }
];

import ROICalculator from '../../components/tools/ROICalculator';
import DigitalisierungsCheck from '../../components/tools/DigitalisierungsCheck';

export default function AIAutomation() {
  return (
    <div className="bg-dark-950 min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center gap-20 mb-32">
          <div className="flex-1 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 text-[10px] uppercase tracking-widest font-bold"
            >
              <Cpu className="w-3 h-3" />
              Efficiency First
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-display font-bold text-white leading-[1.1] tracking-tight"
            >
              Arbeiten Sie <span className="text-cyan-500">nicht mehr</span> für Ihre Prozesse.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-lg md:text-xl max-w-xl leading-relaxed"
            >
              Wir implementieren maßgeschneiderte KI-Lösungen, die Ihre täglichen Aufgaben automatisieren, Kosten senken und Ihrem Team Zeit für das Wesentliche geben.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/booking">
                <button className="h-16 px-10 rounded-2xl bg-white text-dark-950 font-bold hover:bg-cyan-500 transition-all flex items-center gap-3 active:scale-95">
                  Potenzial-Analyse
                  <ArrowRight size={20} />
                </button>
              </Link>
            </motion.div>
          </div>

          <div className="flex-1 relative w-full lg:w-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative aspect-square max-w-[500px] mx-auto"
            >
              {/* Decorative rings */}
              <div className="absolute inset-0 border border-white/5 rounded-full animate-ping-slow" />
              <div className="absolute inset-4 border border-white/5 rounded-full" />
              <div className="absolute inset-12 border border-cyan-500/10 rounded-full" />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 bg-cyan-500/20 rounded-full blur-[100px]" />
                <div className="relative glass-card border-white/10 p-12 rounded-[3rem] shadow-2xl flex items-center justify-center">
                  <Bot size={80} className="text-cyan-500" />
                  
                  {/* Floating elements */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-6 -right-6 glass-card p-4 rounded-2xl border-white/10 shadow-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-[10px] uppercase tracking-widest font-bold">Active</span>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -bottom-6 -left-6 glass-card p-4 rounded-2xl border-white/10 shadow-xl"
                  >
                    <div className="flex items-center gap-3">
                      <Zap size={16} className="text-cyan-500" />
                      <span className="text-[10px] uppercase tracking-widest font-bold">+450% ROI</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Tools Section */}
        <div className="mb-40 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ROICalculator />
          <DigitalisierungsCheck />
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-40">
          {[
            { label: "Zeitersparnis", value: "85%", desc: "bei administrativen Aufgaben" },
            { label: "Kostensenkung", value: "60%", desc: "durch Prozess-Automation" },
            { label: "Verfügbarkeit", value: "24/7", desc: "KI-Systeme schlafen nie" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-10 rounded-[2.5rem] border-white/5 text-center"
            >
              <div className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-4">{stat.label}</div>
              <div className="text-5xl font-display font-bold text-white mb-4">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.desc}</div>
            </motion.div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="mb-40">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white">Lösungen für Ihr <span className="text-cyan-500">Wachstum</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Vom einfachen Chatbot bis zur komplexen Workflow-Automation – wir decken das gesamte Spektrum ab.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group glass-card p-10 rounded-[3rem] border-white/5 hover:border-cyan-500/30 transition-all cursor-default"
              >
                <div className={`w-14 h-14 rounded-2xl ${f.color} bg-opacity-10 flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-4">{f.title}</h3>
                <p className="text-gray-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Process Section */}
        <div className="mb-40 bg-dark-900 rounded-[4rem] p-12 md:p-24 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 blur-[100px]" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white">In 3 Schritten zur <span className="text-cyan-500">Automation</span></h2>
              <p className="text-gray-400 text-lg">Unser bewährter Prozess garantiert eine reibungslose Implementierung ohne Ausfallzeiten.</p>
              
              <div className="space-y-12 pt-8">
                {[
                  { step: "01", title: "Analyse", desc: "Wir identifizieren die größten Hebel für Automation in Ihrem Unternehmen." },
                  { step: "02", title: "Entwicklung", desc: "Maßgeschneiderte KI-Workflows werden entwickelt und intensiv getestet." },
                  { step: "03", title: "Go-Live", desc: "Nahtlose Integration in Ihre bestehende Systemlandschaft." },
                ].map((s, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="text-cyan-500 font-display font-bold text-2xl">{s.step}</div>
                    <div className="space-y-2">
                      <h4 className="text-white font-bold text-xl">{s.title}</h4>
                      <p className="text-gray-500 text-sm">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-full aspect-square glass-card rounded-[3rem] border-white/10 p-8 relative">
                 <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-[3rem]" />
                 <div className="relative space-y-6">
                    <div className="flex items-center justify-between mb-8">
                      <span className="text-xs uppercase tracking-widest font-bold text-gray-500">Live Dashboard</span>
                      <Sparkles className="text-cyan-500 w-4 h-4" />
                    </div>
                    
                    {[1,2,3,4].map(i => (
                      <div key={i} className="h-12 bg-white/5 rounded-xl border border-white/5 flex items-center px-4 justify-between group overflow-hidden">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-cyan-500' : 'bg-blue-500'}`} />
                          <div className="h-2 w-24 bg-white/10 rounded-full" />
                        </div>
                        <div className="h-2 w-12 bg-white/10 rounded-full" />
                        <motion.div 
                          className="absolute inset-0 bg-cyan-500/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                        />
                      </div>
                    ))}
                    
                    <div className="pt-8 grid grid-cols-2 gap-4">
                      <div className="h-24 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-2">
                        <span className="text-2xl font-bold text-white">42k</span>
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest">Tasks</span>
                      </div>
                      <div className="h-24 bg-cyan-500 rounded-2xl flex flex-col items-center justify-center gap-2">
                        <span className="text-2xl font-bold text-dark-950">99.9%</span>
                        <span className="text-[10px] text-dark-950/60 uppercase tracking-widest">Uptime</span>
                      </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center max-w-4xl mx-auto space-y-12">
          <h2 className="text-5xl md:text-7xl font-display font-bold text-white">Bereit für das nächste <span className="text-cyan-500">Level?</span></h2>
          <p className="text-gray-400 text-xl">Lassen Sie uns gemeinsam herausfinden, wie viel Zeit und Geld Sie durch KI-Automation sparen können.</p>
          <div className="flex justify-center gap-6">
            <Link to="/booking">
              <button className="h-20 px-12 rounded-[2rem] bg-cyan-500 text-dark-950 font-bold text-lg hover:scale-105 transition-all shadow-[0_0_50px_rgba(197,160,89,0.3)]">
                Kostenloses Erstgespräch
              </button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
