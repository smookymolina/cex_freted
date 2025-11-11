# Sistema de Verificación de Email para Usuarios

## ✅ Sistema Activado

Los usuarios **DEBEN verificar su email antes de poder iniciar sesión**.

## 🔄 Flujo completo

### 1. Usuario se registra
- El usuario crea una cuenta en tu aplicación
- Se crea el usuario en la base de datos con `emailVerified: null`
- **Automáticamente** se genera un token de verificación único
- **Automáticamente** se envía un email de verificación al usuario
- El usuario ve el mensaje: _"Cuenta creada exitosamente. Te hemos enviado un email de verificación..."_

### 2. Usuario recibe el email
- **De**: victorvondoon034@gmail.com
- **Para**: [email del usuario]
- **Asunto**: "Verifica tu correo electrónico"
- El email contiene:
  - Diseño HTML profesional
  - Botón "Verificar correo electrónico"
  - Link alternativo (por si el botón no funciona)
  - Aviso de que expira en 24 horas

### 3. Usuario verifica su email
- Hace clic en el botón o link del email
- El sistema:
  - Valida el token
  - Verifica que no haya expirado
  - Marca el email como verificado (`emailVerified: [fecha actual]`)
  - Elimina el token usado
  - Envía email de bienvenida
  - Redirige al login con mensaje de éxito

### 4. Usuario intenta iniciar sesión
- **Con email verificado**: ✅ Puede iniciar sesión normalmente
- **Sin email verificado**: ❌ Ve el error: _"Por favor verifica tu correo electrónico antes de iniciar sesión..."_

## 📧 ¿Qué pasa si no reciben el email?

### Opción 1: Componente en el login
Agrega el componente `ResendVerificationForm` en tu página de login:

```jsx
import ResendVerificationForm from '@/components/auth/ResendVerificationForm';

export default function LoginPage() {
  return (
    <div>
      {/* Tu formulario de login */}

      {/* Formulario para reenviar verificación */}
      <ResendVerificationForm />
    </div>
  );
}
```

El usuario podrá:
- Hacer clic en "¿No recibiste el email de verificación?"
- Ingresar su email
- Recibir un nuevo email de verificación

### Opción 2: Endpoint directo
También pueden llamar directamente al endpoint:

```javascript
POST /api/auth/resend-verification
Content-Type: application/json

{
  "email": "usuario@ejemplo.com"
}
```

## 🔒 Seguridad

### Tokens seguros
- Generados con `crypto.randomBytes(32)` (256 bits de aleatoriedad)
- Únicos por usuario
- Expiran en 24 horas
- Se eliminan después de usarse
- Se eliminan al reenviar (solo 1 token activo por usuario)

### Prevención de enumeración de usuarios
- El endpoint de reenvío no revela si un email existe o no
- Siempre responde con éxito (aunque el usuario no exista)
- Solo valida en el proceso de verificación

### Validaciones
- Token debe existir en la base de datos
- Token no debe estar expirado
- Usuario debe existir
- Email no debe estar ya verificado

## 📂 Archivos del sistema

### Backend
- `lib/email.js` - Configuración de Brevo y funciones de envío
- `pages/api/auth/register.js` - Envía verificación al registrarse
- `pages/api/auth/verify-email.js` - Reenviar verificación (requiere login)
- `pages/api/auth/resend-verification.js` - Reenviar verificación (público)
- `pages/api/auth/verify-email/confirm.js` - Procesa la verificación
- `pages/api/auth/[...nextauth].js` - Bloquea login sin verificar

### Frontend
- `components/EmailVerificationBanner.jsx` - Banner para usuarios autenticados
- `components/auth/ResendVerificationForm.jsx` - Formulario de reenvío público

### Base de datos
- Tabla `User` - campo `emailVerified`
- Tabla `VerificationToken` - almacena tokens temporales

## 🧪 Prueba el sistema

### 1. Inicia la aplicación
```bash
npm run dev
```

### 2. Registra un usuario nuevo
- Usa un email real al que tengas acceso
- Anota las credenciales

### 3. Intenta iniciar sesión SIN verificar
- Deberías ver el error: _"Por favor verifica tu correo electrónico..."_

### 4. Revisa tu email
- Busca en inbox y spam
- Email de: victorvondoon034@gmail.com
- Asunto: "Verifica tu correo electrónico"

### 5. Haz clic en el botón de verificación
- Te redirigirá al login
- Verás mensaje de éxito (`?verified=true`)

### 6. Inicia sesión nuevamente
- Ahora SÍ deberías poder entrar

## ⚙️ Configuración opcional

### Cambiar tiempo de expiración
En los archivos donde se genera el token, cambia:

```javascript
expires.setHours(expires.getHours() + 24); // 24 horas
```

A por ejemplo:

```javascript
expires.setHours(expires.getHours() + 48); // 48 horas
expires.setMinutes(expires.getMinutes() + 30); // 30 minutos
```

### Cambiar diseño del email
Edita las funciones en `lib/email.js`:
- `sendVerificationEmail()` - Email de verificación
- `sendWelcomeEmail()` - Email de bienvenida

### Permitir login sin verificar (desactivar)
Si quieres DESACTIVAR la verificación obligatoria, comenta estas líneas en `pages/api/auth/[...nextauth].js`:

```javascript
// if (!user.emailVerified) {
//   throw new Error('Por favor verifica tu correo electrónico antes de iniciar sesión. Revisa tu bandeja de entrada o carpeta de spam.');
// }
```

## 📊 Límites de Brevo (plan gratuito)

- ✅ 300 emails por día
- ✅ Ilimitados destinatarios
- ✅ Sin límite de tiempo
- ✅ Sin tarjeta de crédito requerida

## ❓ Troubleshooting

### Los emails no llegan
1. Verifica que las credenciales en `.env` sean correctas
2. Revisa la carpeta de spam
3. Verifica el dominio en Brevo (opcional pero recomendado)
4. En desarrollo, el link se imprime en la consola del servidor

### Token expirado
- Los usuarios pueden solicitar un nuevo token
- Usar el componente `ResendVerificationForm`
- O llamar al endpoint `/api/auth/resend-verification`

### Usuario ya verificado
- El sistema previene verificaciones duplicadas
- Si intentan verificar de nuevo, los redirige al login

### Email no se muestra como verificado
- Verifica en la base de datos: `SELECT emailVerified FROM User WHERE email = '...'`
- Debe tener una fecha/hora, no `null`
