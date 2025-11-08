import React from 'react';
import styles from '../../styles/components/SaleConfirmation.module.css';
import { CheckCircle, Package, Mail } from 'lucide-react';

// Mock data
const confirmationData = {
  orderId: 'CEX-W-12345XYZ',
  email: 'usuario@email.com',
};

const SaleConfirmation = () => {
  return (
    <div className={styles.container}>
      <div className={styles.confirmationBox}>
        <CheckCircle className={styles.successIcon} size={64} />
        <h1 className={styles.title}>¡Venta confirmada!</h1>
        <p className={styles.subtitle}>
          Tu orden de venta <strong>{confirmationData.orderId}</strong> ha sido creada con éxito.
        </p>

        <div className={styles.nextSteps}>
          <h2 className={styles.nextStepsTitle}>¿Y ahora qué?</h2>
          <div className={styles.step}>
            <Mail size={40} className={styles.stepIcon} />
            <div className={styles.stepText}>
              <h3>1. Revisa tu email</h3>
              <p>Te hemos enviado un correo a <strong>{confirmationData.email}</strong> con la etiqueta de envío e instrucciones detalladas.</p>
            </div>
          </div>
          <div className={styles.step}>
            <Package size={40} className={styles.stepIcon} />
            <div className={styles.stepText}>
              <h3>2. Prepara y envía tu paquete</h3>
              <p>Empaqueta tu dispositivo de forma segura, pega la etiqueta y llévalo a tu punto de correos más cercano. ¡Es gratis!</p>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.primaryButton}>Imprimir etiqueta de envío</button>
          <button className={styles.secondaryButton}>Ir a Mis Ventas</button>
        </div>
      </div>
    </div>
  );
};

export default SaleConfirmation;
