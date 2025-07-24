import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ProductGrid from '../../components/ProductGrid';
import { fetchCategories, fetchProductsByCategoryId, Category, Product } from '../../lib/api';

const CategoryPage: React.FC = () => {
  const router = useRouter();
  const { categoryName } = router.query;
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategoryAndProducts = async () => {
      if (!categoryName) return;

      setLoading(true);
      setError(null);
      try {
        // Fetch all categories to find the one matching the slug
        const allCategories = await fetchCategories();
        const foundCategory = allCategories.find(cat => cat.slug === categoryName);

        if (foundCategory) {
          setCategory(foundCategory);
          const fetchedProducts = await fetchProductsByCategoryId(foundCategory.categoryId);
          setProducts(fetchedProducts);
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

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-500">Error: {error}</div>;
  }

  if (!category) {
    return <div className="container mx-auto px-4 py-8 text-center">Category not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Category: {category.name}</h1>
      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <p>No products found for this category.</p>
      )}
    </div>
  );
};

export default CategoryPage;
