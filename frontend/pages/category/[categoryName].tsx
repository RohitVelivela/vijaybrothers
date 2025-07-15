import React from 'react';
import { useRouter } from 'next/router';
import { allProducts, Product } from '../../data/products';
import ProductGrid from '../../components/ProductGrid';

const CategoryPage: React.FC = () => {
  const router = useRouter();
  const { categoryName } = router.query;

  const filteredProducts: Product[] = allProducts.filter(
    (product) => product.category.toLowerCase() === (categoryName as string)?.toLowerCase()
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Category: {categoryName}</h1>
      {filteredProducts.length > 0 ? (
        <ProductGrid products={filteredProducts} />
      ) : (
        <p>No products found for this category.</p>
      )}
    </div>
  );
};

export default CategoryPage;
