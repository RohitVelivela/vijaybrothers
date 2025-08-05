import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Zoom, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom';
import 'swiper/css/thumbs';
import { ArrowLeft, Minus, Plus, ShoppingCart, Zap, Truck, Shield, RotateCcw, Check, X } from 'lucide-react';
import Image from 'next/image';
import { Product } from '../lib/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../hooks/use-toast';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onBuyNow: (quantity: number) => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, onBack, onBuyNow }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const productImages = product.images && product.images.length > 0 
    ? product.images.map((img) => img.imageUrl)
    : ['/placeholder-saree.jpg'];

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);
      await addToCart(product.productId, quantity);
      toast({
        title: "✅ Added to Cart",
        description: `${product.name} (${quantity} ${quantity > 1 ? 'items' : 'item'}) has been added to your cart successfully!`,
        variant: "default",
      });
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast({
        title: "❌ Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const totalAmount = product.price * quantity;

  const openImageModal = useCallback((index: number) => {
    setCurrentImageIndex(index);
    setIsImageModalOpen(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 }
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.4, ease: 'easeOut' }
    },
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40 backdrop-blur-lg bg-white/90">
        <div className="container mx-auto px-4 py-3">
          <motion.button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
            variants={itemVariants}
            whileHover={{ x: -4 }}
          >
            <ArrowLeft className="w-5 h-5 group-hover:animate-pulse" />
            <span className="font-medium">Back to Collection</span>
          </motion.button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12" variants={containerVariants}>
          {/* Image Gallery */}
          <motion.div className="space-y-4" variants={itemVariants}>
            <motion.div
              className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden shadow-xl border-[1px] border-gray-300"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative w-full flex items-center justify-center" style={{ height: '650px' }}>
                <Image
                  src={productImages[selectedImage]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain cursor-pointer p-2"
                  onClick={() => openImageModal(selectedImage)}
                  priority
                />
              </div>
              
            </motion.div>

            {/* Thumbnail Gallery */}
            {productImages.length > 1 && (
              <motion.div variants={itemVariants}>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
                  {productImages.map((image, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage === index 
                          ? 'border-orange-500 shadow-lg' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Image
                        src={image}
                        alt={`View ${index + 1}`}
                        width={80}
                        height={112}
                        className="w-full h-full object-cover"
                      />
                      {selectedImage === index && (
                        <div className="absolute inset-0 bg-orange-500/20" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Product Information */}
          <motion.div className="space-y-6" variants={itemVariants}>
            {/* SKU and Product Name */}
            <div className="space-y-2">
              {product.productCode && (
                <motion.p className="text-sm text-gray-600 font-medium" variants={itemVariants}>
                  SKU: {product.productCode}
                </motion.p>
              )}
              <motion.h1 className="text-2xl lg:text-3xl font-medium text-gray-900 leading-snug" variants={itemVariants}>
                {product.name}
              </motion.h1>
            </div>

            {/* Price and Stock */}
            <motion.div className="flex items-baseline justify-between" variants={itemVariants}>
              <div className="text-3xl font-semibold text-gray-900">₹{product.price.toLocaleString()}</div>
              <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                product.inStock 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {product.inStock ? (
                  <span className="flex items-center gap-1">
                    <Check className="w-4 h-4" /> In Stock
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <X className="w-4 h-4" /> Out of Stock
                  </span>
                )}
              </div>
            </motion.div>

            {/* Quantity and Actions */}
            <motion.div className="space-y-4" variants={itemVariants}>
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button 
                    onClick={() => handleQuantityChange(-1)} 
                    className="p-3 hover:bg-gray-100 transition-colors"
                    disabled={!product.inStock}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 py-3 font-medium border-x border-gray-300">{quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(1)} 
                    className="p-3 hover:bg-gray-100 transition-colors"
                    disabled={!product.inStock}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  Total: <span className="font-bold text-lg text-gray-900">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <motion.button 
                  onClick={handleAddToCart}
                  className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white px-6 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!product.inStock || isAddingToCart}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                </motion.button>
                <motion.button
                  onClick={() => onBuyNow(quantity)}
                  className="bg-gray-900 hover:bg-black disabled:bg-gray-300 text-white px-6 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!product.inStock}
                >
                  <Zap className="w-5 h-5" />
                  Buy Now
                </motion.button>
              </div>
            </motion.div>


            {/* Tabs */}
            <motion.div variants={itemVariants}>
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm transition-all ${
                    activeTab === 'details'
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Product Details
                </button>
                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`pb-4 px-1 ml-8 border-b-2 font-medium text-sm transition-all ${
                    activeTab === 'shipping'
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Shipping & Returns
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeTab}
                  className="pt-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'details' && (
                    <div className="space-y-6">
                      {product.description && (
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
                          <p className="text-gray-600 leading-relaxed">{product.description}</p>
                        </div>
                      )}
                      
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Specifications</h3>
                        <div className="bg-gray-50 rounded-xl p-1">
                          <table className="w-full">
                            <tbody>
                              <tr className="border-b border-gray-200">
                                <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-white">Color</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{product.color || 'Not specified'}</td>
                              </tr>
                              <tr className="border-b border-gray-200">
                                <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-white">Fabric</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{product.fabric || 'Not specified'}</td>
                              </tr>
                              {product.stockQuantity !== undefined && (
                                <tr>
                                  <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-white">Stock</td>
                                  <td className="px-4 py-3 text-sm text-gray-600">
                                    {product.stockQuantity > 0 ? `${product.stockQuantity} units available` : 'Out of Stock'}
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                        <p className="text-sm text-amber-800">
                          <strong>Note:</strong> Colors may appear slightly different due to monitor settings and photographic lighting.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'shipping' && (
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-gray-600 text-sm">Shipping and return information will be provided by the store.</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Image Modal */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>{product.name}</DialogTitle>
          </DialogHeader>
          <div className="relative h-[calc(90vh-80px)]">
            <Swiper
              modules={[Navigation, Pagination, Zoom]}
              spaceBetween={10}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              zoom={{ maxRatio: 3 }}
              initialSlide={currentImageIndex}
              className="w-full h-full"
            >
              {productImages.map((imageUrl, index) => (
                <SwiperSlide key={index}>
                  <div className="swiper-zoom-container w-full h-full flex items-center justify-center bg-gray-100">
                    <Image 
                      src={imageUrl} 
                      alt={`${product.name} - Image ${index + 1}`} 
                      width={1200} 
                      height={1600} 
                      className="max-w-full max-h-full object-contain" 
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ProductDetailPage;