import Link from 'next/link';
import HeroBanner from '../components/HeroBanner'; // Adjust path as needed
import CategoryGrid from '../components/CategoryGrid'; // Adjust path as needed
import ProductGrid from '../components/ProductGrid'; // Adjust path as needed
import { categories } from '../data/categories'; // Adjust path as needed
import { allProducts as products } from '../data/products'; // Adjust path as needed
import { useAuth } from '../context/AuthContext'; // Adjust path as needed

const LandingPage = () => {
  const { isAuthenticated, logout } = useAuth();
  return (
    <>
      <HeroBanner />
      <CategoryGrid categories={categories} title="Shop by Category" />
      <div className="my-16">
        <ProductGrid products={products} />
      </div>
      
    </>
  );
};

export default LandingPage;
