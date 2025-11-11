import { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Check, Mail, Lock, User, Phone } from 'lucide-react';
import Button from '../ui/Button';
import styles from '../../styles/components/auth-modal.module.css';

const STEPS = {
  SELECTION: 1,
  CREDENTIALS: 2,
  PERSONAL_INFO: 3,
  VERIFICATION: 4,
  WELCOME: 5
};

export default function AuthModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(STEPS.SELECTION);
  const [authType, setAuthType] = useState(null); // 'login' or 'register'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    verificationCode: '',
    acceptTerms: false,
    newsletter: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Cerrar modal con ESC
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
  };

  // Reset modal al cerrar
  const handleClose = () => {
    setCurrentStep(STEPS.SELECTION);
    setAuthType(null);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: '',
      verificationCode: '',
      acceptTerms: false,
      newsletter: false
    });
    setErrors({});
    onClose();
  };

  // Validaciones
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const validateStep = () => {
    const newErrors = {};

    if (currentStep === STEPS.CREDENTIALS) {
      if (!formData.email) {
        newErrors.email = 'El email es requerido';
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Email inválido';
      }

      if (!formData.password) {
        newErrors.password = 'La contraseña es requerida';
      } else if (authType === 'register' && !validatePassword(formData.password)) {
        newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
      }

      if (authType === 'register' && formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }

    if (currentStep === STEPS.PERSONAL_INFO) {
      if (!formData.firstName) newErrors.firstName = 'El nombre es requerido';
      if (!formData.lastName) newErrors.lastName = 'El apellido es requerido';
      if (!formData.acceptTerms) newErrors.acceptTerms = 'Debes aceptar los términos';
    }

    if (currentStep === STEPS.VERIFICATION) {
      if (!formData.verificationCode || formData.verificationCode.length !== 6) {
        newErrors.verificationCode = 'Ingresa el código de 6 dígitos';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navegación entre pasos
  const goToNextStep = async () => {
    if (!validateStep()) return;

    if (currentStep === STEPS.CREDENTIALS && authType === 'login') {
      // Para login, saltamos directo a WELCOME (sin verificación)
      const success = await handleLogin();
      if (success) {
        setCurrentStep(STEPS.WELCOME);
      }
    } else if (currentStep === STEPS.PERSONAL_INFO) {
      // Enviamos registro y saltamos a WELCOME (sin verificación)
      const success = await handleRegister();
      if (success) {
        setCurrentStep(STEPS.WELCOME);
      }
    } else if (currentStep === STEPS.VERIFICATION) {
      // Este paso ya no se usa, pero lo dejamos por compatibilidad
      await verifyCode();
      setCurrentStep(STEPS.WELCOME);
    } else if (currentStep === STEPS.WELCOME) {
      // Finalizamos y redirigimos al perfil
      setTimeout(() => {
        handleClose();
        window.location.href = '/mi-cuenta/perfil';
      }, 1500); // Esperar 1.5 segundos para que vean el mensaje de bienvenida
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep === STEPS.SELECTION) {
      handleClose();
    } else if (currentStep === STEPS.PERSONAL_INFO && authType === 'login') {
      setCurrentStep(STEPS.CREDENTIALS);
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handlers para submit
  const handleLogin = async () => {
    setIsLoading(true);
    try {
      // Llamada a NextAuth para login
      const { signIn } = await import('next-auth/react');
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        setErrors({ general: result.error });
        setIsLoading(false);
        return false;
      }

      // Login exitoso
      console.log('Login exitoso');
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Error en login:', error);
      setErrors({ general: 'Error al iniciar sesión' });
      setIsLoading(false);
      return false;
    }
  };

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      // Llamada a la API de registro
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.message || 'Error al crear cuenta' });
        setIsLoading(false);
        return false;
      }

      // Registro exitoso, ahora hacer login automático
      console.log('Registro exitoso:', data);

      // Login automático después del registro
      const { signIn } = await import('next-auth/react');
      const loginResult = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (loginResult?.error) {
        setErrors({ general: 'Cuenta creada, pero hubo un error al iniciar sesión. Por favor inicia sesión manualmente.' });
        setIsLoading(false);
        return false;
      }

      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Error en registro:', error);
      setErrors({ general: 'Error al crear cuenta' });
      setIsLoading(false);
      return false;
    }
  };

  const verifyCode = async () => {
    setIsLoading(true);
    try {
      // Aquí iría la verificación del código
      console.log('Verifying code:', formData.verificationCode);
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      setErrors({ verificationCode: 'Código inválido' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const selectAuthType = (type) => {
    setAuthType(type);
    setCurrentStep(STEPS.CREDENTIALS);
  };

  if (!isOpen) return null;

  // Renderizar contenido según el paso actual
  const renderStepContent = () => {
    switch (currentStep) {
      case STEPS.SELECTION:
        return (
          <div className={styles.stepContent}>
            <h2>¡Bienvenido!</h2>
            <p className={styles.subtitle}>¿Ya tienes una cuenta con nosotros?</p>
            <div className={styles.selectionButtons}>
              <button
                className={styles.selectionCard}
                onClick={() => selectAuthType('login')}
              >
                <div className={styles.cardIcon}>
                  <User size={32} />
                </div>
                <h3>Iniciar Sesión</h3>
                <p>Ya tengo una cuenta</p>
              </button>
              <button
                className={styles.selectionCard}
                onClick={() => selectAuthType('register')}
              >
                <div className={styles.cardIcon}>
                  <Mail size={32} />
                </div>
                <h3>Crear Cuenta</h3>
                <p>Soy nuevo usuario</p>
              </button>
            </div>
          </div>
        );

      case STEPS.CREDENTIALS:
        return (
          <div className={styles.stepContent}>
            <h2>{authType === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}</h2>
            <p className={styles.subtitle}>
              {authType === 'login'
                ? 'Ingresa tus credenciales'
                : 'Configura tu email y contraseña'}
            </p>
            <form className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="email">
                  <Mail size={18} />
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="tu@email.com"
                  className={errors.email ? styles.error : ''}
                />
                {errors.email && <span className={styles.errorText}>{errors.email}</span>}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="password">
                  <Lock size={18} />
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={errors.password ? styles.error : ''}
                />
                {errors.password && <span className={styles.errorText}>{errors.password}</span>}
              </div>

              {authType === 'register' && (
                <div className={styles.inputGroup}>
                  <label htmlFor="confirmPassword">
                    <Lock size={18} />
                    Confirmar Contraseña
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className={errors.confirmPassword ? styles.error : ''}
                  />
                  {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
                </div>
              )}

              {authType === 'login' && (
                <a href="/mi-cuenta/recuperar" className={styles.forgotPassword}>
                  ¿Olvidaste tu contraseña?
                </a>
              )}
            </form>
          </div>
        );

      case STEPS.PERSONAL_INFO:
        return (
          <div className={styles.stepContent}>
            <h2>Información Personal</h2>
            <p className={styles.subtitle}>Cuéntanos un poco sobre ti</p>
            <form className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="firstName">
                  <User size={18} />
                  Nombre
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Juan"
                  className={errors.firstName ? styles.error : ''}
                />
                {errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="lastName">
                  <User size={18} />
                  Apellido
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Pérez"
                  className={errors.lastName ? styles.error : ''}
                />
                {errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="phone">
                  <Phone size={18} />
                  Teléfono (opcional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+34 600 000 000"
                />
              </div>

              <div className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id="acceptTerms"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleInputChange}
                />
                <label htmlFor="acceptTerms">
                  Acepto los <a href="/terminos">términos y condiciones</a>
                </label>
                {errors.acceptTerms && <span className={styles.errorText}>{errors.acceptTerms}</span>}
              </div>

              <div className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id="newsletter"
                  name="newsletter"
                  checked={formData.newsletter}
                  onChange={handleInputChange}
                />
                <label htmlFor="newsletter">
                  Quiero recibir ofertas y novedades
                </label>
              </div>
            </form>
          </div>
        );

      case STEPS.VERIFICATION:
        return (
          <div className={styles.stepContent}>
            <div className={styles.verificationIcon}>
              <Mail size={48} />
            </div>
            <h2>Verifica tu Email</h2>
            <p className={styles.subtitle}>
              Hemos enviado un código de 6 dígitos a<br />
              <strong>{formData.email}</strong>
            </p>
            <form className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="verificationCode">Código de Verificación</label>
                <input
                  type="text"
                  id="verificationCode"
                  name="verificationCode"
                  value={formData.verificationCode}
                  onChange={handleInputChange}
                  placeholder="000000"
                  maxLength="6"
                  className={`${styles.codeInput} ${errors.verificationCode ? styles.error : ''}`}
                />
                {errors.verificationCode && <span className={styles.errorText}>{errors.verificationCode}</span>}
              </div>
              <button type="button" className={styles.resendCode}>
                ¿No recibiste el código? Reenviar
              </button>
            </form>
          </div>
        );

      case STEPS.WELCOME:
        return (
          <div className={styles.stepContent}>
            <div className={styles.successIcon}>
              <Check size={64} />
            </div>
            <h2>¡Cuenta Creada!</h2>
            <p className={styles.subtitle}>
              {authType === 'login'
                ? `¡Bienvenido de nuevo, ${formData.firstName || 'usuario'}!`
                : `¡Bienvenido a Sociedad Tecnológica Integral, ${formData.firstName}!`
              }
            </p>
            <div className={styles.welcomeFeatures}>
              <div className={styles.feature}>
                <Check size={20} />
                <span>Acceso a ofertas exclusivas</span>
              </div>
              <div className={styles.feature}>
                <Check size={20} />
                <span>Historial de compras</span>
              </div>
              <div className={styles.feature}>
                <Check size={20} />
                <span>Seguimiento de pedidos</span>
              </div>
              <div className={styles.feature}>
                <Check size={20} />
                <span>Soporte prioritario</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={styles.modalOverlay}
      onClick={handleClose}
      onKeyDown={handleKeyDown}
    >
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeButton} onClick={handleClose}>
          <X size={24} />
        </button>

        {/* Progress indicator */}
        <div className={styles.progressBar}>
          {[1, 2, 3, 4].map((step) => {
            // Mapear los pasos: 1=SELECTION, 2=CREDENTIALS, 3=PERSONAL_INFO, 4=WELCOME
            // Saltamos VERIFICATION (que era el paso 4)
            let mappedStep = step;
            if (currentStep === STEPS.WELCOME) {
              mappedStep = 4;
            } else if (currentStep === STEPS.PERSONAL_INFO) {
              mappedStep = 3;
            } else if (currentStep === STEPS.CREDENTIALS) {
              mappedStep = 2;
            } else {
              mappedStep = 1;
            }

            return (
              <div
                key={step}
                className={`${styles.progressStep} ${
                  step <= mappedStep ? styles.active : ''
                } ${step < mappedStep ? styles.completed : ''}`}
              />
            );
          })}
        </div>

        {/* Contenido del paso actual */}
        {renderStepContent()}

        {/* Error general */}
        {errors.general && (
          <div className={styles.generalError}>{errors.general}</div>
        )}

        {/* Botones de navegación */}
        <div className={styles.navigationButtons}>
          {currentStep > STEPS.SELECTION && currentStep !== STEPS.WELCOME && (
            <Button
              variant="ghost"
              onClick={goToPreviousStep}
              disabled={isLoading}
            >
              <ArrowLeft size={18} />
              Atrás
            </Button>
          )}

          {currentStep !== STEPS.SELECTION && (
            <Button
              onClick={goToNextStep}
              disabled={isLoading}
              style={{ marginLeft: 'auto' }}
            >
              {isLoading ? 'Cargando...' : (
                <>
                  {currentStep === STEPS.WELCOME ? 'Ir a mi cuenta' : 'Continuar'}
                  <ArrowRight size={18} />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
