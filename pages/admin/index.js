import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import AdminLayout from '../../components/layout/AdminLayout';
import { Loader } from 'lucide-react';

const AdminRedirectPage = () => {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    // Cuando el router esté listo y la sesión no esté cargando, redirigir.
    if (router.isReady && status !== 'loading') {
      router.replace('/admin/ordenes');
    }
  }, [router, status]);

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <Loader style={{ animation: 'spin 1s linear infinite' }} size={48} />
        <p>Redirigiendo al panel de órdenes...</p>
      </div>
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </AdminLayout>
  );
};

export default AdminRedirectPage;