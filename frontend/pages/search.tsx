import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { searchProducts, Product } from '../lib/api';
import { Search, Filter } from 'lucide-react';

const SearchPage: React.FC = () => {
  const router = useRouter();
  const { q, categoryId } = router.query;

  // Helper function to check if a product is new (created within last 90 days)
  const isProductNew = (product: Product): boolean => {
    if (!product.createdAt) return false;
    
    const createdDate = new Date(product.createdAt);
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    
    return createdDate > ninetyDaysAgo;
  };
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (q && typeof q === 'string') {
      setSearchQuery(q);
      performSearch(q, 0, true);
    }
  }, [q, categoryId]);

  const performSearch = async (query: string, page: number = 0, reset: boolean = false) => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const categoryIdNum = categoryId && typeof categoryId === 'string' ? parseInt(categoryId) : undefined;
      const results = await searchProducts(query.trim(), categoryIdNum, page, 20);
      
      if (reset) {
        setProducts(results);
      } else {
        setProducts(prev => [...prev, ...results]);
      }
      
      setHasMore(results.length === 20);
      setCurrentPage(page);
    } catch (err) {
      console.error('Search failed:', err);
      setError('Failed to search products. Please try again.');
      if (reset) {
        setProducts([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore && q && typeof q === 'string') {
      performSearch(q, currentPage + 1, false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <form onSubmit={handleSearchSubmit} className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for sarees, fabrics, or Vijay Brothers products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Search
            </button>
          </form>
        </div>

        {/* Search Results */}
        {q && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Search Results
            </h1>
            <p className="text-gray-600">
              {loading && products.length === 0 ? (
                'Searching...'
              ) : (
                <>
                  {products.length > 0 ? (
                    <>Showing results for "{q}" ({products.length} product{products.length !== 1 ? 's' : ''})</>
                  ) : (
                    <>No results found for "{q}"</>
                  )}
                </>
              )}
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Products Grid */}
        {products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 mb-8">
            {products.map((product) => (
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
        )}

        {/* Load More Button */}
        {hasMore && products.length > 0 && (
          <div className="text-center">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Load More Products'}
            </button>
          </div>
        )}

        {/* No Results State */}
        {!loading && products.length === 0 && q && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any products matching "{q}". Try adjusting your search terms.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>Search suggestions:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Check your spelling</li>
                <li>Try more general keywords</li>
                <li>Try different keywords</li>
                <li>Browse our categories instead</li>
              </ul>
            </div>
          </div>
        )}

        {/* Initial State */}
        {!q && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Search for products</h3>
            <p className="text-gray-600">
              Enter keywords to search for sarees, fabrics, and other products.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SearchPage;