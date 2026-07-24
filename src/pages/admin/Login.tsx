import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Shield, Lock, Fingerprint, Bot, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const isDemo = email === 'admin@viktorlabs.ai' && password === 'viktor-admin-2026';

    if (isDemo) {
      sessionStorage.setItem('_viktor_authenticated', 'true');
      navigate('/admin/dashboard');
      setIsLoading(false);
      return;
    }

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message === 'Invalid login credentials' ? 'Ungültige E-Mail oder Passwort.' : authError.message);
        setIsLoading(false);
        return;
      }

      if (data.user) {
        const { data: adminUser, error: dbError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', data.user.id)
          .single();

        if (dbError || !adminUser) {
          setError('Keine Administratorberechtigung für dieses Konto.');
          await supabase.auth.signOut();
        } else {
          sessionStorage.setItem('_viktor_authenticated', 'true');
          navigate('/admin/dashboard');
        }
      }
    } catch (err) {
      console.warn("Auth failed", err);
      setError("Anmeldefunktion momentan nicht verfügbar. Bitte nutzen Sie den Demo-Login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950 p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/5 via-dark-950 to-dark-950 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="w-full max-w-xl relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-12 text-center"
        >
          <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500 mb-6 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
            <Shield size={32} />
          </div>
          <h1 className="text-4xl font-display font-bold text-slate-50 tracking-tight mb-3">
            Secure Gateway
          </h1>
          <p className="text-slate-500 text-sm max-w-xs font-medium uppercase tracking-[0.2em]">
            Viktor Labs Administration
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-[3rem] p-10 md:p-14 border border-white/5 shadow-2xl relative"
        >
          {/* Security Status Bar */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-dark-950 border border-white/10 px-6 py-2 rounded-full flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">System Ready</span>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm font-bold"
              >
                <AlertCircle size={18} />
                {error}
              </motion.div>
            )}

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-2">Authorized ID</label>
                <div className="relative">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@viktorlabs.ai"
                    className="h-16 bg-white/5 border-white/5 text-white focus:border-cyan-500/50 rounded-2xl px-6 transition-all"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600">
                    <Bot size={18} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-2">Access Key</label>
                <div className="relative">
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="h-16 bg-white/5 border-white/5 text-white focus:border-cyan-500/50 rounded-2xl px-6 transition-all"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600">
                    <Lock size={18} />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-16 bg-cyan-500 text-dark-950 font-bold uppercase tracking-widest text-xs rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_40px_rgba(6,182,212,0.2)] flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-dark-950/20 border-t-dark-950 rounded-full animate-spin" />
                ) : (
                  <>
                    <Fingerprint size={18} />
                    Verify Identity
                  </>
                )}
              </Button>
              
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@viktorlabs.ai');
                  setPassword('viktor-admin-2026');
                }}
                className="w-full text-center text-[10px] uppercase tracking-widest font-bold text-slate-500 hover:text-slate-50 transition-colors py-2"
              >
                Use Emergency Credentials
              </button>
            </div>
          </form>
        </motion.div>

        {/* Footer Info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-[10px] text-gray-600 uppercase tracking-[0.4em] font-bold">
            Protected by Advanced AI Encryption
          </p>
        </motion.div>
      </div>
    </div>
  );
}

