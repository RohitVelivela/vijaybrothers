import type { AppProps } from 'next/app';
import { useRouter } from 'next/router'; // Import useRouter
import './admin/globals.css'; // Global styles from the original project
import Header from '../components/Header'; // Import the Header component
import Footer from '../components/Footer'; // Import the Footer component

import { AuthProvider } from '../context/AuthContext'; // Adjust path as needed
import { CartProvider } from '../context/CartContext'; // Import CartProvider

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter(); // Initialize useRouter

  // Define paths where Header and Footer should NOT be rendered
  const noHeaderFooterPaths = ['/admin', '/admin/login', '/admin/signup','/admin/dashboard','/admin/orders','/admin/banners','/admin/product-management','/admin/categories','admin/edit-profile'];

  // Check if the current path is in the noHeaderFooterPaths array
  const showHeaderFooter = !noHeaderFooterPaths.includes(router.pathname);

  return (
    <AuthProvider>
      <CartProvider>
        {showHeaderFooter && <Header />}
        <Component {...pageProps} />
        {showHeaderFooter && <Footer />}
      </CartProvider>
    </AuthProvider>
  );
}

export default MyApp;