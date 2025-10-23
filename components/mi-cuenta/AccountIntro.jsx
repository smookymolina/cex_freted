
import React from 'react';
import Link from 'next/link';
import styles from '../../styles/pages/AccountIntro.module.css';

const AccountIntro = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Tu Espacio Personal</h1>
      <p className={styles.subtitle}>
        Gestiona tus compras, ventas, y sigue tu impacto en la economía circular. 
        Crea una cuenta para acceder a todas las funcionalidades o inicia sesión si ya eres parte.
      </p>
      <div className={styles.buttonGroup}>
        <Link href="/mi-cuenta/login" className={`${styles.button} ${styles.primary}`}>
          Iniciar Sesión
        </Link>
        <Link href="/mi-cuenta/registro" className={`${styles.button} ${styles.secondary}`}>
          Crear Cuenta
        </Link>
      </div>
    </div>
  );
};

export default AccountIntro;
