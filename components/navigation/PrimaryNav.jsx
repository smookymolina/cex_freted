import Link from 'next/link';
import Button from '../ui/Button';
import { useCart } from '../../context/cart/CartContext';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { LanguageLink } from '../language/LanguageSwitcher';
import styles from '../../styles/components/primary-nav.module.css';
import { useSession } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import AuthModal from '../auth/AuthModal';
import Image from 'next/image';

const primaryLinks = [
  { label: 'Comprar', href: '/comprar' },
  { label: 'Vender', href: '/vender' },
  { label: 'Certificacion', href: '/certificacion' },
  { label: 'Garantias', href: '/garantias' },
  { label: 'Blog', href: '/blog' },
  { label: 'Comunidad', href: '/comunidad' },
  { label: 'Soporte', href: '/soporte' },
];

const essentialDesktopLabels = ['Vender', 'Certificacion', 'Blog', 'Comunidad'];

export default function PrimaryNav() {
  const { cartCount } = useCart();
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // Detectar scroll para cambiar estilos del header
  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // Cambiar estilo del header después de 50px
          if (currentScrollY > 50 && !isScrolled) {
            setIsScrolled(true);
          } else if (currentScrollY <= 50 && isScrolled) {
            setIsScrolled(false);
          }

          lastScrollY.current = currentScrollY;
          ticking.current = false;
        });

        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

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

  // Determinar el link de cuenta según rol y autenticación
  const getUserAccountLink = () => {
    if (status !== 'authenticated') {
      return { label: 'Iniciar Sesión', href: '/mi-cuenta/login' };
    }

    // Si es ADMIN o SOPORTE, redirigir al panel de administración
    if (session?.user?.role === 'ADMIN' || session?.user?.role === 'SOPORTE') {
      return { label: 'Panel Admin', href: '/admin' };
    }

    // Si es COMPRADOR, ir a su perfil
    return { label: 'Mi Perfil', href: '/mi-cuenta/perfil' };
  };

  const accountLink = getUserAccountLink();

  const allLinks = [...primaryLinks, accountLink];
  const desktopNavLinks = [
    ...primaryLinks.filter((link) => essentialDesktopLabels.includes(link.label)),
  ];

  return (
    <header className={`${styles.wrapper} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.bar}>
        <Link href="/" className={styles.brand}>
          Sociedad Tecnológica Integral
          <span>Recommerce premium certificado</span>
          <div className={styles.brandLogos}>
            <Image
              src="/images/banner_estaticov2.jpeg"
              alt="Marcas y métodos de pago aceptados"
              width={400}
              height={50}
              className={styles.logoBanner}
              priority
            />
          </div>
        </Link>
        <nav className={`${styles.navLinks} ${styles.desktopNav}`}>
          {desktopNavLinks.map((link) => (
            <Link key={link.href} href={link.href} className={styles.navLink}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className={styles.ctaGroup}>
          {status === 'authenticated' ? (
            <Button variant="outline" href={accountLink.href}>
              {accountLink.label}
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setAuthModalOpen(true)}>
              Iniciar Sesión
            </Button>
          )}
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
              {status === 'authenticated' ? (
                <Button
                  variant="outline"
                  href={accountLink.href}
                  onClick={closeMobileMenu}
                >
                  {accountLink.label}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => {
                    closeMobileMenu();
                    setAuthModalOpen(true);
                  }}
                >
                  Iniciar Sesión
                </Button>
              )}
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

      {/* Modal de autenticación */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </header>
  );
}

