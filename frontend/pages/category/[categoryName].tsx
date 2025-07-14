import React from 'react';
import { useRouter } from 'next/router';

const CategoryPage: React.FC = () => {
  const router = useRouter();
  const { categoryName } = router.query;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Category: {categoryName}</h1>
      <p>This page will display products for the {categoryName} category.</p>
      {/* You can add product listing components here */}
    </div>
  );
};

export default CategoryPage;
