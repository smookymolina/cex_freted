import Button from '../components/ui/Button';
import styles from '../styles/pages/error.module.css';

export default function Custom500() {
  return (
    <div className={styles.errorPage}>
      <div className={styles.errorContainer}>
        <div className={styles.errorCode}>500</div>
        <h1 className={styles.errorTitle}>Error del servidor</h1>
        <p className={styles.errorMessage}>
          Algo salió mal en nuestro servidor. Nuestro equipo ya está trabajando en ello.
        </p>

        <div className={styles.errorActions}>
          <Button href="/" variant="primary">
            Ir al inicio
          </Button>
          <Button onClick={() => window.location.reload()} variant="secondary">
            Intentar de nuevo
          </Button>
        </div>

        <div className={styles.errorDetails}>
          <p>
            Si el problema persiste, por favor{' '}
            <a href="/soporte/contacto">contáctanos</a> y te ayudaremos.
          </p>
        </div>
      </div>
    </div>
  );
}
