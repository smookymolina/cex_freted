import React, { useState } from 'react';
import { getSession } from 'next-auth/react';
import AccountLayout from '../../components/mi-cuenta/AccountLayout';
import { Package, Truck, CheckCircle, XCircle, Clock, ChevronRight, Download } from 'lucide-react';

// Datos de ejemplo (en producción vendrían de una API)
const mockOrders = [
  {
    id: 'ORD-2024-001',
    date: '2024-10-28',
    status: 'delivered',
    total: 17980,
    items: [
      {
        name: 'iPhone 14 Pro 128GB',
        grade: 'A+',
        price: 17980,
        quantity: 1,
        image: '/assets/images/products/iphone-14-pro.png',
      },
    ],
    tracking: 'TRK123456789',
    deliveryDate: '2024-10-30',
  },
  {
    id: 'ORD-2024-002',
    date: '2024-10-25',
    status: 'shipped',
    total: 8500,
    items: [
      {
        name: 'MacBook Air M1',
        grade: 'A',
        price: 8500,
        quantity: 1,
        image: '/assets/images/products/macbook-air.png',
      },
    ],
    tracking: 'TRK987654321',
    estimatedDelivery: '2024-10-29',
  },
  {
    id: 'ORD-2024-003',
    date: '2024-10-20',
    status: 'processing',
    total: 3200,
    items: [
      {
        name: 'AirPods Pro',
        grade: 'A+',
        price: 3200,
        quantity: 1,
        image: '/assets/images/products/airpods-pro.png',
      },
    ],
  },
];

const statusConfig = {
  processing: {
    label: 'En proceso',
    tone: '#f97316',
    background: 'rgba(249, 115, 22, 0.12)',
    icon: Clock,
  },
  shipped: {
    label: 'Enviado',
    tone: '#0ea5e9',
    background: 'rgba(14, 165, 233, 0.15)',
    icon: Truck,
  },
  delivered: {
    label: 'Entregado',
    tone: '#22c55e',
    background: 'rgba(34, 197, 94, 0.16)',
    icon: CheckCircle,
  },
  cancelled: {
    label: 'Cancelado',
    tone: '#f87171',
    background: 'rgba(248, 113, 113, 0.16)',
    icon: XCircle,
  },
};

const filters = [
  { id: 'all', label: 'Todos' },
  { id: 'processing', label: 'En proceso' },
  { id: 'shipped', label: 'Enviados' },
  { id: 'delivered', label: 'Entregados' },
  { id: 'cancelled', label: 'Cancelados' },
];

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

const PedidosPage = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredOrders =
    selectedFilter === 'all' ? mockOrders : mockOrders.filter((order) => order.status === selectedFilter);

  return (
    <AccountLayout title="Mis Pedidos">
      <div className="orders-container">
        <section className="filters-card">
          <h3 className="filters-title">Filtrar pedidos</h3>
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

        <div className="orders-list">
          {filteredOrders.length === 0 ? (
            <div className="empty-state">
              <Package size={32} />
              <h4>No hay pedidos en esta categoría</h4>
              <p>Explora tus compras o filtra por otro estado para ver tus órdenes recientes.</p>
              <a href="/comprar" className="empty-action">
                Ir a comprar
              </a>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const status = statusConfig[order.status] || statusConfig.processing;
              const StatusIcon = status.icon;

              return (
                <article key={order.id} className="order-card">
                  <header className="order-header">
                    <div className="order-meta">
                      <span className="order-id">{order.id}</span>
                      <span className="order-date">{formatDate(order.date)}</span>
                    </div>
                    <span className="order-status" style={{ color: status.tone, backgroundColor: status.background }}>
                      <StatusIcon size={16} aria-hidden="true" />
                      {status.label}
                    </span>
                  </header>

                  <div className="order-body">
                    {order.items.map((item, index) => (
                      <div key={`${order.id}-${index}`} className="order-item">
                        <div className="item-thumbnail">
                          <img src={item.image} alt={item.name} />
                        </div>
                        <div className="item-details">
                          <p className="item-name">{item.name}</p>
                          <span className="item-grade">Condición: {item.grade}</span>
                          <span className="item-quantity">Cantidad: {item.quantity}</span>
                        </div>
                        <div className="item-price">{formatCurrency(item.price)}</div>
                      </div>
                    ))}
                  </div>

                  <footer className="order-footer">
                    <div className="order-summary">
                      <span>Total</span>
                      <strong>{formatCurrency(order.total)}</strong>
                    </div>

                    {(order.tracking || order.deliveryDate || order.estimatedDelivery) && (
                      <div className="order-tracking">
                        <span className="tracking-label">Seguimiento</span>
                        {order.tracking && <span className="tracking-code">{order.tracking}</span>}
                        {order.deliveryDate && (
                          <span className="tracking-info">Entregado el {formatDate(order.deliveryDate)}</span>
                        )}
                        {order.estimatedDelivery && (
                          <span className="tracking-info">Entrega estimada: {formatDate(order.estimatedDelivery)}</span>
                        )}
                      </div>
                    )}

                    <div className="order-actions">
                      <button type="button" className="order-action order-action--primary">
                        Ver detalle
                        <ChevronRight size={16} aria-hidden="true" />
                      </button>
                      <button type="button" className="order-action">
                        <Download size={16} aria-hidden="true" />
                        Descargar factura
                      </button>
                    </div>
                  </footer>
                </article>
              );
            })
          )}
        </div>
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

        .filters-title {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
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

        .order-footer {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .order-summary {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 18px;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(14, 165, 233, 0.1) 100%);
          font-size: 14px;
          font-weight: 600;
          color: #0f172a;
        }

        .order-summary strong {
          font-size: 18px;
          color: #1d4ed8;
        }

        .order-tracking {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, auto));
          gap: 12px;
          align-items: center;
          padding: 14px 16px;
          border: 1px dashed rgba(59, 130, 246, 0.35);
          border-radius: 14px;
          background-color: rgba(59, 130, 246, 0.08);
          font-size: 13px;
          color: rgba(15, 23, 42, 0.7);
        }

        .tracking-label {
          font-weight: 700;
          color: #1d4ed8;
        }

        .tracking-code {
          font-family: 'Fira Code', 'Courier New', monospace;
        }

        .tracking-info {
          font-style: italic;
        }

        .order-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
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
