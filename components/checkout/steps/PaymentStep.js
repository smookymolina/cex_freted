import React from 'react';
import { CreditCard, Loader, Info } from 'lucide-react';
import PaymentMethodSelector from '../PaymentMethodSelector';

const CURRENCY_FORMATTER = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
});

const PaymentStep = ({
  customerData,
  subtotal,
  shippingCost,
  total,
  paymentStatus,
  processingError,
  selectedPaymentMethod,
  onPaymentMethodChange,
}) => (
  <>
    <header className="step-header">
      <div className="step-header__label">
        <CreditCard aria-hidden="true" />
        <div>
          <h1>Confirmar y Pagar</h1>
          <p>
            Estás a un paso de finalizar tu pedido. Revisa la información y confirma para continuar.
          </p>
        </div>
      </div>
    </header>

    <section className="payment-selection">
      <h2>Selecciona tu método de pago</h2>
      <p className="payment-description">
        Elige la opción que más te convenga para realizar el pago de tu pedido.
      </p>

      <PaymentMethodSelector
        selectedMethod={selectedPaymentMethod}
        onSelectMethod={onPaymentMethodChange}
      />

      {!selectedPaymentMethod && (
        <div className="info-box info-box--warning">
          <Info size={24} className="info-box__icon" />
          <div className="info-box__content">
            <p>Por favor, selecciona un método de pago para continuar con tu pedido.</p>
          </div>
        </div>
      )}
    </section>

    <aside className="order-summary">
      <h2>Resumen final del pedido</h2>
      <div className="summary-row">
        <span>Subtotal</span>
        <span>{CURRENCY_FORMATTER.format(subtotal)}</span>
      </div>
      <div className="summary-row">
        <span>Envío</span>
        <span>{shippingCost === 0 ? 'Sin costo' : CURRENCY_FORMATTER.format(shippingCost)}</span>
      </div>
      <div className="summary-total">
        <span>Total a pagar</span>
        <span>{CURRENCY_FORMATTER.format(total)}</span>
      </div>
    </aside>

    {processingError && (
      <div className="error-message">
        <strong>Error:</strong> {processingError}
      </div>
    )}

    {paymentStatus === 'processing' && (
      <div className="processing-overlay">
        <div className="processing-card">
          <Loader className="spinner" size={48} />
          <h3>Procesando tu pedido...</h3>
          <p>Por favor espera un momento</p>
        </div>
      </div>
    )}

    <style jsx>{`
      .step-header {
        margin-bottom: 32px;
      }
      .step-header__label {
        display: flex;
        gap: 16px;
        align-items: flex-start;
      }
      .step-header__label > :global(svg) {
        width: 32px;
        height: 32px;
        color: #2563eb;
        flex-shrink: 0;
      }
      .step-header h1 {
        margin: 0 0 8px;
        font-size: 1.5rem;
        font-weight: 700;
        color: #0f172a;
      }
      .step-header p {
        margin: 0;
        font-size: 0.95rem;
        color: rgba(15, 23, 42, 0.65);
        line-height: 1.5;
      }
      .payment-selection {
        margin-bottom: 32px;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      .payment-selection h2 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 700;
        color: #0f172a;
      }
      .payment-description {
        margin: 0;
        font-size: 0.95rem;
        color: rgba(15, 23, 42, 0.65);
        line-height: 1.5;
      }
      .info-box {
        display: flex;
        gap: 20px;
        background: rgba(59, 130, 246, 0.05);
        border-left: 4px solid #2563eb;
        border-radius: 8px;
        padding: 24px;
      }
      .info-box__icon {
        flex-shrink: 0;
        color: #2563eb;
        width: 24px;
        height: 24px;
        margin-top: 4px;
      }
      .info-box__content h4 {
        margin: 0 0 12px;
        font-size: 1.1rem;
        font-weight: 600;
        color: #0f172a;
      }
      .info-box__content ol {
        margin: 0;
        padding-left: 20px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        font-size: 0.9rem;
        color: rgba(15, 23, 42, 0.75);
        line-height: 1.6;
      }
      .info-box__content p {
        margin: 0;
        font-size: 0.9rem;
        color: rgba(15, 23, 42, 0.75);
        line-height: 1.6;
      }
      .info-box--warning {
        background: rgba(251, 191, 36, 0.08);
        border-left-color: #f59e0b;
      }
      .info-box--warning .info-box__icon {
        color: #f59e0b;
      }
      .order-summary {
        background: linear-gradient(135deg, #f8fafc, #f1f5f9);
        border: 2px solid rgba(15, 23, 42, 0.08);
        border-radius: 16px;
        padding: 24px;
        margin-top: 32px;
      }
      .order-summary h2 {
        margin: 0 0 20px;
        font-size: 1.15rem;
        font-weight: 700;
        color: #0f172a;
      }
      .summary-row {
        display: flex;
        justify-content: space-between;
        padding: 12px 0;
        border-bottom: 1px solid rgba(15, 23, 42, 0.1);
        font-size: 0.95rem;
        color: rgba(15, 23, 42, 0.75);
      }
      .summary-row:last-of-type {
        border-bottom: none;
      }
      .summary-total {
        display: flex;
        justify-content: space-between;
        padding: 16px 0 0;
        margin-top: 12px;
        border-top: 2px solid rgba(15, 23, 42, 0.15);
        font-size: 1.25rem;
        font-weight: 700;
        color: #0f172a;
      }
      .error-message {
        background: rgba(239, 68, 68, 0.1);
        border: 2px solid #ef4444;
        border-radius: 12px;
        padding: 16px 20px;
        margin-top: 20px;
        color: #991b1b;
        font-size: 0.9rem;
      }
      .processing-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        backdrop-filter: blur(4px);
      }
      .processing-card {
        background: #fff;
        border-radius: 20px;
        padding: 48px 64px;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      }
      .spinner {
        color: #2563eb;
        animation: spin 1s linear infinite;
        margin: 0 auto 24px;
      }
      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
      .processing-card h3 {
        margin: 0 0 8px;
        font-size: 1.35rem;
        font-weight: 700;
        color: #0f172a;
      }
      .processing-card p {
        margin: 0;
        font-size: 0.95rem;
        color: rgba(15, 23, 42, 0.65);
      }
    `}</style>
  </>
);

export default PaymentStep;