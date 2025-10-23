import styles from '../../styles/pages/placeholder.module.css';

const features = [
  'Resumen de pedidos con estado, facturas y garantia.',
  'Seguimiento de ventas: tasacion, envio, verificacion y pago.',
  'Puntos, medallas y programa de referidos con progreso visible.',
];

const roadmap = [
  'Integrar autenticacion segura (OAuth, passkeys y 2FA).',
  'Panel de sostenibilidad con CO2 ahorrado y logros personales.',
  'Centro de notificaciones para alertas de stock y recordatorios de garantia.',
];

export default function MiCuentaPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageInner}>
        <header className={styles.pageHeading}>
          <span>Panel de usuario</span>
          <h1>Gestiona compras, ventas y fidelizacion desde un solo lugar</h1>
          <p>
            Este dashboard unificara informacion clave para usuarios registrados. El diseno final se
            conectara al backend cuando definamos el stack de autenticacion.
          </p>
        </header>

        <section className={styles.sectionGrid}>
          <article className={styles.sectionCard}>
            <h2>Funciones principales</h2>
            <ul>
              {features.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className={styles.sectionCard}>
            <h3>Roadmap</h3>
            <ul>
              {roadmap.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </section>

        <aside className={styles.infoBanner}>
          <strong>Proxima iteracion</strong>
          <p>
            Definir arquitectura de datos en context y hooks para sincronizar pedidos, certificados y
            comunicaciones en tiempo real.
          </p>
        </aside>
      </div>
    </div>
  );
}
