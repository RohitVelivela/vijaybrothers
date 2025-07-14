import React, { useState } from 'react';
import { ArrowLeft, Truck, CreditCard, Headphones, Package } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

interface ShippingPaymentPageProps {
  onBack: () => void;
  onNext: () => void;
}

const ShippingPaymentPage: React.FC<ShippingPaymentPageProps> = ({ onBack, onNext }) => {
  const [selectedShipping, setSelectedShipping] = useState('standard');
  const [selectedPayment, setSelectedPayment] = useState('online');
  const [currentStep, setCurrentStep] = useState(3);

  const steps = [
    { number: 1, title: 'Shopping Cart', active: true },
    { number: 2, title: 'Address', active: true },
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
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when you receive your order',
      icon: Package
    }
  ];

  const baseTotal = 1130;
  const shippingCharge = shippingOptions.find(option => option.id === selectedShipping)?.price || 100;
  const finalTotal = baseTotal + shippingCharge;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
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
                    step.number === currentStep
                      ? 'bg-orange-500 text-white'
                      : step.active
                      ? 'bg-gray-400 text-white'
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
                  <div className={`w-16 h-px mx-4 ${
                    step.active ? 'bg-gray-300' : 'bg-gray-200'
                  }`} />
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
                    <label key={option.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-orange-300 transition-colors">
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="shipping"
                          value={option.id}
                          checked={selectedShipping === option.id}
                          onChange={(e) => setSelectedShipping(e.target.value)}
                          className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
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
                    <label key={option.id} className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-orange-300 transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value={option.id}
                        checked={selectedPayment === option.id}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                        className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
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
                className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-colors"
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

              <button 
                onClick={onNext}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Next to Pay
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 bg-white rounded-lg shadow-sm p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Fast Delivery</h4>
                <p className="text-sm text-gray-600">Delivery within 3-5 days</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Quick Payment</h4>
                <p className="text-sm text-gray-600">100% secure payment</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Headphones className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Customer Support</h4>
                <p className="text-sm text-gray-600">Support with a quick response</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Material Quality</h4>
                <p className="text-sm text-gray-600">Best quality is our motto</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ShippingPaymentPage;