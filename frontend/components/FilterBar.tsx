import React, { useState } from 'react';
import { Filter, ChevronDown } from 'lucide-react';

interface FilterBarProps {
  onShowDeletedChange: (showDeleted: boolean) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onShowDeletedChange }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [showDeleted, setShowDeleted] = useState(false);

  const handleShowDeletedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setShowDeleted(isChecked);
    onShowDeletedChange(isChecked);
  };

  const filters = [
    { id: 'all', label: 'All Sarees', count: 500 },
    { id: 'silk', label: 'Silk Sarees', count: 150 },
    { id: 'cotton', label: 'Cotton Sarees', count: 120 },
    { id: 'designer', label: 'Designer', count: 80 },
    { id: 'bridal', label: 'Bridal', count: 45 },
    { id: 'casual', label: 'Casual', count: 105 }
  ];

  const sortOptions = [
    'Featured',
    'Price: Low to High',
    'Price: High to Low',
    'Newest First',
    'Best Selling',
    'Customer Rating'
  ];

  return (
    <div className="bg-white border-b border-gray-200 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === filter.id
                    ? 'bg-red-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                {sortOptions.map((option) => (
                  <option key={option} value={option.toLowerCase().replace(/[^a-z0-9]/g, '-')}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              <span className="text-sm">More Filters</span>
            </button>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="show-deleted"
                checked={showDeleted}
                onChange={handleShowDeletedChange}
                className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <label htmlFor="show-deleted" className="ml-2 block text-sm text-gray-900">
                Show Deleted
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;