import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { CheckCircle, Package, Truck, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const OrderSuccess = () => {
  const router = useRouter();
  const { payment_id, order_id } = router.query;

  useEffect(() => {
    // Clear cart after successful order
    // You can add logic here to clear the cart context
  }, []);

  const handleContinueShopping = () => {
    router.push('/');
  };

  const handleViewOrders = () => {
    router.push('/orders'); // Assuming you have an orders page
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Order Placed Successfully!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your purchase. Your order has been confirmed and will be processed shortly.
          </p>

          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Details</h2>
            <div className="space-y-3 text-left">
              {payment_id && (
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Payment ID:</span>
                  <span className="font-mono text-sm text-gray-900">{payment_id}</span>
                </div>
              )}
              {order_id && (
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-mono text-sm text-gray-900">{order_id}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Payment Status:</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Confirmed
                </span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">What's Next?</h3>
            <div className="space-y-4">
              <div className="flex items-center text-blue-800">
                <Package className="w-5 h-5 mr-3 flex-shrink-0" />
                <span className="text-sm">Your order is being prepared for shipment</span>
              </div>
              <div className="flex items-center text-blue-800">
                <Truck className="w-5 h-5 mr-3 flex-shrink-0" />
                <span className="text-sm">You'll receive a tracking number via email once shipped</span>
              </div>
              <div className="flex items-center text-blue-800">
                <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                <span className="text-sm">Expected delivery within 3-7 business days</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleViewOrders}
              className="inline-flex items-center justify-center px-6 py-3 border border-purple-600 text-purple-600 font-medium rounded-lg hover:bg-purple-50 transition-colors"
            >
              View My Orders
            </button>
            <button
              onClick={handleContinueShopping}
              className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
            >
              Continue Shopping
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>

          {/* Contact Info */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 text-sm">
              Need help with your order? Contact us at{' '}
              <a href="mailto:support@vijaybrothers.com" className="text-purple-600 hover:text-purple-700">
                support@vijaybrothers.com
              </a>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderSuccess;