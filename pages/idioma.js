import styles from '../styles/pages/placeholder.module.css';

export default function IdiomaPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageInner}>
        <header className={styles.pageHeading}>
          <span>Selector de idioma</span>
          <h1>Internacionalizacion progresiva</h1>
          <p>
            Implementaremos soporte bilingue (ES/EN) en la fase inicial y ampliaremos a otros idiomas
            segun expansion. Esta pagina funcionara como centro de preferencias.
          </p>
        </header>

        <section className={styles.sectionGrid}>
          <article className={styles.sectionCard}>
            <h2>Plan de despliegue</h2>
            <ul>
              <li>Definir estructura i18n en Next.js con namespaces por dominio.</li>
              <li>Conectar CMS para traducciones de contenido estatico.</li>
              <li>Implementar deteccion automatica y selector persistente.</li>
            </ul>
          </article>
        </section>

        <aside className={styles.infoBanner}>
          <strong>Notas</strong>
          <p>
            Validaremos copywriting y legal antes de publicar cada idioma. El objetivo es mantener
            consistencia de tono premium y cercano.
          </p>
        </aside>
      </div>
    </div>
  );
}
