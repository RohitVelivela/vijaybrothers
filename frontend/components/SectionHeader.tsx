import React from 'react';
import { ArrowRight } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  showViewAll?: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, showViewAll = false }) => {
  return (
    <div className="text-center mb-12">
      <div className="flex items-center justify-center mb-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-red-300 max-w-24"></div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 px-8">
          {title}
        </h2>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-red-300 max-w-24"></div>
      </div>
      {subtitle && (
        <p className="text-gray-600 text-lg mb-4">{subtitle}</p>
      )}
      {showViewAll && (
        <button className="text-red-500 hover:text-red-600 font-semibold flex items-center justify-center space-x-2 transition-colors group">
          <span>View All</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </div>
  );
};

export default SectionHeader;