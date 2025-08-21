import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { AnimatePresence } from 'framer-motion';
import '../styles/globals.css';
import '../styles/scrollbar.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { Toaster } from '../components/ui/toaster';
import { useEffect, useState } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [showHeaderFooter, setShowHeaderFooter] = useState(false);

  useEffect(() => {
    const noHeaderFooterPaths = [
      '/admin',
      '/admin/login',
      '/admin/signup',
      '/admin/dashboard',
      '/admin/orders',
      '/admin/banners',
      '/admin/product-management',
      '/admin/categories',
      '/admin/edit-profile',
      '/admin/shipping',
      '/auth/forgot-password',
      '/auth/reset-password',
      '/admin/profile',
    ];
    const shouldShow = !noHeaderFooterPaths.some(path => router.pathname.startsWith(path));
    setShowHeaderFooter(shouldShow);
    
    // Ensure scrolling is enabled on main website
    if (shouldShow) {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    }
  }, [router.pathname]);

  return (
    <AuthProvider>
      <CartProvider>
        {showHeaderFooter && <Header />}
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <Component {...pageProps} key={router.asPath} />
          </AnimatePresence>
        </main>
        {showHeaderFooter && <Footer />}
        <Toaster />
      </CartProvider>
    </AuthProvider>
  );
}

export default MyApp;