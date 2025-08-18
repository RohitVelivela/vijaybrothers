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
  isNew?: boolean;
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
  isNew,
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

      setError('Failed to add to cart');
      setTimeout(() => setError(null), 3000); // Clear error after 3 seconds
    } finally {
      setIsAdding(false);
    }
  };

  const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`relative border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container - Clickable Link */}
      <div className="relative w-full overflow-hidden rounded-md" style={{ aspectRatio: '2/3' }}>
        <Link href={`/p/${slug}/${id}`} passHref legacyBehavior>
          <a className="block absolute inset-0 z-0">
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: "contain" }}
            />
          </a>
        </Link>
        
        {/* New Badge */}
        {isNew && (
          <div className="absolute top-2 left-2 z-20">
            <span className="bg-gradient-to-r from-purple-600 to-purple-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200">
              NEW
            </span>
          </div>
        )}
        
        {/* "Add to Cart" Button Overlay - Always visible when hovered */}
        {inStock && (
          <div 
            className="absolute inset-0 flex items-end justify-center pb-4 z-10 pointer-events-none"
            style={{
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
              transition: 'all 0.3s ease-out'
            }}
          >
            <button
              onClick={handleAddToCart}
              disabled={isAdding || loading}
              className={`flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-lg shadow-lg pointer-events-auto ${
                error
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : isAdded 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-orange-600 text-white hover:bg-orange-700'
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
          </div>
        )}
      </div>

      {/* Product Info */}
      <Link href={`/p/${slug}/${id}`} passHref legacyBehavior>
        <a className="block pt-4 text-left">
          <h3 className="text-base font-medium text-gray-800 line-clamp-2 mb-2 hover:text-gray-600 transition-colors">{title}</h3>
          <p className="text-lg font-semibold text-gray-900">₹{price}</p>
        </a>
      </Link>
    </div>
  );
};

export default ProductCard;