# Instrucciones para Configurar Conversiones de Google Ads

## ✅ Implementación Completada

La etiqueta de Google Ads y el evento de conversión ya están implementados correctamente en el proyecto.

### 1. Etiqueta de Google (gtag.js) ✓

**Ubicación:** `pages/_document.js` (líneas 8-19)

La etiqueta global ya está instalada y se carga en todas las páginas:

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

### 2. Evento de Conversión ✓

**Ubicación:** `pages/checkout/confirmacion.js` (líneas 36-51)

El evento de conversión se dispara automáticamente cuando un usuario completa una compra:

```javascript
window.gtag('event', 'conversion', {
  'send_to': 'AW-17725557502/Z_-OCMLjqsAbEP6VmoRC',
  'transaction_id': orderData.orderInfo?.orderNumber || '',
  'value': orderData.orderInfo?.total || 0,
  'currency': 'MXN'
});
```

**Parámetros enviados:**
- `send_to`: ID de conversión de Google Ads
- `transaction_id`: Número de orden único
- `value`: Valor total de la compra
- `currency`: Moneda (MXN - Peso Mexicano)

---

## 📋 Pasos para Configurar en Google Ads

### Paso 1: Verificar la Etiqueta de Google

1. Ve a tu cuenta de Google Ads
2. Navega a **Herramientas y configuración** > **Medición** > **Conversiones**
3. Verifica que tu ID de conversión aparezca: `AW-17725557502`

### Paso 2: Crear o Verificar la Acción de Conversión

1. En la página de Conversiones, busca la acción llamada **"Compra (1)"**
2. Verifica que el ID de conversión coincida: `AW-17725557502/Z_-OCMLjqsAbEP6VmoRC`
3. Si no existe, créala:
   - Haz clic en **+ Nueva acción de conversión**
   - Selecciona **Sitio web**
   - Elige **Compra** como categoría
   - Configura:
     - **Nombre:** Compra (1)
     - **Valor:** Usa valores específicos de transacción
     - **Recuento:** Una conversión
     - **Ventana de conversión:** 30 días (recomendado)
     - **Modelo de atribución:** Basado en datos o último clic

### Paso 3: Configurar el Fragmento de Evento (Ya Implementado)

✅ **Ya completado** - El fragmento de evento está en `pages/checkout/confirmacion.js`

El evento se dispara automáticamente cuando:
- Usuario completa el checkout
- Es redirigido a `/checkout/confirmacion`
- La página carga los datos de la orden

### Paso 4: Probar la Conversión

#### Método 1: Usando Google Tag Assistant

1. Instala la extensión [Google Tag Assistant](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk)
2. Navega a `http://localhost:3000` (o tu dominio en producción)
3. Haz clic en el icono de Tag Assistant
4. Haz clic en **Enable** y luego **Record**
5. Completa una compra de prueba
6. En Tag Assistant, verifica:
   - ✅ Etiqueta de Google cargada
   - ✅ Evento de conversión disparado
   - ✅ `transaction_id` y `value` presentes

#### Método 2: Consola del Navegador

1. Abre la consola del navegador (F12)
2. Ve a la pestaña **Console**
3. Completa una compra
4. Deberías ver el mensaje:
   ```
   Evento de conversión de Google Ads disparado: {
     transaction_id: "ORD-XXXXX",
     value: XXXX
   }
   ```

#### Método 3: Network Tab

1. Abre las herramientas de desarrollo (F12)
2. Ve a la pestaña **Network**
3. Filtra por "google" o "gtag"
4. Completa una compra
5. Busca una petición a `google-analytics.com` o `googleadservices.com`
6. Verifica que incluya los parámetros de conversión

### Paso 5: Verificar en Google Ads (Producción)

**IMPORTANTE:** Las conversiones solo se registrarán cuando el sitio esté en producción.

1. En Google Ads, ve a **Conversiones**
2. Busca la acción "Compra (1)"
3. Verifica el estado:
   - ✅ **"Sin conversiones registradas recientemente"** es normal en desarrollo
   - ✅ **"Registrando conversiones"** aparecerá después de la primera compra real
4. Las conversiones pueden tardar **24-48 horas** en aparecer

### Paso 6: Configurar Valores de Conversión (Opcional)

Si quieres asignar un valor predeterminado en lugar del valor de transacción:

1. En Google Ads, edita la acción de conversión
2. En **Valor**, selecciona:
   - **Usar valores diferentes para cada conversión** (recomendado - ya implementado)
   - O **Usar el mismo valor para cada conversión**

---

## 🔍 Solución de Problemas

### El evento no se dispara

**Verificar:**
1. ✅ La etiqueta de Google está en `_document.js`
2. ✅ El código de conversión está en `confirmacion.js`
3. ✅ La función `gtag` está disponible globalmente
4. ✅ Los datos de orden están presentes

**Solución:**
```javascript
// Verifica en la consola:
console.log('gtag disponible?', typeof window.gtag !== 'undefined');
console.log('Datos de orden:', orderData);
```

### Conversiones duplicadas

Si un usuario recarga la página de confirmación, el evento podría dispararse múltiples veces.

**Solución implementada:**
- El `sessionStorage` se limpia después de cargar los datos
- Si el usuario recarga, es redirigido a `/checkout`
- Esto previene conversiones duplicadas

### ID de transacción vacío

Si `transaction_id` está vacío:

**Verificar:**
```javascript
console.log('Order number:', orderData.orderInfo?.orderNumber);
```

**Solución:**
Asegúrate de que el `orderNumber` se guarda correctamente en `sessionStorage` durante el checkout.

---

## 📊 Métricas a Monitorear

Una vez en producción, monitorea:

1. **Tasa de conversión:** Conversiones / Clics
2. **Costo por conversión:** Gasto total / Conversiones
3. **Valor de conversión total:** Suma de todos los valores
4. **ROAS (Return on Ad Spend):** Ingresos / Gasto en anuncios

---

## 🚀 Próximos Pasos

1. ✅ Código implementado
2. ⏳ Subir cambios a producción
3. ⏳ Realizar compra de prueba en producción
4. ⏳ Verificar conversión en Google Ads (24-48 horas después)
5. ⏳ Optimizar campañas basándose en datos de conversión

---

## 📝 Notas Importantes

- **Las conversiones en localhost NO se registrarán en Google Ads**
- Solo las conversiones de tu dominio en producción se contabilizarán
- Asegúrate de que el dominio de producción coincida con el configurado en Google Ads
- Los eventos se pueden ver en tiempo real en Google Analytics 4 (si está configurado)
- Para prevenir fraude, Google Ads puede filtrar algunas conversiones sospechosas

---

## 📞 Soporte

Si necesitas ayuda adicional:
- [Centro de ayuda de Google Ads - Conversiones](https://support.google.com/google-ads/answer/6095821)
- [Solución de problemas de seguimiento de conversiones](https://support.google.com/google-ads/answer/2701015)
