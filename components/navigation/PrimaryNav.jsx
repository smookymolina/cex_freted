import Link from 'next/link';
import Button from '../ui/Button';
import { useCart } from '../../context/cart/CartContext';
import { ShoppingCart } from 'lucide-react';
import { LanguageLink } from '../language/LanguageSwitcher';
import styles from '../../styles/components/primary-nav.module.css';
import { useSession } from 'next-auth/react';

const primaryLinks = [
  { label: 'Comprar', href: '/comprar' },
  { label: 'Vender', href: '/vender' },
  { label: 'Certificacion', href: '/certificacion' },
  { label: 'Garantias', href: '/garantias' },
  { label: 'Blog', href: '/blog' },
  { label: 'Comunidad', href: '/comunidad' },
  { label: 'Soporte', href: '/soporte' },
];

export default function PrimaryNav() {
  const { cartCount } = useCart();
  const { data: session, status } = useSession();

  const accountLink = status === 'authenticated' 
    ? { label: 'Mi Perfil', href: '/mi-cuenta/perfil' }
    : { label: 'Iniciar Sesión', href: '/mi-cuenta/login' };

  const allLinks = [...primaryLinks, accountLink];

  return (
    <header className={styles.wrapper}>
      <div className={styles.topBar}>
        <span>
          <strong>Soporte:</strong> +34 900 000 111 | Lun-Vie 09:00-20:00
        </span>
        <div className={styles.utilityLinks}>
          <Link href="/soporte/faq">FAQ</Link>
          <Link href="/soporte/chat">Chat 24/7</Link>
          <LanguageLink />
        </div>
      </div>
      <div className={styles.bar}>
        <Link href="/" className={styles.brand}>
          Sociedad Tecnologica Integral
          <span>Recommerce premium certificado</span>
        </Link>
        <nav className={styles.navLinks}>
          {allLinks.map((link) => (
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
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <Button href="/checkout/carrito">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShoppingCart style={{ width: '18px', height: '18px' }} />
                <span style={{ display: 'none' }} className="lg:inline">Carrito</span>
              </div>
            </Button>
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '20px',
                height: '20px',
                padding: '0 6px',
                borderRadius: '9999px',
                background: 'linear-gradient(to right, #ef4444, #dc2626)',
                color: 'white',
                fontSize: '11px',
                fontWeight: 'bold',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                border: '2px solid white',
                zIndex: 10
              }}>
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

