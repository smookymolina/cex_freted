import React from 'react';
import Link from 'next/link';
import { CheckCircle, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import PaymentInstructions from '../PaymentInstructions';

const CURRENCY_FORMATTER = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
});

const PAYMENT_METHOD_LABELS = {
  PHONE_PAYMENT: 'Confirmación telefónica',
  BANK_TRANSFER: 'Transferencia bancaria',
  CASH_DEPOSIT: 'Depósito bancario',
  CONVENIENCE_STORE: 'Pago en tienda',
};

const ConfirmationStep = ({
  orderInfo = {},
  customerData = {},
  shippingData = {},
  selectedPaymentMethod,
}) => {
  const orderNumber = orderInfo?.orderNumber || 'Pendiente';
  const totalAmount = CURRENCY_FORMATTER.format(orderInfo?.total || 0);
  const paymentReference = orderInfo?.paymentReference || 'Por asignar';
  const methodLabel = PAYMENT_METHOD_LABELS[selectedPaymentMethod] || 'Pago seleccionado';
  const customerName = customerData?.fullName || 'Cliente Sociedad Tecnologica Integral';
  const customerEmail = customerData?.email || '';
  const customerPhone = customerData?.phone || '';
  const addressLine = shippingData?.address || '';
  const locationLine = [shippingData?.city, shippingData?.state].filter(Boolean).join(', ');
  const postalCode = shippingData?.postalCode ? `CP ${shippingData.postalCode}` : '';
  const references = shippingData?.references?.trim();
  const referenceReady = paymentReference && paymentReference !== 'Por asignar';
  const phoneTargetText = customerPhone ? `al telefono ${customerPhone}` : 'al telefono registrado';

  const nextSteps = [
    {
      title: 'Recibe la llamada de verificacion',
      description: `Un especialista de soporte te contactara ${phoneTargetText} para compartirte los datos oficiales del vendedor. Esto garantiza que pagues directo al vendedor certificado, sin intermediarios.`,
    },
    {
      title: 'Deposita solo con datos oficiales',
      description: referenceReady
        ? `Si ya cuentas con la referencia ${paymentReference}, valida que coincida con la que recibes en la llamada antes de transferir.`
        : 'Espera a que el asesor te comparta la cuenta o referencia antes de depositar. Asi evitamos cuentas falsas.',
    },
    {
      title: 'Comparte tu comprobante',
      description:
        'Envialo al correo o WhatsApp oficial para liberar tu equipo. En cuanto validamos el saldo programamos envio o recoleccion.',
    },
  ];

  const emailMessage = customerEmail || 'tu correo registrado';

  return (
    <section className="confirmation">
      <div className="hero-card">
        <div className="hero-visual">
          <div className="hero-icon">
            <CheckCircle size={32} aria-hidden="true" />
          </div>
          <span className="hero-glow" aria-hidden="true" />
        </div>

        <div className="hero-copy">
          <p className="hero-eyebrow">
            <Sparkles size={16} aria-hidden="true" />
            Pago en proceso
          </p>
          <h1>¡Pedido recibido!</h1>
          <p>
            Gracias por comprar en Sociedad Tecnologica Integral. En minutos un asesor de soporte te llamara para
            entregarte la cuenta o referencia del vendedor que enviara tus equipos y acompanarte durante el pago.
          </p>
          <div className="hero-tags">
            <span className="hero-tag">Orden #{orderNumber}</span>
            <span className="hero-tag">{totalAmount}</span>
            <span className="hero-tag hero-tag--status">
              <Clock size={14} aria-hidden="true" />
              Pago pendiente
            </span>
          </div>
          <div className="hero-note">
            <strong>Pago directo al vendedor.</strong>
            No usamos intermediarios para manejar tu dinero; por eso compartimos los datos solo por llamada y validamos
            cada deposito con el vendedor antes de liberar el pedido.
          </div>
        </div>
      </div>

      <div className="confirmation-grid">
        <div className="grid-main">
          <div className="section-card section-card--instructions">
            <div className="section-heading">
              <p className="section-eyebrow">Instrucciones de pago</p>
              <h2>Completa tu pago ahora</h2>
              <p className="section-description">
                Espera la llamada de soporte para recibir los datos oficiales del vendedor y realiza el pago solo con
                la informacion que te compartamos por nuestros canales verificados.
              </p>
            </div>
            <div className="instructions-shell">
              <PaymentInstructions
                paymentMethod={selectedPaymentMethod}
                orderNumber={orderInfo?.orderNumber}
                paymentReference={orderInfo?.paymentReference}
                total={orderInfo?.total || 0}
              />
            </div>
          </div>
        </div>

        <aside className="grid-side">
          <div className="section-card summary-card">
            <div className="section-heading">
              <p className="section-eyebrow">Resumen</p>
              <h3>Detalles del pedido</h3>
            </div>
            <dl className="key-data">
              <div>
                <dt>Número de orden</dt>
                <dd>{orderNumber}</dd>
              </div>
              <div>
                <dt>Total</dt>
                <dd>{totalAmount}</dd>
              </div>
              <div>
                <dt>Método</dt>
                <dd>{methodLabel}</dd>
              </div>
              <div>
                <dt>Referencia</dt>
                <dd>{paymentReference}</dd>
              </div>
            </dl>
            <div className="guarantee-note">
              <ShieldCheck size={18} aria-hidden="true" />
              <span>Un asesor valida tu deposito directo con el vendedor en menos de 15 minutos.</span>
            </div>
          </div>

          <div className="section-card contact-card">
            <div className="section-heading">
              <p className="section-eyebrow">Datos del cliente</p>
              <h3>Contacto y entrega</h3>
            </div>
            <div className="info-block">
              <span className="info-label">Contacto</span>
              <p>{customerName}</p>
              {customerEmail && <p className="muted">{customerEmail}</p>}
              {customerPhone && <p className="muted">Tel. {customerPhone}</p>}
            </div>
            {(addressLine || locationLine || postalCode) && (
              <div className="info-block">
                <span className="info-label">Entrega</span>
                {addressLine && <p>{addressLine}</p>}
                {locationLine && <p className="muted">{locationLine}</p>}
                {postalCode && <p className="muted">{postalCode}</p>}
              </div>
            )}
            {references && (
              <div className="info-block">
                <span className="info-label">Referencias</span>
                <p>{references}</p>
              </div>
            )}
          </div>
        </aside>
      </div>

      <div className="section-card steps-card">
        <div className="section-heading">
          <p className="section-eyebrow">3 pasos para completar tu pago</p>
          <h2>Pago directo con vendedores verificados</h2>
        </div>
        <div className="steps-grid">
          {nextSteps.map((step, index) => (
            <div className="step-card" key={step.title}>
              <span className="step-index">{index + 1}</span>
              <div>
                <strong>{step.title}</strong>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section-card support-card">
        <div>
          <p className="section-eyebrow">¿Dudas?</p>
          <h3>Estamos listos para ayudarte</h3>
          <p>
            Escríbenos con tu número de orden y validamos tu pago por correo o WhatsApp en minutos hábiles.
          </p>
        </div>
        <Link href="/soporte" className="link-button link-button--ghost">
          Contactar soporte
        </Link>
      </div>

      <div className="confirmation__actions">
        <Link href="/comprar" className="link-button">
          Seguir comprando
        </Link>
        <Link href="/mi-cuenta/pedidos" className="link-button link-button--ghost">
          Ver historial de pedidos
        </Link>
      </div>

      <p className="confirmation__footer">
        Recibirás un correo de confirmación en <strong>{emailMessage}</strong> con todos los detalles y el
        seguimiento de envío. Si no lo ves, revisa tu carpeta de spam o promociones.
      </p>

      <style jsx>{`
        .confirmation {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        .hero-card {
          position: relative;
          overflow: hidden;
          border-radius: 28px;
          padding: 40px;
          display: flex;
          gap: 32px;
          align-items: center;
          background: linear-gradient(135deg, #0f172a, #1d4ed8);
          color: #fff;
          box-shadow: 0 35px 80px rgba(15, 23, 42, 0.4);
        }
        .hero-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.4), transparent 45%);
          pointer-events: none;
        }
        .hero-visual {
          position: relative;
          flex-shrink: 0;
        }
        .hero-icon {
          width: 96px;
          height: 96px;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(6px);
          position: relative;
          z-index: 1;
        }
        .hero-icon :global(svg) {
          color: #34d399;
        }
        .hero-glow {
          position: absolute;
          inset: 0;
          transform: translate(20px, -20px);
          width: 120px;
          height: 120px;
          background: radial-gradient(circle, rgba(52, 211, 153, 0.6), transparent 60%);
          z-index: 0;
        }
        .hero-copy {
          position: relative;
          z-index: 1;
          flex: 1;
        }
        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin: 0 0 12px;
          color: rgba(255, 255, 255, 0.8);
        }
        .hero-copy h1 {
          font-size: 2.25rem;
          margin: 0 0 12px;
        }
        .hero-copy p {
          margin: 0;
          font-size: 1.05rem;
          color: rgba(255, 255, 255, 0.85);
          line-height: 1.6;
        }
        .hero-tags {
          margin-top: 24px;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .hero-note {
          margin-top: 20px;
          padding: 18px 20px;
          border-radius: 18px;
          background: rgba(15, 23, 42, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.3);
          font-size: 0.95rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.9);
        }
        .hero-note strong {
          display: block;
          font-size: 1rem;
          margin-bottom: 6px;
        }
        .hero-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          font-size: 0.95rem;
          font-weight: 600;
        }
        .hero-tag--status {
          background: rgba(15, 23, 42, 0.45);
        }
        .confirmation-grid {
          display: grid;
          grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr);
          gap: 24px;
          align-items: start;
        }
        .grid-side {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .section-card {
          background: #fff;
          border-radius: 24px;
          padding: 32px;
          border: 1px solid rgba(15, 23, 42, 0.08);
          box-shadow: 0 24px 60px rgba(15, 23, 42, 0.07);
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .section-card--instructions {
          padding: 32px;
        }
        .section-heading {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .section-eyebrow {
          font-size: 0.8rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(15, 23, 42, 0.5);
          margin: 0;
        }
        .section-heading h2,
        .section-heading h3 {
          margin: 0;
          color: #0f172a;
        }
        .section-heading h2 {
          font-size: 1.5rem;
        }
        .section-heading h3 {
          font-size: 1.25rem;
        }
        .section-description {
          margin: 0;
          font-size: 0.95rem;
          color: rgba(15, 23, 42, 0.65);
        }
        .instructions-shell {
          border-radius: 20px;
          border: 1px solid rgba(15, 23, 42, 0.08);
          background: linear-gradient(180deg, #f8fafc, #fff);
          padding: 16px;
        }
        .instructions-shell :global(.payment-instructions) {
          margin: 0;
        }
        .key-data {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          margin: 0;
        }
        .key-data div {
          padding: 16px;
          border-radius: 16px;
          background: #f8fafc;
          border: 1px solid rgba(15, 23, 42, 0.06);
        }
        .key-data dt {
          margin: 0 0 4px;
          font-size: 0.75rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(15, 23, 42, 0.55);
        }
        .key-data dd {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 700;
          color: #0f172a;
        }
        .guarantee-note {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9rem;
          color: rgba(15, 23, 42, 0.75);
          padding: 14px 16px;
          border-radius: 16px;
          background: rgba(34, 197, 94, 0.08);
          border: 1px solid rgba(34, 197, 94, 0.3);
        }
        .info-block {
          border-radius: 16px;
          border: 1px solid rgba(15, 23, 42, 0.08);
          background: #f8fafc;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .info-label {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgba(15, 23, 42, 0.6);
        }
        .muted {
          color: rgba(15, 23, 42, 0.6);
          margin: 0;
          font-size: 0.9rem;
        }
        .steps-card {
          gap: 16px;
        }
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
        }
        .step-card {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          border-radius: 18px;
          padding: 18px;
          background: #fff;
          border: 1px solid rgba(15, 23, 42, 0.05);
          box-shadow: inset 0 0 0 1px rgba(37, 99, 235, 0.05);
        }
        .step-index {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: #fff;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .step-card strong {
          display: block;
          font-size: 1rem;
          margin-bottom: 6px;
          color: #0f172a;
        }
        .step-card p {
          margin: 0;
          font-size: 0.9rem;
          color: rgba(15, 23, 42, 0.7);
          line-height: 1.5;
        }
        .support-card {
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          background: linear-gradient(120deg, #eff6ff, #e0f2fe);
          border: none;
          box-shadow: none;
        }
        .support-card h3 {
          margin: 6px 0;
        }
        .confirmation__actions {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          justify-content: center;
        }
        .link-button {
          padding: 14px 28px;
          border-radius: 14px;
          font-size: 0.95rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .link-button:not(.link-button--ghost) {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: #fff;
          box-shadow: 0 12px 30px rgba(37, 99, 235, 0.25);
        }
        .link-button:not(.link-button--ghost):hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 35px rgba(37, 99, 235, 0.35);
        }
        .link-button--ghost {
          background: #fff;
          color: #0f172a;
          border: 2px solid rgba(15, 23, 42, 0.1);
        }
        .link-button--ghost:hover {
          border-color: rgba(15, 23, 42, 0.25);
          transform: translateY(-1px);
        }
        .confirmation__footer {
          margin: 0 auto;
          padding: 20px 24px;
          background: rgba(37, 99, 235, 0.06);
          border-left: 4px solid #2563eb;
          border-radius: 14px;
          font-size: 0.9rem;
          color: rgba(15, 23, 42, 0.8);
          text-align: center;
          line-height: 1.6;
        }
        @media (max-width: 1024px) {
          .confirmation-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 768px) {
          .hero-card {
            flex-direction: column;
            text-align: left;
            padding: 28px;
          }
          .hero-tags {
            justify-content: flex-start;
          }
          .support-card {
            flex-direction: column;
            align-items: flex-start;
          }
          .section-card {
            padding: 24px;
          }
        }
        @media (max-width: 560px) {
          .hero-tags {
            flex-direction: column;
            align-items: flex-start;
          }
          .confirmation__actions .link-button {
            width: 100%;
          }
          .support-card .link-button {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
};

export default ConfirmationStep;
