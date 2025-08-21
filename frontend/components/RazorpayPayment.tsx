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
  method?: {
    upi?: boolean;
    card?: boolean;
    netbanking?: boolean;
    wallet?: boolean;
  };
  notes?: {
    merchant_order_id?: string;
    merchant_name?: string;
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
  // Check if we have actual customer details (not defaults)
  const hasRealCustomerDetails = customerDetails.name !== 'Customer' && 
                                customerDetails.email !== 'customer@email.com';
  
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [razorpayKey, setRazorpayKey] = useState<string>('');
  const [paymentConfig, setPaymentConfig] = useState<any>(null);
  const [isPaymentInProgress, setIsPaymentInProgress] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Fetch Razorpay configuration (key + UPI settings) from backend
    const fetchPaymentConfig = async () => {
      try {
        // Try new config endpoint first
        const configResponse = await fetch('/api/payments/config');
        if (configResponse.ok) {
          const config = await configResponse.json();
          console.log('Payment config fetched:', config);
          setRazorpayKey(config.razorpayKeyId);
          setPaymentConfig(config);
          return;
        }
        
        // Fallback to old key endpoint
        const keyResponse = await fetch('/api/payments/key');
        if (keyResponse.ok) {
          const key = await keyResponse.text();
          setRazorpayKey(key);
          setPaymentConfig({ razorpayKeyId: key, upiEnabled: false });
        }
      } catch (error) {
        console.error('Failed to fetch payment configuration:', error);
        // Payment config fetch failed
      }
    };

    fetchPaymentConfig();
  }, []);

  const createRazorpayOrder = async () => {
    try {
      if (!cartId) {
        throw new Error('Cart ID not found');
      }

      let checkoutResponse;
      
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

      // Create SINGLE Razorpay payment order
      const paymentResponse = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          amount: amount,
          currency: 'INR'
        })
      });

      if (!paymentResponse.ok) {
        throw new Error('Failed to create payment order');
      }

      const paymentData = await paymentResponse.json();
      
      // Store customer details for later use (when payment succeeds)
      localStorage.setItem('pendingOrderCustomer', JSON.stringify({
        name: finalCustomerDetails.name,
        email: finalCustomerDetails.email,
        phone: finalCustomerDetails.phone,
        address: otherDetails?.address || 'Default Address',
        cartId: cartId
      }));
      
      // Return the payment order data
      return {
        orderId: paymentData.orderId,
        razorpayOrderId: paymentData.orderId
      };
    } catch (error) {
      throw error;
    }
  };

  const handlePayment = async () => {
    // Prevent double-clicks
    if (isPaymentInProgress) {
      console.log('Payment already in progress, ignoring click');
      return;
    }
    
    console.log('=== FRONTEND PAYMENT DEBUG START ===');
    
    if (!window.Razorpay) {
      alert('Razorpay SDK failed to load. Please check your internet connection.');
      return;
    }

    if (!razorpayKey) {
      alert('Razorpay key not loaded. Please try again.');
      return;
    }

    console.log('Razorpay Key:', razorpayKey);
    console.log('Amount:', amount);

    setIsLoading(true);
    setPaymentStatus('processing');
    setIsPaymentInProgress(true);

    try {
      // Create order on backend
      console.log('Creating Razorpay order...');
      const orderData = await createRazorpayOrder();
      console.log('Order data received:', orderData);
      
      const options: RazorpayOptions = {
        key: razorpayKey,
        amount: amount * 100, // Razorpay expects amount in paise
        currency: 'INR',
        order_id: orderData.razorpayOrderId,
        name: 'Vijay Brothers',
        description: 'Purchase from Vijay Brothers Store',
        handler: async (response: RazorpayResponse) => {
          console.log('Payment success response:', response);
          try {
            // Verify payment with backend
            const verificationResponse = await fetch('/api/payments/verify', {
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
            setIsPaymentInProgress(false);
          }
        },
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true
        },
        notes: {
          merchant_order_id: `ORDER_${Date.now()}`,
          merchant_name: 'Vijay Brothers'
        }
      };

      console.log('Razorpay options:', {
        ...options,
        key: razorpayKey.substring(0, 15) + '***' // Hide sensitive key in logs
      });

      const razorpayInstance = new window.Razorpay(options);
      console.log('Razorpay instance created successfully');
      
      razorpayInstance.on('payment.failed', (response: any) => {
        console.error('❌ PAYMENT FAILED EVENT ❌');
        console.error('Full error response:', response);
        console.error('Error details:', response.error);
        
        // Handle UPI-specific errors
        if (response.error && response.error.description) {
          console.error('Error description:', response.error.description);
          if (response.error.description.includes('UPI')) {
            alert('UPI payment failed. Please check your UPI ID and try again, or use an alternative payment method.');
          } else if (response.error.description.includes('invalid')) {
            alert('Payment details are invalid. Please try again.');
          } else if (response.error.description.includes('merchant')) {
            alert('Merchant configuration issue. Please contact support.');
          }
        }
        
        setPaymentStatus('failed');
        onFailure(response.error);
        setIsLoading(false);
        setIsPaymentInProgress(false);
      });

      console.log('Opening Razorpay payment dialog...');
      razorpayInstance.open();
      setIsLoading(false);
      console.log('=== FRONTEND PAYMENT DEBUG END ===');

    } catch (error) {
      setPaymentStatus('failed');
      setIsLoading(false);
      setIsPaymentInProgress(false);
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