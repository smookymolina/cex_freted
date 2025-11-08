import { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Phone,
  Building2,
  ShoppingCart,
  Banknote,
  Store,
  AlertCircle,
  MapPin,
  Clock,
  CreditCard,
} from 'lucide-react';

const METHOD_LABELS = {
  PHONE_PAYMENT: 'Pago telefónico',
  BANK_TRANSFER: 'Transferencia bancaria',
  CONVENIENCE_STORE: 'Pago en tienda',
  CASH_DEPOSIT: 'Depósito en efectivo',
  STORE_PAYMENT: 'Pago en sucursal',
};

const FALLBACK_INSTRUCTIONS = {
  PHONE_PAYMENT: [
    'Llama al número telefónico proporcionado.',
    'Ten a la mano tu tarjeta de crédito o débito.',
    'Proporciona el número de referencia al ejecutivo.',
    'El asesor procesará el cobro de forma segura.',
    'Recibirás un correo de confirmación inmediata.',
    'No es necesario subir comprobante adicional.',
  ],
  DEFAULT: [
    'Revisa que la referencia y el monto sean correctos.',
    'Utiliza únicamente los medios oficiales proporcionados.',
    'Conserva tu comprobante hasta recibir la confirmación.',
    'Si tienes dudas contacta a nuestro equipo de soporte.',
  ],
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(Number(value) || 0);

export default function OrderRelease({ orderReleaseData, paymentMethod, orderNumber }) {
  const [copiedField, setCopiedField] = useState(null);

  if (!orderReleaseData) return null;

  const methodLabel = METHOD_LABELS[paymentMethod] || 'Pago autorizado';
  const instructions =
    orderReleaseData.instructions?.length > 0
      ? orderReleaseData.instructions
      : FALLBACK_INSTRUCTIONS[paymentMethod] || FALLBACK_INSTRUCTIONS.DEFAULT;

  const copyToClipboard = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 1600);
  };

  const getMethodIcon = () => {
    switch (paymentMethod) {
      case 'PHONE_PAYMENT':
        return <Phone size={22} />;
      case 'BANK_TRANSFER':
        return <Building2 size={22} />;
      case 'CONVENIENCE_STORE':
        return <ShoppingCart size={22} />;
      case 'CASH_DEPOSIT':
        return <Banknote size={22} />;
      case 'STORE_PAYMENT':
        return <Store size={22} />;
      default:
        return <CreditCard size={22} />;
    }
  };

  const renderCopyField = (label, value, fieldKey) => (
    <div className="release-stat">
      <p className="release-stat__label">{label}</p>
      <div className="release-stat__value">
        <span>{value || 'No disponible'}</span>
        {value && (
          <button
            type="button"
            onClick={() => copyToClipboard(value, fieldKey)}
            className={`release-copy ${copiedField === fieldKey ? 'release-copy--active' : ''}`}
            aria-label={`Copiar ${label}`}
          >
            {copiedField === fieldKey ? <CheckCircle2 size={16} /> : <Copy size={16} />}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <section className="release-card" aria-label="Orden de compra liberada">
      <header className="release-hero">
        <div className="release-hero__icon" aria-hidden="true">
          {getMethodIcon()}
        </div>
        <div>
          <p className="release-hero__eyebrow">Orden de compra #{orderNumber || 'N/A'}</p>
          <h3 className="release-hero__title">{orderReleaseData.title || 'Pago autorizado'}</h3>
          <p className="release-hero__subtitle">
            {orderReleaseData.description || 'Completa tu pago siguiendo las instrucciones de este módulo.'}
          </p>
        </div>
        <span className="release-chip">{methodLabel}</span>
      </header>

      <div className="release-stats">
        {renderCopyField('Número de referencia', orderReleaseData.referenceNumber, 'reference')}
        <div className="release-stat">
          <p className="release-stat__label">Monto a pagar</p>
          <p className="release-amount">{formatCurrency(orderReleaseData.totalAmount)}</p>
        </div>
      </div>

      <div className="release-section">
        <div className="release-section__head">
          <AlertCircle size={18} />
          <h4>Instrucciones de pago</h4>
        </div>
        <ol className="release-steps">
          {instructions.map((instruction, index) => (
            <li key={index}>
              <span>{index + 1}.</span>
              <p>{instruction}</p>
            </li>
          ))}
        </ol>
      </div>

      {orderReleaseData.contactInfo && (
        <div className="release-section">
          <div className="release-section__head">
            <Phone size={18} />
            <h4>Información de contacto</h4>
          </div>
          <div className="release-contact">
            {orderReleaseData.contactInfo.phone && (
              <div>
                <p className="release-contact__label">Teléfono</p>
                <p className="release-contact__value">{orderReleaseData.contactInfo.phone}</p>
              </div>
            )}
            {orderReleaseData.contactInfo.schedule && (
              <div>
                <p className="release-contact__label">Horario</p>
                <p className="release-contact__value">{orderReleaseData.contactInfo.schedule}</p>
              </div>
            )}
          </div>

          {orderReleaseData.acceptedCards?.length > 0 && (
            <>
              <p className="release-contact__label">Tarjetas aceptadas</p>
              <div className="release-chips">
                {orderReleaseData.acceptedCards.map((card, index) => (
                  <span key={index} className="release-chip release-chip--light">
                    {card}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {orderReleaseData.accounts?.length > 0 && (
        <div className="release-section">
          <div className="release-section__head">
            <Building2 size={18} />
            <h4>Datos bancarios</h4>
          </div>
          <div className="release-cards">
            {orderReleaseData.accounts.map((account, index) => (
              <article key={index} className="bank-card">
                <header>
                  <h5>{account.bank}</h5>
                  <span>{account.accountHolder}</span>
                </header>
                <div className="bank-card__fields">
                  {account.accountNumber &&
                    renderCopyField('Cuenta', account.accountNumber, `account-${index}`)}
                  {account.clabe && renderCopyField('CLABE', account.clabe, `clabe-${index}`)}
                  {account.cardNumber &&
                    renderCopyField('Tarjeta', account.cardNumber, `card-${index}`)}
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {orderReleaseData.stores?.length > 0 && (
        <div className="release-section">
          <div className="release-section__head">
            <Store size={18} />
            <h4>Sucursales disponibles</h4>
          </div>
          <div className="release-cards">
            {orderReleaseData.stores.map((store, index) => (
              <article key={index} className="store-card">
                <h5>{store.name}</h5>
                <div className="store-row">
                  <MapPin size={16} />
                  <div>
                    <p>{store.address}</p>
                    <p>{store.city}</p>
                  </div>
                </div>
                {store.phone && (
                  <div className="store-row">
                    <Phone size={16} />
                    <p>{store.phone}</p>
                  </div>
                )}
                {store.schedule && (
                  <div className="store-row">
                    <Clock size={16} />
                    <p>{store.schedule}</p>
                  </div>
                )}
                {store.parking && <p className="store-highlight">Estacionamiento disponible</p>}
              </article>
            ))}
          </div>
        </div>
      )}

      {orderReleaseData.convenientStores?.length > 0 && (
        <div className="release-section">
          <div className="release-section__head">
            <ShoppingCart size={18} />
            <h4>Establecimientos aliados</h4>
          </div>
          <div className="release-chips">
            {orderReleaseData.convenientStores.map((store, index) => (
              <span key={index} className="release-chip release-chip--light">
                {store}
              </span>
            ))}
          </div>
        </div>
      )}

      {orderReleaseData.importantNotes?.length > 0 && (
        <div className="release-notes">
          <div className="release-section__head">
            <AlertCircle size={18} />
            <h4>Notas importantes</h4>
          </div>
          <ul>
            {orderReleaseData.importantNotes.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </div>
      )}

      <style jsx>{`
        .release-card {
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(59, 130, 246, 0.04));
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .release-hero {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          gap: 18px;
          align-items: center;
        }

        .release-hero__icon {
          width: 60px;
          height: 60px;
          border-radius: 18px;
          background: #10b981;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 15px 35px rgba(16, 185, 129, 0.35);
        }

        .release-hero__eyebrow {
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 0.1em;
          color: rgba(15, 23, 42, 0.6);
          margin: 0 0 4px;
        }

        .release-hero__title {
          margin: 0;
          font-size: 22px;
          color: #064e3b;
        }

        .release-hero__subtitle {
          margin: 6px 0 0;
          color: rgba(15, 23, 42, 0.75);
          font-size: 14px;
        }

        .release-chip {
          border-radius: 999px;
          padding: 10px 18px;
          font-size: 13px;
          font-weight: 600;
          color: #065f46;
          background: rgba(16, 185, 129, 0.15);
          justify-self: flex-start;
        }

        .release-chip--light {
          background: rgba(37, 99, 235, 0.08);
          color: #1d4ed8;
          font-weight: 600;
        }

        .release-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 18px;
        }

        .release-stat {
          background: white;
          border-radius: 16px;
          padding: 16px 18px;
          border: 1px solid rgba(148, 163, 184, 0.3);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .release-stat__label {
          margin: 0;
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 0.08em;
          color: rgba(15, 23, 42, 0.6);
        }

        .release-stat__value {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          font-size: 18px;
          font-weight: 700;
          color: #065f46;
          word-break: break-all;
        }

        .release-amount {
          margin: 0;
          font-size: 26px;
          font-weight: 700;
          color: #0f172a;
        }

        .release-copy {
          border: 1px solid rgba(148, 163, 184, 0.4);
          border-radius: 10px;
          padding: 6px;
          background: white;
          color: #475569;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .release-copy--active {
          border-color: rgba(16, 185, 129, 0.5);
          color: #059669;
          background: rgba(16, 185, 129, 0.12);
        }

        .release-section {
          background: white;
          border-radius: 18px;
          padding: 20px 22px;
          border: 1px solid rgba(148, 163, 184, 0.25);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .release-section__head {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #0f172a;
        }

        .release-section__head h4 {
          margin: 0;
          font-size: 16px;
          font-weight: 700;
        }

        .release-steps {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .release-steps li {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          padding: 10px 12px;
          border-radius: 12px;
          background: rgba(15, 23, 42, 0.03);
          border: 1px solid rgba(148, 163, 184, 0.2);
        }

        .release-steps span {
          font-weight: 700;
          color: #059669;
        }

        .release-steps p {
          margin: 0;
          color: rgba(15, 23, 42, 0.8);
          font-size: 14px;
        }

        .release-contact {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
        }

        .release-contact__label {
          margin: 0;
          font-size: 12px;
          color: rgba(15, 23, 42, 0.6);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .release-contact__value {
          margin: 4px 0 0;
          font-size: 16px;
          font-weight: 600;
          color: #0f172a;
        }

        .release-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .release-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
        }

        .bank-card,
        .store-card {
          border: 1px solid rgba(148, 163, 184, 0.25);
          border-radius: 16px;
          padding: 16px;
          background: rgba(248, 250, 252, 0.9);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .bank-card header h5,
        .store-card h5 {
          margin: 0;
          font-size: 16px;
          color: #0f172a;
        }

        .bank-card header span {
          font-size: 13px;
          color: rgba(15, 23, 42, 0.7);
        }

        .bank-card__fields {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .bank-card__fields .release-stat {
          background: rgba(255, 255, 255, 0.92);
          border: 1px dashed rgba(148, 163, 184, 0.4);
          padding: 12px;
        }

        .bank-card__fields .release-stat__value {
          font-size: 16px;
          color: #0f172a;
        }

        .store-row {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          color: rgba(15, 23, 42, 0.8);
          font-size: 14px;
        }

        .store-row svg {
          color: #0ea5e9;
          margin-top: 2px;
        }

        .store-highlight {
          margin: 0;
          font-size: 13px;
          color: #0f766e;
          font-weight: 600;
        }

        .release-notes {
          background: rgba(253, 230, 138, 0.25);
          border: 1px solid rgba(250, 204, 21, 0.5);
          border-radius: 18px;
          padding: 20px 22px;
        }

        .release-notes ul {
          margin: 12px 0 0;
          padding-left: 18px;
          color: #92400e;
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 14px;
        }

        @media (max-width: 720px) {
          .release-card {
            padding: 22px;
          }

          .release-hero {
            grid-template-columns: minmax(0, 1fr);
          }

          .release-chip {
            justify-self: stretch;
            text-align: center;
          }
        }
      `}</style>
    </section>
  );
}
