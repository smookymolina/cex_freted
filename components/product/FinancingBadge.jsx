import React from 'react';
import { CreditCard, TrendingDown } from 'lucide-react';
import styles from './FinancingBadge.module.css';

/**
 * Badge compacto que muestra meses sin intereses
 * Para usar en tarjetas de producto
 */
export default function FinancingBadge({ months, monthlyPayment, compact = false }) {
  if (!months) return null;

  if (compact) {
    return (
      <div className={styles.badgeCompact}>
        <CreditCard size={14} />
        <span>{months} MSI</span>
      </div>
    );
  }

  return (
    <div className={styles.badge}>
      <div className={styles.badgeIcon}>
        <CreditCard size={16} />
      </div>
      <div className={styles.badgeContent}>
        <span className={styles.badgeMonths}>{months} meses sin intereses</span>
        {monthlyPayment && (
          <span className={styles.badgePayment}>
            desde {monthlyPayment}/mes
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Panel expandido con detalles completos de financiamiento
 * Para usar en páginas de detalle y checkout
 */
export function FinancingDetails({ financingInfo, showCommission = false }) {
  if (!financingInfo || !financingInfo.months) return null;

  const {
    months,
    monthlyPayment,
    totalWithFinancing,
    originalPrice,
    commission,
    commissionPercentage,
  } = financingInfo;

  return (
    <div className={styles.details}>
      <div className={styles.detailsHeader}>
        <div className={styles.detailsIcon}>
          <CreditCard size={24} />
        </div>
        <div>
          <h3 className={styles.detailsTitle}>Paga a meses sin intereses</h3>
          <p className={styles.detailsSubtitle}>
            Financia tu compra sin cargos adicionales mensuales
          </p>
        </div>
      </div>

      <div className={styles.detailsHighlight}>
        <div className={styles.highlightLabel}>Tu pago mensual</div>
        <div className={styles.highlightAmount}>
          {new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 2,
          }).format(monthlyPayment)}
        </div>
        <div className={styles.highlightMonths}>en {months} meses sin intereses</div>
      </div>

      <div className={styles.detailsBreakdown}>
        <div className={styles.breakdownRow}>
          <span>Precio del producto</span>
          <span>
            {new Intl.NumberFormat('es-MX', {
              style: 'currency',
              currency: 'MXN',
            }).format(originalPrice)}
          </span>
        </div>

        {showCommission && (
          <div className={styles.breakdownRow}>
            <span>
              Comisión por financiamiento ({commissionPercentage.toFixed(1)}%)
            </span>
            <span>
              {new Intl.NumberFormat('es-MX', {
                style: 'currency',
                currency: 'MXN',
              }).format(commission)}
            </span>
          </div>
        )}

        <div className={`${styles.breakdownRow} ${styles.breakdownTotal}`}>
          <span>Total a pagar</span>
          <span>
            {new Intl.NumberFormat('es-MX', {
              style: 'currency',
              currency: 'MXN',
            }).format(totalWithFinancing)}
          </span>
        </div>
      </div>

      <div className={styles.detailsFeatures}>
        <div className={styles.feature}>
          <TrendingDown size={18} />
          <span>Sin enganche requerido</span>
        </div>
        <div className={styles.feature}>
          <CreditCard size={18} />
          <span>Aprobación inmediata</span>
        </div>
      </div>

      <div className={styles.detailsNote}>
        Sujeto a aprobación crediticia. Disponible con tarjetas participantes.
      </div>
    </div>
  );
}
