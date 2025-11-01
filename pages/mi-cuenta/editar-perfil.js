import React, { useState } from 'react';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import AccountLayout from '../../components/mi-cuenta/AccountLayout';
import { Save, AlertCircle, CheckCircle, User, Mail, Phone, Lock } from 'lucide-react';

const EditarPerfilPage = ({ user }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Estado para el perfil
  const [profileData, setProfileData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
  });

  // Estado para contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar el perfil');
      }

      setMessage({
        type: 'success',
        text: '¡Perfil actualizado exitosamente!',
      });

      setTimeout(() => {
        router.push('/mi-cuenta/perfil');
      }, 2000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Error al actualizar el perfil. Intenta nuevamente.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Validaciones
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({
        type: 'error',
        text: 'Las contraseñas no coinciden',
      });
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setMessage({
        type: 'error',
        text: 'La contraseña debe tener al menos 8 caracteres',
      });
      setLoading(false);
      return;
    }

    // Validar que contenga letra y número
    const hasLetter = /[a-zA-Z]/.test(passwordData.newPassword);
    const hasNumber = /\d/.test(passwordData.newPassword);

    if (!hasLetter || !hasNumber) {
      setMessage({
        type: 'error',
        text: 'La contraseña debe contener al menos una letra y un número',
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al cambiar la contraseña');
      }

      setMessage({
        type: 'success',
        text: '¡Contraseña actualizada exitosamente!',
      });

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Error al cambiar la contraseña. Verifica tu contraseña actual.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AccountLayout title="Editar Perfil">
      <div className="editar-perfil-container">
        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} />
            Información Personal
          </button>
          <button
            className={`tab ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            <Lock size={18} />
            Cambiar Contraseña
          </button>
        </div>

        {/* Mensaje de estado */}
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

        {/* Formulario de Perfil */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="form">
            <div className="form-group">
              <label htmlFor="name" className="label">
                <User size={18} />
                Nombre Completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                className="input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="label">
                <Mail size={18} />
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                className="input"
                required
              />
              <p className="hint">
                Este es el email que usas para iniciar sesión
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="label">
                <Phone size={18} />
                Teléfono
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={profileData.phone}
                onChange={handleProfileChange}
                className="input"
                placeholder="+52 123 456 7890"
              />
              <p className="hint">
                Opcional - Para contacto y notificaciones
              </p>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="button secondary"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="button primary"
                disabled={loading}
              >
                {loading ? (
                  'Guardando...'
                ) : (
                  <>
                    <Save size={18} />
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Formulario de Contraseña */}
        {activeTab === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="form">
            <div className="security-notice">
              <Lock size={20} />
              <div>
                <h4>Actualizar tu contraseña</h4>
                <p>
                  Por tu seguridad, asegúrate de usar una contraseña fuerte y única
                </p>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="currentPassword" className="label">
                Contraseña Actual
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword" className="label">
                Nueva Contraseña
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="input"
                required
                minLength="8"
              />
              <p className="hint">
                Mínimo 8 caracteres, al menos una letra y un número
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="label">
                Confirmar Nueva Contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="input"
                required
                minLength="8"
              />
            </div>

            <div className="password-requirements">
              <h5>Requisitos de la contraseña:</h5>
              <ul>
                <li className={passwordData.newPassword.length >= 8 ? 'valid' : ''}>
                  ✓ Al menos 8 caracteres
                </li>
                <li className={/[a-zA-Z]/.test(passwordData.newPassword) ? 'valid' : ''}>
                  ✓ Al menos una letra
                </li>
                <li className={/\d/.test(passwordData.newPassword) ? 'valid' : ''}>
                  ✓ Al menos un número
                </li>
                <li className={passwordData.newPassword === passwordData.confirmPassword && passwordData.newPassword ? 'valid' : ''}>
                  ✓ Las contraseñas coinciden
                </li>
              </ul>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="button secondary"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="button primary"
                disabled={loading}
              >
                {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
              </button>
            </div>
          </form>
        )}
      </div>

      <style jsx>{`
        .editar-perfil-container {
          max-width: 600px;
        }

        .tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 32px;
          border-bottom: 2px solid #e9ecef;
        }

        .tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          font-size: 15px;
          font-weight: 500;
          color: #666;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: -2px;
        }

        .tab:hover {
          color: #0066cc;
        }

        .tab.active {
          color: #0066cc;
          border-bottom-color: #0066cc;
        }

        .message {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 24px;
          font-size: 14px;
          font-weight: 500;
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
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 8px;
        }

        .input {
          padding: 12px 16px;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-size: 15px;
          color: #1a1a1a;
          transition: all 0.2s;
        }

        .input:focus {
          outline: none;
          border-color: #0066cc;
          box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
        }

        .hint {
          font-size: 13px;
          color: #999;
          margin-top: 6px;
        }

        .security-notice {
          display: flex;
          gap: 16px;
          padding: 20px;
          background-color: #f0f7ff;
          border-radius: 8px;
          border: 1px solid #b8daff;
        }

        .security-notice h4 {
          font-size: 16px;
          color: #0066cc;
          margin: 0 0 6px 0;
        }

        .security-notice p {
          font-size: 14px;
          color: #666;
          margin: 0;
        }

        .password-requirements {
          padding: 16px;
          background-color: #f8f9fa;
          border-radius: 8px;
          border: 1px solid #e9ecef;
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

        .form-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          padding-top: 16px;
          border-top: 1px solid #e9ecef;
        }

        .button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: 2px solid;
        }

        .button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .button.primary {
          background-color: #0066cc;
          border-color: #0066cc;
          color: white;
        }

        .button.primary:hover:not(:disabled) {
          background-color: #0052a3;
          border-color: #0052a3;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
        }

        .button.secondary {
          background-color: white;
          border-color: #e9ecef;
          color: #1a1a1a;
        }

        .button.secondary:hover:not(:disabled) {
          border-color: #666;
          transform: translateY(-2px);
        }

        @media (max-width: 640px) {
          .tabs {
            flex-direction: column;
            border-bottom: none;
          }

          .tab {
            justify-content: center;
            border-bottom: none;
            border-left: 3px solid transparent;
            margin-bottom: 0;
            margin-left: -2px;
          }

          .tab.active {
            border-left-color: #0066cc;
            border-bottom-color: transparent;
          }

          .form-actions {
            flex-direction: column;
          }

          .button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </AccountLayout>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/mi-cuenta/login',
        permanent: false,
      },
    };
  }

  return {
    props: { user: session.user },
  };
}

export default EditarPerfilPage;
