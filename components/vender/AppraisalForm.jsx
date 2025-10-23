import React, { useState } from 'react';
import styles from '../../../styles/components/AppraisalForm.module.css';

// Mock data - en el futuro, esto vendría de una API
const productData = {
  name: 'iPhone 13 Pro',
  image: 'https://via.placeholder.com/150',
  basePrice: 750,
  grades: [
    {
      name: 'Como Nuevo',
      description: 'Pantalla, chasis y trasera sin marcas. Funcionalidad 100% verificada.',
      adjustment: 0,
    },
    {
      name: 'Muy Bueno',
      description: 'Puede tener micro-rasguños invisibles a 20cm. Funcionalidad 100% verificada.',
      adjustment: -50,
    },
    {
      name: 'Bueno',
      description: 'Rasguños ligeros visibles en pantalla o carcasa. Funcionalidad 100% verificada.',
      adjustment: -120,
    },
    {
      name: 'Funcional',
      description: 'Marcas o golpes evidentes, pero 100% funcional. La batería puede estar degradada.',
      adjustment: -200,
    },
  ],
};

const AppraisalForm = ({ productSlug }) => {
  const [selectedGrade, setSelectedGrade] = useState(productData.grades[1]); // Default a 'Muy Bueno'

  const finalPrice = productData.basePrice + selectedGrade.adjustment;

  return (
    <div className={styles.container}>
      <div className={styles.productHeader}>
        <img src={productData.image} alt={productData.name} className={styles.productImage} />
        <div className={styles.productInfo}>
          <h1 className={styles.productName}>¿En qué estado se encuentra tu {productData.name}?</h1>
          <p className={styles.productSubtitle}>Selecciona el grado que mejor describe tu dispositivo.</p>
        </div>
      </div>

      <div className={styles.gradeSelector}>
        {productData.grades.map((grade) => (
          <div
            key={grade.name}
            className={`${styles.gradeOption} ${selectedGrade.name === grade.name ? styles.selected : ''}`}
            onClick={() => setSelectedGrade(grade)}
          >
            <h3 className={styles.gradeName}>{grade.name}</h3>
            <p className={styles.gradeDescription}>{grade.description}</p>
            <span className={styles.gradeAdjustment}>
              {grade.adjustment === 0 ? 'Precio base' : `Ajuste: ${grade.adjustment} €`}
            </span>
          </div>
        ))}
      </div>

      <div className={styles.priceSummary}>
        <div className={styles.priceBox}>
          <p className={styles.priceLabel}>Tu oferta</p>
          <p className={styles.priceValue}>{finalPrice} €</p>
          <p className={styles.priceDisclaimer}>Precio final sujeto a verificación técnica.</p>
        </div>
        <button className={styles.submitButton}>Aceptar oferta y continuar</button>
      </div>
    </div>
  );
};

export default AppraisalForm;
