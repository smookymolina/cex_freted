# Guía de Integración del Servicio de Pagos

## Descripción General

Este sistema de pagos interno te permite gestionar órdenes y pagos sin necesidad de APIs externas. Todo se maneja de forma local en tu base de datos.

## Estructura Creada

### 1. Base de Datos (Prisma Schema)

Se agregaron los siguientes modelos:

- **Order**: Almacena las órdenes de compra
- **Payment**: Gestiona los pagos asociados a cada orden
- **OrderStatus**: Estados de las órdenes (PENDING, PAYMENT_CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED)
- **PaymentMethod**: Métodos de pago disponibles (BANK_TRANSFER, CASH_DEPOSIT, PHONE_PAYMENT, STORE_PAYMENT, CARD_PRESENT)
- **PaymentStatus**: Estados de los pagos (PENDING, PROCESSING, COMPLETED, FAILED, REFUNDED, CANCELLED)

### 2. Servicio de Pagos

**Ubicación**: `services/paymentService.js`

Funciones principales:
- `createOrder()`: Crea una orden con pago pendiente
- `getOrderByNumber()`: Obtiene una orden por su número
- `getUserOrders()`: Obtiene todas las órdenes de un usuario
- `confirmPayment()`: Confirma un pago (administrativo)
- `cancelPayment()`: Cancela un pago (administrativo)
- `updateOrderStatus()`: Actualiza el estado de una orden
- `getPaymentStats()`: Obtiene estadísticas de pagos
- `getPendingPayments()`: Lista pagos pendientes de confirmación

### 3. APIs Creadas

#### APIs para Usuarios:

- **POST** `/api/payments/create-order`: Crea una nueva orden
- **GET** `/api/payments/my-orders`: Obtiene las órdenes del usuario
- **GET** `/api/payments/order-details?orderNumber=XXX`: Detalles de una orden

#### APIs Administrativas:

- **POST** `/api/admin/payments/confirm`: Confirma un pago
- **POST** `/api/admin/payments/cancel`: Cancela un pago
- **GET** `/api/admin/payments/pending`: Lista pagos pendientes
- **GET** `/api/admin/payments/stats`: Estadísticas de pagos

### 4. Utilidades

**Ubicación**: `utils/checkoutHelper.js`

Funciones auxiliares para facilitar la integración.

## Pasos para Implementar

### Paso 1: Migrar la Base de Datos

```bash
npx prisma migrate dev --name add_payment_system
npx prisma generate
```

### Paso 2: Integrar en el Checkout

Modifica tu archivo `pages/checkout/index.js` para usar el nuevo sistema.

#### Ejemplo de integración en el paso de pago:

```javascript
import { processCheckout } from '../../utils/checkoutHelper';

// Dentro de tu componente CheckoutPage
const handlePaymentConfirmation = async () => {
  setPaymentStatus('processing');

  const result = await processCheckout({
    customer: customerData,
    shipping: shippingData,
    cart: cart,
    totals: {
      subtotal,
      shippingCost,
      total,
    },
    paymentMethod: 'PHONE_PAYMENT', // o el método que seleccione el usuario
  });

  if (result.success) {
    // Guardar información de la orden
    setOrderInfo({
      orderNumber: result.order.orderNumber,
      paymentReference: result.payment.referenceNumber,
      total: result.order.total,
    });

    setPaymentStatus('needs_call');
    setShowCallInstructions(true);
  } else {
    setPaymentStatus('failed');
    alert('Error al procesar la orden: ' + result.error);
  }
};
```

### Paso 3: Mostrar el Número de Referencia

Una vez creada la orden, muestra al usuario:

```javascript
<p>
  Tu número de orden es: <strong>{orderInfo.orderNumber}</strong>
</p>
<p>
  Referencia de pago: <strong>{orderInfo.paymentReference}</strong>
</p>
```

### Paso 4: Crear Página de Pedidos del Usuario

Crea una página para que los usuarios vean sus pedidos:

**Ubicación sugerida**: `pages/mi-cuenta/pedidos.js`

```javascript
import { useEffect, useState } from 'react';
import { getUserOrders, formatOrderStatus } from '../../utils/checkoutHelper';

export default function MisPedidos() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      const result = await getUserOrders();
      if (result.success) {
        setOrders(result.orders);
      }
      setLoading(false);
    }
    fetchOrders();
  }, []);

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <h1>Mis Pedidos</h1>
      {orders.map(order => {
        const status = formatOrderStatus(order.status);
        return (
          <div key={order.id} style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
            <h3>Orden: {order.orderNumber}</h3>
            <p>Total: ${order.total}</p>
            <p>Estado: <span style={{ color: status.color }}>{status.label}</span></p>
            <p>Fecha: {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        );
      })}
    </div>
  );
}
```

### Paso 5: Panel Administrativo (Opcional)

Crea una página administrativa para confirmar pagos:

**Ubicación sugerida**: `pages/admin/pagos.js`

```javascript
import { useEffect, useState } from 'react';

export default function AdminPagos() {
  const [pendingPayments, setPendingPayments] = useState([]);

  useEffect(() => {
    async function fetchPending() {
      const response = await fetch('/api/admin/payments/pending');
      const data = await response.json();
      if (data.success) {
        setPendingPayments(data.payments);
      }
    }
    fetchPending();
  }, []);

  const confirmPayment = async (paymentId, transactionId) => {
    const response = await fetch('/api/admin/payments/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paymentId,
        transactionId,
        notes: 'Pago confirmado telefónicamente',
      }),
    });

    if (response.ok) {
      alert('Pago confirmado');
      // Recargar lista
      window.location.reload();
    }
  };

  return (
    <div>
      <h1>Pagos Pendientes</h1>
      {pendingPayments.map(payment => (
        <div key={payment.id} style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
          <h3>Ref: {payment.referenceNumber}</h3>
          <p>Monto: ${payment.amount}</p>
          <p>Cliente: {payment.order.customerName}</p>
          <p>Email: {payment.order.customerEmail}</p>
          <button onClick={() => confirmPayment(payment.id, 'MANUAL-' + Date.now())}>
            Confirmar Pago
          </button>
        </div>
      ))}
    </div>
  );
}
```

## Flujo Completo

### Flujo del Usuario:

1. Usuario agrega productos al carrito
2. Va a checkout y llena datos (cliente + envío)
3. Selecciona método de pago
4. Sistema crea orden con estado PENDING
5. Se genera número de orden y referencia de pago
6. Usuario recibe instrucciones para completar el pago (llamada, transferencia, etc.)
7. Usuario puede ver sus órdenes en "Mis Pedidos"

### Flujo Administrativo:

1. Cliente realiza el pago (transferencia, llamada, etc.)
2. Admin ve el pago en "Pagos Pendientes"
3. Admin verifica el pago y lo confirma en el sistema
4. Sistema actualiza:
   - Payment status → COMPLETED
   - Order status → PAYMENT_CONFIRMED
5. Opcionalmente, actualizar estado a PROCESSING, SHIPPED, DELIVERED

## Métodos de Pago Disponibles

Puedes personalizar los métodos en el schema:

- `BANK_TRANSFER`: Transferencia bancaria
- `CASH_DEPOSIT`: Depósito en efectivo
- `PHONE_PAYMENT`: Pago telefónico
- `STORE_PAYMENT`: Pago en tienda física
- `CARD_PRESENT`: Pago con tarjeta presencial

## Seguridad y Mejoras

### Recomendaciones:

1. **Autenticación de Admin**: Implementa verificación de roles para las rutas administrativas
2. **Validación de Pagos**: Agrega validaciones adicionales antes de confirmar pagos
3. **Notificaciones**: Implementa emails cuando se cree una orden o se confirme un pago
4. **Logs de Auditoría**: Registra quién confirma/cancela pagos
5. **Webhooks Internos**: Crea eventos cuando cambie el estado de una orden

### Ejemplo de verificación de admin:

```javascript
// En las rutas admin
const session = await getSession({ req });
if (!session?.user?.isAdmin) {
  return res.status(403).json({ error: 'Acceso denegado' });
}
```

## Variables de Entorno

Asegúrate de tener configurado tu `DATABASE_URL` en `.env`:

```env
DATABASE_URL="file:./dev.db"
```

## Consultas Útiles

### Ver todas las órdenes en la base de datos:

```javascript
const allOrders = await prisma.order.findMany({
  include: {
    payments: true,
    user: true,
  },
});
```

### Buscar órdenes por estado:

```javascript
const pendingOrders = await prisma.order.findMany({
  where: {
    status: 'PENDING',
  },
});
```

### Reporte de ventas:

```javascript
const stats = await PaymentService.getPaymentStats();
console.log(stats);
```

## Soporte

Si tienes preguntas o necesitas ayuda con la integración, revisa:

1. Documentación de Prisma: https://www.prisma.io/docs
2. Documentación de Next.js API Routes: https://nextjs.org/docs/api-routes/introduction
3. Los comentarios en el código fuente

---

Sistema de Pagos CEX Freted - Versión 1.0
