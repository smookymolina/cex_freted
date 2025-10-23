
import React from 'react';
import styles from '../../styles/pages/Vender.module.css';
import { Search, Zap, Shield, Package } from 'lucide-react';

const SellIntro = () => {
  return (
    <div className={styles.sellIntroContainer}>
      <header className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Vende tu tecnología usada al mejor precio, sin complicaciones.</h1>
          <p className={styles.heroSubtitle}>
            Obtén una tasación justa en minutos. Imprime tu etiqueta de envío gratuita y recibe tu pago rápidamente.
          </p>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Busca tu producto (ej. iPhone 13, MacBook Pro 14)..."
              className={styles.searchInput}
            />
            <button className={styles.searchButton}>Empezar a vender</button>
          </div>
        </div>
      </header>

      <section className={styles.benefitsSection}>
        <div className={styles.benefit}>
          <Zap size={32} className={styles.benefitIcon} />
          <h3 className={styles.benefitTitle}>Tasación Instantánea</h3>
          <p className={styles.benefitText}>Nuestro sistema inteligente te da una oferta competitiva en tiempo real.</p>
        </div>
        <div className={styles.benefit}>
          <Package size={32} className={styles.benefitIcon} />
          <h3 className={styles.benefitTitle}>Envío Gratuito y Fácil</h3>
          <p className={styles.benefitText}>Te proporcionamos una etiqueta de envío prepagada. Solo tienes que empaquetarlo.</p>
        </div>
        <div className={styles.benefit}>
          <Shield size={32} className={styles.benefitIcon} />
          <h3 className={styles.benefitTitle}>Pago Rápido y Seguro</h3>
          <p className={styles.benefitText}>Recibe tu dinero por transferencia o PayPal tan pronto como verifiquemos tu artículo.</p>
        </div>
      </section>
    </div>
  );
};

export default SellIntro;
