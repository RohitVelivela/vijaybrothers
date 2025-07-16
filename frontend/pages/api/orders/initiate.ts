import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // This is a placeholder for your order initiation API logic.
  // In a real application, this would create an order in your database
  // and return details for payment processing.
  if (req.method === 'POST') {
    res.status(200).json({
      orderId: 'order_dummy_12345',
      amount: 12500, // Amount in paise (e.g., 125.00 INR)
      currency: 'INR',
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}