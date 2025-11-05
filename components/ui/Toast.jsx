import { useEffect, useState } from 'react';
import styles from '../../styles/components/toast.module.css';

export default function Toast({ id, message, type, duration, onClose }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  return (
    <div
      className={`${styles.toast} ${styles[type]} ${isExiting ? styles.exit : ''}`}
      role="alert"
      aria-live="polite"
    >
      <div className={styles.icon}>{getIcon()}</div>
      <div className={styles.message}>{message}</div>
      <button
        className={styles.closeButton}
        onClick={handleClose}
        aria-label="Cerrar notificación"
        type="button"
      >
        ✕
      </button>
    </div>
  );
}
