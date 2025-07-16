import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // This is a placeholder for your payment key API logic.
  // In a real application, this would fetch a Razorpay key or similar from your backend.
  res.status(200).send(process.env.RAZORPAY_KEY_ID || 'rzp_test_xxxxxxxxxxxxxx');
}