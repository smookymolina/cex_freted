import React from 'react';
import { Phone, Building2, MapPin, Copy, CheckCircle, MessageCircle } from 'lucide-react';

const CONTACT_NUMBERS = [
  {
    zone: 'Zona Norte',
    contact: 'Lic. Claudia Pacheco',
    phone: '5578752671',
    phoneFormatted: '55 7875 2671',
    whatsapp: '5215578752671'
  },
  {
    zone: 'Zona CDMX',
    contact: 'Luis Aguilar',
    phone: '5637529427',
    phoneFormatted: '56 3752 9427',
    whatsapp: '5215637529427'
  },
  {
    zone: 'Zona Sur',
    contact: 'Lic. Marisol Herrera',
    phone: '5578738515',
    phoneFormatted: '55 7873 8515',
    whatsapp: '5215578738515'
  },
];

const CONVENIENCE_STORES = [
  {
    name: 'Oxxo',
    description: 'Más de 20,000 tiendas en todo México',
    commission: 'Sin comisión',
    logo: '🏪',
  },
  {
    name: '7-Eleven',
    description: 'Disponible 24/7 en más de 2,000 ubicaciones',
    commission: 'Sin comisión',
    logo: '🏬',
  },
  {
    name: 'Soriana',
    description: 'En todas las tiendas Soriana del país',
    commission: 'Sin comisión',
    logo: '🛙',
  },
  {
    name: 'Walmart',
    description: 'Cajas de servicio en tiendas Walmart',
    commission: 'Sin comisión',
    logo: '🏪',
  },
  {
    name: 'Bodega Aurrerá',
    description: 'Red de tiendas en toda la república',
    commission: 'Sin comisión',
    logo: '🏬',
  },
];

const PaymentInstructions = ({ paymentMethod, orderNumber, paymentReference, total }) => {
  const [copiedText, setCopiedText] = React.useState('');
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    // Detectar si el usuario está en móvil
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      setIsMobile(mobile);
    };
    checkMobile();
  }, []);

  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(''), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const CopyButton = ({ text, label }) => (
    <button
      type="button"
      className="copy-button"
      onClick={() => copyToClipboard(text, label)}
      title="Copiar"
    >
      {copiedText === label ? <CheckCircle size={16} /> : <Copy size={16} />}
    </button>
  );

  const ContactList = ({ heading }) => {
    const referenceText = paymentReference || 'Por asignar';
    const orderLabel = orderNumber || 'Pendiente';
    return (
      <div className="contacts">
        {heading && <h4>{heading}</h4>}
        {CONTACT_NUMBERS.map((contact) => (
          <div key={contact.zone} className="contact-card">
            <div className="contact-info">
              <strong className="zone-name">{contact.zone}</strong>
              <span className="contact-name">{contact.contact}</span>
              <span className="contact-phone">{contact.phoneFormatted}</span>
            </div>
            <div className="contact-actions">
              <a href={`tel:${contact.phone}`} className="action-button action-button--call" title="Llamar ahora">
                <Phone size={18} />
                Llamar
              </a>
              <a
                href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(
                  `Hola, necesito confirmar mi pago. Mi numero de orden es: ${orderLabel} y mi referencia de pago es: ${referenceText}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="action-button action-button--whatsapp"
                title="Enviar WhatsApp"
              >
                <MessageCircle size={18} />
                WhatsApp
              </a>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderInstructions = () => {
    switch (paymentMethod) {
      case 'PHONE_PAYMENT':
        return (
          <div className="instructions">
            <div className="instructions__header">
              <Phone size={32} />
              <div>
                <h3>Confirma tu pago por teléfono</h3>
                <p>
                  Para finalizar la compra, comunícate con nuestro equipo y proporciona tu
                  referencia de pago.
                </p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-row">
                <span className="info-label">Número de Orden:</span>
                <div className="info-value">
                  <strong>{orderNumber}</strong>
                  <CopyButton text={orderNumber} label="order" />
                </div>
              </div>
              <div className="info-row">
                <span className="info-label">Referencia de Pago:</span>
                <div className="info-value">
                  <strong>{paymentReference}</strong>
                  <CopyButton text={paymentReference} label="reference" />
                </div>
              </div>
              <div className="info-row">
                <span className="info-label">Total a Pagar:</span>
                <div className="info-value">
                  <strong className="total-amount">${total.toLocaleString('es-MX')}</strong>
                </div>
              </div>
            </div>

            <ContactList heading="Selecciona tu zona para contactar:" />



            {isMobile && (
              <div className="mobile-tip">
                <Phone size={20} />
                <div>
                  <strong>¡Estás en un dispositivo móvil!</strong>
                  <p>
                    Toca el botón "Llamar" para marcar directamente o usa WhatsApp para un
                    contacto rápido con tu información precargada.
                  </p>
                </div>
              </div>
            )}

            <div className="alert">
              Tu pedido quedará reservado durante <strong>24 horas</strong> mientras confirmamos
              el pago telefónico.
            </div>
          </div>
        );

      case 'BANK_TRANSFER':
      case 'CASH_DEPOSIT': {
        const hasReference = paymentReference && paymentReference !== 'Por asignar';
        const referenceLabel = hasReference
          ? paymentReference
          : 'Se compartira durante la llamada de verificacion';
        return (
          <div className="instructions">
            <div className="instructions__header">
              <Building2 size={32} />
              <div>
                <h3>
                  {paymentMethod === 'BANK_TRANSFER'
                    ? 'Coordinamos tu transferencia bancaria'
                    : 'Deposito en efectivo acompanado'}
                </h3>
                <p>
                  Nuestro equipo de soporte te llamara para darte la cuenta directa del vendedor que enviara tu pedido.
                  El dinero llega a vendedores certificados y no usamos intermediarios.
                </p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-row">
                <span className="info-label">Nǧmero de Orden:</span>
                <div className="info-value">
                  <strong>{orderNumber}</strong>
                  <CopyButton text={orderNumber} label="order" />
                </div>
              </div>
              <div className="info-row">
                <span className="info-label">Referencia de Pago:</span>
                <div className="info-value">
                  <strong>{referenceLabel}</strong>
                  {hasReference && <CopyButton text={paymentReference} label="reference" />}
                </div>
              </div>
              <div className="info-row">
                <span className="info-label">Total a Pagar:</span>
                <div className="info-value">
                  <strong className="total-amount">${total.toLocaleString('es-MX')}</strong>
                </div>
              </div>
            </div>

            <div className="trust-callout">
              <strong>Pago directo al vendedor</strong>
              <p>
                Validamos tu orden por telefono porque no usamos intermediarios. El asesor confirma tu numero de orden,
                monto y te entrega la cuenta oficial del vendedor.
              </p>
            </div>

            <div className="call-flow">
              <div className="call-step">
                <span className="call-step__index">1</span>
                <div>
                  <strong>Recibe la llamada certificada</strong>
                  <p>En menos de 10 minutos te marcamos desde uno de nuestros numeros oficiales para confirmar tu pedido.</p>
                </div>
              </div>
              <div className="call-step">
                <span className="call-step__index">2</span>
                <div>
                  <strong>Obtienes la cuenta del vendedor</strong>
                  <p>El asesor explica que el dinero va directo al vendedor y te comparte la cuenta o referencia unica.</p>
                </div>
              </div>
              <div className="call-step">
                <span className="call-step__index">3</span>
                <div>
                  <strong>Deposita y envia tu comprobante</strong>
                  <p>Realiza la transferencia solo con los datos confirmados y envia el comprobante para liberar tu equipo.</p>
                </div>
              </div>
            </div>

            <ContactList heading="Numeros oficiales que pueden llamarte:" />

            <div className="alert">
              <strong>Si no recibes la llamada:</strong> marca al numero de tu zona o escribe a{' '}
              <a href="mailto:pagos@sociedadtecnologia.com">pagos@sociedadtecnologia.com</a> con tu nǧmero de orden{' '}
              <strong>{orderNumber}</strong> para forzar la verificacion.
            </div>
          </div>
        );
      }

      case 'CONVENIENCE_STORE': {
        const hasReference = paymentReference && paymentReference !== 'Por asignar';
        const referenceLabel = hasReference
          ? paymentReference
          : 'Se generara durante la llamada de verificacion';
        return (
          <div className="instructions">
            <div className="instructions__header instructions__header--convenience">
              <div className="header-icon-wrapper">
                <MapPin size={32} />
              </div>
              <div>
                <h3>Paga en tiendas de autoservicio</h3>
                <p>Generamos tu referencia durante una llamada de soporte para que pagues directo al vendedor sin intermediarios.</p>
              </div>
            </div>

            <div className="trust-callout trust-callout--light">
              <strong>Acompanamiento personalizado</strong>
              <p>Un asesor te explica que el dinero lo reciben vendedores certificados y comparte la referencia oficial de pago en tienda.</p>
            </div>

            <div className="info-card info-card--premium">
              <div className="info-row">
                <span className="info-label">Nǧmero de Orden:</span>
                <div className="info-value">
                  <strong>{orderNumber}</strong>
                  <CopyButton text={orderNumber} label="order" />
                </div>
              </div>
              <div className="info-row">
                <span className="info-label">Referencia de Pago:</span>
                <div className="info-value">
                  <strong>{referenceLabel}</strong>
                  {hasReference && <CopyButton text={paymentReference} label="reference" />}
                </div>
              </div>
              <div className="info-row">
                <span className="info-label">Total a Pagar:</span>
                <div className="info-value">
                  <strong className="total-amount">${total.toLocaleString('es-MX')}</strong>
                </div>
              </div>
            </div>

            <ContactList heading="Numeros oficiales que generaran tu referencia:" />

            <div className="convenience-container">
              <div className="section-header">
                <h4>Tiendas participantes</h4>
                <span className="badge-available">Disponible ahora</span>
              </div>

              <div className="convenience-grid">
                {CONVENIENCE_STORES.map((store, index) => (
                  <div key={index} className="convenience-card">
                    <div className="convenience-card__header">
                      <span className="store-logo">{store.logo}</span>
                      <div className="store-badge">{store.commission}</div>
                    </div>
                    <h5 className="store-name">{store.name}</h5>
                    <p className="store-description">{store.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="payment-steps">
              <h4 className="steps-title">Pasos para confirmar tu pago</h4>
              <div className="steps-list">
                <div className="step-item">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <strong>Recibe la llamada de soporte</strong>
                    <p>Tu asesor genera la referencia y te recuerda que el dinero va directo al vendedor.</p>
                  </div>
                </div>
                <div className="step-item">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <strong>Valida al asesor</strong>
                    <p>Debe confirmar tu numero de orden, monto y tienda antes de compartir la referencia.</p>
                  </div>
                </div>
                <div className="step-item">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <strong>Acude y paga con la referencia oficial</strong>
                    <p>Presenta la referencia que recibiste y paga <strong>${total.toLocaleString('es-MX')}</strong> en efectivo.</p>
                  </div>
                </div>
                <div className="step-item">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <strong>Envia tu comprobante</strong>
                    <p>Comparte una foto del ticket para liberar tu pedido en minutos habiles.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="alert alert--warning">
              <strong>No pagues sin tu referencia oficial.</strong> Te llamaremos en minutos y la referencia permanece vigente 48 horas.
              Despues del pago, la confirmacion tarda hasta 15 minutos.
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="payment-instructions">
      {renderInstructions()}

      <style jsx>{`
        .payment-instructions {
          margin-top: 24px;
        }

        .instructions {
          display: grid;
          gap: 20px;
        }

        .instructions__header {
          display: flex;
          gap: 16px;
          align-items: flex-start;
          padding-bottom: 16px;
          border-bottom: 2px solid rgba(15, 23, 42, 0.1);
        }

        .instructions__header svg {
          color: #2563eb;
          flex-shrink: 0;
        }

        .instructions__header h3 {
          margin: 0;
          font-size: 1.3rem;
          color: #0f172a;
        }

        .instructions__header p {
          margin: 6px 0 0;
          color: rgba(15, 23, 42, 0.7);
        }

        .info-card {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(14, 165, 233, 0.06));
          border: 1px solid rgba(37, 99, 235, 0.2);
          border-radius: 12px;
          padding: 20px;
          display: grid;
          gap: 14px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }

        .info-label {
          font-size: 0.9rem;
          color: rgba(15, 23, 42, 0.7);
        }

        .info-value {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1rem;
        }

        .total-amount {
          font-size: 1.3rem;
          color: #2563eb;
        }

        .copy-button {
          padding: 6px;
          border: none;
          background: rgba(37, 99, 235, 0.1);
          color: #2563eb;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .copy-button:hover {
          background: rgba(37, 99, 235, 0.2);
        }

        .contacts {
          display: grid;
          gap: 12px;
        }

        .contacts h4 {
          margin: 0 0 8px;
          font-size: 1.05rem;
          font-weight: 700;
          color: #0f172a;
        }

        .contact-card {
          background: #fff;
          border: 2px solid rgba(15, 23, 42, 0.1);
          border-radius: 12px;
          padding: 20px;
          transition: all 0.2s ease;
        }

        .contact-card:hover {
          border-color: rgba(37, 99, 235, 0.3);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .trust-callout {
          padding: 18px 20px;
          border-radius: 16px;
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.3);
          line-height: 1.6;
          font-size: 0.95rem;
          color: rgba(15, 23, 42, 0.85);
        }

        .trust-callout strong {
          display: block;
          font-size: 1rem;
          margin-bottom: 6px;
          color: #0f172a;
        }

        .trust-callout--light {
          background: rgba(37, 99, 235, 0.06);
          border-color: rgba(37, 99, 235, 0.25);
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 16px;
        }

        .zone-name {
          font-size: 1.1rem;
          font-weight: 700;
          color: #2563eb;
        }

        .contact-name {
          font-size: 0.9rem;
          color: rgba(15, 23, 42, 0.75);
          font-weight: 500;
        }

        .contact-phone {
          font-size: 1rem;
          font-weight: 600;
          color: #0f172a;
          font-family: 'Courier New', monospace;
        }

        .contact-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .action-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .action-button--call {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: #fff;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);
        }

        .action-button--call:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
        }

        .action-button--whatsapp {
          background: linear-gradient(135deg, #10b981, #059669);
          color: #fff;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.25);
        }

        .action-button--whatsapp:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.35);
        }

        .action-button:active {
          transform: translateY(0);
        }

        .call-flow {
          display: grid;
          gap: 12px;
        }

        .call-step {
          display: flex;
          gap: 14px;
          align-items: flex-start;
          padding: 14px 16px;
          border: 1px solid rgba(15, 23, 42, 0.08);
          border-radius: 14px;
          background: #fff;
        }

        .call-step__index {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: #fff;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .call-step strong {
          display: block;
          font-size: 1rem;
          color: #0f172a;
          margin-bottom: 4px;
        }

        .call-step p {
          margin: 0;
          font-size: 0.9rem;
          color: rgba(15, 23, 42, 0.7);
          line-height: 1.5;
        }

        .mobile-tip {
          display: flex;
          gap: 12px;
          padding: 16px;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.08));
          border: 2px solid #10b981;
          border-radius: 12px;
          margin-bottom: 16px;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .mobile-tip svg {
          color: #10b981;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .mobile-tip strong {
          display: block;
          font-size: 0.95rem;
          color: #0f172a;
          margin-bottom: 4px;
        }

        .mobile-tip p {
          margin: 0;
          font-size: 0.85rem;
          color: rgba(15, 23, 42, 0.75);
          line-height: 1.4;
        }

        .alert {
          padding: 14px 16px;
          background: rgba(59, 130, 246, 0.08);
          border-left: 4px solid #2563eb;
          border-radius: 8px;
          font-size: 0.9rem;
          color: rgba(15, 23, 42, 0.8);
          line-height: 1.5;
        }

        .alert strong {
          color: #0f172a;
        }

        .alert a {
          color: #2563eb;
          font-weight: 600;
        }

        .alert--warning {
          background: rgba(245, 158, 11, 0.08);
          border-left-color: #f59e0b;
        }

        /* Estilos para CONVENIENCE_STORE */
        .instructions__header--convenience {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(37, 99, 235, 0.08));
          border: 2px solid rgba(37, 99, 235, 0.15);
          border-radius: 16px;
          padding: 20px;
        }

        .header-icon-wrapper {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
        }

        .header-icon-wrapper svg {
          color: #fff;
        }

        .info-card--premium {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(5, 150, 105, 0.05));
          border: 2px solid rgba(16, 185, 129, 0.25);
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.1);
        }

        .convenience-container {
          background: #fff;
          border: 2px solid rgba(15, 23, 42, 0.08);
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .section-header h4 {
          margin: 0;
          font-size: 1.15rem;
          font-weight: 700;
          color: #0f172a;
        }

        .badge-available {
          background: linear-gradient(135deg, #10b981, #059669);
          color: #fff;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.25);
        }

        .convenience-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .convenience-card {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.03), rgba(37, 99, 235, 0.05));
          border: 2px solid rgba(37, 99, 235, 0.12);
          border-radius: 12px;
          padding: 18px;
          transition: all 0.3s ease;
          cursor: default;
        }

        .convenience-card:hover {
          border-color: rgba(37, 99, 235, 0.3);
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.15);
          transform: translateY(-4px);
        }

        .convenience-card__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .store-logo {
          font-size: 2rem;
          line-height: 1;
        }

        .store-badge {
          background: linear-gradient(135deg, #10b981, #059669);
          color: #fff;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .store-name {
          margin: 0 0 8px;
          font-size: 1.1rem;
          font-weight: 700;
          color: #0f172a;
        }

        .store-description {
          margin: 0;
          font-size: 0.85rem;
          color: rgba(15, 23, 42, 0.65);
          line-height: 1.4;
        }

        .payment-steps {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.05), rgba(251, 191, 36, 0.08));
          border: 2px solid rgba(245, 158, 11, 0.2);
          border-radius: 16px;
          padding: 24px;
        }

        .steps-title {
          margin: 0 0 20px;
          font-size: 1.15rem;
          font-weight: 700;
          color: #0f172a;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .steps-title::before {
          content: '📝';
          font-size: 1.4rem;
        }

        .steps-list {
          display: grid;
          gap: 16px;
        }

        .step-item {
          display: flex;
          gap: 16px;
          align-items: flex-start;
          background: #fff;
          padding: 16px;
          border-radius: 12px;
          border: 1px solid rgba(15, 23, 42, 0.1);
          transition: all 0.2s ease;
        }

        .step-item:hover {
          border-color: rgba(245, 158, 11, 0.3);
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.1);
        }

        .step-number {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.1rem;
          flex-shrink: 0;
          box-shadow: 0 3px 10px rgba(245, 158, 11, 0.3);
        }

        .step-content {
          flex: 1;
        }

        .step-content strong {
          display: block;
          font-size: 1rem;
          color: #0f172a;
          margin-bottom: 6px;
        }

        .step-content p {
          margin: 0;
          font-size: 0.9rem;
          color: rgba(15, 23, 42, 0.7);
          line-height: 1.5;
        }

        .step-content code {
          background: rgba(37, 99, 235, 0.1);
          color: #2563eb;
          padding: 2px 8px;
          border-radius: 6px;
          font-family: 'Courier New', monospace;
          font-size: 0.9rem;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .instructions__header {
            flex-direction: column;
          }

          .instructions__header svg {
            width: 28px;
            height: 28px;
          }

          .instructions__header h3 {
            font-size: 1.15rem;
          }

          .contact-actions {
            grid-template-columns: 1fr;
          }

          .action-button {
            padding: 14px;
          }
        }

        @media (max-width: 640px) {
          .info-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .info-value {
            width: 100%;
            justify-content: space-between;
          }

          .contact-card {
            padding: 16px;
          }

          .zone-name {
            font-size: 1rem;
          }

          .contact-phone {
            font-size: 0.95rem;
          }

          .convenience-grid {
            grid-template-columns: 1fr;
          }

          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .convenience-container {
            padding: 18px;
          }

          .payment-steps {
            padding: 18px;
          }

          .step-item {
            gap: 12px;
          }

          .step-number {
            width: 32px;
            height: 32px;
            font-size: 1rem;
          }

          .call-step {
            flex-direction: column;
          }

          .call-step__index {
            width: 30px;
            height: 30px;
          }
        }
      `}</style>
    </div>
  );
};

export default PaymentInstructions;
