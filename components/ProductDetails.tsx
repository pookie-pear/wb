'use client';

import { useState } from 'react';
import Image from 'next/image';
import { IProduct, IVariation } from '@/models/Product';
import { useCart } from '@/context/CartContext';
import { Star, ShieldCheck, Truck, RefreshCcw } from 'lucide-react';

interface ProductDetailsProps {
  product: IProduct;
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedWaist, setSelectedWaist] = useState(product.waistSizes[0]);
  const [selectedLength, setSelectedLength] = useState(product.lengthSizes[0]);

  const [selectedImage, setSelectedImage] = useState(0);

  // Find the matching variation or use base product
  const currentVariation = product.variations?.find(v => 
    v.color === selectedColor && 
    v.waistSize === selectedWaist && 
    v.lengthSize === selectedLength
  );

  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const currentPrice = currentVariation?.price || product.price;
  const currentImage = images[selectedImage];
  const currentStock = currentVariation?.countInStock ?? product.countInStock;

  const handleAddToCart = () => {
    const itemToAdd = {
      ...product,
      price: currentPrice,
      image: currentImage,
      countInStock: currentStock,
      // Add selected variation details if needed for cart
    };
    addToCart(itemToAdd as any);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 bg-transparent">
      {/* Image Gallery */}
      <div className="flex flex-col space-y-4">
        <div className="relative aspect-[4/5] w-full bg-[#0a0a0a] border border-white/5 overflow-hidden">
          {currentImage ? (
            <Image
              src={currentImage}
              alt={product.name}
              fill
              unoptimized
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] uppercase tracking-widest text-white/20">
              No Image Available
            </div>
          )}
        </div>
        
        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative flex-shrink-0 w-20 aspect-square border-2 transition-all ${
                  selectedImage === idx ? 'border-white' : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                {img ? (
                  <Image
                    src={img}
                    alt={`${product.name} view ${idx + 1}`}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-white/5" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col">
        <div className="mb-8">
          <p className="text-blue-500 font-bold uppercase tracking-[0.3em] text-xs mb-2 italic">
            {product.category} / {product.gender} / {product.fit}
          </p>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-4 italic">{product.name}</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-600'}`} />
              ))}
              <span className="ml-2 text-white font-bold">{product.rating}</span>
            </div>
            <span className="text-gray-500 text-sm italic">{product.numReviews} Reviews</span>
          </div>
        </div>

        <div className="text-4xl font-black mb-8 italic">${currentPrice.toFixed(2)}</div>

        {/* Color Selection */}
        <div className="mb-8">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Color: <span className="text-white">{selectedColor}</span></h3>
          <div className="flex flex-wrap gap-3">
            {product.colors.map(color => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`px-6 py-2 text-xs font-bold uppercase border transition-all ${
                  selectedColor === color 
                    ? 'border-blue-500 bg-blue-500 text-white' 
                    : 'border-white/20 text-gray-400 hover:border-white/50'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        {/* Size Selection (Waist) */}
        <div className="mb-8">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Waist Size: <span className="text-white">{selectedWaist}</span></h3>
          <div className="flex flex-wrap gap-2">
            {product.waistSizes.map(size => (
              <button
                key={size}
                onClick={() => setSelectedWaist(size)}
                className={`w-12 h-12 flex items-center justify-center text-xs font-bold border transition-all ${
                  selectedWaist === size 
                    ? 'border-blue-500 bg-blue-500 text-white' 
                    : 'border-white/20 text-gray-400 hover:border-white/50'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Size Selection (Length) */}
        <div className="mb-8">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Length: <span className="text-white">{selectedLength}</span></h3>
          <div className="flex flex-wrap gap-2">
            {product.lengthSizes.map(size => (
              <button
                key={size}
                onClick={() => setSelectedLength(size)}
                className={`w-12 h-12 flex items-center justify-center text-xs font-bold border transition-all ${
                  selectedLength === size 
                    ? 'border-blue-500 bg-blue-500 text-white' 
                    : 'border-white/20 text-gray-400 hover:border-white/50'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Stock Status */}
        <div className="mb-8 flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${currentStock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-xs font-bold uppercase tracking-widest">
            {currentStock > 0 ? `${currentStock} in stock` : 'Out of stock'}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={currentStock === 0}
          className={`w-full py-5 text-sm font-black uppercase tracking-[0.2em] transition-all ${
            currentStock > 0 
              ? 'bg-white text-black hover:bg-blue-500 hover:text-white' 
              : 'bg-white/10 text-gray-600 cursor-not-allowed'
          }`}
        >
          {currentStock > 0 ? 'Add to Cart' : 'Currently Unavailable'}
        </button>

        {/* Extra Info */}
        <div className="mt-12 space-y-6 border-t border-white/10 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <Truck className="w-5 h-5 text-blue-500 mt-1" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-1">Fast Delivery</h4>
                <p className="text-[10px] text-gray-500 font-light italic">Free shipping on orders over $150</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <RefreshCcw className="w-5 h-5 text-blue-500 mt-1" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-1">Easy Returns</h4>
                <p className="text-[10px] text-gray-500 font-light italic">30-day money back guarantee</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <ShieldCheck className="w-5 h-5 text-blue-500 mt-1" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-1">Secure Payment</h4>
                <p className="text-[10px] text-gray-500 font-light italic">100% encrypted checkout</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 p-6 border border-white/5">
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4">Product Details</h4>
            <div className="grid grid-cols-2 gap-y-3">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Material</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">{product.material}</span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Fit</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">{product.fit}</span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Wash</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">{product.wash}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
