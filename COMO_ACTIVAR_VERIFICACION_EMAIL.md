# 📧 Cómo Activar la Verificación de Email

## ⚠️ Estado Actual

**La verificación de email está DESACTIVADA.**

Los usuarios pueden:
- ✅ Registrarse sin verificar email
- ✅ Iniciar sesión inmediatamente después de registrarse
- ✅ Acceder a todas las funcionalidades sin restricciones

---

## 🔧 Para Activar la Verificación (Futuro)

Cuando tengas configurado correctamente tu servicio de email, sigue estos pasos:

### PASO 1: Configurar el servicio de email

1. **Opción A: Verificar dominio en Brevo**
   - Ve a https://app.brevo.com
   - Settings → Senders, domains, IPs
   - Agrega tu email remitente
   - Verifica el dominio

2. **Opción B: Usar Gmail**
   - Configura las credenciales en `.env`:
     ```env
     BREVO_SMTP_HOST=smtp.gmail.com
     BREVO_SMTP_PORT=587
     BREVO_SMTP_USER=tu-email@gmail.com
     BREVO_SMTP_KEY=tu-app-password
     EMAIL_FROM=tu-email@gmail.com
     ```

3. **Opción C: Usar Resend (alternativa moderna)**
   - Registrarte en https://resend.com
   - Instalar: `npm install resend`
   - Actualizar el código en `lib/email.js`

### PASO 2: Activar el envío de emails

Edita `pages/api/auth/register.js` (línea 42-77):

**DESCOMENTAR** todo el bloque que está entre `/*` y `*/`:

```javascript
// Generar token de verificación
const verificationToken = generateVerificationToken();
const expires = new Date();
expires.setHours(expires.getHours() + 24);

// Guardar token en la base de datos
await prisma.verificationToken.create({
  data: {
    identifier: email,
    token: verificationToken,
    expires,
  },
});

// Enviar email de verificación
sendVerificationEmail(email, verificationToken)
  .then((result) => {
    if (result.success) {
      console.log('[REGISTRO] ✅ Email de verificación enviado a:', email);
    } else {
      console.error('[REGISTRO] ❌ Error al enviar email:', result.error);
    }
  })
  .catch((error) => {
    console.error('[REGISTRO] ❌ Error crítico enviando email:', error);
  });

const verificationLink = `${process.env.NEXTAUTH_URL}/api/auth/verify-email/confirm?token=${verificationToken}`;
console.log('[REGISTRO] Link de verificación:', verificationLink);
```

Y cambiar el mensaje de respuesta:

```javascript
res.status(201).json({
  message: 'Cuenta creada exitosamente. Te hemos enviado un email de verificación. Por favor revisa tu bandeja de entrada.',
  userId: user.id,
  requiresVerification: true,
  // Solo en desarrollo
  ...(process.env.NODE_ENV === 'development' && { verificationLink })
});
```

### PASO 3: Activar el bloqueo de login

Edita `pages/api/auth/[...nextauth].js` (línea 47-51):

**DESCOMENTAR** estas líneas:

```javascript
if (!user.emailVerified) {
  throw new Error('Por favor verifica tu correo electrónico antes de iniciar sesión. Revisa tu bandeja de entrada o carpeta de spam.');
}
```

### PASO 4: Probar el sistema

1. Reinicia el servidor:
   ```bash
   npm run dev
   ```

2. Registra un usuario de prueba

3. Verifica que:
   - ✅ Se envía el email
   - ✅ El email llega (revisa spam)
   - ✅ No puedes iniciar sesión sin verificar
   - ✅ Después de verificar, sí puedes iniciar sesión

---

## 📁 Archivos Relacionados

### Backend
- `pages/api/auth/register.js` - Registro y envío de email
- `pages/api/auth/[...nextauth].js` - Validación de login
- `pages/api/auth/verify-email.js` - Reenviar verificación (autenticado)
- `pages/api/auth/resend-verification.js` - Reenviar verificación (público)
- `pages/api/auth/verify-email/confirm.js` - Procesar verificación
- `lib/email.js` - Funciones de envío de email

### Frontend
- `components/EmailVerificationBanner.jsx` - Banner para usuarios autenticados
- `components/auth/ResendVerificationForm.jsx` - Formulario de reenvío

### Configuración
- `.env` - Credenciales de email
- `prisma/schema.prisma` - Modelo de datos

---

## 🧪 Tests Disponibles

Si necesitas probar el sistema de email, usa:

```bash
# Probar envío básico
node -e "require('dotenv').config(); const {sendVerificationEmail} = require('./lib/email'); sendVerificationEmail('test@ejemplo.com', 'test123').then(r => console.log(r));"
```

---

## ❓ Preguntas Frecuentes

### ¿Por qué está desactivado?

El sistema de verificación de email requiere:
1. Un servicio de email configurado correctamente (Brevo, Gmail, Resend, etc.)
2. Dominio verificado para evitar que los emails vayan a spam
3. Tiempo de configuración y pruebas

Para acelerar el desarrollo, se desactivó temporalmente.

### ¿Es seguro sin verificación?

Para desarrollo: Sí, es aceptable.

Para producción: Se recomienda activar la verificación para:
- Validar que los emails son reales
- Evitar cuentas spam/fake
- Poder contactar a los usuarios
- Cumplir con buenas prácticas de seguridad

### ¿Qué pasa con las cuentas existentes?

Las cuentas creadas sin verificación tendrán `emailVerified: null`.

Cuando actives la verificación:
- Usuarios nuevos: Deberán verificar
- Usuarios antiguos: Puedes actualizarlos manualmente en la DB o permitirles continuar sin verificar

Para actualizar usuarios antiguos:

```javascript
// Marcar todos los usuarios antiguos como verificados
await prisma.user.updateMany({
  where: { emailVerified: null },
  data: { emailVerified: new Date() }
});
```

---

## 📚 Documentación Adicional

- `SETUP_EMAIL.md` - Guía de configuración de Brevo
- `VERIFICACION_EMAIL_USUARIOS.md` - Documentación del sistema completo
- `GUIA_COMPLETA_5_PASOS.md` - Tutorial paso a paso

---

## 💡 Recomendaciones

Cuando estés listo para activar la verificación:

1. **Usa Resend** si tienes presupuesto (mejor que Brevo)
   - 3,000 emails/mes gratis
   - Mejor deliverability
   - API más simple

2. **Verifica el dominio** antes de activar
   - Los emails llegarán correctamente
   - No irán a spam
   - Mejor experiencia de usuario

3. **Prueba exhaustivamente** antes de activar en producción
   - Registra varios usuarios de prueba
   - Usa diferentes proveedores de email (Gmail, Outlook, Yahoo)
   - Verifica que los emails lleguen a todos

4. **Considera un plan de migración** para usuarios existentes
   - Decide si los usuarios antiguos necesitan verificar
   - Comunica los cambios con anticipación
   - Ofrece soporte durante la transición
