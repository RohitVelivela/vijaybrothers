import React from 'react';
import Link from 'next/link';
import ImageNext from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; // Import useAuth
import { LayoutDashboard, Package, ShoppingCart, Settings, ChevronLeft, ChevronRight, ListFilter, Image as LucideImage, PanelLeft, PanelRight, Menu, ChevronsLeft } from 'lucide-react';

interface MenuItem {
  name: string;
  icon: string;
  link: string;
}

interface SidebarProps {
  isOpen: boolean;
  isCollapsed?: boolean;
  activeLink?: string;
  toggleCollapse: () => void;
}

const iconMap: { [key: string]: React.ReactNode } = {
  LayoutDashboard: <LayoutDashboard className="h-5 w-5 mr-3" />,
  Package: <Package className="h-5 w-5 mr-3" />,
  ShoppingCart: <ShoppingCart className="h-5 w-5 mr-3" />,
  Settings: <Settings className="h-5 w-5 mr-3" />,
  ListFilter: <ListFilter className="h-5 w-5 mr-3" />,
  ChevronLeft: <ChevronLeft className="h-5 w-5 mr-3" />,
  ChevronRight: <ChevronRight className="h-5 w-5 mr-3" />,
  ImageSquare: <LucideImage className="h-5 w-5 mr-3" />, // banners icon replaced with Image
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, isCollapsed, activeLink, toggleCollapse }) => {
  const router = useRouter();
  const { logout } = useAuth(); // Get logout function from AuthContext
  const menuItems: MenuItem[] = [
    { name: 'Dashboard', icon: 'LayoutDashboard', link: '/admin/dashboard' },
    { name: 'Categories', icon: 'Package', link: '/admin/categories' },
    { name: 'Products', icon: 'ListFilter', link: '/admin/product-management' },
    { name: 'Orders', icon: 'ShoppingCart', link: '/admin/orders' },
    { name: 'Banners', icon: 'ImageSquare', link: '/admin/banners' },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-full z-50 bg-[#581C26] text-white transition-all duration-300 ease-smooth
      ${isCollapsed ? 'w-20' : 'w-60'}
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}
    >
      <div className="absolute top-4 -right-3 flex items-center justify-center w-6 h-6 bg-gray-800 rounded-full cursor-pointer" onClick={toggleCollapse}>
        {isCollapsed ? <ChevronsLeft className="h-8 w-8 text-white" /> : <Menu className="h-8 w-8 text-white" />}
      </div>
      <div className="flex flex-col items-center justify-center py-8 border-b border-white/10">
        <Link href="/admin/dashboard" className="flex flex-col items-center space-y-2">
          <div className="p-2 bg-white rounded-full shadow-md mb-2" style={{ marginTop: isCollapsed ? '0' : '1rem' }}>
            <ImageNext src="/VB logo white back.png" alt="Vijay Brothers Logo" width={100} height={100} className="rounded-full" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col items-center mt-3">
              <span className="text-xl font-bold text-white">Vijay Brothers</span>
              <span className="text-sm text-[#E4D7CE]">Traditional Wear</span>
            </div>
          )}
        </Link>
      </div>
      <nav className="flex-grow mt-8">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.link}
                className={`flex items-center py-3 px-4 text-[#F0F0F0] hover:bg-white/10 hover:text-white transition-colors duration-200 border-l-4 border-transparent hover:border-[#FFD700]
                ${activeLink === item.name ? 'bg-white/10 border-[#FFD700]' : ''}`}
              >
                {iconMap[item.icon] || null}
                {!isCollapsed && item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto pt-4 border-t border-white/10">
        <button
          onClick={() => {
            logout();
            router.push('/admin/login');
          }}
          className={`flex items-center py-3 px-4 bg-red-600 text-white hover:bg-red-700 transition-colors duration-200 rounded-md mx-4 shadow-md hover:shadow-lg
        `}
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5 mr-3" />}
          {!isCollapsed && 'Logout'}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

