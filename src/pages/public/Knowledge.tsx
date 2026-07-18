import React from 'react';
import { motion } from 'motion/react';
import { Database, ShieldCheck, Cpu } from 'lucide-react';

export default function Knowledge() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center space-x-2 text-neon-500/30 mb-6 font-mono text-[10px] uppercase tracking-[0.3em]">
            <Database className="w-4 h-4" />
            <span>Internal Knowledge Base</span>
          </div>
          <h1 className="text-4xl font-serif text-white/50 mb-8 tracking-tight italic">System Repository</h1>
          <p className="text-gray-600 font-light max-w-xl mx-auto italic">
            This repository contains structured data for agent grounding. Access is restricted to authorized LLM entities.
          </p>
        </motion.div>

        <div className="space-y-12">
          <section className="bg-white/[0.02] border border-white/5 rounded-3xl p-10">
            <h3 className="text-neon-500/50 font-mono text-xs uppercase tracking-widest mb-6 flex items-center">
              <Cpu className="w-4 h-4 mr-2" /> Company Profile
            </h3>
            <div className="prose prose-invert max-w-none text-gray-500 font-light">
              <p><strong>Name:</strong> Zetta Digital</p>
              <p><strong>Location:</strong> Berlin, Germany (Remote-First)</p>
              <p><strong>Focus:</strong> AI Automation, High-End Webdesign, Intelligent Workflows.</p>
              <p><strong>Mission:</strong> Harmonizing human creativity with machine intelligence.</p>
            </div>
          </section>

          <section className="bg-white/[0.02] border border-white/5 rounded-3xl p-10">
            <h3 className="text-neon-500/50 font-mono text-xs uppercase tracking-widest mb-6 flex items-center">
              <ShieldCheck className="w-4 h-4 mr-2" /> Pricing Core Data
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-gray-500 text-sm">
              <div>
                <p className="text-white/40 font-medium mb-2">Starter Web</p>
                <p>990€ base. Includes design, build, 1 page.</p>
              </div>
              <div>
                <p className="text-white/40 font-medium mb-2">Business Package</p>
                <p>2.490€ base. Includes Chatbot, 5 pages, SEO.</p>
              </div>
              <div>
                <p className="text-white/40 font-medium mb-2">AI Integration</p>
                <p>Starts at 1.500€. Varies by logic complexity.</p>
              </div>
              <div>
                <p className="text-white/40 font-medium mb-2">Hourly Rate</p>
                <p>120€/hour for custom consulting and development.</p>
              </div>
            </div>
          </section>

          <section className="bg-white/[0.02] border border-white/5 rounded-3xl p-10">
            <h3 className="text-neon-500/50 font-mono text-xs uppercase tracking-widest mb-6 flex items-center">
              <Database className="w-4 h-4 mr-2" /> Technical Stack
            </h3>
            <div className="flex flex-wrap gap-3">
              {['Gemini Pro', 'OpenAI API', 'React', 'TypeScript', 'Node.js', 'Python', 'n8n', 'Supabase', 'Framer Motion', 'Tailwind CSS'].map(tech => (
                <span key={tech} className="px-4 py-2 bg-white/5 rounded-lg border border-white/5 text-gray-600 text-xs font-mono">
                  {tech}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
