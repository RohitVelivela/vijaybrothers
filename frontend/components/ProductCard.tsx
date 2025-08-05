import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Check, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  id: number;
  title: string;
  price: string;
  image: string;
  inStock: boolean;
  className?: string;
  category?: string;
  fabric?: string;
  color?: string;
  onClick?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  price,
  image,
  inStock,
  className,
  category,
  fabric,
  color,
  onClick,
}) => {
  const { addToCart, loading } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!inStock || isAdding) return;
    
    try {
      setIsAdding(true);
      setError(null);
      await addToCart(id, 1);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error('Failed to add product to cart:', error);
      setError('Failed to add to cart');
      setTimeout(() => setError(null), 3000); // Clear error after 3 seconds
    } finally {
      setIsAdding(false);
    }
  };

  const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

  return (
    <Link href={`/p/${slug}/${id}`} passHref legacyBehavior>
      <a className={`group relative cursor-pointer border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow ${className}`}>
        {/* Image Container */}
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: '2/3' }}>
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: "contain" }}
          />
          {/* "Add to Cart" Button Overlay */}
          <div className="absolute inset-0 flex items-end justify-center pb-4">
            {inStock && (
              <button
                onClick={handleAddToCart}
                disabled={isAdding || loading}
                className={`flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                  error
                    ? 'bg-red-600 text-white'
                    : isAdded 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                } ${(isAdding || loading) ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                {isAdding ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding...
                  </>
                ) : error ? (
                  <>
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Failed
                  </>
                ) : isAdded ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Added!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="pt-3 text-left">
          <h3 className="text-sm text-gray-800 line-clamp-2">{title}</h3>
          <p className="mt-1 text-md font-semibold text-gray-900">₹{price}</p>
        </div>
      </a>
    </Link>
  );
};

export default ProductCard;