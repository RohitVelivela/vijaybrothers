'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface LoginResponse {
  message: string;
  token: string;
}

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post<LoginResponse>('http://localhost:8080/api/admin/login', {
        username: username,
        password: password,
      });

      if (response.status === 200 && response.data.token) {
        setSuccess(response.data.message || 'User login successfully!');
        // Store the token in localStorage for admin pages
        localStorage.setItem('adminToken', response.data.token);
        // Also set as cookie for backwards compatibility
        document.cookie = `token=${response.data.token}; path=/; max-age=3600`;
        setTimeout(() => {
          setSuccess(null);
          router.push('/admin/dashboard');
        }, 1500);
      } else {
        setError(response.data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err: unknown) {
      

      if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as any).response === 'object'
      ) {
        const axiosErr = err as { response?: { data?: any } };
        

        const message =
          axiosErr.response?.data?.message ||
          axiosErr.response?.data?.error ||
          axiosErr.response?.data?.detail;

        setError(message || 'Login failed. Please check your credentials.');
      } else {
        setError('Network error. Please check your connection.');
      }
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

      {/* Login Form */}
      <div className="relative z-25 w-full max-w-sm px-6 -translate-y-15">
        <div className="flex justify-center mb-6">
          <img
            src="/images/default-avatar.png"
            alt="Vijay Brothers Logo"
            className="w-32 h-32 object-contain rounded-lg shadow-lg bg-white"
          />
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-[rgba(44,24,16,0.85)] backdrop-blur-sm rounded-xl p-4 border-2 border-[#D4AF37]"
          style={{ boxShadow: '0 0 30px rgba(212, 175, 55, 0.2)' }}
        >
          <Link href="/" className="absolute top-4 left-4 text-[#D4AF37] hover:text-[#FFD700] text-2xl">
            <i className="fas fa-arrow-left"></i>
          </Link>
          <h2 className="text-2xl font-serif text-center mb-6 text-[#D4AF37]">Welcome Back</h2>
          {success && <p className="text-green-500 text-center mb-4">{success}</p>}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          {/* Username */}
          <div className="mb-4">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-[rgba(44,24,16,0.3)] border-2 border-[#D4AF37] rounded-md focus:outline-none focus:border-[#FFD700] text-[#D4AF37] placeholder-[#B8860B] text-base"
              placeholder="Username"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-6 relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-[rgba(44,24,16,0.3)] border-2 border-[#D4AF37] rounded-md focus:outline-none focus:border-[#FFD700] text-[#D4AF37] placeholder-[#B8860B] text-base"
              placeholder="Password"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-[#D4AF37]`}></i>
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 bg-[#D4AF37] text-[#2C1810] text-lg font-bold rounded-md hover:bg-[#FFD700] transition duration-300 ease-in-out"
          >
            Sign In
          </button>

          {/* Links */}
          <div className="mt-4 text-center space-y-2">
            <Link href="/auth/forgot-password" className="block text-[#D4AF37] hover:text-[#FFD700] font-serif text-sm cursor-pointer">
              Forgot Password?
            </Link>
            <a href="/admin/signup" className="block text-[#D4AF37] hover:text-[#FFD700] font-serif text-sm cursor-pointer">
              Create Account
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
