
import React from 'react';
import Link from 'next/link';
import styles from '../../styles/pages/Login.module.css';

const LoginForm = () => {
  return (
    <div className={styles.formWrapper}>
      <h1 className={styles.title}>Iniciar Sesión</h1>
      <p className={styles.subtitle}>Bienvenido de nuevo</p>
      <form>
        <div className={styles.formGroup}>
          <label htmlFor="email">Correo Electrónico</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Contraseña</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit" className={styles.button}>Iniciar Sesión</button>
      </form>
      <Link href="/mi-cuenta/registro" className={styles.link}>
        ¿No tienes una cuenta? Regístrate
      </Link>
    </div>
  );
};

export default LoginForm;
