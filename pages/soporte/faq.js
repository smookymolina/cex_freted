import React, { useState, useEffect } from 'react';
import { ChevronDown, Search, HelpCircle, ShoppingCart, Package, CreditCard, Shield } from 'lucide-react';
import styles from '../../styles/components/common.module.css';

// Hook personalizado para detectar el tamaño de pantalla de forma segura
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Solo se ejecuta en el cliente
    if (typeof window === 'undefined') return;

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 480);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

const FAQ_CATEGORIES = [
  {
    id: 'general',
    title: 'General',
    icon: HelpCircle,
    questions: [
      {
        question: '¿Qué es CEX Freted?',
        answer: 'CEX Freted es una plataforma de recommerce premium que ofrece tecnología reacondicionada certificada con garantía de 12 meses. Compramos, certificamos y vendemos dispositivos electrónicos de alta calidad con un control de 30 puntos.'
      },
      {
        question: '¿Qué significa "recommerce"?',
        answer: 'Recommerce es el comercio de productos reacondicionados o de segunda mano. Nos especializamos en dar una segunda vida a dispositivos tecnológicos mediante certificación profesional y garantía extendida.'
      },
      {
        question: '¿Todos los productos están certificados?',
        answer: 'Sí, absolutamente. Todos nuestros productos pasan por un riguroso proceso de certificación de 30 puntos que incluye pruebas de hardware, software, batería, pantalla y funcionalidad completa.'
      }
    ]
  },
  {
    id: 'compras',
    title: 'Compras',
    icon: ShoppingCart,
    questions: [
      {
        question: '¿Qué significan los grades A+, A y B?',
        answer: 'Grade A+: Excelente estado cosmético, como nuevo. Grade A: Muy buen estado, puede tener micro-rayones imperceptibles. Grade B: Buen estado, puede tener señales de uso menores. Todos funcionan perfectamente.'
      },
      {
        question: '¿Puedo comprar sin registrarme?',
        answer: 'Sí, puedes agregar productos al carrito y navegar sin crear una cuenta. Solo necesitas registrarte al momento de finalizar la compra para procesar el envío y la facturación.'
      },
      {
        question: '¿Cómo funciona el envío gratis?',
        answer: 'Ofrecemos envío gratis en compras superiores a $2,000 MXN. Para compras menores, el costo de envío es de $150 MXN. El tiempo de entrega es de 3-5 días hábiles.'
      },
      {
        question: '¿Qué métodos de pago aceptan?',
        answer: 'Aceptamos tarjetas de crédito y débito (Visa, MasterCard, American Express), transferencias bancarias, PayPal y pago en efectivo a través de OXXO y 7-Eleven.'
      }
    ]
  },
  {
    id: 'garantia',
    title: 'Garantía y Devoluciones',
    icon: Shield,
    questions: [
      {
        question: '¿Cuál es el período de garantía?',
        answer: 'Todos nuestros productos incluyen garantía premium de 12 meses que cubre defectos de fabricación y fallas técnicas. La garantía comienza desde el día de recepción del producto.'
      },
      {
        question: '¿Puedo devolver un producto?',
        answer: 'Sí, tienes 30 días para devolver cualquier producto si no estás satisfecho. El producto debe estar en las mismas condiciones en que lo recibiste. El reembolso se procesa en 5-7 días hábiles.'
      },
      {
        question: '¿Qué cubre la garantía?',
        answer: 'La garantía cubre fallas de hardware, problemas de software, batería defectuosa, pantalla con defectos de fábrica y cualquier mal funcionamiento no causado por daño físico o uso indebido.'
      },
      {
        question: '¿Cómo hago válida la garantía?',
        answer: 'Contacta nuestro soporte técnico al +34 900 000 111 o envía un email con tu número de orden. Evaluamos el caso y, si aplica, realizamos la reparación o reemplazo sin costo.'
      }
    ]
  },
  {
    id: 'venta',
    title: 'Vender Dispositivos',
    icon: Package,
    questions: [
      {
        question: '¿Cómo puedo vender mi dispositivo?',
        answer: 'Usa nuestra herramienta "Cotizar dispositivo" en el menú principal. Selecciona tu dispositivo, responde algunas preguntas sobre su estado y recibe una oferta instantánea. Si aceptas, te enviamos una guía de envío prepagada.'
      },
      {
        question: '¿Qué dispositivos aceptan?',
        answer: 'Aceptamos smartphones, tablets, laptops, smartwatches, consolas de videojuegos y accesorios premium de marcas como Apple, Samsung, Huawei, Xiaomi, Dell, HP, Lenovo, Sony y más.'
      },
      {
        question: '¿Cuánto tiempo tarda el pago?',
        answer: 'Una vez que recibimos y verificamos tu dispositivo (1-2 días hábiles), procesamos el pago inmediatamente. Recibirás tu dinero por transferencia bancaria o PayPal en 24-48 horas.'
      },
      {
        question: '¿Qué pasa si mi dispositivo no coincide con la descripción?',
        answer: 'Si el estado del dispositivo no corresponde con lo declarado, te contactamos con una nueva oferta ajustada. Puedes aceptarla o solicitar la devolución de tu dispositivo sin costo.'
      }
    ]
  },
  {
    id: 'pago',
    title: 'Pagos y Facturación',
    icon: CreditCard,
    questions: [
      {
        question: '¿Emiten factura?',
        answer: 'Sí, emitimos facturas electrónicas (CFDI) para todas las compras. Solo solicítala al momento de finalizar tu compra proporcionando tus datos fiscales.'
      },
      {
        question: '¿Es seguro comprar en CEX Freted?',
        answer: 'Absolutamente. Utilizamos encriptación SSL de 256 bits, procesadores de pago certificados PCI DSS y nunca almacenamos información de tarjetas en nuestros servidores.'
      },
      {
        question: '¿Puedo pagar en meses sin intereses?',
        answer: 'Sí, ofrecemos planes de 3, 6 y 12 meses sin intereses con tarjetas participantes de bancos seleccionados. Las opciones se muestran al momento del checkout.'
      }
    ]
  }
];

function FAQItem({ question, answer, isOpen, onToggle, isMobile }) {
  return (
    <div style={{
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      background: 'var(--color-surface)',
      boxShadow: isOpen ? 'var(--shadow-md)' : 'none',
      transition: 'all var(--transition-base)'
    }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          padding: isMobile ? '16px 16px' : '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          textAlign: 'left',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          transition: 'background var(--transition-base)',
          fontFamily: 'inherit'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-primary-light)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        <span style={{
          fontWeight: 600,
          color: 'var(--color-contrast)',
          paddingRight: isMobile ? '16px' : '32px',
          fontSize: isMobile ? '0.875rem' : '0.95rem',
          lineHeight: '1.4'
        }}>
          {question}
        </span>
        <ChevronDown
          style={{
            width: isMobile ? '18px' : '20px',
            height: isMobile ? '18px' : '20px',
            color: 'var(--color-primary)',
            flexShrink: 0,
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform var(--transition-base)'
          }}
        />
      </button>
      <div style={{
        maxHeight: isOpen ? '600px' : '0',
        overflow: 'hidden',
        transition: 'max-height var(--transition-slow)'
      }}>
        <div style={{
          padding: isMobile ? '0 16px 16px 16px' : '0 24px 24px 24px',
          color: 'var(--color-muted)',
          fontSize: isMobile ? '0.875rem' : '0.95rem',
          lineHeight: '1.6'
        }}>
          {answer}
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [openItems, setOpenItems] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const isMobile = useIsMobile();

  const toggleItem = (categoryId, index) => {
    const key = `${categoryId}-${index}`;
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const filteredCategories = FAQ_CATEGORIES.map(category => {
    const filteredQuestions = category.questions.filter(q =>
      (selectedCategory === 'all' || selectedCategory === category.id) &&
      (searchQuery === '' ||
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    return { ...category, questions: filteredQuestions };
  }).filter(category => category.questions.length > 0);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageInner}>
        <div className={styles.pageHeader}>
          <div className={styles.iconWrapper}>
            <HelpCircle />
          </div>
          <h1 className={styles.pageTitle}>Preguntas Frecuentes</h1>
          <p className={styles.pageSubtitle}>
            Encuentra respuestas rápidas a las preguntas más comunes sobre CEX Freted
          </p>
        </div>

        {/* Búsqueda */}
        <div style={{
          marginBottom: isMobile ? '32px' : '48px',
          maxWidth: '640px',
          margin: isMobile ? '0 0 32px' : '0 auto 48px',
          padding: isMobile ? '0 8px' : '0'
        }}>
          <div style={{ position: 'relative' }}>
            <Search style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: isMobile ? '18px' : '20px',
              height: isMobile ? '18px' : '20px',
              color: 'var(--color-muted)'
            }} />
            <input
              type="text"
              placeholder={isMobile ? "Buscar..." : "Buscar preguntas..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.input}
              style={{
                paddingLeft: isMobile ? '44px' : '48px',
                borderRadius: 'var(--radius-full)',
                fontSize: isMobile ? '0.875rem' : '0.95rem'
              }}
            />
          </div>
        </div>

        {/* Categorías */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: isMobile ? '8px' : '12px',
          justifyContent: 'center',
          marginBottom: isMobile ? '32px' : '48px',
          padding: isMobile ? '0 8px' : '0'
        }}>
          <button
            onClick={() => setSelectedCategory('all')}
            className={selectedCategory === 'all' ? styles.btnPrimary : styles.btnOutline}
            style={{
              fontSize: isMobile ? '0.75rem' : '0.85rem',
              padding: isMobile ? '8px 16px' : '10px 20px'
            }}
          >
            Todas
          </button>
          {FAQ_CATEGORIES.map(category => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? styles.btnPrimary : styles.btnOutline}
                style={{
                  fontSize: isMobile ? '0.75rem' : '0.85rem',
                  padding: isMobile ? '8px 16px' : '10px 20px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: isMobile ? '6px' : '8px'
                }}
              >
                {!isMobile && <Icon style={{ width: '16px', height: '16px' }} />}
                {category.title}
              </button>
            );
          })}
        </div>

        {/* Preguntas */}
        {filteredCategories.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: isMobile ? '32px 16px' : '48px 0'
          }}>
            <p style={{
              color: 'var(--color-muted)',
              fontSize: isMobile ? '1rem' : '1.125rem'
            }}>
              No se encontraron preguntas que coincidan con tu búsqueda.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? '32px' : '48px',
            padding: isMobile ? '0 8px' : '0'
          }}>
            {filteredCategories.map(category => (
              <div key={category.id}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: isMobile ? '8px' : '12px',
                  marginBottom: isMobile ? '16px' : '20px'
                }}>
                  {React.createElement(category.icon, {
                    style: {
                      width: isMobile ? '20px' : '24px',
                      height: isMobile ? '20px' : '24px',
                      color: 'var(--color-primary)'
                    }
                  })}
                  <h2 style={{
                    fontSize: isMobile ? '1.5rem' : '1.75rem',
                    fontWeight: 700,
                    color: 'var(--color-contrast)',
                    margin: 0,
                    lineHeight: '1.3'
                  }}>
                    {category.title}
                  </h2>
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: isMobile ? '8px' : '12px'
                }}>
                  {category.questions.map((item, index) => (
                    <FAQItem
                      key={index}
                      question={item.question}
                      answer={item.answer}
                      isOpen={openItems[`${category.id}-${index}`]}
                      onToggle={() => toggleItem(category.id, index)}
                      isMobile={isMobile}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA de contacto */}
        <div style={{
          marginTop: isMobile ? '48px' : '64px',
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
          borderRadius: 'var(--radius-lg)',
          padding: isMobile ? '32px 20px' : '48px 32px',
          textAlign: 'center',
          color: 'var(--color-surface)',
          boxShadow: 'var(--shadow-xl)'
        }}>
          <h3 style={{
            fontSize: isMobile ? '1.5rem' : '1.75rem',
            fontWeight: 700,
            marginBottom: isMobile ? '6px' : '8px',
            lineHeight: '1.3'
          }}>
            ¿No encontraste lo que buscabas?
          </h3>
          <p style={{
            opacity: 0.9,
            marginBottom: isMobile ? '20px' : '24px',
            fontSize: isMobile ? '0.9rem' : '1rem',
            padding: isMobile ? '0 8px' : '0'
          }}>
            Nuestro equipo de soporte está disponible 24/7 para ayudarte
          </p>
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            flexWrap: 'wrap',
            gap: isMobile ? '12px' : '16px',
            justifyContent: 'center',
            padding: isMobile ? '0 8px' : '0'
          }}>
            <a
              href="/soporte/chat"
              style={{
                display: 'inline-block',
                padding: isMobile ? '12px 24px' : '14px 28px',
                background: 'var(--color-surface)',
                color: 'var(--color-primary)',
                fontWeight: 600,
                borderRadius: 'var(--radius-full)',
                textDecoration: 'none',
                transition: 'transform var(--transition-base)',
                fontSize: isMobile ? '0.9rem' : '1rem'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Chat en Vivo
            </a>
            <a
              href="tel:+34900000111"
              style={{
                display: 'inline-block',
                padding: isMobile ? '12px 24px' : '14px 28px',
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'var(--color-surface)',
                fontWeight: 600,
                borderRadius: 'var(--radius-full)',
                textDecoration: 'none',
                transition: 'transform var(--transition-base)',
                backdropFilter: 'blur(10px)',
                fontSize: isMobile ? '0.9rem' : '1rem'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {isMobile ? 'Llamar ahora' : 'Llamar: +34 900 000 111'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
