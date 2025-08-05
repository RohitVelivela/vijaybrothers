import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '../lib/api';

interface ProductGridProps {
  products: Product[];
  showNavigationArrows?: boolean;
  onProductClick?: (productId: number) => void;
  cardClassName?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  showNavigationArrows = false,
  onProductClick,
  cardClassName
}) => {
  return (
    <div className="relative px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8">
        {products.map((product) => (
          <ProductCard
            key={product.productId}
            id={product.productId}
            title={product.name}
            price={product.price.toString()}
            image={product.images && product.images.length > 0 ? product.images[0].imageUrl : '/images/default-avatar.png'}
            category={product.category?.name || ''}
            fabric={product.fabric || ''}
            color={product.color || ''}
            inStock={product.inStock}
            onClick={() => onProductClick?.(product.productId)}
            className={cardClassName}
          />
        ))}
      </div>
      
      {showNavigationArrows && (
        <>
          <button className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 z-10">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-6 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 z-10">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
};

export default ProductGrid;
