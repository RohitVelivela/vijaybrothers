'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

interface AdminSignupResponse {
  token: string | null;
  message: string;
}

const Signup: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post<AdminSignupResponse>('http://localhost:8080/api/admin/signup', {
        username: username,
        email: email,
        password: password,
      });

      if (response.status === 201 || response.status === 200) {
        setSuccess(response.data.message || 'User created successfully!');
        setTimeout(() => {
          setSuccess(null);
          router.push('/admin/login');
        }, 2000);
      } else {
        setError('Signup failed. Please try again.');
      }
    } catch (err: unknown) {
      

      if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as any).response === 'object'
      ) {
        const axiosErr = err as { response?: { data?: any } };
        

        const backendMessage =
          axiosErr.response?.data?.message ||
          axiosErr.response?.data?.error ||
          axiosErr.response?.data?.detail;

        setError(backendMessage || 'Signup failed. Please check your input.');
      } else {
        setError('Network error. Please check your connection.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#2C1810]">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 transform"
        style={{
          backgroundImage:
            "url('https://static.readdy.ai/image/5bf3484d397681701859ca274671e957/059e376f9c683592391f44ee3483c519.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 39%',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          borderRadius: '2rem',
        }}
      />

      {/* Signup Form */}
      <div className="relative z-10 w-full max-w-xs px-4 transform -translate-y-15 -translate-x-4">
        <div className="flex justify-center mb-6">
          <img
            src="/VB logo white back.png"
            alt="Vijay Brothers Logo"
            className="w-32 h-32 object-contain rounded-lg shadow-lg bg-white"
          />
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-[rgba(44,24,16,0.85)] backdrop-blur-sm rounded-xl p-3 border-2 border-[#D4AF37]"
          style={{ boxShadow: '0 0 30px rgba(212, 175, 55, 0.2)' }}
        >
          <h2 className="text-2xl font-serif text-center mb-6 text-[#D4AF37]">
            Create Account
          </h2>
          {success && <p className="text-green-500 text-center mb-4">{success}</p>}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          {/* Username */}
          <div className="mb-6">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 bg-[rgba(44,24,16,0.3)] border-2 border-[#D4AF37] rounded-md focus:outline-none focus:border-[#FFD700] text-[#D4AF37] placeholder-[#B8860B] text-base"
              placeholder="Username"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-6">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-[rgba(44,24,16,0.3)] border-2 border-[#D4AF37] rounded-md focus:outline-none focus:border-[#FFD700] text-[#D4AF37] placeholder-[#B8860B] text-base"
              placeholder="Email"
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
              className="w-full px-3 py-2 bg-[rgba(44,24,16,0.3)] border-2 border-[#D4AF37] rounded-md focus:outline-none focus:border-[#FFD700] text-[#D4AF37] placeholder-[#B8860B] text-base"
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
            className="w-full py-2 bg-[#D4AF37] text-[#2C1810] text-lg font-bold rounded-md hover:bg-[#FFD700] transition duration-300 ease-in-out whitespace-nowrap cursor-pointer"
          >
            Sign Up
          </button>

          {/* Link to Login */}
          <div className="mt-4 text-center">
            <a
              href="/admin/login"
              className="text-[#D4AF37] hover:text-[#FFD700] font-serif text-sm"
            >
              Already have an account? Sign In
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
