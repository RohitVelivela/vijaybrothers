import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProgressBar from './ProgressBar'; // Import ProgressBar
import { useCart } from '../context/CartContext';
import dynamic from 'next/dynamic';

const Banknote = dynamic(() => import('lucide-react').then(mod => mod.Banknote), { ssr: false });
const CreditCard = dynamic(() => import('lucide-react').then(mod => mod.CreditCard), { ssr: false });
const QrCode = dynamic(() => import('lucide-react').then(mod => mod.QrCode), { ssr: false });
const Package = dynamic(() => import('lucide-react').then(mod => mod.Package), { ssr: false });
const Rocket = dynamic(() => import('lucide-react').then(mod => mod.Rocket), { ssr: false });
const ShieldCheck = dynamic(() => import('lucide-react').then(mod => mod.ShieldCheck), { ssr: false });

declare global {
  interface Window {
    Razorpay: any;
  }
}

const ShipmentPaymentPage: React.FC = () => {
  const router = useRouter();
  const { cartItems } = useCart();
  const [selectedShipment, setSelectedShipment] = useState('standard');
  const [selectedPayment, setSelectedPayment] = useState('upi'); // Default to UPI
  const [key, setKey] = useState('');

  useEffect(() => {
    const fetchKey = async () => {
      const response = await fetch('/api/payments/key');
      const key = await response.text();
      setKey(key);
    };
    fetchKey();
  }, []);

  const handlePayment = async () => {
    const { fullName, email, phone, address1, address2, city, state, zip } = router.query;

    const response = await fetch('/api/orders/initiate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        guestId: 1, // This should be dynamically set
        items: cartItems.map(item => ({ productId: item.productId, quantity: item.quantity, unitPrice: item.price })),
        shippingName: fullName,
        shippingEmail: email,
        shippingPhone: phone,
        shippingAddress: `${address1} ${address2}`,
        shippingCity: city,
        shippingPostalCode: zip,
        shippingState: state,
      }),
    });

    const data = await response.json();

    const options = {
      key: key,
      amount: data.amount,
      currency: data.currency,
      name: 'Vijay Brothers',
      description: 'Test Transaction',
      order_id: data.orderId,
      handler: function (response: any) {
        router.push('/complete');
      },
      prefill: {
        name: fullName,
        email: email,
        contact: phone,
      },
      notes: {
        address: `${address1} ${address2}`,
      },
      theme: {
        color: '#3399cc',
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <ProgressBar currentStep="shipment" />
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6 text-center flex items-center justify-center">
        <ShieldCheck className="w-7 h-7 text-purple-600 mr-3" />
        Secure Shipping & Seamless Payments – Just One Step Away!
      </h1>
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8">
        {/* Shipment Options */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">Choose Shipment Method</h2>
        <div className="space-y-3 mb-6">
          <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <input
              type="radio"
              name="shipmentMethod"
              value="standard"
              checked={selectedShipment === 'standard'}
              onChange={() => setSelectedShipment('standard')}
              className="form-radio h-4 w-4 text-purple-600"
            />
            <Package className="ml-3 w-5 h-5 text-gray-600" />
            <span className="ml-2 text-sm font-medium text-gray-700">Standard Shipping (3-5 days) - ₹50</span>
          </label>
          <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <input
              type="radio"
              name="shipmentMethod"
              value="express"
              checked={selectedShipment === 'express'}
              onChange={() => setSelectedShipment('express')}
              className="form-radio h-4 w-4 text-purple-600"
            />
            <Rocket className="ml-3 w-5 h-5 text-gray-600" />
            <span className="ml-2 text-sm font-medium text-gray-700">Express Shipping (1-2 days) - ₹150</span>
          </label>
        </div>

        {/* Payment Options */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">Choose Payment Method</h2>
        <div className="space-y-3 mb-6">
          <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <input
              type="radio"
              name="paymentMethod"
              value="upi"
              checked={selectedPayment === 'upi'}
              onChange={() => setSelectedPayment('upi')}
              className="form-radio h-4 w-4 text-purple-600"
            />
            <QrCode className="ml-3 w-5 h-5 text-gray-600" />
            <span className="ml-2 text-sm font-medium text-gray-700">UPI</span>
          </label>
          
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handlePayment}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShipmentPaymentPage;
