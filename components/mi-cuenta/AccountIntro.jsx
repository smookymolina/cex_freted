import React from 'react';
import Link from 'next/link';
import styles from '../../styles/pages/AccountIntro.module.css';

const featureHighlights = [
  {
    title: 'Control total',
    description: 'Centraliza compras, ventas y garantías con métricas siempre actualizadas.',
  },
  {
    title: 'Preferencias personalizadas',
    description: 'Configura avisos, privacidad y métodos de pago en segundos.',
  },
  {
    title: 'Seguimiento inteligente',
    description: 'Recibe alertas en tiempo real sobre envíos, entregas y oportunidades.',
  },
];

const AccountIntro = () => {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <span className={styles.kicker}>Experiencia CEX Freted</span>
        <h1 className={styles.title}>Tu espacio personal</h1>
        <p className={styles.subtitle}>
          Gestiona tus compras, ventas y sigue tu impacto en la economía circular. Crea una cuenta para desbloquear
          herramientas exclusivas o inicia sesión si ya eres parte de la comunidad.
        </p>
        <div className={styles.buttonGroup}>
          <Link href="/mi-cuenta/login" className={`${styles.button} ${styles.primary}`}>
            Iniciar sesión
          </Link>
          <Link href="/mi-cuenta/registro" className={`${styles.button} ${styles.secondary}`}>
            Crear cuenta
          </Link>
        </div>
      </div>

      <div className={styles.features}>
        {featureHighlights.map((item) => (
          <div key={item.title} className={styles.featureCard}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountIntro;
