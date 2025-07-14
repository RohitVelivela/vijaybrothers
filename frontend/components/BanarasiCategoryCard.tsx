import React from 'react';
import { useRouter } from 'next/router';

interface BanarasiCategoryCardProps {
  title: string;
  image: string;
  className?: string;
}

const BanarasiCategoryCard: React.FC<BanarasiCategoryCardProps> = ({ 
  title, 
  image, 
  className = '' 
}) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/category/${encodeURIComponent(title)}`); 
  };

  return (
    <div 
      className={`relative group cursor-pointer overflow-hidden rounded-2xl ${className}`}
      onClick={handleCardClick}
    >
      {/* Main Card Container */}
      <div className="relative aspect-[4/5] bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 shadow-2xl hover:shadow-3xl transition-all duration-500">
        
        {/* High-Resolution Sharp Background Image */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            style={{
              imageRendering: 'crisp-edges',
              ...({
                WebkitImageRendering: 'crisp-edges',
                msImageRendering: 'crisp-edges'
              } as any)
            }}
            loading="lazy"
          />
          {/* Semi-transparent gradient overlay for text readability - NO BLUR */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          {/* Subtle warm lighting overlay to enhance colors */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-transparent to-red-900/15"></div>
        </div>

        {/* Ornate Corner Embellishments - Wedding Invitation Style */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top Left Corner */}
          <div className="absolute top-2 left-2 w-12 h-12">
            <svg viewBox="0 0 64 64" className="w-full h-full text-white/90 drop-shadow-lg">
              <path
                d="M8 8 Q8 8 16 8 Q24 8 24 16 Q24 24 16 24 Q8 24 8 16 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="animate-pulse"
              />
              <path
                d="M4 4 Q4 4 8 4 Q12 4 12 8 Q12 12 8 12 Q4 12 4 8 Z"
                fill="currentColor"
                opacity="0.7"
              />
              <circle cx="20" cy="20" r="2" fill="currentColor" opacity="0.9" />
              <path
                d="M12 4 Q16 4 20 8 Q24 12 20 16 Q16 20 12 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.8"
              />
            </svg>
          </div>

          {/* Top Right Corner */}
          <div className="absolute top-2 right-2 w-12 h-12 transform scale-x-[-1]">
            <svg viewBox="0 0 64 64" className="w-full h-full text-white/90 drop-shadow-lg">
              <path
                d="M8 8 Q8 8 16 8 Q24 8 24 16 Q24 24 16 24 Q8 24 8 16 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="animate-pulse"
              />
              <path
                d="M4 4 Q4 4 8 4 Q12 4 12 8 Q12 12 8 12 Q4 12 4 8 Z"
                fill="currentColor"
                opacity="0.7"
              />
              <circle cx="20" cy="20" r="2" fill="currentColor" opacity="0.9" />
              <path
                d="M12 4 Q16 4 20 8 Q24 12 20 16 Q16 20 12 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.8"
              />
            </svg>
          </div>

          {/* Bottom Left Corner */}
          <div className="absolute bottom-2 left-2 w-12 h-12 transform scale-y-[-1]">
            <svg viewBox="0 0 64 64" className="w-full h-full text-white/90 drop-shadow-lg">
              <path
                d="M8 8 Q8 8 16 8 Q24 8 24 16 Q24 24 16 24 Q8 24 8 16 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="animate-pulse"
              />
              <path
                d="M4 4 Q4 4 8 4 Q12 4 12 8 Q12 12 8 12 Q4 12 4 8 Z"
                fill="currentColor"
                opacity="0.7"
              />
              <circle cx="20" cy="20" r="2" fill="currentColor" opacity="0.9" />
              <path
                d="M12 4 Q16 4 20 8 Q24 12 20 16 Q16 20 12 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.8"
              />
            </svg>
          </div>

          {/* Bottom Right Corner */}
          <div className="absolute bottom-2 right-2 w-12 h-12 transform scale-[-1]">
            <svg viewBox="0 0 64 64" className="w-full h-full text-white/90 drop-shadow-lg">
              <path
                d="M8 8 Q8 8 16 8 Q24 8 24 16 Q24 24 16 24 Q8 24 8 16 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="animate-pulse"
              />
              <path
                d="M4 4 Q4 4 8 4 Q12 4 12 8 Q12 12 8 12 Q4 12 4 8 Z"
                fill="currentColor"
                opacity="0.7"
              />
              <circle cx="20" cy="20" r="2" fill="currentColor" opacity="0.9" />
              <path
                d="M12 4 Q16 4 20 8 Q24 12 20 16 Q16 20 12 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.8"
              />
            </svg>
          </div>
        </div>

        {/* Elegant Inner Border - NO BACKDROP BLUR */}
        <div className="absolute inset-6 border border-white/30 rounded-xl shadow-inner">
          {/* Inner decorative dots */}
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-amber-300/80 rounded-full shadow-lg"></div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-300/80 rounded-full shadow-lg"></div>
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-amber-300/80 rounded-full shadow-lg"></div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-amber-300/80 rounded-full shadow-lg"></div>
        </div>

        {/* Content Overlay with Clear Text Readability */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Semi-transparent gradient background for text - NO BACKDROP BLUR */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent rounded-b-2xl"></div>
          
          {/* Content */}
          <div className="relative z-10 text-center">
            {/* Category Title - Enhanced Text Shadow for Clarity */}
            <h3 className="font-playfair text-xl md:text-2xl font-bold text-white mb-4 tracking-wide"
                style={{
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8), 0 0 8px rgba(0, 0, 0, 0.6)'
                }}>
              {title}
            </h3>
            
            {/* Decorative Divider */}
            <div className="flex items-center justify-center mb-6">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-amber-300"></div>
              <div className="w-3 h-3 bg-amber-400 rounded-full mx-3 shadow-lg"></div>
              <div className="w-8 h-px bg-gradient-to-l from-transparent to-amber-300"></div>
            </div>

            {/* Crisp View Button */}
            <button className="group/btn relative bg-transparent border-2 border-amber-400 text-amber-100 px-5 py-1.5 rounded-full font-cinzel font-semibold text-sm hover:bg-amber-400 hover:text-amber-900 transition-all duration-500 shadow-2xl hover:shadow-amber-400/50 transform hover:-translate-y-1 overflow-hidden"
                    style={{
                      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
                    }}>
              {/* Button glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-red-400/20 rounded-full opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
              
              {/* Button shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 rounded-full"></div>
              
              <span className="relative z-10">View</span>
            </button>
          </div>
        </div>

        {/* Royal Glow Effect on Hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 via-transparent to-red-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none"></div>
        
        {/* Outer Glow */}
        <div className="absolute -inset-1 bg-gradient-to-br from-amber-400/20 to-red-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 blur-xl pointer-events-none"></div>
      </div>
    </div>
  );
};

export default BanarasiCategoryCard;