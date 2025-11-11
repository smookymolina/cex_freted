import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import CartIcon from '../cart/CartIcon';

const Header = () => {
  const { data: session, status } = useSession();

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">
          <Link href="/">Sociedad de Tecnología Integral</Link>
        </div>
        <div className="hidden md:flex space-x-6 items-center">
          <Link href="/comprar" className="text-gray-600 hover:text-blue-600">Comprar</Link>
          <Link href="/mi-cuenta/login" className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium">Iniciar Sesión o Crear Cuenta</Link>
          <Link href="/certificacion" className="text-gray-600 hover:text-blue-600">Certificación</Link>
          <Link href="/garantias" className="text-gray-600 hover:text-blue-600">Garantías</Link>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          {status === 'loading' && (
            <div className="text-gray-500">Cargando...</div>
          )}
          {status === 'unauthenticated' && (
            <Link href="/mi-cuenta/login" className="text-gray-600 hover:text-blue-600">Iniciar Sesión</Link>
          )}
          {status === 'authenticated' && (
            <>
              <Link href="/mi-cuenta/perfil" className="text-gray-600 hover:text-blue-600">Mi Perfil</Link>
              <button onClick={() => signOut({ callbackUrl: '/' })} className="text-gray-600 hover:text-blue-600">Cerrar Sesión</button>
            </>
          )}
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