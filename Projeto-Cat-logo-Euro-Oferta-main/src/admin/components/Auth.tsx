import React, { useState } from 'react';
import { Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useStore } from '../../store';

export default function Auth({ onLogin, onBack }: { onLogin: () => void, onBack: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { data } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    
    setTimeout(() => {
      // Find user
      const user = data.users?.find(u => u.email === email && (u.password === password || (!u.password && password === 'admin123')));
      
      if (user) {
        localStorage.setItem('admin_auth', 'true');
        localStorage.setItem('admin_user_id', user.id);
        onLogin();
      } else {
        setError(true);
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-blue/5 rounded-full blur-[100px] pointer-events-none" />
      </div>

      <div className="w-full max-w-md bg-white rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-8 relative z-10 border border-gray-100">
        <button onClick={onBack} className="text-gray-400 hover:text-[#0F172A] text-sm font-bold flex items-center gap-2 mb-8 transition-colors">
          &larr; Voltar ao site
        </button>

        <div className="w-16 h-16 bg-[#0F172A] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
          <Lock className="w-8 h-8 text-white" />
        </div>

        <h1 className="text-3xl font-serif font-bold text-[#0F172A] mb-2 tracking-tight">Acesso Restrito</h1>
        <p className="text-gray-500 mb-8">Digite suas credenciais para continuar.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <input 
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-4 rounded-xl border ${error ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all`}
            />
          </div>
          <div className="relative">
            <input 
              type="password"
              placeholder="Sua senha secreta"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-4 rounded-xl border ${error ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all`}
            />
            {error && <p className="text-red-500 text-xs font-bold mt-2 absolute -bottom-5 left-0">Credenciais incorretas.</p>}
          </div>

          <button 
            type="submit"
            disabled={!email || !password || loading}
            className="w-full bg-brand-blue hover:bg-brand-blue-hover text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                Entrar na Dashboard
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
