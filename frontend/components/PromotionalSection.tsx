import React from 'react';
import Link from 'next/link';
import { Product } from '../lib/api';
import ProductCard from './ProductCard';

interface PromotionalSectionProps {
  title: string;
  products: Product[];
  categorySlug: string;
}

const PromotionalSection: React.FC<PromotionalSectionProps> = ({ title, products, categorySlug }) => {
  // Helper function to check if a product is new (created within last 90 days)
  const isProductNew = (product: Product): boolean => {
    if (!product.createdAt) return false;
    
    const createdDate = new Date(product.createdAt);
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    
    return createdDate > ninetyDaysAgo;
  };

  // Don't render the section if there are no products
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="flex-1 h-px bg-gray-400 mr-4"></div>
            <h2 className="text-4xl font-extrabold text-gray-800 px-6 whitespace-nowrap">{title}</h2>
            <div className="flex-1 h-px bg-gray-400 ml-4"></div>
          </div>
          <div className="mt-6">
            <Link href={`/category/${categorySlug}`} legacyBehavior>
              <a className="group inline-flex items-center px-4 py-2 text-sm font-semibold text-orange-600 bg-orange-50 rounded-full border-2 border-orange-200 hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
                <span className="mr-2">View All</span>
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-x-4 gap-y-8">
          {products.map((product) => (
            <ProductCard
              key={product.productId}
              id={product.productId}
              title={product.name}
              price={product.price.toString()}
              image={product.images && product.images.length > 0 ? product.images[0].imageUrl : '/images/default-avatar.png'}
              inStock={product.inStock}
              isNew={isProductNew(product)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromotionalSection;