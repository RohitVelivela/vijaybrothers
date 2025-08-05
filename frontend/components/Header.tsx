'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, Menu, X, Instagram, Youtube } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Category, fetchCategoriesByDisplayType, searchProducts, Product } from '../lib/api';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getCartItemCount } = useCart();
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const menuRef = useRef<HTMLElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Search functionality
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim().length >= 2) {
      searchTimeoutRef.current = setTimeout(async () => {
        setIsSearching(true);
        try {
          const results = await searchProducts(query.trim(), undefined, 0, 10);
          setSearchResults(results);
          setShowSearchResults(true);
        } catch (error) {
          console.error('Search failed:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 300);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchResults(false);
    }
  };

  const handleProductClick = (productId: number) => {
    router.push(`/product/${productId}`);
    setShowSearchResults(false);
    setSearchQuery('');
  };

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
            <div ref={searchRef} className="relative w-full max-w-3xl">
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  placeholder="Search for sarees, fabrics, or Vijay Brothers products..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full px-5 py-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-300"
                />
                <button type="submit" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600">
                  <Search className="w-5 h-5" />
                </button>
              </form>
              
              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto search-dropdown-scroll">
                  {isSearching ? (
                    <div className="p-4 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mx-auto mb-2"></div>
                      Searching...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <>
                      {searchResults.map((product) => (
                        <div
                          key={product.productId}
                          onClick={() => handleProductClick(product.productId)}
                          className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 transition-colors"
                        >
                          <div className="w-14 h-14 flex-shrink-0 mr-3">
                            <img
                              src={product.images && product.images.length > 0 ? product.images[0].imageUrl : '/images/default-avatar.png'}
                              alt={product.name}
                              className="w-full h-full object-cover rounded-md"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate mb-1">{product.name}</h4>
                            <p className="text-xs text-gray-500 mb-1">[{product.productCode}]</p>
                          </div>
                        </div>
                      ))}
                      <div className="p-3 text-center border-t bg-gray-50">
                        <button
                          onClick={() => handleSearchSubmit(new Event('submit') as any)}
                          className="text-purple-600 text-sm font-medium hover:text-purple-700 transition-colors"
                        >
                          View all results for "{searchQuery}"
                        </button>
                      </div>
                    </>
                  ) : searchQuery.trim().length >= 2 ? (
                    <div className="p-4 text-center text-gray-500">
                      No products found for "{searchQuery}"
                    </div>
                  ) : null}
                </div>
              )}
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
          <ul className="flex justify-center items-center space-x-4 text-black">
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
                    className={`px-1 py-0.5 rounded-md text-[14px] md:text-[16px] font-work-sans font-medium text-nav-text-color hover:bg-transparent hover:text-nav-hover-color transition-all duration-200 ease-in-out whitespace-nowrap leading-normal tracking-[0.2px] capitalize ${isActive ? 'font-semibold text-nav-hover-color' : ''}`}
                  >
                    {category.name}
                  </button>

                  {hasSubcategories && isActive && (
                    <div
                      className={`absolute left-0 mt-2 rounded-lg shadow-xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 transition-all duration-300 ease-in-out transform min-w-max ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
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
                className="px-1 py-0.5 rounded-md text-[14px] md:text-[16px] font-work-sans font-medium text-nav-text-color hover:bg-transparent hover:text-nav-hover-color transition-all duration-200 ease-in-out whitespace-nowrap leading-normal tracking-[0.2px] capitalize"
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
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  placeholder="Search for sarees, fabrics, or Vijay Brothers products..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full px-5 py-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button type="submit" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Search className="w-5 h-5" />
                </button>
              </form>
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