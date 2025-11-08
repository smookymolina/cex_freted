import React from 'react';
import { Building2, Banknote, Phone, ShoppingCart } from 'lucide-react';

const PAYMENT_METHODS = [
  {
    id: 'PHONE_PAYMENT',
    name: 'Pago Telefónico',
    description: 'Completa tu pago mediante llamada telefónica',
    icon: Phone,
    recommended: true,
  },
  {
    id: 'BANK_TRANSFER',
    name: 'Transferencia Bancaria',
    description: 'Realiza una transferencia a nuestra cuenta',
    icon: Building2,
  },
  {
    id: 'CONVENIENCE_STORE',
    name: 'Pago en Autoservicio',
    description: 'Paga en Oxxo, 7-Eleven, Soriana y más',
    icon: ShoppingCart,
  },
  {
    id: 'CASH_DEPOSIT',
    name: 'Depósito en Efectivo',
    description: 'Deposita en nuestras cuentas bancarias',
    icon: Banknote,
  },
];

const PaymentMethodSelector = ({ selectedMethod, onSelectMethod }) => {
  return (
    <div className="payment-methods">
      {PAYMENT_METHODS.map((method) => {
        const Icon = method.icon;
        const isSelected = selectedMethod === method.id;

        return (
          <button
            key={method.id}
            type="button"
            className={`payment-method ${isSelected ? 'payment-method--selected' : ''}`}
            onClick={() => onSelectMethod(method.id)}
          >
            {method.recommended && (
              <span className="payment-method__badge">Recomendado</span>
            )}
            <div className="payment-method__icon">
              <Icon size={24} />
            </div>
            <div className="payment-method__info">
              <h4>{method.name}</h4>
              <p>{method.description}</p>
            </div>
            <div className="payment-method__radio">
              <div className={`radio ${isSelected ? 'radio--checked' : ''}`} />
            </div>
          </button>
        );
      })}

      <style jsx>{`
        .payment-methods {
          display: grid;
          gap: 12px;
        }

        .payment-method {
          position: relative;
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 16px;
          align-items: center;
          padding: 18px 20px;
          border: 2px solid rgba(15, 23, 42, 0.12);
          border-radius: 14px;
          background: #fff;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .payment-method:hover {
          border-color: rgba(37, 99, 235, 0.3);
          background: rgba(37, 99, 235, 0.02);
        }

        .payment-method--selected {
          border-color: #2563eb;
          background: rgba(37, 99, 235, 0.05);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .payment-method__badge {
          position: absolute;
          top: -8px;
          right: 12px;
          background: linear-gradient(135deg, #10b981, #059669);
          color: #fff;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 999px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .payment-method__icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(37, 99, 235, 0.1);
          color: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .payment-method--selected .payment-method__icon {
          background: rgba(37, 99, 235, 0.2);
        }

        .payment-method__info h4 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          color: #0f172a;
        }

        .payment-method__info p {
          margin: 4px 0 0;
          font-size: 0.85rem;
          color: rgba(15, 23, 42, 0.65);
        }

        .payment-method__radio {
          display: flex;
          align-items: center;
        }

        .radio {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(15, 23, 42, 0.3);
          border-radius: 50%;
          position: relative;
          transition: all 0.2s ease;
        }

        .radio--checked {
          border-color: #2563eb;
          background: #2563eb;
        }

        .radio--checked::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #fff;
        }

        @media (max-width: 640px) {
          .payment-method {
            grid-template-columns: auto 1fr;
            padding: 16px;
          }

          .payment-method__radio {
            grid-column: 1;
            grid-row: 1;
          }

          .payment-method__icon {
            grid-column: 1;
            grid-row: 2;
          }

          .payment-method__info {
            grid-column: 2;
            grid-row: 2;
          }
        }
      `}</style>
    </div>
  );
};

export default PaymentMethodSelector;
