import React from 'react';

interface PromotionalBannerProps {
  image: string;
  name: string;
}

const PromotionalBanner: React.FC<PromotionalBannerProps> = ({ image, name }) => {
  return (
    <div className="w-full py-8 px-4">
      <div className="container mx-auto">
        <div className="block relative group cursor-pointer">
          <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-[1.02]">
            {/* Square banner for mobile, rectangular for desktop */}
            <div className="aspect-square md:aspect-[2/1] w-full">
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </div>
            {/* Optional overlay effect on hover */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionalBanner;