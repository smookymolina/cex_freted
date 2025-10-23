import styles from '../../styles/pages/placeholder.module.css';

const pilares = [
  'Medicion de CO2 evitado por dispositivo y por usuario.',
  'Programa de reciclaje para equipos no aptos con trazabilidad completa.',
  'Colaboraciones con ONGs tecnolgia y educacion digital.',
];

const proyecciones = [
  'Publicar reporte trimestral con metrica y avances.',
  'Lanzar calculadora interactiva para estimar impacto personal.',
  'Ofrecer badges compartibles para incentivar referidos y retos.',
];

export default function SostenibilidadPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageInner}>
        <header className={styles.pageHeading}>
          <span>Sostenibilidad</span>
          <h1>Impacto positivo respaldado por datos</h1>
          <p>
            Documento vivo que mostrara indicadores de economia circular y alianzas. Ideal para
            nutrir la confianza de compradores, vendedores y partners.
          </p>
        </header>

        <section className={styles.sectionGrid}>
          <article className={styles.sectionCard}>
            <h2>Pilares actuales</h2>
            <ul>
              {pilares.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className={styles.sectionCard}>
            <h3>Proyecciones a corto plazo</h3>
            <ul>
              {proyecciones.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </section>

        <aside className={styles.infoBanner}>
          <strong>Accion pendiente</strong>
          <p>
            Integrar datos reales desde el panel interno y preparar version descargable del reporte
            para stakeholders corporativos.
          </p>
        </aside>
      </div>
    </div>
  );
}
