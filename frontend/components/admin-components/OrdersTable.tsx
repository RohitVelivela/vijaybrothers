import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button, buttonVariants } from '@/components/ui/button';
import { type VariantProps } from 'class-variance-authority';

interface Order {
  id: number;
  orderId: string;
  customerName: string;
  totalAmount: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  orderDate: Date;
}

interface OrdersTableProps {
  orders: Order[];
  onViewOrder: (orderId: string) => void;
}

export interface LocalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, onViewOrder }) => {
  const getStatusColorClass = (status: Order['status']) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-gray-500">ORDER ID</TableHead>
          <TableHead className="text-gray-500">CUSTOMER</TableHead>
          <TableHead className="text-gray-500">AMOUNT</TableHead>
          <TableHead className="text-gray-500">STATUS</TableHead>
          <TableHead className="text-gray-500">DATE</TableHead>
          <TableHead className="text-gray-500">ACTION</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium text-gray-800">{order.orderId}</TableCell>
            <TableCell className="text-gray-800">{order.customerName}</TableCell>
            <TableCell className="text-gray-800">₹{order.totalAmount.toLocaleString()}</TableCell>
            <TableCell>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColorClass(order.status)}`}>
                {order.status}
              </span>
            </TableCell>
            <TableCell className="text-gray-800">{order.orderDate.toLocaleDateString()}</TableCell>
            <TableCell>
              <Button variant="outline" size="sm" onClick={() => onViewOrder(order.orderId)} className="text-blue-600 hover:text-blue-800">
                View
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default OrdersTable;