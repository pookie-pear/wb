import Link from 'next/link';
import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Product, { IProduct } from '@/models/Product';
import ProductDetails from '@/components/ProductDetails';
import { ChevronLeft } from 'lucide-react';

async function getProduct(id: string): Promise<IProduct | null> {
  try {
    await connectDB();
    const product = await Product.findById(id).lean();
    if (!product) return null;
    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return null;
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-transparent min-h-screen relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link 
          href="/" 
          className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors mb-12"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Collection</span>
        </Link>
        
        <ProductDetails product={product} />

        {/* Similar Items / Bottom Section */}
        <section className="mt-32 pt-24 border-t border-white/10">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-blue-500 mb-2 italic">More From Eclipse</h2>
              <h3 className="text-4xl font-black uppercase tracking-tighter">Related Denim</h3>
            </div>
            <Link 
              href="/" 
              className="text-xs font-bold uppercase tracking-widest border-b border-white/20 hover:border-blue-500 transition-colors"
            >
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* We could fetch more products here, but for now just showing a placeholder or leaving it empty */}
            <p className="text-gray-500 text-xs italic uppercase tracking-widest">Recommended items coming soon...</p>
          </div>
        </section>
      </div>
    </div>
  );
}
