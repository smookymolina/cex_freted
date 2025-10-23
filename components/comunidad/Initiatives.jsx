
import React from 'react';
import styles from '../../styles/pages/Comunidad.module.css';

const initiatives = [
  {
    title: 'Programa de Referidos',
    description: 'Gana recompensas por cada amigo que compre o venda con nosotros. Accede a tu dashboard para compartir enlaces y seguir tus ganancias.'
  },
  {
    title: 'Retos de Sostenibilidad',
    description: 'Participa en nuestros retos mensuales, como "Mes sin plástico" o "Día de la reparación", y gana medallas y puntos para canjear.'
  },
  {
    title: 'Eventos y Webinars',
    description: 'Aprende de expertos sobre economía circular, cómo alargar la vida de tus dispositivos y las últimas tendencias en tecnología sostenible.'
  }
];

const Initiatives = () => {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Iniciativas Activas</h2>
      <div className={styles.grid}>
        {initiatives.map((item, index) => (
          <div className={styles.card} key={index}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Initiatives;
