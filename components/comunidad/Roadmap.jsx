
import React from 'react';
import styles from '../../styles/pages/Comunidad.module.css';

const roadmapItems = [
  {
    title: 'Gamificación y Niveles',
    description: 'Introduce niveles de usuario (Bronce, Silver, Gold) con beneficios exclusivos en cada nivel, como descuentos y acceso anticipado a productos.'
  },
  {
    title: 'Historias de la Comunidad',
    description: 'Una sección para que los usuarios compartan sus experiencias con la tecnología reacondicionada, incluyendo testimonios en video y casos de éxito.'
  },
  {
    title: 'Integración con App Móvil',
    description: 'Escanea y registra tus dispositivos antiguos directamente desde nuestra app para recibir una tasación instantánea y puntos de recompensa.'
  }
];

const Roadmap = () => {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Nuestro Roadmap</h2>
      <div className={styles.grid}>
        {roadmapItems.map((item, index) => (
          <div className={styles.card} key={index}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Roadmap;
