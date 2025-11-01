import React from 'react';
import { getSession } from 'next-auth/react';
import RegisterForm from '../../components/forms/RegisterForm';
import styles from '../../styles/pages/Login.module.css';

const RegisterPage = () => {
  return (
    <div className={styles.container}>
      <RegisterForm />
    </div>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: '/mi-cuenta/perfil',
        permanent: false,
      },
    };
  }

  return { props: {} };
}

export default RegisterPage;
