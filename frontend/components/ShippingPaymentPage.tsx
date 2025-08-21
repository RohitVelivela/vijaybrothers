import React, { useState, useEffect } from 'react';
import { ArrowLeft, Truck, CreditCard, Headphones, Package, Info } from 'lucide-react';
import { useRouter } from 'next/router';
import RazorpayPayment from './RazorpayPayment';
import { useCart } from '../context/CartContext';

interface ShippingPaymentPageProps {
  onBack: () => void;
  onNext: () => void;
}

interface ShippingInfo {
  shippingCharge: number;
  freeShipping: boolean;
  minOrderForFreeShipping: number;
  message: string;
}

const ShippingPaymentPage: React.FC<ShippingPaymentPageProps> = ({ onBack, onNext }) => {
  const [selectedShipping, setSelectedShipping] = useState('standard');
  const [selectedPayment, setSelectedPayment] = useState('online');
  const [currentStep, setCurrentStep] = useState(3);
  const [showPayment, setShowPayment] = useState(false);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo | null>(null);
  const [loadingShipping, setLoadingShipping] = useState(true);
  const router = useRouter();
  const { cartView } = useCart();

  // Get customer details from router query (passed from address page)
  const customerDetails = {
    name: (router.query.name as string) || 'Customer',
    email: (router.query.email as string) || 'customer@email.com',
    phone: (router.query.phone as string) || '9999999999'
  };

  // Get cart and guest IDs from router query
  const cartId = router.query.cartId as string;
  const guestId = router.query.guestId as string;

  // Check if we have the required data
  const hasAddressDetails = router.query.name && router.query.email && router.query.phone;

  useEffect(() => {
    const calculateShipping = async () => {
      if (!cartView || !cartView.lines || cartView.lines.length === 0) {
        return;
      }

      try {
        setLoadingShipping(true);
        const productIds = cartView.lines.map(item => item.productId);
        const orderTotal = cartView.subtotal;

        const response = await fetch('/api/shipping/calculate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productIds,
            orderTotal
          })
        });

        if (response.ok) {
          const data = await response.json();
          setShippingInfo(data);
        }
      } catch (error) {
        console.error('Error calculating shipping:', error);
      } finally {
        setLoadingShipping(false);
      }
    };

    calculateShipping();
  }, [cartView]);

  React.useEffect(() => {
    if (!hasAddressDetails) {
      router.push('/address');
    }
  }, [hasAddressDetails, router]);

  const steps = [
    { number: 1, title: 'Shopping Cart', active: false },
    { number: 2, title: 'Address', active: false },
    { number: 3, title: 'Shipping & Payment Options', active: true },
    { number: 4, title: 'Complete', active: false }
  ];

  const shippingOptions = [
    {
      id: 'standard',
      name: shippingInfo?.freeShipping ? 'Free Shipping' : 'Standard Shipping',
      price: shippingInfo?.shippingCharge || 50,
      description: shippingInfo?.message || 'Delivery within 5-7 business days',
      isFree: shippingInfo?.freeShipping || false
    }
  ];

  const paymentOptions = [
    {
      id: 'online',
      name: 'Online Payment',
      description: 'Pay securely using UPI, Cards, Net Banking',
      icon: CreditCard
    }
  ];

  const baseTotal = cartView?.subtotal || 0;
  const shippingCharge = shippingInfo?.freeShipping ? 0 : (shippingInfo?.shippingCharge || 50);
  const finalTotal = baseTotal + shippingCharge;

  const handlePaymentSuccess = (paymentData: any) => {
    // You can add order completion logic here
    router.push('/order-success?payment_id=' + paymentData.razorpay_payment_id);
  };

  const handlePaymentFailure = (error: any) => {
    setShowPayment(false);
    // Show error message to user
  };

  const handleProceedToPay = () => {
    setShowPayment(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <button 
              onClick={onBack}
              className="hover:text-gray-800 transition-colors"
            >
              Home
            </button>
            <span>›</span>
            <span className="text-gray-800">Shipping & Payment Summary</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    step.active ? 'bg-purple-500 border-purple-500 text-white' : 
                    step.number < currentStep ? 'bg-green-500 border-green-500 text-white' : 
                    'border-gray-300 text-gray-500'
                  }`}>
                    {step.number}
                  </div>
                  <span className={`ml-3 text-sm font-medium ${
                    step.active ? 'text-purple-600' : 
                    step.number < currentStep ? 'text-green-600' : 
                    'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-1 mx-4 bg-gray-200">
                      <div className={`h-full ${
                        step.number < currentStep ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Shipping & Payment Options */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Method */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b">
                  <div className="flex items-center space-x-3">
                    <Truck className="w-6 h-6 text-gray-600" />
                    <h2 className="text-xl font-semibold text-gray-800">Shipping Method</h2>
                  </div>
                </div>

                <div className="p-6">
                  {loadingShipping ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {shippingOptions.map((option) => (
                        <label key={option.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-purple-300 transition-colors">
                          <div className="flex items-center space-x-3">
                            <input
                              type="radio"
                              name="shipping"
                              value={option.id}
                              checked={selectedShipping === option.id}
                              onChange={(e) => setSelectedShipping(e.target.value)}
                              className="w-4 h-4 text-purple-500 border-gray-300 focus:ring-purple-500"
                            />
                            <div>
                              <div className="font-medium text-gray-800 flex items-center gap-2">
                                {option.name}
                                {option.isFree && (
                                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">FREE</span>
                                )}
                              </div>
                              <div className="text-sm text-gray-600 flex items-center gap-1">
                                <Info className="w-3 h-3" />
                                {option.description}
                              </div>
                            </div>
                          </div>
                          <div className={`text-lg font-semibold ${option.isFree ? 'text-green-600' : 'text-gray-800'}`}>
                            {option.isFree ? 'FREE' : `₹${option.price}`}
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-6 h-6 text-gray-600" />
                    <h2 className="text-xl font-semibold text-gray-800">Payment Method</h2>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {paymentOptions.map((option) => (
                      <label key={option.id} className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-purple-300 transition-colors">
                        <input
                          type="radio"
                          name="payment"
                          value={option.id}
                          checked={selectedPayment === option.id}
                          onChange={(e) => setSelectedPayment(e.target.value)}
                          className="w-4 h-4 text-purple-500 border-gray-300 focus:ring-purple-500"
                        />
                        <div className="ml-3 flex items-center space-x-3">
                          <option.icon className="w-5 h-5 text-gray-600" />
                          <div>
                            <div className="font-medium text-gray-800">{option.name}</div>
                            <div className="text-sm text-gray-600">{option.description}</div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm sticky top-6">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-800">Order Summary</h3>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{baseTotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className={`font-medium ${shippingCharge === 0 ? 'text-green-600' : ''}`}>
                      {shippingCharge === 0 ? 'FREE' : `₹${shippingCharge.toFixed(2)}`}
                    </span>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-800">Total</span>
                      <span className="text-xl font-bold text-purple-600">₹{finalTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    {showPayment ? (
                      <RazorpayPayment
                        amount={finalTotal}
                        onSuccess={handlePaymentSuccess}
                        onFailure={handlePaymentFailure}
                        customerDetails={customerDetails}
                        cartId={cartId}
                        otherDetails={{
                          address: router.query.address as string || '',
                          city: router.query.city as string || '',
                          state: router.query.state as string || '',
                          postalCode: router.query.postalCode as string || ''
                        }}
                      />
                    ) : (
                      <button 
                        onClick={handleProceedToPay}
                        className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-semibold transition-colors"
                      >
                        Proceed to Pay
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPaymentPage;