
import React from 'react';
import { getSession } from 'next-auth/react';
import LoginForm from '../../components/forms/LoginForm';
import styles from '../../styles/pages/Login.module.css';

const LoginPage = () => {
  return (
    <div className={styles.container}>
      <LoginForm />
    </div>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (session) {
    // Usar ruta absoluta para desarrollo
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    return {
      redirect: {
        destination: '/mi-cuenta/perfil',
        permanent: false,
        basePath: false,
      },
    };
  }

  return { props: {} };
}

export default LoginPage;
