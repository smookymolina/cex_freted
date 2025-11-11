import Head from 'next/head';
import PrimaryNav from '../navigation/PrimaryNav';
import CampaignBanner from '../CampaignBanner';
import EmailVerificationBanner from '../EmailVerificationBanner';
import CampaignModal from '../modals/CampaignModal';
import styles from '../../styles/layout/main-layout.module.css';

const footerColumns = [
  {
    heading: 'Confianza',
    links: [
      { label: 'Certificacion 30 puntos', href: '/certificacion' },
      { label: 'Sistema de grados', href: '/vender/guia-grados' },
      { label: 'Garantias', href: '/garantias' },
    ],
  },
  {
    heading: 'Personas',
    links: [
      { label: 'Quiero vender', href: '/vender' },
      { label: 'Quiero comprar', href: '/comprar' },
      { label: 'Programa referidos', href: '/comunidad' },
    ],
  },
  {
    heading: 'Soporte',
    links: [
      { label: 'Centro de ayuda', href: '/soporte' },
      { label: 'Politicas legales', href: '/soporte/faq' },
      { label: 'Contacto', href: '/soporte/contacto' },
    ],
  },
  {
    heading: 'Comunidad',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Historias clientes', href: '/comunidad' },
      { label: 'Sostenibilidad', href: '/content/sostenibilidad' },
    ],
  },
];

export default function MainLayout({ children }) {
  return (
    <div className={styles.layout}>
      <Head>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <CampaignModal />
      <CampaignBanner />
      <PrimaryNav />
      <EmailVerificationBanner />
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          {footerColumns.map((column) => (
            <div key={column.heading} className={styles.footerColumn}>
              <h4>{column.heading}</h4>
              <ul>
                {column.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className={styles.footerBottom}>
          <span>(c) {new Date().getFullYear()} Sociedad de Tecnología Integral. Todos los derechos reservados.</span>
          <span>Construimos tecnología circular con impacto positivo.</span>
        </div>
      </footer>
    </div>
  );
}
