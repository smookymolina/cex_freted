import React from 'react';
import styles from '../../styles/components/SaleSummary.module.css';

// Mock data - en una aplicación real, esto vendría del estado de la app o de la API
const saleData = {
  product: {
    name: 'iPhone 13 Pro',
    image: 'https://via.placeholder.com/100',
    grade: 'Muy Bueno',
  },
  offer: {
    price: 700,
  },
};

const SaleSummary = () => {
  // Aquí iría la lógica para manejar el formulario de usuario (login/registro/datos)

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Ya casi hemos terminado</h1>
      <p className={styles.subtitle}>Revisa tu venta y elige cómo quieres recibir tu pago.</p>

      <div className={styles.summaryAndForm}>
        {/* Columna de Resumen de Venta */}
        <div className={styles.summaryColumn}>
          <h2 className={styles.columnTitle}>Resumen de tu venta</h2>
          <div className={styles.productCard}>
            <img src={saleData.product.image} alt={saleData.product.name} className={styles.productImage} />
            <div className={styles.productDetails}>
              <p className={styles.productName}>{saleData.product.name}</p>
              <p className={styles.productGrade}>Estado: {saleData.product.grade}</p>
            </div>
            <div className={styles.productPrice}>
              <p className={styles.priceLabel}>Oferta</p>
              <p className={styles.priceValue}>{saleData.offer.price} €</p>
            </div>
          </div>
          <div className={styles.nextSteps}>
            <h4>Siguientes pasos:</h4>
            <ul>
              <li>Completa tus datos de pago y envío.</li>
              <li>Recibirás una etiqueta de envío gratuita.</li>
              <li>Te pagaremos en cuanto verifiquemos el producto.</li>
            </ul>
          </div>
        </div>

        {/* Columna de Formulario de Usuario */}
        <div className={styles.formColumn}>
          <h2 className={styles.columnTitle}>¿Dónde te pagamos?</h2>
          {/* Aquí se podría integrar un formulario de login/registro o un formulario para invitados */}
          <form className={styles.userForm}>
            <div className={styles.inputGroup}>
              <label htmlFor="fullName">Nombre completo</label>
              <input type="text" id="fullName" name="fullName" required />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Correo electrónico</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="iban">IBAN (para transferencia bancaria)</label>
              <input type="text" id="iban" name="iban" placeholder="ES00 0000 0000 0000 0000 0000" required />
            </div>
            <div className={styles.checkboxGroup}>
              <input type="checkbox" id="terms" name="terms" required />
              <label htmlFor="terms">Acepto los <a href="/terminos">términos y condiciones</a> de venta.</label>
            </div>
            <button type="submit" className={styles.submitButton}>Confirmar venta y recibir etiqueta</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SaleSummary;
