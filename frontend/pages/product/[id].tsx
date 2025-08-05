import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { fetchProductById, Product } from '../../lib/api'; // Adjust path as needed
import ProductDetailPage from '../../components/ProductDetailPage'; // Adjust path as needed
import { useCart } from '../../context/CartContext';

const ProductPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    if (id) {
      const getProduct = async () => {
        try {
          setLoading(true);
          const fetchedProduct = await fetchProductById(Number(id));
          setProduct(fetchedProduct);
        } catch (err) {
          setError('Failed to fetch product');
        } finally {
          setLoading(false);
        }
      };
      getProduct();
    }
  }, [id]);

  const handleBack = () => {
    router.back();
  };

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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p>The product with ID {id} could not be found.</p>
      </div>
    );
  }

  return (
    <ProductDetailPage 
      product={product} 
      onBack={handleBack} 
      onBuyNow={handleBuyNow} 
    />
  );
};

export default ProductPage;
