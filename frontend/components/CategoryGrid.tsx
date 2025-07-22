import React from 'react';
import { useRouter } from 'next/router';
import BanarasiCategoryCard from './BanarasiCategoryCard';
import { Category } from '../data/categories';
import ProductGrid from './ProductGrid';
import { topHandpickedSarees, newArrivalSarees } from '../data/products';


interface CategoryGridProps {
  categories: Category[];
  title: string;
  showAll?: boolean;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories, title, showAll = false }) => {
  const displayCategories = showAll ? categories : categories.slice(0, 8);
  const router = useRouter(); // Added this line

  const ornateCategories = [
    { 
      title: "Banarasi Kora Saree", 
      image: "/images/categories/banaris kora saree.jpg",
    },
    { 
      title: "Soft Silk Sarees", 
      image: "/images/categories/soft silk saree.webp",
    },
    { 
      title: "Fancy Sarees", 
      image: "/images/categories/fancy sareess.jpeg",
    },
    { 
      title: "Tissue Silk Sarees", 
      image: "/images/categories/tiissue silk sarees.jpeg",
    },
    { 
      title: "Kuppadam Sico Sarees", 
      image: "/images/categories/kuppadam sarees.jpeg",
    },
    { 
      title: "Chiniya Silk Sarees", 
      image: "/images/categories/chinaya silk sarees.jpeg",
    },
    { 
      title: "Office Wear Sarees", 
      image: "/images/categories/office wear sarees.jpeg",
    },
    { 
      title: "Kalanjali Silk Sarees", 
      image: "/images/categories/kalanajal slik saress.jpeg",
    }
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden min-h-screen">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d97706' fill-opacity='0.4'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Elegant Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent max-w-32"></div>
            <div className="px-8">
              <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-gray-800 mb-4 tracking-wide">
                {title}
              </h2>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-8 h-px bg-amber-400"></div>
                <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-8 h-px bg-red-500"></div>
              </div>
            </div>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-amber-400 to-transparent max-w-32"></div>
          </div>
          <p className="font-cinzel text-gray-600 text-lg italic tracking-wide">
            Discover our heritage collection of premium handwoven sarees
          </p>
        </div>

        {/* Banarasi Category Cards Grid */}
        <div className="grid grid-cols-4 gap-6 lg:gap-8">
          {ornateCategories.map((category, index) => {
            let spanClass = '';
            if (index === 0) spanClass = 'col-span-2 row-span-2';
            else if (index === 1) spanClass = 'col-span-1 row-span-1';
            else if (index === 2) spanClass = 'col-span-1 row-span-1';
            else if (index === 3) spanClass = 'col-span-1 row-span-1';
            else if (index === 4) spanClass = 'col-span-1 row-span-1';
            else if (index === 5) spanClass = 'col-span-1 row-span-1';
            else if (index === 6) spanClass = 'col-span-1 row-span-1';
            else if (index === 7) spanClass = 'col-span-2 row-span-1';
            return (
              <BanarasiCategoryCard
                key={category.title}
                title={category.title}
                image={category.image}
                className={`h-full min-h-[250px] transform hover:scale-105 transition-all duration-500 ${spanClass}`}
              />
            );
          })}
        </div>

        {/* Hand Picked Sarees */}
        <div className="text-center mt-16">
          <h3 className="font-cinzel text-2xl md:text-3xl font-bold text-gray-800 mb-4 tracking-wide">Hand Picked Sarees</h3>
          <div className="text-center mt-4 mb-8">
            <button onClick={() => router.push('/products/handpicked')} className="group relative bg-gradient-to-r from-red-600 to-amber-600 text-white px-4 py-2 rounded-full font-playfair font-bold text-sm hover:from-red-700 hover:to-amber-700 transition-all duration-500 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 overflow-hidden">
              <span className="relative z-10">View All &gt;&gt;</span>
            </button>
          </div>
          <ProductGrid products={topHandpickedSarees.slice(0, 3)} cardClassName="h-64" />
        </div>

        {/* Managalgiri Sarees */}
        <div className="text-center mt-16">
          <h3 className="font-cinzel text-2xl md:text-3xl font-bold text-gray-800 mb-4 tracking-wide">Managalgiri sarees</h3>
          <div className="text-center mt-4 mb-8">
            <button onClick={() => router.push('/products/managalgiri')} className="group relative bg-gradient-to-r from-red-600 to-amber-600 text-white px-4 py-2 rounded-full font-playfair font-bold text-sm hover:from-red-700 hover:to-amber-700 transition-all duration-500 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 overflow-hidden">
              <span className="relative z-10">View All &gt;&gt;</span>
            </button>
          </div>
          <ProductGrid products={newArrivalSarees.slice(0, 3)} cardClassName="h-64" />
        </div>

        

        
      </div>
    </section>
  );
};

export default CategoryGrid;