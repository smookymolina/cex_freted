
import React from 'react';
import { User, Shield } from 'lucide-react';

const CustomerStep = ({ customerData, customerErrors, updateCustomerField }) => (
  <>
    <header className="step-header">
      <div className="step-header__label">
        <User aria-hidden="true" />
        <div>
          <h1>¿Quién recibe el pedido?</h1>
          <p>Utilizaremos esta información para enviarte confirmaciones y coordinar la entrega.</p>
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
        <span>Correo electrónico</span>
        <input
          type="email"
          placeholder="correo@ejemplo.com"
          value={customerData.email}
          onChange={(event) => updateCustomerField('email', event.target.value)}
        />
        {customerErrors.email && <small>{customerErrors.email}</small>}
      </label>

      <label className={`form-field ${customerErrors.phone ? 'form-field--error' : ''}`}>
        <span>Teléfono de contacto</span>
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
        Usaremos tus datos únicamente para coordinar la entrega y actualizaciones del pedido.
      </p>
    </form>

    <style jsx>{`
      .step-header {
        margin-bottom: 32px;
      }

      .step-header__label {
        display: flex;
        gap: 16px;
        align-items: flex-start;
      }

      .step-header__label > :global(svg) {
        width: 32px;
        height: 32px;
        color: #2563eb;
        flex-shrink: 0;
      }

      .step-header h1 {
        margin: 0 0 8px;
        font-size: 1.5rem;
        font-weight: 700;
        color: #0f172a;
      }

      .step-header p {
        margin: 0;
        font-size: 0.95rem;
        color: rgba(15, 23, 42, 0.65);
        line-height: 1.5;
      }

      .form-grid {
        display: grid;
        gap: 24px;
        max-width: 640px;
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
        padding: 14px 16px;
        border: 2px solid rgba(15, 23, 42, 0.12);
        border-radius: 10px;
        font-size: 0.95rem;
        color: #0f172a;
        transition: all 0.2s ease;
        background: #fff;
      }

      .form-field input:focus,
      .form-field textarea:focus {
        outline: none;
        border-color: #2563eb;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
      }

      .form-field--error input,
      .form-field--error textarea {
        border-color: #ef4444;
      }

      .form-field small {
        color: #ef4444;
        font-size: 0.85rem;
        font-weight: 500;
      }

      .form-field--full {
        grid-column: 1 / -1;
      }

      .form-hint {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        background: rgba(59, 130, 246, 0.05);
        border-left: 4px solid #2563eb;
        border-radius: 8px;
        font-size: 0.85rem;
        color: rgba(15, 23, 42, 0.75);
        margin: 8px 0 0;
      }

      .form-hint :global(svg) {
        width: 20px;
        height: 20px;
        color: #2563eb;
        flex-shrink: 0;
      }

      @media (max-width: 640px) {
        .step-header h1 {
          font-size: 1.25rem;
        }

        .step-header__label {
          gap: 12px;
        }

        .step-header__label > :global(svg) {
          width: 24px;
          height: 24px;
        }
      }
    `}</style>
  </>
);

export default CustomerStep;
