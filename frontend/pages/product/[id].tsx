import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { allProducts } from '../../data/products'; // Adjust path as needed

const ProductDetailsPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details'); // 'details' or 'shipping'

  const product = allProducts.find(p => p.id === Number(id));

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p>The product with ID {id} could not be found.</p>
      </div>
    );
  }

  const handleQuantityChange = (type: 'increment' | 'decrement') => {
    if (type === 'increment') {
      setQuantity(prev => prev + 1);
    } else if (type === 'decrement' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Breadcrumbs */}
      <div className="bg-white py-3 shadow-sm">
        <div className="container mx-auto px-4">
          <nav className="text-sm text-gray-500">
            <ol className="list-none p-0 inline-flex">
              <li className="flex items-center">
                <Link href="/">
                  <span className="text-blue-600 hover:underline">Home</span>
                </Link>
                <span className="mx-2">/</span>
              </li>
              <li className="flex items-center">
                <Link href={`/category/${encodeURIComponent(product.category)}`}>
                  <span className="text-blue-600 hover:underline">{product.category}</span>
                </Link>
                <span className="mx-2">/</span>
              </li>
              <li className="flex items-center">
                <span className="text-gray-700">{product.title}</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-lg grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image Gallery */}
          <div>
            <div className="relative mb-4">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-auto rounded-lg shadow-md"
              />
              {product.badge && (
                <span className={`absolute top-3 left-3 ${product.badgeColor} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                  {product.badge}
                </span>
              )}
              {/* Placeholder for zoom icon */}
              <div className="absolute bottom-3 right-3 bg-black bg-opacity-50 text-white p-2 rounded-full cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            {/* Thumbnail Images */}
            <div className="flex space-x-2 overflow-x-auto">
              {product.thumbnailImages?.map((thumb, index) => (
                <img
                  key={index}
                  src={thumb}
                  alt={`${product.title} thumbnail ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-md border-2 border-gray-200 cursor-pointer hover:border-blue-500 transition-colors"
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <h2 className="text-sm text-gray-500 mb-1">SKU: RKIG{product.id}</h2>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.title}</h1>
            <p className="text-2xl font-semibold text-gray-800 mb-4">₹{product.price}</p>

            {/* Quantity Selector */}
            <div className="flex items-center mb-6">
              <span className="text-gray-700 mr-4">Quantity</span>
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => handleQuantityChange('decrement')}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-l-md"
                >
                  -
                </button>
                <span className="px-4 py-1 border-l border-r border-gray-300">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange('increment')}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-r-md"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total Amount */}
            <div className="mb-6">
              <span className="text-gray-700 text-lg">Total Amount</span>
              <span className="text-3xl font-bold text-gray-900 ml-4">₹{parseFloat(product.price.replace('$', '')) * quantity}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 mb-8">
              <button className="flex-1 bg-orange-500 text-white py-3 rounded-md font-semibold hover:bg-orange-600 transition-colors">
                Add To Cart
              </button>
              <button className="flex-1 bg-gray-700 text-white py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors">
                Buy Now
              </button>
            </div>

            {/* Tabs for Product Details and Shipping */}
            <div className="border-b border-gray-200 mb-4">
              <nav className="flex space-x-8">
                <button
                  className={`py-2 border-b-2 ${activeTab === 'details' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
                  onClick={() => setActiveTab('details')}
                >
                  Product Details
                </button>
                <button
                  className={`py-2 border-b-2 ${activeTab === 'shipping' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
                  onClick={() => setActiveTab('shipping')}
                >
                  Shipping and Return
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div>
              {activeTab === 'details' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Description</h3>
                  {product.description && (
                    <ul className="list-disc list-inside text-gray-700 mb-4">
                      <li>Blouse: {product.description.blouse}</li>
                      <li>Length: {product.description.length}</li>
                      <li>Washing: {product.description.washing}</li>
                      {product.description.note && <li>Note:{product.description.note}</li>}
                    </ul>
                  )}

                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Specifications</h3>
                  {product.specifications && (
                    <table className="w-full text-left text-gray-700">
                      <tbody>
                        <tr>
                          <td className="py-1 pr-4 font-medium">Fabric:</td>
                          <td className="py-1">{product.specifications.fabric}</td>
                        </tr>
                        <tr>
                          <td className="py-1 pr-4 font-medium">Media:</td>
                          <td className="py-1">{product.specifications.media}</td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {activeTab === 'shipping' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Shipping Information</h3>
                  <p className="text-gray-700">
                    Shipping details and return policy will be displayed here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;