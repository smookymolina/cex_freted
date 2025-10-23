
import React from 'react';
import LoginForm from '../../components/forms/LoginForm';
import styles from '../../styles/pages/Login.module.css';

const LoginPage = () => {
  return (
    <div className={styles.container}>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
