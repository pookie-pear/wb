import connectDB from '@/lib/mongodb';
import Product, { IProduct } from '@/models/Product';
import ProductCard from '@/components/ProductCard';
import Hero3D from '@/components/Hero3D';
import Filters from '@/components/Filters';
import Link from 'next/link';

async function getProducts(searchParams: any): Promise<IProduct[]> {
  try {
    await connectDB();
    
    const query: any = {};
    
    if (searchParams.search) {
      query.name = { $regex: searchParams.search, $options: 'i' };
    }
    if (searchParams.fit) {
      query.fit = searchParams.fit;
    }
    if (searchParams.wash) {
      query.wash = searchParams.wash;
    }
    if (searchParams.gender) {
      query.gender = searchParams.gender;
    }
    if (searchParams.size) {
      query.waistSizes = parseInt(searchParams.size);
    }

    let productsQuery = Product.find(query);

    const sort = searchParams.sort || 'newest';
    if (sort === 'price-low') {
      productsQuery = productsQuery.sort({ price: 1 });
    } else if (sort === 'price-high') {
      productsQuery = productsQuery.sort({ price: -1 });
    } else if (sort === 'rating') {
      productsQuery = productsQuery.sort({ rating: -1 });
    } else {
      productsQuery = productsQuery.sort({ createdAt: -1 });
    }

    const products = await productsQuery.lean();
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

export default async function Home({ searchParams }: { searchParams: Promise<any> }) {
  const resolvedSearchParams = await searchParams;
  const products = await getProducts(resolvedSearchParams);

  return (
    <div className="bg-transparent text-white">
      {/* 3D Hero Section - Strictly matching DENIM HAZE reference */}
      <section className="h-screen w-full relative overflow-hidden">
        <Hero3D />
      </section>

      {/* Product Archive Section */}
      <div id="archive" className="pt-32 pb-48 relative z-10">
        <div className="w-full px-8 md:px-24">
          
          {/* Section Header - Full Width & Minimalist */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-32 border-b border-white/5 pb-16">
            <div className="max-w-xl">
              <h2 className="text-[10px] font-black uppercase tracking-[0.8em] text-white/30 mb-8 italic">THE ARCHIVE</h2>
              <h3 className="text-5xl md:text-8xl font-extralight uppercase tracking-tighter leading-none">
                SIGNATURE<br/><span className="font-medium">PIECES</span>
              </h3>
            </div>
            
            {/* Minimal Filter Integration */}
            <div className="mt-12 md:mt-0">
              <Filters />
            </div>
          </div>
          
          {/* Product Grid - Maximum Breathing Room */}
          {products.length === 0 ? (
            <div className="text-center py-48 opacity-20">
              <p className="text-[10px] uppercase tracking-[1em] font-light italic">NO ITEMS FOUND IN THE CURRENT ARCHIVE</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-16 gap-y-32">
              {products.map((product) => (
                <ProductCard key={product._id as string} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Minimal Footer / Exhibition Info */}
      <footer className="border-t border-white/5 py-48 px-10 md:px-24 relative z-10">
        <div className="w-full flex flex-col md:flex-row justify-between items-start gap-32">
          <div className="max-w-md">
            <h4 className="text-xs tracking-[0.5em] uppercase font-bold mb-10 italic text-white/40">Exhibition Notes</h4>
            <p className="text-xs md:text-sm font-extralight text-white/60 leading-loose tracking-widest uppercase italic">
              Each piece in the HAZE archive is curated for its architectural silhouette and enduring wash quality. We prioritize raw, untreated textiles and sustainable aging processes.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-20 text-[9px] font-black uppercase tracking-[0.5em] text-white/30">
            <div className="flex flex-col space-y-6">
              <span className="text-white mb-2 italic opacity-100">Contact</span>
              <Link href="/" className="hover:text-white transition-colors">Press</Link>
              <Link href="/" className="hover:text-white transition-colors">Support</Link>
              <Link href="/" className="hover:text-white transition-colors">Retail</Link>
            </div>
            <div className="flex flex-col space-y-6">
              <span className="text-white mb-2 italic opacity-100">Social</span>
              <Link href="/" className="hover:text-white transition-colors">Instagram</Link>
              <Link href="/" className="hover:text-white transition-colors">Archive Log</Link>
              <Link href="/" className="hover:text-white transition-colors">Vimeo</Link>
            </div>
            <div className="flex flex-col space-y-6">
              <span className="text-white mb-2 italic opacity-100">Legal</span>
              <Link href="/" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/" className="hover:text-white transition-colors">Terms</Link>
            </div>
          </div>
        </div>
        
        <div className="w-full mt-48 pt-12 border-t border-white/5 flex justify-between items-center text-[8px] font-bold uppercase tracking-[0.8em] text-white/20">
          <span>© 2026 DENIM HAZE</span>
          <span className="italic">CURATED FOR THE DISCERNING</span>
        </div>
      </footer>
    </div>
  );
}
