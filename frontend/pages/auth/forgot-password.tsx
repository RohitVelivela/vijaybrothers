import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/api/admin/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('If an account with that email exists, a password reset link has been sent.');
        setEmail(''); // Clear email input
      } else {
        const errorData = await response.text(); // Backend returns plain text error
        setError(errorData || 'Failed to send password reset email.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
      console.error('Forgot password error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center relative overflow-hidden bg-[#2C1810]">
      {/* Background Image */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: '100vw',
          height: '100vh',
          backgroundImage:
            "url('https://static.readdy.ai/image/5bf3484d397681701859ca274671e957/059e376f9c683592391f44ee3483c519.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 39%',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          zIndex: 0,
          borderRadius: '2rem',
        }}
      ></div>

      {/* Form Container */}
      <div className="relative z-25 w-full max-w-md px-6 -translate-y-15 md:-translate-x-7">
        <div className="bg-[rgba(44,24,16,0.85)] backdrop-blur-sm rounded-xl p-4 border-2 border-[#D4AF37]" style={{ boxShadow: '0 0 30px rgba(212, 175, 55, 0.2)' }}>
          <h2 className="text-2xl font-bold text-center mb-6 text-[#D4AF37]">Forgot Password</h2>
          <p className="text-center mb-6 text-white">Enter your email address to receive a password reset link.</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-[#D4AF37] text-sm font-bold mb-2">Email Address</label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 bg-[rgba(44,24,16,0.3)] border-2 border-[#D4AF37] rounded-md focus:outline-none focus:border-[#FFD700] text-[#D4AF37] placeholder-[#B8860B] text-base"
                placeholder="your@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {message && <p className="text-green-500 text-center mb-4">{message}</p>}
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <button
              type="submit"
              className="w-full py-2 bg-[#D4AF37] text-[#2C1810] text-lg font-bold rounded-md hover:bg-[#FFD700] transition duration-300 ease-in-out"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="text-center mt-4">
            <Link href="/admin/login" className="text-[#D4AF37] hover:text-[#FFD700] font-serif text-sm cursor-pointer">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
