import '../styles/globals.css';
import Layout from '../components/layout/Layout';
import { CartProvider } from '../context/cart/CartContext';

function MyApp({ Component, pageProps }) {
  return (
    <CartProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </CartProvider>
  );
}

export default MyApp;
