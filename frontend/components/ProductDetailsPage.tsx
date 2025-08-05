import React from 'react';
import { Product } from '../lib/api'; // Assuming you have product data
import { useRouter } from 'next/router';

interface ProductDetailsPageProps {
  product: Product;
}

const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ product }) => {
  const router = useRouter();

  const handleBuyNow = () => {
    // In a real application, you would add the product to a cart state
    // and then navigate to the cart page.
    
    router.push('/cart');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Image */}
        <div className="md:w-1/2">
          <img src={product.images[0]?.imageUrl} alt={product.name} className="w-full h-auto object-cover rounded-lg shadow-lg" />
          {/* Add thumbnail images here if needed */}
        </div>

        {/* Product Details */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
          <p className="text-xl text-red-600 font-semibold mb-4">₹{product.price.toLocaleString()}</p>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Quantity</h2>
            <div className="flex items-center border border-gray-300 rounded-md w-32">
              <button className="px-3 py-1 text-gray-600 hover:bg-gray-100">-</button>
              <input type="text" value="1" readOnly className="w-full text-center border-l border-r border-gray-300 py-1" />
              <button className="px-3 py-1 text-gray-600 hover:bg-gray-100">+</button>
            </div>
          </div>

          <div className="flex gap-4 mb-8">
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-md shadow-md transition duration-300">
              Add To Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md shadow-md transition duration-300"
            >
              Buy Now
            </button>
          </div>

          {/* Product Description */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Product Details</h2>
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
            {/* Add more details like blouse, length, washing instructions */}
          </div>

          {/* Specifications */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Specifications</h2>
            <ul className="list-disc list-inside text-gray-600">
              <li>Category: {product.category?.name}</li>
              <li>Color: {product.color}</li>
              <li>Fabric: {product.fabric}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
