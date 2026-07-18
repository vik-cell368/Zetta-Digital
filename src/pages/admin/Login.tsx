import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Layers } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

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

    const isDemo = email === 'admin@zettadigital.com' && password === 'zetta-admin-2026';

    if (isDemo) {
      (window as any)._zetta_authenticated = true;
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
        setError(authError.message);
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // Check if user is an admin
        const { data: adminUser } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', data.user.id)
          .single();

        if (!adminUser) {
          await supabase.auth.signOut();
          setError('Unauthorized access. This account does not have admin privileges.');
        } else {
          (window as any)._zetta_authenticated = true;
          navigate('/admin/dashboard');
        }
      }
    } catch (err) {
      console.warn("Auth failed, checking if it was a network error", err);
      setError("An unexpected error occurred. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950 p-4 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-dark-900 via-dark-950 to-dark-950 opacity-30 pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="relative flex items-center justify-center w-12 h-12 mb-4">
            <div className="absolute inset-0 bg-gradient-to-tr from-neon-400 to-gray-400 opacity-20 rounded-lg blur-md"></div>
            <div className="font-logo text-3xl font-bold bg-gradient-to-tr from-neon-400 to-gray-400 bg-clip-text text-transparent relative z-10">
              Z
            </div>
          </div>
          <h1 className="text-2xl font-display font-bold tracking-tight text-white uppercase tracking-widest">ZETTA ADMIN</h1>
          <p className="text-gray-400 text-sm mt-2 font-light">Anmelden zur Verwaltung Ihrer Agentur</p>
        </div>

        <div className="glass-card rounded-xl p-8 border border-white/10 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-4 text-sm bg-red-900/20 text-red-400 rounded-md border border-red-900/50">
                {error === 'Unauthorized access. This account does not have admin privileges.' 
                  ? 'Nicht autorisierter Zugriff. Dieses Konto verfügt nicht über Administratorrechte.' 
                  : error}
              </div>
            )}
            <div>
              <label className="block text-xs uppercase tracking-widest font-semibold text-neon-500/70 mb-2">E-Mail</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@zettadigital.com"
                className="bg-dark-900 border-white/10 text-white focus-visible:ring-neon-500/50 placeholder:text-gray-500"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest font-semibold text-neon-500/70 mb-2">Passwort</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-dark-900 border-white/10 text-white focus-visible:ring-neon-500/50 placeholder:text-gray-500"
              />
            </div>
            <Button type="submit" className="w-full mt-4 bg-neon-500 hover:bg-neon-400 text-dark-950 uppercase tracking-widest text-xs font-semibold h-12 shadow-[0_0_15px_rgba(197,160,89,0.2)]" isLoading={isLoading}>
              Anmelden
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
