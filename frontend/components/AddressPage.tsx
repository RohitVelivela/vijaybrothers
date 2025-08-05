import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProgressBar from './ProgressBar';
import { useCart } from '../context/CartContext';
import { useToast } from '../hooks/use-toast';
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
  const { cartItems, cartView } = useCart();
  const { toast } = useToast();

  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(50);
  const [total, setTotal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'Andhra Pradesh',
    postalCode: '',
  });

  useEffect(() => {
    const newSubtotal = cartView?.subtotal || 0;
    setSubtotal(newSubtotal);
    setTotal(newSubtotal + shipping);
  }, [cartView, shipping]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
    } else if (!/^\d{6}$/.test(formData.postalCode)) {
      newErrors.postalCode = 'Postal code must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "❌ Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    if (!cartView?.cartId) {
      toast({
        title: "❌ Error",
        description: "Cart not found. Please go back to cart.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Skip backend call for now and just navigate with data
    console.log('Skipping guest creation, navigating directly with form data');
    
    toast({
      title: "✅ Address Ready",
      description: "Proceeding to payment with your address details.",
      variant: "default",
    });

    // Navigate to payment page with address data
    router.push({
      pathname: '/shipping-payment',
      query: { 
        ...formData,
        cartId: cartView.cartId,
        subtotal: subtotal.toString(),
        total: total.toString()
      }
    });

    setIsSubmitting(false);
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
          <form onSubmit={handleContinue}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="name" className="block text-gray-700 text-xs font-bold mb-1">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input 
                    type="text" 
                    id="name" 
                    name="name"
                    value={formData.name} 
                    onChange={handleChange} 
                    className={`border rounded-md w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="John Doe" 
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-700 text-xs font-bold mb-1">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    value={formData.email} 
                    onChange={handleChange} 
                    className={`border rounded-md w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="john.doe@example.com" 
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="phone" className="block text-gray-700 text-xs font-bold mb-1">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone"
                    value={formData.phone} 
                    onChange={handleChange} 
                    className={`border rounded-md w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="9876543210" 
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="address" className="block text-gray-700 text-xs font-bold mb-1">Complete Address *</label>
              <div className="relative">
                <Home className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                <textarea 
                  id="address" 
                  name="address"
                  value={formData.address} 
                  onChange={handleChange} 
                  rows={3}
                  className={`border rounded-md w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="House No., Building Name, Street, Area, Landmark" 
                />
              </div>
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label htmlFor="city" className="block text-gray-700 text-xs font-bold mb-1">City *</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input 
                    type="text" 
                    id="city" 
                    name="city"
                    value={formData.city} 
                    onChange={handleChange} 
                    className={`border rounded-md w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Hyderabad" 
                  />
                </div>
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>
              <div>
                <label htmlFor="state" className="block text-gray-700 text-xs font-bold mb-1">State *</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                  <select 
                    id="state" 
                    name="state"
                    value={formData.state} 
                    onChange={handleChange} 
                    className="border border-gray-300 rounded-md w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm appearance-none bg-white"
                  >
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Telangana">Telangana</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4 transform rotate-180" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="postalCode" className="block text-gray-700 text-xs font-bold mb-1">Postal Code *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input 
                    type="text" 
                    id="postalCode" 
                    name="postalCode"
                    value={formData.postalCode} 
                    onChange={handleChange} 
                    className={`border rounded-md w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm ${errors.postalCode ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="500001" 
                  />
                </div>
                {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>}
              </div>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => router.push('/cart')}
                className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
              >
                Back to Cart
              </button>
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