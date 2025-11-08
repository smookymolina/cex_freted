import React from 'react';
import { CreditCard, Loader, Info, Copy, CheckCircle2, Shield } from 'lucide-react';
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

      {selectedPaymentMethod && (selectedPaymentMethod === 'BANK_TRANSFER' || selectedPaymentMethod === 'CASH_DEPOSIT' || selectedPaymentMethod === 'CONVENIENCE_STORE') && (
        <>
          <div className="security-notice">
            <Shield size={20} className="security-notice__icon" />
            <div className="security-notice__content">
              <strong>Compra Segura:</strong> Realiza el depósito directo con el vendedor.
              Todos los pagos son verificados para garantizar la seguridad de tu compra.
            </div>
          </div>

          <div className="payment-details">
            <h3 className="payment-details__title">Datos para realizar tu pago</h3>
            <p className="payment-details__subtitle">
              A nombre de: <strong>SOCIEDAD CORPORATIVA MULTIEMPRESARIAL, S.A. DE C.V.</strong>
            </p>

            {(selectedPaymentMethod === 'BANK_TRANSFER' || selectedPaymentMethod === 'CASH_DEPOSIT') && (
              <div className="bank-info-card">
                <div className="bank-info-card__header">
                  <div className="bank-logo">SANTANDER</div>
                  <span className="account-type">Cuenta Maestra PYME</span>
                </div>
                <div className="bank-info-card__body">
                  <div className="info-row">
                    <span className="info-label">Cuenta:</span>
                    <div className="info-value-group">
                      <span className="info-value">65 50978658 2</span>
                      <button
                        type="button"
                        className="copy-btn"
                        onClick={() => navigator.clipboard.writeText('6550978658')}
                        title="Copiar número de cuenta"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="info-row">
                    <span className="info-label">CLABE Interbancaria:</span>
                    <div className="info-value-group">
                      <span className="info-value">014180655097865823</span>
                      <button
                        type="button"
                        className="copy-btn"
                        onClick={() => navigator.clipboard.writeText('014180655097865823')}
                        title="Copiar CLABE"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedPaymentMethod === 'CONVENIENCE_STORE' && (
              <div className="bank-info-card bank-info-card--oxxo">
                <div className="bank-info-card__header">
                  <div className="bank-logo bank-logo--oxxo">OXXO</div>
                  <span className="account-type">Pago en Autoservicio</span>
                </div>
                <div className="bank-info-card__body">
                  <div className="info-row">
                    <span className="info-label">Cuenta:</span>
                    <div className="info-value-group">
                      <span className="info-value">55-79-08-90-06-65-61-39</span>
                      <button
                        type="button"
                        className="copy-btn"
                        onClick={() => navigator.clipboard.writeText('55790890066561039')}
                        title="Copiar número de cuenta"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="oxxo-instructions">
                    <CheckCircle2 size={16} />
                    <span>Presenta este número en la caja de cualquier OXXO</span>
                  </div>
                </div>
              </div>
            )}

            <div className="payment-instructions">
              <Info size={18} />
              <div>
                <p><strong>Instrucciones:</strong></p>
                <ol>
                  <li>Realiza el pago utilizando los datos mostrados arriba</li>
                  <li>Guarda tu comprobante de pago</li>
                  <li>El vendedor verificará tu pago en un plazo de 24-48 horas</li>
                  <li>Recibirás una confirmación por correo electrónico</li>
                </ol>
              </div>
            </div>
          </div>
        </>
      )}

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
      .security-notice {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.08));
        border: 2px solid rgba(16, 185, 129, 0.3);
        border-radius: 12px;
        padding: 16px 20px;
        margin-top: 16px;
      }
      .security-notice__icon {
        color: #10b981;
        flex-shrink: 0;
        margin-top: 2px;
      }
      .security-notice__content {
        font-size: 0.9rem;
        color: rgba(15, 23, 42, 0.85);
        line-height: 1.6;
      }
      .security-notice__content strong {
        color: #059669;
        font-weight: 700;
      }
      .payment-details {
        background: linear-gradient(135deg, #ffffff, #f8fafc);
        border: 2px solid rgba(15, 23, 42, 0.1);
        border-radius: 16px;
        padding: 24px;
        margin-top: 20px;
      }
      .payment-details__title {
        margin: 0 0 8px;
        font-size: 1.25rem;
        font-weight: 700;
        color: #0f172a;
      }
      .payment-details__subtitle {
        margin: 0 0 24px;
        font-size: 0.9rem;
        color: rgba(15, 23, 42, 0.7);
      }
      .payment-details__subtitle strong {
        color: #0f172a;
        font-weight: 600;
      }
      .bank-info-card {
        background: #ffffff;
        border: 2px solid rgba(37, 99, 235, 0.15);
        border-radius: 14px;
        overflow: hidden;
        margin-bottom: 20px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        transition: all 0.3s ease;
      }
      .bank-info-card:hover {
        box-shadow: 0 8px 20px rgba(37, 99, 235, 0.12);
        border-color: rgba(37, 99, 235, 0.25);
      }
      .bank-info-card--oxxo {
        border-color: rgba(220, 38, 38, 0.2);
      }
      .bank-info-card--oxxo:hover {
        box-shadow: 0 8px 20px rgba(220, 38, 38, 0.12);
        border-color: rgba(220, 38, 38, 0.3);
      }
      .bank-info-card__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: linear-gradient(135deg, #2563eb, #1d4ed8);
        padding: 16px 20px;
        gap: 12px;
      }
      .bank-info-card--oxxo .bank-info-card__header {
        background: linear-gradient(135deg, #dc2626, #b91c1c);
      }
      .bank-logo {
        font-size: 1.25rem;
        font-weight: 900;
        color: #ffffff;
        letter-spacing: 0.05em;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }
      .bank-logo--oxxo {
        font-size: 1.4rem;
      }
      .account-type {
        font-size: 0.8rem;
        color: rgba(255, 255, 255, 0.9);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .bank-info-card__body {
        padding: 20px;
      }
      .info-row {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 16px 0;
        border-bottom: 1px solid rgba(15, 23, 42, 0.08);
      }
      .info-row:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }
      .info-row:first-child {
        padding-top: 0;
      }
      .info-label {
        font-size: 0.8rem;
        font-weight: 600;
        color: rgba(15, 23, 42, 0.6);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .info-value-group {
        display: flex;
        align-items: center;
        gap: 12px;
        background: rgba(37, 99, 235, 0.05);
        border: 1px solid rgba(37, 99, 235, 0.15);
        border-radius: 8px;
        padding: 12px 16px;
      }
      .bank-info-card--oxxo .info-value-group {
        background: rgba(220, 38, 38, 0.05);
        border-color: rgba(220, 38, 38, 0.15);
      }
      .info-value {
        flex: 1;
        font-size: 1.1rem;
        font-weight: 700;
        color: #0f172a;
        font-family: 'Courier New', monospace;
        letter-spacing: 0.05em;
      }
      .copy-btn {
        background: rgba(37, 99, 235, 0.1);
        border: 1px solid rgba(37, 99, 235, 0.2);
        border-radius: 6px;
        padding: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #2563eb;
      }
      .copy-btn:hover {
        background: rgba(37, 99, 235, 0.2);
        border-color: rgba(37, 99, 235, 0.3);
        transform: scale(1.05);
      }
      .copy-btn:active {
        transform: scale(0.95);
      }
      .bank-info-card--oxxo .copy-btn {
        background: rgba(220, 38, 38, 0.1);
        border-color: rgba(220, 38, 38, 0.2);
        color: #dc2626;
      }
      .bank-info-card--oxxo .copy-btn:hover {
        background: rgba(220, 38, 38, 0.2);
        border-color: rgba(220, 38, 38, 0.3);
      }
      .oxxo-instructions {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 16px;
        padding: 12px 16px;
        background: rgba(16, 185, 129, 0.08);
        border: 1px solid rgba(16, 185, 129, 0.2);
        border-radius: 8px;
        color: #059669;
        font-size: 0.9rem;
        font-weight: 600;
      }
      .oxxo-instructions :global(svg) {
        flex-shrink: 0;
      }
      .payment-instructions {
        display: flex;
        gap: 16px;
        background: rgba(59, 130, 246, 0.05);
        border: 1px solid rgba(59, 130, 246, 0.15);
        border-radius: 12px;
        padding: 20px;
        margin-top: 20px;
      }
      .payment-instructions :global(svg) {
        color: #3b82f6;
        flex-shrink: 0;
        margin-top: 2px;
      }
      .payment-instructions p {
        margin: 0 0 12px;
        font-size: 0.95rem;
        font-weight: 600;
        color: #0f172a;
      }
      .payment-instructions ol {
        margin: 0;
        padding-left: 20px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .payment-instructions li {
        font-size: 0.9rem;
        color: rgba(15, 23, 42, 0.75);
        line-height: 1.6;
      }
      @media (max-width: 640px) {
        .payment-details {
          padding: 20px 16px;
        }
        .bank-info-card__header {
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
        }
        .info-value {
          font-size: 0.95rem;
        }
        .payment-instructions {
          flex-direction: column;
          gap: 12px;
        }
      }
    `}</style>
  </>
);

export default PaymentStep;