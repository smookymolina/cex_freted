# 🚀 GUÍA COMPLETA - SISTEMA DE VERIFICACIÓN DE EMAIL (5 PASOS)

## ✅ Sistema 100% Funcional

El diagnóstico confirmó que **TODO está funcionando correctamente**:
- ✅ Conexión con Brevo SMTP
- ✅ Envío de emails
- ✅ Base de datos configurada

---

## 📋 PASO 1: Ejecutar diagnóstico

Antes de empezar, verifica que todo funcione:

```bash
node diagnostico-email.js tu-email@ejemplo.com
```

Deberías ver:
```
🎉 ¡SISTEMA FUNCIONANDO CORRECTAMENTE!
```

Si ves errores, revisa las credenciales en `.env`.

---

## 🧪 PASO 2: Probar con página de prueba

Abre tu navegador y ve a:

```
http://localhost:3000/test-registro
```

**Instrucciones:**

1. **Inicia el servidor** (si no está corriendo):
   ```bash
   npm run dev
   ```

2. **Registra un usuario de prueba**:
   - Nombre: Cualquiera
   - Email: **USA UN EMAIL REAL** (para recibir la verificación)
   - Contraseña: Mínimo 6 caracteres

3. **Observa la consola del servidor**:
   ```
   [REGISTRO] Intento de registro: { name: '...', email: '...' }
   [REGISTRO] Usuario creado: { id: '...', email: '...' }
   [REGISTRO] Token de verificación generado y guardado
   [REGISTRO] Link de verificación: http://localhost:3000/api/auth/verify-email/confirm?token=...
   [REGISTRO] ✅ Email de verificación enviado a: ...
   ```

4. **Revisa tu email**:
   - Bandeja de entrada
   - **Carpeta de SPAM** (importante)
   - De: victorvondoon034@gmail.com
   - Asunto: "Verifica tu correo electrónico"

5. **Haz clic en el botón "Verificar correo electrónico"**

6. **Serás redirigido al login** con el mensaje de éxito

---

## 🔐 PASO 3: Probar el bloqueo de login

1. **Intenta iniciar sesión SIN verificar** (antes de hacer clic en el email):
   - Ve a: http://localhost:3000/mi-cuenta/login
   - Ingresa tus credenciales
   - Deberías ver: ❌ "Por favor verifica tu correo electrónico antes de iniciar sesión..."

2. **Verifica tu email** haciendo clic en el botón

3. **Intenta iniciar sesión de nuevo**:
   - Ahora SÍ deberías poder entrar ✅

---

## 📧 PASO 4: Qué pasa si no reciben el email

### Opción A: Usar el link directo (solo en desarrollo)

En la consola del servidor aparece el link:
```
[REGISTRO] Link de verificación: http://localhost:3000/api/auth/verify-email/confirm?token=...
```

Copia y pega ese link en el navegador.

### Opción B: Reenviar email de verificación

1. **Agrega el componente en tu página de login**:

```jsx
// pages/mi-cuenta/login.jsx
import ResendVerificationForm from '@/components/auth/ResendVerificationForm';

export default function LoginPage() {
  return (
    <div>
      {/* Tu formulario de login */}

      {/* Agregar al final */}
      <ResendVerificationForm />
    </div>
  );
}
```

2. **El usuario podrá**:
   - Hacer clic en "¿No recibiste el email de verificación?"
   - Ingresar su email
   - Recibir un nuevo email

### Opción C: Endpoint directo (para tu app móvil o frontend)

```javascript
POST /api/auth/resend-verification
Content-Type: application/json

{
  "email": "usuario@ejemplo.com"
}
```

---

## 🔍 PASO 5: Debugging y logs

### Ver logs en tiempo real

En la consola del servidor verás:

```
[REGISTRO] Intento de registro: { name: 'Juan', email: 'juan@ejemplo.com' }
[REGISTRO] Usuario creado: { id: 'clxxx', email: 'juan@ejemplo.com' }
[REGISTRO] Token de verificación generado y guardado
[REGISTRO] Link de verificación: http://localhost:3000/api/auth/verify-email/confirm?token=abc123...
[REGISTRO] ✅ Email de verificación enviado a: juan@ejemplo.com
```

### Si ves errores:

**Error: "SMTP key inválida"**
```
Solución:
1. Ve a Brevo → Settings → SMTP & API
2. Genera una nueva SMTP key
3. Actualiza BREVO_SMTP_KEY en .env
4. Reinicia el servidor
```

**Error: "Email FROM no verificado"**
```
Solución:
1. Ve a Brevo → Senders
2. Agrega victorvondoon034@gmail.com
3. Verifica el email
4. Espera la aprobación (puede tardar 24h)
```

**Email llega a spam**
```
Solución:
1. Verifica el dominio en Brevo (opcional)
2. Configura SPF y DKIM
3. Mientras tanto, pide a los usuarios revisar spam
```

---

## 📊 Flujo completo del usuario

```
1. Usuario se registra
   ↓
2. Sistema crea cuenta (emailVerified: null)
   ↓
3. Sistema genera token único
   ↓
4. Sistema envía email a usuario
   ↓
5. Usuario recibe email (De: victorvondoon034@gmail.com)
   ↓
6. Usuario hace clic en botón
   ↓
7. Sistema verifica token
   ↓
8. Sistema marca email como verificado
   ↓
9. Sistema envía email de bienvenida
   ↓
10. Usuario es redirigido al login
   ↓
11. Usuario puede iniciar sesión ✅
```

---

## 🛠️ Archivos importantes

### Backend (API)
- `pages/api/auth/register.js` - Registro + envío de email
- `pages/api/auth/verify-email/confirm.js` - Procesa la verificación
- `pages/api/auth/resend-verification.js` - Reenvía email
- `pages/api/auth/[...nextauth].js` - Valida email verificado

### Frontend (Componentes)
- `pages/test-registro.jsx` - Página de prueba
- `components/auth/ResendVerificationForm.jsx` - Formulario de reenvío
- `components/EmailVerificationBanner.jsx` - Banner para usuarios autenticados

### Utilidades
- `lib/email.js` - Funciones de envío con Brevo
- `diagnostico-email.js` - Script de diagnóstico

### Configuración
- `.env` - Credenciales de Brevo
- `prisma/schema.prisma` - Modelo de datos

---

## ⚙️ Configuración opcional

### Cambiar tiempo de expiración del token

En `pages/api/auth/register.js` línea 44:

```javascript
expires.setHours(expires.getHours() + 24); // 24 horas

// Cambiar a:
expires.setHours(expires.getHours() + 48); // 48 horas
// o
expires.setMinutes(expires.getMinutes() + 30); // 30 minutos
```

### Permitir login sin verificar (desactivar)

En `pages/api/auth/[...nextauth].js` línea 48, **comenta**:

```javascript
// if (!user.emailVerified) {
//   throw new Error('Por favor verifica tu correo electrónico...');
// }
```

### Personalizar emails

Edita `lib/email.js`:
- `sendVerificationEmail()` - Email de verificación (HTML + texto)
- `sendWelcomeEmail()` - Email de bienvenida

---

## 🎯 Checklist de producción

Antes de deployar a producción:

- [ ] Generar nueva NEXTAUTH_SECRET (usa: `openssl rand -base64 32`)
- [ ] Cambiar NEXTAUTH_URL a tu dominio real
- [ ] Verificar dominio en Brevo
- [ ] Configurar SPF y DKIM en DNS
- [ ] Probar con emails reales
- [ ] Revisar que los emails no lleguen a spam
- [ ] Desactivar logs de desarrollo
- [ ] Probar flujo completo end-to-end

---

## 📞 Soporte

### Documentación
- Brevo: https://developers.brevo.com
- Nodemailer: https://nodemailer.com
- NextAuth: https://next-auth.js.org

### Troubleshooting rápido

| Problema | Solución |
|----------|----------|
| Email no llega | Revisa spam, verifica SMTP key |
| Token expirado | Usuario debe pedir nuevo token |
| Login bloqueado | Usuario debe verificar email primero |
| Error SMTP | Regenera SMTP key en Brevo |
| Límite alcanzado | 300 emails/día en plan gratuito |

---

## ✨ ¡Listo!

Tu sistema de verificación de email está **100% funcional**.

**Siguiente paso:** Ve a http://localhost:3000/test-registro y pruébalo ahora mismo.
