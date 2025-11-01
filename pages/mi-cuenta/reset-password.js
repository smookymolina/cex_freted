import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Lock, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

const ResetPasswordPage = () => {
  const router = useRouter();
  const { token } = router.query;

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Validaciones locales
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({
        type: 'error',
        text: 'Las contraseñas no coinciden',
      });
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 8) {
      setMessage({
        type: 'error',
        text: 'La contraseña debe tener al menos 8 caracteres',
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al resetear contraseña');
      }

      setMessage({
        type: 'success',
        text: data.message,
      });

      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        router.push('/mi-cuenta/login?reset=success');
      }, 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Error al resetear contraseña',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="reset-password-page">
        <div className="reset-password-container">
          <div className="reset-password-card">
            <div className="error-state">
              <AlertCircle size={48} className="error-icon" />
              <h2>Token no válido</h2>
              <p>No se proporcionó un token de recuperación válido.</p>
              <Link href="/mi-cuenta/forgot-password" className="link-button">
                Solicitar nuevo enlace
              </Link>
            </div>
          </div>
        </div>
        <style jsx>{`
          .reset-password-page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
          }
          .reset-password-container {
            width: 100%;
            max-width: 480px;
          }
          .reset-password-card {
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            padding: 48px;
          }
          .error-state {
            text-align: center;
          }
          .error-icon {
            color: #dc3545;
            margin-bottom: 16px;
          }
          .link-button {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 24px;
            background-color: #667eea;
            color: white;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <div className="reset-password-card">
          <div className="card-header">
            <Lock size={48} className="icon" />
            <h1 className="title">Restablecer Contraseña</h1>
            <p className="subtitle">
              Ingresa tu nueva contraseña
            </p>
          </div>

          {message.text && (
            <div className={`message ${message.type}`}>
              {message.type === 'success' ? (
                <CheckCircle size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="newPassword" className="label">
                Nueva Contraseña
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="input"
                  placeholder="••••••••"
                  required
                  minLength="8"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="label">
                Confirmar Contraseña
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input"
                  placeholder="••••••••"
                  required
                  minLength="8"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="password-toggle"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="password-requirements">
              <h5>Requisitos de la contraseña:</h5>
              <ul>
                <li className={formData.newPassword.length >= 8 ? 'valid' : ''}>
                  ✓ Al menos 8 caracteres
                </li>
                <li className={/[a-zA-Z]/.test(formData.newPassword) ? 'valid' : ''}>
                  ✓ Al menos una letra
                </li>
                <li className={/\d/.test(formData.newPassword) ? 'valid' : ''}>
                  ✓ Al menos un número
                </li>
                <li className={formData.newPassword === formData.confirmPassword && formData.newPassword ? 'valid' : ''}>
                  ✓ Las contraseñas coinciden
                </li>
              </ul>
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Actualizando...' : 'Restablecer Contraseña'}
            </button>
          </form>

          <div className="footer">
            <Link href="/mi-cuenta/login" className="back-link">
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .reset-password-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }

        .reset-password-container {
          width: 100%;
          max-width: 480px;
        }

        .reset-password-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          padding: 48px;
        }

        .card-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .icon {
          color: #667eea;
          margin-bottom: 16px;
        }

        .title {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 12px 0;
        }

        .subtitle {
          font-size: 15px;
          color: #666;
          margin: 0;
        }

        .message {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 24px;
          font-size: 14px;
        }

        .message.success {
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .message.error {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .form {
          margin-bottom: 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 8px;
        }

        .password-input-wrapper {
          position: relative;
        }

        .input {
          width: 100%;
          padding: 14px 48px 14px 16px;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-size: 15px;
          color: #1a1a1a;
          transition: all 0.2s;
        }

        .input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #666;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
        }

        .password-toggle:hover {
          color: #667eea;
        }

        .password-requirements {
          padding: 16px;
          background-color: #f8f9fa;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .password-requirements h5 {
          font-size: 14px;
          color: #1a1a1a;
          margin: 0 0 12px 0;
        }

        .password-requirements ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .password-requirements li {
          font-size: 14px;
          color: #999;
          margin-bottom: 8px;
        }

        .password-requirements li.valid {
          color: #28a745;
          font-weight: 500;
        }

        .submit-button {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .footer {
          text-align: center;
        }

        .back-link {
          color: #667eea;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .back-link:hover {
          color: #5568d3;
        }

        @media (max-width: 640px) {
          .reset-password-card {
            padding: 32px 24px;
          }

          .title {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default ResetPasswordPage;
