import React, { useState, useEffect } from 'react';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/layout/AdminLayout';
import {
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  RefreshCw,
  Loader,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { formatOrderStatus, formatPaymentMethod, formatPaymentStatus } from '../../utils/checkoutHelper';

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const formatCurrency = (amount) =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(amount);

const AdminPagosPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pendingPayments, setPendingPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPayment, setExpandedPayment] = useState(null);
  const [processing, setProcessing] = useState({});

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user.role !== 'SOPORTE') {
      router.push('/soporte/login');
    }
  }, [session, status, router]);

  useEffect(() => {
    if (session && session.user.role === 'SOPORTE') {
      fetchData();
    }
  }, [session]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [paymentsRes, statsRes] = await Promise.all([
        fetch('/api/admin/payments/pending', { credentials: 'include' }),
        fetch('/api/admin/payments/stats', { credentials: 'include' }),
      ]);

      if (
        paymentsRes.status === 401 ||
        paymentsRes.status === 403 ||
        statsRes.status === 401 ||
        statsRes.status === 403
      ) {
        router.push('/soporte/login');
        return;
      }

      const paymentsData = await paymentsRes.json();
      const statsData = await statsRes.json();

      if (paymentsRes.ok && paymentsData.success) {
        setPendingPayments(paymentsData.payments);
      } else if (!paymentsRes.ok) {
        throw new Error(paymentsData.error || 'No se pudieron obtener los pagos pendientes');
      }

      if (statsRes.ok && statsData.success) {
        setStats(statsData.stats);
      } else if (!statsRes.ok) {
        throw new Error(statsData.error || 'No se pudieron obtener las estadísticas');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async (paymentId) => {
    if (!confirm('¿Confirmar este pago?')) return;

    setProcessing((prev) => ({ ...prev, [paymentId]: 'confirming' }));

    try {
      const transactionId = `MANUAL-${Date.now()}`;

      const response = await fetch('/api/admin/payments/confirm', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId,
          transactionId,
          notes: 'Pago confirmado manualmente por administrador',
        }),
      });

      if (response.status === 401 || response.status === 403) {
        alert('Tu sesión expiró. Vuelve a iniciar sesión de soporte.');
        router.push('/soporte/login');
        return;
      }

      const data = await response.json();

      if (response.ok && data.success) {
        alert('Pago confirmado exitosamente');
        fetchData();
      } else {
        alert('Error al confirmar el pago: ' + (data.error || 'Error desconocido'));
      }
    } catch (err) {
      console.error('Error confirming payment:', err);
      alert('Error de conexión');
    } finally {
      setProcessing((prev) => ({ ...prev, [paymentId]: null }));
    }
  };

  const handleCancelPayment = async (paymentId) => {
    const reason = prompt('¿Razón de cancelación?');
    if (!reason) return;

    setProcessing((prev) => ({ ...prev, [paymentId]: 'canceling' }));

    try {
      const response = await fetch('/api/admin/payments/cancel', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId,
          reason,
        }),
      });

      if (response.status === 401 || response.status === 403) {
        alert('Tu sesión expiró. Vuelve a iniciar sesión de soporte.');
        router.push('/soporte/login');
        return;
      }

      const data = await response.json();

      if (response.ok && data.success) {
        alert('Pago cancelado exitosamente');
        fetchData();
      } else {
        alert('Error al cancelar el pago: ' + (data.error || 'Error desconocido'));
      }
    } catch (err) {
      console.error('Error canceling payment:', err);
      alert('Error de conexión');
    } finally {
      setProcessing((prev) => ({ ...prev, [paymentId]: null }));
    }
  };

  if (status === 'loading' || loading) {
    return (
      <AdminLayout>
        <div className="loading-state">
          <Loader className="spinner" size={48} />
          <p>Cargando datos...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!session || session.user.role !== 'SOPORTE') {
    return null;
  }

  return (
    <AdminLayout>
      <div className="admin-container">
        <header className="page-header">
          <div>
            <h1>Panel de Pagos</h1>
            <p>Gestiona y confirma los pagos de las órdenes</p>
          </div>
          <button type="button" onClick={fetchData} className="refresh-btn" disabled={loading}>
            <RefreshCw size={18} className={loading ? 'spinning' : ''} />
            Actualizar
          </button>
        </header>

        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#2563eb' }}>
                <Package size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-label">Total Órdenes</span>
                <span className="stat-value">{stats.totalOrders}</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(251, 146, 60, 0.1)', color: '#ea580c' }}>
                <Clock size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-label">Pagos Pendientes</span>
                <span className="stat-value">{stats.pendingPayments}</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#16a34a' }}>
                <CheckCircle size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-label">Pagos Completados</span>
                <span className="stat-value">{stats.completedPayments}</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#059669' }}>
                <DollarSign size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-label">Ingresos Totales</span>
                <span className="stat-value">{formatCurrency(stats.totalRevenue)}</span>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="loading-state">
            <Loader className="spinner" size={48} />
            <p>Cargando datos...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <XCircle size={32} />
            <p>{error}</p>
            <button type="button" onClick={fetchData} className="retry-btn">
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="payments-section">
            <h2 className="section-title">
              Pagos Pendientes de Confirmación ({pendingPayments.length})
            </h2>

            {pendingPayments.length === 0 ? (
              <div className="empty-state">
                <CheckCircle size={40} />
                <h3>No hay pagos pendientes</h3>
                <p>Todos los pagos han sido procesados</p>
              </div>
            ) : (
              <div className="payments-list">
                {pendingPayments.map((payment) => {
                  const isExpanded = expandedPayment === payment.id;
                  const isProcessing = processing[payment.id];
                  const order = payment.order;
                  const paymentStatusInfo = formatPaymentStatus(payment.status);
                  const items = Array.isArray(order.items) ? order.items : [];

                  return (
                    <div key={payment.id} className="payment-card">
                      <div className="payment-header" onClick={() => setExpandedPayment(isExpanded ? null : payment.id)}>
                        <div className="payment-main">
                          <div className="payment-info">
                            <h3>{order.orderNumber}</h3>
                            <p className="payment-date">{formatDate(payment.createdAt)}</p>
                          </div>
                          <div className="payment-meta">
                            <span className="payment-amount">{formatCurrency(payment.amount)}</span>
                            <span className="payment-method">{formatPaymentMethod(payment.paymentMethod)}</span>
                          </div>
                        </div>
                        <button type="button" className="expand-btn">
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="payment-details">
                          <div className="detail-grid">
                            <div className="detail-item">
                              <span className="detail-label">Referencia de Pago:</span>
                              <span className="detail-value detail-value--code">{payment.referenceNumber}</span>
                            </div>

                            <div className="detail-item">
                              <span className="detail-label">Cliente:</span>
                              <span className="detail-value">{order.customerName}</span>
                            </div>

                            <div className="detail-item">
                              <span className="detail-label">Email:</span>
                              <span className="detail-value">{order.customerEmail}</span>
                            </div>

                            <div className="detail-item">
                              <span className="detail-label">Teléfono:</span>
                              <span className="detail-value">{order.customerPhone}</span>
                            </div>

                            <div className="detail-item full-width">
                              <span className="detail-label">Dirección de Envío:</span>
                              <span className="detail-value">
                                {order.shippingAddress}, {order.shippingCity}, {order.shippingState} - CP{' '}
                                {order.shippingPostalCode}
                              </span>
                            </div>

                            {order.shippingReferences && (
                              <div className="detail-item full-width">
                                <span className="detail-label">Referencias:</span>
                                <span className="detail-value">{order.shippingReferences}</span>
                              </div>
                            )}
                          </div>

                          <div className="items-section">
                            <h4>Items del pedido:</h4>
                            <div className="items-list">
                              {items.map((item, index) => (
                                <div key={index} className="item-row">
                                  <span className="item-name">{item.name || item.slug}</span>
                                  <span className="item-quantity">x{item.quantity}</span>
                                  <span className="item-price">{formatCurrency(item.price)}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="payment-actions">
                            <button
                              type="button"
                              onClick={() => handleConfirmPayment(payment.id)}
                              disabled={isProcessing}
                              className="action-btn action-btn--confirm"
                            >
                              {isProcessing === 'confirming' ? (
                                <>
                                  <Loader className="btn-spinner" size={16} />
                                  Confirmando...
                                </>
                              ) : (
                                <>
                                  <CheckCircle size={16} />
                                  Confirmar Pago
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleCancelPayment(payment.id)}
                              disabled={isProcessing}
                              className="action-btn action-btn--cancel"
                            >
                              {isProcessing === 'canceling' ? (
                                <>
                                  <Loader className="btn-spinner" size={16} />
                                  Cancelando...
                                </>
                              ) : (
                                <>
                                  <XCircle size={16} />
                                  Cancelar Pago
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .admin-container {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          padding: 28px 32px;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
        }

        .page-header h1 {
          margin: 0 0 6px;
          font-size: 2rem;
          color: #0f172a;
        }

        .page-header p {
          margin: 0;
          color: rgba(15, 23, 42, 0.6);
        }

        .refresh-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border: none;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .refresh-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(37, 99, 235, 0.3);
        }

        .refresh-btn:disabled {
          opacity: 0.7;
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

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
        }

        .stat-card {
          background: white;
          padding: 24px;
          border-radius: 14px;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
          display: flex;
          gap: 16px;
          align-items: center;
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
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-label {
          font-size: 0.85rem;
          color: rgba(15, 23, 42, 0.6);
          font-weight: 600;
        }

        .stat-value {
          font-size: 1.8rem;
          font-weight: 700;
          color: #0f172a;
        }

        .loading-state,
        .error-state,
        .empty-state {
          background: white;
          padding: 60px 40px;
          border-radius: 16px;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 16px;
          align-items: center;
        }

        .spinner,
        .btn-spinner {
          animation: spin 1s linear infinite;
          color: #2563eb;
        }

        .retry-btn {
          padding: 12px 24px;
          border: none;
          background: #2563eb;
          color: white;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
        }

        .payments-section {
          background: white;
          padding: 32px;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
        }

        .section-title {
          margin: 0 0 24px;
          font-size: 1.5rem;
          color: #0f172a;
        }

        .payments-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .payment-card {
          border: 1px solid rgba(15, 23, 42, 0.12);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.2s;
        }

        .payment-card:hover {
          box-shadow: 0 8px 16px rgba(15, 23, 42, 0.1);
        }

        .payment-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          cursor: pointer;
          background: rgba(15, 23, 42, 0.02);
        }

        .payment-header:hover {
          background: rgba(15, 23, 42, 0.04);
        }

        .payment-main {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex: 1;
          gap: 20px;
        }

        .payment-info h3 {
          margin: 0 0 4px;
          font-size: 1.1rem;
          color: #0f172a;
        }

        .payment-date {
          margin: 0;
          font-size: 0.85rem;
          color: rgba(15, 23, 42, 0.6);
        }

        .payment-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
        }

        .payment-amount {
          font-size: 1.3rem;
          font-weight: 700;
          color: #2563eb;
        }

        .payment-method {
          font-size: 0.85rem;
          color: rgba(15, 23, 42, 0.6);
        }

        .expand-btn {
          padding: 8px;
          border: none;
          background: none;
          color: rgba(15, 23, 42, 0.6);
          cursor: pointer;
        }

        .payment-details {
          padding: 24px;
          border-top: 1px solid rgba(15, 23, 42, 0.08);
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .detail-item.full-width {
          grid-column: 1 / -1;
        }

        .detail-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: rgba(15, 23, 42, 0.6);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .detail-value {
          font-size: 0.95rem;
          color: #0f172a;
        }

        .detail-value--code {
          font-family: 'Courier New', monospace;
          font-weight: 600;
          color: #2563eb;
        }

        .items-section h4 {
          margin: 0 0 12px;
          font-size: 1rem;
          color: #0f172a;
        }

        .items-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .item-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: rgba(15, 23, 42, 0.02);
          border-radius: 8px;
        }

        .item-name {
          flex: 1;
          font-weight: 600;
          color: #0f172a;
        }

        .item-quantity {
          margin: 0 16px;
          color: rgba(15, 23, 42, 0.6);
        }

        .item-price {
          font-weight: 700;
          color: #2563eb;
        }

        .payment-actions {
          display: flex;
          gap: 12px;
          padding-top: 16px;
          border-top: 1px solid rgba(15, 23, 42, 0.08);
        }

        .action-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 24px;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .action-btn--confirm {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }

        .action-btn--confirm:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(16, 185, 129, 0.3);
        }

        .action-btn--cancel {
          background: rgba(239, 68, 68, 0.1);
          color: #dc2626;
        }

        .action-btn--cancel:hover:not(:disabled) {
          background: rgba(239, 68, 68, 0.15);
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .payment-main {
            flex-direction: column;
            align-items: flex-start;
          }

          .payment-meta {
            align-items: flex-start;
          }

          .payment-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </AdminLayout>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/soporte/login',
        permanent: false,
      },
    };
  }

  // Verificar que el usuario tenga rol SOPORTE
  if (session.user.role !== 'SOPORTE') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default AdminPagosPage;
