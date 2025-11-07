import React from 'react';
import Link from 'next/link';
import { CheckCircle, Clock, PhoneOutgoing } from 'lucide-react';

const CURRENCY_FORMATTER = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
});

const ConfirmationStep = ({ orderInfo, customerData, shippingData }) => (
  <section className="confirmation">
    <div className="confirmation__icon">
      <CheckCircle size={48} aria-hidden="true" />
    </div>
    <h1>¡Pedido Recibido!</h1>
    <p className="subtitle">
      Tu orden ha sido registrada con éxito y está pendiente de pago.
    </p>

    <div className="next-step-box">
      <div className="next-step-box__icon">
        <PhoneOutgoing size={24} />
      </div>
      <div className="next-step-box__content">
        <h3>Siguiente Paso: Llamada de Confirmación</h3>
        <p>
          Un agente de CEX Freted te llamará al número <strong>{customerData.phone}</strong> en las próximas 24 horas hábiles para procesar tu pago de forma segura.
        </p>
      </div>
    </div>

    <div className="confirmation__summary">
      <div>
        <h3>Número de Orden</h3>
        <p>{orderInfo?.orderNumber}</p>
      </div>
      <div>
        <h3>Total a Pagar</h3>
        <p>{CURRENCY_FORMATTER.format(orderInfo?.total || 0)}</p>
      </div>
      <div>
        <h3>Estado del Pedido</h3>
        <p className="status-pending">
          <Clock size={16} />
          Pendiente de Pago
        </p>
      </div>
    </div>

    <div className="confirmation__details">
      <h3>Información de Contacto</h3>
      <p>
        {customerData.fullName} · {customerData.email}
      </p>
      <p>Teléfono: {customerData.phone}</p>

      <h3>Dirección de Entrega</h3>
      <p>
        {shippingData.address}, {shippingData.city}, {shippingData.state}
      </p>
      <p>CP {shippingData.postalCode}</p>
      {shippingData.references && (
        <>
          <h3>Referencias</h3>
          <p>{shippingData.references}</p>
        </>
      )}
    </div>

    <div className="confirmation__actions">
      <Link href="/comprar" className="link-button">
        Seguir Comprando
      </Link>
      <Link href="/mi-cuenta/pedidos" className="link-button link-button--ghost">
        Ver Historial de Pedidos
      </Link>
    </div>

    <p className="confirmation__footer">
      Recibirás un correo de confirmación en <strong>{customerData.email}</strong> con todos los detalles de tu pedido. Por favor, revisa tu bandeja de entrada.
    </p>

    <style jsx>{`
      .confirmation {
        text-align: center;
        max-width: 720px;
        margin: 0 auto;
      }
      .confirmation__icon {
        width: 80px;
        height: 80px;
        background: linear-gradient(135deg, #10b981, #059669);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 24px;
        color: #fff;
        box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
        animation: scaleIn 0.4s ease-out;
      }
      @keyframes scaleIn {
        from {
          transform: scale(0);
        }
        to {
          transform: scale(1);
        }
      }
      .confirmation h1 {
        margin: 0 0 8px;
        font-size: 1.75rem;
        font-weight: 700;
        color: #0f172a;
      }
      .subtitle {
        margin: 0 0 32px;
        font-size: 1rem;
        color: rgba(15, 23, 42, 0.65);
        line-height: 1.6;
      }
      .next-step-box {
        display: flex;
        align-items: center;
        gap: 20px;
        background: #fff;
        border: 2px solid #2563eb;
        border-radius: 16px;
        padding: 24px;
        margin-bottom: 32px;
        text-align: left;
      }
      .next-step-box__icon {
        flex-shrink: 0;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: #2563eb;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .next-step-box__content h3 {
        margin: 0 0 8px;
        font-size: 1.1rem;
        font-weight: 600;
        color: #0f172a;
      }
      .next-step-box__content p {
        margin: 0;
        font-size: 0.95rem;
        color: rgba(15, 23, 42, 0.75);
        line-height: 1.6;
      }
      .confirmation__summary {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        background: linear-gradient(135deg, #f8fafc, #f1f5f9);
        border-radius: 16px;
        padding: 24px;
        margin-bottom: 32px;
      }
      .confirmation__summary div {
        text-align: center;
      }
      .confirmation__summary h3 {
        margin: 0 0 8px;
        font-size: 0.85rem;
        font-weight: 600;
        color: rgba(15, 23, 42, 0.6);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .confirmation__summary p {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 700;
        color: #0f172a;
      }
      .status-pending {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 1rem;
        font-weight: 600;
        color: #d97706;
        background: rgba(245, 158, 11, 0.1);
        padding: 8px 16px;
        border-radius: 99px;
      }
      .confirmation__details {
        background: #fafbfc;
        border: 1px solid rgba(15, 23, 42, 0.1);
        border-radius: 16px;
        padding: 24px;
        margin: 32px 0;
        text-align: left;
      }
      .confirmation__details h3 {
        margin: 20px 0 8px;
        font-size: 0.9rem;
        font-weight: 700;
        color: #0f172a;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .confirmation__details h3:first-child {
        margin-top: 0;
      }
      .confirmation__details p {
        margin: 4px 0;
        font-size: 0.95rem;
        color: rgba(15, 23, 42, 0.75);
        line-height: 1.5;
      }
      .confirmation__actions {
        display: flex;
        gap: 16px;
        justify-content: center;
        margin: 32px 0;
      }
      .link-button {
        padding: 14px 28px;
        border-radius: 12px;
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
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
      }
      .link-button:not(.link-button--ghost):hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(37, 99, 235, 0.35);
      }
      .link-button--ghost {
        background: transparent;
        color: rgba(15, 23, 42, 0.7);
        border: 2px solid rgba(15, 23, 42, 0.12);
      }
      .link-button--ghost:hover {
        background: rgba(15, 23, 42, 0.04);
        border-color: rgba(15, 23, 42, 0.2);
      }
      .confirmation__footer {
        margin: 32px 0 0;
        padding: 20px;
        background: rgba(59, 130, 246, 0.05);
        border-left: 4px solid #2563eb;
        border-radius: 8px;
        font-size: 0.9rem;
        color: rgba(15, 23, 42, 0.75);
        text-align: left;
      }
      @media (max-width: 768px) {
        .confirmation__summary {
          grid-template-columns: 1fr;
        }
        .confirmation__actions {
          flex-direction: column;
        }
      }
    `}</style>
  </section>
);

export default ConfirmationStep;