import Head from 'next/head';
import Button from '../../components/ui/Button';
import styles from '../../styles/pages/sostenibilidad.module.css';

const heroMetrics = [
  {
    label: 'CO2 evitado 2025',
    value: '124 t',
    helper: 'Equivalente aproximado a 6 200 arboles plantados*.',
  },
  {
    label: 'Dispositivos reacondicionados',
    value: '9 890',
    helper: '82% con segunda vida antes de 6 meses.',
  },
  {
    label: 'Reciclaje certificado',
    value: '97%',
    helper: 'Gestionado con partners R2 y RAEE auditables.',
  },
];

const pillars = [
  {
    title: 'Medicion de CO2 por dispositivo',
    description: 'Huella calculada por lote, usuario y canal usando factores GHG Scope 3.',
    bullets: [
      'Dashboard con comparables y recomendaciones personalizadas.',
      'Reportes exportables listos para auditoria (ISO 14064).',
    ],
  },
  {
    title: 'Programa de reciclaje trazable',
    description: 'Derivamos equipos no aptos a plantas certificadas con seguimiento completo.',
    bullets: [
      'Cadena documentada con codigos QR y evidencia fotografica.',
      'Certificados digitales enviados automaticamente al cliente.',
    ],
  },
  {
    title: 'Alianzas con ONGs de tecnologia y educacion',
    description: 'Red de socios que lleva equipamiento y capacitacion a comunidades vulnerables.',
    bullets: [
      'Laboratorios y hubs digitales activos en 12 ciudades.',
      'Mentorias STEM y programas de insercion laboral tech.',
    ],
  },
];

const dataStreams = [
  {
    title: 'Panel interno de impacto',
    status: 'En produccion',
    description:
      'Dataset unificado con eventos de compra, reacondicionamiento y reciclaje actualizado cada 6 horas.',
    highlight: 'Fuente: Snowflake + dbt. Owner: Data Ops.',
  },
  {
    title: 'Calculadora de impacto personal',
    status: 'Beta Q2 2025',
    description:
      'API que recibe inventario de cada cliente y estima ahorros de CO2, agua y e-waste.',
    highlight: 'Integracion prevista para la app movil y el portal B2B.',
  },
  {
    title: 'Reporte descargable para stakeholders',
    status: 'En diseno',
    description:
      'Template PDF/Slides con resumen ejecutivo, fichas tecnicas y anexo metodologico.',
    highlight: 'Incluye notas legales y sello de validacion externa.',
  },
];

const roadmap = [
  {
    quarter: 'Q1 2025',
    title: 'Publicar reporte trimestral con metricas y avances',
    detail:
      'Version 1.0 con contexto comparativo vs 2024, riesgos mitigados y backlog abierto.',
  },
  {
    quarter: 'Q2 2025',
    title: 'Lanzar calculadora interactiva para estimar impacto personal',
    detail:
      'Widget embebible y API publica con autenticacion por token para clientes enterprise.',
  },
  {
    quarter: 'Q3 2025',
    title: 'Ofrecer badges compartibles para incentivar referidos y retos',
    detail:
      'Sistema de logros con verificacion on-chain y opciones para campanas internas.',
  },
];

const backlog = [
  'Conectar el panel interno al dataset publico de sostenibilidad (Snowflake -> API REST).',
  'Preparar version descargable del reporte con resumen ejecutivo y anexos tecnicos.',
  'Definir SLA de actualizacion y responsables de aprobacion de datos antes de cada corte.',
];

export default function SostenibilidadPage() {
  return (
    <>
      <Head>
        <title>Sostenibilidad | CEX Freted</title>
        <meta
          name="description"
          content="Indicadores vivos de economia circular, alianzas y roadmap de sostenibilidad para compradores, sellers y partners."
        />
      </Head>

      <main className={styles.page}>
        <div className={styles.pageInner}>
          <section className={styles.hero}>
            <div className={styles.heroText}>
              <span className={styles.heroBadge}>Sostenibilidad</span>
              <h1>Impacto positivo respaldado por datos</h1>
              <p>
                Documento vivo que muestra indicadores de economia circular, alianzas y compromisos.
                Ideal para nutrir la confianza de compradores, vendedores y partners.
              </p>
              <div className={styles.heroActions}>
                <Button href="#roadmap">Ver roadmap 2025</Button>
                <Button href="#datos" variant="outline">
                  Metodologia y fuentes
                </Button>
              </div>
              <p className={styles.heroFootnote}>
                * Metodologia basada en factores del Greenhouse Gas Protocol (actualizacion 2024).
              </p>
            </div>
            <dl className={styles.heroMetrics}>
              {heroMetrics.map((metric) => (
                <div key={metric.label} className={styles.metricCard}>
                  <dt>{metric.label}</dt>
                  <dd className={styles.metricValue}>{metric.value}</dd>
                  <dd className={styles.metricHelper}>{metric.helper}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className={styles.section} id="pillars">
            <header className={styles.sectionHeading}>
              <span className={styles.sectionBadge}>Pilares actuales</span>
              <h2>Economia circular con trazabilidad end-to-end</h2>
              <p>
                Medimos, reutilizamos y educamos en cada etapa del ciclo de vida de los dispositivos para mantener la
                confianza de nuestra comunidad.
              </p>
            </header>
            <div className={styles.cardGrid}>
              {pillars.map((pillar) => (
                <article key={pillar.title} className={styles.card}>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.description}</p>
                  <ul>
                    {pillar.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.section} id="datos">
            <header className={styles.sectionHeading}>
              <span className={styles.sectionBadge}>Fuentes de datos</span>
              <h2>Indicadores vivos y alianzas verificables</h2>
              <p>
                Cada dato proviene de sistemas integrados al panel interno para asegurar consistencia, trazabilidad y
                auditoria externa.
              </p>
            </header>
            <div className={styles.dataGrid}>
              {dataStreams.map((stream) => (
                <article key={stream.title} className={styles.dataCard}>
                  <header>
                    <h3>{stream.title}</h3>
                    <span className={styles.statusTag}>{stream.status}</span>
                  </header>
                  <p>{stream.description}</p>
                  <footer>{stream.highlight}</footer>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.section} id="roadmap">
            <header className={styles.sectionHeading}>
              <span className={styles.sectionBadge}>Proyecciones a corto plazo</span>
              <h2>Roadmap publico 2025</h2>
              <p>
                Estas entregas mantendran el reporte vivo y accionable para clientes corporativos, sellers y aliados
                comunitarios.
              </p>
            </header>
            <ol className={styles.timeline}>
              {roadmap.map((item) => (
                <li key={item.quarter} className={styles.timelineItem}>
                  <span className={styles.timelineQuarter}>{item.quarter}</span>
                  <div className={styles.timelineContent}>
                    <h3>{item.title}</h3>
                    <p>{item.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className={styles.callout}>
            <div className={styles.calloutContent}>
              <h3>Accion pendiente prioritaria</h3>
              <p>
                Integrar datos reales desde el panel interno y preparar una version descargable del reporte para
                stakeholders corporativos.
              </p>
              <ul className={styles.stackedList}>
                {backlog.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className={styles.calloutActions}>
              <Button href="/panel">Ir al panel interno</Button>
              <Button href="/api/reporting" variant="outline">
                Ver especificacion del reporte
              </Button>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
