# Implementación de Google Ads Conversion Tracking

## Resumen
Este documento describe la implementación del seguimiento de conversiones de Google Ads en el sitio web de Sociedad Tecnológica Integral.

## ID de Conversión
- **Google Ads ID**: `AW-17725557502`
- **Conversion ID**: `Z_-OCMLjqsAbEP6VmoRC`

## Implementación

### 1. Etiqueta Global de Google (gtag.js)

La etiqueta global de Google está instalada en `pages/_document.js` (líneas 8-19).

Esta etiqueta se carga en todas las páginas del sitio automáticamente.

```javascript
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-17725557502"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'AW-17725557502');
</script>
```

### 2. Eventos de Conversión

Los eventos de conversión se disparan en las siguientes páginas:

#### A. Confirmación de Compra
**Archivo**: `pages/checkout/confirmacion.js` (líneas 36-51)

El evento se dispara cuando un usuario completa una compra exitosamente.

**Parámetros enviados**:
- `transaction_id`: Número de orden
- `value`: Monto total de la compra
- `currency`: MXN (Peso Mexicano)

```javascript
window.gtag('event', 'conversion', {
  'send_to': 'AW-17725557502/Z_-OCMLjqsAbEP6VmoRC',
  'transaction_id': orderData.orderInfo?.orderNumber || '',
  'value': orderData.orderInfo?.total || 0,
  'currency': 'MXN'
});
```

#### B. Confirmación de Venta
**Archivo**: `components/vender/SaleConfirmation.jsx` (líneas 13-24)

El evento se dispara cuando un vendedor completa el proceso de venta de un dispositivo.

**Parámetros enviados**:
- `transaction_id`: ID de la orden de venta

```javascript
window.gtag('event', 'conversion', {
  'send_to': 'AW-17725557502/Z_-OCMLjqsAbEP6VmoRC',
  'transaction_id': confirmationData.orderId || ''
});
```

## Verificación

Para verificar que el seguimiento funciona correctamente:

1. **Google Tag Assistant**: Usa la extensión de Chrome [Google Tag Assistant](https://tagassistant.google.com/) para verificar que las etiquetas se están disparando correctamente.

2. **Consola del navegador**: Los eventos de conversión registran mensajes en la consola:
   ```
   Evento de conversión de Google Ads disparado: { transaction_id: ..., value: ... }
   ```

3. **Google Ads**: En tu cuenta de Google Ads, verifica las conversiones en:
   - Herramientas y configuración → Medición → Conversiones

## Notas Importantes

1. **Tiempo de procesamiento**: Las conversiones pueden tardar hasta 24-48 horas en aparecer en Google Ads.

2. **Modo desarrollo**: Los eventos se disparan tanto en desarrollo como en producción. Para filtrar conversiones de prueba en Google Ads, considera usar diferentes IDs de conversión para desarrollo/producción.

3. **Privacy**: El seguimiento respeta las configuraciones de privacidad del navegador. Los usuarios con bloqueadores de scripts publicitarios no se rastrearán.

4. **GDPR/Privacidad**: Asegúrate de tener el consentimiento apropiado del usuario según las leyes de privacidad aplicables antes de rastrear conversiones.

## Archivos Modificados

1. `pages/_document.js` - Etiqueta global de Google (ya estaba implementada)
2. `pages/checkout/confirmacion.js` - Evento de conversión de compra (ya estaba implementado)
3. `components/vender/SaleConfirmation.jsx` - Evento de conversión de venta (agregado)

## Mantenimiento

Si necesitas cambiar el ID de conversión en el futuro:

1. Actualiza el ID en `pages/_document.js`
2. Actualiza el `send_to` en ambos archivos de confirmación:
   - `pages/checkout/confirmacion.js`
   - `components/vender/SaleConfirmation.jsx`

## Contacto

Para más información sobre la cuenta de Google Ads, contacta a: vondoom765@gmail.com
