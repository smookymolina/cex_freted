import React from 'react';
import styles from '../../styles/pages/Warranty.module.css';
import { ShieldCheck, Wrench, Package, MessageSquare } from 'lucide-react';

const WarrantyInfo = () => {
  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <ShieldCheck size={64} className={styles.heroIcon} />
          <h1 className={styles.heroTitle}>Tu Compra, 100% Protegida</h1>
          <p className={styles.heroSubtitle}>
            Todos nuestros productos reacondicionados incluyen una garantía completa de 12 meses para tu total tranquilidad. Compra con la confianza de saber que estamos aquí para ayudarte.
          </p>
        </div>
      </header>

      <section className={styles.coverageSection}>
        <h2 className={styles.sectionTitle}>¿Qué Cubre Nuestra Garantía?</h2>
        <div className={styles.coverageGrid}>
          <div className={styles.coverageItem}>
            <Wrench className={styles.itemIcon} />
            <h3 className={styles.itemTitle}>Defectos de Funcionamiento</h3>
            <p className={styles.itemDescription}>Cualquier problema técnico que no sea resultado de un daño accidental (caídas, líquidos, etc.).</p>
          </div>
          <div className={styles.coverageItem}>
            <ShieldCheck className={styles.itemIcon} />
            <h3 className={styles.itemTitle}>Componentes Internos</h3>
            <p className={styles.itemDescription}>Batería, pantalla, placa base y otros componentes internos están cubiertos contra fallos prematuros.</p>
          </div>
          <div className={styles.coverageItem}>
            <Package className={styles.itemIcon} />
            <h3 className={styles.itemTitle}>Accesorios Incluidos</h3>
            <p className={styles.itemDescription}>El cargador y el cable que vienen con tu dispositivo también están cubiertos por la garantía.</p>
          </div>
        </div>
      </section>

      <section className={styles.processSection}>
        <h2 className={styles.sectionTitle}>¿Cómo Iniciar un Proceso de Garantía?</h2>
        <div className={styles.processSteps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3 className={styles.stepTitle}>Abre un Ticket de Soporte</h3>
            <p className={styles.stepDescription}>Ve a 'Mi Cuenta', selecciona tu pedido y haz clic en 'Solicitar Garantía'. Describe el problema que estás experimentando.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3 className={styles.stepTitle}>Envío Gratuito del Producto</h3>
            <p className={styles.stepDescription}>Te enviaremos una etiqueta de envío prepagada para que nos mandes el dispositivo sin coste alguno para ti.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3 className={styles.stepTitle}>Reparación o Reemplazo</h3>
            <p className={styles.stepDescription}>Nuestro equipo técnico evaluará el dispositivo. Lo repararemos o, si no es posible, te enviaremos una unidad de reemplazo.</p>
          </div>
        </div>
      </section>

      <section className={styles.faqSection}>
        <h2 className={styles.sectionTitle}>Preguntas Frecuentes</h2>
        <div className={styles.faqItem}>
          <h4>¿Puedo extender la garantía?</h4>
          <p>Sí, en el momento de la compra puedes elegir nuestra garantía extendida de 24 meses por un pequeño coste adicional.</p>
        </div>
        <div className={styles.faqItem}>
          <h4>¿Qué pasa si el producto no se puede reparar?</h4>
          <p>Si la reparación no es posible, te entregaremos un producto de reemplazo con las mismas características o superiores.</p>
        </div>
        <div className={styles.faqItem}>
          <h4>¿La garantía cubre daños por agua o caídas?</h4>
          <p>La garantía estándar no cubre daños accidentales. Sin embargo, ofrecemos un seguro adicional (CEX Care) que puedes contratar para este tipo de incidentes.</p>
        </div>
      </section>
    </div>
  );
};

export default WarrantyInfo;
