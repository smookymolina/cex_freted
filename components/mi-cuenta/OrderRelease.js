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
  Download,
  Printer,
} from 'lucide-react';
import { generateOrderPDF, printOrderPDF, downloadOrderPDF } from '../../utils/pdfGenerator';

const METHOD_LABELS = {
  PHONE_PAYMENT: 'Pago telef\u00f3nico',
  BANK_TRANSFER: 'Transferencia bancaria',
  CONVENIENCE_STORE: 'Pago en tienda',
  CASH_DEPOSIT: 'Dep\u00f3sito en efectivo',
  STORE_PAYMENT: 'Pago en sucursal',
};

const FALLBACK_INSTRUCTIONS = {
  PHONE_PAYMENT: [
    'Agenda la llamada directamente con el ejecutivo asignado.',
    'Verifica referencia, monto y tarjeta antes de autorizar.',
    'Autoriza el cargo telef\u00f3nico y escucha la confirmaci\u00f3n durante la llamada.',
    'Sube el comprobante del cargo en Mis Pedidos para acelerar la confirmaci\u00f3n.',
    'Recibir\u00e1s la confirmaci\u00f3n final y podr\u00e1s continuar con el env\u00edo.',
  ],
  DEFAULT: [
    'Revisa que la referencia y el monto sean correctos.',
    'Utiliza \u00fanicamente los medios oficiales proporcionados.',
    'Conserva tu comprobante hasta recibir la confirmaci\u00f3n.',
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

  // Manejar descarga e impresión de PDF
  const handleDownloadPDF = () => {
    const orderData = {
      orderNumber,
      referenceNumber: orderReleaseData.referenceNumber,
      totalAmount: orderReleaseData.totalAmount,
      releasedAt: orderReleaseData.releasedAt || new Date().toISOString(),
      paymentData: orderReleaseData,
    };

    const pdfHTML = generateOrderPDF(orderData, paymentMethod);
    downloadOrderPDF(pdfHTML, orderNumber);
  };

  const handlePrintPDF = () => {
    const orderData = {
      orderNumber,
      referenceNumber: orderReleaseData.referenceNumber,
      totalAmount: orderReleaseData.totalAmount,
      releasedAt: orderReleaseData.releasedAt || new Date().toISOString(),
      paymentData: orderReleaseData,
    };

    const pdfHTML = generateOrderPDF(orderData, paymentMethod);
    printOrderPDF(pdfHTML, orderNumber);
  };

  const methodLabel = METHOD_LABELS[paymentMethod] || 'Pago autorizado';
  const instructions =
    orderReleaseData.instructions?.length > 0
      ? orderReleaseData.instructions
      : FALLBACK_INSTRUCTIONS[paymentMethod] || FALLBACK_INSTRUCTIONS.DEFAULT;
  const shouldRenderInstructions =
    paymentMethod !== 'PHONE_PAYMENT' && Array.isArray(instructions) && instructions.length > 0;

  const fallbackContactInfo = {
    contact: 'Lic. Marisol Herrera',
    phone: '55 7873 8515',
    whatsapp: '+52 1 55 7873 8515',
    email: 'marisol.herrera@cexfreted.com',
    schedule: 'Lunes a Viernes: 9:00 AM - 8:00 PM | Sabados: 10:00 AM - 2:00 PM',
  };

  const rawContactInfo = orderReleaseData.contactInfo || {};
  const hasContactData = Object.keys(rawContactInfo).length > 0;
  const contactName = rawContactInfo.contact || fallbackContactInfo.contact;
  const contactPhone = (() => {
    const value = rawContactInfo.phone ? String(rawContactInfo.phone) : '';
    if (!value) return fallbackContactInfo.phone;
    if (/01-800|CEX|239-7246/i.test(value)) {
      return fallbackContactInfo.phone;
    }
    return value;
  })();
  const contactWhatsapp = rawContactInfo.whatsapp || fallbackContactInfo.whatsapp;
  const contactEmail = rawContactInfo.email || fallbackContactInfo.email;
  const contactSchedule = rawContactInfo.schedule || fallbackContactInfo.schedule;
  const shouldShowContact = hasContactData || paymentMethod === 'PHONE_PAYMENT';

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
            {orderReleaseData.description || 'Completa tu pago siguiendo las instrucciones de este m\u00f3dulo.'}
          </p>
        </div>
        <span className="release-chip">{methodLabel}</span>
      </header>

      {/* Botones de descarga e impresión */}
      <div className="release-actions">
        <button
          type="button"
          onClick={handleDownloadPDF}
          className="release-action-btn release-action-btn--primary"
          aria-label="Descargar orden de compra en PDF"
        >
          <Download size={18} />
          <span>Descargar PDF</span>
        </button>
        <button
          type="button"
          onClick={handlePrintPDF}
          className="release-action-btn release-action-btn--secondary"
          aria-label="Imprimir orden de compra"
        >
          <Printer size={18} />
          <span>Imprimir</span>
        </button>
      </div>

      <div className="release-stats">
        {renderCopyField('N\u00famero de referencia', orderReleaseData.referenceNumber, 'reference')}
        <div className="release-stat">
          <p className="release-stat__label">Monto a pagar</p>
          <p className="release-amount">{formatCurrency(orderReleaseData.totalAmount)}</p>
        </div>
      </div>

      {shouldRenderInstructions && (
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
      )}

      {shouldShowContact && (
        <div className="release-section">
          <div className="release-section__head">
            <Phone size={18} />
            <h4>Informaci\u00f3n de contacto</h4>
          </div>
          <div className="release-contact">
            <div>
              <p className="release-contact__label">Ejecutivo asignado</p>
              <p className="release-contact__value">{contactName}</p>
              <p className="release-contact__sub">Especialista de pagos telef\u00f3nicos</p>
            </div>
            <div>
              <p className="release-contact__label">Tel\u00e9fono directo</p>
              <p className="release-contact__value">{contactPhone}</p>
              {contactWhatsapp && <p className="release-contact__sub">WhatsApp: {contactWhatsapp}</p>}
            </div>
            {contactSchedule && (
              <div>
                <p className="release-contact__label">Horario</p>
                <p className="release-contact__value">{contactSchedule}</p>
              </div>
            )}
            {contactEmail && (
              <div>
                <p className="release-contact__label">Correo</p>
                <p className="release-contact__value">{contactEmail}</p>
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
                  <div>
                    <h5>{account.bank}</h5>
                    {account.accountTitle && <span className="account-title-text">{account.accountTitle}</span>}
                    <span>{account.accountHolder}</span>
                  </div>
                  {account.bankLogo && (
                    <img
                      src={account.bankLogo}
                      alt={`Logo ${account.bank}`}
                      className="bank-logo"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                </header>
                <div className="bank-card__fields">
                  {account.accountNumber &&
                    renderCopyField('Cuenta', account.accountNumber, `account-${index}`)}
                  {account.clabe && renderCopyField('CLABE', account.clabe, `clabe-${index}`)}
                  {account.clabeInterbancaria &&
                    renderCopyField('CLABE Interbancaria', account.clabeInterbancaria, `clabe-inter-${index}`)}
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
              typeof store === 'object' && store.logo ? (
                <div key={index} className="store-logo-badge">
                  <img
                    src={store.logo}
                    alt={store.name}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'inline';
                    }}
                  />
                  <span style={{ display: 'none' }}>{store.name}</span>
                </div>
              ) : (
                <span key={index} className="release-chip release-chip--light">
                  {typeof store === 'object' ? store.name : store}
                </span>
              )
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
          border: 2px solid rgba(16, 185, 129, 0.25);
          border-radius: 24px;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.06), rgba(59, 130, 246, 0.03), rgba(255, 255, 255, 0.98));
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 28px;
          box-shadow: 0 12px 32px rgba(16, 185, 129, 0.12), 0 4px 12px rgba(15, 23, 42, 0.06);
          position: relative;
          overflow: hidden;
        }

        .release-card::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .release-hero {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          gap: 20px;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .release-hero__icon {
          width: 72px;
          height: 72px;
          border-radius: 20px;
          background: linear-gradient(135deg, #10b981, #059669);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 12px 28px rgba(16, 185, 129, 0.4), 0 4px 12px rgba(16, 185, 129, 0.2);
          transition: transform 0.3s ease;
        }

        .release-hero__icon:hover {
          transform: scale(1.05) rotate(5deg);
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
          gap: 20px;
          position: relative;
          z-index: 1;
        }

        .release-stat {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.9));
          border-radius: 18px;
          padding: 20px;
          border: 2px solid rgba(37, 99, 235, 0.15);
          display: flex;
          flex-direction: column;
          gap: 12px;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.06);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .release-stat::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, #2563eb, #0ea5e9);
        }

        .release-stat:hover {
          border-color: rgba(37, 99, 235, 0.3);
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(37, 99, 235, 0.12);
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
          border: 2px solid rgba(37, 99, 235, 0.2);
          border-radius: 12px;
          padding: 8px;
          background: linear-gradient(135deg, rgba(248, 250, 252, 0.9), white);
          color: #2563eb;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.08);
        }

        .release-copy:hover {
          border-color: rgba(37, 99, 235, 0.4);
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(248, 250, 252, 0.95));
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
        }

        .release-copy--active {
          border-color: rgba(16, 185, 129, 0.5);
          color: #059669;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.08));
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
          animation: copySuccess 0.3s ease;
        }

        @keyframes copySuccess {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }

        .release-section {
          background: linear-gradient(135deg, #ffffff, rgba(248, 250, 252, 0.8));
          border-radius: 20px;
          padding: 24px;
          border: 2px solid rgba(148, 163, 184, 0.15);
          display: flex;
          flex-direction: column;
          gap: 18px;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.05);
          transition: all 0.3s ease;
        }

        .release-section:hover {
          border-color: rgba(37, 99, 235, 0.2);
          box-shadow: 0 8px 24px rgba(37, 99, 235, 0.08);
        }

        .release-section__head {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #2563eb;
          padding-bottom: 12px;
          border-bottom: 2px solid rgba(37, 99, 235, 0.1);
        }

        .release-section__head h4 {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
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

        .release-contact__sub {
          margin: 2px 0 0;
          font-size: 12px;
          color: rgba(15, 23, 42, 0.6);
        }

        .release-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
        }

        .store-logo-badge {
          background: #ffffff;
          border: 2px solid rgba(37, 99, 235, 0.15);
          border-radius: 12px;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 100px;
          min-height: 60px;
        }

        .store-logo-badge img {
          max-height: 40px;
          max-width: 100px;
          object-fit: contain;
        }

        .release-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
        }

        .bank-card,
        .store-card {
          border: 2px solid transparent;
          border-radius: 20px;
          padding: 24px;
          background: linear-gradient(135deg, #ffffff, #f8fafc);
          display: flex;
          flex-direction: column;
          gap: 16px;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08), 0 2px 8px rgba(15, 23, 42, 0.04);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .bank-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: linear-gradient(90deg, #2563eb, #1d4ed8, #0ea5e9);
          border-radius: 20px 20px 0 0;
        }

        .bank-card:hover,
        .store-card:hover {
          border-color: rgba(37, 99, 235, 0.3);
          box-shadow: 0 12px 36px rgba(37, 99, 235, 0.15), 0 4px 12px rgba(37, 99, 235, 0.08);
          transform: translateY(-4px);
        }

        .bank-card header {
          padding-top: 8px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 15px;
        }

        .bank-logo {
          max-height: 50px;
          max-width: 120px;
          object-fit: contain;
        }

        .bank-card header h5,
        .store-card h5 {
          margin: 0 0 6px;
          font-size: 20px;
          font-weight: 700;
          color: #0f172a;
          background: linear-gradient(135deg, #2563eb, #0ea5e9);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .bank-card header span {
          font-size: 14px;
          color: rgba(15, 23, 42, 0.6);
          font-weight: 500;
          display: block;
          margin-top: 4px;
        }

        .account-title-text {
          font-size: 13px;
          color: #3b82f6 !important;
          font-weight: 600 !important;
          margin-top: 2px !important;
        }

        .bank-card__fields {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .bank-card__fields .release-stat {
          background: linear-gradient(135deg, rgba(248, 250, 252, 0.8), rgba(255, 255, 255, 0.95));
          border: 2px solid rgba(37, 99, 235, 0.15);
          padding: 16px;
          border-radius: 14px;
          transition: all 0.2s ease;
        }

        .bank-card__fields .release-stat:hover {
          border-color: rgba(37, 99, 235, 0.3);
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(255, 255, 255, 0.98));
          transform: translateX(4px);
        }

        .bank-card__fields .release-stat__value {
          font-size: 17px;
          font-weight: 700;
          color: #0f172a;
          font-family: 'Courier New', monospace;
          letter-spacing: 0.02em;
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
          background: linear-gradient(135deg, rgba(251, 191, 36, 0.12), rgba(245, 158, 11, 0.08));
          border: 2px solid rgba(245, 158, 11, 0.35);
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 16px rgba(245, 158, 11, 0.1);
          position: relative;
          overflow: hidden;
        }

        .release-notes::before {
          content: '⚠';
          position: absolute;
          top: -20px;
          right: -20px;
          font-size: 120px;
          opacity: 0.05;
          transform: rotate(15deg);
        }

        .release-notes .release-section__head {
          color: #92400e;
          padding-bottom: 12px;
          border-bottom: 2px solid rgba(245, 158, 11, 0.2);
          margin-bottom: 16px;
        }

        .release-notes ul {
          margin: 0;
          padding-left: 0;
          list-style: none;
          color: #92400e;
          display: flex;
          flex-direction: column;
          gap: 10px;
          font-size: 14px;
          font-weight: 500;
          position: relative;
        }

        .release-notes li {
          padding-left: 28px;
          position: relative;
          line-height: 1.6;
        }

        .release-notes li::before {
          content: '•';
          position: absolute;
          left: 8px;
          color: #f59e0b;
          font-size: 20px;
          font-weight: 700;
        }

        /* Botones de acción */
        .release-actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px;
          position: relative;
          z-index: 1;
        }

        .release-action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px 24px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
        }

        .release-action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.15);
        }

        .release-action-btn:active {
          transform: translateY(0);
        }

        .release-action-btn--primary {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
        }

        .release-action-btn--primary:hover {
          background: linear-gradient(135deg, #1d4ed8, #1e40af);
        }

        .release-action-btn--secondary {
          background: linear-gradient(135deg, #ffffff, rgba(248, 250, 252, 0.9));
          color: #2563eb;
          border: 2px solid rgba(37, 99, 235, 0.2);
        }

        .release-action-btn--secondary:hover {
          border-color: rgba(37, 99, 235, 0.4);
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(248, 250, 252, 0.95));
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

          .release-actions {
            grid-template-columns: 1fr;
          }

          .release-action-btn {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
