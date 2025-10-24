import Link from 'next/link';
import CartIcon from '../cart/CartIcon';

const Header = () => {

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
          <CartIcon showLabel={false} />
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