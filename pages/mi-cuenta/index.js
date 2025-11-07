import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import AccountIntro from '../../components/mi-cuenta/AccountIntro';

const MiCuentaPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Si el usuario está autenticado, redirigir según su rol
    if (status === 'authenticated' && session?.user) {
      // PASO 2: Redirección condicional según el rol del usuario
      if (session.user.role === 'SOPORTE') {
        // Si es soporte técnico, redirigir al panel de administración de órdenes
        router.replace('/admin/ordenes');
      } else {
        // Si es comprador u otro rol, redirigir al dashboard de comprador
        router.replace('/mi-cuenta/dashboard');
      }
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
          fontSize: '18px',
          color: '#666',
        }}
      >
        Cargando...
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return <AccountIntro />;
  }

  return null;
};

export default MiCuentaPage;
