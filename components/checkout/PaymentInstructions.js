import React from 'react';
import { Phone, Building2, MapPin, Copy, CheckCircle, MessageCircle } from 'lucide-react';

const BANK_ACCOUNTS = [
  {
    bank: 'BBVA',
    accountNumber: '0115 4567 8901 2345 67',
    clabe: '012180001154678901234567',
    holder: 'CEX FRETED SA DE CV',
  },
  {
    bank: 'Santander',
    accountNumber: '6500 1234 5678 9012 34',
    clabe: '014180065001234567890123',
    holder: 'CEX FRETED SA DE CV',
  },
];

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

const STORE_LOCATIONS = [
  {
    name: 'Sucursal Centro',
    address: 'Av. Juárez 123, Centro Histórico, CDMX',
    hours: 'Lun-Vie: 9:00-18:00, Sáb: 10:00-14:00',
  },
  {
    name: 'Sucursal Sur',
    address: 'Av. Universidad 456, Coyoacán, CDMX',
    hours: 'Lun-Vie: 9:00-18:00',
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
    logo: '🛒',
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

            <div className="contacts">
              <h4>Selecciona tu zona para contactar:</h4>
              {CONTACT_NUMBERS.map((contact) => (
                <div key={contact.zone} className="contact-card">
                  <div className="contact-info">
                    <strong className="zone-name">{contact.zone}</strong>
                    <span className="contact-name">{contact.contact}</span>
                    <span className="contact-phone">{contact.phoneFormatted}</span>
                  </div>
                  <div className="contact-actions">
                    <a
                      href={`tel:${contact.phone}`}
                      className="action-button action-button--call"
                      title="Llamar ahora"
                    >
                      <Phone size={18} />
                      Llamar
                    </a>
                    <a
                      href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(
                        `Hola, necesito confirmar mi pago. Mi número de orden es: ${orderNumber} y mi referencia de pago es: ${paymentReference}`
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
      case 'CASH_DEPOSIT':
        return (
          <div className="instructions">
            <div className="instructions__header">
              <Building2 size={32} />
              <div>
                <h3>
                  {paymentMethod === 'BANK_TRANSFER'
                    ? 'Realiza tu transferencia bancaria'
                    : 'Realiza tu depósito en efectivo'}
                </h3>
                <p>
                  {paymentMethod === 'BANK_TRANSFER'
                    ? 'Usa los siguientes datos para realizar la transferencia:'
                    : 'Acude a cualquier sucursal bancaria y deposita a:'}
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

            <div className="bank-accounts">
              <h4>Cuentas bancarias:</h4>
              {BANK_ACCOUNTS.map((account, index) => (
                <div key={index} className="bank-account">
                  <div className="bank-name">{account.bank}</div>
                  <div className="account-details">
                    <div className="account-row">
                      <span>Beneficiario:</span>
                      <strong>{account.holder}</strong>
                    </div>
                    <div className="account-row">
                      <span>Número de Cuenta:</span>
                      <div className="copyable">
                        <strong>{account.accountNumber}</strong>
                        <CopyButton text={account.accountNumber} label={`account-${index}`} />
                      </div>
                    </div>
                    <div className="account-row">
                      <span>CLABE:</span>
                      <div className="copyable">
                        <strong>{account.clabe}</strong>
                        <CopyButton text={account.clabe} label={`clabe-${index}`} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="alert">
              <strong>Importante:</strong> Después de realizar el pago, envía tu comprobante a{' '}
              <a href="mailto:pagos@cexfreted.com">pagos@cexfreted.com</a> con tu número de orden{' '}
              <strong>{orderNumber}</strong>
            </div>
          </div>
        );

      case 'CONVENIENCE_STORE':
        return (
          <div className="instructions">
            <div className="instructions__header instructions__header--convenience">
              <div className="header-icon-wrapper">
                <MapPin size={32} />
              </div>
              <div>
                <h3>Paga en tiendas de autoservicio</h3>
                <p>Realiza tu pago en efectivo en más de 25,000 tiendas en todo México</p>
              </div>
            </div>

            <div className="info-card info-card--premium">
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
              <h4 className="steps-title">Instrucciones para pagar</h4>
              <div className="steps-list">
                <div className="step-item">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <strong>Acude a la tienda</strong>
                    <p>Visita cualquier tienda de autoservicio participante</p>
                  </div>
                </div>
                <div className="step-item">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <strong>Proporciona tu referencia</strong>
                    <p>Indica al cajero tu número de referencia: <code>{paymentReference}</code></p>
                  </div>
                </div>
                <div className="step-item">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <strong>Realiza el pago</strong>
                    <p>Paga en efectivo el monto de <strong>${total.toLocaleString('es-MX')}</strong></p>
                  </div>
                </div>
                <div className="step-item">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <strong>Conserva tu ticket</strong>
                    <p>Guarda el comprobante como prueba de pago</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="alert alert--warning">
              <strong>¡Importante!</strong> Tu referencia de pago es válida por <strong>48 horas</strong>.
              Una vez realizado el pago, la confirmación puede tardar hasta 15 minutos.
            </div>
          </div>
        );

      case 'STORE_PAYMENT':
        return (
          <div className="instructions">
            <div className="instructions__header">
              <MapPin size={32} />
              <div>
                <h3>Visita una de nuestras sucursales</h3>
                <p>Realiza tu pago directamente en cualquiera de nuestras ubicaciones.</p>
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

            <div className="stores">
              <h4>Nuestras sucursales:</h4>
              {STORE_LOCATIONS.map((store, index) => (
                <div key={index} className="store-item">
                  <h5>{store.name}</h5>
                  <p className="store-address">{store.address}</p>
                  <p className="store-hours">{store.hours}</p>
                </div>
              ))}
            </div>

            <div className="alert">
              <strong>Recuerda:</strong> Lleva tu número de orden{' '}
              <strong>{orderNumber}</strong> y tu referencia de pago <strong>{paymentReference}</strong> para agilizar tu pago.
            </div>
          </div>
        );

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

        .contacts,
        .bank-accounts,
        .stores {
          display: grid;
          gap: 12px;
        }

        .contacts h4,
        .bank-accounts h4,
        .stores h4 {
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

        .bank-account {
          background: #fff;
          border: 1px solid rgba(15, 23, 42, 0.1);
          border-radius: 10px;
          overflow: hidden;
        }

        .bank-name {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: #fff;
          padding: 12px 16px;
          font-weight: 700;
          font-size: 1.1rem;
        }

        .account-details {
          padding: 16px;
          display: grid;
          gap: 10px;
        }

        .account-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }

        .account-row span {
          font-size: 0.85rem;
          color: rgba(15, 23, 42, 0.6);
        }

        .copyable {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .store-item {
          padding: 16px;
          background: #fff;
          border: 1px solid rgba(15, 23, 42, 0.1);
          border-radius: 10px;
        }

        .store-item h5 {
          margin: 0 0 8px;
          font-size: 1.05rem;
          color: #0f172a;
        }

        .store-address {
          margin: 4px 0;
          color: rgba(15, 23, 42, 0.7);
          font-size: 0.9rem;
        }

        .store-hours {
          margin: 4px 0 0;
          color: #2563eb;
          font-size: 0.85rem;
          font-weight: 600;
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
          .info-row,
          .account-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .info-value,
          .copyable {
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
        }
      `}</style>
    </div>
  );
};

export default PaymentInstructions;
