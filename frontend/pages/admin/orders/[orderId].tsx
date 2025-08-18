'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import AdminHeader from '../../../components/AdminHeader';
import Sidebar from '../../../components/ui/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Button } from '../../../components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../components/ui/dropdown-menu';
import { ChevronDown, ArrowLeft, Package, User, MapPin, CreditCard, Calendar, Hash } from 'lucide-react';
import { fetchOrderDetail, OrderDetailDto, updateOrderStatus } from '../../../lib/api';
import Swal from 'sweetalert2';

const OrderDetailPage = () => {
  const router = useRouter();
  const { orderId } = router.query;
  const orderIdNum = orderId ? parseInt(orderId as string) : null;

  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'hi'>('en');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [orderDetail, setOrderDetail] = useState<OrderDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage as 'en' | 'hi');
  }, []);

  const fetchDetails = useCallback(async () => {
    if (orderIdNum === null) {
      setError('Invalid Order ID');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await fetchOrderDetail(orderIdNum);
      setOrderDetail(data);
      setError(null);
    } catch (err) {
      setError(`Failed to load order details: ${(err as Error).message}`);
      Swal.fire('Error', `Failed to load order details: ${(err as Error).message}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [orderIdNum]);

  useEffect(() => {
    if (orderIdNum) {
      fetchDetails();
    }
  }, [fetchDetails, orderIdNum]);

  const handleMenuToggle = () => {
    if (window.innerWidth >= 1024) {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    } else {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const translations = {
    en: {
      orderDetail: 'Order Details',
      orderId: 'Order ID',
      orderNumber: 'Order Number',
      customerName: 'Customer Name',
      customerEmail: 'Customer Email',
      customerPhone: 'Customer Phone',
      orderDate: 'Order Date',
      totalAmount: 'Total Amount',
      status: 'Status',
      shippingAddress: 'Shipping Address',
      billingAddress: 'Billing Address',
      paymentMethod: 'Payment Method',
      paymentStatus: 'Payment Status',
      orderItems: 'Order Items',
      product: 'Product',
      quantity: 'Quantity',
      price: 'Price',
      subtotal: 'Subtotal',
      loading: 'Loading order details...', 
      error: 'Error',
      backToOrders: 'Back to Orders',
      pending: 'Pending',
      shipped: 'Shipped',
      delivered: 'Delivered',
      completed: 'Completed',
      cancelled: 'Cancelled',
      confirmed: 'Confirmed',
      updateOrderStatus: 'Update Order Status',
      statusUpdated: 'Order status updated successfully',
      processing: 'Processing',
      noOrdersFound: 'No order details found.',
      customerDetails: 'Customer Details',
      orderInformation: 'Order Information',
    },
    hi: {
      orderDetail: 'आदेश विवरण',
      orderId: 'आदेश आईडी',
      orderNumber: 'आदेश संख्या',
      customerName: 'ग्राहक का नाम',
      customerEmail: 'ग्राहक ईमेल',
      customerPhone: 'ग्राहक फोन',
      orderDate: 'आदेश दिनांक',
      totalAmount: 'कुल राशि',
      status: 'स्थिति',
      shippingAddress: 'शिपिंग पता',
      billingAddress: 'बिलिंग पता',
      paymentMethod: 'भुगतान विधि',
      paymentStatus: 'भुगतान स्थिति',
      orderItems: 'आदेश आइटम',
      product: 'उत्पाद',
      quantity: 'मात्रा',
      price: 'मूल्य',
      subtotal: 'उपयोग',
      loading: 'आदेश विवरण लोड हो रहा है...', 
      error: 'त्रुटि',
      backToOrders: 'आदेशों पर वापस',
      pending: 'लंबित',
      shipped: 'भेजा गया',
      delivered: 'वितरित',
      completed: 'पूरा हुआ',
      cancelled: 'रद्द किया गया',
      confirmed: 'पुष्टि की गई',
      updateOrderStatus: 'आदेश स्थिति अपडेट करें',
      statusUpdated: 'आदेश स्थिति सफलतापूर्वक अपडेट की गई',
      processing: 'प्रसंस्करण',
      noOrdersFound: 'कोई आदेश विवरण नहीं मिला।',
      customerDetails: 'ग्राहक विवरण',
      orderInformation: 'आदेश जानकारी',
    }
  };

  const t = translations[currentLanguage];

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'PROCESSING':
        return 'bg-indigo-100 text-indigo-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-green-200 text-green-900';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'PAID':
        return 'bg-emerald-100 text-emerald-800';
      case 'UNPAID':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!orderDetail || updating) return;
    
    try {
      setUpdating(true);
      await updateOrderStatus(orderDetail.orderId, newStatus);
      
      // Update local state
      setOrderDetail({
        ...orderDetail,
        orderStatus: newStatus
      });
      
      Swal.fire('Success', t.statusUpdated, 'success');
    } catch (error) {
      console.error('Failed to update order status:', error);
      Swal.fire('Error', `Failed to update order status: ${(error as Error).message}`, 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{t.error}: {error}</p>
          <Button onClick={() => router.push('/admin/orders')}>{t.backToOrders}</Button>
        </div>
      </div>
    );
  }

  if (!orderDetail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{t.noOrdersFound}</p>
          <Button onClick={() => router.push('/admin/orders')}>{t.backToOrders}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <Sidebar
        isOpen={isSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        activeLink="Orders"
        toggleCollapse={handleMenuToggle}
      />

      <main className={`
        pt-16 transition-all duration-300 ease-smooth
        ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'}
      `}>
        <div className="p-6 space-y-6">
          {/* Header with Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => router.push('/admin/orders')}
                  className="hover:bg-gray-100"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {t.orderDetail} #{orderDetail.orderNumber}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    {t.orderId}: {orderDetail.orderId}
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" disabled={updating}>
                    {updating ? 'Updating...' : t.updateOrderStatus}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED'].map(status => (
                    <DropdownMenuItem 
                      key={status} 
                      onClick={() => handleStatusUpdate(status)}
                      disabled={status === orderDetail.orderStatus}
                      className={status === orderDetail.orderStatus ? 'opacity-50' : ''}
                    >
                      {t[status.toLowerCase() as keyof typeof t] || status}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Information */}
            <Card className="lg:col-span-1">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="flex items-center text-lg">
                  <Package className="mr-2 h-5 w-5 text-purple-600" />
                  {t.orderInformation}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t.orderDate}:</span>
                  <span className="text-sm font-medium flex items-center">
                    <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                    {new Date(orderDetail.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t.totalAmount}:</span>
                  <span className="text-lg font-bold text-purple-600">
                    ₹{orderDetail.totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t.status}:</span>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(orderDetail.orderStatus)}`}>
                    {t[orderDetail.orderStatus.toLowerCase() as keyof typeof t] || orderDetail.orderStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t.paymentStatus}:</span>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(orderDetail.paymentStatus)}`}>
                    {orderDetail.paymentStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t.paymentMethod}:</span>
                  <span className="text-sm font-medium flex items-center">
                    <CreditCard className="mr-1 h-4 w-4 text-gray-400" />
                    {orderDetail.paymentMethod || 'Online Payment'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Customer Details */}
            <Card className="lg:col-span-2">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="flex items-center text-lg">
                  <User className="mr-2 h-5 w-5 text-purple-600" />
                  {t.customerDetails}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700 mb-2">Contact Information</h4>
                    <div>
                      <p className="text-sm text-gray-600">{t.customerName}:</p>
                      <p className="font-medium">{orderDetail.shippingName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{t.customerEmail}:</p>
                      <p className="font-medium text-blue-600">{orderDetail.shippingEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{t.customerPhone}:</p>
                      <p className="font-medium">{orderDetail.shippingPhone}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                      <MapPin className="mr-1 h-4 w-4" />
                      {t.shippingAddress}
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {orderDetail.shippingAddress}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="lg:col-span-3">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="flex items-center text-lg">
                  <Package className="mr-2 h-5 w-5 text-purple-600" />
                  {t.orderItems} ({orderDetail.orderItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold">Product ID</TableHead>
                        <TableHead className="font-semibold">{t.product}</TableHead>
                        <TableHead className="text-center font-semibold">{t.quantity}</TableHead>
                        <TableHead className="text-right font-semibold">{t.price}</TableHead>
                        <TableHead className="text-right font-semibold">{t.subtotal}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderDetail.orderItems.map((item, index) => (
                        <TableRow key={item.productId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <TableCell className="font-medium">#{item.productId}</TableCell>
                          <TableCell className="font-medium">{item.productName}</TableCell>
                          <TableCell className="text-center">{item.quantity}</TableCell>
                          <TableCell className="text-right">₹{item.unitPrice.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-semibold">₹{item.subTotal.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-gray-100 font-semibold">
                        <TableCell colSpan={4} className="text-right">{t.totalAmount}:</TableCell>
                        <TableCell className="text-right text-lg text-purple-600">
                          ₹{orderDetail.totalAmount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderDetailPage;