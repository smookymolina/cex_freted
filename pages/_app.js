import '../styles/globals.css';
import Layout from '../components/layout/Layout';
import { CartProvider } from '../context/cart/CartContext';
import { ToastProvider } from '../context/ToastContext';
import ToastContainer from '../components/ui/ToastContainer';
import { SessionProvider } from 'next-auth/react';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <ToastProvider>
        <CartProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
          <ToastContainer />
        </CartProvider>
      </ToastProvider>
    </SessionProvider>
  );
}

export default MyApp;
