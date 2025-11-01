import React, { useMemo, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getSession } from 'next-auth/react';
import {
  ArrowLeft,
  CheckCircle,
  CreditCard,
  Phone,
  ShoppingBag,
  Truck,
  User,
  Shield,
} from 'lucide-react';
import { useCart } from '../../context/cart/CartContext';
import CartItemRow from '../../components/cart/CartItemRow';

const CURRENCY_FORMATTER = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
});

const CONTACT_NUMBERS = [
  { zone: 'Zona Norte', contact: 'Lic. Claudia Pacheco', phone: '55 7875 2671' },
  { zone: 'Zona CDMX', contact: 'Luis Aguilar', phone: '56 3752 9427' },
  { zone: 'Zona Sur', contact: 'Lic. Marisol Herrera', phone: '55 7873 8515' },
];

const STEPS = [
  { id: 'cart', label: 'Carrito', icon: ShoppingBag },
  { id: 'customer', label: 'Datos', icon: User },
  { id: 'shipping', label: 'Envio', icon: Truck },
  { id: 'payment', label: 'Pago', icon: CreditCard },
  { id: 'confirmation', label: 'Confirmacion', icon: CheckCircle },
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const postalCodeRegex = /^[0-9]{4,6}$/;
const phoneRegex = /^[0-9()+\-\s]{7,}$/;

const generateReference = () => {
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `CEX-${new Date().getFullYear()}-${random}`;
};

const CheckoutPage = () => {
  const { cart, cartCount, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(0);
  const [customerData, setCustomerData] = useState({ fullName: '', email: '', phone: '' });
  const [customerErrors, setCustomerErrors] = useState({});
  const [shippingData, setShippingData] = useState({
    address: '',
    city: '',
    state: '',
    postalCode: '',
    references: '',
  });
  const [shippingErrors, setShippingErrors] = useState({});
  const [paymentStatus, setPaymentStatus] = useState('idle');
  const [showCallInstructions, setShowCallInstructions] = useState(false);
  const orderReference = useMemo(generateReference, []);
  const clearedCartRef = useRef(false);

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );
  const shippingCost = subtotal >= 2000 ? 0 : cartCount > 0 ? 150 : 0;
  const total = subtotal + shippingCost;

  const isCustomerReady = useMemo(
    () =>
      customerData.fullName.trim() &&
      emailRegex.test(customerData.email.trim()) &&
      phoneRegex.test(customerData.phone.trim()),
    [customerData],
  );

  const isShippingReady = useMemo(
    () =>
      shippingData.address.trim() &&
      shippingData.city.trim() &&
      shippingData.state.trim() &&
      postalCodeRegex.test(shippingData.postalCode.trim()),
    [shippingData],
  );

  useEffect(() => {
    if (currentStep === 4 && !clearedCartRef.current) {
      clearCart();
      clearedCartRef.current = true;
    }
  }, [currentStep, clearCart]);

  const validateCustomer = () => {
    const errors = {};

    if (!customerData.fullName.trim()) errors.fullName = 'Ingresa tu nombre completo.';
    if (!customerData.email.trim() || !emailRegex.test(customerData.email.trim()))
      errors.email = 'Proporciona un correo valido.';
    if (!customerData.phone.trim() || !phoneRegex.test(customerData.phone.trim()))
      errors.phone = 'Ingresa un numero de contacto valido.';

    setCustomerErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateShipping = () => {
    const errors = {};

    if (!shippingData.address.trim()) errors.address = 'Indica la calle y numero.';
    if (!shippingData.city.trim()) errors.city = 'Indica tu ciudad o delegacion.';
    if (!shippingData.state.trim()) errors.state = 'Indica tu estado o provincia.';
    if (!shippingData.postalCode.trim() || !postalCodeRegex.test(shippingData.postalCode.trim()))
      errors.postalCode = 'Codigo postal invalido.';

    setShippingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const goToStep = (stepIndex) => {
    setCurrentStep(stepIndex);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToNextStep = () => {
    if (currentStep === 0) {
      if (cartCount === 0) return;
      goToStep(1);
      return;
    }

    if (currentStep === 1) {
      if (!validateCustomer()) return;
      goToStep(2);
      return;
    }

    if (currentStep === 2) {
      if (!validateShipping()) return;
      goToStep(3);
      return;
    }

    if (currentStep === 3) {
      if (paymentStatus !== 'needs_call') return;
      goToStep(4);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep === 0) return;
    goToStep(Math.max(0, currentStep - 1));
  };

  const updateCustomerField = (key, value) => {
    setCustomerData((prev) => ({ ...prev, [key]: value }));
    setCustomerErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      if (
        (key === 'fullName' && value.trim()) ||
        (key === 'email' && emailRegex.test(value.trim())) ||
        (key === 'phone' && phoneRegex.test(value.trim()))
      ) {
        delete next[key];
      }
      return next;
    });
  };

  const updateShippingField = (key, value) => {
    setShippingData((prev) => ({ ...prev, [key]: value }));
    setShippingErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      if (
        (key === 'postalCode' && postalCodeRegex.test(value.trim())) ||
        (key !== 'postalCode' && value.trim())
      ) {
        delete next[key];
      }
      return next;
    });
  };

  const handlePaymentSimulation = () => {
    if (paymentStatus !== 'idle') return;
    setPaymentStatus('processing');
    setTimeout(() => {
      setPaymentStatus('needs_call');
      setShowCallInstructions(true);
    }, 900);
  };

  const renderCartStep = () => {
    if (cartCount === 0) {
      return (
        <div className="empty-cart">
          <ShoppingBag size={40} aria-hidden="true" />
          <h2>Tu carrito esta vacio</h2>
          <p>Agrega productos certificados a tu carrito para iniciar el proceso de checkout.</p>
          <Link href="/comprar" className="link-button">
            Ir a comprar
          </Link>
        </div>
      );
    }

    return (
      <>
        <header className="step-header">
          <div className="step-header__label">
            <ShoppingBag aria-hidden="true" />
            <div>
              <h1>Verifica tus productos</h1>
              <p>Revisa cantidades y totales antes de continuar.</p>
            </div>
          </div>
          <Link href="/checkout/carrito" className="secondary-link">
            Abrir vista completa del carrito
          </Link>
        </header>

        <section className="cart-items">
          <div className="cart-items__header">
            <span>Producto</span>
            <span>Precio</span>
            <span>Cantidad</span>
            <span>Total</span>
          </div>
          <div className="cart-items__list">
            {cart.map((item) => (
              <CartItemRow key={`${item.id}-${item.slug}`} item={item} />
            ))}
          </div>
        </section>

        <aside className="order-summary">
          <h2>Resumen</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{CURRENCY_FORMATTER.format(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Envio estimado</span>
            <span>{shippingCost === 0 ? 'Sin costo' : CURRENCY_FORMATTER.format(shippingCost)}</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>{CURRENCY_FORMATTER.format(total)}</span>
          </div>
        </aside>
      </>
    );
  };

  const renderCustomerStep = () => (
    <>
      <header className="step-header">
        <div className="step-header__label">
          <User aria-hidden="true" />
          <div>
            <h1>¿Quien recibe el pedido?</h1>
            <p>Utilizaremos esta informacion para enviarte confirmaciones y coordinar la entrega.</p>
          </div>
        </div>
      </header>

      <form className="form-grid" onSubmit={(event) => event.preventDefault()}>
        <label className={`form-field ${customerErrors.fullName ? 'form-field--error' : ''}`}>
          <span>Nombre completo</span>
          <input
            type="text"
            placeholder="Nombre y apellidos"
            value={customerData.fullName}
            onChange={(event) => updateCustomerField('fullName', event.target.value)}
          />
          {customerErrors.fullName && <small>{customerErrors.fullName}</small>}
        </label>

        <label className={`form-field ${customerErrors.email ? 'form-field--error' : ''}`}>
          <span>Correo electronico</span>
          <input
            type="email"
            placeholder="correo@ejemplo.com"
            value={customerData.email}
            onChange={(event) => updateCustomerField('email', event.target.value)}
          />
          {customerErrors.email && <small>{customerErrors.email}</small>}
        </label>

        <label className={`form-field ${customerErrors.phone ? 'form-field--error' : ''}`}>
          <span>Telefono de contacto</span>
          <input
            type="tel"
            placeholder="+52 55 0000 0000"
            value={customerData.phone}
            onChange={(event) => updateCustomerField('phone', event.target.value)}
          />
          {customerErrors.phone && <small>{customerErrors.phone}</small>}
        </label>

        <p className="form-hint">
          <Shield aria-hidden="true" />
          Usaremos tus datos unicamente para coordinar la entrega y actualizaciones del pedido.
        </p>
      </form>
    </>
  );

  const renderShippingStep = () => (
    <>
      <header className="step-header">
        <div className="step-header__label">
          <Truck aria-hidden="true" />
          <div>
            <h1>Datos de entrega</h1>
            <p>Confirma la direccion exacta donde enviaremos tus productos certificados.</p>
          </div>
        </div>
      </header>

      <form className="form-grid" onSubmit={(event) => event.preventDefault()}>
        <label className={`form-field ${shippingErrors.address ? 'form-field--error' : ''}`}>
          <span>Calle y numero</span>
          <input
            type="text"
            placeholder="Ej. Av. Reforma 123, interior 4B"
            value={shippingData.address}
            onChange={(event) => updateShippingField('address', event.target.value)}
          />
          {shippingErrors.address && <small>{shippingErrors.address}</small>}
        </label>

        <label className={`form-field ${shippingErrors.city ? 'form-field--error' : ''}`}>
          <span>Ciudad / Delegacion</span>
          <input
            type="text"
            placeholder="Ciudad o delegacion"
            value={shippingData.city}
            onChange={(event) => updateShippingField('city', event.target.value)}
          />
          {shippingErrors.city && <small>{shippingErrors.city}</small>}
        </label>

        <label className={`form-field ${shippingErrors.state ? 'form-field--error' : ''}`}>
          <span>Estado</span>
          <input
            type="text"
            placeholder="Estado"
            value={shippingData.state}
            onChange={(event) => updateShippingField('state', event.target.value)}
          />
          {shippingErrors.state && <small>{shippingErrors.state}</small>}
        </label>

        <label className={`form-field ${shippingErrors.postalCode ? 'form-field--error' : ''}`}>
          <span>Codigo postal</span>
          <input
            type="text"
            placeholder="01120"
            value={shippingData.postalCode}
            onChange={(event) => updateShippingField('postalCode', event.target.value)}
          />
          {shippingErrors.postalCode && <small>{shippingErrors.postalCode}</small>}
        </label>

        <label className="form-field form-field--full">
          <span>Referencias opcionales</span>
          <textarea
            rows={3}
            placeholder="Ej. Entrar por la puerta blanca, llamar al timbre 2."
            value={shippingData.references}
            onChange={(event) => updateShippingField('references', event.target.value)}
          />
        </label>
      </form>
    </>
  );

  const renderPaymentStep = () => (
    <>
      <header className="step-header">
        <div className="step-header__label">
          <CreditCard aria-hidden="true" />
          <div>
            <h1>Simula tu pago con PayPal</h1>
            <p>
              Te mostraremos un flujo similar a PayPal. Al confirmar, recibiras las instrucciones para completar el pago via telefonica.
            </p>
          </div>
        </div>
      </header>

      <section className="paypal-card">
        <div className="paypal-card__header">
          <span className="paypal-logo">PayPal</span>
          <span className="paypal-secure">Transaccion segura</span>
        </div>

        <div className="paypal-summary">
          <div className="summary-row">
            <span>Total a pagar</span>
            <strong>{CURRENCY_FORMATTER.format(total)}</strong>
          </div>
          <div className="summary-row">
            <span>Concepto</span>
            <strong>Compra de productos certificados CEX Freted</strong>
          </div>
          <div className="summary-row">
            <span>Referencia</span>
            <strong>{orderReference}</strong>
          </div>
        </div>

        <button
          type="button"
          className="paypal-button"
          onClick={handlePaymentSimulation}
          disabled={paymentStatus !== 'idle'}
        >
          {paymentStatus === 'processing' ? 'Procesando...' : 'Pagar con PayPal'}
        </button>
        <small className="paypal-note">
          Simulacion sin cobro automatico. Necesitaremos confirmar tu pago via llamada.
        </small>
      </section>

      {showCallInstructions && (
        <section className="callout">
          <header>
            <Phone aria-hidden="true" />
            <div>
              <h2>Confirma tu pago por telefono</h2>
              <p>
                Para finalizar la compra, comunicate con nuestro equipo de atencion y comparte la referencia <strong>{orderReference}</strong>.
              </p>
            </div>
          </header>

          <ul>
            {CONTACT_NUMBERS.map((contact) => (
              <li key={contact.zone}>
                <span>
                  <strong>{contact.zone}</strong> — {contact.contact}
                </span>
                <a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a>
              </li>
            ))}
          </ul>

          <p className="callout__hint">
            Tu pedido quedara reservado durante 24 horas mientras confirmamos el pago telefonico.
          </p>
        </section>
      )}
    </>
  );

  const renderConfirmationStep = () => (
    <section className="confirmation">
      <div className="confirmation__icon">
        <CheckCircle size={48} aria-hidden="true" />
      </div>
      <h1>¡Reserva confirmada!</h1>
      <p>
        Estamos apartando tus productos certificados mientras nuestro equipo valida el pago. Recibiras seguimiento en <strong>{customerData.email || 'tu correo'}</strong>.
      </p>

      <div className="confirmation__summary">
        <div>
          <h3>Referencia del pedido</h3>
          <p>{orderReference}</p>
        </div>
        <div>
          <h3>Total reservado</h3>
          <p>{CURRENCY_FORMATTER.format(total)}</p>
        </div>
      </div>

      <div className="confirmation__details">
        <h3>Contacto</h3>
        <p>
          {customerData.fullName || 'Nombre por confirmar'} · {customerData.phone || 'Telefono por confirmar'}
        </p>
        <h3>Entrega estimada</h3>
        <p>
          {shippingData.address || 'Direccion por confirmar'}, {shippingData.city || 'Ciudad'}, {shippingData.state || 'Estado'} · CP {shippingData.postalCode || '00000'}
        </p>
        {shippingData.references && (
          <>
            <h3>Indicaciones</h3>
            <p>{shippingData.references}</p>
          </>
        )}
      </div>

      <div className="confirmation__actions">
        <Link href="/comprar" className="link-button">
          Regresar al catalogo
        </Link>
        <Link href="/mi-cuenta/pedidos" className="link-button link-button--ghost">
          Ver seguimiento
        </Link>
      </div>

      <p className="confirmation__footer">
        ¿Necesitas ayuda adicional? Escribenos a <a href="mailto:atencion@cexfreted.com">atencion@cexfreted.com</a> con tu referencia.
      </p>
    </section>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderCartStep();
      case 1:
        return renderCustomerStep();
      case 2:
        return renderShippingStep();
      case 3:
        return renderPaymentStep();
      case 4:
        return renderConfirmationStep();
      default:
        return null;
    }
  };

  const canProceed =
    (currentStep === 0 && cartCount > 0) ||
    (currentStep === 1 && isCustomerReady) ||
    (currentStep === 2 && isShippingReady) ||
    (currentStep === 3 && paymentStatus === 'needs_call');

  return (
    <div className="checkout-page">
      <div className="page-inner">
        <nav className="breadcrumb">
          <Link href="/comprar" className="breadcrumb__link">
            <ArrowLeft size={16} aria-hidden="true" />
            Seguir comprando
          </Link>
        </nav>

        <div className="stepper" role="list">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const status = index < currentStep ? 'completed' : index === currentStep ? 'current' : 'upcoming';

            return (
              <div key={step.id} className={`stepper__item stepper__item--${status}`} role="listitem">
                <div className="stepper__icon">
                  <Icon size={18} aria-hidden="true" />
                </div>
                <span>{step.label}</span>
              </div>
            );
          })}
        </div>

        <main className="step-content">{renderCurrentStep()}</main>

        {currentStep < 4 && (
          <div className="step-actions">
            <button
              type="button"
              onClick={goToPreviousStep}
              className="ghost-button"
              disabled={currentStep === 0}
            >
              Regresar
            </button>
            <button
              type="button"
              onClick={goToNextStep}
              className="primary-button"
              disabled={!canProceed}
            >
              {currentStep === 3 ? 'Ir a confirmacion' : 'Continuar'}
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .checkout-page {
          background: #f5f7fb;
          min-height: 100vh;
          padding: 48px 16px 64px;
        }

        .page-inner {
          max-width: 1080px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .breadcrumb__link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          color: #0f172a;
          text-decoration: none;
          font-weight: 600;
        }

        .breadcrumb__link:hover {
          text-decoration: underline;
        }

        .stepper {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 12px;
          background: #fff;
          border-radius: 14px;
          padding: 16px 18px;
          border: 1px solid rgba(15, 23, 42, 0.08);
          box-shadow: 0 12px 24px rgba(15, 23, 42, 0.1);
        }

        .stepper__item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
        }

        .stepper__icon {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .stepper__item--completed .stepper__icon {
          background: rgba(16, 185, 129, 0.16);
          color: #059669;
        }

        .stepper__item--current .stepper__icon {
          background: rgba(59, 130, 246, 0.18);
          color: #2563eb;
        }

        .stepper__item--upcoming .stepper__icon {
          background: rgba(15, 23, 42, 0.08);
          color: rgba(15, 23, 42, 0.6);
        }

        .step-content {
          background: #fff;
          border-radius: 16px;
          border: 1px solid rgba(15, 23, 42, 0.1);
          box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
          padding: 32px;
          display: grid;
          gap: 24px;
        }

        .step-header {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .step-header__label {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }

        .step-header__label svg {
          width: 44px;
          height: 44px;
          padding: 10px;
          border-radius: 12px;
          background: rgba(37, 99, 235, 0.15);
          color: #2563eb;
        }

        .step-header h1 {
          margin: 0;
          font-size: 1.6rem;
          color: #0f172a;
        }

        .step-header p {
          margin: 4px 0 0;
          color: rgba(15, 23, 42, 0.72);
        }

        .secondary-link {
          align-self: center;
          font-size: 0.9rem;
          color: #2563eb;
          text-decoration: none;
          font-weight: 600;
        }

        .cart-items {
          border: 1px solid rgba(15, 23, 42, 0.08);
          border-radius: 14px;
          overflow: hidden;
        }

        .cart-items__header {
          display: grid;
          grid-template-columns: 1.6fr 0.7fr 0.7fr 0.8fr;
          gap: 12px;
          padding: 16px 24px;
          background: rgba(15, 23, 42, 0.05);
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: rgba(15, 23, 42, 0.65);
        }

        .order-summary {
          padding: 24px;
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(14, 165, 233, 0.1));
          border: 1px solid rgba(37, 99, 235, 0.2);
          display: grid;
          gap: 12px;
        }

        .summary-row,
        .summary-total {
          display: flex;
          justify-content: space-between;
          font-size: 0.95rem;
        }

        .summary-total {
          padding-top: 8px;
          border-top: 1px solid rgba(15, 23, 42, 0.12);
          font-weight: 700;
          font-size: 1.05rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 18px;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-field span {
          font-size: 0.9rem;
          font-weight: 600;
          color: #0f172a;
        }

        .form-field input,
        .form-field textarea {
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid rgba(15, 23, 42, 0.12);
          font-size: 0.95rem;
        }

        .form-field--error input,
        .form-field--error textarea {
          border-color: #dc2626;
        }

        .form-field small {
          color: #dc2626;
          font-size: 0.8rem;
        }

        .form-field--full {
          grid-column: 1 / -1;
        }

        .form-hint {
          grid-column: 1 / -1;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.85rem;
          background: rgba(15, 23, 42, 0.05);
          border-radius: 12px;
          padding: 12px 14px;
          color: rgba(15, 23, 42, 0.7);
        }

        .form-hint svg {
          width: 18px;
          height: 18px;
          color: #2563eb;
        }

        .paypal-card {
          border-radius: 16px;
          border: 1px solid rgba(15, 23, 42, 0.12);
          padding: 24px;
          display: grid;
          gap: 16px;
          background: linear-gradient(135deg, rgba(248, 250, 252, 0.9), rgba(241, 245, 249, 0.7));
        }

        .paypal-card__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .paypal-button {
          border: none;
          border-radius: 999px;
          height: 48px;
          background: linear-gradient(135deg, #ffc439, #f79b24);
          color: #0f172a;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
        }

        .paypal-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .paypal-note {
          font-size: 0.8rem;
          color: rgba(15, 23, 42, 0.6);
        }

        .callout {
          border-radius: 16px;
          border: 1px solid rgba(14, 165, 233, 0.25);
          background: rgba(14, 165, 233, 0.08);
          padding: 24px;
          display: grid;
          gap: 16px;
        }

        .callout header {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }

        .callout ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 12px;
        }

        .callout li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }

        .callout__hint {
          font-size: 0.85rem;
          color: rgba(15, 23, 42, 0.7);
        }

        .confirmation {
          display: grid;
          gap: 18px;
          text-align: center;
        }

        .confirmation__icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(34, 197, 94, 0.12);
          color: #16a34a;
          margin: 0 auto;
        }

        .confirmation__summary {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          background: rgba(15, 23, 42, 0.05);
          border-radius: 14px;
          padding: 16px;
        }

        .confirmation__summary h3 {
          margin: 0;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgba(15, 23, 42, 0.6);
        }

        .confirmation__summary p {
          margin: 4px 0 0;
          font-size: 1.1rem;
          font-weight: 700;
          color: #0f172a;
        }

        .confirmation__details {
          text-align: left;
          display: grid;
          gap: 8px;
          padding: 16px;
          border-radius: 14px;
          border: 1px solid rgba(15, 23, 42, 0.08);
        }

        .confirmation__actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
        }

        .confirmation__footer {
          font-size: 0.9rem;
          color: rgba(15, 23, 42, 0.65);
        }

        .link-button,
        .link-button--ghost {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 20px;
          border-radius: 999px;
          font-weight: 600;
          text-decoration: none;
        }

        .link-button {
          background: linear-gradient(135deg, #2563eb, #4338ca);
          color: #fff;
        }

        .link-button--ghost {
          border: 1px solid rgba(15, 23, 42, 0.18);
          color: #0f172a;
          background: #fff;
        }

        .step-actions {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          background: #fff;
          border-radius: 16px;
          padding: 18px 24px;
          border: 1px solid rgba(15, 23, 42, 0.08);
          box-shadow: 0 12px 24px rgba(15, 23, 42, 0.1);
        }

        .ghost-button,
        .primary-button {
          min-width: 160px;
          height: 46px;
          border-radius: 999px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          border: none;
        }

        .ghost-button {
          background: rgba(15, 23, 42, 0.08);
          color: #0f172a;
        }

        .primary-button {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: #fff;
        }

        .ghost-button:disabled,
        .primary-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .empty-cart {
          padding: 48px 24px;
          background: rgba(15, 23, 42, 0.02);
          border-radius: 16px;
          border: 1px dashed rgba(15, 23, 42, 0.12);
          display: grid;
          gap: 12px;
          text-align: center;
          color: rgba(15, 23, 42, 0.72);
        }

        @media (max-width: 900px) {
          .cart-items__header {
            display: none;
          }

          .step-content {
            padding: 24px;
          }
        }

        @media (max-width: 640px) {
          .checkout-page {
            padding: 32px 12px 48px;
          }

          .stepper {
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
            gap: 8px;
          }

          .step-actions {
            flex-direction: column-reverse;
          }

          .ghost-button,
          .primary-button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: `/mi-cuenta/login?callbackUrl=${encodeURIComponent('/checkout')}`,
        permanent: false,
      },
    };
  }

  return { props: {} };
}

export default CheckoutPage;
