'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      // In a real app, we'd log them in here. For now, redirect to login.
      router.push('/login');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#020202] min-h-screen relative flex items-center justify-center py-24 px-6 md:px-12">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(20,20,20,1)_0%,_rgba(0,0,0,1)_100%)] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md">
        <Link 
          href="/" 
          className="inline-flex items-center space-x-2 text-[10px] font-bold uppercase tracking-[0.5em] text-white/30 hover:text-white transition-colors mb-16 italic"
        >
          <ChevronLeft className="w-3 h-3" />
          <span>BACK TO HAZE</span>
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extralight uppercase tracking-tighter text-white mb-4">
            JOIN THE <span className="font-medium">ARCHIVE</span>
          </h1>
          <p className="text-[10px] tracking-[0.6em] text-white/40 uppercase font-bold italic">
            CREATE AN ACCOUNT
          </p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500/30 text-red-500 text-[10px] font-bold uppercase tracking-[0.2em] p-4 mb-8 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2 border-b border-white/10 pb-2">
            <label className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/40">NAME</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-transparent text-white text-[11px] tracking-[0.2em] uppercase focus:outline-none placeholder:text-gray-800"
              placeholder="YOUR NAME"
            />
          </div>

          <div className="space-y-2 border-b border-white/10 pb-2">
            <label className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/40">EMAIL</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-transparent text-white text-[11px] tracking-[0.2em] uppercase focus:outline-none placeholder:text-gray-800"
              placeholder="EMAIL ADDRESS"
            />
          </div>

          <div className="space-y-2 border-b border-white/10 pb-2">
            <label className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/40">PASSWORD</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-transparent text-white text-[11px] tracking-[0.2em] focus:outline-none placeholder:text-gray-800"
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-2 border-b border-white/10 pb-2">
            <label className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/40">CONFIRM PASSWORD</label>
            <input
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full bg-transparent text-white text-[11px] tracking-[0.2em] focus:outline-none placeholder:text-gray-800"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-5 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-black hover:text-white border border-white transition-all duration-500 disabled:opacity-50"
          >
            {loading ? 'INITIALIZING...' : 'REGISTER ACCOUNT'}
          </button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-[9px] tracking-[0.3em] text-white/30 uppercase font-bold italic">
            ALREADY IN THE HAZE?{' '}
            <Link href="/login" className="text-white hover:text-white/60 transition-colors">
              LOG IN
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
