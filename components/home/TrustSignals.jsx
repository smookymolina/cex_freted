import styles from '../../styles/pages/home.module.css';

const trustSignals = [
  {
    title: 'Sistema de grados A+, A, B, C',
    description:
      'Transparencia total con fotos reales por grado, checklist cosmetico y comparativa con producto nuevo.',
  },
  {
    title: 'Certificado digital individual',
    description:
      'Cada equipo incluye QR con 30 pruebas superadas, tecnico responsable y fecha de reacondicionamiento.',
  },
  {
    title: 'Garantia y soporte extendido',
    description:
      '12 meses incluidos con opciones de extension, soporte omnicanal y SLA visibles en todo el flujo.',
  },
  {
    title: 'Politicas de devolucion sencillas',
    description:
      'Devoluciones gratuitas en 30 dias, rastreo del proceso y gestion directa desde tu panel.',
  },
];

export default function TrustSignals() {
  return (
    <section className="section-container">
      <div className="section-inner">
        <div className={styles.sectionHeading}>
          <span className={styles.badge}>Confianza total</span>
          <h2>Procesos certificados para comprar o vender sin dudas</h2>
          <p>
            Reforzamos la propuesta de valor en cada touchpoint con pruebas, garantias y contenidos
            educativos.
          </p>
        </div>
        <div className={styles.trustGrid}>
          {trustSignals.map((signal) => (
            <article key={signal.title} className={styles.trustCard}>
              <h3>{signal.title}</h3>
              <p>{signal.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
