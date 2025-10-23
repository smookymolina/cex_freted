import styles from '../../styles/pages/placeholder.module.css';

const comparativas = [
  {
    title: 'iPhone 14 vs iPhone 15',
    detail: 'Analisis de rendimiento, bateria y camara. Incluye recomendacion segun presupuesto.',
  },
  {
    title: 'Galaxy S23 vs Pixel 8',
    detail:
      'Comparativa de experiencias Android, soporte de actualizaciones y seguridad integrada.',
  },
  {
    title: 'MacBook Air M2 vs MacBook Pro M1',
    detail: 'Guia para perfiles creativos, estudiantes y profesionales remotos.',
  },
];

export default function ComparativasPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageInner}>
        <header className={styles.pageHeading}>
          <span>Recursos de compra</span>
          <h1>Comparativas elaboradas por el laboratorio Cex Freted</h1>
          <p>
            Estas piezas aportaran valor SEO y soporte a usuarios en duda. Se alimentaran desde el
            CMS con datos actualizados.
          </p>
        </header>

        <section className={styles.sectionGrid}>
          {comparativas.map((item) => (
            <article key={item.title} className={styles.sectionCard}>
              <h2>{item.title}</h2>
              <p>{item.detail}</p>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
