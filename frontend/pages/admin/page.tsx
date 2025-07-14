'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const NotFound = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/admin/dashboard-overview');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800">
      <h1 className="text-6xl font-bold text-blue-600">404</h1>
      <p className="text-2xl font-medium mt-4">Page Not Found</p>
      <p className="text-gray-600 mt-2">The page you are looking for does not exist or has been moved.</p>
      <button
        onClick={handleGoHome}
        className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition duration-300"
      >
        Go to Dashboard
      </button>
    </div>
  );
};

export default NotFound;