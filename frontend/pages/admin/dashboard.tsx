'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

import Sidebar from '../../components/ui/Sidebar';
import StatCard from '../../components/StatCard';
import OrdersTable from '../../components/admin-components/OrdersTable';

import { fetchOrders, OrderListItem, Page, fetchDashboardStats } from '../../lib/api';

interface DashboardStats {
  totalOrders: number;
  monthlyRevenue: number;
  productsInStock: number;
}


interface Order {
  id: number;
  orderId: string;
  customerName: string;
  totalAmount: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  orderDate: Date;
}








import AdminHeader from '../../components/AdminHeader';

const DashboardOverview = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'hi'>('en');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);

  const mapOrderListItemToOrder = (item: OrderListItem): Order => {
    return {
      id: item.orderId, // Using orderId from OrderListItem as id for Order
      orderId: item.orderNumber,
      customerName: item.shippingName,
      totalAmount: item.totalAmount,
      status: item.orderStatus as 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled', // Assuming direct mapping of status strings
      orderDate: new Date(item.createdAt),
    };
  };

  useEffect(() => {
    const loadStats = async () => {
      try {
        const stats = await fetchDashboardStats();
        setDashboardStats(stats);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      }
    };
    loadStats();
  }, []);

  const loadMoreOrders = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const data = await fetchOrders(undefined, currentPage, 5); // Fetch 5 orders per page
      const mappedOrders: Order[] = data.content.map(mapOrderListItemToOrder);
      setOrders(prevOrders => [...prevOrders, ...mappedOrders]);
      setHasMore(data.number < data.totalPages - 1);
      setCurrentPage(prevPage => prevPage + 1);
    } catch (err) {
      
      setHasMore(false); // Stop trying to load more on error
    } finally {
      setLoading(false);
    }
  }, [currentPage, loading, hasMore]);

  useEffect(() => {
    loadMoreOrders();
  }, []); // Initial load

  const lastOrderElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreOrders();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, loadMoreOrders]);

  const menuItems = [
    { name: 'Dashboard', icon: 'LayoutDashboard', link: '/admin/dashboard' },
    { name: 'Banners', icon: 'Image', link: '/admin/banners' },
    { name: 'Categories', icon: 'ListFilter', link: '/admin/categories' },
    { name: 'Products', icon: 'Package', link: '/admin/product-management' },
    { name: 'Orders', icon: 'ShoppingCart', link: '/admin/orders' },
  ];

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage as 'en' | 'hi');
  }, []);

  const translations = {
    en: {
      dashboardOverview: 'Dashboard Overview',
      totalOrders: 'Total Orders',
      monthlyRevenue: 'Monthly Revenue',
      productsInStock: 'Products in Stock',
      latestOrders: 'Latest Orders',
      viewAllOrders: 'View All Orders'
    },
    hi: {
      dashboardOverview: 'डैशबोर्ड अवलोकन',
      totalOrders: 'कुल ऑर्डर',
      monthlyRevenue: 'मासिक आय',
      productsInStock: 'स्टॉक में उत्पाद',
      latestOrders: 'नवीनतम ऑर्डर',
      viewAllOrders: 'सभी ऑर्डर देखें'
    }
  };

  const t = translations[currentLanguage];

  const dashboardStatsData = [
    {
      title: t.totalOrders,
      value: dashboardStats ? dashboardStats.totalOrders.toLocaleString() : '...',
      icon: 'ShoppingCart' as const,
      color: 'primary' as const
    },
    {
      title: t.monthlyRevenue,
      value: dashboardStats ? `₹${dashboardStats.monthlyRevenue.toLocaleString()}` : '...',
      icon: 'TrendingUp' as const,
      color: 'success' as const
    },
    {
      title: t.productsInStock,
      value: dashboardStats ? dashboardStats.productsInStock.toLocaleString() : '...',
      icon: 'Package' as const,
      color: 'warning' as const
    }
  ];

  // Mock Latest Orders Data with Indian names and proper status colors
  const latestOrders = [
    {
      id: 1,
      orderId: 'ORD-2024-001',
      customerName: 'Priya Sharma',
      totalAmount: 4500,
      status: 'Pending' as const,
      orderDate: new Date('2024-01-15')
    },
    {
      id: 2,
      orderId: 'ORD-2024-002',
      customerName: 'Anita Gupta',
      totalAmount: 7800,
      status: 'Shipped' as const,
      orderDate: new Date('2024-01-14')
    },
    {
      id: 3,
      orderId: 'ORD-2024-003',
      customerName: 'Meera Patel',
      totalAmount: 3200,
      status: 'Delivered' as const,
      orderDate: new Date('2024-01-13')
    },
    {
      id: 4,
      orderId: 'ORD-2024-004',
      customerName: 'Kavita Singh',
      totalAmount: 5600,
      status: 'Cancelled' as const,
      orderDate: new Date('2024-01-12')
    },
    {
      id: 5,
      orderId: 'ORD-2024-005',
      customerName: 'Sunita Rao',
      totalAmount: 2100,
      status: 'Pending' as const,
      orderDate: new Date('2024-01-11')
    }
  ];

  const handleMenuToggle = () => {
    setIsSidebarOpen(prev => !prev);
    setIsSidebarCollapsed(prev => !prev);
  };

  const handleViewAllOrders = () => {
    router.push('/admin/orders');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader adminEmail="admin@vijaybrothers.com" />
      
      
      

      <Sidebar
        isOpen={isSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        activeLink="/admin/dashboard"
        toggleCollapse={handleMenuToggle}
      />
      
      <main className={`
        pt-16 transition-all duration-300 ease-smooth
        ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'}
      `}>
        <div className="p-6 space-y-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-800">
                {t.dashboardOverview}
              </h1>
              <p className="text-gray-600 mt-1">
                Welcome back! Here's what's happening with your business today.
              </p>
            </div>
          </div>



          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dashboardStatsData.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          {/* Latest Orders */}
          <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
            <h2 className="text-xl font-serif font-semibold text-gray-800 mb-4">
              {t.latestOrders}
            </h2>
            <OrdersTable orders={orders} onViewOrder={handleViewAllOrders} />
            {loading && <p className="text-center text-gray-500">Loading more orders...</p>}
            {!hasMore && !loading && orders.length > 0 && <p className="text-center text-gray-500">No more orders to load.</p>}
            <div ref={lastOrderElementRef} style={{ height: '1px' }} /> {/* Invisible element to trigger IntersectionObserver */}
            <div className="mt-4 text-right">
              <button
                onClick={handleViewAllOrders}
                className="text-blue-600 hover:underline font-medium"
              >
                {t.viewAllOrders}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardOverview;