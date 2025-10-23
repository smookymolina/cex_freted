
import React from 'react';
import Link from 'next/link';
import styles from '../../styles/pages/Login.module.css';

const RegisterForm = () => {
  return (
    <div className={styles.formWrapper}>
      <h1 className={styles.title}>Crear Cuenta</h1>
      <p className={styles.subtitle}>Únete a nuestra comunidad</p>
      <form>
        <div className={styles.formGroup}>
          <label htmlFor="name">Nombre Completo</label>
          <input type="text" id="name" name="name" required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email">Correo Electrónico</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Contraseña</label>
          <input type="password" id="password" name="password" required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">Confirmar Contraseña</label>
          <input type="password" id="confirmPassword" name="confirmPassword" required />
        </div>
        <button type="submit" className={styles.button}>Crear Cuenta</button>
      </form>
      <Link href="/mi-cuenta/login" className={styles.link}>
        ¿Ya tienes una cuenta? Inicia Sesión
      </Link>
    </div>
  );
};

export default RegisterForm;
