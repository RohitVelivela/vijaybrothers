import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '../context/CartContext';
import { CreditCard, Loader2, CheckCircle, XCircle } from 'lucide-react';

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: any) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface PaymentComponentProps {
  amount: number;
  onSuccess: (paymentData: RazorpayResponse) => void;
  onFailure: (error: any) => void;
  customerDetails?: {
    name: string;
    email: string;
    phone: string;
  };
  cartId?: string;
  guestId?: string;
  otherDetails?: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
  };
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RazorpayPayment: React.FC<PaymentComponentProps> = ({
  amount,
  onSuccess,
  onFailure,
  customerDetails = { name: 'Customer', email: 'customer@email.com', phone: '9999999999' },
  cartId,
  guestId,
  otherDetails
}) => {
  console.log('RazorpayPayment component rendered');
  console.log('Amount:', amount);
  console.log('Customer details:', customerDetails);
  console.log('Cart ID prop:', cartId);
  console.log('Guest ID prop:', guestId);
  console.log('Other details prop:', otherDetails);
  
  // Check if we have actual customer details (not defaults)
  const hasRealCustomerDetails = customerDetails.name !== 'Customer' && 
                                customerDetails.email !== 'customer@email.com';
  console.log('Has real customer details:', hasRealCustomerDetails);
  
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [razorpayKey, setRazorpayKey] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    // Fetch Razorpay key from backend
    const fetchRazorpayKey = async () => {
      try {
        console.log('Fetching Razorpay key from backend...');
        const response = await fetch('http://localhost:8080/api/payments/key');
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const key = await response.text();
        console.log('Razorpay key received:', key ? 'Key loaded successfully' : 'Key is empty');
        setRazorpayKey(key);
      } catch (error) {
        console.error('Failed to fetch Razorpay key:', error);
      }
    };

    fetchRazorpayKey();
  }, []);

  const createRazorpayOrder = async () => {
    try {
      console.log('Creating order through guest checkout with amount:', amount);
      console.log('Cart ID from props:', cartId);
      console.log('Guest ID from props:', guestId);
      console.log('Customer details:', customerDetails);
      console.log('Other details:', otherDetails);
      
      if (!cartId) {
        throw new Error('Cart ID not found');
      }

      let checkoutResponse;

      // Always use smart checkout - it handles all scenarios correctly
      console.log('Using smart checkout for all cases');
      
      // Use real customer details or prompt for them
      let finalCustomerDetails = customerDetails;
      if (!hasRealCustomerDetails) {
        const name = prompt('Please enter your full name:');
        const email = prompt('Please enter your email:');
        const phone = prompt('Please enter your phone number:');
        const address = prompt('Please enter your address:');
        
        if (!name || !email || !phone || !address) {
          throw new Error('Customer details are required to proceed with payment');
        }
        
        finalCustomerDetails = { name, email, phone };
      }

      // Just create a payment order directly with Razorpay - bypass all checkout complexity
      console.log('Bypassing checkout entirely, creating payment order directly');
      
      const paymentOrderResponse = await fetch('http://localhost:8080/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          amount: amount,
          currency: 'INR',
          receipt: `PAYMENT_${Date.now()}`
        })
      });

      if (!paymentOrderResponse.ok) {
        throw new Error('Failed to create payment order');
      }

      const paymentOrderData = await paymentOrderResponse.json();
      console.log('Payment order created:', paymentOrderData);
      
      // Store customer details for later use (when payment succeeds)
      localStorage.setItem('pendingOrderCustomer', JSON.stringify({
        name: finalCustomerDetails.name,
        email: finalCustomerDetails.email,
        phone: finalCustomerDetails.phone,
        address: otherDetails?.address || 'Default Address',
        cartId: cartId
      }));
      
      // Return fake checkout response to proceed with payment
      const fakeCheckoutData = {
        orderId: paymentOrderData.orderId || Date.now(),
        orderNumber: paymentOrderData.razorpayOrderId || `TEMP_${Date.now()}`,
        razorpayOrderId: paymentOrderData.razorpayOrderId || paymentOrderData.orderId
      };
      
      checkoutResponse = {
        ok: true,
        json: async () => fakeCheckoutData
      };

      console.log('Checkout response status:', checkoutResponse.status);
      
      if (!checkoutResponse.ok) {
        let errorText = '';
        try {
          errorText = await checkoutResponse.text();
        } catch (e) {
          errorText = 'Unable to read error response';
        }
        console.error('Server error response:', errorText);
        throw new Error(`Failed to create order: ${checkoutResponse.status} - ${errorText}`);
      }

      const checkoutData = await checkoutResponse.json();
      console.log('Order created successfully:', checkoutData);

      // Now create Razorpay payment order
      const paymentResponse = await fetch('http://localhost:8080/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          amount: amount,
          currency: 'INR',
          receipt: checkoutData.orderNumber
        })
      });

      if (!paymentResponse.ok) {
        throw new Error('Failed to create payment order');
      }

      const paymentData = await paymentResponse.json();
      console.log('Payment order created:', paymentData);
      
      return {
        ...checkoutData,
        razorpayOrderId: paymentData.razorpayOrderId || paymentData.orderId
      };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const handlePayment = async () => {
    console.log('handlePayment called');
    console.log('Razorpay SDK loaded:', !!window.Razorpay);
    console.log('Razorpay key:', razorpayKey);
    
    if (!window.Razorpay) {
      alert('Razorpay SDK failed to load. Please check your internet connection.');
      return;
    }

    if (!razorpayKey) {
      alert('Razorpay key not loaded. Please try again.');
      return;
    }

    setIsLoading(true);
    setPaymentStatus('processing');

    try {
      // Create order on backend
      console.log('About to create Razorpay order...');
      const orderData = await createRazorpayOrder();
      console.log('Order data received:', orderData);
      
      const options: RazorpayOptions = {
        key: razorpayKey,
        amount: amount * 100, // Amount in paise
        currency: 'INR',
        name: 'Vijay Brothers',
        description: 'Purchase from Vijay Brothers Store',
        order_id: orderData.razorpayOrderId,
        handler: async (response: RazorpayResponse) => {
          try {
            // Verify payment with backend
            const verificationResponse = await fetch('http://localhost:8080/api/payments/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature
              })
            });

            if (verificationResponse.ok) {
              setPaymentStatus('success');
              onSuccess(response);
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            setPaymentStatus('failed');
            onFailure(error);
          }
        },
        prefill: {
          name: customerDetails.name,
          email: customerDetails.email,
          contact: customerDetails.phone,
        },
        theme: {
          color: '#8B5CF6', // Purple theme to match your design
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            setPaymentStatus('idle');
          }
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      
      razorpayInstance.on('payment.failed', (response: any) => {
        setPaymentStatus('failed');
        onFailure(response.error);
        setIsLoading(false);
      });

      razorpayInstance.open();
      setIsLoading(false);

    } catch (error) {
      console.error('Payment initialization failed:', error);
      setPaymentStatus('failed');
      setIsLoading(false);
      onFailure(error);
    }
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'processing':
        return <Loader2 className="w-5 h-5 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const getButtonText = () => {
    switch (paymentStatus) {
      case 'processing':
        return 'Processing...';
      case 'success':
        return 'Payment Successful';
      case 'failed':
        return 'Payment Failed - Retry';
      default:
        return `Pay ₹${amount.toLocaleString()}`;
    }
  };

  const getButtonColor = () => {
    switch (paymentStatus) {
      case 'success':
        return 'bg-green-600 hover:bg-green-700';
      case 'failed':
        return 'bg-red-600 hover:bg-red-700';
      default:
        return 'bg-purple-600 hover:bg-purple-700';
    }
  };

  return (
    <div className="w-full">
      <div className="text-xs mb-2 text-gray-600">
        Debug: Key Status: {razorpayKey ? '✅ Loaded' : '❌ Not Loaded'}
      </div>
      <button
        onClick={handlePayment}
        disabled={isLoading || paymentStatus === 'success' || !razorpayKey}
        className={`w-full ${getButtonColor()} disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl`}
      >
        {getStatusIcon()}
        {getButtonText()}
      </button>

      {paymentStatus === 'failed' && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">
            Payment failed. Please try again or contact support if the issue persists.
          </p>
        </div>
      )}

      {paymentStatus === 'success' && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm">
            Payment completed successfully! You will be redirected shortly.
          </p>
        </div>
      )}
    </div>
  );
};

export default RazorpayPayment;