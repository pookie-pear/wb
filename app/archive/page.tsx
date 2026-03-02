import connectDB from '@/lib/mongodb';
import Product, { IProduct } from '@/models/Product';
import Link from 'next/link';
import Image from 'next/image';
import RevealCard from '@/components/RevealCard';

async function getAll(): Promise<IProduct[]> {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(products));
  } catch {
    return [];
  }
}

export default async function ArchivePage() {
  const products = await getAll();
  const highDemand = products.filter(p => (p.archiveTags?.includes('high_demand')) || ((p.rating || 0) >= 4.7 && (p.numReviews || 0) >= 10));
  const runningOut = products.filter(p => (p.archiveTags?.includes('running_out')) || ((p.countInStock || 0) > 0 && (p.countInStock || 0) <= 5));
  const olderDesigns = products.filter(p => p.archiveTags?.includes('older')).length ? products.filter(p => p.archiveTags?.includes('older')) : [...products].reverse();
  const rareDrops = products.filter(p => (p.archiveTags?.includes('rare_drop')) || ((p.price || 0) >= 200 || (p.rating || 0) >= 4.8));

  return (
    <div className="bg-transparent min-h-screen relative z-10">
      <div className="w-full px-8 md:px-24 pt-24">
        <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-8">
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-sm tracking-[0.6em] uppercase font-light text-white">
              DENIM<span className="font-bold">HAZE</span>
            </Link>
            <div className="text-[10px] font-black uppercase tracking-[0.6em] text-white/40 italic">
              The Archive
            </div>
          </div>
        </div>

        <section className="mb-24">
          <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-white/40 mb-8">Older Designs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-16 gap-y-32">
            {olderDesigns.slice(0, 8).map(p => (
              <Link key={p._id as string} href={`/product/${p._id}`} className="group block">
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#0a0a0a]">
                  <Image src={p.image} alt={p.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute bottom-3 left-3 text-[9px] font-bold uppercase tracking-[0.3em] text-white/60">
                    {p.fit} / {p.wash}
                  </div>
                </div>
                <div className="mt-4 text-[10px] font-bold text-white uppercase tracking-[0.3em]">{p.name}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-24">
          <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-white/40 mb-8">High Demand</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-16 gap-y-32">
            {highDemand.map(p => (
              <Link key={p._id as string} href={`/product/${p._id}`} className="group block">
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#0a0a0a]">
                  <Image src={p.image} alt={p.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute top-3 right-3 text-[8px] font-bold text-white uppercase tracking-[0.3em] bg-black/40 backdrop-blur-md px-2 py-1">
                    Trending
                  </div>
                </div>
                <div className="mt-4 text-[10px] font-bold text-white uppercase tracking-[0.3em]">{p.name}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-24">
          <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-white/40 mb-8">Running Out</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-16 gap-y-32">
            {runningOut.map(p => (
              <Link key={p._id as string} href={`/product/${p._id}`} className="group block">
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#0a0a0a]">
                  <Image src={p.image} alt={p.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute top-3 right-3 text-[8px] font-bold text-white uppercase tracking-[0.3em] bg-black/40 backdrop-blur-md px-2 py-1">
                    Last Pieces
                  </div>
                </div>
                <div className="mt-4 text-[10px] font-bold text-white uppercase tracking-[0.3em]">{p.name}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-24">
          <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-white/40 mb-8">Rare Drops</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-16 gap-y-32">
            {rareDrops.map(p => (
              <div key={p._id as string} className="group">
                <RevealCard product={p as any} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

 
