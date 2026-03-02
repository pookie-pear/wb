'use client';

import { useCart } from '@/context/CartContext';
import { IProduct } from '@/models/Product';

interface AddToCartButtonProps {
  product: IProduct;
}

const AddToCartButton = ({ product }: AddToCartButtonProps) => {
  const { addToCart } = useCart();

  return (
    <button 
      onClick={() => addToCart(product)}
      disabled={product.countInStock === 0}
      className={`w-full py-3 rounded-md font-semibold transition-colors ${
        product.countInStock > 0 
          ? 'bg-blue-600 text-white hover:bg-blue-700' 
          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
      }`}
    >
      {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
    </button>
  );
};

export default AddToCartButton;
