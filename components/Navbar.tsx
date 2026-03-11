'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Search, ShoppingBag, Menu, User as UserIcon, LogOut, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const { totalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (err) {
        console.error('User load error', err);
        setUser(null);
      }
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-transparent backdrop-blur-sm h-16 px-10 md:px-20 flex items-center justify-between border-b border-white/5">
      {/* Left - Menu + Brand */}
      <div className="flex-1 flex items-center space-x-4">
        <button className="text-white/40 hover:text-white transition-colors">
          <Menu className="w-4 h-4" />
        </button>
        <Link href="/" className="text-sm tracking-[0.6em] uppercase font-light text-white">
          DENIM<span className="font-bold">HAZE</span>
        </Link>
      </div>

      {/* Center - Search Bar */}
      <div className="flex-1 flex justify-center">
        <form onSubmit={handleSearch} className="w-full max-w-xl flex items-center space-x-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search denim, fit, wash, size..."
            className="w-full bg-white/5 border border-white/10 text-white placeholder-white/40 text-xs uppercase tracking-[0.3em] px-4 py-2 focus:outline-none focus:border-white/30"
          />
          <button
            type="submit"
            className="p-2 border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Right - Icons (Bag, User, Curator) */}
      <div className="flex-1 flex items-center justify-end space-x-10">
        <div className="hidden lg:flex items-center space-x-8 text-[9px] tracking-[0.4em] uppercase font-bold text-white/40">
          <Link href="/archive" className="hover:text-white transition-colors">Archive</Link>
          {user?.isAdmin && (
            <Link href="/admin/products" className="text-blue-500 hover:text-blue-400 transition-colors flex items-center space-x-2">
              <Shield className="w-3 h-3" />
              <span>CURATOR</span>
            </Link>
          )}
        </div>

        <div className="flex items-center space-x-6">
          <Link href="/cart" className="relative group">
            <ShoppingBag className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-black text-[7px] font-black w-3 h-3 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center space-x-6">
              <span className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em] italic hidden sm:inline-block">
                {user.name}
              </span>
              <button 
                onClick={handleLogout}
                className="text-white/40 hover:text-red-500 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link href="/login" className="text-white/40 hover:text-white transition-colors">
              <UserIcon className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
