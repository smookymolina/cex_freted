import '../styles/globals.css';
import Layout from '../components/layout/Layout';
import { CartProvider } from '../context/cart/CartContext';
import { SessionProvider } from 'next-auth/react';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <CartProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </CartProvider>
    </SessionProvider>
  );
}

export default MyApp;
