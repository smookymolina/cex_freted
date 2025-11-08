import { useState, useEffect, useMemo } from 'react';
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
  Filter,
  X,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Clock,
  FileText,
  Copy,
  Check,
} from 'lucide-react';
import {
  formatOrderStatus,
  formatPaymentMethod,
  formatPaymentStatus,
  formatReleaseStatus,
} from '../../utils/checkoutHelper';

const extractOrder = (payload) => payload?.data?.order || payload?.order || null;
import { useToast } from '../../context/ToastContext';

const AdminOrdersPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const toast = useToast();

  // Estados principales
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  // Estados de búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterPaymentMethod, setFilterPaymentMethod] = useState('ALL');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [filterMinAmount, setFilterMinAmount] = useState('');
  const [filterMaxAmount, setFilterMaxAmount] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Estados de UI
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [updatingRelease, setUpdatingRelease] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedOrderNumber, setCopiedOrderNumber] = useState(null);

  // Estados de modales
  const [confirmPaymentModal, setConfirmPaymentModal] = useState(null);
  const [cancelPaymentModal, setCancelPaymentModal] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);

  // Estados de notas de orden
  const [orderNotes, setOrderNotes] = useState({});
  const [editingNotes, setEditingNotes] = useState(null);
  const [updatingNotes, setUpdatingNotes] = useState(null);

  const ITEMS_PER_PAGE = 10;

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset page when search term changes
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user.role !== 'SOPORTE') {
      router.push('/soporte/login');
      return;
    }
    
    fetchOrders();
    
    // Fetch stats only on initial load or when filters change significantly
    const statsDebounce = setTimeout(() => {
      fetchStats();
    }, 1000);

    return () => clearTimeout(statsDebounce);

  }, [
    session, 
    currentPage, 
    debouncedSearchTerm, 
    filterStatus, 
    filterPaymentMethod, 
    filterDateFrom, 
    filterDateTo, 
    filterMinAmount, 
    filterMaxAmount
  ]);

  const fetchOrders = async () => {
    if (!session) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        searchTerm: debouncedSearchTerm,
        status: filterStatus,
        paymentMethod: filterPaymentMethod,
        dateFrom: filterDateFrom,
        dateTo: filterDateTo,
        minAmount: filterMinAmount,
        maxAmount: filterMaxAmount,
      });
      
      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      
      if (!res.ok) {
        throw new Error('No se pudieron obtener las órdenes');
      }
      
      const result = await res.json();
      const { data, pagination: newPagination } = result.data;

      setOrders(data);
      setPagination(newPagination);

      const notesData = data.reduce((acc, order) => {
        acc[order.id] = order.supportNotes || '';
        return acc;
      }, {});
      setOrderNotes(notesData);

    } catch (err) {
      setError(err.message);
      toast?.error('Error al cargar órdenes');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/payments/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    const statusInfo = formatOrderStatus(newStatus);

    if (!confirm(`¿Cambiar el estado de la orden a ${statusInfo.label}?`)) {
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
      const updatedOrder = extractOrder(data);

      if (!res.ok || !updatedOrder) {
        throw new Error(data.error || data.message || 'Error al actualizar el estado');
      }

      // Actualizar la orden localmente con los datos de la API
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.id === orderId ? updatedOrder : order))
      );

      toast?.success(`Estado actualizado a ${statusInfo.label}`);
      fetchStats();
    } catch (err) {
      toast?.error('Error: ' + err.message);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleUpdateReleaseStatus = async (orderId, newStatus) => {
    const releaseInfo = formatReleaseStatus(newStatus);

    if (!confirm(`¿Actualizar la liberacion a ${releaseInfo.label}?`)) {
      return;
    }

    setUpdatingRelease(orderId);

    try {
      const res = await fetch('/api/admin/orders/update-release', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          releaseStatus: newStatus,
        }),
      });

      const data = await res.json();
      const updatedOrder = extractOrder(data);

      if (!res.ok || !updatedOrder) {
        throw new Error(data.error || data.message || 'No se pudo actualizar la liberacion');
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.id === orderId ? updatedOrder : order))
      );
      toast?.success(`Liberacion actualizada a ${releaseInfo.label}`);
    } catch (err) {
      toast?.error('Error: ' + err.message);
    } finally {
      setUpdatingRelease(null);
    }
  };

  const handleConfirmPayment = async () => {
    if (!confirmPaymentModal) return;

    setProcessingPayment(true);

    try {
      const res = await fetch('/api/admin/payments/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId: confirmPaymentModal.id,
          transactionId: transactionId || undefined,
          notes: paymentNotes || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al confirmar el pago');
      }

      // Actualizar la orden localmente con los datos de la API
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order.id === data.payment.orderId) {
            return {
              ...order,
              status: data.payment.order.status,
              payments: order.payments.map((p) =>
                p.id === data.payment.id ? data.payment : p
              ),
            };
          }
          return order;
        })
      );

      toast?.success('Pago confirmado exitosamente');
      setConfirmPaymentModal(null);
      setTransactionId('');
      setPaymentNotes('');
      fetchStats();
    } catch (err) {
      toast?.error('Error: ' + err.message);
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleCancelPayment = async () => {
    if (!cancelPaymentModal || !cancelReason.trim()) {
      toast?.warning('Por favor ingresa una razón para cancelar');
      return;
    }

    setProcessingPayment(true);

    try {
      const res = await fetch('/api/admin/payments/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId: cancelPaymentModal.id,
          reason: cancelReason,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al cancelar el pago');
      }

      // Actualizar la orden localmente con los datos de la API
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order.id === data.payment.orderId) {
            return {
              ...order,
              status: data.payment.order.status,
              payments: order.payments.map((p) =>
                p.id === data.payment.id ? data.payment : p
              ),
            };
          }
          return order;
        })
      );

      toast?.success('Pago cancelado exitosamente');
      setCancelPaymentModal(null);
      setCancelReason('');
      fetchStats();
    } catch (err) {
      toast?.error('Error: ' + err.message);
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleSaveNotes = async (orderId) => {
    setUpdatingNotes(orderId);
    try {
      const res = await fetch('/api/admin/orders/update-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          notes: orderNotes[orderId],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al guardar las notas');
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, supportNotes: orderNotes[orderId] } : order
        )
      );

      toast?.success('Notas guardadas exitosamente');
    } catch (err) {
      toast?.error(`Error: ${err.message}`);
    } finally {
      setUpdatingNotes(null);
      setEditingNotes(null);
    }
  };

  const handleExportCSV = () => {
    // This should ideally be a new API endpoint that streams the CSV
    // For now, it will only export the current page
    const csvHeaders = [
      'Número de Orden',
      'Fecha',
      'Cliente',
      'Email',
      'Teléfono',
      'Estado',
      'Método de Pago',
      'Total',
    ];

    const csvRows = orders.map((order) => [
      order.orderNumber,
      new Date(order.createdAt).toLocaleDateString('es-ES'),
      order.customerName,
      order.customerEmail,
      order.customerPhone,
      formatOrderStatus(order.status).label,
      order.payments?.[0] ? formatPaymentMethod(order.payments[0].paymentMethod) : 'N/A',
      order.total,
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `ordenes_pagina_${currentPage}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast?.success(`Archivo CSV descargado (Página ${currentPage})`);
  };
  const handleCopyOrderNumber = (orderNumber) => {
    navigator.clipboard.writeText(orderNumber);
    setCopiedOrderNumber(orderNumber);
    toast?.success('Número de orden copiado');
    setTimeout(() => setCopiedOrderNumber(null), 2000);
  };

  const clearFilters = () => {
    setFilterStatus('ALL');
    setFilterPaymentMethod('ALL');
    setFilterDateFrom('');
    setFilterDateTo('');
    setFilterMinAmount('');
    setFilterMaxAmount('');
    setSearchTerm('');
    toast?.info('Filtros limpiados');
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

  const releaseStatuses = [
    'WAITING_SUPPORT',
    'CALL_SCHEDULED',
    'RELEASED_TO_CUSTOMER',
    'ON_HOLD',
  ];

  const paymentMethods = [
    { value: 'BANK_TRANSFER', label: 'Transferencia Bancaria' },
    { value: 'CASH_DEPOSIT', label: 'Depósito en Efectivo' },
    { value: 'PHONE_PAYMENT', label: 'Pago Telefónico' },
    { value: 'STORE_PAYMENT', label: 'Pago en Tienda' },
  ];

  return (
    <AdminLayout>
      <div className="admin-container">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1>Gestión de Órdenes</h1>
            <p>Panel de soporte técnico - {pagination ? `${pagination.total} órdenes encontradas` : 'Cargando...'}</p>
          </div>
          <div className="header-actions">
            <button onClick={handleExportCSV} className="export-btn" disabled={orders.length === 0}>
              <Download size={18} />
              Exportar CSV
            </button>
            <button onClick={fetchOrders} className="refresh-btn" disabled={loading}>
              <RefreshCw size={18} className={loading ? 'spinning' : ''} />
              Actualizar
            </button>
          </div>
        </div>

        {/* PASO 1: Dashboard con Estadísticas */}
        {stats && (
          <div className="stats-grid">
            <div className="stat-card stat-primary">
              <div className="stat-icon">
                <Package size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Total de Órdenes</p>
                <h3 className="stat-value">{stats.totalOrders || 0}</h3>
              </div>
            </div>

            <div className="stat-card stat-warning">
              <div className="stat-icon">
                <Clock size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Pagos Pendientes</p>
                <h3 className="stat-value">{stats.pendingPayments || 0}</h3>
              </div>
            </div>

            <div className="stat-card stat-success">
              <div className="stat-icon">
                <CheckCircle size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Pagos Completados</p>
                <h3 className="stat-value">{stats.completedPayments || 0}</h3>
              </div>
            </div>

            <div className="stat-card stat-revenue">
              <div className="stat-icon">
                <TrendingUp size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Ingresos Totales</p>
                <h3 className="stat-value">{formatCurrency(stats.totalRevenue || 0)}</h3>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar y Filtros */}
        <div className="search-section">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Buscar por número de orden, cliente o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
          >
            <Filter size={18} />
            Filtros
            {(filterStatus !== 'ALL' ||
              filterPaymentMethod !== 'ALL' ||
              filterDateFrom ||
              filterDateTo ||
              filterMinAmount ||
              filterMaxAmount) && <span className="filter-badge">●</span>}
          </button>
        </div>

        {/* PASO 2: Panel de Filtros Avanzados */}
        {showFilters && (
          <div className="filters-panel">
            <div className="filters-grid">
              <div className="filter-group">
                <label>Estado de Orden</label>
                <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}>
                  <option value="ALL">Todos</option>
                  {orderStatuses.map((status) => (
                    <option key={status} value={status}>
                      {formatOrderStatus(status).label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Método de Pago</label>
                <select
                  value={filterPaymentMethod}
                  onChange={(e) => { setFilterPaymentMethod(e.target.value); setCurrentPage(1); }}
                >
                  <option value="ALL">Todos</option>
                  {paymentMethods.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Fecha Desde</label>
                <input
                  type="date"
                  value={filterDateFrom}
                  onChange={(e) => { setFilterDateFrom(e.target.value); setCurrentPage(1); }}
                />
              </div>

              <div className="filter-group">
                <label>Fecha Hasta</label>
                <input
                  type="date"
                  value={filterDateTo}
                  onChange={(e) => { setFilterDateTo(e.target.value); setCurrentPage(1); }}
                />
              </div>

              <div className="filter-group">
                <label>Monto Mínimo</label>
                <input
                  type="number"
                  placeholder="$0"
                  value={filterMinAmount}
                  onChange={(e) => { setFilterMinAmount(e.target.value); setCurrentPage(1); }}
                />
              </div>

              <div className="filter-group">
                <label>Monto Máximo</label>
                <input
                  type="number"
                  placeholder="$999999"
                  value={filterMaxAmount}
                  onChange={(e) => { setFilterMaxAmount(e.target.value); setCurrentPage(1); }}
                />
              </div>
            </div>

            <div className="filters-actions">
              <button onClick={clearFilters} className="clear-filters-btn">
                <X size={16} />
                Limpiar filtros
              </button>
            </div>
          </div>
        )}

        {/* Orders List */}
        {loading && orders.length === 0 ? (
          <div className="empty-state">
            <Loader className="spinner" size={48} />
            <h3>Buscando órdenes...</h3>
          </div>
        ) : !loading && orders.length === 0 ? (
          <div className="empty-state">
            <Package size={48} />
            <h3>No se encontraron órdenes</h3>
            <p>No hay órdenes que coincidan con tu búsqueda o filtros.</p>
          </div>
        ) : (
          <>
            <div className="orders-list">
              {orders.map((order) => {
                const isExpanded = expandedOrder === order.id;
                const statusInfo = formatOrderStatus(order.status);
                const releaseInfo = formatReleaseStatus(order.paymentReleaseStatus || 'WAITING_SUPPORT');
                const releaseIsUpdating = updatingRelease === order.id;
                const releaseTimestamp = order.paymentReleaseAt ? formatDate(order.paymentReleaseAt) : null;
                const items = Array.isArray(order.items) ? order.items : [];
                const payment = order.payments?.[0];

                return (
                  <div key={order.id} className="order-card">
                    {/* Order Header */}
                    <div className="order-header" onClick={() => setExpandedOrder(isExpanded ? null : order.id)}>
                      <div className="order-main">
                        <div className="order-info">
                          <div className="order-number-row">
                            <h3>{order.orderNumber}</h3>
                            <button
                              className="copy-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyOrderNumber(order.orderNumber);
                              }}
                              title="Copiar número de orden"
                            >
                              {copiedOrderNumber === order.orderNumber ? (
                                <Check size={14} />
                              ) : (
                                <Copy size={14} />
                              )}
                            </button>
                          </div>
                          <p className="order-date">{formatDate(order.createdAt)}</p>
                          <p className="order-customer">{order.customerName}</p>
                        </div>
                        <div className="order-meta">
                          <span
                            className="order-status"
                            style={{ background: statusInfo.color + '20', color: statusInfo.color }}
                          >
                            {statusInfo.label}
                          </span>
                          <span
                            className="release-badge"
                            style={{ background: releaseInfo.color + '15', color: releaseInfo.color }}
                          >
                            {releaseInfo.label}
                          </span>
                          {payment && (
                            <span className="payment-badge">
                              {formatPaymentStatus(payment.status).icon} {formatPaymentStatus(payment.status).label}
                            </span>
                          )}
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
                        {/* PASO 3: Gestión de Pagos Integrada */}
                        {payment && payment.status === 'PENDING' && (
                          <div className="payment-actions-section">
                            <h4>
                              <AlertCircle size={18} />
                              Acciones de Pago
                            </h4>
                            <div className="payment-action-buttons">
                              <button
                                className="confirm-payment-btn"
                                onClick={() => setConfirmPaymentModal(payment)}
                              >
                                <CheckCircle size={18} />
                                Confirmar Pago
                              </button>
                              <button
                                className="cancel-payment-btn"
                                onClick={() => setCancelPaymentModal(payment)}
                              >
                                <XCircle size={18} />
                                Cancelar Pago
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="details-section release-section">
                          <h4>Estado de liberacion para el cliente</h4>
                          <div className="release-status-card">
                            <div className="release-status-head">
                              <span
                                className="release-chip"
                                style={{ background: releaseInfo.color + '20', color: releaseInfo.color }}
                              >
                                {releaseInfo.label}
                              </span>
                              {releaseTimestamp && (
                                <span className="release-timestamp">Actualizado {releaseTimestamp}</span>
                              )}
                            </div>
                            <p className="release-description">{releaseInfo.description}</p>
                            {order.paymentReleaseBy && (
                              <p className="release-meta">Atendido por: {order.paymentReleaseBy}</p>
                            )}
                            {order.paymentReleaseNotes && (
                              <p className="release-notes">Nota: {order.paymentReleaseNotes}</p>
                            )}
                          </div>
                          <div className="release-actions">
                            {releaseStatuses.map((releaseStatus) => {
                              const releaseOption = formatReleaseStatus(releaseStatus);
                              const isCurrent = (order.paymentReleaseStatus || 'WAITING_SUPPORT') === releaseStatus;
                              return (
                                <button
                                  key={releaseStatus}
                                  onClick={() => handleUpdateReleaseStatus(order.id, releaseStatus)}
                                  disabled={isCurrent || releaseIsUpdating}
                                  className={`release-btn ${isCurrent ? 'current' : ''}`}
                                  style={{
                                    borderColor: releaseOption.color,
                                    color: isCurrent ? '#fff' : releaseOption.color,
                                    background: isCurrent ? releaseOption.color : 'transparent',
                                  }}
                                >
                                  {releaseIsUpdating && !isCurrent && <Loader className="btn-spinner" size={14} />}
                                  {releaseOption.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>

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
                        {payment && (
                          <div className="details-section">
                            <h4>
                              <CreditCard size={18} />
                              Información de Pago
                            </h4>
                            <div className="payment-info">
                              <div className="detail-item">
                                <span className="label">Método:</span>
                                <span className="value">{formatPaymentMethod(payment.paymentMethod)}</span>
                              </div>
                              <div className="detail-item">
                                <span className="label">Estado:</span>
                                <span
                                  className="payment-status-badge"
                                  style={{ color: formatPaymentStatus(payment.status).color }}
                                >
                                  {formatPaymentStatus(payment.status).icon}{' '}
                                  {formatPaymentStatus(payment.status).label}
                                </span>
                              </div>
                              {payment.referenceNumber && (
                                <div className="detail-item">
                                  <span className="label">Referencia:</span>
                                  <span className="value value-code">{payment.referenceNumber}</span>
                                </div>
                              )}
                              {payment.transactionId && (
                                <div className="detail-item">
                                  <span className="label">ID Transacción:</span>
                                  <span className="value value-code">{payment.transactionId}</span>
                                </div>
                              )}
                              {payment.notes && (
                                <div className="detail-item full-width">
                                  <span className="label">Notas:</span>
                                  <span className="value">{payment.notes}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* PASO 4: Sistema de Notas */}
                        <div className="details-section">
                          <h4>
                            <FileText size={18} />
                            Notas de Soporte
                          </h4>
                          {editingNotes === order.id ? (
                            <div className="notes-editor">
                              <textarea
                                placeholder="Agregar notas internas sobre esta orden..."
                                value={orderNotes[order.id] || ''}
                                onChange={(e) =>
                                  setOrderNotes({ ...orderNotes, [order.id]: e.target.value })
                                }
                                rows={4}
                              />
                              <div className="notes-actions">
                                <button
                                  className="save-notes-btn"
                                  onClick={() => handleSaveNotes(order.id)}
                                  disabled={updatingNotes === order.id}
                                >
                                  {updatingNotes === order.id ? (
                                    <Loader className="btn-spinner" size={14} />
                                  ) : (
                                    'Guardar'
                                  )}
                                </button>
                                <button
                                  className="cancel-notes-btn"
                                  onClick={() => setEditingNotes(null)}
                                  disabled={updatingNotes === order.id}
                                >
                                  Cancelar
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="notes-display">
                              {order.supportNotes ? (
                                <p className="notes-text">{order.supportNotes}</p>
                              ) : (
                                <p className="notes-empty">No hay notas para esta orden</p>
                              )}
                              <button
                                className="edit-notes-btn"
                                onClick={() => {
                                  setOrderNotes({ ...orderNotes, [order.id]: order.supportNotes || '' });
                                  setEditingNotes(order.id);
                                }}
                              >
                                <FileText size={14} />
                                {order.supportNotes ? 'Editar notas' : 'Agregar notas'}
                              </button>
                            </div>
                          )}
                        </div>

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

            {/* PASO 5: Paginación */}
            {pagination && pagination.totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={pagination.currentPage === 1 || loading}
                >
                  Anterior
                </button>
                <div className="pagination-info">
                  Página {pagination.currentPage} de {pagination.totalPages}
                </div>
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={pagination.currentPage === pagination.totalPages || loading}
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal: Confirmar Pago */}
      {confirmPaymentModal && (
        <div className="modal-overlay" onClick={() => setConfirmPaymentModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <CheckCircle size={24} />
                Confirmar Pago
              </h3>
              <button className="modal-close" onClick={() => setConfirmPaymentModal(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-info">
                Referencia: <strong>{confirmPaymentModal.referenceNumber}</strong>
              </p>
              <div className="form-group">
                <label>ID de Transacción (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ej: TRX-123456"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Notas (Opcional)</label>
                <textarea
                  placeholder="Agregar notas sobre este pago..."
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="modal-btn modal-btn-cancel"
                onClick={() => setConfirmPaymentModal(null)}
                disabled={processingPayment}
              >
                Cancelar
              </button>
              <button
                className="modal-btn modal-btn-confirm"
                onClick={handleConfirmPayment}
                disabled={processingPayment}
              >
                {processingPayment ? (
                  <>
                    <Loader className="btn-spinner" size={16} />
                    Procesando...
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    Confirmar Pago
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Cancelar Pago */}
      {cancelPaymentModal && (
        <div className="modal-overlay" onClick={() => setCancelPaymentModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <XCircle size={24} />
                Cancelar Pago
              </h3>
              <button className="modal-close" onClick={() => setCancelPaymentModal(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-info">
                Referencia: <strong>{cancelPaymentModal.referenceNumber}</strong>
              </p>
              <div className="form-group">
                <label>
                  Razón de Cancelación <span className="required">*</span>
                </label>
                <textarea
                  placeholder="Explicar por qué se cancela este pago..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  rows={4}
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="modal-btn modal-btn-cancel"
                onClick={() => setCancelPaymentModal(null)}
                disabled={processingPayment}
              >
                Volver
              </button>
              <button
                className="modal-btn modal-btn-danger"
                onClick={handleCancelPayment}
                disabled={processingPayment || !cancelReason.trim()}
              >
                {processingPayment ? (
                  <>
                    <Loader className="btn-spinner" size={16} />
                    Procesando...
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
        </div>
      )}

      <style jsx>{`
        .admin-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* Header */
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

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .export-btn,
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

        .export-btn {
          background: linear-gradient(135deg, #10b981, #059669);
        }

        .export-btn:hover:not(:disabled),
        .refresh-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(37, 99, 235, 0.3);
        }

        .export-btn:disabled,
        .refresh-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* PASO 1: Stats Dashboard */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
        }

        .stat-card {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
          display: flex;
          align-items: center;
          gap: 16px;
          transition: transform 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-4px);
        }

        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .stat-primary .stat-icon {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
        }

        .stat-warning .stat-icon {
          background: linear-gradient(135deg, #f59e0b, #d97706);
        }

        .stat-success .stat-icon {
          background: linear-gradient(135deg, #10b981, #059669);
        }

        .stat-revenue .stat-icon {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
        }

        .stat-content {
          flex: 1;
        }

        .stat-label {
          margin: 0 0 4px;
          font-size: 0.85rem;
          color: #64748b;
          font-weight: 500;
        }

        .stat-value {
          margin: 0;
          font-size: 1.75rem;
          font-weight: 700;
          color: #0f172a;
        }

        /* Search Section */
        .search-section {
          display: flex;
          gap: 12px;
        }

        .search-bar {
          flex: 1;
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

        .filter-toggle-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 16px 24px;
          border: none;
          background: white;
          color: #0f172a;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
          transition: all 0.2s;
          position: relative;
        }

        .filter-toggle-btn:hover {
          background: #f8fafc;
        }

        .filter-toggle-btn.active {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
        }

        .filter-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          color: #ef4444;
          font-size: 1.2rem;
        }

        /* PASO 2: Filters Panel */
        .filters-panel {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 16px;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .filter-group label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #64748b;
        }

        .filter-group select,
        .filter-group input {
          padding: 10px 14px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.95rem;
          color: #0f172a;
          outline: none;
          transition: border-color 0.2s;
        }

        .filter-group select:focus,
        .filter-group input:focus {
          border-color: #2563eb;
        }

        .filters-actions {
          display: flex;
          justify-content: flex-end;
        }

        .clear-filters-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          border: 1px solid #e2e8f0;
          background: white;
          color: #64748b;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .clear-filters-btn:hover {
          background: #f8fafc;
          color: #0f172a;
        }

        /* Loading & Error States */
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

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
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

        /* Orders List */
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

        .order-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .order-number-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .order-info h3 {
          margin: 0;
          font-size: 1.1rem;
          color: #0f172a;
          font-weight: 600;
        }

        .copy-btn {
          padding: 4px;
          border: none;
          background: none;
          color: #64748b;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .copy-btn:hover {
          background: #f1f5f9;
          color: #2563eb;
        }

        .order-date,
        .order-customer {
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

        .release-badge {
          font-size: 0.78rem;
          font-weight: 600;
          padding: 5px 12px;
          border-radius: 999px;
          border: 1px solid transparent;
        }

        .payment-badge {
          font-size: 0.8rem;
          color: #64748b;
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

        /* Order Details */
        .order-details {
          padding: 24px;
          border-top: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* PASO 3: Payment Actions */
        .payment-actions-section {
          background: linear-gradient(135deg, #fef3c7, #fde68a);
          padding: 20px;
          border-radius: 12px;
          border-left: 4px solid #f59e0b;
        }

        .payment-actions-section h4 {
          margin: 0 0 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #92400e;
        }

        .payment-action-buttons {
          display: flex;
          gap: 12px;
        }

        .confirm-payment-btn,
        .cancel-payment-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 20px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .confirm-payment-btn {
          background: #10b981;
          color: white;
        }

        .confirm-payment-btn:hover {
          background: #059669;
          transform: translateY(-2px);
        }

        .cancel-payment-btn {
          background: #ef4444;
          color: white;
        }

        .cancel-payment-btn:hover {
          background: #dc2626;
          transform: translateY(-2px);
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

        .detail-item.full-width {
          grid-column: 1 / -1;
          flex-direction: column;
          align-items: flex-start;
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

        .payment-status-badge {
          font-weight: 600;
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

        /* PASO 4: Notes System */
        .notes-editor textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-family: inherit;
          font-size: 0.95rem;
          resize: vertical;
          outline: none;
        }

        .notes-editor textarea:focus {
          border-color: #2563eb;
        }

        .notes-actions {
          display: flex;
          gap: 8px;
          margin-top: 8px;
        }

        .save-notes-btn,
        .cancel-notes-btn,
        .edit-notes-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .save-notes-btn {
          background: #10b981;
          color: white;
        }

        .save-notes-btn:hover {
          background: #059669;
        }

        .cancel-notes-btn {
          background: #e2e8f0;
          color: #64748b;
        }

        .cancel-notes-btn:hover {
          background: #cbd5e1;
        }

        .notes-display {
          padding: 16px;
          background: #f8fafc;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .notes-text {
          margin: 0;
          color: #0f172a;
          white-space: pre-wrap;
        }

        .notes-empty {
          margin: 0;
          color: #94a3b8;
          font-style: italic;
        }

        .edit-notes-btn {
          align-self: flex-start;
          background: #e0e7ff;
          color: #3730a3;
        }

        .edit-notes-btn:hover {
          background: #c7d2fe;
        }

        /* Status Actions */
        .status-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .release-section {
          border-top: 1px dashed rgba(15, 23, 42, 0.08);
          padding-top: 16px;
          margin-top: 8px;
        }

        .release-status-card {
          border: 1px solid rgba(15, 23, 42, 0.1);
          border-radius: 14px;
          padding: 16px;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.04), rgba(14, 116, 144, 0.04));
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .release-status-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
        }

        .release-chip {
          font-weight: 600;
          font-size: 0.85rem;
          padding: 6px 14px;
          border-radius: 999px;
        }

        .release-timestamp {
          font-size: 0.8rem;
          color: #475569;
        }

        .release-description {
          margin: 0;
          color: #0f172a;
          font-weight: 500;
        }

        .release-meta,
        .release-notes {
          margin: 0;
          font-size: 0.9rem;
          color: #475569;
        }

        .release-actions {
          margin-top: 12px;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .release-btn {
          border: 1px solid #94a3b8;
          padding: 10px 14px;
          border-radius: 10px;
          font-weight: 600;
          background: transparent;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .release-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(15, 23, 42, 0.12);
        }

        .release-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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

        /* PASO 5: Pagination */
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
        }

        .pagination-btn {
          padding: 10px 20px;
          border: 1px solid #e2e8f0;
          background: white;
          color: #0f172a;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .pagination-btn:hover:not(:disabled) {
          background: #f8fafc;
          border-color: #2563eb;
          color: #2563eb;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-info {
          font-weight: 600;
          color: #64748b;
        }

        /* Modals */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 16px;
          max-width: 500px;
          width: 100%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: modalSlideIn 0.3s ease-out;
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px;
          border-bottom: 1px solid #e2e8f0;
        }

        .modal-header h3 {
          margin: 0;
          display: flex;
          align-items: center;
          gap: 12px;
          color: #0f172a;
        }

        .modal-close {
          padding: 8px;
          border: none;
          background: none;
          color: #64748b;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .modal-close:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        .modal-body {
          padding: 24px;
        }

        .modal-info {
          margin: 0 0 20px;
          padding: 12px;
          background: #f8fafc;
          border-radius: 8px;
          font-size: 0.95rem;
          color: #64748b;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group:last-child {
          margin-bottom: 0;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          color: #0f172a;
        }

        .required {
          color: #ef4444;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.95rem;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          border-color: #2563eb;
        }

        .form-group textarea {
          resize: vertical;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding: 24px;
          border-top: 1px solid #e2e8f0;
        }

        .modal-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .modal-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .modal-btn-cancel {
          background: #e2e8f0;
          color: #64748b;
        }

        .modal-btn-cancel:hover:not(:disabled) {
          background: #cbd5e1;
        }

        .modal-btn-confirm {
          background: #10b981;
          color: white;
        }

        .modal-btn-confirm:hover:not(:disabled) {
          background: #059669;
        }

        .modal-btn-danger {
          background: #ef4444;
          color: white;
        }

        .modal-btn-danger:hover:not(:disabled) {
          background: #dc2626;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .header-actions {
            width: 100%;
            flex-direction: column;
          }

          .export-btn,
          .refresh-btn {
            width: 100%;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .search-section {
            flex-direction: column;
          }

          .filter-toggle-btn {
            width: 100%;
          }

          .filters-grid {
            grid-template-columns: 1fr;
          }

          .order-main {
            flex-direction: column;
            align-items: flex-start;
          }

          .order-meta {
            align-items: flex-start;
          }

          .payment-action-buttons {
            flex-direction: column;
          }

          .status-actions {
            flex-direction: column;
          }

          .status-btn {
            width: 100%;
          }

          .release-actions {
            flex-direction: column;
          }

          .release-btn {
            width: 100%;
          }
        }
      `}</style>
    </AdminLayout>
  );
};

export default AdminOrdersPage;
