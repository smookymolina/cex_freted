import { getSession } from 'next-auth/react';
import MainLayout from '../../components/layout/MainLayout';
import SoporteLoginForm from '../../components/forms/SoporteLoginForm';

const SoporteLoginPage = () => {
  return (
    <MainLayout>
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <SoporteLoginForm />
      </div>
    </MainLayout>
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
