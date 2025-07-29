import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader } from './ui/dialog';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ArrowLeft, Heart, Share2, Star, Minus, Plus, ShoppingCart, Zap, Truck, Shield, RotateCcw } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

interface ProductDetailPageProps {
  onBack: () => void;
  onBuyNow: () => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ onBack, onBuyNow }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const productImages = [
    "https://images.pexels.com/photos/8839833/pexels-photo-8839833.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/9054599/pexels-photo-9054599.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/8839825/pexels-photo-8839825.jpeg?auto=compress&cs=tinysrgb&w=800"
  ];

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  const totalAmount = 1480 * quantity;

  const openImageModal = useCallback((index: number) => {
    setCurrentImageIndex(index);
    setIsImageModalOpen(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />
      
      {/* Breadcrumb Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <button 
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Collection</span>
          </button>
        </div>
      </div>

      {/* Product Detail Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-orange-50 rounded-2xl overflow-hidden aspect-[4/5]">
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Top Selling
                </span>
              </div>
              
              <div className="absolute top-4 right-4 z-10 flex space-x-2">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                </button>
                <button className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <img
                src={productImages[selectedImage]}
                alt="Fancy Pattu Kanchi Border Purple Saree"
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => openImageModal(selectedImage)}
              />

              {/* Zoom Icon */}
              <div className="absolute bottom-4 right-4">
                <button 
                  onClick={() => openImageModal(selectedImage)}
                  className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="flex space-x-3">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => openImageModal(index)}
                  className={`relative w-20 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index ? 'border-orange-500' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Product view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* SKU */}
            <div className="text-sm text-gray-500">
              SKU: RKIG2326
            </div>

            {/* Product Title */}
            <h1 className="text-3xl font-bold text-gray-900">
              Fancy Pattu Kanchi Border Purple Saree
            </h1>

            {/* Price */}
            <div className="text-3xl font-bold text-gray-900">
              ₹1,480
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-gray-600">(4.8)</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">124 reviews</span>
            </div>

            {/* Quantity and Total */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-3 hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-3 font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-3 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Amount
                </label>
                <div className="text-2xl font-bold text-gray-900 py-3">
                  ₹{totalAmount.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2">
                <ShoppingCart className="w-5 h-5" />
                <span>Add To Cart</span>
              </button>
              <button 
                onClick={onBuyNow}
                className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <Zap className="w-5 h-5" />
                <span>Buy Now</span>
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Truck className="w-5 h-5 text-green-600" />
                <span>Free Delivery</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <RotateCcw className="w-5 h-5 text-blue-600" />
                <span>Easy Returns</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Shield className="w-5 h-5 text-purple-600" />
                <span>Authentic Product</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Star className="w-5 h-5 text-yellow-600" />
                <span>Premium Quality</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-t pt-6">
              <div className="flex space-x-8 border-b">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'details'
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  📋 Product Details
                </button>
                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'shipping'
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  🚚 Shipping and Return
                </button>
              </div>

              <div className="pt-6">
                {activeTab === 'details' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Product Description</h3>
                      <div className="space-y-2 text-gray-600">
                        <p><strong>Blouse:</strong> Attached</p>
                        <p><strong>Length:</strong> 6.3m with blouse: 0.8m</p>
                        <p><strong>Washing:</strong> Dry Wash</p>
                        <p><strong>Note:</strong> Color may vary due to photo-graphic lighting sources or your device settings</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Specifications</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-sm text-gray-500 mb-1">Featured</div>
                          <div className="font-medium">Fancy Sarees</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-sm text-gray-500 mb-1">Media</div>
                          <div className="font-medium">Instagram</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">Free Shipping</h4>
                      <p className="text-green-700 text-sm">Free delivery on orders above ₹999</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Easy Returns</h4>
                      <p className="text-blue-700 text-sm">7-day return policy for unused items</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-2">Delivery Time</h4>
                      <p className="text-purple-700 text-sm">3-5 business days for metro cities</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        {isImageModalOpen && (
          <DialogContent className="sm:max-w-[800px] max-h-screen overflow-hidden">
            <DialogHeader>
              <DialogTitle>Product Image</DialogTitle>
            </DialogHeader>
            <div className="relative h-[calc(100vh-150px)]"> {/* Adjust height as needed */}
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={10}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                initialSlide={currentImageIndex}
                className="w-full h-full"
              >
                {productImages.map((imageUrl, index) => (
                  <SwiperSlide key={index}>
                    <img src={imageUrl} alt={`Product Image ${index + 1}`} className="w-full h-full object-contain" />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default ProductDetailPage;