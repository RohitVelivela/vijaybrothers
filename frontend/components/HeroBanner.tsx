import React, { useState, useEffect } from 'react';
import { fetchPublicBanners, Banner } from '../lib/api';

const HeroBanner: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const fetchedBanners = await fetchPublicBanners();
        if (fetchedBanners.length > 0) {
          setBanners(fetchedBanners);
        } else {
          setError('No banners available.');
        }
      } catch (err) {
        console.error('Error fetching banners:', err);
        setError('Failed to load banners.');
      } finally {
        setLoading(false);
      }
    };
    loadBanners();
  }, []);

  useEffect(() => {
    if (banners.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
      }, 5000); // Autoplay every 5 seconds
      return () => clearInterval(interval);
    }
  }, [banners]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <section className="relative w-full h-[450px] flex items-center justify-center bg-gray-200">
        <p className="text-gray-700">Loading banners...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative w-full h-[450px] flex items-center justify-center bg-red-100 text-red-800">
        <p>{error}</p>
      </section>
    );
  }

  if (banners.length === 0) {
    return (
      <section className="relative w-full h-[450px] flex items-center justify-center bg-gray-300 text-gray-700 text-xl">
        No banners available
      </section>
    );
  }

  const currentBanner = banners[currentIndex];

  return (
    <section className="relative w-full h-[450px] overflow-hidden">
      {/* Full Hero Image Background */}
      <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out">
        <img
          src={currentBanner.image}
          alt={currentBanner.name || "Hero Banner"}
          className="w-full h-full object-cover object-center"
          style={{ imageRendering: 'crisp-edges' }}
          loading="eager"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-2xl">
            {/* Main Headline - Banner name removed as per user request */}
            <h1
              className="font-playfair text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-wide"
              style={{
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8), 0 0 8px rgba(0, 0, 0, 0.6)'
              }}
            >
              {/* Banner name removed as per user request */}
            </h1>

            {/* Elegant Divider */}
            <div className="flex items-center mb-6">
              <div className="w-16 h-px bg-gradient-to-r from-amber-400 to-transparent"></div>
              <div className="w-3 h-3 bg-amber-400 rounded-full mx-4 shadow-lg"></div>
              <div className="w-24 h-px bg-gradient-to-r from-amber-400 to-transparent"></div>
            </div>

            {/* Subtext */}
            <p
              className="font-cinzel text-white text-lg md:text-xl lg:text-2xl mb-10 leading-relaxed opacity-95 max-w-xl"
              style={{
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)'
              }}
            >
              {currentBanner.description || ''}
            </p>
          </div>
        </div>
      </div>

      

      {/* Dot Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 w-3 rounded-full ${
              currentIndex === index ? 'bg-white' : 'bg-gray-400 bg-opacity-75'
            } focus:outline-none hover:bg-white transition-colors duration-300`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
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