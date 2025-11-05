import { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/ui/Button';
import styles from '../../styles/pages/contacto.module.css';

const CONTACT_REASONS = [
  'Consulta sobre producto',
  'Problema con pedido',
  'Devolución o garantía',
  'Vender mi dispositivo',
  'Sugerencia',
  'Otro',
];

export default function ContactoPage() {
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    reason: '',
    message: '',
    acceptsTerms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    const phoneRegex = /^\d{10}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'El teléfono debe tener 10 dígitos';
    }

    if (!formData.reason) {
      newErrors.reason = 'Selecciona un motivo';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'El mensaje es requerido';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'El mensaje debe tener al menos 10 caracteres';
    }

    if (!formData.acceptsTerms) {
      newErrors.acceptsTerms = 'Debes aceptar los términos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Por favor corrige los errores del formulario');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Mensaje enviado correctamente. Te contactaremos pronto.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          reason: '',
          message: '',
          acceptsTerms: false,
        });
      } else {
        toast.error(data.message || 'Error al enviar el mensaje');
      }
    } catch (error) {
      toast.error('Error de conexión. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageInner}>
        <header className={styles.header}>
          <span className={styles.badge}>Soporte</span>
          <h1 className={styles.title}>Contáctanos</h1>
          <p className={styles.subtitle}>
            ¿Tienes alguna pregunta? Estamos aquí para ayudarte
          </p>
        </header>

        <div className={styles.contentGrid}>
          <div className={styles.contactInfo}>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>📞</div>
              <h3>Teléfono</h3>
              <p>+34 900 000 111</p>
              <span className={styles.schedule}>Lun-Vie 09:00-20:00</span>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>✉️</div>
              <h3>Email</h3>
              <p>soporte@cexfreted.com</p>
              <span className={styles.schedule}>Respuesta en 24h</span>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>💬</div>
              <h3>Chat en vivo</h3>
              <p>Disponible 24/7</p>
              <span className={styles.schedule}>Desde tu panel de usuario</span>
            </div>
          </div>

          <form className={styles.contactForm} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Nombre completo <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                placeholder="Tu nombre"
              />
              {errors.name && <span className={styles.error}>{errors.name}</span>}
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email <span className={styles.required}>*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                  placeholder="tu@email.com"
                />
                {errors.email && <span className={styles.error}>{errors.email}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone" className={styles.label}>
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                  placeholder="1234567890"
                />
                {errors.phone && <span className={styles.error}>{errors.phone}</span>}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="reason" className={styles.label}>
                Motivo de contacto <span className={styles.required}>*</span>
              </label>
              <select
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className={`${styles.select} ${errors.reason ? styles.inputError : ''}`}
              >
                <option value="">Selecciona una opción</option>
                {CONTACT_REASONS.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
              {errors.reason && <span className={styles.error}>{errors.reason}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message" className={styles.label}>
                Mensaje <span className={styles.required}>*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className={`${styles.textarea} ${errors.message ? styles.inputError : ''}`}
                placeholder="Cuéntanos cómo podemos ayudarte..."
                rows={6}
              />
              {errors.message && <span className={styles.error}>{errors.message}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="acceptsTerms"
                  checked={formData.acceptsTerms}
                  onChange={handleChange}
                  className={styles.checkbox}
                />
                <span>
                  Acepto el{' '}
                  <a href="/legal/privacidad" target="_blank" rel="noopener noreferrer">
                    tratamiento de mis datos
                  </a>{' '}
                  según la política de privacidad <span className={styles.required}>*</span>
                </span>
              </label>
              {errors.acceptsTerms && (
                <span className={styles.error}>{errors.acceptsTerms}</span>
              )}
            </div>

            <Button type="submit" fullWidth disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
