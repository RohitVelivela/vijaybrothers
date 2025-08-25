import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Product, fetchProductById } from '../../lib/api';
import dynamic from 'next/dynamic';
import { useCart } from '../../context/CartContext';

const ProductDetailPage = dynamic(
  () => import('../../components/ProductDetailPage'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }
);

const ProductPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    if (slug && Array.isArray(slug)) {
      const id = slug[slug.length - 1];
      const getProduct = async () => {
        try {
          setLoading(true);
          const fetchedProduct = await fetchProductById(Number(id));
          setProduct(fetchedProduct);
        } catch (err) {
          setError('Failed to fetch product');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      getProduct();
    }
  }, [slug]);

  const handleBuyNow = async (quantity: number = 1) => {
    if (!product) return;
    
    try {
      // Add product to cart first
      await addToCart(product.productId, quantity);
      
      // Navigate to cart page for checkout
      router.push('/cart');
    } catch (error) {
      console.error('Failed to add product to cart:', error);
      // You might want to show an error toast here
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h1>
          <p className="text-gray-600">{error || 'The requested product could not be found.'}</p>
          <button 
            onClick={() => router.back()} 
            className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <ProductDetailPage product={product} onBack={() => router.back()} onBuyNow={handleBuyNow} />;
};

export default ProductPage;
