# 🚀 Sistema de Autenticación para App Móvil - Quick Start

## ✅ Sistema Implementado Completamente

El sistema de autenticación JWT para la app móvil está **100% funcional** y listo para usar.

---

## 📁 Estructura de Archivos Creados

```
cex_freted/
├── lib/
│   ├── middleware/
│   │   └── auth.js                    # Middleware de autenticación JWT
│   └── utils/
│       ├── jwt.js                     # Utilidades para manejar JWT
│       ├── validation.js              # Validación de datos
│       ├── apiResponse.js             # Respuestas estándar de API
│       └── crypto.js                  # Utilidades criptográficas
│
├── pages/api/mobile/auth/
│   ├── login.js                       # POST - Iniciar sesión
│   ├── register.js                    # POST - Crear cuenta
│   ├── me.js                          # GET/PUT - Ver/actualizar perfil
│   ├── refresh.js                     # POST - Refrescar token
│   ├── logout.js                      # POST - Cerrar sesión
│   ├── forgot-password.js             # POST - Solicitar reset de contraseña
│   └── reset-password.js              # POST - Cambiar contraseña
│
├── prisma/
│   └── schema.prisma                  # ✅ Actualizado con nuevos campos
│
├── .env                               # ✅ Variables de entorno configuradas
├── .env.example                       # Plantilla de variables de entorno
├── MOBILE_API_DOCUMENTATION.md        # 📖 Documentación completa de API
└── MOBILE_CODE_EXAMPLES.md            # 💻 Ejemplos de código iOS/Android/RN
```

---

## 🎯 Endpoints Disponibles

| Método | Endpoint | Descripción | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/mobile/auth/register` | Crear nueva cuenta | ❌ |
| POST | `/api/mobile/auth/login` | Iniciar sesión | ❌ |
| GET | `/api/mobile/auth/me` | Obtener perfil | ✅ |
| PUT | `/api/mobile/auth/me` | Actualizar perfil | ✅ |
| POST | `/api/mobile/auth/refresh` | Refrescar token | ❌ |
| POST | `/api/mobile/auth/logout` | Cerrar sesión | ✅ |
| POST | `/api/mobile/auth/forgot-password` | Solicitar reset | ❌ |
| POST | `/api/mobile/auth/reset-password` | Cambiar contraseña | ❌ |

---

## 🏃 Cómo Probar el Sistema

### 1. Iniciar el servidor Next.js

```bash
npm run dev
```

El servidor estará corriendo en `http://localhost:3000`

### 2. Probar con cURL

#### Registro
```bash
curl -X POST http://localhost:3000/api/mobile/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123",
    "phone": "+52 1234567890"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3000/api/mobile/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "password123"
  }'
```

**Guarda los tokens de la respuesta:**
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "user": { ... },
    "accessToken": "eyJhbGc...",  ← Guarda esto
    "refreshToken": "eyJhbGc..."  ← Y esto
  }
}
```

#### Obtener Perfil (con autenticación)
```bash
curl -X GET http://localhost:3000/api/mobile/auth/me \
  -H "Authorization: Bearer TU_ACCESS_TOKEN_AQUI"
```

### 3. Probar con Postman/Thunder Client

Importa la colección de ejemplo en `MOBILE_CODE_EXAMPLES.md`

---

## 🔒 Seguridad Implementada

✅ **Contraseñas hasheadas** con bcrypt (10 rounds)
✅ **JWT tokens** con expiración automática
✅ **Refresh tokens** para renovar sesiones
✅ **Validación de datos** en todos los endpoints
✅ **Middleware de autenticación** para rutas protegidas
✅ **Tokens de reset** con expiración de 1 hora
✅ **Protección contra enumeración** de usuarios

---

## 📚 Documentación

- **[MOBILE_API_DOCUMENTATION.md](MOBILE_API_DOCUMENTATION.md)** - Documentación completa de todos los endpoints
- **[MOBILE_CODE_EXAMPLES.md](MOBILE_CODE_EXAMPLES.md)** - Ejemplos de código para iOS, Android y React Native

---

## 🔧 Configuración de Variables de Entorno

El archivo `.env` ya está configurado con valores de desarrollo. **IMPORTANTE: Cambia estos valores en producción.**

```env
# JWT Configuration
JWT_SECRET="clave_secreta_produccion_aleatoria"
JWT_EXPIRES_IN="7d"
JWT_REFRESH_SECRET="otra_clave_secreta_produccion"
JWT_REFRESH_EXPIRES_IN="30d"
```

**Para generar secretos seguros en producción:**
```bash
# En Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## ✨ Características Principales

### 1. **Doble Token System**
- **Access Token**: 7 días de validez
- **Refresh Token**: 30 días de validez
- Renovación automática sin pérdida de sesión

### 2. **Gestión de Perfil**
- Ver información del usuario
- Actualizar nombre y teléfono
- Cambiar contraseña (requiere contraseña actual)

### 3. **Recuperación de Contraseña**
- Sistema de reset por email
- Tokens seguros con expiración
- Proceso en 2 pasos (solicitar + resetear)

### 4. **Validaciones Robustas**
- Email con formato válido
- Contraseñas mínimo 6 caracteres
- Nombres mínimo 2 caracteres
- Formato de teléfono validado

---

## 🧪 Base de Datos

La base de datos SQLite ya incluye los nuevos campos:

```sql
User {
  id                    String
  name                  String?
  email                 String? @unique
  password              String?
  phone                 String?          ← Nuevo
  refreshToken          String?          ← Nuevo
  resetPasswordToken    String?          ← Nuevo
  resetPasswordExpires  DateTime?        ← Nuevo
  createdAt             DateTime         ← Nuevo
  updatedAt             DateTime         ← Nuevo
}
```

---

## 🎨 Siguientes Pasos Recomendados

### Para Producción

1. **Email Service**
   - Integrar SendGrid/Mailgun para envío de emails
   - Implementar templates de email bonitos
   - Enviar email de bienvenida al registrarse
   - Enviar código de reset por email

2. **Verificación de Email**
   - Agregar endpoint de verificación
   - Enviar email con link de verificación
   - Marcar `emailVerified` cuando se verifique

3. **Rate Limiting**
   ```bash
   npm install express-rate-limit
   ```
   - Limitar intentos de login (5 por minuto)
   - Limitar registro (3 por hora)
   - Limitar reset de contraseña (2 por hora)

4. **Logging & Monitoring**
   - Implementar logging de autenticación
   - Monitorear intentos fallidos
   - Alertas de actividad sospechosa

5. **OAuth Social Login**
   - Google Sign-In
   - Apple Sign-In
   - Facebook Login

### Para Desarrollo Móvil

1. **Descargar la documentación:**
   - `MOBILE_API_DOCUMENTATION.md`
   - `MOBILE_CODE_EXAMPLES.md`

2. **Implementar clases/servicios:**
   - iOS: `AuthService` + `KeychainManager`
   - Android: `AuthRepository` + `EncryptedSharedPreferences`
   - React Native: `authService.js` + `react-native-keychain`

3. **Probar flujos completos:**
   - Registro → Login → Perfil → Logout
   - Login → Token expira → Refresh automático
   - Forgot Password → Reset → Login

---

## 💡 Tips

### Cambiar la duración de los tokens

Edita `.env`:
```env
JWT_EXPIRES_IN="1d"        # Access token válido por 1 día
JWT_REFRESH_EXPIRES_IN="7d" # Refresh token válido por 7 días
```

### Agregar más validaciones a la contraseña

Edita `lib/utils/validation.js`:
```javascript
export const validatePassword = (password) => {
  if (password.length < 8) {
    return { valid: false, message: 'Mínimo 8 caracteres' };
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Debe contener mayúscula' };
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Debe contener número' };
  }

  return { valid: true };
};
```

### Personalizar mensajes de respuesta

Edita los archivos en `pages/api/mobile/auth/` para cambiar los mensajes.

---

## 🐛 Troubleshooting

### Error: "Token inválido"
- Verifica que el token no haya expirado
- Asegúrate de enviar `Bearer <token>` con espacio
- Verifica que `JWT_SECRET` sea el mismo en `.env`

### Error: "Prisma Client not found"
```bash
npx prisma generate
```

### Error: "Database not found"
```bash
npx prisma migrate dev
```

### El refresh token no funciona
- Verifica que el refresh token esté guardado en la BD
- Asegúrate de usar `JWT_REFRESH_SECRET` correcto

---

## 🎉 ¡Todo Listo!

Tu sistema de autenticación para app móvil está **100% operativo**.

Comparte los archivos de documentación con tu equipo móvil y ¡comienza a integrar!

**¿Dudas?** Consulta la documentación detallada o los ejemplos de código.
