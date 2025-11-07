import { getSession } from 'next-auth/react';
import Head from 'next/head';
import SoporteLoginForm from '../../components/forms/SoporteLoginForm';
import { Shield } from 'lucide-react';

const SoporteLoginPage = () => {
  return (
    <>
      <Head>
        <title>Inicio de Sesión - Soporte Técnico</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem',
          color: 'white'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            marginBottom: '1rem',
            backdropFilter: 'blur(10px)'
          }}>
            <Shield size={40} />
          </div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            margin: '0 0 0.5rem',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            Panel de Soporte Técnico
          </h1>
          <p style={{
            fontSize: '1rem',
            opacity: 0.9,
            margin: 0
          }}>
            CEX Freted - Acceso Restringido
          </p>
        </div>
        <SoporteLoginForm />
        <p style={{
          marginTop: '2rem',
          fontSize: '0.875rem',
          color: 'rgba(255, 255, 255, 0.7)',
          textAlign: 'center'
        }}>
          Este panel es exclusivo para personal de soporte técnico autorizado
        </p>
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);

  // Si ya está autenticado con rol SOPORTE, redirigir al panel
  if (session?.user?.role === 'SOPORTE') {
    return {
      redirect: {
        destination: '/admin/ordenes',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default SoporteLoginPage;
