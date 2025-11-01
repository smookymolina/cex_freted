# 📱 API de Autenticación para App Móvil - CEX FRETED

## 🌐 Base URL
```
Desarrollo: http://localhost:3000/api/mobile/auth
Producción: https://tu-dominio.com/api/mobile/auth
```

## 🔑 Autenticación

La API utiliza **JWT (JSON Web Tokens)** para autenticación. Se proporcionan dos tipos de tokens:

- **Access Token**: Válido por 7 días, se usa para autenticar cada petición
- **Refresh Token**: Válido por 30 días, se usa para obtener un nuevo access token

### Headers de Autenticación

Para endpoints protegidos, incluye el access token en el header:

```http
Authorization: Bearer <tu_access_token>
```

---

## 📋 Endpoints

### 1. **Registro de Usuario**

Crea una nueva cuenta de usuario.

**Endpoint:** `POST /register`

**Body:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "phone": "+52 1234567890"  // Opcional
}
```

**Validaciones:**
- `name`: Mínimo 2 caracteres
- `email`: Formato de email válido, único en el sistema
- `password`: Mínimo 6 caracteres
- `phone`: Formato de teléfono válido (opcional)

**Respuesta Exitosa (201):**
```json
{
  "success": true,
  "message": "Registro exitoso",
  "data": {
    "user": {
      "id": "clxxx...",
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "phone": "+52 1234567890",
      "emailVerified": null,
      "image": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errores Posibles:**
- `409`: Email ya registrado
- `422`: Errores de validación

---

### 2. **Inicio de Sesión**

Autentica un usuario existente.

**Endpoint:** `POST /login`

**Body:**
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "user": {
      "id": "clxxx...",
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "phone": "+52 1234567890",
      "emailVerified": null,
      "image": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errores Posibles:**
- `401`: Credenciales incorrectas
- `422`: Datos inválidos

---

### 3. **Obtener Perfil de Usuario** 🔒

Obtiene la información del usuario autenticado.

**Endpoint:** `GET /me`

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Perfil obtenido exitosamente",
  "data": {
    "user": {
      "id": "clxxx...",
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "phone": "+52 1234567890",
      "emailVerified": null,
      "image": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Errores Posibles:**
- `401`: Token inválido o expirado

---

### 4. **Actualizar Perfil** 🔒

Actualiza la información del usuario autenticado.

**Endpoint:** `PUT /me`

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Body (todos los campos son opcionales):**
```json
{
  "name": "Juan Carlos Pérez",
  "phone": "+52 9876543210",
  "currentPassword": "password123",  // Requerido si se cambia contraseña
  "newPassword": "newpassword456"     // Opcional
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Perfil actualizado exitosamente",
  "data": {
    "user": {
      "id": "clxxx...",
      "name": "Juan Carlos Pérez",
      "email": "juan@example.com",
      "phone": "+52 9876543210",
      "emailVerified": null,
      "image": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Errores Posibles:**
- `401`: Token inválido o contraseña actual incorrecta
- `422`: Errores de validación

---

### 5. **Refrescar Token**

Obtiene un nuevo access token usando el refresh token.

**Endpoint:** `POST /refresh`

**Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Token actualizado exitosamente",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errores Posibles:**
- `401`: Refresh token inválido, expirado o revocado
- `404`: Usuario no encontrado

---

### 6. **Cerrar Sesión** 🔒

Invalida el refresh token del usuario.

**Endpoint:** `POST /logout`

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Sesión cerrada exitosamente",
  "data": null
}
```

**Errores Posibles:**
- `401`: Token inválido

---

### 7. **Olvidé mi Contraseña**

Solicita un código para restablecer la contraseña.

**Endpoint:** `POST /forgot-password`

**Body:**
```json
{
  "email": "juan@example.com"
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Si el email existe en nuestro sistema, recibirás instrucciones para recuperar tu contraseña",
  "data": {
    "resetToken": "abc123..."  // SOLO en desarrollo
  }
}
```

**Nota:** En producción, el `resetToken` se envía por email y NO se incluye en la respuesta.

---

### 8. **Restablecer Contraseña**

Restablece la contraseña usando el token recibido.

**Endpoint:** `POST /reset-password`

**Body:**
```json
{
  "token": "abc123...",
  "newPassword": "newpassword456"
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Contraseña actualizada exitosamente. Por favor, inicia sesión con tu nueva contraseña",
  "data": null
}
```

**Errores Posibles:**
- `400`: Token inválido o expirado
- `422`: Nueva contraseña no cumple requisitos

---

## 🔄 Flujo de Autenticación Recomendado

### 1. **Registro/Login**
```
Usuario ingresa credenciales
    ↓
POST /register o POST /login
    ↓
Guardar accessToken y refreshToken en almacenamiento seguro
    ↓
Usar accessToken en todas las peticiones
```

### 2. **Peticiones Autenticadas**
```
Agregar header: Authorization: Bearer <accessToken>
    ↓
Hacer petición a endpoint protegido (GET /me, PUT /me, etc.)
    ↓
Si respuesta = 401 (token expirado)
    ↓
Intentar refresh token
```

### 3. **Renovación de Token**
```
AccessToken expiró (401)
    ↓
POST /refresh con refreshToken
    ↓
Guardar nuevo accessToken
    ↓
Reintentar petición original
    ↓
Si refresh falla (401)
    ↓
Cerrar sesión y redirigir a login
```

### 4. **Cierre de Sesión**
```
Usuario presiona "Cerrar Sesión"
    ↓
POST /logout
    ↓
Eliminar tokens del almacenamiento
    ↓
Redirigir a pantalla de login
```

---

## 💾 Almacenamiento de Tokens (Recomendaciones)

### iOS (Swift)
```swift
// Usar Keychain para máxima seguridad
import Security

func saveToken(token: String, key: String) {
    let data = token.data(using: .utf8)!
    let query: [String: Any] = [
        kSecClass as String: kSecClassGenericPassword,
        kSecAttrAccount as String: key,
        kSecValueData as String: data
    ]
    SecItemAdd(query as CFDictionary, nil)
}
```

### Android (Kotlin)
```kotlin
// Usar EncryptedSharedPreferences
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey

val masterKey = MasterKey.Builder(context)
    .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
    .build()

val sharedPreferences = EncryptedSharedPreferences.create(
    context,
    "secure_prefs",
    masterKey,
    EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
    EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
)

sharedPreferences.edit()
    .putString("access_token", token)
    .apply()
```

### React Native
```javascript
// Usar react-native-keychain
import * as Keychain from 'react-native-keychain';

// Guardar tokens
await Keychain.setGenericPassword(
  'accessToken',
  accessToken,
  { service: 'com.cexfreted.auth' }
);

// Recuperar tokens
const credentials = await Keychain.getGenericPassword({
  service: 'com.cexfreted.auth'
});
```

---

## ⚠️ Manejo de Errores

Todas las respuestas de error siguen el formato:

```json
{
  "success": false,
  "message": "Descripción del error",
  "errors": {  // Opcional, solo en errores de validación
    "campo": "Mensaje de error específico"
  }
}
```

### Códigos de Estado HTTP

- `200`: Éxito
- `201`: Recurso creado exitosamente
- `400`: Bad Request - datos inválidos
- `401`: No autorizado - token inválido/expirado
- `404`: Recurso no encontrado
- `405`: Método no permitido
- `409`: Conflicto - recurso ya existe
- `422`: Error de validación
- `500`: Error interno del servidor

---

## 🧪 Ejemplos de Implementación

### Ejemplo con Fetch (JavaScript)

```javascript
// 1. Login
async function login(email, password) {
  const response = await fetch('http://localhost:3000/api/mobile/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (data.success) {
    // Guardar tokens de forma segura
    await saveTokens(data.data.accessToken, data.data.refreshToken);
    return data.data.user;
  } else {
    throw new Error(data.message);
  }
}

// 2. Petición autenticada
async function getUserProfile() {
  const accessToken = await getAccessToken();

  const response = await fetch('http://localhost:3000/api/mobile/auth/me', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  // Si el token expiró, intentar refresh
  if (response.status === 401) {
    await refreshAccessToken();
    return getUserProfile(); // Reintentar
  }

  return data.data.user;
}

// 3. Refresh token
async function refreshAccessToken() {
  const refreshToken = await getRefreshToken();

  const response = await fetch('http://localhost:3000/api/mobile/auth/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  const data = await response.json();

  if (data.success) {
    await saveAccessToken(data.data.accessToken);
  } else {
    // Refresh token inválido, cerrar sesión
    await logout();
    throw new Error('Sesión expirada');
  }
}
```

---

## 🔒 Seguridad

### Mejores Prácticas

1. **NUNCA** guardes tokens en:
   - LocalStorage (web)
   - AsyncStorage sin encriptar (React Native)
   - SharedPreferences sin encriptar (Android)
   - UserDefaults (iOS)

2. **SIEMPRE** usa:
   - Keychain (iOS)
   - EncryptedSharedPreferences (Android)
   - react-native-keychain (React Native)

3. **Validación en el cliente:**
   - Valida formato de email antes de enviar
   - Valida longitud de contraseña antes de enviar
   - Muestra mensajes de error claros

4. **HTTPS:**
   - En producción, SIEMPRE usa HTTPS
   - Los tokens se envían en headers, nunca en URL

5. **Expiración de tokens:**
   - Access Token: 7 días
   - Refresh Token: 30 días
   - Reset Password Token: 1 hora

---

## 📞 Soporte

Para dudas o problemas con la API, contacta al equipo backend:
- Email: backend@cexfreted.com
- Slack: #backend-support

---

## 📝 Changelog

### v1.0.0 (2024-11-01)
- ✅ Implementación inicial de autenticación JWT
- ✅ Endpoints de registro y login
- ✅ Sistema de refresh tokens
- ✅ Recuperación de contraseña
- ✅ Gestión de perfil de usuario
