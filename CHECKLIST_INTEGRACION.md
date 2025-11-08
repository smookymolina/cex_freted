# ✅ Checklist de Integración - Sistema de Órdenes de Compra

## Pasos Completados ✓

- [x] Base de datos migrada con nuevos campos
- [x] Configuración de métodos de pago creada
- [x] Componentes de UI creados
- [x] APIs de backend implementadas
- [x] Sistema de tracking implementado
- [x] Documentación completa

---

## 🔧 Pasos Pendientes (Integración Final)

### 1. Crear Carpeta de Uploads
```bash
mkdir -p public/uploads/payment-proofs
```

### 2. Actualizar Vista de Cliente - Mis Pedidos

**Archivo:** `pages/mi-cuenta/pedidos.js`

#### 2.1 Agregar Imports
```jsx
import OrderRelease from '../../components/mi-cuenta/OrderRelease';
import PaymentProofUploader from '../../components/mi-cuenta/PaymentProofUploader';
import PizzaTracker from '../../components/mi-cuenta/PizzaTracker';
```

#### 2.2 En el render de cada orden, agregar:

```jsx
{/* DESPUÉS de la información básica del pedido */}

{/* Pizza Tracker - Siempre visible */}
<div className="mt-6">
  <PizzaTracker
    trackingStatus={order.trackingStatus}
    trackingHistory={order.trackingHistory}
    createdAt={order.createdAt}
  />
</div>

{/* Orden de Compra - Solo si está liberada */}
{order.paymentReleaseStatus === 'RELEASED_TO_CUSTOMER' && order.orderReleaseData && (
  <div className="mt-4">
    <OrderRelease
      orderReleaseData={order.orderReleaseData}
      paymentMethod={order.payments[0]?.paymentMethod}
      orderNumber={order.orderNumber}
    />
  </div>
)}

{/* Subida de Comprobante - Solo si orden liberada y pago no verificado */}
{order.paymentReleaseStatus === 'RELEASED_TO_CUSTOMER' &&
 order.payments[0] &&
 !order.payments[0].paymentProofVerified && (
  <div className="mt-4">
    <PaymentProofUploader
      payment={order.payments[0]}
      onUploadSuccess={() => {
        // Refrescar órdenes
        fetchOrders();
      }}
    />
  </div>
)}
```

### 3. Actualizar Panel de Soporte - Órdenes

**Archivo:** `pages/admin/ordenes.js`

#### 3.1 Agregar función para liberar orden

```jsx
const handleReleaseOrder = async (orderId) => {
  if (!confirm('¿Confirmar que has contactado al cliente y deseas liberar la orden de compra?')) {
    return;
  }

  try {
    const response = await fetch('/api/admin/orders/update-release', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        releaseStatus: 'RELEASED_TO_CUSTOMER',
        notes: 'Confirmado vía telefónica'
      })
    });

    const data = await response.json();

    if (data.success) {
      alert('Orden de compra liberada al cliente');
      fetchOrders(); // Refrescar lista
    } else {
      alert('Error: ' + data.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al liberar orden');
  }
};
```

#### 3.2 Agregar función para verificar comprobante

```jsx
const handleVerifyProof = async (paymentId, approved) => {
  let notes = '';

  if (approved) {
    notes = 'Pago verificado correctamente';
  } else {
    notes = prompt('Ingresa la razón del rechazo:');
    if (!notes) return;
  }

  try {
    const response = await fetch('/api/admin/payments/verify-proof', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId, approved, notes })
    });

    const data = await response.json();

    if (data.success) {
      alert(approved ? 'Comprobante aprobado' : 'Comprobante rechazado');
      fetchOrders(); // Refrescar lista
    } else {
      alert('Error: ' + data.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al verificar comprobante');
  }
};
```

#### 3.3 Agregar función para actualizar tracking

```jsx
const handleUpdateTracking = async (orderId, trackingStatus) => {
  const note = prompt('Nota opcional:');

  try {
    const response = await fetch('/api/admin/orders/update-tracking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, trackingStatus, note })
    });

    const data = await response.json();

    if (data.success) {
      alert('Estado de seguimiento actualizado');
      fetchOrders(); // Refrescar lista
    } else {
      alert('Error: ' + data.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al actualizar tracking');
  }
};
```

#### 3.4 Agregar botones en cada orden expandida

```jsx
{/* En la sección de acciones de cada orden */}

{/* Botón para liberar orden */}
{order.paymentReleaseStatus === 'WAITING_SUPPORT' && (
  <button
    onClick={() => handleReleaseOrder(order.id)}
    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
  >
    📞 Liberar Orden de Compra
  </button>
)}

{/* Mostrar si ya está liberada */}
{order.paymentReleaseStatus === 'RELEASED_TO_CUSTOMER' && (
  <span className="px-4 py-2 bg-green-100 text-green-700 rounded font-semibold">
    ✅ Orden Liberada
  </span>
)}

{/* Ver comprobante si existe */}
{order.payments[0]?.paymentProof && (
  <a
    href={order.payments[0].paymentProof}
    target="_blank"
    rel="noopener noreferrer"
    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
  >
    👁️ Ver Comprobante
  </a>
)}

{/* Verificar comprobante */}
{order.payments[0]?.paymentProof && !order.payments[0]?.paymentProofVerified && (
  <>
    <button
      onClick={() => handleVerifyProof(order.payments[0].id, true)}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    >
      ✓ Aprobar Comprobante
    </button>
    <button
      onClick={() => handleVerifyProof(order.payments[0].id, false)}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
    >
      ✗ Rechazar Comprobante
    </button>
  </>
)}

{/* Selector de tracking */}
<div className="flex items-center gap-2">
  <label className="font-semibold">Estado de Seguimiento:</label>
  <select
    value={order.trackingStatus}
    onChange={(e) => handleUpdateTracking(order.id, e.target.value)}
    className="px-3 py-2 border rounded"
  >
    <option value="ORDER_RECEIVED">📦 Pedido Recibido</option>
    <option value="PAYMENT_VERIFICATION">🔍 Verificando Pago</option>
    <option value="PREPARING_ORDER">📦 Preparando Pedido</option>
    <option value="IN_TRANSIT">🚚 En Camino</option>
    <option value="DELIVERED">✅ Entregado</option>
  </select>
</div>
```

### 4. Actualizar Datos de Configuración

**Archivo:** `config/paymentOrderData.js`

Reemplaza los datos de ejemplo con tus datos reales:
- Cuentas bancarias
- CLABEs
- Números de teléfono
- Direcciones de tiendas
- Horarios de atención

### 5. Verificar Permisos de Carpetas

En producción, asegúrate de que la carpeta de uploads tenga permisos de escritura:
```bash
chmod 755 public/uploads
chmod 755 public/uploads/payment-proofs
```

---

## 🧪 Pruebas Recomendadas

### Flujo Completo de Prueba

1. **Como Cliente:**
   - [ ] Crear cuenta de prueba (rol: COMPRADOR)
   - [ ] Agregar productos al carrito
   - [ ] Completar checkout hasta el final
   - [ ] Ver orden en "Mis Pedidos"
   - [ ] Verificar que Pizza Tracker muestra "Pedido Recibido"

2. **Como Soporte:**
   - [ ] Crear cuenta de soporte (rol: SOPORTE)
   - [ ] Ver orden en panel de órdenes
   - [ ] Cambiar estado a "CALL_SCHEDULED"
   - [ ] Click en "Liberar Orden de Compra"
   - [ ] Verificar que se generaron datos de pago

3. **Como Cliente (continuación):**
   - [ ] Refrescar "Mis Pedidos"
   - [ ] Verificar que aparece componente OrderRelease
   - [ ] Ver datos de pago (cuentas, instrucciones)
   - [ ] Copiar número de referencia
   - [ ] Subir un PDF o imagen de prueba
   - [ ] Verificar que aparece "En Verificación"

4. **Como Soporte (continuación):**
   - [ ] Ver que hay comprobante nuevo
   - [ ] Abrir archivo en nueva pestaña
   - [ ] Click en "Aprobar Comprobante"
   - [ ] Cambiar tracking a "PREPARING_ORDER"
   - [ ] Cambiar tracking a "IN_TRANSIT"
   - [ ] Cambiar tracking a "DELIVERED"

5. **Como Cliente (final):**
   - [ ] Refrescar "Mis Pedidos"
   - [ ] Ver Pizza Tracker en "Entregado"
   - [ ] Ver comprobante como "Verificado"
   - [ ] Ver historial completo de tracking

---

## 📊 Verificación de Estados

### Tabla de Verificación

| Paso | Estado Orden | Estado Release | Estado Pago | Tracking |
|------|-------------|----------------|-------------|----------|
| Orden creada | PENDING | WAITING_SUPPORT | PENDING | ORDER_RECEIVED |
| Llamada programada | PENDING | CALL_SCHEDULED | PENDING | ORDER_RECEIVED |
| Orden liberada | PENDING | RELEASED_TO_CUSTOMER | PENDING | ORDER_RECEIVED |
| Comprobante subido | PENDING | RELEASED_TO_CUSTOMER | PROCESSING | PAYMENT_VERIFICATION |
| Pago verificado | PAYMENT_CONFIRMED | RELEASED_TO_CUSTOMER | COMPLETED | PREPARING_ORDER |
| En preparación | PAYMENT_CONFIRMED | RELEASED_TO_CUSTOMER | COMPLETED | PREPARING_ORDER |
| Enviado | SHIPPED | RELEASED_TO_CUSTOMER | COMPLETED | IN_TRANSIT |
| Entregado | DELIVERED | RELEASED_TO_CUSTOMER | COMPLETED | DELIVERED |

---

## 🚨 Troubleshooting

### Error: "formidable is not defined"
```bash
npm install formidable
```

### Error: "Cannot find module paymentOrderData"
Verifica que el archivo existe en: `config/paymentOrderData.js`

### Error al subir archivos
1. Verifica que la carpeta existe: `public/uploads/payment-proofs`
2. Verifica permisos de escritura
3. Revisa tamaño del archivo (máximo 10MB)

### Componentes no se muestran
Verifica que los imports estén correctos y que los archivos existan en las rutas especificadas

### Estados no se actualizan
Asegúrate de tener una función para refrescar los datos después de cada acción

---

## 📝 Notas Finales

- **Migración aplicada:** ✅ Ya se ejecutó `npx prisma migrate dev`
- **Paquetes instalados:** ✅ formidable instalado
- **Archivos creados:** ✅ Todos los componentes y APIs listos
- **Documentación:** ✅ SISTEMA_ORDENES_COMPRA.md disponible

**Solo falta integrar los componentes en las vistas existentes según este checklist.**

---

¡Buena suerte con la integración! 🚀
