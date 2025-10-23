import styles from '../../styles/pages/placeholder.module.css';

const pasos = [
  {
    title: 'Carrito',
    detail:
      'Resumen de productos, grados, garantia y total. Mostrar ahorro frente a nuevo y opciones de trade-in.',
  },
  {
    title: 'Datos y envio',
    detail:
      'Formulario dividido en datos personales, direccion y metodo de entrega. Integrar validaciones en tiempo real.',
  },
  {
    title: 'Pago',
    detail:
      'Pasarela segura con tarjetas, PayPal, financiacion y credito tienda. Recordatorio de garantias y politicas.',
  },
  {
    title: 'Confirmacion',
    detail:
      'Timeline visual del pedido, acceso a panel y recomendaciones de proximos pasos. Activar email y notificaciones.',
  },
];

export default function CheckoutPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageInner}>
        <header className={styles.pageHeading}>
          <span>Checkout</span>
          <h1>Proceso claro y sin fricciones</h1>
          <p>
            Esta ruta guiara el desarrollo del checkout modular. Cada paso se implementara como
            componente independiente con validaciones y analytics.
          </p>
        </header>

        <section className={styles.sectionGrid}>
          {pasos.map((step) => (
            <article key={step.title} className={styles.sectionCard}>
              <h2>{step.title}</h2>
              <p>{step.detail}</p>
            </article>
          ))}
        </section>

        <aside className={styles.infoBanner}>
          <strong>Proximo objetivo</strong>
          <p>
            Integrar proveedor de pagos y sandbox logistica para pruebas end-to-end. Se documentaran
            eventos GA4 y Segment en paralelo.
          </p>
        </aside>
      </div>
    </div>
  );
}
