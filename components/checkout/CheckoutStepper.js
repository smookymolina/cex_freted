
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useCart } from '../../context/cart/CartContext';
import { processCheckout } from '../../utils/checkoutHelper';
import { isBuenFinActive, BUEN_FIN_PROMO } from '../../config/promotions';
import CartStep from './steps/CartStep';
import CustomerStep from './steps/CustomerStep';
import ShippingStep from './steps/ShippingStep';
import PaymentStep from './steps/PaymentStep';
import ConfirmationStep from './steps/ConfirmationStep';

import {
  ArrowLeft,
  CheckCircle,
  CreditCard,
  ShoppingBag,
  Truck,
  User,
  Loader,
} from 'lucide-react';

const STEPS = [
  { id: 'cart', label: 'Carrito', icon: ShoppingBag },
  { id: 'customer', label: 'Datos', icon: User },
  { id: 'shipping', label: 'Envío', icon: Truck },
  { id: 'payment', label: 'Pago', icon: CreditCard },
  { id: 'confirmation', label: 'Confirmación', icon: CheckCircle },
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const postalCodeRegex = /^[0-9]{4,6}$/;
const phoneRegex = /^[0-9()+\-\s]{7,}$/;

const CheckoutStepper = () => {
  const { data: session, status } = useSession();
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
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('PHONE_PAYMENT');
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, processing, completed, error
  const [orderInfo, setOrderInfo] = useState(null);
  const [processingError, setProcessingError] = useState(null);
  const clearedCartRef = useRef(false);

  // Debug: Log session status
  useEffect(() => {
    console.log('Session status:', status);
    console.log('Session data:', session);
  }, [session, status]);

  // Pre-fill customer data from session
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setCustomerData((prev) => ({
        ...prev,
        fullName: session.user.name || prev.fullName || '',
        email: session.user.email || prev.email || '',
        phone: session.user.phone || prev.phone || '', // Assuming 'phone' is available in the session
      }));
    }
  }, [session, status]);

  const buenFinActive = isBuenFinActive();

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );

  const buenFinDiscount = buenFinActive && subtotal > 0 ? BUEN_FIN_PROMO.extraDiscountAmount : 0;
  const subtotalWithDiscount = subtotal - buenFinDiscount;
  const shippingCost = subtotalWithDiscount >= 2000 ? 0 : cartCount > 0 ? 150 : 0;
  const total = subtotalWithDiscount + shippingCost;

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
      errors.email = 'Proporciona un correo válido.';
    if (!customerData.phone.trim() || !phoneRegex.test(customerData.phone.trim()))
      errors.phone = 'Ingresa un número de contacto válido.';

    setCustomerErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateShipping = () => {
    const errors = {};

    if (!shippingData.address.trim()) errors.address = 'Indica la calle y número.';
    if (!shippingData.city.trim()) errors.city = 'Indica tu ciudad o delegación.';
    if (!shippingData.state.trim()) errors.state = 'Indica tu estado o provincia.';
    if (!shippingData.postalCode.trim() || !postalCodeRegex.test(shippingData.postalCode.trim()))
      errors.postalCode = 'Código postal inválido.';

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
      handleProcessPayment();
      return;
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

  const handleProcessPayment = async () => {
    if (paymentStatus === 'processing') return;

    setPaymentStatus('processing');
    setProcessingError(null);

    try {
      const result = await processCheckout({
        customer: customerData,
        shipping: shippingData,
        cart: cart,
        totals: {
          subtotal,
          buenFinDiscount,
          shippingCost,
          total,
        },
        paymentMethod: selectedPaymentMethod,
      });

      if (result.success) {
        setOrderInfo({
          orderNumber: result.order.orderNumber,
          paymentReference: result.payment.referenceNumber,
          total: result.order.total,
        });
        setPaymentStatus('completed');
        setTimeout(() => {
          goToStep(4);
        }, 800);
      } else {
        setPaymentStatus('error');
        // Verificar si es un error de autenticación
        if (result.error?.includes('No autorizado') || result.error?.includes('401')) {
          setProcessingError(
            'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
          );
          // Redirigir al login después de 2 segundos
          setTimeout(() => {
            window.location.href = `/mi-cuenta/login?callbackUrl=${encodeURIComponent('/checkout')}`;
          }, 2000);
        } else {
          setProcessingError(result.error || 'Error al procesar la orden');
        }
      }
    } catch (error) {
      console.error('Error en proceso de pago:', error);
      setPaymentStatus('error');

      // Verificar si es un error de autenticación
      if (error.message?.includes('No autorizado') || error.message?.includes('401')) {
        setProcessingError(
          'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
        );
        setTimeout(() => {
          window.location.href = `/mi-cuenta/login?callbackUrl=${encodeURIComponent('/checkout')}`;
        }, 2000);
      } else {
        setProcessingError('Error de conexión. Por favor intenta nuevamente.');
      }
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <CartStep subtotal={subtotal} shippingCost={shippingCost} total={total} />;
      case 1:
        return (
          <CustomerStep
            customerData={customerData}
            customerErrors={customerErrors}
            updateCustomerField={updateCustomerField}
          />
        );
      case 2:
        return (
          <ShippingStep
            shippingData={shippingData}
            shippingErrors={shippingErrors}
            updateShippingField={updateShippingField}
          />
        );
      case 3:
        return (
          <PaymentStep
            customerData={customerData}
            selectedPaymentMethod={selectedPaymentMethod}
            onPaymentMethodChange={setSelectedPaymentMethod}
            subtotal={subtotal}
            shippingCost={shippingCost}
            total={total}
            paymentStatus={paymentStatus}
            processingError={processingError}
          />
        );
      case 4:
        return (
          <ConfirmationStep
            orderInfo={orderInfo}
            customerData={customerData}
            shippingData={shippingData}
            selectedPaymentMethod={selectedPaymentMethod}
          />
        );
      default:
        return null;
    }
  };

  const canProceed =
    (currentStep === 0 && cartCount > 0) ||
    (currentStep === 1 && isCustomerReady) ||
    (currentStep === 2 && isShippingReady) ||
    (currentStep === 3 && selectedPaymentMethod && paymentStatus !== 'processing');

  // Mostrar mensaje de carga mientras se verifica la sesión
  if (status === 'loading') {
    return (
      <div className="checkout-stepper">
        <div className="loading-session">
          <Loader className="spinner" size={40} />
          <p>Verificando sesión...</p>
        </div>
        <style jsx>{`
          .checkout-stepper {
            background: #fff;
            border-radius: 20px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
            overflow: hidden;
            min-height: 400px;
          }
          .loading-session {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 80px 20px;
            gap: 20px;
          }
          .spinner {
            color: #2563eb;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          .loading-session p {
            margin: 0;
            color: rgba(15, 23, 42, 0.65);
            font-size: 0.95rem;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="checkout-stepper">
      <div className="stepper" role="list">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const status =
            index < currentStep ? 'completed' : index === currentStep ? 'current' : 'upcoming';

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
            disabled={!canProceed || paymentStatus === 'processing'}
          >
            {paymentStatus === 'processing' ? (
              <>
                <Loader className="button-spinner" size={18} />
                Procesando...
              </>
            ) : currentStep === 3 ? (
              'Confirmar Pedido'
            ) : (
              'Continuar'
            )}
          </button>
        </div>
      )}

      <style jsx>{`
        .checkout-stepper {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }

        .stepper {
          display: flex;
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          padding: 24px;
          gap: 8px;
          border-bottom: 1px solid rgba(15, 23, 42, 0.08);
        }

        .stepper__item {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 600;
          transition: all 0.25s ease;
          position: relative;
        }

        .stepper__item--completed {
          background: rgba(16, 185, 129, 0.12);
          color: #059669;
        }

        .stepper__item--current {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: #fff;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }

        .stepper__item--upcoming {
          background: transparent;
          color: rgba(15, 23, 42, 0.4);
        }

        .stepper__icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .step-content {
          padding: 40px 48px;
          min-height: 480px;
        }

        .step-actions {
          display: flex;
          gap: 16px;
          justify-content: flex-end;
          padding: 24px 48px;
          border-top: 1px solid rgba(15, 23, 42, 0.08);
          background: #fafbfc;
        }

        .ghost-button,
        .primary-button {
          padding: 14px 32px;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .ghost-button {
          background: transparent;
          color: rgba(15, 23, 42, 0.7);
          border: 2px solid rgba(15, 23, 42, 0.12);
        }

        .ghost-button:hover:not(:disabled) {
          background: rgba(15, 23, 42, 0.04);
          border-color: rgba(15, 23, 42, 0.2);
        }

        .ghost-button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .primary-button {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: #fff;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
        }

        .primary-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(37, 99, 235, 0.35);
        }

        .primary-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .button-spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .stepper {
            padding: 16px;
            gap: 4px;
          }

          .stepper__item {
            flex-direction: column;
            padding: 10px 8px;
            font-size: 0.75rem;
            gap: 4px;
          }

          .stepper__item span {
            display: none;
          }

          .step-content {
            padding: 24px 20px;
            min-height: 400px;
          }

          .step-actions {
            padding: 16px 20px;
            flex-direction: column;
          }

          .ghost-button,
          .primary-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default CheckoutStepper;
