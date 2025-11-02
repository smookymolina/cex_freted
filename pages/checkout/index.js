import React from 'react';
import Link from 'next/link';
import { getSession } from 'next-auth/react';
import { ArrowLeft } from 'lucide-react';
import CheckoutStepper from '../../components/checkout/CheckoutStepper';

const CheckoutPage = () => {
  return (
    <div className="checkout-page">
      <div className="page-inner">
        <nav className="breadcrumb">
          <Link href="/comprar" className="breadcrumb__link">
            <ArrowLeft size={16} aria-hidden="true" />
            Seguir comprando
          </Link>
        </nav>

        <CheckoutStepper />
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