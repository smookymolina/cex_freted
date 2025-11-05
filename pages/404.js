import Link from 'next/link';
import Button from '../components/ui/Button';
import styles from '../styles/pages/error.module.css';

export default function Custom404() {
  return (
    <div className={styles.errorPage}>
      <div className={styles.errorContainer}>
        <div className={styles.errorCode}>404</div>
        <h1 className={styles.errorTitle}>Página no encontrada</h1>
        <p className={styles.errorMessage}>
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>

        <div className={styles.errorActions}>
          <Button href="/" variant="primary">
            Ir al inicio
          </Button>
          <Button href="/comprar" variant="secondary">
            Ver catálogo
          </Button>
        </div>

        <div className={styles.errorSuggestions}>
          <h2>¿Qué puedes hacer?</h2>
          <ul>
            <li>
              <Link href="/comprar">Explorar productos reacondicionados</Link>
            </li>
            <li>
              <Link href="/vender">Vender tu dispositivo</Link>
            </li>
            <li>
              <Link href="/soporte/contacto">Contactar soporte</Link>
            </li>
            <li>
              <Link href="/usuario/pedidos">Ver mis pedidos</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
