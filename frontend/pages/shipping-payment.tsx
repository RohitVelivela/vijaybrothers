import React from 'react';
import { useRouter } from 'next/router';
import ShippingPaymentPage from '../components/ShippingPaymentPage';

const ShippingPayment = () => {
  const router = useRouter();

  const handleBack = () => {
    router.push('/cart');
  };

  const handleNext = () => {
    // This will be handled by the payment component
    router.push('/order-success');
  };

  return (
    <ShippingPaymentPage 
      onBack={handleBack}
      onNext={handleNext}
    />
  );
};

export default ShippingPayment;