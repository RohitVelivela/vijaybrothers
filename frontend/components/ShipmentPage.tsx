import React from 'react';

const ShipmentPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Shipment Details</h1>
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <p className="text-gray-600">Review your shipment options and confirm your order.</p>
        {/* Add shipment options and order summary here */}
        <div className="mt-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Shipping Method</h2>
          <div className="flex items-center mb-2">
            <input type="radio" id="standardShipping" name="shippingMethod" value="standard" className="mr-2" />
            <label htmlFor="standardShipping" className="text-gray-700">Standard Shipping (3-5 business days) - Free</label>
          </div>
          <div className="flex items-center">
            <input type="radio" id="expressShipping" name="shippingMethod" value="express" className="mr-2" />
            <label htmlFor="expressShipping" className="text-gray-700">Express Shipping (1-2 business days) - ₹150</label>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Order Summary</h2>
          <div className="flex justify-between text-gray-700 mb-2">
            <span>Subtotal:</span>
            <span>₹1,480</span> {/* Placeholder */}
          </div>
          <div className="flex justify-between text-gray-700 mb-2">
            <span>Shipping:</span>
            <span>Free</span> {/* Placeholder */}
          </div>
          <div className="flex justify-between text-gray-800 font-bold text-lg border-t pt-2 mt-4">
            <span>Total:</span>
            <span>₹1,480</span> {/* Placeholder */}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md shadow-md transition duration-300"
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
};

export default ShipmentPage;
