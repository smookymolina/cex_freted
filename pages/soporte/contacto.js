import styles from '../../styles/pages/placeholder.module.css';

const contactPoints = [
  { label: 'Telefono', detail: '+34 900 000 111 (Lun-Vie 09:00-20:00)' },
  { label: 'Email', detail: 'soporte@cexfreted.com' },
  { label: 'Chat 24/7', detail: 'Disponible desde panel o app movil.' },
];

export default function ContactoPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageInner}>
        <header className={styles.pageHeading}>
          <span>Soporte directo</span>
          <h1>Contactanos cuando lo necesites</h1>
          <p>
            Este formulario se conectara al CRM para crear tickets automaticamente y hacer seguimiento
            de SLA.
          </p>
        </header>

        <section className={styles.sectionGrid}>
          {contactPoints.map((item) => (
            <article key={item.label} className={styles.sectionCard}>
              <h2>{item.label}</h2>
              <p>{item.detail}</p>
            </article>
          ))}
          <article className={styles.sectionCard}>
            <h3>Formulario en camino</h3>
            <p>
              Aqui vivira un formulario con validaciones y consentimientos GDPR. Por ahora trabajamos
              con placeholders mientras definimos la API.
            </p>
          </article>
        </section>
      </div>
    </div>
  );
}
