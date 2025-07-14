'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { fetchOrderDetail, OrderDetailDto } from '../../lib/api';
import Swal from 'sweetalert2';

const OrderDetailPage = () => {
  const params = useParams();
  const orderId = params.orderId ? parseInt(params.orderId as string) : null;

  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'hi'>('en');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [orderDetail, setOrderDetail] = useState<OrderDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage as 'en' | 'hi');
  }, []);

  const fetchDetails = useCallback(async () => {
    if (orderId === null) {
      setError('Invalid Order ID');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await fetchOrderDetail(orderId);
      setOrderDetail(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch order details:', err);
      setError(`Failed to load order details: ${(err as Error).message}`);
      Swal.fire('Error', `Failed to load order details: ${(err as Error).message}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

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
      orderDate: 'Order Date',
      totalAmount: 'Total Amount',
      status: 'Status',
      shippingAddress: 'Shipping Address',
      billingAddress: 'Billing Address',
      paymentMethod: 'Payment Method',
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
      noOrdersFound: 'No order details found.',
    },
    hi: {
      orderDetail: 'आदेश विवरण',
      orderId: 'आदेश आईडी',
      orderNumber: 'आदेश संख्या',
      customerName: 'ग्राहक का नाम',
      customerEmail: 'ग्राहक ईमेल',
      orderDate: 'आदेश दिनांक',
      totalAmount: 'कुल राशि',
      status: 'स्थिति',
      shippingAddress: 'शिपिंग पता',
      billingAddress: 'बिलिंग पता',
      paymentMethod: 'भुगतान विधि',
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
      noOrdersFound: 'कोई आदेश विवरण नहीं मिला।',
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p>{t.loading}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-red-500">{t.error}: {error}</p>
      </div>
    );
  }

  if (!orderDetail) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p>{t.noOrdersFound}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header
        currentLanguage={currentLanguage}
        setCurrentLanguage={setCurrentLanguage}
        onMenuToggle={handleMenuToggle}
        isSidebarOpen={isSidebarOpen}
        adminEmail="admin@vijaybrothers.com"
      />
      
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
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-serif font-bold text-gray-800">{t.orderDetail} #{orderDetail.orderNumber}</h1>
            <Button onClick={() => window.history.back()}>{t.backToOrders}</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.orderDetail}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>{t.orderId}:</strong> {orderDetail.orderId}</p>
                <p><strong>{t.orderNumber}:</strong> {orderDetail.orderNumber}</p>
                <p><strong>{t.orderDate}:</strong> {new Date(orderDetail.createdAt).toLocaleDateString()}</p>
                <p><strong>{t.totalAmount}:</strong> ₹{orderDetail.totalAmount.toLocaleString()}</p>
                <p><strong>{t.status}:</strong> <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(orderDetail.orderStatus)}`}>{t[orderDetail.orderStatus.toLowerCase() as keyof typeof t] || orderDetail.orderStatus}</span></p>
                <p><strong>{t.paymentMethod}:</strong> {orderDetail.paymentMethod}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t.shippingAddress}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>{t.customerName}:</strong> {orderDetail.shippingName}</p>
                <p><strong>{t.customerEmail}:</strong> {orderDetail.shippingEmail}</p>
                <p>{orderDetail.shippingAddress}</p>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>{t.orderItems}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t.product}</TableHead>
                      <TableHead>{t.quantity}</TableHead>
                      <TableHead>{t.price}</TableHead>
                      <TableHead>{t.subtotal}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderDetail.orderItems.map((item) => (
                      <TableRow key={item.productId}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>₹{item.price.toLocaleString()}</TableCell>
                        <TableCell>₹{(item.quantity * item.price).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderDetailPage;