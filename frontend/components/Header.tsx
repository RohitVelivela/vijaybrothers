import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Menu, X, Instagram, Youtube } from 'lucide-react';
import { useCart } from '../context/CartContext'; // Import useCart hook
import Link from 'next/link'; // Import Link for navigation
import { Category, fetchPublicCategories } from '../lib/api'; // Import Category interface and fetchPublicCategories

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getCartItemCount } = useCart(); // Use the useCart hook
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await fetchPublicCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Failed to fetch public categories:', error);
      }
    };
    loadCategories();
  }, []);

  const renderCategoryLinks = (categoryList: Category[]) => {
    return categoryList.map((category) => (
      <li key={category.categoryId} className="relative group">
        <Link href={`/category/${category.slug}`} className="hover:text-gray-900 transition-colors">
          {category.name}
        </Link>
        {category.subCategories && category.subCategories.length > 0 && (
          <ul className="absolute hidden group-hover:block bg-white shadow-lg py-2 rounded-md w-48 z-10">
            {renderCategoryLinks(category.subCategories)}
          </ul>
        )}
      </li>
    ));
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo - Moved to the left and slightly increased height */}
          <div className="flex-shrink-0 mr-6">
            <Link href="/">
              <img
                src="/VB logo white back.png"
                alt="Vijay Brothers Logo"
                className="h-24 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Search Bar - Increased size and updated placeholder */}
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

          {/* Cart Icon */}
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
        <nav className="hidden md:block py-3 border-t border-gray-200">
          <ul className="flex justify-center space-x-8 text-black">
            {renderCategoryLinks(categories.slice(0, 8))}
            <li><Link href="/aboutus" className="hover:text-gray-900 transition-colors">About Us</Link></li>
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
