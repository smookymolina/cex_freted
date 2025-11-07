import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/layout/AdminLayout';
import {
  Search,
  ChevronDown,
  ChevronUp,
  Package,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  CreditCard,
  RefreshCw,
  Loader,
} from 'lucide-react';
import { formatOrderStatus, formatPaymentMethod } from '../../utils/checkoutHelper';

const AdminOrdersPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user.role !== 'SOPORTE') {
      router.push('/soporte/login');
    }
  }, [session, status, router]);

  useEffect(() => {
    if (session && session.user.role === 'SOPORTE') {
      fetchOrders();
    }
  }, [session]);

  useEffect(() => {
    // Filtrar órdenes por búsqueda
    if (searchTerm.trim() === '') {
      setFilteredOrders(orders);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = orders.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(term) ||
          order.user.name.toLowerCase().includes(term) ||
          order.user.email.toLowerCase().includes(term) ||
          order.customerName.toLowerCase().includes(term) ||
          order.customerEmail.toLowerCase().includes(term)
      );
      setFilteredOrders(filtered);
    }
  }, [searchTerm, orders]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/orders');
      if (!res.ok) {
        throw new Error('No se pudieron obtener las órdenes');
      }
      const data = await res.json();
      setOrders(data.data);
      setFilteredOrders(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    if (!confirm(`¿Cambiar el estado de la orden a ${formatOrderStatus(newStatus).label}?`)) {
      return;
    }

    setUpdatingStatus(orderId);

    try {
      const res = await fetch('/api/admin/orders/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          status: newStatus,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al actualizar el estado');
      }

      // Actualizar la orden en el estado local
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      alert('Estado actualizado exitosamente');
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setUpdatingStatus(null);
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  if (status === 'loading' || loading) {
    return (
      <AdminLayout>
        <div className="loading-container">
          <Loader className="spinner" size={48} />
          <p>Cargando órdenes...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="error-container">
          <p>Error: {error}</p>
          <button onClick={fetchOrders} className="retry-btn">
            Reintentar
          </button>
        </div>
      </AdminLayout>
    );
  }

  if (!session || session.user.role !== 'SOPORTE') {
    return null;
  }

  const orderStatuses = [
    'PENDING',
    'PAYMENT_CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
    'REFUNDED',
  ];

  return (
    <AdminLayout>
      <div className="admin-container">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1>Gestión de Órdenes</h1>
            <p>Panel de soporte técnico - {filteredOrders.length} órdenes encontradas</p>
          </div>
          <button onClick={fetchOrders} className="refresh-btn" disabled={loading}>
            <RefreshCw size={18} className={loading ? 'spinning' : ''} />
            Actualizar
          </button>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Buscar por número de orden, cliente o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <Package size={48} />
            <h3>No se encontraron órdenes</h3>
            <p>No hay órdenes que coincidan con tu búsqueda</p>
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map((order) => {
              const isExpanded = expandedOrder === order.id;
              const statusInfo = formatOrderStatus(order.status);
              const items = Array.isArray(order.items) ? order.items : [];

              return (
                <div key={order.id} className="order-card">
                  {/* Order Header */}
                  <div
                    className="order-header"
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  >
                    <div className="order-main">
                      <div className="order-info">
                        <h3>{order.orderNumber}</h3>
                        <p className="order-date">{formatDate(order.createdAt)}</p>
                      </div>
                      <div className="order-meta">
                        <span
                          className="order-status"
                          style={{ background: statusInfo.color + '20', color: statusInfo.color }}
                        >
                          {statusInfo.label}
                        </span>
                        <span className="order-total">{formatCurrency(order.total)}</span>
                      </div>
                    </div>
                    <button className="expand-btn">
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>

                  {/* Order Details (Expandable) */}
                  {isExpanded && (
                    <div className="order-details">
                      {/* Customer Info */}
                      <div className="details-section">
                        <h4>
                          <User size={18} />
                          Información del Cliente
                        </h4>
                        <div className="detail-grid">
                          <div className="detail-item">
                            <span className="label">Nombre:</span>
                            <span className="value">{order.customerName}</span>
                          </div>
                          <div className="detail-item">
                            <Mail size={16} />
                            <span className="value">{order.customerEmail}</span>
                          </div>
                          <div className="detail-item">
                            <Phone size={16} />
                            <span className="value">{order.customerPhone}</span>
                          </div>
                        </div>
                      </div>

                      {/* Shipping Address */}
                      <div className="details-section">
                        <h4>
                          <MapPin size={18} />
                          Dirección de Envío
                        </h4>
                        <div className="address-box">
                          <p>{order.shippingAddress}</p>
                          <p>
                            {order.shippingCity}, {order.shippingState} - CP {order.shippingPostalCode}
                          </p>
                          {order.shippingReferences && (
                            <p className="references">Referencias: {order.shippingReferences}</p>
                          )}
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="details-section">
                        <h4>
                          <Package size={18} />
                          Productos Ordenados
                        </h4>
                        <div className="items-list">
                          {items.map((item, index) => (
                            <div key={index} className="item-row">
                              <span className="item-name">{item.name || item.slug}</span>
                              <span className="item-quantity">x{item.quantity}</span>
                              <span className="item-price">{formatCurrency(item.price)}</span>
                            </div>
                          ))}
                          <div className="totals">
                            <div className="total-row">
                              <span>Subtotal:</span>
                              <span>{formatCurrency(order.subtotal)}</span>
                            </div>
                            {order.shippingCost > 0 && (
                              <div className="total-row">
                                <span>Envío:</span>
                                <span>{formatCurrency(order.shippingCost)}</span>
                              </div>
                            )}
                            <div className="total-row total-final">
                              <span>Total:</span>
                              <span>{formatCurrency(order.total)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Payment Info */}
                      {order.payments && order.payments.length > 0 && (
                        <div className="details-section">
                          <h4>
                            <CreditCard size={18} />
                            Información de Pago
                          </h4>
                          {order.payments.map((payment) => (
                            <div key={payment.id} className="payment-info">
                              <div className="detail-item">
                                <span className="label">Método:</span>
                                <span className="value">{formatPaymentMethod(payment.paymentMethod)}</span>
                              </div>
                              <div className="detail-item">
                                <span className="label">Estado:</span>
                                <span className="value">{payment.status}</span>
                              </div>
                              {payment.referenceNumber && (
                                <div className="detail-item">
                                  <span className="label">Referencia:</span>
                                  <span className="value value-code">{payment.referenceNumber}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Update Status */}
                      <div className="details-section">
                        <h4>Actualizar Estado de Orden</h4>
                        <div className="status-actions">
                          {orderStatuses.map((statusOption) => {
                            const statusInfo = formatOrderStatus(statusOption);
                            const isCurrent = order.status === statusOption;
                            const isUpdating = updatingStatus === order.id;

                            return (
                              <button
                                key={statusOption}
                                onClick={() => handleUpdateStatus(order.id, statusOption)}
                                disabled={isCurrent || isUpdating}
                                className={`status-btn ${isCurrent ? 'current' : ''}`}
                                style={{
                                  borderColor: statusInfo.color,
                                  color: isCurrent ? 'white' : statusInfo.color,
                                  background: isCurrent ? statusInfo.color : 'transparent',
                                }}
                              >
                                {isUpdating && <Loader className="btn-spinner" size={14} />}
                                {statusInfo.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        .admin-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
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
          color: #64748b;
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

        .search-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
        }

        .search-bar input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 1rem;
          color: #0f172a;
        }

        .search-bar input::placeholder {
          color: #94a3b8;
        }

        .loading-container,
        .error-container,
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

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .order-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
          overflow: hidden;
          transition: all 0.2s;
        }

        .order-card:hover {
          box-shadow: 0 8px 16px rgba(15, 23, 42, 0.12);
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          cursor: pointer;
          background: rgba(15, 23, 42, 0.02);
        }

        .order-header:hover {
          background: rgba(15, 23, 42, 0.04);
        }

        .order-main {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex: 1;
          gap: 20px;
        }

        .order-info h3 {
          margin: 0 0 4px;
          font-size: 1.1rem;
          color: #0f172a;
          font-weight: 600;
        }

        .order-date {
          margin: 0;
          font-size: 0.85rem;
          color: #64748b;
        }

        .order-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
        }

        .order-status {
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .order-total {
          font-size: 1.3rem;
          font-weight: 700;
          color: #2563eb;
        }

        .expand-btn {
          padding: 8px;
          border: none;
          background: none;
          color: #64748b;
          cursor: pointer;
        }

        .order-details {
          padding: 24px;
          border-top: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .details-section h4 {
          margin: 0 0 16px;
          font-size: 1rem;
          color: #0f172a;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .detail-item .label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #64748b;
        }

        .detail-item .value {
          font-size: 0.95rem;
          color: #0f172a;
        }

        .value-code {
          font-family: 'Courier New', monospace;
          font-weight: 600;
          color: #2563eb;
        }

        .address-box {
          padding: 16px;
          background: #f8fafc;
          border-radius: 8px;
          border-left: 4px solid #2563eb;
        }

        .address-box p {
          margin: 4px 0;
          color: #0f172a;
        }

        .references {
          margin-top: 8px;
          font-size: 0.9rem;
          color: #64748b;
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
          background: #f8fafc;
          border-radius: 8px;
        }

        .item-name {
          flex: 1;
          font-weight: 600;
          color: #0f172a;
        }

        .item-quantity {
          margin: 0 16px;
          color: #64748b;
        }

        .item-price {
          font-weight: 700;
          color: #2563eb;
        }

        .totals {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #e2e8f0;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 16px;
          font-size: 0.95rem;
        }

        .total-final {
          font-size: 1.1rem;
          font-weight: 700;
          color: #2563eb;
          background: rgba(37, 99, 235, 0.05);
          border-radius: 8px;
          margin-top: 8px;
        }

        .payment-info {
          padding: 16px;
          background: #f8fafc;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .status-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .status-btn {
          padding: 10px 16px;
          border: 2px solid;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .status-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .status-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .status-btn.current {
          cursor: default;
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .order-main {
            flex-direction: column;
            align-items: flex-start;
          }

          .order-meta {
            align-items: flex-start;
          }

          .status-actions {
            flex-direction: column;
          }

          .status-btn {
            width: 100%;
          }
        }
      `}</style>
    </AdminLayout>
  );
};

export default AdminOrdersPage;
