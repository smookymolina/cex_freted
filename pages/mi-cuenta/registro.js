import styles from '../../styles/pages/placeholder.module.css';

const benefits = [
  'Acceso anticipado a lanzamientos y pruebas beta.',
  'Bonos exclusivos al completar compras o ventas.',
  'Panel de impacto con datos de sostenibilidad personalizados.',
];

const requisitos = [
  'Email valido y verificacion de identidad basica.',
  'Aceptacion de terminos, politicas de privacidad y cookies.',
  'Consentimiento para comunicaciones comerciales opcionales.',
];

export default function RegistroPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageInner}>
        <header className={styles.pageHeading}>
          <span>Registro</span>
          <h1>Sumate a la comunidad Cex Freted</h1>
          <p>
            Aqui vivira el formulario de alta. De momento documentamos beneficios y requerimientos
            para coordinar con backend y legal.
          </p>
        </header>

        <section className={styles.sectionGrid}>
          <article className={styles.sectionCard}>
            <h2>Beneficios de crear una cuenta</h2>
            <ul>
              {benefits.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className={styles.sectionCard}>
            <h3>Requisitos iniciales</h3>
            <ul>
              {requisitos.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </section>

        <aside className={styles.infoBanner}>
          <strong>En construccion</strong>
          <p>
            El formulario se conectara a Supabase o auth headless segun decision final. Los datos se
            usaran para personalizar ofertas y paneles.
          </p>
        </aside>
      </div>
    </div>
  );
}
