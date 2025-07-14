'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const SareeLanding = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDialogOpen(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setLoginForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-saree-hero bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://assets.macaly-user-data.dev/swbgvr0sarltthc13dbckzhn/new-chat/o2fjm96njFCiPM2vFUtkh/landing-page.png")'
        }}
      />
      <div className="absolute inset-0 bg-saree-overlay" />

      {/* Top-left Logo */}
      <div className="absolute top-5 left-5 z-20 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
        <div className="relative w-32 h-32 bg-white flex items-center justify-center shadow-lg rounded-lg overflow-hidden">
          <Image
            src="/images/logo.png"      // now loading from public/images/logo.png
            alt="Vijay Brothers Logo"
            fill                        // fills the 128×128 container
            sizes="128px"
            className="object-contain p-2"
            priority
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-end min-h-screen px-4 md:items-end md:pr-20 pb-20">
        <div className="text-center md:text-right max-w-xl mx-auto md:mx-0">
          <div className="absolute inset-0 bg-black opacity-30 pointer-events-none" />
          <div className="relative z-10 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <h1 className="font-serif text-4xl md:text-5xl mb-4 drop-shadow-lg">
              <span className="text-amber-200 block mb-2">Namaskaram</span>
              <span className="bg-gradient-to-r from-rose-100 to-teal-100 text-transparent bg-clip-text">
                Welcome to Vijay Brothers
              </span>
            </h1>
            <h2 className="font-sans text-xl md:text-2xl text-gray-300 mb-6 drop-shadow-md">
              Curate timeless stories, not just sarees.
            </h2>
            <p className="font-sans text-sm md:text-base text-gray-400 mb-8 leading-relaxed drop-shadow-sm">
              Celebrate the craftsmanship of India. Each saree is a thread of heritage, woven with pride, passed through generations.
            </p>
          </div>

<button
  onClick={() => router.push('/admin/login')}
  className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-gradient-to-r from-[#800000] via-[#8B0000] to-[#800000] px-6 font-medium text-amber-50 transition-all duration-300 ease-in-out luxury-glow luxury-glow-hover hover:scale-105 focus:scale-105"
>
  {/* Shimmer effect behind text */}
  <span className="absolute inset-0 z-10 rounded-md opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300 luxury-shimmer" />
  {/* Soft golden radial glow on hover */}
  <span className="absolute inset-0 rounded-md pointer-events-none opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300" style={{background: 'radial-gradient(75% 100% at 50% 0%,rgba(252,211,77,0.18) 0%,rgba(252,211,77,0) 75%)'}} />
  {/* Button text */}
  <span className="relative z-20 inline-flex h-full w-full items-center justify-center rounded-md bg-gradient-to-r from-[#800000] via-[#8B0000] to-[#800000] px-6 font-medium text-amber-50 text-crisp">
    Proceed To Admin Login
  </span>
</button>
        </div>
      </div>
    </div>
  );
};

export default SareeLanding;
