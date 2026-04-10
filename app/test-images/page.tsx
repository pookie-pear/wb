'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TestImagesPage() {
  const [url, setUrl] = useState('');
  
  const testImages = [
    { name: 'Golden Link (ImgBB)', url: 'https://i.ibb.co/QwqRbG3/uma-musume-mambo.png' },
    { name: 'Uploadcare (Preview)', url: 'https://xfodkxwnd4.ucarecd.net/04782071-44b7-419b-bb30-ea1f752bec62/-/preview/194x259/' },
    { name: 'Placeholder', url: 'https://placehold.co/600x400/000000/FFFFFF?text=PLACEHOLDER' },
  ];

  return (
    <div className="bg-black min-h-screen text-white p-12 font-mono">
      <h1 className="text-2xl mb-8 uppercase tracking-widest border-b border-white/10 pb-4">Image Diagnostics</h1>
      
      <div className="mb-12 space-y-4">
        <p className="text-xs text-white/40">Paste a link below to test if it loads in your browser on this domain:</p>
        <div className="flex gap-4">
          <input 
            type="text" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 p-3 text-xs focus:outline-none"
            placeholder="Paste URL here..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {/* Manual Test */}
        {url && (
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase text-blue-500">Manual Test</h2>
            <div className="aspect-square bg-[#0a0a0a] border border-white/10 relative overflow-hidden">
              <img 
                src={url} 
                alt="Test" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onLoad={() => console.log('Manual Load Success:', url)}
                onError={(e) => console.error('Manual Load Fail:', url)}
              />
            </div>
            <p className="text-[10px] break-all text-white/40">{url}</p>
          </div>
        )}

        {/* Predefined Tests */}
        {testImages.map((img, i) => (
          <div key={i} className="space-y-4">
            <h2 className="text-xs font-bold uppercase text-white/60">{img.name}</h2>
            <div className="aspect-square bg-[#0a0a0a] border border-white/10 relative overflow-hidden">
              <img 
                src={img.url} 
                alt={img.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onLoad={() => console.log('Success:', img.name)}
                onError={(e) => console.error('Fail:', img.name)}
              />
            </div>
            <p className="text-[10px] break-all text-white/20">{img.url}</p>
          </div>
        ))}
      </div>

      <div className="mt-24 pt-8 border-t border-white/10">
        <Link href="/" className="text-xs uppercase tracking-widest text-white/40 hover:text-white transition">
          &larr; Back to Archive
        </Link>
      </div>
    </div>
  );
}
