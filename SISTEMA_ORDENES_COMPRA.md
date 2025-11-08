# Sistema de Órdenes de Compra con Pizza Tracker

## Descripción General

Sistema completo de gestión de pedidos que permite a soporte liberar órdenes de compra con datos específicos por método de pago, recibir comprobantes de pago de clientes, y hacer seguimiento en tiempo real del estado de los pedidos mediante un "Pizza Tracker" visual.

---

## 🎯 Características Implementadas

### ✅ Paso 1: Sistema de Estados y Base de Datos
- **Modelo Order extendido** con:
  - `orderReleaseData` (JSON): Datos de la orden de compra
  - `trackingStatus` (enum): Estado actual del tracker
  - `trackingHistory` (JSON): Historial de cambios

- **Modelo Payment extendido** con:
  - `paymentProof`: Ruta del comprobante subido
  - `paymentProofUploadedAt`: Fecha de subida
  - `paymentProofVerified`: Si fue verificado por soporte
  - `paymentProofVerifiedAt`: Fecha de verificación
  - `paymentProofVerifiedBy`: Usuario que verificó

- **Nuevo enum TrackingStatus**:
  - `ORDER_RECEIVED`: Pedido recibido
  - `PAYMENT_VERIFICATION`: Verificando pago
  - `PREPARING_ORDER`: Preparando pedido
  - `IN_TRANSIT`: En camino
  - `DELIVERED`: Entregado

### ✅ Paso 2: Órdenes de Compra por Método de Pago
- **Archivo de configuración** (`config/paymentOrderData.js`) con datos para cada método:
  - **BANK_TRANSFER**: Cuentas bancarias (BBVA, Santander)
  - **CASH_DEPOSIT**: Sucursales para depósitos
  - **PHONE_PAYMENT**: Números de contacto y horarios
  - **STORE_PAYMENT**: Direcciones de tiendas físicas
  - **CONVENIENCE_STORE**: Establecimientos disponibles (Oxxo, 7-Eleven, etc.)

- **API actualizada** para liberar órdenes con datos
- **Componente OrderRelease** para mostrar datos al cliente

### ✅ Paso 3: Sistema de Subida de Comprobantes
- **Endpoint `/api/payments/upload-proof`**: Sube PDFs o imágenes
- **Componente PaymentProofUploader**: Interfaz para el cliente
- **Endpoint `/api/admin/payments/verify-proof`**: Soporte verifica comprobantes
- **Validaciones**: Solo PDF/imágenes, máximo 10MB
- **Storage**: Archivos en `/public/uploads/payment-proofs/`

### ✅ Paso 4: Pizza Tracker
- **Componente PizzaTracker**: Visualización de 5 etapas
- **Responsive**: Vista horizontal (desktop) y vertical (mobile)
- **Historial detallado**: Muestra todas las actualizaciones
- **API `/api/admin/orders/update-tracking`**: Actualiza estados

### ✅ Paso 5: Integración Completa
- Utilidades actualizadas con funciones de formateo
- Todos los componentes listos para integrar
- Sistema de archivos completo

---

## 🔄 Flujo de Trabajo Completo

### 1️⃣ Cliente Realiza Pedido
```
1. Cliente agrega productos al carrito
2. Completa checkout (datos, envío, método de pago)
3. Se crea orden con estado:
   - Order.status: PENDING
   - Order.paymentReleaseStatus: WAITING_SUPPORT
   - Order.trackingStatus: ORDER_RECEIVED
   - Payment.status: PENDING
```

### 2️⃣ Soporte Contacta al Cliente
```
1. Soporte ve pedido en panel de órdenes
2. Llama al cliente para:
   - Confirmar datos
   - Explicar método de pago
   - Resolver dudas
3. En el panel, cambia estado a:
   paymentReleaseStatus: CALL_SCHEDULED
```

### 3️⃣ Soporte Libera Orden de Compra
```
1. Soporte verifica todo está correcto
2. Click en "Liberar Orden de Compra"
3. Sistema ejecuta:
   POST /api/admin/orders/update-release
   {
     "orderId": "xxx",
     "releaseStatus": "RELEASED_TO_CUSTOMER",
     "notes": "Confirmado vía telefónica"
   }
4. Se generan datos de orden según método de pago
5. Order.orderReleaseData se llena con:
   - Datos bancarios (cuentas, CLABE)
   - Instrucciones de pago
   - Número de referencia
   - Monto exacto
   - Notas importantes
```

### 4️⃣ Cliente Ve Orden de Compra
```
1. Cliente accede a "Mis Pedidos"
2. Ve su pedido con estado "Orden Liberada"
3. Componente OrderRelease muestra:
   - Datos de pago según método seleccionado
   - Instrucciones paso a paso
   - Botón de copiar para cuentas/referencia
   - Notas importantes
4. Cliente realiza el pago
```

### 5️⃣ Cliente Sube Comprobante
```
1. Cliente tiene su comprobante (PDF o imagen)
2. En "Mis Pedidos", ve componente PaymentProofUploader
3. Selecciona archivo (validaciones automáticas)
4. Sistema ejecuta:
   POST /api/payments/upload-proof
5. Se actualiza:
   - Payment.paymentProof: "/uploads/payment-proofs/xxx.pdf"
   - Payment.status: PROCESSING
   - Order.trackingStatus: PAYMENT_VERIFICATION
6. Cliente ve estado "En Verificación"
```

### 6️⃣ Soporte Verifica Comprobante
```
1. Soporte ve en panel que hay comprobante nuevo
2. Click para ver archivo PDF/imagen
3. Verifica que:
   - Monto es correcto
   - Referencia coincide
   - Datos son válidos
4. Opciones:

   A) APROBAR:
   POST /api/admin/payments/verify-proof
   {
     "paymentId": "xxx",
     "approved": true,
     "notes": "Pago verificado correctamente"
   }
   Resultado:
   - Payment.paymentProofVerified: true
   - Payment.status: COMPLETED
   - Order.status: PAYMENT_CONFIRMED
   - Order.trackingStatus: PREPARING_ORDER

   B) RECHAZAR:
   POST /api/admin/payments/verify-proof
   {
     "paymentId": "xxx",
     "approved": false,
     "notes": "Monto incorrecto, favor de corregir"
   }
   Resultado:
   - Payment.status: FAILED
   - Cliente debe subir nuevo comprobante
```

### 7️⃣ Soporte Inicia Pizza Tracker
```
1. Una vez pago confirmado, soporte prepara pedido
2. Actualiza estados según avance:

   POST /api/admin/orders/update-tracking
   {
     "orderId": "xxx",
     "trackingStatus": "PREPARING_ORDER",
     "note": "Verificando inventario y preparando productos"
   }

3. Progresión típica:
   ORDER_RECEIVED → Ya está
   ↓
   PAYMENT_VERIFICATION → Cuando sube comprobante
   ↓
   PREPARING_ORDER → Cuando se confirma pago
   ↓
   IN_TRANSIT → Cuando se envía (Order.status: SHIPPED)
   ↓
   DELIVERED → Cuando se entrega (Order.status: DELIVERED)
```

### 8️⃣ Cliente Ve Seguimiento
```
1. Cliente accede a "Mis Pedidos"
2. Ve componente PizzaTracker con:
   - Barra de progreso visual
   - Etapa actual resaltada
   - Fechas de cada etapa
   - Historial detallado
3. Actualiza página para ver cambios
```

---

## 📁 Archivos Creados/Modificados

### Nuevos Archivos

#### Configuración
- `config/paymentOrderData.js` - Datos de órdenes de compra por método de pago

#### Componentes de Cliente
- `components/mi-cuenta/OrderRelease.js` - Muestra orden de compra liberada
- `components/mi-cuenta/PaymentProofUploader.js` - Subida de comprobantes
- `components/mi-cuenta/PizzaTracker.js` - Seguimiento visual del pedido

#### APIs de Cliente
- `pages/api/payments/upload-proof.js` - Endpoint para subir comprobantes

#### APIs de Soporte
- `pages/api/admin/payments/verify-proof.js` - Verificar comprobantes
- `pages/api/admin/orders/update-tracking.js` - Actualizar estados del tracker

#### Documentación
- `SISTEMA_ORDENES_COMPRA.md` - Este archivo

### Archivos Modificados

#### Base de Datos
- `prisma/schema.prisma` - Extendido con nuevos campos

#### Servicios
- `services/paymentService.js` - Agregada lógica de órdenes de compra

#### APIs
- `pages/api/admin/orders/update-release.js` - Genera datos de orden al liberar

#### Utilidades
- `utils/checkoutHelper.js` - Agregada función `formatTrackingStatus()`

---

## 🔧 Cómo Integrar en las Vistas

### Vista de Cliente (Mis Pedidos)

**Archivo a modificar:** `pages/mi-cuenta/pedidos.js`

```jsx
import OrderRelease from '../../components/mi-cuenta/OrderRelease';
import PaymentProofUploader from '../../components/mi-cuenta/PaymentProofUploader';
import PizzaTracker from '../../components/mi-cuenta/PizzaTracker';

// Dentro del map de órdenes:
{orders.map((order) => (
  <div key={order.id} className="border rounded-lg p-6">
    {/* Información básica del pedido */}
    <h3>Orden #{order.orderNumber}</h3>
    <p>Estado: {order.status}</p>

    {/* NUEVO: Pizza Tracker */}
    <PizzaTracker
      trackingStatus={order.trackingStatus}
      trackingHistory={order.trackingHistory}
      createdAt={order.createdAt}
    />

    {/* NUEVO: Orden de Compra (solo si está liberada) */}
    {order.paymentReleaseStatus === 'RELEASED_TO_CUSTOMER' && order.orderReleaseData && (
      <OrderRelease
        orderReleaseData={order.orderReleaseData}
        paymentMethod={order.payments[0]?.paymentMethod}
        orderNumber={order.orderNumber}
      />
    )}

    {/* NUEVO: Subida de Comprobante (solo si orden está liberada y pago no verificado) */}
    {order.paymentReleaseStatus === 'RELEASED_TO_CUSTOMER' &&
     order.payments[0] &&
     !order.payments[0].paymentProofVerified && (
      <PaymentProofUploader
        payment={order.payments[0]}
        onUploadSuccess={(data) => {
          // Refrescar datos de la orden
          refreshOrders();
        }}
      />
    )}
  </div>
))}
```

### Panel de Soporte (Órdenes)

**Archivo a modificar:** `pages/admin/ordenes.js`

```jsx
// Agregar botones y modales para:

1. Liberar Orden de Compra
<button onClick={() => handleReleaseOrder(order.id)}>
  Liberar Orden de Compra
</button>

async function handleReleaseOrder(orderId) {
  const response = await fetch('/api/admin/orders/update-release', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderId,
      releaseStatus: 'RELEASED_TO_CUSTOMER',
      notes: 'Confirmado vía telefónica'
    })
  });

  if (response.ok) {
    toast.success('Orden liberada al cliente');
    refreshOrders();
  }
}

2. Ver Comprobante de Pago
{order.payments[0]?.paymentProof && (
  <a href={order.payments[0].paymentProof} target="_blank">
    Ver Comprobante
  </a>
)}

3. Verificar Comprobante
<button onClick={() => handleVerifyProof(order.payments[0].id, true)}>
  Aprobar
</button>
<button onClick={() => handleVerifyProof(order.payments[0].id, false)}>
  Rechazar
</button>

async function handleVerifyProof(paymentId, approved) {
  const notes = approved
    ? 'Pago verificado correctamente'
    : prompt('Razón del rechazo:');

  const response = await fetch('/api/admin/payments/verify-proof', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentId, approved, notes })
  });

  if (response.ok) {
    toast.success(approved ? 'Pago confirmado' : 'Comprobante rechazado');
    refreshOrders();
  }
}

4. Actualizar Tracking
<select onChange={(e) => handleUpdateTracking(order.id, e.target.value)}>
  <option value="ORDER_RECEIVED">Pedido Recibido</option>
  <option value="PAYMENT_VERIFICATION">Verificando Pago</option>
  <option value="PREPARING_ORDER">Preparando Pedido</option>
  <option value="IN_TRANSIT">En Camino</option>
  <option value="DELIVERED">Entregado</option>
</select>

async function handleUpdateTracking(orderId, trackingStatus) {
  const note = prompt('Nota (opcional):');

  const response = await fetch('/api/admin/orders/update-tracking', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, trackingStatus, note })
  });

  if (response.ok) {
    toast.success('Estado actualizado');
    refreshOrders();
  }
}
```

---

## 🔐 Seguridad

### Autenticación
- Todos los endpoints requieren sesión activa
- Endpoints de admin requieren `role: 'SOPORTE'`

### Validaciones de Archivos
- Solo PDFs e imágenes (JPG, PNG)
- Tamaño máximo: 10MB
- Validación de ownership (solo el dueño puede subir)

### Validaciones de Datos
- Estados válidos verificados en cada endpoint
- Transacciones atómicas en operaciones críticas
- Timestamps automáticos para auditoría

---

## 📊 Estados del Sistema

### PaymentReleaseStatus
| Estado | Descripción | Acción de Soporte |
|--------|-------------|-------------------|
| `WAITING_SUPPORT` | Esperando revisión | Revisar y llamar |
| `CALL_SCHEDULED` | Llamada programada | Contactar cliente |
| `RELEASED_TO_CUSTOMER` | Orden liberada | Ya liberada |
| `ON_HOLD` | En espera | Resolver pendiente |

### TrackingStatus
| Estado | Descripción | Visible para Cliente |
|--------|-------------|---------------------|
| `ORDER_RECEIVED` | Pedido registrado | ✅ Pedido Recibido |
| `PAYMENT_VERIFICATION` | Verificando pago | 🔍 Verificando Pago |
| `PREPARING_ORDER` | Preparando productos | 📦 Preparando Pedido |
| `IN_TRANSIT` | En camino | 🚚 En Camino |
| `DELIVERED` | Entregado | ✅ Entregado |

### PaymentStatus
| Estado | Descripción |
|--------|-------------|
| `PENDING` | Esperando pago |
| `PROCESSING` | Verificando comprobante |
| `COMPLETED` | Pago confirmado |
| `FAILED` | Comprobante rechazado |

---

## 🎨 Componentes UI

### OrderRelease
**Props:**
- `orderReleaseData`: Objeto con datos de pago
- `paymentMethod`: Método de pago seleccionado
- `orderNumber`: Número de orden

**Muestra:**
- Instrucciones paso a paso
- Cuentas bancarias con botón copiar
- Datos de contacto (si aplica)
- Tiendas físicas (si aplica)
- Notas importantes

### PaymentProofUploader
**Props:**
- `payment`: Objeto Payment
- `onUploadSuccess`: Callback al subir

**Estados:**
- Sin comprobante: Muestra zona de drop
- Subiendo: Spinner de carga
- Verificando: Badge azul "En Verificación"
- Verificado: Badge verde "Verificado"

### PizzaTracker
**Props:**
- `trackingStatus`: Estado actual
- `trackingHistory`: Array de cambios
- `createdAt`: Fecha de creación

**Features:**
- Responsive (horizontal/vertical)
- Animaciones de progreso
- Historial colapsable
- Timestamps formateados

---

## 🚀 Próximos Pasos

Para completar la integración:

1. **Actualizar página de cliente** (`pages/mi-cuenta/pedidos.js`):
   - Importar componentes nuevos
   - Agregar OrderRelease cuando orden esté liberada
   - Agregar PaymentProofUploader
   - Agregar PizzaTracker

2. **Actualizar panel de soporte** (`pages/admin/ordenes.js`):
   - Botón "Liberar Orden de Compra"
   - Ver comprobantes subidos
   - Botones aprobar/rechazar comprobante
   - Selector de tracking status

3. **Configurar notificaciones** (opcional):
   - Email cuando se libera orden
   - Email cuando se sube comprobante
   - Email cuando se verifica pago

4. **Crear carpeta de uploads**:
   ```bash
   mkdir -p public/uploads/payment-proofs
   ```

5. **Ejecutar migración de Prisma** (ya hecho):
   ```bash
   npx prisma migrate dev
   ```

---

## 📝 Notas Importantes

### Datos de Ejemplo
Los datos en `paymentOrderData.js` son de ejemplo. **Debes actualizarlos** con:
- Cuentas bancarias reales
- Números de teléfono reales
- Direcciones de tiendas reales
- Horarios correctos

### Personalización
Puedes modificar:
- Colores de los estados en PizzaTracker
- Textos de instrucciones
- Validaciones de archivos
- Límites de tamaño

### Pruebas Recomendadas
1. Crear orden completa desde checkout
2. Liberar orden desde panel de soporte
3. Subir comprobante como cliente
4. Verificar comprobante como soporte
5. Actualizar tracking status
6. Verificar que cliente ve cambios

---

## 🆘 Soporte

Si encuentras algún problema:

1. Verifica que la migración de Prisma se aplicó correctamente
2. Revisa que formidable está instalado
3. Confirma que la carpeta de uploads existe
4. Revisa logs del servidor para errores
5. Verifica permisos de archivos en producción

---

**¡Sistema completo y listo para integrar!** 🎉
