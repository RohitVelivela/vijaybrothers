'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';


import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { ChevronDown, Search, Eye } from 'lucide-react';
import { fetchOrders, OrderListItem, Page } from '../../lib/api';
import Swal from 'sweetalert2';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';



const Orders = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'hi'>('en');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [ordersPage, setOrdersPage] = useState<Page<OrderListItem>>({
    content: [],
    totalPages: 0,
    totalElements: 0,
    number: 0,
    size: 10,
    first: true,
    last: true,
    empty: true,
  });
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0); // 0-indexed for backend
  const [pageSize, setPageSize] = useState(10);

  const router = useRouter();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage as 'en' | 'hi');
  }, []);

  const loadOrders = useCallback(async () => {
    try {
      const data = await fetchOrders(filterStatus === 'All' ? undefined : filterStatus.toUpperCase(), currentPage, pageSize);
      setOrdersPage(data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      Swal.fire('Error', 'Failed to load orders. Please check your network connection and backend server.', 'error');
    }
  }, [filterStatus, currentPage, pageSize]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleMenuToggle = () => {
    if (window.innerWidth >= 1024) {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    } else {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const translations = {
    en: {
      orders: 'Orders',
      status: 'Status',
      all: 'All',
      pending: 'Pending',
      shipped: 'Shipped',
      delivered: 'Delivered',
      completed: 'Completed',
      cancelled: 'Cancelled',
      sortBy: 'Sort By',
      newest: 'Newest',
      oldest: 'Oldest',
      orderId: 'Order ID',
      customer: 'Customer',
      date: 'Date',
      total: 'Total',
      actions: 'Actions',
      view: 'View',
      searchOrders: 'Search orders...',
      previous: 'Previous',
      next: 'Next',
      noOrdersFound: 'No orders found.',
    },
    hi: {
      orders: 'आदेश',
      status: 'स्थिति',
      all: 'सभी',
      pending: 'लंबित',
      shipped: 'भेजा गया',
      delivered: 'वितरित',
      completed: 'पूरा हुआ',
      cancelled: 'रद्द किया गया',
      sortBy: 'क्रमबद्ध करें',
      newest: 'नवीनतम',
      oldest: 'सबसे पुराना',
      orderId: 'आदेश आईडी',
      customer: 'ग्राहक',
      date: 'दिनांक',
      total: 'कुल',
      actions: 'कार्यवाहियाँ',
      view: 'देखें',
      searchOrders: 'आदेश खोजें...',
      previous: 'पिछला',
      next: 'अगला',
      noOrdersFound: 'कोई आदेश नहीं मिला।',
    }
  };

  const t = translations[currentLanguage];

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'SHIPPED':
        return 'bg-yellow-50 text-yellow-700';
      case 'DELIVERED':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleViewOrder = (orderId: number) => {
    router.push(`/admin/orders/${orderId}`);
  };

  // Frontend search filter (since backend search is not implemented for orders)
  const filteredOrdersContent = useMemo(() => {
    if (!ordersPage.content) return [];
    return ordersPage.content.filter(order =>
      (order.shippingName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      order.orderId.toString().includes(searchTerm.toLowerCase())
    );
  }, [ordersPage.content, searchTerm]);


  return (
    <div className="min-h-screen bg-white">
      <Header
        onMenuToggle={handleMenuToggle}
        isSidebarOpen={isSidebarOpen}
        adminEmail="admin@vijaybrothers.com"
        currentLanguage={currentLanguage}
        setCurrentLanguage={setCurrentLanguage}
      />
      <Sidebar isOpen={isSidebarOpen} isCollapsed={isSidebarCollapsed} activeLink="Orders" toggleCollapse={handleMenuToggle} />
      
      

      <main className={`
        pt-16 transition-all duration-300 ease-smooth
        ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'}
      `}>
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-800">
                {t.orders}
              </h1>
              <p className="text-gray-600 mt-1">
                Manage customer orders, track their status, and view details.
              </p>
            </div>
          </div>

          {/* Order Filters and Search */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
              {/* Status Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center justify-between px-4 py-2 border rounded-md w-full sm:w-48">
                    {t.status}: {t[filterStatus.toLowerCase() as keyof typeof t] || filterStatus}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  {['All', 'PENDING', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED'].map(status => (
                    <DropdownMenuItem key={status} onClick={() => {
                      setFilterStatus(status);
                      setCurrentPage(0); // Reset to first page on filter change
                    }}>
                      {t[status.toLowerCase() as keyof typeof t] || status}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sort By - Removed as backend handles sorting */}
              {/* <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center justify-between px-4 py-2 border rounded-md w-full sm:w-48">
                    {t.sortBy}: {t[sortBy.toLowerCase() as keyof typeof t]}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  {['Newest', 'Oldest'].map(sortOption => (
                    <DropdownMenuItem key={sortOption} onClick={() => setSortBy(sortOption)}>
                      {t[sortOption.toLowerCase() as keyof typeof t]}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu> */}
            </div>

            {/* Search Bar - Backend search not implemented yet, so keeping frontend filter for now */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder={t.searchOrders}
                className="pl-9 pr-4 py-2 border rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.orderId}</TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Number</TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.date}</TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.total}</TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Status</TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-200">
                {filteredOrdersContent.length > 0 ? (
                  filteredOrdersContent.map((order) => (
                    <TableRow key={order.orderId} className="hover:bg-gray-50">
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderId}</TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.orderNumber}</TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.shippingName}</TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{order.totalAmount.toLocaleString()}</TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.paymentStatus)}`}>
                          {order.paymentStatus}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.orderStatus)}`}>
                          {t[order.orderStatus.toLowerCase() as keyof typeof t] || order.orderStatus}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-900 flex items-center" onClick={() => handleViewOrder(order.orderId)}>
                          <Eye className="mr-1 h-4 w-4" /> {t.view}
                        </Button>
                        {/* Delete button removed as there's no backend endpoint for it */}
                        {/* <Button variant="ghost" size="icon" className="ml-2" onClick={() => console.log('Delete order', order.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button> */}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      {t.noOrdersFound}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
            <div className="text-gray-600 text-sm">
              Showing {ordersPage.content.length > 0 ? currentPage * pageSize + 1 : 0} - {Math.min((currentPage + 1) * pageSize, ordersPage.totalElements)} of {ordersPage.totalElements} orders
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={ordersPage.first}
              >
                {t.previous}
              </Button>
              {Array.from({ length: ordersPage.totalPages }, (_, index) => (
                <Button
                  key={index}
                  variant={currentPage === index ? 'default' : 'outline'}
                  onClick={() => handlePageChange(index)}
                >
                  {index + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={ordersPage.last}
              >
                {t.next}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Orders;