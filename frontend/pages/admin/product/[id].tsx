import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { fetchProductById, Product } from '../../../lib/api';
import ProductDetailPage from '../../../components/ProductDetailPage';

export default function AdminProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && typeof id === 'string') {
      const fetchProduct = async () => {
        try {
          const productData = await fetchProductById(parseInt(id));
          setProduct(productData);
        } catch (error) {
          console.error('Failed to fetch product:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:underline"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProductDetailPage
      product={product}
      onBack={() => router.back()}
      onBuyNow={(quantity) => {
        // Handle buy now action
        router.push('/checkout');
      }}
    />
  );
}

// Disable SSG for dynamic routes
export async function getServerSideProps() {
  return {
    props: {},
  };
}