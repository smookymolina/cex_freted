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
      setError('Error de conexión. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
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
                    ? 'No tienes pedidos aún'
                    : 'No hay pedidos en esta categoría'}
                </h4>
                <p>
                  {selectedFilter === 'all'
                    ? 'Comienza a comprar productos certificados y haz tu primer pedido.'
                    : 'Filtra por otro estado para ver tus órdenes recientes.'}
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

                return (
                  <article key={order.id} className="order-card">
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

                    <div className="order-body">
                      {items.length > 0 ? (
                        items.map((item, index) => {
                          const preview = resolveItemPreview(item);
                          return (
                            <div key={`${order.id}-${index}`} className="order-item">
                              <div className="item-thumbnail">
                              <img src={preview.src} alt={preview.alt} loading="lazy" />
                            </div>
                            <div className="item-details">
                              <p className="item-name">{item.name || item.slug}</p>
                              {item.grade && <span className="item-grade">Condición: {item.grade}</span>}
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
                      <div className="order-info-grid">
                        <div className="info-item">
                          <span className="info-label">Total</span>
                          <strong className="info-value">{formatCurrency(order.total)}</strong>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Método de pago</span>
                          <span className="info-value">
                            {order.payments[0]
                              ? formatPaymentMethod(order.payments[0].paymentMethod)
                              : 'No especificado'}
                          </span>
                        </div>
                        {order.payments[0]?.referenceNumber && (
                          <div className="info-item">
                            <span className="info-label">Referencia</span>
                            <span className="info-value info-value--code">
                              {order.payments[0].referenceNumber}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Pizza Tracker - Seguimiento del pedido */}
                      <div className="tracker-section">
                        <h4 className="section-title">Seguimiento del Pedido</h4>
                        <PizzaTracker
                          trackingStatus={order.trackingStatus}
                          trackingHistory={order.trackingHistory}
                          createdAt={order.createdAt}
                        />
                      </div>

                      {/* Vendedor */}
                      <div className="vendor-card">
                        <div className="vendor-header">
                          <Package size={18} />
                          <span className="vendor-label">Vendedor</span>
                        </div>
                        <p className="vendor-name">CEX Freted - Sociedad Tecnológica Integral</p>
                        <p className="vendor-description">
                          Distribuidor certificado de tecnología reacondicionada
                        </p>
                      </div>

                      {/* Orden de Compra Liberada */}
                      {order.paymentReleaseStatus === 'RELEASED_TO_CUSTOMER' && order.orderReleaseData && (
                        <div className="order-release-section">
                          <h4 className="section-title">Orden de Compra</h4>
                          <OrderRelease
                            orderReleaseData={order.orderReleaseData}
                            paymentMethod={order.payments[0]?.paymentMethod}
                            orderNumber={order.orderNumber}
                          />
                        </div>
                      )}

                      {/* Subida de Comprobante */}
                      {order.paymentReleaseStatus === 'RELEASED_TO_CUSTOMER' &&
                        order.payments[0] &&
                        !order.payments[0].paymentProofVerified && (
                          <div className="proof-uploader-section">
                            <h4 className="section-title">Comprobante de Pago</h4>
                            <PaymentProofUploader
                              payment={order.payments[0]}
                              onUploadSuccess={() => {
                                fetchOrders();
                              }}
                            />
                          </div>
                        )}

                      {/* Estado de Liberación (solo si NO está liberada) */}
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
                          <span className="info-label">Dirección de envío:</span>
                          <p>
                            {order.shippingAddress}, {order.shippingCity}, {order.shippingState} - CP{' '}
                            {order.shippingPostalCode}
                          </p>
                        </div>
                      )}

                      <div className="order-actions">
                        <button type="button" className="order-action order-action--primary">
                          Ver detalle
                          <ChevronRight size={16} aria-hidden="true" />
                        </button>
                      </div>
                    </footer>
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
        }

        .shipping-info {
          margin-top: 16px;
          padding: 16px 20px;
          border: 1px dashed rgba(59, 130, 246, 0.35);
          border-radius: 14px;
          background-color: rgba(59, 130, 246, 0.05);
          font-size: 14px;
        }

        .shipping-info p {
          margin: 4px 0 0;
          color: rgba(15, 23, 42, 0.8);
        }

        .order-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 20px;
        }

        .order-action {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 18px;
          border-radius: 12px;
          border: 1px solid rgba(148, 163, 184, 0.2);
          background-color: white;
          font-size: 14px;
          font-weight: 600;
          color: #0f172a;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .order-action:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 20px rgba(15, 23, 42, 0.14);
        }

        .order-action--primary {
          background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
          border: none;
          color: white;
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
        }

        @media (max-width: 540px) {
          .filter-chip {
            flex: 1 1 auto;
            text-align: center;
          }

          .order-actions {
            flex-direction: column;
          }

          .order-action {
            width: 100%;
            justify-content: center;
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

