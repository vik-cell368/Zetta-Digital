import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, Instagram, Twitter, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

export default function Contact() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-24"
        >
          <h1 className="text-6xl md:text-8xl font-serif text-white mb-8 tracking-tight italic">Kontakt</h1>
          <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
            Haben Sie ein Projekt im Kopf oder möchten Sie einfach nur "Hallo" sagen? Wir freuen uns auf Ihre Nachricht.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <div className="space-y-12 mb-20">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-neon-500 mr-6 shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">E-Mail</h4>
                  <a href="mailto:hello@zettadigital.com" className="text-2xl text-white font-serif italic hover:text-neon-400 transition-colors">
                    hello@zettadigital.com
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-neon-500 mr-6 shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">Telefon</h4>
                  <a href="tel:+491234567890" className="text-2xl text-white font-serif italic hover:text-neon-400 transition-colors">
                    +49 (0) 123 456 789 0
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-neon-500 mr-6 shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">Office</h4>
                  <p className="text-2xl text-white font-serif italic leading-snug">
                    Berlin, Deutschland<br />
                    Digital First Agency
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-8">Social Media</h4>
              <div className="flex space-x-6">
                {[Instagram, Twitter, Linkedin].map((Icon, i) => (
                  <a key={i} href="#" className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white hover:bg-neon-500 hover:text-dark-950 transition-all">
                    <Icon className="w-6 h-6" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-dark-900/40 backdrop-blur-md border border-white/5 rounded-[3rem] p-12">
            <form className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-3">Name</label>
                  <Input placeholder="Ihr Name" className="bg-dark-950 border-white/5 focus:border-neon-500" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-3">E-Mail</label>
                  <Input type="email" placeholder="ihre@mail.de" className="bg-dark-950 border-white/5 focus:border-neon-500" />
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-3">Thema</label>
                <Input placeholder="Worum geht es?" className="bg-dark-950 border-white/5 focus:border-neon-500" />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-3">Nachricht</label>
                <Textarea placeholder="Erzählen Sie uns von Ihrem Projekt..." className="bg-dark-950 border-white/5 focus:border-neon-500 min-h-[150px]" />
              </div>

              <Button className="w-full py-8 text-lg group">
                Nachricht senden
                <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
