
import React from 'react';
import styles from '../../styles/pages/Comunidad.module.css';
import Button from '../ui/Button';

const JoinUs = () => {
  return (
    <section className={styles.joinUs}>
      <h2>Forma Parte del Cambio</h2>
      <p>Regístrate ahora y empieza a disfrutar de los beneficios de ser parte de nuestra comunidad.</p>
      <Button href="/mi-cuenta/registro" variant="secondary">
        Crear Cuenta
      </Button>
    </section>
  );
};

export default JoinUs;
