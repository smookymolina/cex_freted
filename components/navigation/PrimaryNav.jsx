import Link from 'next/link';
import Button from '../ui/Button';
import { useCart } from '../../context/cart/CartContext';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { LanguageLink } from '../language/LanguageSwitcher';
import styles from '../../styles/components/primary-nav.module.css';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

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
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hideTopBar, setHideTopBar] = useState(false);

  // Detectar scroll para ocultar topBar y cambiar estilos
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Cambiar estilo del header después de 50px
      setIsScrolled(currentScrollY > 50);

      // Ocultar topBar después de 100px y cuando se hace scroll hacia abajo
      if (currentScrollY > 100 && currentScrollY > lastScrollY) {
        setHideTopBar(true);
      } else if (currentScrollY < 100 || currentScrollY < lastScrollY) {
        setHideTopBar(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevenir scroll del body cuando el menú está abierto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const accountLink = status === 'authenticated'
    ? { label: 'Mi Perfil', href: '/mi-cuenta/perfil' }
    : { label: 'Iniciar Sesión', href: '/mi-cuenta/login' };

  const allLinks = [...primaryLinks, accountLink];

  return (
    <header className={`${styles.wrapper} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={`${styles.topBar} ${hideTopBar ? styles.hidden : ''}`}>
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
        <nav className={`${styles.navLinks} ${styles.desktopNav}`}>
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
                <span className={styles.cartText}>Carrito</span>
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
        <div className={styles.mobileActions}>
          <Link href="/checkout/carrito" className={styles.mobileCartButton}>
            <ShoppingCart style={{ width: '20px', height: '20px' }} />
            {cartCount > 0 && (
              <span className={styles.mobileCartBadge}>
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>
          <Button onClick={toggleMobileMenu} variant="ghost">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <>
          {/* Overlay para cerrar el menú al hacer click fuera */}
          <div className={styles.overlay} onClick={closeMobileMenu} />
          <div className={styles.mobileMenu}>
            <nav className={styles.mobileNavLinks}>
              {allLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={styles.mobileNavLink}
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            {/* Botones CTA en mobile */}
            <div className={styles.mobileCtaGroup}>
              <Button variant="outline" href="/vender" onClick={closeMobileMenu}>
                Tasar dispositivo
              </Button>
              <Button href="/comprar" onClick={closeMobileMenu}>
                Ver catálogo
              </Button>
              <Button href="/checkout/carrito" onClick={closeMobileMenu}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                  <ShoppingCart style={{ width: '18px', height: '18px' }} />
                  <span>Carrito</span>
                  {cartCount > 0 && <span>({cartCount})</span>}
                </div>
              </Button>
            </div>
          </div>
        </>
      )}
    </header>
  );
}

