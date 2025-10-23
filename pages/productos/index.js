import styles from '../../styles/pages/placeholder.module.css';

const mensajes = [
  'Aqui listaremos categorias destacadas y filtros preconfigurados.',
  'Cada tarjeta mostrara grado, garantia, precio y acceso al certificado.',
  'Habra comparador rapido y CTA para trade-in del dispositivo actual.',
];

export default function ProductosPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageInner}>
        <header className={styles.pageHeading}>
          <span>Catalogo</span>
          <h1>Productos destacados en construccion</h1>
          <p>
            Este espacio servira como hub para categorias principales y colecciones. De momento
            funciona como placeholder informativo.
          </p>
        </header>

        <section className={styles.sectionGrid}>
          <article className={styles.sectionCard}>
            <h2>Que estamos preparando</h2>
            <ul>
              {mensajes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </section>
      </div>
    </div>
  );
}
