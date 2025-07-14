import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProgressBar from './ProgressBar'; // Import ProgressBar
import { useCart } from '../context/CartContext'; // Import useCart hook
import dynamic from 'next/dynamic';

const User = dynamic(() => import('lucide-react').then(mod => mod.User), { ssr: false });
const Phone = dynamic(() => import('lucide-react').then(mod => mod.Phone), { ssr: false });
const MapPin = dynamic(() => import('lucide-react').then(mod => mod.MapPin), { ssr: false });
const Building = dynamic(() => import('lucide-react').then(mod => mod.Building), { ssr: false });
const Globe = dynamic(() => import('lucide-react').then(mod => mod.Globe), { ssr: false });
const Mail = dynamic(() => import('lucide-react').then(mod => mod.Mail), { ssr: false });
const Home = dynamic(() => import('lucide-react').then(mod => mod.Home), { ssr: false });
const Truck = dynamic(() => import('lucide-react').then(mod => mod.Truck), { ssr: false });

const AddressPage: React.FC = () => {
  const router = useRouter();
  const { cartItems } = useCart();

  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(50); // Example shipping cost
  const [total, setTotal] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    landmark: '',
    address1: '',
    address2: '',
    city: '',
    state: 'Andhra Pradesh',
    zip: '',
  });

  useEffect(() => {
    const newSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setSubtotal(newSubtotal);
    setTotal(newSubtotal + shipping);
  }, [cartItems, shipping]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleContinue = () => {
    router.push({
      pathname: '/shipment',
      query: formData,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <ProgressBar currentStep="address" />
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6 text-center flex items-center justify-center">
        <Truck className="w-7 h-7 text-purple-600 mr-3" />
        Tell Us Where, We’ll Bring the Sarees There!
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-screen-xl mx-auto">
        <div className="lg:col-span-2 bg-white shadow-lg rounded-xl p-8">
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="fullName" className="block text-gray-700 text-xs font-bold mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input type="text" id="fullName" value={formData.fullName} onChange={handleChange} className="border border-gray-300 rounded-md w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm" placeholder="John Doe" />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-700 text-xs font-bold mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input type="email" id="email" value={formData.email} onChange={handleChange} className="border border-gray-300 rounded-md w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm" placeholder="john.doe@example.com" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="phone" className="block text-gray-700 text-xs font-bold mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input type="tel" id="phone" value={formData.phone} onChange={handleChange} className="border border-gray-300 rounded-md w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm" placeholder="+91 9876543210" />
                </div>
              </div>
              <div>
                <label htmlFor="landmark" className="block text-gray-700 text-xs font-bold mb-1">Landmark (Optional)</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input type="text" id="landmark" value={formData.landmark} onChange={handleChange} className="border border-gray-300 rounded-md w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm" placeholder="Near ABC Hospital" />
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="address1" className="block text-gray-700 text-xs font-bold mb-1">Address Line 1</label>
              <div className="relative">
                <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input type="text" id="address1" value={formData.address1} onChange={handleChange} className="border border-gray-300 rounded-md w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm" placeholder="House No., Building Name" />
                </div>
              </div>
            <div className="mb-4">
              <label htmlFor="address2" className="block text-gray-700 text-xs font-bold mb-1">Address Line 2 (Optional)</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input type="text" id="address2" value={formData.address2} onChange={handleChange} className="border border-gray-300 rounded-md w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm" placeholder="Street, Locality" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label htmlFor="city" className="block text-gray-700 text-xs font-bold mb-1">City</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input type="text" id="city" value={formData.city} onChange={handleChange} className="border border-gray-300 rounded-md w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm" placeholder="Hyderabad" />
                </div>
              </div>
              <div>
                <label htmlFor="state" className="block text-gray-700 text-xs font-bold mb-1">State</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select id="state" value={formData.state} onChange={handleChange} className="border border-gray-300 rounded-md w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm appearance-none bg-white pr-8">
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Telangana">Telangana</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="zip" className="block text-gray-700 text-xs font-bold mb-1">Zip Code</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input type="text" id="zip" value={formData.zip} onChange={handleChange} className="border border-gray-300 rounded-md w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm" placeholder="500001" />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleContinue}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
              >
                Continue to Payment
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1 bg-white shadow-lg rounded-xl p-6 h-fit">
          <h2 className="text-xl font-bold text-gray-900 mb-5 border-b pb-3">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-700 text-sm">
              <span>Total MRP</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-700 text-sm">
              <span>Shipping</span>
              <span>₹{shipping.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-gray-900 border-t pt-3 mt-3">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressPage;