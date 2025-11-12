/**
 * Utilidad para generar PDFs de órdenes de compra según método de pago
 * Genera documentos HTML que pueden ser convertidos a PDF en el navegador
 */

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(Number(value) || 0);

const formatDate = (date) =>
  new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));

/**
 * Genera HTML para orden de compra de transferencia/depósito bancario
 */
export function generateBankTransferPDF(orderData, paymentData) {
  const { orderNumber, referenceNumber, totalAmount, releasedAt } = orderData;
  const { accounts, title, description, instructions, importantNotes } = paymentData;

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Orden de Compra - ${orderNumber}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 40px;
          background: #ffffff;
          color: #1f2937;
        }

        .header {
          text-align: center;
          border-bottom: 4px solid #ef4444;
          padding-bottom: 30px;
          margin-bottom: 40px;
        }

        .company-name {
          font-size: 28px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 10px;
        }

        .document-title {
          font-size: 20px;
          color: #ef4444;
          font-weight: 600;
        }

        .order-info {
          background: #f3f4f6;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 30px;
          border-left: 6px solid #ef4444;
        }

        .order-info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
        }

        .info-label {
          font-size: 12px;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 5px;
        }

        .info-value {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
        }

        .section {
          margin-bottom: 35px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #e5e7eb;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .bank-card {
          background: linear-gradient(135deg, #ffffff, #f9fafb);
          border: 2px solid #ef4444;
          border-radius: 15px;
          padding: 30px;
          margin-bottom: 20px;
          position: relative;
          overflow: hidden;
        }

        .bank-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: linear-gradient(90deg, #ef4444, #dc2626);
        }

        .bank-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 25px;
          padding-top: 10px;
        }

        .bank-name {
          font-size: 28px;
          font-weight: 700;
          color: #ef4444;
        }

        .bank-logo {
          max-height: 40px;
          max-width: 150px;
        }

        .account-holder {
          font-size: 16px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 5px;
        }

        .account-title {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 20px;
        }

        .account-details {
          display: grid;
          gap: 15px;
        }

        .account-field {
          background: #ffffff;
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .field-label {
          font-size: 12px;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 5px;
        }

        .field-value {
          font-size: 20px;
          font-weight: 700;
          color: #111827;
          font-family: 'Courier New', monospace;
          letter-spacing: 1px;
        }

        .instructions {
          background: #eff6ff;
          border: 2px solid #3b82f6;
          border-radius: 12px;
          padding: 25px;
        }

        .instructions ol {
          padding-left: 25px;
          margin-top: 15px;
        }

        .instructions li {
          margin-bottom: 12px;
          line-height: 1.6;
          color: #1f2937;
        }

        .notes {
          background: #fef3c7;
          border: 2px solid #f59e0b;
          border-radius: 12px;
          padding: 25px;
        }

        .notes ul {
          list-style: none;
          padding-left: 0;
          margin-top: 15px;
        }

        .notes li {
          margin-bottom: 10px;
          padding-left: 25px;
          position: relative;
          line-height: 1.6;
          color: #92400e;
        }

        .notes li::before {
          content: '⚠';
          position: absolute;
          left: 0;
          font-size: 16px;
        }

        .footer {
          margin-top: 50px;
          padding-top: 20px;
          border-top: 2px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }

        @media print {
          body {
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-name">SOCIEDAD TECNOLÓGICA INTEGRAL</div>
        <div class="document-title">${title}</div>
      </div>

      <div class="order-info">
        <div class="order-info-grid">
          <div class="info-item">
            <span class="info-label">Número de Orden</span>
            <span class="info-value">${orderNumber}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Referencia de Pago</span>
            <span class="info-value">${referenceNumber}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Monto Total</span>
            <span class="info-value">${formatCurrency(totalAmount)}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Fecha de Emisión</span>
            <span class="info-value">${formatDate(releasedAt)}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">📋 ${description}</h2>

        ${accounts.map((account) => `
          <div class="bank-card">
            <div class="bank-header">
              <div>
                <div class="bank-name">${account.bank}</div>
                ${account.accountTitle ? `<div class="account-title">${account.accountTitle}</div>` : ''}
              </div>
              ${account.bankLogo ? `<img src="${account.bankLogo}" alt="${account.bank}" class="bank-logo" />` : ''}
            </div>

            <div class="account-holder">${account.accountHolder}</div>

            <div class="account-details">
              ${account.accountNumber ? `
                <div class="account-field">
                  <div class="field-label">Cuenta</div>
                  <div class="field-value">${account.accountNumber}</div>
                </div>
              ` : ''}

              ${account.clabe ? `
                <div class="account-field">
                  <div class="field-label">CLABE</div>
                  <div class="field-value">${account.clabe}</div>
                </div>
              ` : ''}

              ${account.clabeInterbancaria ? `
                <div class="account-field">
                  <div class="field-label">CLABE Interbancaria</div>
                  <div class="field-value">${account.clabeInterbancaria}</div>
                </div>
              ` : ''}

              ${account.cardNumber ? `
                <div class="account-field">
                  <div class="field-label">Tarjeta</div>
                  <div class="field-value">${account.cardNumber}</div>
                </div>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>

      ${instructions && instructions.length > 0 ? `
        <div class="section">
          <div class="instructions">
            <h2 class="section-title">📝 Instrucciones de Pago</h2>
            <ol>
              ${instructions.map((instruction) => `<li>${instruction}</li>`).join('')}
            </ol>
          </div>
        </div>
      ` : ''}

      ${importantNotes && importantNotes.length > 0 ? `
        <div class="section">
          <div class="notes">
            <h2 class="section-title">⚠️ Notas Importantes</h2>
            <ul>
              ${importantNotes.map((note) => `<li>${note}</li>`).join('')}
            </ul>
          </div>
        </div>
      ` : ''}

      <div class="footer">
        <p><strong>Sociedad Tecnológica Integral</strong></p>
        <p>Recommerce premium certificado</p>
        <p>Para soporte: contacto@cexfreted.com | Tel: 01-800-CEX-239-7246</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Genera HTML para orden de compra de tienda de conveniencia (OXXO)
 */
export function generateConvenienceStorePDF(orderData, paymentData) {
  const { orderNumber, referenceNumber, totalAmount, releasedAt } = orderData;
  const { title, description, instructions, convenientStores, importantNotes } = paymentData;

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Orden de Compra - ${orderNumber}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 40px;
          background: #ffffff;
          color: #1f2937;
        }

        .header {
          text-align: center;
          border-bottom: 4px solid #f59e0b;
          padding-bottom: 30px;
          margin-bottom: 40px;
        }

        .company-name {
          font-size: 28px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 10px;
        }

        .document-title {
          font-size: 20px;
          color: #f59e0b;
          font-weight: 600;
        }

        .order-info {
          background: #fef3c7;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 30px;
          border-left: 6px solid #f59e0b;
        }

        .order-info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
        }

        .info-label {
          font-size: 12px;
          color: #92400e;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 5px;
        }

        .info-value {
          font-size: 18px;
          font-weight: 700;
          color: #78350f;
        }

        .reference-box {
          background: #ffffff;
          border: 3px dashed #f59e0b;
          border-radius: 15px;
          padding: 30px;
          margin: 30px 0;
          text-align: center;
        }

        .reference-label {
          font-size: 14px;
          color: #92400e;
          margin-bottom: 10px;
        }

        .reference-number {
          font-size: 36px;
          font-weight: 700;
          color: #f59e0b;
          font-family: 'Courier New', monospace;
          letter-spacing: 3px;
          margin: 15px 0;
        }

        .reference-hint {
          font-size: 13px;
          color: #6b7280;
          margin-top: 10px;
        }

        .stores-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin: 20px 0;
        }

        .store-card {
          background: #ffffff;
          border: 2px solid #fed7aa;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          transition: all 0.3s;
        }

        .store-logo {
          max-height: 60px;
          max-width: 150px;
          margin: 0 auto 15px;
        }

        .store-name {
          font-size: 18px;
          font-weight: 600;
          color: #78350f;
        }

        .section {
          margin-bottom: 35px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #fde68a;
        }

        .instructions {
          background: #eff6ff;
          border: 2px solid #3b82f6;
          border-radius: 12px;
          padding: 25px;
        }

        .instructions ol {
          padding-left: 25px;
          margin-top: 15px;
        }

        .instructions li {
          margin-bottom: 12px;
          line-height: 1.6;
          color: #1f2937;
        }

        .notes {
          background: #fef3c7;
          border: 2px solid #f59e0b;
          border-radius: 12px;
          padding: 25px;
        }

        .notes ul {
          list-style: none;
          padding-left: 0;
          margin-top: 15px;
        }

        .notes li {
          margin-bottom: 10px;
          padding-left: 25px;
          position: relative;
          line-height: 1.6;
          color: #92400e;
        }

        .notes li::before {
          content: '⚠';
          position: absolute;
          left: 0;
          font-size: 16px;
        }

        .footer {
          margin-top: 50px;
          padding-top: 20px;
          border-top: 2px solid #fde68a;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }

        @media print {
          body {
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-name">SOCIEDAD TECNOLÓGICA INTEGRAL</div>
        <div class="document-title">${title}</div>
      </div>

      <div class="order-info">
        <div class="order-info-grid">
          <div class="info-item">
            <span class="info-label">Número de Orden</span>
            <span class="info-value">${orderNumber}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Monto Total</span>
            <span class="info-value">${formatCurrency(totalAmount)}</span>
          </div>
          <div class="info-item" style="grid-column: span 2;">
            <span class="info-label">Fecha de Emisión</span>
            <span class="info-value">${formatDate(releasedAt)}</span>
          </div>
        </div>
      </div>

      <div class="reference-box">
        <div class="reference-label">📋 PRESENTA ESTE NÚMERO EN CAJA</div>
        <div class="reference-number">${referenceNumber}</div>
        <div class="reference-hint">Muestra este código al cajero o escanea el código de barras</div>
      </div>

      <div class="section">
        <h2 class="section-title">🏪 ${description}</h2>
        <div class="stores-grid">
          ${(convenientStores || []).map((store) => `
            <div class="store-card">
              ${typeof store === 'object' && store.logo ?
                `<img src="${store.logo}" alt="${store.name}" class="store-logo" />` : ''}
              <div class="store-name">${typeof store === 'object' ? store.name : store}</div>
            </div>
          `).join('')}
        </div>
      </div>

      ${instructions && instructions.length > 0 ? `
        <div class="section">
          <div class="instructions">
            <h2 class="section-title">📝 Instrucciones de Pago</h2>
            <ol>
              ${instructions.map((instruction) => `<li>${instruction}</li>`).join('')}
            </ol>
          </div>
        </div>
      ` : ''}

      ${importantNotes && importantNotes.length > 0 ? `
        <div class="section">
          <div class="notes">
            <h2 class="section-title">⚠️ Notas Importantes</h2>
            <ul>
              ${importantNotes.map((note) => `<li>${note}</li>`).join('')}
            </ul>
          </div>
        </div>
      ` : ''}

      <div class="footer">
        <p><strong>Sociedad Tecnológica Integral</strong></p>
        <p>Recommerce premium certificado</p>
        <p>Para soporte: contacto@cexfreted.com | Tel: 01-800-CEX-239-7246</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Genera HTML para orden de compra de pago telefónico
 */
export function generatePhonePaymentPDF(orderData, paymentData) {
  const { orderNumber, referenceNumber, totalAmount, releasedAt } = orderData;
  const { title, description, contactInfo, acceptedCards, importantNotes } = paymentData;

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Orden de Compra - ${orderNumber}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 40px;
          background: #ffffff;
          color: #1f2937;
        }

        .header {
          text-align: center;
          border-bottom: 4px solid #10b981;
          padding-bottom: 30px;
          margin-bottom: 40px;
        }

        .company-name {
          font-size: 28px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 10px;
        }

        .document-title {
          font-size: 20px;
          color: #10b981;
          font-weight: 600;
        }

        .order-info {
          background: #d1fae5;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 30px;
          border-left: 6px solid #10b981;
        }

        .order-info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
        }

        .info-label {
          font-size: 12px;
          color: #065f46;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 5px;
        }

        .info-value {
          font-size: 18px;
          font-weight: 700;
          color: #064e3b;
        }

        .contact-box {
          background: linear-gradient(135deg, #ecfdf5, #ffffff);
          border: 3px solid #10b981;
          border-radius: 15px;
          padding: 35px;
          margin: 30px 0;
          text-align: center;
        }

        .contact-icon {
          font-size: 48px;
          margin-bottom: 15px;
        }

        .contact-name {
          font-size: 24px;
          font-weight: 700;
          color: #064e3b;
          margin-bottom: 5px;
        }

        .contact-role {
          font-size: 14px;
          color: #059669;
          margin-bottom: 20px;
        }

        .contact-details {
          display: grid;
          gap: 15px;
          margin-top: 20px;
        }

        .contact-item {
          background: #ffffff;
          padding: 15px;
          border-radius: 10px;
          border: 2px solid #a7f3d0;
        }

        .contact-label {
          font-size: 12px;
          color: #065f46;
          margin-bottom: 5px;
        }

        .contact-value {
          font-size: 20px;
          font-weight: 700;
          color: #064e3b;
        }

        .cards-section {
          background: #f3f4f6;
          padding: 20px;
          border-radius: 12px;
          margin: 20px 0;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }

        .card-badge {
          background: #ffffff;
          border: 2px solid #10b981;
          border-radius: 8px;
          padding: 15px 10px;
          text-align: center;
          font-weight: 600;
          color: #064e3b;
        }

        .section {
          margin-bottom: 35px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 2px solid #a7f3d0;
        }

        .notes {
          background: #fef3c7;
          border: 2px solid #f59e0b;
          border-radius: 12px;
          padding: 25px;
        }

        .notes ul {
          list-style: none;
          padding-left: 0;
          margin-top: 15px;
        }

        .notes li {
          margin-bottom: 10px;
          padding-left: 25px;
          position: relative;
          line-height: 1.6;
          color: #92400e;
        }

        .notes li::before {
          content: '✓';
          position: absolute;
          left: 0;
          font-size: 16px;
          color: #10b981;
          font-weight: 700;
        }

        .footer {
          margin-top: 50px;
          padding-top: 20px;
          border-top: 2px solid #a7f3d0;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }

        @media print {
          body {
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-name">SOCIEDAD TECNOLÓGICA INTEGRAL</div>
        <div class="document-title">${title}</div>
      </div>

      <div class="order-info">
        <div class="order-info-grid">
          <div class="info-item">
            <span class="info-label">Número de Orden</span>
            <span class="info-value">${orderNumber}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Referencia de Pago</span>
            <span class="info-value">${referenceNumber}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Monto Total</span>
            <span class="info-value">${formatCurrency(totalAmount)}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Fecha de Emisión</span>
            <span class="info-value">${formatDate(releasedAt)}</span>
          </div>
        </div>
      </div>

      ${contactInfo ? `
        <div class="contact-box">
          <div class="contact-icon">📞</div>
          <div class="contact-name">${contactInfo.contact}</div>
          <div class="contact-role">Ejecutivo de Pagos Telefónicos</div>

          <div class="contact-details">
            ${contactInfo.phone ? `
              <div class="contact-item">
                <div class="contact-label">Teléfono Directo</div>
                <div class="contact-value">${contactInfo.phone}</div>
              </div>
            ` : ''}

            ${contactInfo.whatsapp ? `
              <div class="contact-item">
                <div class="contact-label">WhatsApp</div>
                <div class="contact-value">${contactInfo.whatsapp}</div>
              </div>
            ` : ''}

            ${contactInfo.schedule ? `
              <div class="contact-item">
                <div class="contact-label">Horario de Atención</div>
                <div class="contact-value" style="font-size: 16px;">${contactInfo.schedule}</div>
              </div>
            ` : ''}
          </div>
        </div>
      ` : ''}

      ${acceptedCards && acceptedCards.length > 0 ? `
        <div class="cards-section">
          <h3 class="section-title">💳 Tarjetas Aceptadas</h3>
          <div class="cards-grid">
            ${acceptedCards.map((card) => `<div class="card-badge">${card}</div>`).join('')}
          </div>
        </div>
      ` : ''}

      ${importantNotes && importantNotes.length > 0 ? `
        <div class="section">
          <div class="notes">
            <h2 class="section-title">✓ Ventajas del Pago Telefónico</h2>
            <ul>
              ${importantNotes.map((note) => `<li>${note}</li>`).join('')}
            </ul>
          </div>
        </div>
      ` : ''}

      <div class="footer">
        <p><strong>Sociedad Tecnológica Integral</strong></p>
        <p>Recommerce premium certificado</p>
        <p>Para soporte: contacto@cexfreted.com | Tel: 01-800-CEX-239-7246</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Función principal que genera el PDF según el método de pago
 */
export function generateOrderPDF(orderData, paymentMethod) {
  const { paymentData } = orderData;

  switch (paymentMethod) {
    case 'BANK_TRANSFER':
    case 'CASH_DEPOSIT':
      return generateBankTransferPDF(orderData, paymentData);

    case 'CONVENIENCE_STORE':
      return generateConvenienceStorePDF(orderData, paymentData);

    case 'PHONE_PAYMENT':
      return generatePhonePaymentPDF(orderData, paymentData);

    case 'STORE_PAYMENT':
      // Similar a banco pero con direcciones de tiendas
      return generateBankTransferPDF(orderData, paymentData);

    default:
      return generateBankTransferPDF(orderData, paymentData);
  }
}

/**
 * Abre el PDF en una nueva ventana para impresión/descarga
 */
export function printOrderPDF(htmlContent, orderNumber) {
  const printWindow = window.open('', '_blank');

  if (!printWindow) {
    alert('Por favor, permite ventanas emergentes para descargar el PDF');
    return;
  }

  printWindow.document.write(htmlContent);
  printWindow.document.close();

  // Esperar a que cargue completamente antes de imprimir
  printWindow.onload = () => {
    printWindow.print();
  };
}

/**
 * Descarga el PDF como archivo
 */
export function downloadOrderPDF(htmlContent, orderNumber) {
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `orden-compra-${orderNumber}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
