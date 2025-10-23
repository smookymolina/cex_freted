import styles from '../../styles/pages/placeholder.module.css';

const canales = [
  'Base de conocimiento con articulos y videos explicativos.',
  'Chat asistido por bot con opcion de escalado a agente humano.',
  'Linea telefonica prioritaria para casos de garantia y envios.',
];

const sla = [
  'Respuestas por chat en menos de 5 minutos.',
  'Resolucion de tickets garantizada en 24 horas habiles.',
  'Seguimiento en tiempo real desde el panel de usuario.',
];

export default function SoportePage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageInner}>
        <header className={styles.pageHeading}>
          <span>Centro de soporte</span>
          <h1>Atencion omnicanal con SLA visibles</h1>
          <p>
            Unificaremos recursos de ayuda y soporte para compradores y vendedores. Este layout sirve
            de mapa para integrar herramientas externas.
          </p>
        </header>

        <section className={styles.sectionGrid}>
          <article className={styles.sectionCard}>
            <h2>Canales disponibles</h2>
            <ul>
              {canales.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className={styles.sectionCard}>
            <h3>Compromisos de servicio</h3>
            <ul>
              {sla.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </section>

        <aside className={styles.infoBanner}>
          <strong>Integraciones pendientes</strong>
          <p>
            Conectar chat, formularios y seguimiento con la plataforma de CRM elegida (Zendesk,
            Freshdesk o similar) y medir NPS por canal.
          </p>
        </aside>
      </div>
    </div>
  );
}
