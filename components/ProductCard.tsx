'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IProduct } from '@/models/Product';
import { useCart } from '@/context/CartContext';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: IProduct;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const rawImages = product.images && product.images.length > 0 ? product.images : [product.image];
  const images = rawImages.filter((img): img is string => typeof img === 'string' && img.length > 0);
  const currentImage = images[currentImageIndex] || '';

  // Clean the URL to ensure there are no trailing backticks or spaces
  const cleanImage = currentImage.trim().replace(/^`+|`+$/g, '');

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    if (images.length > 1) {
      setIsLoaded(false); // Reset loading state for new image
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    if (images.length > 1) {
      setIsLoaded(false); // Reset loading state for new image
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <div className="group flex flex-col h-full bg-transparent">
      {/* Image Container - Minimalist Square/Portrait with Slider */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#0a0a0a]">
        {/* Loading Skeleton */}
        {!isLoaded && cleanImage && (
          <div className="absolute inset-0 z-10 animate-pulse bg-white/5 flex items-center justify-center">
             <div className="text-[8px] uppercase tracking-[0.5em] text-white/10 italic">RETRIEVING...</div>
          </div>
        )}

        <Link href={`/product/${product._id}`} className="block w-full h-full">
          {cleanImage ? (
            <img
              src={cleanImage}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-105 ${isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-lg'}`}
              loading="lazy"
              referrerPolicy="no-referrer"
              onLoad={() => {
                console.log('Successfully loaded image:', cleanImage);
                setIsLoaded(true);
              }}
              onError={(e) => {
                console.error('FAILED TO LOAD IMAGE:', cleanImage);
                const target = e.target as HTMLImageElement;
                if (!target.src.includes('placeholder')) {
                  target.src = 'https://placehold.co/600x800/000000/FFFFFF?text=IMAGE+ERROR';
                  setIsLoaded(true);
                }
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[8px] uppercase tracking-widest text-white/20">
              No Image
            </div>
          )}
        </Link>
        
        {/* Slider Controls - Only show if more than one image */}
        {images.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/50 z-20"
              aria-label="Previous image"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/50 z-20"
              aria-label="Next image"
            >
              <ChevronRight size={16} />
            </button>
            
            {/* Image Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5 z-20">
              {images.map((_, idx) => (
                <div 
                  key={idx}
                  className={`w-1 h-1 rounded-full transition-all duration-300 ${
                    idx === currentImageIndex ? 'bg-white w-3' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Subtle Quick Add - Only on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none">
          <button 
            onClick={(e) => {
              e.preventDefault();
              addToCart(product as any);
            }}
            className="bg-white text-black text-[9px] font-black uppercase tracking-[0.4em] px-8 py-3 hover:bg-black hover:text-white transition-all duration-300 pointer-events-auto"
          >
            Add to Bag
          </button>
        </div>

        {/* Status Badge - Minimalist Text */}
        {product.countInStock < 5 && product.countInStock > 0 && (
          <span className="absolute top-4 right-4 text-[8px] font-bold text-white uppercase tracking-[0.3em] bg-black/40 backdrop-blur-md px-2 py-1">
            Last Pieces
          </span>
        )}
      </div>

      {/* Info Section - Ultra Clean */}
      <div className="pt-6 flex flex-col items-center text-center">
        <p className="text-[8px] font-bold text-white/30 uppercase tracking-[0.5em] mb-2 italic">
          {product.fit} / {product.wash}
        </p>
        
        <Link href={`/product/${product._id}`}>
          <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.3em] group-hover:text-white/60 transition-colors mb-2">
            {product.name}
          </h3>
        </Link>
        
        <span className="text-[11px] font-black text-white italic tracking-tighter">
          ${product.price.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default ProductCard;
