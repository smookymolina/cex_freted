import Link from 'next/link';
import Button from '../ui/Button';
import styles from '../../styles/components/primary-nav.module.css';

const primaryLinks = [
  { label: 'Comprar', href: '/comprar' },
  { label: 'Vender', href: '/vender' },
  { label: 'Certificacion', href: '/certificacion' },
  { label: 'Garantias', href: '/garantias' },
  { label: 'Blog', href: '/blog' },
  { label: 'Comunidad', href: '/comunidad' },
  { label: 'Soporte', href: '/soporte' },
  { label: 'Mi Cuenta', href: '/mi-cuenta' },
];

export default function PrimaryNav() {
  return (
    <header className={styles.wrapper}>
      <div className={styles.topBar}>
        <span>
          <strong>Soporte:</strong> +34 900 000 111 | Lun-Vie 09:00-20:00
        </span>
        <div className={styles.utilityLinks}>
          <Link href="/soporte/faq">FAQ</Link>
          <Link href="/soporte/chat">Chat 24/7</Link>
          <Link href="/checkout">Carrito</Link>
          <Link href="/idioma">ES/EN</Link>
        </div>
      </div>
      <div className={styles.bar}>
        <Link href="/" className={styles.brand}>
          Cex Freted
          <span>Recommerce premium certificado</span>
        </Link>
        <nav className={styles.navLinks}>
          {primaryLinks.map((link) => (
            <Link key={link.href} href={link.href} className={styles.navLink}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className={styles.ctaGroup}>
          <Button variant="outline" href="/vender">
            Tasar dispositivo
          </Button>
          <Button href="/comprar">Ver catalogo</Button>
        </div>
      </div>
    </header>
  );
}

