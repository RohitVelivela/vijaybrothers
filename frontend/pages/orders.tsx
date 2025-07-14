import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      // This should be the logged in user's ID
      const guestId = 1;
      const response = await fetch(`/api/orders/guest/${guestId}`);
      const data = await response.json();
      setOrders(data.content);
    };
    fetchOrders();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order: any) => (
          <div key={order.orderId} className="p-4 border rounded-lg">
            <div className="flex justify-between">
              <div>
                <p className="font-bold">Order ID: {order.orderNumber}</p>
                <p>Total: ₹{order.totalAmount}</p>
                <p>Status: {order.orderStatus}</p>
              </div>
              <div>
                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
