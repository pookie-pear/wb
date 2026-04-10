'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus, ChevronLeft, ShoppingBag } from 'lucide-react';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  if (cart.length === 0) {
    return (
      <div className="text-center py-48 bg-transparent relative z-10">
        <div className="mb-8 flex justify-center">
          <ShoppingBag className="w-24 h-24 text-white/10" />
        </div>
        <h2 className="text-4xl font-black uppercase tracking-tighter text-white mb-4 italic">Your bag is empty</h2>
        <p className="text-gray-500 mb-12 uppercase tracking-widest text-xs font-bold italic">Experience the eclipse with our latest collection.</p>
        <Link 
          href="/" 
          className="bg-white text-black px-12 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-blue-500 hover:text-white transition-all"
        >
          Go Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-transparent min-h-screen py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-sm font-bold uppercase tracking-[0.4em] text-blue-500 mb-2 italic">Shopping Bag</h1>
            <h2 className="text-5xl font-black uppercase tracking-tighter text-white">Your Order</h2>
          </div>
          <Link 
            href="/" 
            className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2">
            <div className="border-t border-white/10">
              <ul className="divide-y divide-white/10">
                {cart.map((item) => (
                  <li key={item._id as unknown as string} className="py-10 flex items-center gap-8">
                    <div className="relative h-48 w-36 flex-shrink-0 bg-white/5 border border-white/10">
                      {item.image ? (
                        <img
                          src={item.image.trim().replace(/^`+|`+$/g, '')}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full bg-white/5" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <Link href={`/product/${item._id as unknown as string}`} className="text-lg font-black uppercase tracking-tighter text-white hover:text-blue-500 transition-colors italic">
                            {item.name}
                          </Link>
                          <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold mt-1">{item.category}</p>
                        </div>
                        <span className="text-xl font-black text-white italic">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-8">
                        <div className="flex items-center border border-white/20 bg-white/5">
                          <button 
                            onClick={() => updateQuantity(item._id as unknown as string, item.quantity - 1)}
                            className="p-3 text-white hover:text-blue-500 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-6 text-sm font-bold border-x border-white/20">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item._id as unknown as string, item.quantity + 1)}
                            className="p-3 text-white hover:text-blue-500 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => removeFromCart(item._id as unknown as string)}
                          className="flex items-center space-x-2 text-red-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Remove</span>
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white/5 border border-white/10 p-10 sticky top-32">
              <h2 className="text-xl font-black uppercase tracking-tighter text-white mb-8 italic">Summary</h2>
              <div className="space-y-6">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-500">
                  <span>Items ({totalItems})</span>
                  <span className="text-white">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-500">
                  <span>Shipping</span>
                  <span className="text-white">{totalPrice > 150 ? 'Complimentary' : '$15.00'}</span>
                </div>
                <div className="border-t border-white/10 pt-6 flex justify-between text-2xl font-black text-white italic">
                  <span className="uppercase tracking-tighter">Total</span>
                  <span>${(totalPrice > 150 ? totalPrice : totalPrice + 15).toFixed(2)}</span>
                </div>
              </div>
              
              <button className="w-full mt-12 bg-white text-black py-5 text-sm font-black uppercase tracking-[0.2em] hover:bg-blue-500 hover:text-white transition-all shadow-lg shadow-white/5">
                Checkout
              </button>
              
              <div className="mt-8 flex flex-col items-center gap-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                <p>Free returns within 30 days</p>
                <div className="flex gap-4">
                  <span>VISA</span>
                  <span>MASTERCARD</span>
                  <span>AMEX</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
