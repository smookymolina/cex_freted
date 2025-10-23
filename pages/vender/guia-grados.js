import styles from '../../styles/pages/placeholder.module.css';

const gradeDetails = [
  {
    grade: 'Grado A+',
    description: 'Estado casi nuevo. Microdetalles invisibles a simple vista, bateria > 92%.',
  },
  {
    grade: 'Grado A',
    description:
      'Minimo desgaste en carcasa y pantalla. Funcionamiento perfecto, bateria > 88%, accesorios oficiales.',
  },
  {
    grade: 'Grado B',
    description:
      'Marcas visibles leves o micro rayones. Todo funcional, bateria > 85%, incluye cargador certificado.',
  },
  {
    grade: 'Grado C',
    description:
      'Desgaste cosmetico evidente pero 100% operativo. Ideal para usuarios que valoran precio por encima de estetica.',
  },
];

const recomendaciones = [
  'Sube fotos con buena luz de pantalla, laterales y parte trasera.',
  'Incluye la mayor cantidad de accesorios posibles para mejorar la oferta.',
  'Resetea el equipo a estado de fabrica y desactiva cuentas antes del envio.',
];

export default function GuiaGradosPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageInner}>
        <header className={styles.pageHeading}>
          <span>Guia de grados</span>
          <h1>Clasificacion estandarizada para tasar con claridad</h1>
          <p>
            Utilizaremos esta guia como referencia en formularios y certificados. El contenido se
            conectara con CMS para mantenerlo actualizado.
          </p>
        </header>

        <section className={styles.sectionGrid}>
          {gradeDetails.map((item) => (
            <article key={item.grade} className={styles.sectionCard}>
              <h2>{item.grade}</h2>
              <p>{item.description}</p>
            </article>
          ))}
        </section>

        <section className={styles.sectionGrid}>
          <article className={styles.sectionCard}>
            <h3>Recomendaciones para vendedores</h3>
            <ul>
              {recomendaciones.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </article>
          <article className={styles.sectionCard}>
            <h3>Documentos descargables</h3>
            <ul>
              <li>Checklist completo de revision tecnica.</li>
              <li>Plantilla de cesion de datos y autorizacion de borrado seguro.</li>
              <li>PDF de certificacion con 30 puntos de control.</li>
            </ul>
          </article>
        </section>
      </div>
    </div>
  );
}
