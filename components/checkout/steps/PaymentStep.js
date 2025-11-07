import React from 'react';
import { CreditCard, Loader, PhoneCall, Info } from 'lucide-react';

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

    <section className="payment-instructions">
      <div className="payment-method-card">
        <div className="payment-method-card__icon">
          <PhoneCall size={24} />
        </div>
        <div className="payment-method-card__details">
          <h4>Método de Pago: Telefónico</h4>
          <p>Un agente de CEX Freted se comunicará contigo para procesar el pago de forma segura.</p>
        </div>
      </div>

      <div className="info-box">
        <Info size={40} className="info-box__icon" />
        <div className="info-box__content">
          <h4>¿Cómo funciona el pago telefónico?</h4>
          <ol>
            <li>Al confirmar tu pedido, nuestro sistema lo registrará como "pendiente de pago".</li>
            <li>
              Un agente te llamará al número <strong>{customerData.phone}</strong> en las próximas 24 horas hábiles.
            </li>
            <li>Durante la llamada, podrás proporcionar los datos de tu tarjeta de crédito o débito de forma 100% segura.</li>
            <li>Una vez aprobado el pago, recibirás la confirmación final y procederemos con el envío.</li>
          </ol>
        </div>
      </div>
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
      .payment-instructions {
        margin-bottom: 32px;
        display: flex;
        flex-direction: column;
        gap: 24px;
      }
      .payment-method-card {
        display: flex;
        align-items: center;
        gap: 16px;
        background: #fff;
        border: 2px solid #2563eb;
        border-radius: 12px;
        padding: 20px;
      }
      .payment-method-card__icon {
        flex-shrink: 0;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: #2563eb;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .payment-method-card__details h4 {
        margin: 0 0 4px;
        font-size: 1.1rem;
        font-weight: 600;
        color: #0f172a;
      }
      .payment-method-card__details p {
        margin: 0;
        font-size: 0.9rem;
        color: rgba(15, 23, 42, 0.75);
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