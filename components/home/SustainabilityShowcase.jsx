import Button from '../ui/Button';
import styles from '../../styles/pages/home.module.css';

const metrics = [
  { label: 'Energia reutilizada', value: '87%' },
  { label: 'Dispositivos donados', value: '420' },
  { label: 'Tiendas asociadas', value: '18 labs' },
];

const initiatives = [
  {
    title: 'Programa de reciclaje',
    detail: 'Gestionamos dispositivos no aptos con partners certificados e informes de trazabilidad.',
  },
  {
    title: 'Impacto por usuario',
    detail: 'Panel personalizado para monitorizar CO2 ahorrado, puntos y logros de sostenibilidad.',
  },
  {
    title: 'Packaging circular',
    detail: 'Cajas 100% recicladas, sellos biodegradables e instrucciones para reusar materiales.',
  },
];

export default function SustainabilityShowcase() {
  return (
    <section className="section-container">
      <div className="section-inner">
        <div className={styles.sectionHeading}>
          <span className={styles.badge}>Economia circular</span>
          <h2>Sostenibilidad como nucleo del modelo</h2>
          <p>
            Cada transaccion impulsa la reutilizacion responsable y la medicion del impacto real para
            nuestros clientes y la comunidad.
          </p>
        </div>
        <div className={styles.cardGrid}>
          {initiatives.map((item) => (
            <article key={item.title} className={styles.card}>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
        <div className={styles.section}>
          <div className={styles.sectionHeading}>
            <h3>Metricas vivas del programa</h3>
            <p>Se actualizan en tiempo real para reforzar la confianza en nuestro impacto.</p>
          </div>
          <div className={styles.metricStrip}>
            {metrics.map((metric) => (
              <div key={metric.label} className={styles.metricCard}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
          <div className={styles.ctaGroup} style={{ marginTop: '24px' }}>
            <Button href="/content/sostenibilidad" variant="outline">
              Ver reporte de impacto
            </Button>
            <Button href="/comunidad">Unirme a la comunidad</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
