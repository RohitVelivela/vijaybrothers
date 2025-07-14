import type { AppProps } from 'next/app';
import { useRouter } from 'next/router'; // Import useRouter
import Head from 'next/head'; // Import Head
import Script from 'next/script';
import './admin/globals.css'; // Global styles from the original project
import Header from '../components/Header'; // Import the Header component
import Footer from '../components/Footer'; // Import the Footer component

import { AuthProvider } from '../context/AuthContext'; // Adjust path as needed
import { CartProvider } from '../context/CartContext'; // Import CartProvider

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter(); // Initialize useRouter

  // Define paths where Header and Footer should NOT be rendered
  const noHeaderFooterPaths = ['/admin/login', '/admin/signup','/admin/dashboard'];

  // Check if the current path is in the noHeaderFooterPaths array
  const showHeaderFooter = !noHeaderFooterPaths.includes(router.pathname);

  return (
    <AuthProvider>
      <CartProvider>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Lora:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet" />
        </Head>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
        {showHeaderFooter && <Header />}
        <Component {...pageProps} />
        {showHeaderFooter && <Footer />}
      </CartProvider>
    </AuthProvider>
  );
}

export default MyApp;