import React from 'react';
import styles from '../../styles/pages/Certification.module.css';
import { CheckCircle, BatteryCharging, Cpu, ShieldCheck } from 'lucide-react';

const CertificationIntro = () => {
  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <ShieldCheck size={64} className={styles.heroIcon} />
          <h1 className={styles.heroTitle}>Certificación CEX: Confianza y Valor para tu Tecnología</h1>
          <p className={styles.heroSubtitle}>
            Nuestro proceso de certificación de 30 puntos, realizado por técnicos expertos, garantiza que cada dispositivo funciona como si fuera nuevo. Aumenta el valor de tu venta y ofrece total tranquilidad al comprador.
          </p>
          <button className={styles.ctaButton}>Vender un dispositivo certificado</button>
        </div>
      </header>

      <section className={styles.processSection}>
        <h2 className={styles.sectionTitle}>Nuestro Proceso de Certificación</h2>
        <div className={styles.processSteps}>
          <div className={styles.step}>
            <div className={styles.stepIconWrapper}><span className={styles.stepNumber}>1</span></div>
            <h3 className={styles.stepTitle}>Diagnóstico Inicial</h3>
            <p className={styles.stepDescription}>Verificamos el historial del dispositivo (IMEI/Nº de Serie) y realizamos una inspección visual completa.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepIconWrapper}><span className={styles.stepNumber}>2</span></div>
            <h3 className={styles.stepTitle}>Inspección Técnica de 30 Puntos</h3>
            <p className={styles.stepDescription}>Probamos cada componente: pantalla, batería, cámaras, puertos, conectividad y rendimiento del software.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepIconWrapper}><span className={styles.stepNumber}>3</span></div>
            <h3 className={styles.stepTitle}>Limpieza y Acondicionamiento</h3>
            <p className={styles.stepDescription}>Realizamos una limpieza de grado profesional y restauramos el dispositivo a su estado de fábrica, borrando todos los datos.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepIconWrapper}><span className={styles.stepNumber}>4</span></div>
            <h3 className={styles.stepTitle}>Emisión del Certificado</h3>
            <p className={styles.stepDescription}>Generamos un certificado digital con los resultados, accesible a través de un código QR único para total transparencia.</p>
          </div>
        </div>
      </section>

      <section className={styles.benefitsSection}>
        <h2 className={styles.sectionTitle}>Beneficios de la Certificación</h2>
        <div className={styles.benefitsGrid}>
          <div className={styles.benefitCard}>
            <CheckCircle className={styles.benefitIcon} />
            <h3 className={styles.benefitTitle}>Mayor Valor de Venta</h3>
            <p>Los dispositivos certificados se venden a un precio hasta un 15% superior.</p>
          </div>
          <div className={styles.benefitCard}>
            <BatteryCharging className={styles.benefitIcon} />
            <h3 className={styles.benefitTitle}>Batería Garantizada</h3>
            <p>Aseguramos una salud de batería superior al 85% en todos los dispositivos certificados.</p>
          </div>
          <div className={styles.benefitCard}>
            <Cpu className={styles.benefitIcon} />
            <h3 className={styles.benefitTitle}>Rendimiento Verificado</h3>
            <p>Cada función ha sido probada y verificada por nuestros técnicos cualificados.</p>
          </div>
          <div className={styles.benefitCard}>
            <ShieldCheck className={styles.benefitIcon} />
            <h3 className={styles.benefitTitle}>Garantía de 12 Meses</h3>
            <p>Ofrecemos una garantía completa que cubre cualquier defecto de funcionamiento.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CertificationIntro;
