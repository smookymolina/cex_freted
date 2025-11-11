# Configuración de Verificación de Email con Brevo

Este proyecto utiliza Brevo (anteriormente Sendinblue) para enviar emails de verificación de forma gratuita.

## Pasos de configuración

### 1. Crear cuenta en Brevo

1. Ve a [https://www.brevo.com](https://www.brevo.com)
2. Haz clic en "Sign up free"
3. Completa el registro (es 100% gratis)
4. Plan gratuito: **300 emails por día**

### 2. Obtener credenciales SMTP

1. Inicia sesión en Brevo
2. Ve a **Settings** (Configuración) en el menú superior derecho
3. Haz clic en **SMTP & API**
4. En la sección **SMTP**, encontrarás:
   - **Login**: Tu email de registro
   - **SMTP Server**: smtp-relay.brevo.com
   - **Port**: 587 (recomendado)

5. Haz clic en **Generate a new SMTP key** para crear una contraseña SMTP
6. **¡IMPORTANTE!** Copia esta clave inmediatamente, no la volverás a ver : 

### 3. Configurar variables de entorno

Agrega estas variables a tu archivo `.env`:

```env
# Brevo (Sendinblue) SMTP Configuration
BREVO_SMTP_HOST=smtp-relay.brevo.com
BREVO_SMTP_PORT=587
BREVO_SMTP_USER=9b12b5001@smtp-brevo.com
BREVO_SMTP_KEY=xsmtpsib-e95e60e1ffad9c3c6efa7e55e0d7b8c10213d0dcf4b23162c5b4b4ec89d3c651-tQqsiAc1fBhr4AsM

# Email de envío
EMAIL_FROM=noreply@tudominio.com

# URL de tu aplicación (para los links de verificación)
NEXTAUTH_URL=http://localhost:3000
```

### 4. Verificar tu dominio de envío (Opcional pero recomendado)

Para mejor deliverability (que los emails no lleguen a spam):

1. En Brevo, ve a **Senders & IP**
2. Haz clic en **Senders**
3. Agrega y verifica tu dominio de email
4. Sigue las instrucciones para agregar registros SPF y DKIM a tu DNS

**Nota**: Puedes usar la cuenta gratuita sin verificar el dominio, pero los emails pueden tener más probabilidad de ir a spam.

### 5. Probar el envío de emails

Una vez configurado, puedes probar registrando un nuevo usuario:

```bash
npm run dev
```

Ve a tu página de registro y crea una cuenta. Deberías recibir un email de verificación.

## Funcionalidades implementadas

### 1. Verificación de email al registrarse
- Al crear una cuenta, el usuario recibe automáticamente un email de verificación
- El link de verificación expira en 24 horas
- El token es único y seguro (32 bytes random)

### 2. Reenviar email de verificación
- Los usuarios autenticados pueden solicitar un nuevo email de verificación
- Endpoint: `POST /api/auth/verify-email`
- Requiere autenticación

### 3. Confirmar verificación
- Al hacer clic en el link del email, el usuario confirma su cuenta
- Endpoint: `GET /api/auth/verify-email/confirm?token=xxx`
- Envía email de bienvenida automáticamente
- Redirige a la página de login con mensaje de éxito

### 4. Estado de verificación en sesión
- La sesión incluye `session.user.emailVerified`
- Puedes usar esto en el frontend para mostrar banners o avisos

## Personalizar los emails

Los templates de email están en `lib/email.js`:

1. **Email de verificación**: Función `sendVerificationEmail()`
2. **Email de bienvenida**: Función `sendWelcomeEmail()`

Puedes modificar el HTML y texto de estos emails según tu marca.

## Bloquear login de usuarios no verificados (Opcional)

Por defecto, los usuarios pueden iniciar sesión sin verificar su email. Si quieres REQUERIR la verificación:

Edita `pages/api/auth/[...nextauth].js` y descomenta estas líneas (aprox. línea 48):

```javascript
// if (!user.emailVerified) {
//   throw new Error('Por favor verifica tu correo electrónico antes de iniciar sesión');
// }
```

Quita las `//` para activarlo:

```javascript
if (!user.emailVerified) {
  throw new Error('Por favor verifica tu correo electrónico antes de iniciar sesión');
}
```

## Alternativas gratuitas a Brevo

Si prefieres usar otro servicio:

### Gmail (más simple)
- 500 emails/día gratis
- Usa tu cuenta personal
- Configuración:
  ```env
  BREVO_SMTP_HOST=smtp.gmail.com
  BREVO_SMTP_PORT=587
  BREVO_SMTP_USER=tu-email@gmail.com
  BREVO_SMTP_KEY=tu-app-password
  ```
- Necesitas habilitar "App Passwords" en tu cuenta de Google

### Resend (moderno)
- 3,000 emails/mes gratis
- Mejor deliverability
- Requiere cambiar el código para usar su API en lugar de SMTP
- [https://resend.com](https://resend.com)

## Troubleshooting

### Los emails no se envían
1. Verifica que las credenciales en `.env` sean correctas
2. Revisa los logs de la consola para ver errores específicos
3. En desarrollo, el link de verificación se imprime en la consola

### Los emails llegan a spam
1. Verifica tu dominio en Brevo
2. Configura registros SPF y DKIM
3. No uses palabras spam en el asunto o contenido
4. Calienta tu IP enviando pocos emails al principio

### Token expirado
- Los tokens expiran en 24 horas
- El usuario puede solicitar un nuevo token en `POST /api/auth/verify-email`
- Los tokens usados se eliminan automáticamente

## Límites del plan gratuito de Brevo

- 300 emails/día
- Emails ilimitados de destinatarios
- Sin límite de tiempo
- Sin tarjeta de crédito requerida
- Logo de Brevo en los emails (puedes quitarlo con plan pago)

## Soporte

Para más información:
- Documentación de Brevo: [https://developers.brevo.com](https://developers.brevo.com)
- Documentación de Nodemailer: [https://nodemailer.com](https://nodemailer.com)
