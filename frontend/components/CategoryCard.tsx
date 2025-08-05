import React from 'react';

interface CategoryCardProps {
  title: string;
  image: string;
  className?: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, image, className = '' }) => {
  return (
    <div className={`relative group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}>
      <div className="aspect-square relative">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300" />
        
        {/* Decorative borders */}
        <div className="absolute inset-4 border-2 border-white border-opacity-50 rounded-lg pointer-events-none">
          <div className="absolute -top-2 -left-2 w-6 h-6 border-l-2 border-t-2 border-white opacity-70"></div>
          <div className="absolute -top-2 -right-2 w-6 h-6 border-r-2 border-t-2 border-white opacity-70"></div>
          <div className="absolute -bottom-2 -left-2 w-6 h-6 border-l-2 border-b-2 border-white opacity-70"></div>
          <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-2 border-b-2 border-white opacity-70"></div>
        </div>
        
        <div className="absolute bottom-6 left-6 right-6 text-center">
          <button className="bg-white bg-opacity-20 border border-white text-white px-6 py-2 rounded hover:bg-white hover:text-gray-800 transition-all duration-300 font-medium">
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;