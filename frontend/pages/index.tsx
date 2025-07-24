import Link from 'next/link';
import { useState, useEffect } from 'react';
import HeroBanner from '../components/HeroBanner'; // Adjust path as needed
import CategoryGrid from '../components/CategoryGrid'; // Adjust path as needed
import ProductGrid from '../components/ProductGrid'; // Adjust path as needed
import { categories } from '../data/categories'; // Adjust path as needed
import { allProducts } from '../data/products'; // Adjust path as needed
import { useAuth } from '../context/AuthContext'; // Adjust path as needed
import { fetchCategoriesByDisplayType, Category, fetchProductsByCategoryId, Product } from '../lib/api'; // Import fetchCategoriesByDisplayType and Category interface

const LandingPage = () => {
  const { isAuthenticated, logout } = useAuth();
  const [filteredProducts, setFilteredProducts] = useState(allProducts.filter(p => !p.deleted));
  const [topCategories, setTopCategories] = useState<Category[]>([]);
  const [promotionalSections, setPromotionalSections] = useState<{
    category: Category;
    products: Product[];
  }[]>([]);

  useEffect(() => {
    const loadTopCategories = async () => {
      try {
        const fetchedTopCategories = await fetchCategoriesByDisplayType('Top Category');
        setTopCategories(fetchedTopCategories);
      } catch (error) {
        console.error('Failed to fetch top categories:', error);
      }
    };

    const loadPromotionalSections = async () => {
      try {
        const fetchedPromotionalCategories = await fetchCategoriesByDisplayType('Promotional Sections');
        const sectionsData = await Promise.all(fetchedPromotionalCategories.map(async (cat) => {
          const products = await fetchProductsByCategoryId(cat.categoryId);
          return { category: cat, products };
        }));
        setPromotionalSections(sectionsData);
      } catch (error) {
        console.error('Failed to fetch promotional sections:', error);
      }
    };

    loadTopCategories();
    loadPromotionalSections();
  }, []);

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
      <CategoryGrid categories={topCategories} title="Shop by Category" />

      <div className="my-16">
        <ProductGrid products={filteredProducts} />
      </div>

      {promotionalSections.map((section) => (
        <div key={section.category.categoryId} className="my-16">
          <h2 className="text-3xl font-serif font-bold text-gray-800 text-center mb-8">
            {section.category.name}
          </h2>
          <ProductGrid products={section.products} />
        </div>
      ))}
      
    </>
  );
};

export default LandingPage;
