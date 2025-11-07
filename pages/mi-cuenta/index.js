import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import AccountIntro from '../../components/mi-cuenta/AccountIntro';
import { resolveRoleHomeRoute } from '../../utils/roleHome';

const MiCuentaPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Si el usuario está autenticado, redirigir según su rol
    if (status === 'authenticated' && session?.user) {
      // PASO 2: Redirección condicional según el rol del usuario
      const destination = resolveRoleHomeRoute(session.user);
      router.replace(destination);
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
