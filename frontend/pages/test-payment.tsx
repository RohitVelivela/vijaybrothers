import React from 'react';
import SimpleRazorpayPayment from '../components/SimpleRazorpayPayment';

const TestPaymentPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Test Razorpay Payment</h1>
        <p className="text-gray-600 mb-6 text-center">
          Click the button below to test Razorpay payment integration
        </p>
        <div className="flex justify-center">
          <SimpleRazorpayPayment />
        </div>
      </div>
    </div>
  );
};

export default TestPaymentPage;