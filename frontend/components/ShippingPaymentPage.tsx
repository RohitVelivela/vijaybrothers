import React, { useState } from 'react';
import { ArrowLeft, Truck, CreditCard, Headphones, Package } from 'lucide-react';
import { useRouter } from 'next/router';
import RazorpayPayment from './RazorpayPayment';
import { useCart } from '../context/CartContext';

interface ShippingPaymentPageProps {
  onBack: () => void;
  onNext: () => void;
}

const ShippingPaymentPage: React.FC<ShippingPaymentPageProps> = ({ onBack, onNext }) => {
  const [selectedShipping, setSelectedShipping] = useState('standard');
  const [selectedPayment, setSelectedPayment] = useState('online');
  const [currentStep, setCurrentStep] = useState(3);
  const [showPayment, setShowPayment] = useState(false);
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

  console.log('ShippingPaymentPage - Router query:', router.query);
  console.log('ShippingPaymentPage - Customer details:', customerDetails);
  console.log('ShippingPaymentPage - Cart ID:', cartId);
  console.log('ShippingPaymentPage - Guest ID:', guestId);

  // Check if we have the required data
  if (!cartId && cartView?.cartId) {
    console.log('Using cartId from cartView:', cartView.cartId);
  }

  // Check if user has proper address details
  const hasAddressDetails = router.query.name && router.query.email && router.query.address;
  console.log('Has address details:', hasAddressDetails);

  React.useEffect(() => {
    if (!hasAddressDetails) {
      console.warn('No address details found. Redirecting to address page.');
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
      name: 'Standard Shipping',
      price: 100,
      description: 'Delivery within 5-7 business days'
    },
    {
      id: 'express',
      name: 'Express Shipping',
      price: 200,
      description: 'Delivery within 2-3 business days'
    },
    {
      id: 'overnight',
      name: 'Overnight Shipping',
      price: 350,
      description: 'Next day delivery'
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
  const shippingCharge = shippingOptions.find(option => option.id === selectedShipping)?.price || 100;
  const finalTotal = baseTotal + shippingCharge;

  const handlePaymentSuccess = (paymentData: any) => {
    console.log('Payment successful:', paymentData);
    // You can add order completion logic here
    router.push('/order-success?payment_id=' + paymentData.razorpay_payment_id);
  };

  const handlePaymentFailure = (error: any) => {
    console.error('Payment failed:', error);
    setShowPayment(false);
    // Show error message to user
  };

  const handleProceedToPay = () => {
    console.log('Proceed to Pay clicked');
    console.log('Current showPayment state:', showPayment);
    console.log('Cart total:', finalTotal);
    setShowPayment(true);
    console.log('ShowPayment set to true');
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

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step.active
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step.number}
                  </div>
                  <span className={`ml-3 text-sm font-medium ${
                    step.active ? 'text-gray-800' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-16 h-px mx-4 bg-gray-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping & Payment Options */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Method */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b">
                <div className="flex items-center space-x-3">
                  <Truck className="w-6 h-6 text-gray-600" />
                  <h2 className="text-xl font-semibold text-gray-800">Shipping Method</h2>
                </div>
              </div>

              <div className="p-6">
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
                          <div className="font-medium text-gray-800">{option.name}</div>
                          <div className="text-sm text-gray-600">{option.description}</div>
                        </div>
                      </div>
                      <div className="text-lg font-semibold text-gray-800">
                        ₹{option.price}
                      </div>
                    </label>
                  ))}
                </div>
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

            {/* Back Button */}
            <div>
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4">
                Order Summary <span className="text-gray-500 font-normal">(Items 1)</span>
              </h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total MRP</span>
                  <span className="font-semibold">₹{baseTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping Charge</span>
                  <span className="font-semibold">₹{shippingCharge}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>₹{finalTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {showPayment ? (
                <RazorpayPayment
                  amount={finalTotal}
                  onSuccess={handlePaymentSuccess}
                  onFailure={handlePaymentFailure}
                  customerDetails={customerDetails}
                  cartId={cartId || cartView?.cartId}
                  guestId={guestId}
                  otherDetails={{
                    address: router.query.address as string || '',
                    city: router.query.city as string || '',
                    state: router.query.state as string || 'Andhra Pradesh',
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
  );
};

export default ShippingPaymentPage;