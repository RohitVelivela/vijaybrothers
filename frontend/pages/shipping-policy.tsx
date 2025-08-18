import React from 'react';
import Head from 'next/head';

const ShippingPolicy: React.FC = () => {
  return (
    <>
      <Head>
        <title>Shipping Policy - Vijay Brothers</title>
        <meta name="description" content="Shipping Policy for Vijay Brothers Pure Silk & Fancy Sarees" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Shipping Policy
            </h1>
            
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
              <ol className="list-decimal pl-6 space-y-4">
                <li>
                  <span className="bg-gray-200 px-1 rounded">Vijay Brothers</span> charges Rs.100 per order for shipping within India. For International Shipping, we charge a rate of INR 1500 for the first product and then INR 500 for each additional Product.
                </li>
                
                <li>
                  The placed orders will be processed in the weekdays (Monday to Saturdays), excluding the public holidays.
                </li>
                
                <li>
                  Orders placed will be delivered within 4-7 working days within India. Delivery locations outside India will take around 10-15 days.
                </li>
                
                <li>
                  No refunds and no exchange on clearance sale orders.
                </li>
                
                <li>
                  To guarantee quicker delivery time and proper handling of the delivery, we only partner with reputed delivery partners like, DTDC, Delhivery.com and E com Express for both domestic and international shipments.
                </li>
                
                <li>
                  Customers are requested to provide accurate, complete and valid address and pin code at the time of creating an account to avoid delays in the delivery of the product.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShippingPolicy;