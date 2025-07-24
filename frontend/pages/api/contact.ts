import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8080/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { name, email, contactNo, subject, message } = req.body;

      // Forward the message to your actual backend API
      const backendResponse = await axios.post(`${BACKEND_API_URL}/contact-messages`, {
        name,
        email,
        contactNo,
        subject,
        message,
      });

      if (backendResponse.status === 200 || backendResponse.status === 201) {
        res.status(200).json({ success: true, message: 'Message sent to Vijay Brothers successfully!' });
      } else {
        res.status(backendResponse.status).json({ success: false, message: backendResponse.data?.message || 'Failed to send message to backend.' });
      }
    } catch (error: any) {
      console.error('Error forwarding contact message:', error);
      res.status(500).json({ success: false, message: error.response?.data?.message || 'Internal server error.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
