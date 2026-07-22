import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, ArrowRight, ClipboardCheck, Sparkles } from 'lucide-react';

const QUESTIONS = [
  { id: 1, q: "Haben Sie eine moderne, responsive Website?", weight: 20 },
  { id: 2, q: "Nutzen Sie automatisierte E-Mail-Antworten?", weight: 15 },
  { id: 3, q: "Werden Leads automatisch in ein CRM übertragen?", weight: 20 },
  { id: 4, q: "Können Kunden Termine online buchen?", weight: 15 },
  { id: 5, q: "Nutzen Sie KI-Chatbots für den Support?", weight: 30 }
];

export default function DigitalisierungsCheck() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [step, setStep] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const score = Object.entries(answers).reduce((acc, [id, val]) => {
    if (val) {
      const q = QUESTIONS.find(q => q.id === parseInt(id));
      return acc + (q?.weight || 0);
    }
    return acc;
  }, 0);

  const handleAnswer = (val: boolean) => {
    setAnswers(prev => ({ ...prev, [QUESTIONS[step].id]: val }));
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setShowResult(true);
    }
  };

  return (
    <div className="glass-card p-10 rounded-[3rem] border-white/10 shadow-2xl h-full flex flex-col justify-between">
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neon-500/10 flex items-center justify-center text-neon-500">
            <ClipboardCheck size={20} />
          </div>
          <h3 className="text-2xl font-display font-bold text-white">Digital-Check</h3>
        </div>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-sm text-gray-500 font-mono">FRAGE {step + 1} VON {QUESTIONS.length}</div>
              <p className="text-xl font-bold text-white leading-tight">{QUESTIONS[step].q}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => handleAnswer(true)}
                  className="h-14 rounded-2xl bg-white/5 border border-white/10 hover:border-neon-500 transition-all font-bold text-sm"
                >
                  Ja
                </button>
                <button 
                  onClick={() => handleAnswer(false)}
                  className="h-14 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/50 transition-all font-bold text-sm"
                >
                  Nein
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="relative inline-block">
                 <svg className="w-32 h-32 transform -rotate-90">
                    <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                    <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" 
                      strokeDasharray={377}
                      strokeDashoffset={377 - (377 * score) / 100}
                      className="text-neon-500 transition-all duration-1000" 
                    />
                 </svg>
                 <div className="absolute inset-0 flex items-center justify-center text-3xl font-display font-bold text-white">
                   {score}%
                 </div>
              </div>
              <h4 className="text-xl font-bold text-white">Ihr Ergebnis</h4>
              <p className="text-gray-500 text-sm">
                {score < 50 ? "Es gibt großes Potenzial für Optimierungen." : "Sie sind auf einem guten Weg, aber KI kann Sie noch weiter bringen."}
              </p>
              <button 
                onClick={() => { setStep(0); setShowResult(false); setAnswers({}); }}
                className="text-xs uppercase tracking-widest font-bold text-neon-500 hover:underline"
              >
                Test wiederholen
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="pt-8 mt-8 border-t border-white/5">
        <button className="w-full h-14 bg-neon-500 text-dark-950 rounded-2xl text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-3 active:scale-95 transition-all">
          Gratis Strategie-Call
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
