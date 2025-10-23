import styles from '../../styles/pages/placeholder.module.css';

const iniciativas = [
  'Programa de referidos con dashboard de recompensas y enlaces compartibles.',
  'Retos mensuales de sostenibilidad con medallas y puntos.',
  'Eventos y webinars sobre economia circular y cuidado de dispositivos.',
];

const roadmap = [
  'Gamificacion inicial con niveles Bronze, Silver y Gold.',
  'Seccion de historias con testimonios en video y casos B2B.',
  'Integracion con app movil para escanear y registrar equipos antiguos.',
];

export default function ComunidadPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageInner}>
        <header className={styles.pageHeading}>
          <span>Comunidad</span>
          <h1>Construimos lealtad a traves de recompensas e impacto</h1>
          <p>
            El objetivo es mantener a compradores y vendedores comprometidos con beneficios tangibles
            y contenido relevante.
          </p>
        </header>

        <section className={styles.sectionGrid}>
          <article className={styles.sectionCard}>
            <h2>Iniciativas activas</h2>
            <ul>
              {iniciativas.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className={styles.sectionCard}>
            <h3>Roadmap de comunidad</h3>
            <ul>
              {roadmap.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </section>

        <aside className={styles.infoBanner}>
          <strong>Acciones proximas</strong>
          <p>
            Definir reglas de referidos, automatizar tracking y preparar comunicacion para lanzarlo
            junto con la beta publica.
          </p>
        </aside>
      </div>
    </div>
  );
}
