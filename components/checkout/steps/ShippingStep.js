
import React from 'react';
import { Truck } from 'lucide-react';

const ShippingStep = ({ shippingData, shippingErrors, updateShippingField }) => (
  <>
    <header className="step-header">
      <div className="step-header__label">
        <Truck aria-hidden="true" />
        <div>
          <h1>Datos de entrega</h1>
          <p>Confirma la dirección exacta donde enviaremos tus productos certificados.</p>
        </div>
      </div>
    </header>

    <form className="form-grid" onSubmit={(event) => event.preventDefault()}>
      <label className={`form-field ${shippingErrors.address ? 'form-field--error' : ''}`}>
        <span>Calle y número</span>
        <input
          type="text"
          placeholder="Ej. Av. Reforma 123, interior 4B"
          value={shippingData.address}
          onChange={(event) => updateShippingField('address', event.target.value)}
        />
        {shippingErrors.address && <small>{shippingErrors.address}</small>}
      </label>

      <label className={`form-field ${shippingErrors.city ? 'form-field--error' : ''}`}>
        <span>Ciudad / Delegación</span>
        <input
          type="text"
          placeholder="Ciudad o delegación"
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
        <span>Código postal</span>
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
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
        max-width: 800px;
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
        font-family: inherit;
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

      @media (max-width: 768px) {
        .form-grid {
          grid-template-columns: 1fr;
        }

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

export default ShippingStep;
