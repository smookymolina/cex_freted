import Link from 'next/link';
import styles from '../../styles/pages/soporte.module.css';

const canales = [
  'Base de conocimiento con artículos y videos explicativos.',
  'Chat asistido por bot con opción de escalado a agente humano.',
  'Línea telefónica prioritaria para casos de garantía y envíos.',
];

const sla = [
  'Respuestas por chat en menos de 5 minutos.',
  'Resolución de tickets garantizada en 24 horas hábiles.',
  'Seguimiento en tiempo real desde el panel de usuario.',
];

const contactInfo = [
  {
    icon: '📞',
    title: 'Atención telefónica',
    description: 'Lunes a Viernes: 9:00 AM - 7:00 PM | Sábados: 9:00 AM - 2:00 PM',
    contacts: [
      { label: 'Ciudad de México', value: '(55) 1234-5678' },
      { label: 'Guadalajara', value: '(33) 8765-4321' },
      { label: 'Monterrey', value: '(81) 9876-5432' },
      { label: 'Sin costo', value: '800-123-4567' },
    ],
  },
  {
    icon: '✉️',
    title: 'Correo electrónico',
    description: 'Respuesta en menos de 24 horas',
    contacts: [
      { label: 'Soporte general', value: 'soporte@cexfreted.com' },
      { label: 'Garantías', value: 'garantias@cexfreted.com' },
      { label: 'Ventas', value: 'ventas@cexfreted.com' },
      { label: 'Devoluciones', value: 'devoluciones@cexfreted.com' },
    ],
  },
  {
    icon: '💬',
    title: 'Chat en vivo',
    description: 'Disponible de 9:00 AM a 9:00 PM todos los días',
    contacts: [
      { label: 'Acceso directo', value: 'Haz clic en el botón inferior derecho', link: '/soporte/chat' },
    ],
  },
  {
    icon: '📱',
    title: 'WhatsApp Business',
    description: 'Respuestas rápidas en horario laboral',
    contacts: [
      { label: 'WhatsApp', value: '+52 55 1234-5678', link: 'https://wa.me/5215512345678' },
    ],
  },
];

export default function SoportePage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageInner}>
        <header className={styles.pageHeading}>
          <span>Centro de soporte</span>
          <h1>¿Cómo podemos ayudarte?</h1>
          <p>
            Estamos aquí para resolver tus dudas. Elige el canal que prefieras y nuestro equipo
            te atenderá lo antes posible.
          </p>
        </header>

        <section className={styles.contactGrid}>
          {contactInfo.map((channel) => (
            <article key={channel.title} className={styles.contactCard}>
              <div className={styles.cardIcon}>{channel.icon}</div>
              <h2>{channel.title}</h2>
              <p className={styles.cardDescription}>{channel.description}</p>
              <ul className={styles.contactList}>
                {channel.contacts.map((contact) => (
                  <li key={contact.label}>
                    <strong>{contact.label}:</strong>{' '}
                    {contact.link ? (
                      <Link href={contact.link} className={styles.contactLink}>
                        {contact.value}
                      </Link>
                    ) : (
                      <span className={styles.contactValue}>{contact.value}</span>
                    )}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className={styles.sectionGrid}>
          <article className={styles.sectionCard}>
            <h2>Canales disponibles</h2>
            <ul>
              {canales.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className={styles.sectionCard}>
            <h3>Compromisos de servicio</h3>
            <ul>
              {sla.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </section>

        <section className={styles.quickLinks}>
          <h2>Accesos rápidos</h2>
          <div className={styles.linksGrid}>
            <Link href="/soporte/faq" className={styles.quickLinkCard}>
              <span className={styles.quickLinkIcon}>❓</span>
              <strong>Preguntas Frecuentes</strong>
              <p>Encuentra respuestas rápidas</p>
            </Link>
            <Link href="/garantias" className={styles.quickLinkCard}>
              <span className={styles.quickLinkIcon}>🛡️</span>
              <strong>Garantías</strong>
              <p>Información sobre coberturas</p>
            </Link>
            <Link href="/soporte/contacto" className={styles.quickLinkCard}>
              <span className={styles.quickLinkIcon}>📧</span>
              <strong>Contacto</strong>
              <p>Envía un mensaje</p>
            </Link>
            <Link href="/mi-cuenta/pedidos" className={styles.quickLinkCard}>
              <span className={styles.quickLinkIcon}>📦</span>
              <strong>Seguimiento</strong>
              <p>Rastrea tu pedido</p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
