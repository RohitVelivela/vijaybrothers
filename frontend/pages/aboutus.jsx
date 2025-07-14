import React from 'react';
import { Target, Eye } from 'lucide-react'; // Import icons

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-10 text-center font-serif">About Us</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div>
            <p className="text-gray-700 text-base mb-4 leading-relaxed">
              Vijay Brothers Wholesale Sarees Showroom is a trusted name in Hyderabad, dedicated to serving the graceful women of Andhra Pradesh and Telangana with an exclusive range of high-quality sarees at wholesale prices.
            </p>
            <p className="text-gray-700 text-base mb-4 leading-relaxed">
              For generations, we've understood the unique style, culture, and elegance of women from this region. Whether it's for festivals like Sankranti, Bathukamma, or special occasions like weddings and family gatherings, our collection reflects the true spirit of Telugu tradition with a modern touch.
            </p>
            <p className="text-gray-700 text-base mb-6 leading-relaxed">
              From luxurious Pattu sarees, intricate Kanchi silks, and vibrant Ikat patterns to chic party wear and daily wear options, we offer something for every moment that matters. At Vijay Brothers, we combine affordability, variety, and authenticity under one roof making us the most preferred wholesale saree destination in the Telugu-speaking states.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-3 font-serif flex items-center"><Target className="w-6 h-6 text-orange-500 mr-2" />Our Mission</h2>
            <p className="text-gray-700 text-base mb-6 leading-relaxed">
              To celebrate and empower the traditional and modern woman of Andhra and Telangana by offering sarees that reflect her culture, strength, and beauty at prices that bring joy to every purchase.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-3 font-serif flex items-center"><Eye className="w-6 h-6 text-orange-500 mr-2" />Our Vision</h2>
            <p className="text-gray-700 text-base leading-relaxed">
              To become the most trusted saree showroom for Telugu women by delivering unmatched variety, heritage designs, and heartfelt service, while preserving the essence of our culture and fashion heritage.
            </p>
          </div>

          {/* Image on the right */}
          <div className="flex justify-center lg:justify-end -mt-16">
            <img 
              src="/images/about us.png" 
              alt="About Us" 
              className="rounded-lg shadow-lg w-full h-auto object-cover" 
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutUs;
