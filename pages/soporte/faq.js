import styles from '../../styles/pages/placeholder.module.css';

const faqs = [
  {
    question: 'Como funciona la garantia de 12 meses?',
    answer: 'Cubre fallos tecnicos no provocados. Se gestiona desde Mi Cuenta con ticket dedicado.',
  },
  {
    question: 'Que incluye el certificado de 30 puntos?',
    answer: 'Detalle de pruebas realizadas, resultados, fecha y tecnico responsable.',
  },
  {
    question: 'Cuanto tarda el pago al vender mi dispositivo?',
    answer: 'Pagamos en un maximo de 48 horas despues de aprobar la revision.',
  },
];

export default function FaqPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageInner}>
        <header className={styles.pageHeading}>
          <span>Base de conocimiento</span>
          <h1>Preguntas frecuentes clave</h1>
          <p>
            Estas entradas se conectaran a un CMS para mantener respuestas actualizadas y
            localizadas.
          </p>
        </header>

        <section className={styles.sectionGrid}>
          {faqs.map((item) => (
            <article key={item.question} className={styles.sectionCard}>
              <h2>{item.question}</h2>
              <p>{item.answer}</p>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
