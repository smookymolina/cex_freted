import styles from '../../styles/pages/home.module.css';

const highlights = [
  {
    title: 'Catalogo curado por expertos',
    description:
      'Filtra por categoria, marca, grado y garantia. Cada dispositivo se entrega listo para usar y con accesorios certificados.',
  },
  {
    title: 'Comparativas inteligentes',
    description:
      'Analiza diferencias entre modelos recientes, revisa rendimiento y recibe recomendaciones personalizadas.',
  },
  {
    title: 'Alertas y favoritos',
    description:
      'Activa avisos de stock o bajadas de precio por modelo y grado para no perder oportunidades.',
  },
];

export default function BuyerHighlights() {
  return (
    <section className="section-container">
      <div className="section-inner">
        <div className={styles.sectionHeading}>
          <span className={styles.badge}>Comprar con confianza</span>
          <h2>Experiencia premium para elegir tu proximo dispositivo</h2>
          <p>
            Navegacion veloz, filtros avanzados y contenidos educativos para decidir con seguridad.
          </p>
        </div>
        <div className={styles.cardGrid}>
          {highlights.map((item) => (
            <article key={item.title} className={styles.card}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
