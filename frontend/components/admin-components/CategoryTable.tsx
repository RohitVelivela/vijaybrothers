import React, { useEffect, useState } from 'react';

interface Category {
  categoryId: number;
  name: string;
  slug: string;
  description: string;
  categoryImage: string;
  isActive: boolean;
  position: number;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

const CategoryTable: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/categories'); 
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Category[] = await response.json();
        setCategories(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading categories...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">ID</th>
            <th className="py-2 px-4 border-b text-left">Image</th>
            <th className="py-2 px-4 border-b text-left">Name</th>
            <th className="py-2 px-4 border-b text-left">Description</th>
            <th className="py-2 px-4 border-b text-left">Active</th>
            <th className="py-2 px-4 border-b text-left">Position</th>
            <th className="py-2 px-4 border-b text-left">Display Order</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.categoryId} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{category.categoryId}</td>
              <td className="py-2 px-4 border-b">
                {category.categoryImage && (
                  <img 
                    src={category.categoryImage} 
                    alt={category.name} 
                    className="w-16 h-16 object-cover rounded" 
                  />
                )}
              </td>
              <td className="py-2 px-4 border-b">{category.name}</td>
              <td className="py-2 px-4 border-b">{category.description}</td>
              <td className="py-2 px-4 border-b">{category.isActive ? 'Yes' : 'No'}</td>
              <td className="py-2 px-4 border-b">{category.position}</td>
              <td className="py-2 px-4 border-b">{category.displayOrder}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;
