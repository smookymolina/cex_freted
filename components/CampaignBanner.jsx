import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BUEN_FIN_PROMO,
  isBuenFinActive,
} from '../config/promotions';
import { formatPrice } from '../utils/formatters';

export default function CampaignBanner() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if the campaign is active and the user hasn't dismissed the banner
    const campaignActive = isBuenFinActive();
    if (campaignActive && !sessionStorage.getItem('campaignBannerDismissed')) {
      setVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    // Use sessionStorage to remember dismissal for the current session
    sessionStorage.setItem('campaignBannerDismissed', 'true');
  };

  if (!visible || dismissed) {
    return null;
  }

  return (
    <div className="buen-fin-banner">
      <div className="buen-fin-banner-content">
        <div className="buen-fin-banner-left">
          <div className="buen-fin-badge-wrapper">
            <span className="buen-fin-badge">
              <svg className="buen-fin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {BUEN_FIN_PROMO.badge}
            </span>
          </div>
          <div className="buen-fin-message">
            <p className="buen-fin-savings">{`Ahorra $${formatPrice(
              BUEN_FIN_PROMO.extraDiscountAmount
            )} MXN extra en todo el catalogo`}</p>
            <p className="buen-fin-deadline">
              <svg className="buen-fin-clock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {BUEN_FIN_PROMO.messaging.heroDeadlineLabel}
            </p>
          </div>
        </div>
        <div className="buen-fin-banner-right">
          <Link href="/comprar" legacyBehavior>
            <a className="buen-fin-cta-button">
              Ver ofertas
              <svg className="buen-fin-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </Link>
          <button
            onClick={handleDismiss}
            className="buen-fin-close-button"
            aria-label="Cerrar"
          >
            <svg className="buen-fin-close-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <style jsx>{`
        .buen-fin-banner {
          background: linear-gradient(135deg, #dc2626 0%, #991b1b 50%, #7f1d1d 100%);
          position: relative;
          overflow: hidden;
          padding: 1rem 1.5rem;
          width: 100%;
          z-index: 50;
          box-shadow: 0 4px 20px rgba(220, 38, 38, 0.3);
        }

        .buen-fin-banner::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
          animation: pulse 4s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1) translateY(0); opacity: 0.5; }
          50% { transform: scale(1.1) translateY(-10px); opacity: 0.8; }
        }

        .buen-fin-banner-content {
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          z-index: 1;
        }

        .buen-fin-banner-left {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
        }

        .buen-fin-badge-wrapper {
          animation: bounce 2s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        .buen-fin-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          color: #7f1d1d;
          font-size: 1.125rem;
          font-weight: 900;
          padding: 0.5rem 1rem;
          border-radius: 999px;
          box-shadow: 0 4px 12px rgba(251, 191, 36, 0.4);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        .buen-fin-icon {
          width: 1.5rem;
          height: 1.5rem;
          animation: rotate 3s linear infinite;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .buen-fin-message {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .buen-fin-savings {
          color: #ffffff;
          font-size: 1rem;
          font-weight: 700;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .buen-fin-deadline {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          color: #fef3c7;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .buen-fin-clock-icon {
          width: 1rem;
          height: 1rem;
          animation: tick 1s ease-in-out infinite;
        }

        @keyframes tick {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }

        .buen-fin-banner-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .buen-fin-cta-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #ffffff;
          color: #dc2626;
          font-size: 1rem;
          font-weight: 700;
          padding: 0.75rem 1.5rem;
          border-radius: 999px;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          white-space: nowrap;
        }

        .buen-fin-cta-button:hover {
          background: #fef3c7;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }

        .buen-fin-arrow {
          width: 1.25rem;
          height: 1.25rem;
          transition: transform 0.3s ease;
        }

        .buen-fin-cta-button:hover .buen-fin-arrow {
          transform: translateX(4px);
        }

        .buen-fin-close-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.2);
          color: #ffffff;
          border: none;
          border-radius: 50%;
          width: 2rem;
          height: 2rem;
          cursor: pointer;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .buen-fin-close-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }

        .buen-fin-close-icon {
          width: 1.25rem;
          height: 1.25rem;
        }

        @media (max-width: 768px) {
          .buen-fin-banner {
            padding: 0.875rem 1rem;
          }

          .buen-fin-message {
            display: none;
          }

          .buen-fin-badge {
            font-size: 0.875rem;
            padding: 0.375rem 0.75rem;
          }

          .buen-fin-icon {
            width: 1.125rem;
            height: 1.125rem;
          }

          .buen-fin-cta-button {
            font-size: 0.875rem;
            padding: 0.625rem 1rem;
          }
        }

        @media (max-width: 480px) {
          .buen-fin-cta-button span {
            display: none;
          }

          .buen-fin-cta-button {
            padding: 0.625rem;
          }
        }
      `}</style>
    </div>
  );
}
