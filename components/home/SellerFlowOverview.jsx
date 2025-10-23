import styles from '../../styles/pages/home.module.css';

const steps = [
  {
    title: 'Tasacion instantanea',
    description:
      'Busca tu modelo, indica estado y accesorios. El precio se ajusta en tiempo real mientras completas el formulario.',
  },
  {
    title: 'Envio guiado y gratuito',
    description:
      'Recibe etiqueta prepagada o solicita kit premium para proteger tu dispositivo. Seguimiento en cada punto.',
  },
  {
    title: 'Pago en 48 horas',
    description:
      'Verificamos con checklist de 30 puntos. Recibe transferencia, PayPal o +5% en credito tienda para tu siguiente compra.',
  },
];

export default function SellerFlowOverview() {
  return (
    <section className="section-container">
      <div className="section-inner">
        <div className={styles.sectionHeading}>
          <span className={styles.badge}>Vender sin friccion</span>
          <h2>Convierte tu tecnologia en valor en 3 pasos</h2>
          <p>
            Flujos claros, sin negociaciones ni sorpresa. Transparencia total desde la oferta hasta
            el pago final.
          </p>
        </div>
        <div className={styles.cardGrid}>
          {steps.map((step, index) => (
            <article key={step.title} className={styles.card}>
              <div className={styles.stepNumber}>{index + 1}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
