import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Fetch Razorpay key from backend
    const response = await fetch('http://localhost:8080/api/payments/key', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Razorpay key');
    }

    const key = await response.text();
    res.status(200).send(key);
  } catch (error) {
    console.error('Error fetching Razorpay key:', error);
    res.status(500).json({ error: 'Failed to fetch payment key' });
  }
}