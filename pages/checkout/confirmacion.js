import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import ConfirmationStep from '../../components/checkout/steps/ConfirmationStep';

const ConfirmacionPage = () => {
  const router = useRouter();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Intentar obtener datos de sessionStorage
    if (typeof window !== 'undefined') {
      try {
        const storedData = sessionStorage.getItem('orderConfirmation');
        if (storedData) {
          const data = JSON.parse(storedData);
          setOrderData(data);
          // Limpiar sessionStorage después de obtener los datos
          sessionStorage.removeItem('orderConfirmation');
        } else {
          // Si no hay datos, redirigir al checkout
          router.push('/checkout');
        }
      } catch (error) {
        console.error('Error al recuperar datos de confirmación:', error);
        router.push('/checkout');
      } finally {
        setLoading(false);
      }
    }
  }, [router]);

  if (loading) {
    return (
      <div className="confirmation-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando confirmación...</p>
        </div>
        <style jsx>{`
          .confirmation-page {
            background: #f5f7fb;
            min-height: 100vh;
            padding: 48px 16px 64px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .loading-container {
            text-align: center;
          }
          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #e5e7eb;
            border-top-color: #2563eb;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 16px;
          }
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
          .loading-container p {
            color: #64748b;
            font-size: 0.95rem;
          }
        `}</style>
      </div>
    );
  }

  if (!orderData) {
    return null;
  }

  return (
    <div className="confirmation-page">
      <div className="page-inner">
        <ConfirmationStep
          orderInfo={orderData.orderInfo}
          customerData={orderData.customerData}
          shippingData={orderData.shippingData}
          selectedPaymentMethod={orderData.selectedPaymentMethod}
        />
      </div>

      <style jsx>{`
        .confirmation-page {
          background: #f5f7fb;
          min-height: 100vh;
          padding: 48px 16px 64px;
        }

        .page-inner {
          max-width: 1080px;
          margin: 0 auto;
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

export default ConfirmacionPage;
