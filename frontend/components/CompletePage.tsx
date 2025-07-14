import React from 'react';
import { useRouter } from 'next/router';
import { CheckCircle } from 'lucide-react';
import ProgressBar from './ProgressBar'; // Import ProgressBar

const CompletePage: React.FC = () => {
  const router = useRouter();

  const handleContinueShopping = () => {
    router.push('/'); // Navigate back to the home page
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen flex flex-col items-center">
      <ProgressBar currentStep="complete" />
      <div className="bg-white shadow-lg rounded-xl p-8 text-center max-w-md w-full mt-8">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Order Placed!</h1>
        <p className="text-gray-700 text-base mb-4">
          Thank you for your purchase. Your order has been successfully placed and will be processed shortly.
        </p>
        <p className="text-gray-600 text-sm mb-6">
          You will receive an email confirmation with your order details.
        </p>
        <button
          onClick={handleContinueShopping}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default CompletePage;
