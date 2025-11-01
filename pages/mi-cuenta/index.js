import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import AccountIntro from '../../components/mi-cuenta/AccountIntro';

const MiCuentaPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Si el usuario está autenticado, redirigir al perfil
    if (status === 'authenticated') {
      router.replace('/mi-cuenta/perfil');
    }
  }, [status, router]);

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
