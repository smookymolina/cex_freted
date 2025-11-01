# 📱 Ejemplos de Código para Integración con App Móvil

## 🍎 iOS (Swift + SwiftUI)

### 1. Service de Autenticación

```swift
import Foundation

class AuthService {
    static let shared = AuthService()
    private let baseURL = "http://localhost:3000/api/mobile/auth"

    // MARK: - Login
    func login(email: String, password: String) async throws -> User {
        let url = URL(string: "\(baseURL)/login")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let body: [String: Any] = ["email": email, "password": password]
        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 200 else {
            throw AuthError.invalidCredentials
        }

        let apiResponse = try JSONDecoder().decode(LoginResponse.self, from: data)

        // Guardar tokens en Keychain
        try KeychainManager.shared.saveToken(apiResponse.data.accessToken, key: "accessToken")
        try KeychainManager.shared.saveToken(apiResponse.data.refreshToken, key: "refreshToken")

        return apiResponse.data.user
    }

    // MARK: - Register
    func register(name: String, email: String, password: String, phone: String?) async throws -> User {
        let url = URL(string: "\(baseURL)/register")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        var body: [String: Any] = [
            "name": name,
            "email": email,
            "password": password
        ]
        if let phone = phone {
            body["phone"] = phone
        }
        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 201 else {
            throw AuthError.registrationFailed
        }

        let apiResponse = try JSONDecoder().decode(LoginResponse.self, from: data)

        try KeychainManager.shared.saveToken(apiResponse.data.accessToken, key: "accessToken")
        try KeychainManager.shared.saveToken(apiResponse.data.refreshToken, key: "refreshToken")

        return apiResponse.data.user
    }

    // MARK: - Get Profile
    func getProfile() async throws -> User {
        let url = URL(string: "\(baseURL)/me")!
        var request = URLRequest(url: url)
        request.httpMethod = "GET"

        guard let token = try? KeychainManager.shared.getToken(key: "accessToken") else {
            throw AuthError.notAuthenticated
        }

        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw AuthError.networkError
        }

        // Si el token expiró, intentar refresh
        if httpResponse.statusCode == 401 {
            try await refreshToken()
            return try await getProfile() // Reintentar
        }

        guard httpResponse.statusCode == 200 else {
            throw AuthError.networkError
        }

        let apiResponse = try JSONDecoder().decode(ProfileResponse.self, from: data)
        return apiResponse.data.user
    }

    // MARK: - Refresh Token
    private func refreshToken() async throws {
        guard let refreshToken = try? KeychainManager.shared.getToken(key: "refreshToken") else {
            throw AuthError.notAuthenticated
        }

        let url = URL(string: "\(baseURL)/refresh")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let body: [String: Any] = ["refreshToken": refreshToken]
        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 200 else {
            // Refresh token inválido, cerrar sesión
            logout()
            throw AuthError.sessionExpired
        }

        let apiResponse = try JSONDecoder().decode(RefreshResponse.self, from: data)
        try KeychainManager.shared.saveToken(apiResponse.data.accessToken, key: "accessToken")
    }

    // MARK: - Logout
    func logout() {
        try? KeychainManager.shared.deleteToken(key: "accessToken")
        try? KeychainManager.shared.deleteToken(key: "refreshToken")
    }
}

// MARK: - Models
struct User: Codable {
    let id: String
    let name: String
    let email: String
    let phone: String?
    let image: String?
    let createdAt: String
    let updatedAt: String
}

struct LoginResponse: Codable {
    let success: Bool
    let message: String
    let data: LoginData
}

struct LoginData: Codable {
    let user: User
    let accessToken: String
    let refreshToken: String
}

struct ProfileResponse: Codable {
    let success: Bool
    let message: String
    let data: ProfileData
}

struct ProfileData: Codable {
    let user: User
}

struct RefreshResponse: Codable {
    let success: Bool
    let message: String
    let data: RefreshData
}

struct RefreshData: Codable {
    let accessToken: String
}

enum AuthError: Error {
    case invalidCredentials
    case registrationFailed
    case notAuthenticated
    case sessionExpired
    case networkError
}
```

### 2. Keychain Manager

```swift
import Foundation
import Security

class KeychainManager {
    static let shared = KeychainManager()

    func saveToken(_ token: String, key: String) throws {
        guard let data = token.data(using: .utf8) else {
            throw KeychainError.encodingError
        }

        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecValueData as String: data
        ]

        // Eliminar token existente
        SecItemDelete(query as CFDictionary)

        // Agregar nuevo token
        let status = SecItemAdd(query as CFDictionary, nil)
        guard status == errSecSuccess else {
            throw KeychainError.saveFailed
        }
    }

    func getToken(key: String) throws -> String {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecReturnData as String: true
        ]

        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)

        guard status == errSecSuccess,
              let data = result as? Data,
              let token = String(data: data, encoding: .utf8) else {
            throw KeychainError.notFound
        }

        return token
    }

    func deleteToken(key: String) throws {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key
        ]

        let status = SecItemDelete(query as CFDictionary)
        guard status == errSecSuccess || status == errSecItemNotFound else {
            throw KeychainError.deleteFailed
        }
    }
}

enum KeychainError: Error {
    case encodingError
    case saveFailed
    case notFound
    case deleteFailed
}
```

---

## 🤖 Android (Kotlin + Jetpack Compose)

### 1. Repository de Autenticación

```kotlin
import android.content.Context
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.*

class AuthRepository(private val context: Context) {

    private val baseUrl = "http://10.0.2.2:3000/api/mobile/auth/"

    private val retrofit = Retrofit.Builder()
        .baseUrl(baseUrl)
        .addConverterFactory(GsonConverterFactory.create())
        .build()

    private val api = retrofit.create(AuthApi::class.java)

    private val masterKey = MasterKey.Builder(context)
        .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
        .build()

    private val sharedPreferences = EncryptedSharedPreferences.create(
        context,
        "secure_prefs",
        masterKey,
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
    )

    // Login
    suspend fun login(email: String, password: String): Result<User> {
        return withContext(Dispatchers.IO) {
            try {
                val request = LoginRequest(email, password)
                val response = api.login(request)

                if (response.success) {
                    saveTokens(response.data.accessToken, response.data.refreshToken)
                    Result.success(response.data.user)
                } else {
                    Result.failure(Exception(response.message))
                }
            } catch (e: Exception) {
                Result.failure(e)
            }
        }
    }

    // Register
    suspend fun register(
        name: String,
        email: String,
        password: String,
        phone: String? = null
    ): Result<User> {
        return withContext(Dispatchers.IO) {
            try {
                val request = RegisterRequest(name, email, password, phone)
                val response = api.register(request)

                if (response.success) {
                    saveTokens(response.data.accessToken, response.data.refreshToken)
                    Result.success(response.data.user)
                } else {
                    Result.failure(Exception(response.message))
                }
            } catch (e: Exception) {
                Result.failure(e)
            }
        }
    }

    // Get Profile
    suspend fun getProfile(): Result<User> {
        return withContext(Dispatchers.IO) {
            try {
                val token = getAccessToken() ?: return@withContext Result.failure(
                    Exception("No autenticado")
                )

                val response = api.getProfile("Bearer $token")

                if (response.success) {
                    Result.success(response.data.user)
                } else {
                    Result.failure(Exception(response.message))
                }
            } catch (e: retrofit2.HttpException) {
                if (e.code() == 401) {
                    // Token expirado, intentar refresh
                    refreshToken()
                    getProfile() // Reintentar
                } else {
                    Result.failure(e)
                }
            } catch (e: Exception) {
                Result.failure(e)
            }
        }
    }

    // Refresh Token
    private suspend fun refreshToken(): Result<Unit> {
        return withContext(Dispatchers.IO) {
            try {
                val token = getRefreshToken() ?: return@withContext Result.failure(
                    Exception("No hay refresh token")
                )

                val request = RefreshRequest(token)
                val response = api.refresh(request)

                if (response.success) {
                    saveAccessToken(response.data.accessToken)
                    Result.success(Unit)
                } else {
                    logout()
                    Result.failure(Exception("Sesión expirada"))
                }
            } catch (e: Exception) {
                logout()
                Result.failure(e)
            }
        }
    }

    // Token Management
    private fun saveTokens(accessToken: String, refreshToken: String) {
        sharedPreferences.edit().apply {
            putString("access_token", accessToken)
            putString("refresh_token", refreshToken)
            apply()
        }
    }

    private fun saveAccessToken(accessToken: String) {
        sharedPreferences.edit()
            .putString("access_token", accessToken)
            .apply()
    }

    private fun getAccessToken(): String? {
        return sharedPreferences.getString("access_token", null)
    }

    private fun getRefreshToken(): String? {
        return sharedPreferences.getString("refresh_token", null)
    }

    fun logout() {
        sharedPreferences.edit().clear().apply()
    }
}

// API Interface
interface AuthApi {
    @POST("login")
    suspend fun login(@Body request: LoginRequest): ApiResponse<LoginData>

    @POST("register")
    suspend fun register(@Body request: RegisterRequest): ApiResponse<LoginData>

    @GET("me")
    suspend fun getProfile(@Header("Authorization") token: String): ApiResponse<ProfileData>

    @POST("refresh")
    suspend fun refresh(@Body request: RefreshRequest): ApiResponse<RefreshData>
}

// Data Classes
data class LoginRequest(val email: String, val password: String)
data class RegisterRequest(
    val name: String,
    val email: String,
    val password: String,
    val phone: String?
)
data class RefreshRequest(val refreshToken: String)

data class ApiResponse<T>(
    val success: Boolean,
    val message: String,
    val data: T
)

data class User(
    val id: String,
    val name: String,
    val email: String,
    val phone: String?,
    val image: String?,
    val createdAt: String,
    val updatedAt: String
)

data class LoginData(
    val user: User,
    val accessToken: String,
    val refreshToken: String
)

data class ProfileData(val user: User)
data class RefreshData(val accessToken: String)
```

---

## ⚛️ React Native

### 1. Auth Service con Axios

```javascript
import axios from 'axios';
import * as Keychain from 'react-native-keychain';

const API_URL = 'http://localhost:3000/api/mobile/auth';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use(
  async (config) => {
    const credentials = await Keychain.getGenericPassword({
      service: 'com.cexfreted.accessToken',
    });

    if (credentials) {
      config.headers.Authorization = `Bearer ${credentials.password}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar refresh token automáticamente
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        await logout();
        throw refreshError;
      }
    }

    return Promise.reject(error);
  }
);

// Login
export const login = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });

    if (response.data.success) {
      await saveTokens(
        response.data.data.accessToken,
        response.data.data.refreshToken
      );
      return response.data.data.user;
    }

    throw new Error(response.data.message);
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

// Register
export const register = async (name, email, password, phone = null) => {
  try {
    const response = await api.post('/register', {
      name,
      email,
      password,
      phone,
    });

    if (response.data.success) {
      await saveTokens(
        response.data.data.accessToken,
        response.data.data.refreshToken
      );
      return response.data.data.user;
    }

    throw new Error(response.data.message);
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

// Get Profile
export const getProfile = async () => {
  try {
    const response = await api.get('/me');
    return response.data.data.user;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

// Update Profile
export const updateProfile = async (updates) => {
  try {
    const response = await api.put('/me', updates);
    return response.data.data.user;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

// Refresh Token
const refreshToken = async () => {
  const credentials = await Keychain.getGenericPassword({
    service: 'com.cexfreted.refreshToken',
  });

  if (!credentials) {
    throw new Error('No refresh token available');
  }

  const response = await axios.post(`${API_URL}/refresh`, {
    refreshToken: credentials.password,
  });

  if (response.data.success) {
    await Keychain.setGenericPassword(
      'accessToken',
      response.data.data.accessToken,
      { service: 'com.cexfreted.accessToken' }
    );
    return response.data.data.accessToken;
  }

  throw new Error('Refresh token failed');
};

// Save Tokens
const saveTokens = async (accessToken, refreshToken) => {
  await Keychain.setGenericPassword('accessToken', accessToken, {
    service: 'com.cexfreted.accessToken',
  });

  await Keychain.setGenericPassword('refreshToken', refreshToken, {
    service: 'com.cexfreted.refreshToken',
  });
};

// Logout
export const logout = async () => {
  try {
    await api.post('/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    await Keychain.resetGenericPassword({ service: 'com.cexfreted.accessToken' });
    await Keychain.resetGenericPassword({ service: 'com.cexfreted.refreshToken' });
  }
};
```

### 2. Auth Context (React Native)

```javascript
import React, { createContext, useState, useContext, useEffect } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await authService.getProfile();
      setUser(userData);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    const userData = await authService.login(email, password);
    setUser(userData);
  };

  const signUp = async (name, email, password, phone) => {
    const userData = await authService.register(name, email, password, phone);
    setUser(userData);
  };

  const signOut = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

---

## 🧪 Testing con Postman/Thunder Client

### Collection de ejemplo

```json
{
  "name": "CEX FRETED Mobile API",
  "requests": [
    {
      "name": "Register",
      "method": "POST",
      "url": "http://localhost:3000/api/mobile/auth/register",
      "body": {
        "name": "Test User",
        "email": "test@example.com",
        "password": "password123",
        "phone": "+52 1234567890"
      }
    },
    {
      "name": "Login",
      "method": "POST",
      "url": "http://localhost:3000/api/mobile/auth/login",
      "body": {
        "email": "test@example.com",
        "password": "password123"
      }
    },
    {
      "name": "Get Profile",
      "method": "GET",
      "url": "http://localhost:3000/api/mobile/auth/me",
      "headers": {
        "Authorization": "Bearer {{accessToken}}"
      }
    },
    {
      "name": "Refresh Token",
      "method": "POST",
      "url": "http://localhost:3000/api/mobile/auth/refresh",
      "body": {
        "refreshToken": "{{refreshToken}}"
      }
    }
  ]
}
```
