import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { ChevronDown, X } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import { fetchPublicCategories, fetchProductsByCategoryId, Category, Product } from '../../lib/api';

interface FilterState {
  minPrice: number;
  maxPrice: number;
  fabrics: string[];
  sortBy: 'latest' | 'price-low' | 'price-high' | 'name';
}

const CategoryPage: React.FC = () => {
  const router = useRouter();
  const { categoryName } = router.query;

  // Helper function to check if a product is new (created within last 90 days)
  const isProductNew = (product: Product): boolean => {
    if (!product.createdAt) return false;
    
    const createdDate = new Date(product.createdAt);
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    
    return createdDate > ninetyDaysAgo;
  };
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    minPrice: 0,
    maxPrice: 5000,
    fabrics: [],
    sortBy: 'latest'
  });
  const [showFilters, setShowFilters] = useState(false);

  // Get unique fabrics from products
  const availableFabrics = useMemo(() => {
    const fabricSet = new Set<string>();
    products.forEach(product => {
      if (product.description && product.description.includes('silk')) {
        fabricSet.add('Silk');
      }
      if (product.description && product.description.includes('cotton')) {
        fabricSet.add('Cotton');
      }
      if (product.description && product.description.includes('chiffon')) {
        fabricSet.add('Chiffon');
      }
      // Add more fabric detection logic based on your product descriptions
      fabricSet.add('Soft Silk'); // Default for the example
    });
    return Array.from(fabricSet);
  }, [products]);

  // Apply filters and sorting
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const price = product.price;
      const withinPriceRange = price >= filters.minPrice && price <= filters.maxPrice;
      const matchesFabric = filters.fabrics.length === 0 || filters.fabrics.some(fabric => 
        product.description?.toLowerCase().includes(fabric.toLowerCase())
      );
      return withinPriceRange && matchesFabric;
    });

    // Sort products
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default: // 'latest'
        // Assuming products are already sorted by latest
        break;
    }

    return filtered;
  }, [products, filters]);

  useEffect(() => {
    const loadCategoryAndProducts = async () => {
      if (!categoryName) return;

      setLoading(true);
      setError(null);
      try {
        const allCategories = await fetchPublicCategories();
        
        // Flatten nested categories to search through all categories
        const flattenCategories = (categories: Category[]): Category[] => {
          const flattened: Category[] = [];
          categories.forEach(cat => {
            flattened.push(cat);
            if (cat.subCategories && cat.subCategories.length > 0) {
              flattened.push(...flattenCategories(cat.subCategories));
            }
          });
          return flattened;
        };
        
        const flatCategories = flattenCategories(allCategories);
        const foundCategory = flatCategories.find(cat => cat.slug === categoryName);

        if (foundCategory) {
          setCategory(foundCategory);
          const fetchedProducts = await fetchProductsByCategoryId(foundCategory.categoryId);
          setProducts(fetchedProducts);
          
          // Set max price based on products
          if (fetchedProducts.length > 0) {
            const maxProductPrice = Math.max(...fetchedProducts.map(p => p.price));
            setFilters(prev => ({
              ...prev,
              maxPrice: Math.ceil(maxProductPrice / 100) * 100
            }));
          }
        } else {
          setError('Category not found.');
          setProducts([]);
        }
      } catch (err) {
        console.error('Failed to fetch category or products:', err);
        setError('Failed to load category or products.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadCategoryAndProducts();
  }, [categoryName]);

  const handlePriceChange = (min: number, max: number) => {
    // Ensure min is not greater than max
    const validMin = Math.min(min, max);
    const validMax = Math.max(min, max);
    
    setFilters(prev => ({ 
      ...prev, 
      minPrice: validMin, 
      maxPrice: validMax 
    }));
  };

  const handleFabricToggle = (fabric: string) => {
    setFilters(prev => ({
      ...prev,
      fabrics: prev.fabrics.includes(fabric)
        ? prev.fabrics.filter(f => f !== fabric)
        : [...prev.fabrics, fabric]
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      minPrice: 0,
      maxPrice: Math.ceil(Math.max(...products.map(p => p.price)) / 100) * 100,
      fabrics: [],
      sortBy: 'latest'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-500">Error: {error}</div>;
  }

  if (!category) {
    return <div className="container mx-auto px-4 py-8 text-center">Category not found.</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 bg-white rounded-lg shadow-sm border h-fit">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
                <button 
                  onClick={clearAllFilters}
                  className="text-sm text-purple-600 hover:text-purple-700"
                >
                  Clear All
                </button>
              </div>

              {/* Price Filter */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Price</h3>
                
                {/* Price Range Slider */}
                {products.length > 0 && (
                  <div className="relative mb-6">
                    {(() => {
                      const maxPrice = Math.max(...products.map(p => p.price)) || filters.maxPrice;
                      const minPercent = Math.max(0, Math.min(100, (filters.minPrice / maxPrice) * 100));
                      const maxPercent = Math.max(0, Math.min(100, (filters.maxPrice / maxPrice) * 100));
                      const widthPercent = Math.max(0, maxPercent - minPercent);
                      
                      return (
                        <div className="w-full">
                          {/* Slider container */}
                          <div className="relative h-6 flex items-center px-2">
                            {/* Background track */}
                            <div className="w-full h-2 bg-gray-200 rounded-full relative">
                              {/* Active range bar */}
                              <div 
                                className="absolute h-2 bg-orange-400 rounded-full"
                                style={{
                                  left: `${minPercent}%`,
                                  width: `${widthPercent}%`
                                }}
                              />
                            </div>
                            
                            {/* Range inputs with custom styling */}
                            <input
                              type="range"
                              min="0"
                              max={maxPrice}
                              value={filters.minPrice}
                              onChange={(e) => handlePriceChange(parseInt(e.target.value), filters.maxPrice)}
                              className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer range-slider-min"
                              style={{ 
                                zIndex: 1,
                                background: 'transparent'
                              }}
                            />
                            
                            <input
                              type="range"
                              min="0"
                              max={maxPrice}
                              value={filters.maxPrice}
                              onChange={(e) => handlePriceChange(filters.minPrice, parseInt(e.target.value))}
                              className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer range-slider-max"
                              style={{ 
                                zIndex: 2,
                                background: 'transparent'
                              }}
                            />
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
                
                <style jsx>{`
                  .range-slider-min::-webkit-slider-thumb,
                  .range-slider-max::-webkit-slider-thumb {
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #fb923c;
                    border: 2px solid white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    cursor: pointer;
                  }
                  
                  .range-slider-min::-moz-range-thumb,
                  .range-slider-max::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #fb923c;
                    border: 2px solid white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    cursor: pointer;
                    border: none;
                  }
                  
                  .range-slider-min::-webkit-slider-track,
                  .range-slider-max::-webkit-slider-track {
                    background: transparent;
                    height: 8px;
                  }
                  
                  .range-slider-min::-moz-range-track,
                  .range-slider-max::-moz-range-track {
                    background: transparent;
                    height: 8px;
                    border: none;
                  }
                  
                  .range-slider-min:focus,
                  .range-slider-max:focus {
                    outline: none;
                  }
                  
                  .range-slider-min::-webkit-slider-thumb:hover,
                  .range-slider-max::-webkit-slider-thumb:hover {
                    transform: scale(1.1);
                  }
                  
                  .range-slider-min::-moz-range-thumb:hover,
                  .range-slider-max::-moz-range-thumb:hover {
                    transform: scale(1.1);
                  }
                `}</style>

                {/* Price inputs */}
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="flex items-center border border-gray-300 rounded px-3 py-2">
                      <span className="text-gray-500 mr-2">₹</span>
                      <input
                        type="number"
                        value={filters.minPrice}
                        onChange={(e) => handlePriceChange(parseInt(e.target.value) || 0, filters.maxPrice)}
                        className="w-full text-center border-none outline-none"
                      />
                    </div>
                  </div>
                  <span className="text-gray-400">-</span>
                  <div className="flex-1">
                    <div className="flex items-center border border-gray-300 rounded px-3 py-2">
                      <span className="text-gray-500 mr-2">₹</span>
                      <input
                        type="number"
                        value={filters.maxPrice}
                        onChange={(e) => handlePriceChange(filters.minPrice, parseInt(e.target.value) || 5000)}
                        className="w-full text-center border-none outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Fabric Filter */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Fabric</h3>
                <div className="space-y-3">
                  {availableFabrics.map(fabric => (
                    <label key={fabric} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.fabrics.includes(fabric)}
                        onChange={() => handleFabricToggle(fabric)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="ml-3 text-gray-700">{fabric}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 bg-white rounded-lg shadow-sm border p-4">
              <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">{category.name}</h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {filteredAndSortedProducts.length} products
                </span>
                <div className="flex items-center">
                  <label htmlFor="sort" className="text-sm font-medium text-gray-700 mr-2">Sort By:</label>
                  <select
                    id="sort"
                    value={filters.sortBy}
                    onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as FilterState['sortBy'] }))}
                    className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="latest">Latest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products */}
            {filteredAndSortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard
                    key={product.productId}
                    id={product.productId}
                    title={product.name}
                    price={product.price.toString()}
                    image={product.images && product.images.length > 0 ? product.images[0].imageUrl : '/images/default-avatar.png'}
                    inStock={product.inStock}
                    isNew={isProductNew(product)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
                <p className="text-gray-500">No products found matching your filters.</p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
                >
                  Clear filters to see all products
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
