import Link from 'next/link';
import { useCart } from '../../context/cart/CartContext';

const Header = () => {
  const { cartCount } = useCart();

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">
          <Link href="/">CEX_FRETED</Link>
        </div>
        <div className="hidden md:flex space-x-6 items-center">
          <Link href="/comprar" className="text-gray-600 hover:text-blue-600">Comprar</Link>
          <Link href="/vender" className="text-gray-600 hover:text-blue-600">Vender</Link>
          <Link href="/certificacion" className="text-gray-600 hover:text-blue-600">Certificación</Link>
          <Link href="/garantias" className="text-gray-600 hover:text-blue-600">Garantías</Link>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/mi-cuenta" className="text-gray-600">Mi Cuenta</Link>
          <Link href="/checkout/carrito" className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
        <div className="md:hidden">
          <button className="text-gray-600 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;