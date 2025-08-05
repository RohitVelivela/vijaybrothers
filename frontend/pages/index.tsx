import Link from 'next/link';
import { useState, useEffect } from 'react';
import HeroBanner from '../components/HeroBanner'; // Adjust path as needed
import CategoryGrid from '../components/CategoryGrid'; // Adjust path as needed
import ProductGrid from '../components/ProductGrid'; // Adjust path as needed
import PromotionalSection from '../components/PromotionalSection';
import { useAuth } from '../context/AuthContext'; // Adjust path as needed
import { fetchCategoriesByDisplayType, Category, fetchProductsByCategoryId, Product } from '../lib/api'; // Import fetchCategoriesByDisplayType and Category interface

const LandingPage = () => {
  const { isAuthenticated, logout } = useAuth();
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
        console.log('Promotional Sections Data:', JSON.stringify(sectionsData, null, 2));
      } catch (error) {
        console.error('Failed to fetch promotional sections:', error);
      }
    };

    loadTopCategories();
    loadPromotionalSections();
  }, []);

  return (
    <>
      <HeroBanner />
      <CategoryGrid categories={topCategories} title="Shop by Category" />

      {promotionalSections.map((section) => (
        <PromotionalSection
          key={section.category.categoryId}
          title={section.category.name}
          products={section.products}
          categorySlug={section.category.slug || section.category.name.toLowerCase().replace(/\s+/g, '-')}
        />
      ))}
      
    </>
  );
};

export default LandingPage;
