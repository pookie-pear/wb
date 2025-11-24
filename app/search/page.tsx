import connectDB from '@/lib/mongodb';
import Product, { IProduct } from '@/models/Product';
import ProductCard from '@/components/ProductCard';
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

export default async function SearchPage({ searchParams }: { searchParams: Promise<any> }) {
  const resolvedSearchParams = await searchParams;
  const products = await getProducts(resolvedSearchParams);
  const currentQuery = resolvedSearchParams.search || '';

  return (
    <div className="bg-transparent min-h-screen relative z-10">
      <div className="w-full px-8 md:px-24 pt-24">
        <div className="flex items-end justify-between mb-12 border-b border-white/5 pb-8">
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-sm tracking-[0.6em] uppercase font-light text-white">
              DENIM<span className="font-bold">HAZE</span>
            </Link>
            <div className="text-[10px] font-black uppercase tracking-[0.6em] text-white/40 italic">
              {currentQuery ? `RESULTS FOR "${currentQuery}"` : 'BROWSE THE ARCHIVE'}
            </div>
          </div>
          <div className="max-w-2xl w-full">
            <Filters basePath="/search" />
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-48 opacity-20">
            <p className="text-[10px] uppercase tracking-[1em] font-light italic">NO MATCHES FOUND</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-16 gap-y-32">
            {products.map((product) => (
              <ProductCard key={product._id as unknown as string} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
