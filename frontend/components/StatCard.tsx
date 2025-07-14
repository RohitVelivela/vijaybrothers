import React from 'react';
import { ShoppingCart, TrendingUp, Package } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: 'ShoppingCart' | 'TrendingUp' | 'Package';
  color: 'primary' | 'success' | 'warning';
}

const iconMap = {
  ShoppingCart: ShoppingCart,
  TrendingUp: TrendingUp,
  Package: Package,
};

const colorMap = {
  primary: 'bg-blue-50 text-blue-600',
  success: 'bg-green-50 text-green-600',
  warning: 'bg-orange-50 text-orange-600',
};

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  const IconComponent = iconMap[icon];
  const bgColorClass = colorMap[color];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex items-center space-x-4">
      <div className={`p-3 rounded-full ${bgColorClass} flex items-center justify-center`}>
        <IconComponent className="w-6 h-6" strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-bold text-gray-800 mt-1">{value}</h3>
      </div>
    </div>
  );
};

export default StatCard;