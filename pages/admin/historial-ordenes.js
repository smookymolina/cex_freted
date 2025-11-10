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
  Calendar as CalendarIcon,
  DollarSign,
  CreditCard,
  RefreshCw,
  Loader,
  Filter,
  X,
  Download,
  Copy,
  Check,
  FileText,
  Eye,
} from 'lucide-react';
import {
  formatOrderStatus,
  formatPaymentMethod,
  formatPaymentStatus,
  formatReleaseStatus,
} from '../../utils/checkoutHelper';
import { useToast } from '../../context/ToastContext';

const AdminHistoryPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const toast = useToast();

  // Estados principales
  const [orders, setOrders] = useState([]);
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
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedOrderNumber, setCopiedOrderNumber] = useState(null);

  const ITEMS_PER_PAGE = 15;

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
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
  }, [
    session,
    currentPage,
    debouncedSearchTerm,
    filterStatus,
    filterPaymentMethod,
    filterDateFrom,
    filterDateTo,
    filterMinAmount,
    filterMaxAmount,
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
    } catch (err) {
      setError(err.message);
      toast?.error('Error al cargar el historial de órdenes');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    const csvHeaders = [
      'Número de Orden', 'Fecha', 'Cliente', 'Email', 'Teléfono', 'Estado', 'Método de Pago', 'Total',
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
      ...csvRows.map((row) => row.map((cell) => `"${cell}"`).join(',')), // Corrected escaping for CSV cells
    ].join('\n'); // Corrected escaping for newline in CSV content
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `historial_ordenes_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast?.success('Archivo CSV descargado');
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
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
    
  const formatDateTimeLong = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('es-MX', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const isPdfProof = (filePath = '') => filePath.toLowerCase().endsWith('.pdf');

  if (status === 'loading' || (loading && orders.length === 0)) {
    return (
      <AdminLayout>
        <div className="loading-container"><Loader className="spinner" size={48} /><p>Cargando historial...</p></div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="error-container"><p>Error: {error}</p><button onClick={fetchOrders} className="retry-btn">Reintentar</button></div>
      </AdminLayout>
    );
  }

  if (!session || session.user.role !== 'SOPORTE') {
    return null;
  }

  const orderStatuses = ['PENDING', 'PAYMENT_CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];
  const paymentMethods = [{ value: 'BANK_TRANSFER', label: 'Transferencia Bancaria' }, { value: 'CASH_DEPOSIT', label: 'Depósito en Efectivo' }, { value: 'PHONE_PAYMENT', label: 'Pago Telefónico' }, { value: 'STORE_PAYMENT', label: 'Pago en Tienda' }];

  return (
    <AdminLayout>
      <div className="admin-container">
        <div className="page-header">
          <div>
            <h1>Historial de Órdenes</h1>
            <p>Consulta de todas las órdenes procesadas y activas. {pagination ? `${pagination.total} órdenes encontradas` : ''}</p>
          </div>
          <div className="header-actions">
            <button onClick={handleExportCSV} className="export-btn" disabled={orders.length === 0}><Download size={18} />Exportar CSV</button>
            <button onClick={fetchOrders} className="refresh-btn" disabled={loading}><RefreshCw size={18} className={loading ? 'spinning' : ''} />Actualizar</button>
          </div>
        </div>

        <div className="search-section">
          <div className="search-bar">
            <Search size={20} /><input type="text" placeholder="Buscar por número de orden, cliente o email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}>
            <Filter size={18} />Filtros
            {(filterStatus !== 'ALL' || filterPaymentMethod !== 'ALL' || filterDateFrom || filterDateTo || filterMinAmount || filterMaxAmount) && <span className="filter-badge">●</span>}
          </button>
        </div>

        {showFilters && (
          <div className="filters-panel">
            <div className="filters-grid">
              <div className="filter-group"><label>Estado de Orden</label><select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}><option value="ALL">Todos</option>{orderStatuses.map((status) => (<option key={status} value={status}>{formatOrderStatus(status).label}</option>))}</select></div>
              <div className="filter-group"><label>Método de Pago</label><select value={filterPaymentMethod} onChange={(e) => { setFilterPaymentMethod(e.target.value); setCurrentPage(1); }}><option value="ALL">Todos</option>{paymentMethods.map((method) => (<option key={method.value} value={method.value}>{method.label}</option>))}</select></div>
              <div className="filter-group"><label>Fecha Desde</label><input type="date" value={filterDateFrom} onChange={(e) => { setFilterDateFrom(e.target.value); setCurrentPage(1); }} /></div>
              <div className="filter-group"><label>Fecha Hasta</label><input type="date" value={filterDateTo} onChange={(e) => { setFilterDateTo(e.target.value); setCurrentPage(1); }} /></div>
              <div className="filter-group"><label>Monto Mínimo</label><input type="number" placeholder="$0" value={filterMinAmount} onChange={(e) => { setFilterMinAmount(e.target.value); setCurrentPage(1); }} /></div>
              <div className="filter-group"><label>Monto Máximo</label><input type="number" placeholder="$999999" value={filterMaxAmount} onChange={(e) => { setFilterMaxAmount(e.target.value); setCurrentPage(1); }} /></div>
            </div>
            <div className="filters-actions"><button onClick={clearFilters} className="clear-filters-btn"><X size={16} />Limpiar filtros</button></div>
          </div>
        )}

        {loading && orders.length === 0 ? (
          <div className="empty-state"><Loader className="spinner" size={48} /><h3>Buscando órdenes...</h3></div>
        ) : !loading && orders.length === 0 ? (
          <div className="empty-state"><Package size={48} /><h3>No se encontraron órdenes</h3><p>No hay órdenes que coincidan con tu búsqueda o filtros.</p></div>
        ) : (
          <>
            <div className="orders-list">
              {orders.map((order) => {
                const isExpanded = expandedOrder === order.id;
                const statusInfo = formatOrderStatus(order.status);
                const releaseInfo = formatReleaseStatus(order.paymentReleaseStatus || 'WAITING_SUPPORT');
                const items = Array.isArray(order.items) ? order.items : [];
                const payment = order.payments?.[0];
                const proofUploadedAt = payment?.paymentProofUploadedAt ? formatDateTimeLong(payment.paymentProofUploadedAt) : null;

                return (
                  <div key={order.id} className="order-card">
                    <div className="order-header" onClick={() => setExpandedOrder(isExpanded ? null : order.id)}>
                      <div className="order-main">
                        <div className="order-info">
                          <div className="order-number-row">
                            <h3>{order.orderNumber}</h3>
                            <button className="copy-btn" onClick={(e) => { e.stopPropagation(); handleCopyOrderNumber(order.orderNumber); }} title="Copiar número de orden">
                              {copiedOrderNumber === order.orderNumber ? <Check size={14} /> : <Copy size={14} />}
                            </button>
                          </div>
                          <p className="order-date">{formatDate(order.createdAt)}</p>
                          <p className="order-customer">{order.customerName}</p>
                        </div>
                        <div className="order-meta">
                          <span className="order-status" style={{ background: statusInfo.color + '20', color: statusInfo.color }}>{statusInfo.label}</span>
                          <span className="release-badge" style={{ background: releaseInfo.color + '15', color: releaseInfo.color }}>{releaseInfo.label}</span>
                          {payment && (<span className="payment-badge">{formatPaymentStatus(payment.status).icon} {formatPaymentStatus(payment.status).label}</span>)}
                          <span className="order-total">{formatCurrency(order.total)}</span>
                        </div>
                      </div>
                      <button className="expand-btn">{isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</button>
                    </div>

                    {isExpanded && (
                      <div className="order-details">
                        <div className="details-grid-container">
                            <div className="details-section"><h4><User size={18} />Información del Cliente</h4><div className="detail-grid"><div className="detail-item"><span className="label">Nombre:</span><span className="value">{order.customerName}</span></div><div className="detail-item"><Mail size={16} /><span className="value">{order.customerEmail}</span></div><div className="detail-item"><Phone size={16} /><span className="value">{order.customerPhone}</span></div></div></div>
                            <div className="details-section"><h4><MapPin size={18} />Dirección de Envío</h4><div className="address-box"><p>{order.shippingAddress}</p><p>{order.shippingCity}, {order.shippingState} - CP {order.shippingPostalCode}</p>{order.shippingReferences && (<p className="references">Referencias: {order.shippingReferences}</p>)}</div></div>
                        </div>
                        <div className="details-section"><h4><Package size={18} />Productos Ordenados</h4><div className="items-list">{items.map((item, index) => (<div key={index} className="item-row"><span className="item-name">{item.name || item.slug}</span><span className="item-quantity">x{item.quantity}</span><span className="item-price">{formatCurrency(item.price)}</span></div>))}<div className="totals"><div className="total-row"><span>Subtotal:</span><span>{formatCurrency(order.subtotal)}</span></div>{order.shippingCost > 0 && (<div className="total-row"><span>Envío:</span><span>{formatCurrency(order.shippingCost)}</span></div>)}<div className="total-row total-final"><span>Total:</span><span>{formatCurrency(order.total)}</span></div></div></div></div>
                        {payment && (<div className="details-section"><h4><CreditCard size={18} />Información de Pago</h4><div className="payment-info"><div className="detail-item"><span className="label">Método:</span><span className="value">{formatPaymentMethod(payment.paymentMethod)}</span></div><div className="detail-item"><span className="label">Estado:</span><span className="payment-status-badge" style={{ color: formatPaymentStatus(payment.status).color }}>{formatPaymentStatus(payment.status).icon}{' '} {formatPaymentStatus(payment.status).label}</span></div>{payment.referenceNumber && (<div className="detail-item"><span className="label">Referencia:</span><span className="value value-code">{payment.referenceNumber}</span></div>)}{payment.transactionId && (<div className="detail-item"><span className="label">ID Transacción:</span><span className="value value-code">{payment.transactionId}</span></div>)}{payment.notes && (<div className="detail-item full-width"><span className="label">Notas:</span><span className="value">{payment.notes}</span></div>)}</div></div>)}
                        {payment?.paymentProof && (<div className="details-section"><div className="proof-preview-head"><h4><FileText size={18} />Comprobante</h4></div><div className="proof-preview"><div className="proof-preview__frame">{isPdfProof(payment.paymentProof) ? (<iframe src={`${payment.paymentProof}#toolbar=0&navpanes=0`} title={`Comprobante ${order.orderNumber}`} />) : (<img src={payment.paymentProof} alt={`Comprobante del pedido ${order.orderNumber}`} />)}</div><div className="proof-preview__side"><div className="proof-preview__meta"><div><p className="meta-label">Subido el</p><p className="meta-value">{proofUploadedAt || 'Pendiente'}</p></div><div><p className="meta-label">Formato</p><p className="meta-value">{isPdfProof(payment.paymentProof) ? 'PDF' : 'Imagen'}</p></div></div><div className="proof-preview__actions"><a className="proof-preview-btn" href={payment.paymentProof} target="_blank" rel="noopener noreferrer"><Eye size={16} />Ver en pestaña</a><a className="proof-preview-btn proof-preview-btn--ghost" href={payment.paymentProof} download><Download size={16} />Descargar</a></div></div></div></div>)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {pagination && pagination.totalPages > 1 && (
              <div className="pagination">
                <button className="pagination-btn" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={pagination.currentPage === 1 || loading}>Anterior</button>
                <div className="pagination-info">Página {pagination.currentPage} de {pagination.totalPages}</div>
                <button className="pagination-btn" onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))} disabled={pagination.currentPage === pagination.totalPages || loading}>Siguiente</button>
              </div>
            )}
          </>
        )}
      </div>
      <style jsx>{`
        /* Estilos generales (reutilizados de AdminOrdersPage) */
        .admin-container { display: flex; flex-direction: column; gap: 24px; }
        .page-header { display: flex; justify-content: space-between; align-items: center; background: white; padding: 28px 32px; border-radius: 16px; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08); }
        .page-header h1 { margin: 0 0 6px; font-size: 2rem; color: #0f172a; }
        .page-header p { margin: 0; color: #64748b; }
        .header-actions { display: flex; gap: 12px; }
        .export-btn, .refresh-btn { display: flex; align-items: center; gap: 8px; padding: 12px 20px; border: none; background: #1d4ed8; color: white; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .export-btn { background: #059669; }
        .export-btn:hover:not(:disabled), .refresh-btn:hover:not(:disabled) { transform: translateY(-2px); }
        .export-btn:disabled, .refresh-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .search-section { display: flex; gap: 12px; }
        .search-bar { flex: 1; display: flex; align-items: center; gap: 12px; padding: 16px 20px; background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08); }
        .search-bar input { flex: 1; border: none; outline: none; font-size: 1rem; }
        .filter-toggle-btn { display: flex; align-items: center; gap: 8px; padding: 16px 24px; border: none; background: white; border-radius: 12px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08); position: relative; }
        .filter-toggle-btn.active { background: #eef2ff; color: #3730a3; }
        .filter-badge { position: absolute; top: 8px; right: 8px; color: #ef4444; font-size: 1.2rem; }
        .filters-panel { background: white; padding: 24px; border-radius: 12px; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08); }
        .filters-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 16px; }
        .filter-group { display: flex; flex-direction: column; gap: 8px; }
        .filter-group label { font-size: 0.85rem; font-weight: 600; color: #64748b; }
        .filter-group select, .filter-group input { padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.95rem; }
        .filters-actions { display: flex; justify-content: flex-end; }
        .clear-filters-btn { display: flex; align-items: center; gap: 6px; padding: 10px 16px; border: 1px solid #e2e8f0; background: white; color: #64748b; border-radius: 8px; font-weight: 500; cursor: pointer; }
        .loading-container, .error-container, .empty-state { background: white; padding: 60px 40px; border-radius: 16px; text-align: center; display: flex; flex-direction: column; gap: 16px; align-items: center; }
        .spinner { animation: spin 1s linear infinite; color: #2563eb; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .orders-list { display: flex; flex-direction: column; gap: 16px; }
        .order-card { background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08); overflow: hidden; }
        .order-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; cursor: pointer; background: rgba(15, 23, 42, 0.02); }
        .order-main { display: flex; justify-content: space-between; align-items: center; flex: 1; gap: 20px; }
        .order-info h3 { margin: 0; font-size: 1.1rem; font-weight: 600; }
        .order-number-row { display: flex; align-items: center; gap: 8px; }
        .copy-btn { padding: 4px; border: none; background: none; color: #64748b; cursor: pointer; border-radius: 4px; }
        .order-date, .order-customer { margin: 0; font-size: 0.85rem; color: #64748b; }
        .order-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
        .order-status { padding: 6px 12px; border-radius: 6px; font-size: 0.85rem; font-weight: 600; }
        .release-badge { font-size: 0.78rem; font-weight: 600; padding: 5px 12px; border-radius: 999px; border: 1px solid transparent; }
        .payment-badge { font-size: 0.8rem; color: #64748b; }
        .order-total { font-size: 1.3rem; font-weight: 700; color: #2563eb; }
        .expand-btn { padding: 8px; border: none; background: none; color: #64748b; cursor: pointer; }
        .order-details { padding: 24px; border-top: 1px solid #e2e8f0; display: flex; flex-direction: column; gap: 24px; }
        .details-section h4 { margin: 0 0 16px; font-size: 1rem; color: #0f172a; display: flex; align-items: center; gap: 8px; }
        .details-grid-container { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .detail-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
        .detail-item { display: flex; align-items: center; gap: 8px; }
        .detail-item .label { font-weight: 600; color: #64748b; }
        .address-box { padding: 16px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #2563eb; }
        .items-list, .totals { font-size: 0.95rem; }
        .item-row, .total-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
        .total-row.total-final { font-weight: bold; font-size: 1.1rem; border-top: 2px solid #e2e8f0; }
        .payment-info { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; }
        .proof-preview { display: flex; gap: 20px; }
        .proof-preview__frame { flex: 1; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; min-height: 300px; }
        .proof-preview__frame img, .proof-preview__frame iframe { width: 100%; height: 100%; object-fit: contain; }
        .proof-preview__side { width: 280px; display: flex; flex-direction: column; gap: 16px; }
        .proof-preview__meta { display: flex; gap: 16px; justify-content: space-between; background: #f8fafc; padding: 12px; border-radius: 8px; }
        .meta-label { font-size: 0.8rem; color: #64748b; margin: 0 0 4px; }
        .meta-value { font-weight: 600; }
        .proof-preview__actions { display: flex; flex-direction: column; gap: 8px; }
        .proof-preview-btn { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px; border-radius: 8px; text-decoration: none; font-weight: 500; border: 1px solid #e2e8f0; color: #334155; background: white; }
        .proof-preview-btn--ghost { background: transparent; }
        .pagination { display: flex; justify-content: center; align-items: center; gap: 16px; padding: 20px; }
        .pagination-btn { padding: 8px 16px; border: 1px solid #e2e8f0; background: white; border-radius: 8px; cursor: pointer; }
        .pagination-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .pagination-info { font-weight: 500; }
      `}</style>
    </AdminLayout>
  );
};

export default AdminHistoryPage;
