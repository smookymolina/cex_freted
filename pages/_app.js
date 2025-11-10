import '../styles/globals.css';
import 'react-datepicker/dist/react-datepicker.css';
import Layout from '../components/layout/Layout';
import { CartProvider } from '../context/cart/CartContext';
import { ToastProvider } from '../context/ToastContext';
import ToastContainer from '../components/ui/ToastContainer';
import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();

  // Las páginas de admin y soporte-login no deben usar el Layout principal
  const isAdminPage = router.pathname.startsWith('/admin');
  const isSoporteLoginPage = router.pathname === '/soporte/login';
  const shouldUseMainLayout = !isAdminPage && !isSoporteLoginPage;

  return (
    <SessionProvider session={session}>
      <ToastProvider>
        <CartProvider>
          {shouldUseMainLayout ? (
            <Layout>
              <Component {...pageProps} />
            </Layout>
          ) : (
            <Component {...pageProps} />
          )}
          <ToastContainer />
        </CartProvider>
      </ToastProvider>
    </SessionProvider>
  );
}

export default MyApp;
