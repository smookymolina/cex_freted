import styles from '../../styles/pages/placeholder.module.css';

export default function ChatSoportePage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageInner}>
        <header className={styles.pageHeading}>
          <span>Chat asistido</span>
          <h1>Asistente virtual con escalado a agente</h1>
          <p>
            Integraremos un bot guiado por conocimiento interno y FAQs. Cuando el caso lo requiera,
            se trasladara a un agente humano con contexto completo.
          </p>
        </header>

        <section className={styles.sectionGrid}>
          <article className={styles.sectionCard}>
            <h2>Caracteristicas planificadas</h2>
            <ul>
              <li>Identificacion del usuario via Mi Cuenta y pedidos recientes.</li>
              <li>Respuestas guiadas para preguntas frecuentes y checklists.</li>
              <li>Escalado manual o automatico segun nivel de satisfaccion.</li>
            </ul>
          </article>
          <article className={styles.sectionCard}>
            <h3>Estado actual</h3>
            <p>
              Estamos evaluando proveedores (Intercom, Zendesk, Freshdesk) y preparando scripts.
              Mientras tanto este espacio comunica las capacidades futuras.
            </p>
          </article>
        </section>
      </div>
    </div>
  );
}
