import React, { useEffect, useState } from 'react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const SimpleRazorpayPayment: React.FC = () => {
  const [razorpayKey, setRazorpayKey] = useState<string>('');

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    // Fetch Razorpay key from backend
    fetch('/api/payments/key')
      .then(response => response.text())
      .then(key => setRazorpayKey(key))
      .catch(error => console.error('Failed to fetch Razorpay key:', error));

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = () => {
    console.log('Starting payment process...');
    console.log('Razorpay Key:', razorpayKey);
    
    if (!razorpayKey) {
      alert('Razorpay key not loaded yet. Please try again.');
      return;
    }
    
    if (!window.Razorpay) {
      alert('Razorpay SDK not loaded. Please refresh the page.');
      return;
    }
    
    // Create order on backend
    fetch('/api/payments/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 1000, // Amount in rupees
        currency: 'INR',
        receipt: 'receipt_' + Date.now()
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log('Order created:', data);
        
        const options = {
          key: razorpayKey,
          amount: data.amount, // Amount in paise from backend
          currency: data.currency || 'INR',
          name: "Vijay Brothers",
          description: "Test Transaction",
          order_id: data.razorpayOrderId || data.orderId,
          handler: function (response: any) {
            alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
            console.log('Payment response:', response);
            
            // Verify payment on backend
            fetch('/api/payments/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature
              })
            })
            .then(res => res.json())
            .then(data => console.log('Payment verified:', data))
            .catch(err => console.error('Verification failed:', err));
          },
          modal: {
            ondismiss: function() {
              console.log('Payment dialog closed');
            }
          },
          theme: {
            color: "#8B5CF6"
          }
        };
        
        console.log('Razorpay options:', options);
        
        try {
          const rzp = new window.Razorpay(options);
          rzp.on('payment.failed', function (response: any) {
            console.error('Payment failed:', response.error);
            alert('Payment failed: ' + response.error.description);
          });
          rzp.open();
          console.log('Razorpay dialog opened');
        } catch (error) {
          console.error('Error opening Razorpay:', error);
          alert('Error opening payment dialog. Check console for details.');
        }
      })
      .catch(err => {
        console.error('Error creating order:', err);
        alert('Failed to create order. Check console for details.');
      });
  };

  return (
    <button 
      onClick={handlePayment}
      className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
    >
      Pay Now (₹1000)
    </button>
  );
};

export default SimpleRazorpayPayment;