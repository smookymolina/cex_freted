import React, { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import AccountLayout from '../../components/mi-cuenta/AccountLayout';
import { Package, ShoppingBag, User, Settings, TrendingUp, Clock, CheckCircle, Loader } from 'lucide-react';
import { formatOrderStatus } from '../../utils/checkoutHelper';

const DashboardPage = () => {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    delivered: 0,
    totalSpent: 0,
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/payments/my-orders');
      const data = await response.json();

      if (response.ok && data.success) {
        const userOrders = data.orders;
        setOrders(userOrders.slice(0, 5)); // Mostrar solo los 5 más recientes

        // Calcular estadísticas
        const total = userOrders.length;
        const pending = userOrders.filter(
          (o) => o.status === 'PENDING' || o.status === 'PAYMENT_CONFIRMED' || o.status === 'PROCESSING'
        ).length;
        const delivered = userOrders.filter((o) => o.status === 'DELIVERED').length;
        const totalSpent = userOrders.reduce((sum, order) => sum + (order.total || 0), 0);

        setStats({ total, pending, delivered, totalSpent });
      }
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const quickLinks = [
    {
      title: 'Ver todos mis pedidos',
      description: 'Revisa el estado de tus órdenes',
      icon: Package,
      href: '/mi-cuenta/pedidos',
      color: '#2563eb',
    },
    {
      title: 'Ir a comprar',
      description: 'Explora productos certificados',
      icon: ShoppingBag,
      href: '/comprar',
      color: '#059669',
    },
    {
      title: 'Mi perfil',
      description: 'Actualiza tu información',
      icon: User,
      href: '/mi-cuenta/perfil',
      color: '#7c3aed',
    },
    {
      title: 'Configuración',
      description: 'Ajusta tus preferencias',
      icon: Settings,
      href: '/mi-cuenta/configuracion',
      color: '#dc2626',
    },
  ];

  return (
    <AccountLayout title="Dashboard">
      <div className="dashboard-container">
        {/* PASO 3: Tarjetas de estadísticas */}
        <div className="stats-grid">
          <div className="stat-card" style={{ borderLeftColor: '#2563eb' }}>
            <div className="stat-icon" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' }}>
              <Package size={24} />
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.total}</h3>
              <p className="stat-label">Total de pedidos</p>
            </div>
          </div>

          <div className="stat-card" style={{ borderLeftColor: '#f59e0b' }}>
            <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.pending}</h3>
              <p className="stat-label">En proceso</p>
            </div>
          </div>

          <div className="stat-card" style={{ borderLeftColor: '#059669' }}>
            <div className="stat-icon" style={{ background: 'rgba(5, 150, 105, 0.1)', color: '#059669' }}>
              <CheckCircle size={24} />
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.delivered}</h3>
              <p className="stat-label">Entregados</p>
            </div>
          </div>

          <div className="stat-card" style={{ borderLeftColor: '#7c3aed' }}>
            <div className="stat-icon" style={{ background: 'rgba(124, 58, 237, 0.1)', color: '#7c3aed' }}>
              <TrendingUp size={24} />
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{formatCurrency(stats.totalSpent)}</h3>
              <p className="stat-label">Total gastado</p>
            </div>
          </div>
        </div>

        {/* Pedidos recientes */}
        <div className="section-card">
          <div className="section-header">
            <h3 className="section-title">Pedidos recientes</h3>
            <a href="/mi-cuenta/pedidos" className="view-all-link">
              Ver todos
            </a>
          </div>

          {loading ? (
            <div className="loading-state">
              <Loader className="spinner" size={32} />
              <p>Cargando pedidos...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="empty-state">
              <Package size={48} />
              <h4>No tienes pedidos aún</h4>
              <p>Comienza a comprar productos certificados</p>
              <a href="/comprar" className="cta-button">
                Ir a comprar
              </a>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => {
                const statusInfo = formatOrderStatus(order.status);
                return (
                  <div key={order.id} className="order-item">
                    <div className="order-main-info">
                      <div className="order-number-date">
                        <span className="order-number">{order.orderNumber}</span>
                        <span className="order-date">{formatDate(order.createdAt)}</span>
                      </div>
                      <span
                        className="order-status-badge"
                        style={{
                          color: statusInfo.color,
                          background: `${statusInfo.color}20`,
                        }}
                      >
                        {statusInfo.label}
                      </span>
                    </div>
                    <div className="order-total-value">{formatCurrency(order.total)}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* PASO 4: Enlaces rápidos */}
        <div className="quick-links-section">
          <h3 className="section-title">Accesos rápidos</h3>
          <div className="quick-links-grid">
            {quickLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <a key={index} href={link.href} className="quick-link-card">
                  <div className="quick-link-icon" style={{ background: `${link.color}15`, color: link.color }}>
                    <Icon size={24} />
                  </div>
                  <div className="quick-link-content">
                    <h4 className="quick-link-title">{link.title}</h4>
                    <p className="quick-link-description">{link.description}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-container {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
        }

        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
          border-left: 4px solid;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(15, 23, 42, 0.12);
        }

        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-content {
          flex: 1;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 4px;
        }

        .stat-label {
          font-size: 14px;
          color: #64748b;
          margin: 0;
        }

        .section-card {
          background: white;
          border-radius: 18px;
          padding: 28px 32px;
          box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);
          border: 1px solid rgba(148, 163, 184, 0.15);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .section-title {
          font-size: 20px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }

        .view-all-link {
          color: #2563eb;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s;
        }

        .view-all-link:hover {
          color: #1d4ed8;
          text-decoration: underline;
        }

        .loading-state,
        .empty-state {
          padding: 48px 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          color: #64748b;
        }

        .spinner {
          animation: spin 1s linear infinite;
          color: #2563eb;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .empty-state h4 {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }

        .empty-state p {
          margin: 0;
        }

        .cta-button {
          margin-top: 8px;
          padding: 12px 24px;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .order-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-radius: 12px;
          border: 1px solid rgba(148, 163, 184, 0.15);
          transition: all 0.2s;
        }

        .order-item:hover {
          background: #ffffff;
          border-color: #2563eb;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.12);
        }

        .order-main-info {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }

        .order-number-date {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .order-number {
          font-weight: 700;
          color: #0f172a;
          font-size: 15px;
        }

        .order-date {
          font-size: 13px;
          color: #64748b;
        }

        .order-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          width: fit-content;
        }

        .order-total-value {
          font-size: 18px;
          font-weight: 700;
          color: #2563eb;
        }

        .quick-links-section {
          margin-top: 8px;
        }

        .quick-links-grid {
          margin-top: 20px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }

        .quick-link-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
          border: 1px solid rgba(148, 163, 184, 0.15);
          display: flex;
          align-items: flex-start;
          gap: 16px;
          text-decoration: none;
          transition: all 0.2s;
        }

        .quick-link-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(15, 23, 42, 0.12);
          border-color: rgba(37, 99, 235, 0.3);
        }

        .quick-link-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .quick-link-content {
          flex: 1;
        }

        .quick-link-title {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 6px;
        }

        .quick-link-description {
          font-size: 14px;
          color: #64748b;
          margin: 0;
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .section-card {
            padding: 20px 24px;
          }

          .order-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .order-total-value {
            align-self: flex-end;
          }

          .quick-links-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 540px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .stat-card {
            padding: 20px;
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

  // Si es soporte, redirigir al panel de admin
  if (session.user.role === 'SOPORTE') {
    return {
      redirect: {
        destination: '/admin/ordenes',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default DashboardPage;
