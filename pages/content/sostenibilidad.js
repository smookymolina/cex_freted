import Head from 'next/head';
import Button from '../../components/ui/Button';
import styles from '../../styles/pages/sostenibilidad.module.css';

const heroMetrics = [
  {
    label: 'Residuos electronicos 2022',
    value: '62 Mt',
    helper: 'Global E-waste Monitor 2024 (UNITAR + ITU).',
  },
  {
    label: 'Recoleccion formal',
    value: '22%',
    helper: 'Promedio mundial RAEE recuperado segun ONU 2022.',
  },
  {
    label: 'Huella media smartphone',
    value: '55 kg CO2e',
    helper: 'Apple Environmental Progress Report 2023 + Carbon Trust.',
  },
];

const pillars = [
  {
    title: 'Extender la vida util del hardware',
    description:
      'Seguimos el Circular Electronics Partnership Roadmap (2023) para duplicar los ciclos de uso antes del reciclaje.',
    bullets: [
      'Un smartphone reacondicionado evita ~55 kg CO2e (Apple + Carbon Trust, 2023).',
      'Aplicamos guias ITU-T L.1024 y PAS 141:2013 para talleres y logisticas certificadas.',
    ],
  },
  {
    title: 'Recuperacion RAEE alineada con ONU',
    description: 'Tomamos como referencia el Global E-waste Monitor 2024 y la directiva europea WEEE.',
    bullets: [
      'Europa alcanza 42.8% de recoleccion formal; usamos ese benchmark para Espana (ONU 2024).',
      'Integramos codigos RAEE y reportes compatibles con el registro MITECO.',
    ],
  },
  {
    title: 'Energia renovable y datos abiertos',
    description:
      'Medimos huella electrica con datos de Red Electrica de Espana (REE) y de la Agencia Internacional de Energia.',
    bullets: [
      'REE reporto que 50.4% de la generacion electrica 2023 en Espana fue renovable.',
      'IEA estima que los centros de datos consumen ~1.3% de la electricidad global (Tracking Clean Energy Progress 2023).',
    ],
  },
];

const dataStreams = [
  {
    title: 'Global E-waste Monitor 2024',
    status: 'Integrado 2024',
    description:
      'Serie historica de UNITAR/ITU con toneladas, categorias y tasas de recuperacion por pais (2010-2022).',
    highlight: 'Fuente: ewastemonitor.info - descarga CSV y GeoJSON oficial.',
  },
  {
    title: 'Eurostat CMU + RAEE',
    status: 'Actualizado trimestral',
    description:
      'Indicadores env_wastrat y env_wase de la Union Europea y Espana para circularidad y residuos por habitante.',
    highlight: 'Fuente: data.europa.eu - dataset env_wase_elec y env_wasmun.',
  },
  {
    title: 'CDP + SBTi disclosures',
    status: 'Enlace privado',
    description:
      'Metas de reduccion 1.5 C y factores Scope 3 reportados por empresas tech/telco 2021-2024.',
    highlight: 'Fuente: API CDP + Science Based Targets initiative (actualizacion nov 2024).',
  },
];

const roadmap = [
  {
    quarter: 'Q1 2025',
    title: 'Comparar KPIs locales vs objetivo WEEE 65%',
    detail:
      'Panel mostrara la brecha entre la recoleccion formal de Espana (42.8%) y el requisito 65% usando datos Eurostat 2022.',
  },
  {
    quarter: 'Q2 2025',
    title: 'Publicar API con series ONU, Eurostat y REE',
    detail:
      'Endpoints JSON versionados con datasets del Global E-waste Monitor, factores energeticos REE y emisiones IEA.',
  },
  {
    quarter: 'Q3 2025',
    title: 'Emitir fichas de circularidad por categoria',
    detail:
      'Metodologia Circular Electronics Partnership + CDP para laptops, smartphones y servidores con factores actualizados 2024.',
  },
];

export default function SostenibilidadPage() {
  return (
    <>
      <Head>
        <title>Sostenibilidad con datos oficiales | CEX Freted</title>
        <meta
          name="description"
          content="Panel de sostenibilidad basado en datos reales de Global E-waste Monitor, Eurostat, REE e iniciativas CDP/SBTi."
        />
      </Head>

      <main className={styles.page}>
        <div className={styles.pageInner}>
          <section className={styles.hero}>
            <div className={styles.heroText}>
              <span className={styles.heroBadge}>Datos abiertos</span>
              <h1>Sostenibilidad respaldada por fuentes oficiales</h1>
              <p>
                Combinamos series publicas de ONU, Eurostat, REE, Apple y CDP (2022-2024) para mostrar el contexto real
                de economia circular y RAEE que guia las decisiones de CEX Freted.
              </p>
              <div className={styles.heroActions}>
                <Button href="#roadmap">Explorar roadmap 2025</Button>
                <Button href="#datos" variant="outline">
                  Ver fuentes abiertas
                </Button>
              </div>
              <p className={styles.heroFootnote}>
                * Fuentes: Global E-waste Monitor 2024, Eurostat env_wase, REE Avance 2023, Apple Environmental Progress
                Report 2023, CDP Climate Disclosure 2024.
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
              <span className={styles.sectionBadge}>Referencias clave</span>
              <h2>Lineas de accion ligadas a estandares internacionales</h2>
              <p>
                Traducimos guias de organismos como ITU, Circular Electronics Partnership, ONU y la directiva europea
                WEEE en iniciativas concretas para clientes y partners.
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
              <span className={styles.sectionBadge}>Fuentes verificadas</span>
              <h2>Datasets reales conectados al panel</h2>
              <p>
                Cada flujo se alimenta de portales oficiales (ONU, Eurostat, REE, CDP) y mantiene metadatos de
                actualizacion, cobertura geografica y licencia abierta.
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
              <span className={styles.sectionBadge}>Hitos 2025</span>
              <h2>Roadmap publico conectado a regulacion</h2>
              <p>
                Las entregas priorizan deadlines de la directiva WEEE, compromisos SBTi y expectativas de inversionistas
                que reportan en CDP.
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
        </div>
      </main>
    </>
  );
}
