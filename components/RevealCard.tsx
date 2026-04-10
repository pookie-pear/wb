'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IProduct } from '@/models/Product';

export default function RevealCard({ product }: { product: IProduct }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="block">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#0a0a0a]">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover transition duration-500 ${revealed ? 'blur-0' : 'blur-md brightness-[0.7]'}`}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[8px] uppercase tracking-widest text-white/20">
            No Image
          </div>
        )}
        {!revealed && (
          <button
            onClick={() => setRevealed(true)}
            className="absolute inset-0 flex items-center justify-center text-[9px] font-black uppercase tracking-[0.4em] bg-black/40 text-white hover:bg-black/60 transition"
          >
            Reveal
          </button>
        )}
        {revealed && <Link href={`/product/${product._id}`} className="absolute inset-0" />}
      </div>
      <div className="mt-4 text-[10px] font-bold text-white uppercase tracking-[0.3em]">{product.name}</div>
    </div>
  );
}
