import React, { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import AccountLayout from '../../components/mi-cuenta/AccountLayout';
import OrderRelease from '../../components/mi-cuenta/OrderRelease';
import PaymentProofUploader from '../../components/mi-cuenta/PaymentProofUploader';
import PizzaTracker from '../../components/mi-cuenta/PizzaTracker';
import { productDetailsBySlug } from '../../data/product-details';
import { Package, Truck, CheckCircle, XCircle, Clock, ChevronRight, Loader, RefreshCw } from 'lucide-react';
import { formatOrderStatus, formatPaymentMethod, formatReleaseStatus } from '../../utils/checkoutHelper';

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

const formatCurrency = (amount) =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(amount);

const statusIcons = {
  PENDING: Clock,
  PAYMENT_CONFIRMED: CheckCircle,
  PROCESSING: Package,
  SHIPPED: Truck,
  DELIVERED: CheckCircle,
  CANCELLED: XCircle,
  REFUNDED: RefreshCw,
};

const PLACEHOLDER_IMAGE = '/assets/images/placeholder-base.png';

const filters = [
  { id: 'all', label: 'Todos' },
  { id: 'PENDING', label: 'Pendientes' },
  { id: 'PAYMENT_CONFIRMED', label: 'Confirmados' },
  { id: 'PROCESSING', label: 'En proceso' },
  { id: 'SHIPPED', label: 'Enviados' },
  { id: 'DELIVERED', label: 'Entregados' },
];

const paymentStepsByMethod = {
  PHONE_PAYMENT: [
    {
      title: 'Agenda tu llamada',
      description: 'Coordina el horario con el ejecutivo asignado para validar tu identidad.',
    },
    {
      title: 'Verifica la referencia',
      description: 'Ten a la mano el n\u00famero de pedido, referencia y los datos de tu tarjeta.',
    },
    {
      title: 'Autoriza el cargo',
      description: 'Escucha la confirmaci\u00f3n en tiempo real antes de aprobar el pago telef\u00f3nico.',
    },
    {
      title: 'Sube tu comprobante',
      description: 'Captura ticket, PDF o captura bancaria y adj\u00fantalo en el m\u00f3dulo de Mis Pedidos.',
    },
    {
      title: 'Recibe confirmaci\u00f3n',
      description: 'Te avisaremos por correo y recibir\u00e1s la confirmaci\u00f3n final en cuanto validemos el pago.',
    },
  ],
};

const PaymentSteps = ({ method = 'PHONE_PAYMENT' }) => {
  const steps = paymentStepsByMethod[method] || paymentStepsByMethod.PHONE_PAYMENT;

  return (
    <section className="payment-steps" aria-label="Proceso de pago en cinco pasos">
      <div className="payment-steps__header">
        <div className="payment-steps__badge">
          <CheckCircle size={16} />
          <span>Guía rápida</span>
        </div>
        <h4 className="payment-steps__title">Proceso de pago en 5 pasos</h4>
        <p className="payment-steps__description">
          Seguimos estas etapas para validar tu compra y liberar el envío cuanto antes.
        </p>
      </div>
      <ol className="payment-steps__list">
        {steps.map((step, index) => (
          <li key={`${step.title}-${index}`} className="payment-step">
            <div className="payment-step__number">
              <span>{index + 1}</span>
            </div>
            <div className="payment-step__content">
              <h5 className="payment-step__title">{step.title}</h5>
              <p className="payment-step__description">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
};

const resolveItemPreview = (item = {}) => {
  if (item?.image) {
    return {
      src: item.image,
      alt: item.name || item.slug || 'Producto CEX Freted',
    };
  }

  if (item?.slug && productDetailsBySlug[item.slug]) {
    const galleryEntry = productDetailsBySlug[item.slug]?.gallery?.[0];
    if (galleryEntry?.src) {
      return {
        src: galleryEntry.src,
        alt: galleryEntry.alt || item.name || item.slug || 'Producto CEX Freted',
      };
    }
  }

  return {
    src: PLACEHOLDER_IMAGE,
    alt: item.name || 'Producto CEX Freted',
  };
};

const PedidosPage = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/payments/my-orders');
      const data = await response.json();

      if (response.ok && data.success) {
        setOrders(data.orders);
      } else {
        setError(data.error || 'Error al cargar los pedidos');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Error de conexi\u00f3n. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const filteredOrders =
    selectedFilter === 'all' ? orders : orders.filter((order) => order.status === selectedFilter);

  return (
    <AccountLayout title="Mis Pedidos">
      <div className="orders-container">
        <section className="filters-card">
          <div className="filters-header">
            <h3 className="filters-title">Filtrar pedidos</h3>
            <button
              type="button"
              onClick={fetchOrders}
              className="refresh-button"
              disabled={loading}
              title="Actualizar"
            >
              <RefreshCw size={16} className={loading ? 'spinning' : ''} />
            </button>
          </div>
          <div className="filters-group">
            {filters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setSelectedFilter(filter.id)}
                className={`filter-chip${selectedFilter === filter.id ? ' filter-chip--active' : ''}`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </section>

        {loading && (
          <div className="loading-state">
            <Loader className="spinner" size={40} />
            <p>Cargando tus pedidos...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <XCircle size={32} />
            <h4>Error al cargar pedidos</h4>
            <p>{error}</p>
            <button type="button" onClick={fetchOrders} className="retry-button">
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="orders-list">
            {filteredOrders.length === 0 ? (
              <div className="empty-state">
                <Package size={32} />
                <h4>
                  {selectedFilter === 'all'
                    ? 'No tienes pedidos a\u00fan'
                    : 'No hay pedidos en esta categor\u00eda'}
                </h4>
                <p>
                  {selectedFilter === 'all'
                    ? 'Comienza a comprar productos certificados y haz tu primer pedido.'
                    : 'Filtra por otro estado para ver tus \u00f3rdenes recientes.'}
                </p>
                <a href="/comprar" className="empty-action">
                  Ir a comprar
                </a>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const statusInfo = formatOrderStatus(order.status);
                const releaseInfo = formatReleaseStatus(order.paymentReleaseStatus || 'WAITING_SUPPORT');
                const releaseTimestamp = order.paymentReleaseAt ? formatDate(order.paymentReleaseAt) : null;
                const StatusIcon = statusIcons[order.status] || Package;
                const items = Array.isArray(order.items) ? order.items : [];
                const payment = Array.isArray(order.payments) ? order.payments[0] : null;
                const paymentMethod = payment?.paymentMethod;
                const referenceNumber = payment?.referenceNumber;
                const isPhonePayment = paymentMethod === 'PHONE_PAYMENT';
                const firstItem = items[0];
                const summaryPreview = firstItem
                  ? resolveItemPreview(firstItem)
                  : { src: PLACEHOLDER_IMAGE, alt: 'Producto CEX Freted' };
                const additionalItems = items.length > 1 ? items.length - 1 : 0;
                const orderKey = order.id || order.orderNumber;
                const isExpanded = expandedOrders.includes(orderKey);
                const detailsId = `order-details-${orderKey}`;

                return (
                  <article
                    key={orderKey}
                    className={`order-card${isExpanded ? ' order-card--expanded' : ''}`}
                  >
                    <header className="order-header">
                      <div className="order-meta">
                        <span className="order-id">{order.orderNumber}</span>
                        <span className="order-date">{formatDate(order.createdAt)}</span>
                      </div>
                      <div className="order-status-pill">
                        <span
                          className="order-status"
                          style={{ color: statusInfo.color, backgroundColor: `${statusInfo.color}20` }}
                        >
                          <StatusIcon size={16} aria-hidden="true" />
                          {statusInfo.label}
                        </span>
                        <span
                          className="release-status"
                          style={{ color: releaseInfo.color, borderColor: `${releaseInfo.color}33` }}
                        >
                          {releaseInfo.label}
                        </span>
                      </div>
                    </header>

                    <div className="order-summary">
                      <div className="order-summary-main">
                        <div className="order-summary-thumb">
                          <img src={summaryPreview.src} alt={summaryPreview.alt} loading="lazy" />
                        </div>
                        <div>
                          <p className="order-summary-title">
                            {firstItem ? firstItem.name || firstItem.slug : 'Sin art\u00edculos registrados'}
                          </p>
                          <p className="order-summary-subtitle">
                            {firstItem
                              ? additionalItems > 0
                                ? `+${additionalItems} productos adicionales`
                                : `Cantidad: ${firstItem.quantity || 1}`
                              : 'A\u00fan no hay art\u00edculos asociados a este pedido.'}
                          </p>
                        </div>
                      </div>

                      <div className="order-info-grid order-info-grid--summary">
                        <div className="info-item">
                          <span className="info-label">Total</span>
                          <strong className="info-value">{formatCurrency(order.total)}</strong>
                        </div>
                        <div className="info-item">
                          <span className="info-label">M\u00e9todo de pago</span>
                          <span className="info-value">
                            {paymentMethod ? formatPaymentMethod(paymentMethod) : 'No especificado'}
                          </span>
                        </div>
                        {referenceNumber && (
                          <div className="info-item">
                            <span className="info-label">Referencia</span>
                            <span className="info-value info-value--code">{referenceNumber}</span>
                          </div>
                        )}
                      </div>

                      <div className="order-summary-actions">
                        <button
                          type="button"
                          className="order-toggle"
                          onClick={() => toggleOrderDetails(orderKey)}
                          aria-expanded={isExpanded}
                          aria-controls={detailsId}
                        >
                          {isExpanded ? 'Ocultar detalle' : 'Ver detalle'}
                          <ChevronRight
                            size={16}
                            aria-hidden="true"
                            className={`order-toggle__icon${isExpanded ? ' order-toggle__icon--open' : ''}`}
                          />
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="order-details" id={detailsId}>
                        <div className="order-body">
                          {items.length > 0 ? (
                            items.map((item, index) => {
                              const preview = resolveItemPreview(item);
                              return (
                                <div key={`${orderKey}-${index}`} className="order-item">
                                  <div className="item-thumbnail">
                                    <img src={preview.src} alt={preview.alt} loading="lazy" />
                                  </div>
                                  <div className="item-details">
                                    <p className="item-name">{item.name || item.slug}</p>
                                    {item.grade && <span className="item-grade">Condici\u00f3n: {item.grade}</span>}
                                    <span className="item-quantity">Cantidad: {item.quantity}</span>
                                  </div>
                                  <div className="item-price">{formatCurrency(item.price)}</div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="no-items">
                              <p>Sin items disponibles</p>
                            </div>
                          )}
                        </div>

                        <footer className="order-footer">
                          <div className="tracker-section">
                            <h4 className="section-title">Seguimiento del Pedido</h4>
                            <PizzaTracker
                              trackingStatus={order.trackingStatus}
                              trackingHistory={order.trackingHistory}
                              createdAt={order.createdAt}
                            />
                          </div>

                          <div className="vendor-card">
                            <div className="vendor-header">
                              <Package size={18} />
                              <span className="vendor-label">Vendedor</span>
                            </div>
                            <p className="vendor-name">CEX Freted - Sociedad Tecnologica Integral</p>
                            <p className="vendor-description">
                              Distribuidor certificado de tecnologia reacondicionada
                            </p>
                          </div>

                          {order.paymentReleaseStatus === 'RELEASED_TO_CUSTOMER' && order.orderReleaseData && (
                            <div className="order-release-section">
                              <h4 className="section-title">Orden de Compra</h4>
                              <OrderRelease
                                orderReleaseData={order.orderReleaseData}
                                paymentMethod={paymentMethod}
                                orderNumber={order.orderNumber}
                              />
                            </div>
                          )}

                      {order.paymentReleaseStatus === 'RELEASED_TO_CUSTOMER' &&
                        payment &&
                        !payment.paymentProofVerified && (
                          <div className="proof-uploader-section">
                            <PaymentProofUploader
                              payment={payment}
                              onUploadSuccess={() => {
                                fetchOrders();
                              }}
                                />
                              </div>
                            )}

                          {isPhonePayment && (
                            <div className="order-steps-section">
                              <PaymentSteps method="PHONE_PAYMENT" />
                            </div>
                          )}

                          {order.paymentReleaseStatus !== 'RELEASED_TO_CUSTOMER' && (
                            <div className="release-card">
                              <div className="release-card-head">
                                <span className="release-card-label">Estado de Orden</span>
                                {releaseTimestamp && <span className="release-card-time">{releaseTimestamp}</span>}
                              </div>
                              <p className="release-card-description">{releaseInfo.description}</p>
                              {order.paymentReleaseNotes && (
                                <p className="release-card-note">Nota de soporte: {order.paymentReleaseNotes}</p>
                              )}
                            </div>
                          )}

                          {order.shippingAddress && (
                            <div className="shipping-info">
                              <span className="info-label">Direcci\u00f3n de env\u00edo:</span>
                              <p>
                                {order.shippingAddress}, {order.shippingCity}, {order.shippingState} - CP{' '}
                                {order.shippingPostalCode}
                              </p>
                            </div>
                          )}
                        </footer>
                      </div>
                    )}
                  </article>
                );
              })
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .orders-container {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .filters-card {
          background: white;
          border-radius: 18px;
          padding: 24px 28px;
          box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
          border: 1px solid rgba(148, 163, 184, 0.18);
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .filters-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .filters-title {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }

        .refresh-button {
          padding: 8px;
          border: none;
          background: rgba(37, 99, 235, 0.1);
          color: #2563eb;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .refresh-button:hover:not(:disabled) {
          background: rgba(37, 99, 235, 0.2);
        }

        .refresh-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .filters-group {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .filter-chip {
          padding: 10px 18px;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.24);
          background-color: #f8fafc;
          color: #0f172a;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-chip:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 16px rgba(59, 130, 246, 0.12);
        }

        .filter-chip--active {
          background: linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%);
          border-color: transparent;
          color: white;
          box-shadow: 0 12px 22px rgba(37, 99, 235, 0.24);
        }

        .loading-state,
        .error-state {
          background: white;
          border-radius: 18px;
          padding: 48px 32px;
          border: 1px solid rgba(148, 163, 184, 0.16);
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 16px;
          align-items: center;
          color: rgba(15, 23, 42, 0.7);
          box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
        }

        .spinner {
          animation: spin 1s linear infinite;
          color: #2563eb;
        }

        .error-state h4 {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }

        .retry-button {
          margin-top: 8px;
          padding: 12px 20px;
          border-radius: 999px;
          background: linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%);
          color: white;
          border: none;
          font-weight: 600;
          cursor: pointer;
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .order-card {
          background: white;
          border-radius: 20px;
          padding: 24px 28px;
          box-shadow: 0 20px 46px rgba(15, 23, 42, 0.08);
          border: 1px solid rgba(148, 163, 184, 0.16);
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .order-card--expanded {
          box-shadow: 0 28px 60px rgba(15, 23, 42, 0.12);
        }

        .order-summary {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .order-summary-main {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .order-summary-thumb {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          overflow: hidden;
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(14, 165, 233, 0.15));
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .order-summary-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .order-summary-title {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #0f172a;
        }

        .order-summary-subtitle {
          margin: 4px 0 0;
          color: rgba(15, 23, 42, 0.7);
          font-size: 13px;
        }

        .order-summary-actions {
          display: flex;
        }

        .order-toggle {
          border: 1px solid transparent;
          border-radius: 12px;
          padding: 12px 20px;
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(14, 165, 233, 0.08));
          font-size: 14px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          color: #1d4ed8;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.15);
          position: relative;
          overflow: hidden;
        }

        .order-toggle::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #2563eb, #0ea5e9);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .order-toggle:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(37, 99, 235, 0.3);
          color: white;
        }

        .order-toggle:hover::before {
          opacity: 1;
        }

        .order-toggle:active {
          transform: translateY(0px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }

        .order-toggle > * {
          position: relative;
          z-index: 1;
        }

        .order-toggle__icon {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .order-toggle__icon--open {
          transform: rotate(90deg);
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }

        .order-meta {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .order-id {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
        }

        .order-date {
          font-size: 13px;
          color: rgba(15, 23, 42, 0.65);
        }

        .order-status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 600;
          padding: 8px 14px;
          border-radius: 999px;
        }

        .order-status-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .release-status {
          border: 1px solid;
          border-radius: 999px;
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 600;
          background: #fff;
        }

        .order-body {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .order-details {
          border-top: 1px dashed rgba(148, 163, 184, 0.35);
          margin-top: 18px;
          padding-top: 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .order-item {
          display: grid;
          grid-template-columns: 64px minmax(0, 1fr) auto;
          gap: 18px;
          align-items: center;
          padding: 16px;
          border-radius: 16px;
          background-color: #f8fbff;
          border: 1px solid rgba(148, 163, 184, 0.14);
        }

        .item-thumbnail {
          width: 64px;
          height: 64px;
          border-radius: 12px;
          overflow: hidden;
          background: linear-gradient(135deg, rgba(148, 163, 184, 0.2) 0%, rgba(226, 232, 240, 0.45) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(15, 23, 42, 0.4);
        }

        .item-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .item-details {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .item-name {
          font-size: 15px;
          font-weight: 600;
          color: #0f172a;
          margin: 0;
        }

        .item-grade,
        .item-quantity {
          font-size: 12px;
          color: rgba(15, 23, 42, 0.65);
        }

        .item-price {
          font-size: 16px;
          font-weight: 700;
          color: #1d4ed8;
        }

        .no-items {
          text-align: center;
          padding: 20px;
          color: rgba(15, 23, 42, 0.5);
        }

        .order-footer {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .order-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
          padding: 16px 18px;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(14, 165, 233, 0.1) 100%);
        }

        .order-info-grid--summary {
          background: rgba(15, 23, 42, 0.02);
          border: 1px dashed rgba(148, 163, 184, 0.4);
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .info-label {
          font-size: 12px;
          font-weight: 600;
          color: rgba(15, 23, 42, 0.6);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .info-value {
          font-size: 14px;
          color: #0f172a;
        }

        .info-value--code {
          font-family: 'Courier New', monospace;
          font-size: 13px;
          font-weight: 600;
        }

        .release-card {
          margin-top: 20px;
          padding: 20px;
          border-radius: 16px;
          border: 1px solid rgba(37, 99, 235, 0.2);
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(14, 165, 233, 0.08) 100%);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .release-card-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }

        .release-card-label {
          font-weight: 700;
          color: #0f172a;
        }

        .release-card-time {
          font-size: 12px;
          color: #475569;
        }

        .release-card-description {
          margin: 0;
          color: #0f172a;
          font-size: 0.95rem;
        }

        .release-card-note {
          margin: 0;
          font-size: 0.9rem;
          color: #475569;
        }

        .section-title {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 16px 0;
          padding-bottom: 12px;
          border-bottom: 2px solid rgba(37, 99, 235, 0.15);
        }

        .tracker-section {
          margin-top: 20px;
          padding: 20px;
          background: #f8fbff;
          border-radius: 16px;
          border: 1px solid rgba(37, 99, 235, 0.12);
        }

        .vendor-card {
          padding: 18px 20px;
          border-radius: 16px;
          background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%);
          border: 1px solid rgba(14, 165, 233, 0.2);
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 16px;
        }

        .vendor-header {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #0369a1;
        }

        .vendor-label {
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .vendor-name {
          margin: 0;
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
        }

        .vendor-description {
          margin: 0;
          font-size: 13px;
          color: #475569;
        }

        .order-release-section {
          margin-top: 20px;
        }

        .proof-uploader-section {
          margin-top: 20px;
          padding: 20px;
          border-radius: 18px;
          border: 1px solid rgba(37, 99, 235, 0.18);
          background: rgba(37, 99, 235, 0.05);
        }

        .order-steps-section {
          margin-top: 12px;
          padding: 20px;
          border-radius: 18px;
          border: 1px solid rgba(14, 165, 233, 0.25);
          background: rgba(14, 165, 233, 0.06);
        }

        .payment-steps {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .payment-steps__header {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .payment-steps__badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(14, 165, 233, 0.15), rgba(6, 182, 212, 0.1));
          color: #0284c7;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          align-self: flex-start;
          border: 1px solid rgba(14, 165, 233, 0.25);
        }

        .payment-steps__title {
          margin: 0;
          font-size: 20px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.3;
        }

        .payment-steps__description {
          margin: 0;
          color: rgba(15, 23, 42, 0.65);
          font-size: 14px;
          line-height: 1.6;
          max-width: 600px;
        }

        .payment-steps__list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 16px;
          counter-reset: step-counter;
        }

        .payment-step {
          display: flex;
          gap: 16px;
          padding: 20px;
          border-radius: 16px;
          background: white;
          border: 1px solid rgba(148, 163, 184, 0.2);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
        }

        .payment-step::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: linear-gradient(180deg, #0ea5e9, #06b6d4);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .payment-step:hover {
          border-color: rgba(14, 165, 233, 0.4);
          box-shadow: 0 8px 24px rgba(14, 165, 233, 0.12);
          transform: translateY(-2px);
        }

        .payment-step:hover::before {
          opacity: 1;
        }

        .payment-step__number {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, #0ea5e9, #06b6d4);
          color: white;
          font-weight: 700;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
          position: relative;
        }

        .payment-step__number span {
          position: relative;
          z-index: 1;
        }

        .payment-step__content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .payment-step__title {
          margin: 0;
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.4;
        }

        .payment-step__description {
          margin: 0;
          font-size: 14px;
          color: rgba(15, 23, 42, 0.7);
          line-height: 1.6;
        }

        .shipping-info {
          margin-top: 20px;
          padding: 20px 24px;
          border: 1px solid rgba(59, 130, 246, 0.25);
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(14, 165, 233, 0.06) 100%);
          font-size: 14px;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.08);
          position: relative;
          overflow: hidden;
        }

        .shipping-info::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: linear-gradient(180deg, #2563eb, #0ea5e9);
          border-radius: 16px 0 0 16px;
        }

        .shipping-info .info-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 700;
          color: #1d4ed8;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 8px;
        }

        .shipping-info .info-label::before {
          content: '';
          display: inline-block;
          width: 20px;
          height: 20px;
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232563eb' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'%3E%3C/path%3E%3Cpolyline points='9 22 9 12 15 12 15 22'%3E%3C/polyline%3E%3C/svg%3E") no-repeat center;
          background-size: contain;
        }

        .shipping-info p {
          margin: 0;
          padding-left: 28px;
          color: #0f172a;
          font-weight: 500;
          line-height: 1.6;
        }


        .empty-state {
          background: white;
          border-radius: 18px;
          padding: 48px 32px;
          border: 1px solid rgba(148, 163, 184, 0.16);
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 16px;
          align-items: center;
          color: rgba(15, 23, 42, 0.7);
          box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
        }

        .empty-state h4 {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }

        .empty-action {
          margin-top: 8px;
          padding: 12px 20px;
          border-radius: 999px;
          background: linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%);
          color: white;
          text-decoration: none;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        @media (max-width: 768px) {
          .filters-card {
            padding: 20px;
          }

          .order-card {
            padding: 20px;
            gap: 18px;
          }

          .order-summary-main {
            flex-direction: column;
            align-items: flex-start;
          }

          .order-summary-thumb {
            width: 56px;
            height: 56px;
          }

          .order-info-grid--summary {
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          }

          .order-summary-actions {
            justify-content: flex-start;
          }

          .order-toggle {
            width: 100%;
            justify-content: space-between;
          }

          .order-item {
            grid-template-columns: 56px minmax(0, 1fr);
            grid-template-rows: auto auto;
            gap: 12px;
          }

          .item-price {
            grid-column: span 2;
            justify-self: flex-end;
          }

          .order-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .order-status-pill {
            justify-content: flex-start;
          }

          .release-card-head {
            flex-direction: column;
            align-items: flex-start;
          }

          .tracker-section {
            padding: 16px;
            margin-top: 16px;
          }

          .section-title {
            font-size: 15px;
            margin-bottom: 12px;
            padding-bottom: 10px;
          }

          .vendor-card,
          .order-release-section,
          .proof-uploader-section {
            margin-top: 16px;
          }

          .order-details {
            padding-top: 16px;
          }

          .payment-step {
            padding: 16px;
            gap: 12px;
          }

          .payment-step__number {
            width: 36px;
            height: 36px;
            font-size: 16px;
          }

          .payment-step__title {
            font-size: 15px;
          }

          .payment-step__description {
            font-size: 13px;
          }
        }

        @media (max-width: 540px) {
          .filter-chip {
            flex: 1 1 auto;
            text-align: center;
          }

          .payment-steps__badge {
            font-size: 11px;
            padding: 6px 12px;
          }

          .payment-steps__title {
            font-size: 18px;
          }

          .payment-step {
            padding: 14px;
          }
        }
      `}</style>
    </AccountLayout>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/mi-cuenta/login',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default PedidosPage;
