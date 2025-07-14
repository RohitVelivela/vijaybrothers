import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';

interface ProductCardProps {
  id: number;
  title: string;
  price: string;
  originalPrice?: string;
  image: string;
  badge?: string;
  badgeColor?: string;
  category: string;
  fabric: string;
  color: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  onClick?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  id, 
  title, 
  price, 
  originalPrice,
  image, 
  badge, 
  badgeColor = 'bg-red-500',
  category,
  fabric,
  color,
  rating,
  reviews,
  inStock,
  onClick
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent click if clicking on action buttons
    if ((e.target as HTMLElement).closest('.action-button')) {
      return;
    }
    router.push(`/product/${id}`);
  };

  return (
    <div 
      className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col flex-grow"
      onClick={handleCardClick}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        {badge && (
          <div className={`absolute top-3 left-3 ${badgeColor} text-white px-3 py-1 rounded-full text-xs font-semibold z-10`}>
            {badge}
          </div>
        )}
        
        {!inStock && (
          <div className="absolute top-3 right-3 bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
            Out of Stock
          </div>
        )}
        
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
        
        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsWishlisted(!isWishlisted);
            }}
            className="action-button bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Heart 
              className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
            />
          </button>
          <button 
            onClick={(e) => e.stopPropagation()}
            className="action-button bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Quick add to cart */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={(e) => e.stopPropagation()}
            className={`action-button w-full py-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
              inStock 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
            disabled={!inStock}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{inStock ? 'Add to Cart' : 'Out of Stock'}</span>
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
            {category}
          </span>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-600">{rating}</span>
            <span className="text-xs text-gray-400">({reviews})</span>
          </div>
        </div>
        
        <h3 className="text-gray-800 text-sm font-medium mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
          {title}
        </h3>
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">{price}</span>
            {originalPrice && (
              <span className="text-sm text-gray-500 line-through">{originalPrice}</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Fabric: {fabric}</span>
          <span>Color: {color}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;