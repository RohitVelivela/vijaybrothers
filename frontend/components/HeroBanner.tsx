import React from 'react';

const HeroBanner: React.FC = () => {
  return (
    <section className="relative w-full h-[450px] overflow-hidden">
      {/* Full Hero Image Background */}
      <div className="absolute inset-0">
        <img
          src="/rakhi-banner.png"
          alt="Vijay Brothers Premium Saree Collection - Timeless Elegance & Tradition"
          className="w-full h-full object-cover object-center"
          style={{
            imageRendering: 'crisp-edges'
          }}
          loading="eager"
        />
      </div>

      {/* Subtle Left-Side Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent md:from-black/60 md:via-black/25 md:to-transparent"></div>

      {/* Content Container */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-2xl">
            {/* Main Headline */}
            <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-wide"
                style={{
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8), 0 0 8px rgba(0, 0, 0, 0.6)'
                }}>
              
            </h1>

            {/* Elegant Divider */}
            <div className="flex items-center mb-6">
              <div className="w-16 h-px bg-gradient-to-r from-amber-400 to-transparent"></div>
              <div className="w-3 h-3 bg-amber-400 rounded-full mx-4 shadow-lg"></div>
              <div className="w-24 h-px bg-gradient-to-r from-amber-400 to-transparent"></div>
            </div>

            {/* Subtext */}
            <p className="font-cinzel text-white text-lg md:text-xl lg:text-2xl mb-10 leading-relaxed opacity-95 max-w-xl"
               style={{
                 textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)'
               }}>
              
            </p>

            {/* Optional Secondary CTA */}
            
          </div>
        </div>
      </div>

      {/* Decorative Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="h-1 bg-gradient-to-r from-amber-500 via-red-500 to-green-500"></div>
        <div className="h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
      </div>

      
    </section>
  );
};

export default HeroBanner;