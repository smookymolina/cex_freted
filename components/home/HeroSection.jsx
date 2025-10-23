import Button from '../ui/Button';
import styles from '../../styles/pages/home.module.css';

export default function HeroSection() {
  return (
    <section className="section-container">
      <div className="section-inner">
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.badge}>Recommerce de confianza</span>
            <h1 className={styles.heroTitle}>
              Tecnologia reacondicionada certificada con 12 meses de garantia
            </h1>
            <p className={styles.heroSubtitle}>
              Compra con tranquilidad o vende sin friccion. Certificamos cada dispositivo con un
              control de 30 puntos, garantia premium y soporte experto.
            </p>
            <div className={styles.ctaGroup}>
              <Button href="/comprar">Comprar dispositivos</Button>
              <Button variant="outline" href="/vender">
                Vender mi dispositivo
              </Button>
            </div>
          </div>
          <div className={styles.metricStrip}>
            {[
              { label: 'Dispositivos reacondicionados', value: '+12.500' },
              { label: 'CO2 ahorrado', value: '28 Tn' },
              { label: 'Clientes satisfechos', value: '4.8/5' },
              { label: 'Garantia extendida', value: '12+ meses' },
            ].map((metric) => (
              <div key={metric.label} className={styles.metricCard}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
