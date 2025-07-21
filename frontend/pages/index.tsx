import Link from 'next/link';
import { useState } from 'react';
import HeroBanner from '../components/HeroBanner'; // Adjust path as needed
import CategoryGrid from '../components/CategoryGrid'; // Adjust path as needed
import ProductGrid from '../components/ProductGrid'; // Adjust path as needed
import { categories } from '../data/categories'; // Adjust path as needed
import { allProducts } from '../data/products'; // Adjust path as needed
import { useAuth } from '../context/AuthContext'; // Adjust path as needed

const LandingPage = () => {
  const { isAuthenticated, logout } = useAuth();
  const [filteredProducts, setFilteredProducts] = useState(allProducts.filter(p => !p.deleted));

  const handleShowDeletedChange = (showDeleted: boolean) => {
    if (showDeleted) {
      setFilteredProducts(allProducts);
    } else {
      setFilteredProducts(allProducts.filter(p => !p.deleted));
    }
  };
  return (
    <>
      <HeroBanner />
      <CategoryGrid categories={categories} title="Shop by Category" />

      <div className="my-16">
        <ProductGrid products={filteredProducts} />
      </div>
      
    </>
  );
};

export default LandingPage;
