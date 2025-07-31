import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, Menu, X, Instagram, Youtube } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Category, fetchCategoriesByDisplayType } from '../lib/api';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getCartItemCount } = useCart();
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const menuRef = useRef<HTMLElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await fetchCategoriesByDisplayType('Navigation Menu');
        const parentCategories = fetchedCategories.filter(c => !c.parentId);
        setCategories(parentCategories);
      } catch (error) {
        console.error('Failed to fetch public categories:', error);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setClickedIndex(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMouseEnter = (index: number) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => {
      setActiveIndex(null);
    }, 200);
  };

  const handleNavClick = (category: Category, index: number) => {
    const hasSubcategories = category.subCategories && category.subCategories.length > 0;
    if (hasSubcategories) {
      setClickedIndex(clickedIndex === index ? null : index);
    } else {
      router.push(`/category/${category.slug}`);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <div className="flex-shrink-0 mr-6">
            <Link href="/">
              <img
                src="/VB logo white back.png"
                alt="Vijay Brothers Logo"
                className="h-24 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 justify-center px-8">
            <div className="relative w-full max-w-3xl">
              <input
                type="text"
                placeholder="Search for sarees, fabrics, or Vijay Brothers products..."
                className="w-full px-5 py-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-300"
              />
              <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-7 md:mr-10  ">
            <a href="https://www.instagram.com/vijaybrothers_sarees" target="_blank" rel="noopener noreferrer" className="relative flex flex-col items-center text-gray-600 hover:text-purple-600 transition-colors">
              <Instagram className="w-8 h-8" />
              <span className="text-xs font-medium mt-1">Instagram</span>
            </a>
            <a href="https://www.youtube.com/@vijaybrothers/featured" target="_blank" rel="noopener noreferrer" className="relative flex flex-col items-center text-gray-600 hover:text-purple-600 transition-colors">
              <Youtube className="w-8 h-8" />
              <span className="text-xs font-medium mt-1">Youtube</span>
            </a>
            <Link href="/cart" className="relative flex flex-col items-center text-gray-600 hover:text-purple-600 transition-colors">
              <ShoppingCart className="w-8 h-8" />
              <span className="text-xs font-medium mt-1">Cart</span>
              <span className="absolute -top-2 -right-3 bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">{getCartItemCount()}</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-600">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Categories Navigation */}
        <nav ref={menuRef} className="hidden md:block py-3 border-t border-gray-200">
          <ul className="flex justify-center items-center space-x-8 text-black">
            {categories.slice(0, 8).map((category, index) => {
              const isActive = activeIndex === index || clickedIndex === index;
              const hasSubcategories = category.subCategories && category.subCategories.length > 0;

              return (
                <li
                  key={category.categoryId}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    onClick={() => handleNavClick(category, index)}
                    className="px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 ease-in-out"
                  >
                    {category.name}
                  </button>

                  {hasSubcategories && isActive && (
                    <div
                      className={`absolute left-0 mt-2 w-64 rounded-lg shadow-xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 transition-all duration-300 ease-in-out transform ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                      <div className="p-2">
                        {category.subCategories.map((subCategory) => (
                          <Link
                            key={subCategory.categoryId}
                            href={`/category/${subCategory.slug}`}
                            className="block w-full text-left px-4 py-2 text-base text-gray-800 rounded-md hover:bg-rose-50 hover:text-rose-700 transition-all duration-200 ease-in-out hover:pl-5"
                          >
                            {subCategory.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
            <li>
              <button 
                onClick={() => router.push('/aboutus')}
                className="px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 ease-in-out"
              >
                About Us
              </button>
            </li>
          </ul>
        </nav>

        {/* Mobile Menu & Search */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <div className="relative w-full mb-4">
              <input
                type="text"
                placeholder="Search for sarees, fabrics, or Vijay Brothers products..."
                className="w-full px-5 py-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search className="w-5 h-5" />
              </button>
            </div>
            <div className="flex justify-around items-center py-4 border-t border-b border-gray-200">
              <Link href="/cart" className="relative flex flex-col items-center text-gray-600 hover:text-purple-600">
                <ShoppingCart className="w-6 h-6" />
                <span className="text-xs mt-1">Cart</span>
                <span className="absolute -top-2 -right-3 bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">{getCartItemCount()}</span>
              </Link>
            </div>
            {/* You can add mobile navigation links here if needed */}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
