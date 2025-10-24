import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageCircle, Clock, CheckCircle2 } from 'lucide-react';
import styles from '../../styles/components/common.module.css';

const QUICK_RESPONSES = [
  '¿Cuál es el estado de mi pedido?',
  '¿Cómo funciona la garantía?',
  '¿Qué grades de productos tienen?',
  'Quiero vender mi dispositivo',
  'Necesito soporte técnico'
];

const BOT_RESPONSES = {
  'estado': {
    message: 'Para consultar el estado de tu pedido, necesito tu número de orden. ¿Puedes proporcionarlo?',
    delay: 1000
  },
  'garantia': {
    message: 'Nuestra garantía premium de 12 meses cubre defectos de fabricación y fallas técnicas. Puedes hacer válida la garantía contactándonos por teléfono al +34 900 000 111 o desde tu cuenta en la sección "Mis Pedidos".',
    delay: 1500
  },
  'grades': {
    message: 'Trabajamos con 3 grades:\n\n• Grade A+: Como nuevo, excelente estado cosmético\n• Grade A: Muy buen estado, micro-rayones imperceptibles\n• Grade B: Buen estado, señales de uso menores\n\nTodos funcionan al 100% y tienen la misma garantía.',
    delay: 1800
  },
  'vender': {
    message: 'Genial! Para vender tu dispositivo:\n\n1. Ve a "Tasar dispositivo" en el menú\n2. Selecciona tu dispositivo\n3. Describe su estado\n4. Recibe una oferta instantánea\n5. Si aceptas, te enviamos guía de envío prepagada\n\nEl pago lo recibes en 24-48 horas después de verificar el dispositivo.',
    delay: 2000
  },
  'soporte': {
    message: 'Estoy conectándote con un agente de soporte técnico. Por favor espera un momento...',
    delay: 1200,
    escalate: true
  },
  'default': {
    message: 'Entiendo tu consulta. ¿Puedes darme más detalles para ayudarte mejor? También puedo conectarte con un agente humano si prefieres.',
    delay: 1000
  }
};

function ChatMessage({ message, isBot, timestamp }) {
  return (
    <div style={{
      display: 'flex',
      gap: '12px',
      flexDirection: isBot ? 'row' : 'row-reverse'
    }}>
      {/* Avatar */}
      <div style={{
        flexShrink: 0,
        width: '40px',
        height: '40px',
        borderRadius: 'var(--radius-full)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isBot ? 'var(--color-primary-light)' : 'var(--gray-200)'
      }}>
        {isBot ? (
          <Bot style={{ width: '20px', height: '20px', color: 'var(--color-primary)' }} />
        ) : (
          <User style={{ width: '20px', height: '20px', color: 'var(--gray-600)' }} />
        )}
      </div>

      {/* Message bubble */}
      <div style={{
        flex: 1,
        maxWidth: '70%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: isBot ? 'flex-start' : 'flex-end'
      }}>
        <div style={{
          padding: '12px 16px',
          borderRadius: 'var(--radius-lg)',
          background: isBot ? 'var(--color-surface)' : 'var(--color-primary)',
          color: isBot ? 'var(--gray-800)' : 'var(--color-surface)',
          border: isBot ? '1px solid var(--color-border)' : 'none',
          boxShadow: 'var(--shadow-md)'
        }}>
          <p style={{
            whiteSpace: 'pre-line',
            fontSize: '0.9rem',
            lineHeight: '1.5',
            margin: 0
          }}>
            {message}
          </p>
        </div>
        <span style={{
          fontSize: '0.75rem',
          color: 'var(--color-muted)',
          marginTop: '4px',
          padding: '0 8px'
        }}>
          {timestamp}
        </span>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: '¡Hola! Soy el asistente virtual de CEX Freted. ¿En qué puedo ayudarte hoy?',
      isBot: true,
      timestamp: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [agentConnected, setAgentConnected] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const detectIntent = (message) => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('pedido') || lowerMessage.includes('orden') || lowerMessage.includes('estado')) {
      return 'estado';
    }
    if (lowerMessage.includes('garantia') || lowerMessage.includes('garantía')) {
      return 'garantia';
    }
    if (lowerMessage.includes('grade') || lowerMessage.includes('estado') || lowerMessage.includes('calidad')) {
      return 'grades';
    }
    if (lowerMessage.includes('vender') || lowerMessage.includes('tasar')) {
      return 'vender';
    }
    if (lowerMessage.includes('soporte') || lowerMessage.includes('técnico') || lowerMessage.includes('tecnico') || lowerMessage.includes('agente') || lowerMessage.includes('humano')) {
      return 'soporte';
    }
    return 'default';
  };

  const handleSendMessage = (messageText = null) => {
    const text = messageText || inputMessage.trim();
    if (!text) return;

    const userMessage = {
      id: Date.now(),
      text,
      isBot: false,
      timestamp: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    const intent = detectIntent(text);
    const response = BOT_RESPONSES[intent];

    setTimeout(() => {
      setIsTyping(false);

      const botMessage = {
        id: Date.now() + 1,
        text: response.message,
        isBot: true,
        timestamp: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);

      if (response.escalate) {
        setTimeout(() => {
          setAgentConnected(true);
          const agentMessage = {
            id: Date.now() + 2,
            text: '👋 Hola! Soy María del equipo de soporte técnico. Ya revisé tu consulta, ¿cómo puedo ayudarte específicamente?',
            isBot: true,
            timestamp: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, agentMessage]);
        }, 2000);
      }
    }, response.delay);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageInner}>
        {/* Header */}
        <div className={styles.pageHeader}>
          <div className={styles.iconWrapper}>
            <MessageCircle />
          </div>
          <h1 className={styles.pageTitle}>Chat de Soporte 24/7</h1>
          <p className={styles.pageSubtitle}>
            Asistencia inmediata para todas tus consultas
          </p>
        </div>

        {/* Estado de conexión */}
        <div style={{
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontSize: '0.85rem'
        }}>
          {agentConnected ? (
            <>
              <div style={{
                width: '8px',
                height: '8px',
                background: 'var(--color-success)',
                borderRadius: '50%',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
              }}></div>
              <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>
                Conectado con agente en vivo
              </span>
            </>
          ) : (
            <>
              <div style={{
                width: '8px',
                height: '8px',
                background: 'var(--color-primary)',
                borderRadius: '50%',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
              }}></div>
              <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                Asistente virtual disponible
              </span>
            </>
          )}
        </div>

        {/* Chat Container */}
        <div style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden',
          border: '1px solid var(--color-border)'
        }}>
          {/* Chat Header */}
          <div style={{
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
            padding: '20px 24px',
            color: 'var(--color-surface)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <h2 style={{
                  fontWeight: 600,
                  fontSize: '1.125rem',
                  margin: 0,
                  marginBottom: '4px'
                }}>
                  {agentConnected ? 'María - Soporte Técnico' : 'Asistente Virtual CEX'}
                </h2>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.85rem',
                  opacity: 0.9
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    background: '#4ade80',
                    borderRadius: '50%'
                  }}></div>
                  <span>En línea</span>
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.85rem',
                opacity: 0.9
              }}>
                <Clock style={{ width: '16px', height: '16px' }} />
                <span>24/7</span>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div style={{
            height: '500px',
            overflowY: 'auto',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            background: 'var(--color-background)'
          }}>
            {messages.map(msg => (
              <ChatMessage
                key={msg.id}
                message={msg.text}
                isBot={msg.isBot}
                timestamp={msg.timestamp}
              />
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{
                  flexShrink: 0,
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--color-primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Bot style={{ width: '20px', height: '20px', color: 'var(--color-primary)' }} />
                </div>
                <div style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-md)'
                }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      background: 'var(--gray-600)',
                      borderRadius: '50%',
                      animation: 'bounce 1.4s infinite ease-in-out both',
                      animationDelay: '0ms'
                    }}></div>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      background: 'var(--gray-600)',
                      borderRadius: '50%',
                      animation: 'bounce 1.4s infinite ease-in-out both',
                      animationDelay: '150ms'
                    }}></div>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      background: 'var(--gray-600)',
                      borderRadius: '50%',
                      animation: 'bounce 1.4s infinite ease-in-out both',
                      animationDelay: '300ms'
                    }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Responses */}
          {messages.length <= 1 && (
            <div style={{
              padding: '16px 24px',
              background: 'var(--color-surface)',
              borderTop: '1px solid var(--color-border)'
            }}>
              <p style={{
                fontSize: '0.75rem',
                color: 'var(--color-muted)',
                marginBottom: '8px',
                fontWeight: 600
              }}>
                Respuestas rápidas:
              </p>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                {QUICK_RESPONSES.map((response, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(response)}
                    style={{
                      padding: '8px 14px',
                      background: 'var(--gray-100)',
                      color: 'var(--gray-700)',
                      fontSize: '0.85rem',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid var(--color-border)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-base)',
                      fontFamily: 'inherit'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--gray-200)';
                      e.currentTarget.style.borderColor = 'var(--color-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--gray-100)';
                      e.currentTarget.style.borderColor = 'var(--color-border)';
                    }}
                  >
                    {response}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div style={{
            padding: '16px 24px',
            background: 'var(--color-surface)',
            borderTop: '1px solid var(--color-border)'
          }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje..."
                className={styles.input}
                style={{ margin: 0 }}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim()}
                className={styles.btnPrimary}
                style={{
                  padding: '14px 24px',
                  opacity: !inputMessage.trim() ? 0.5 : 1,
                  cursor: !inputMessage.trim() ? 'not-allowed' : 'pointer'
                }}
              >
                <Send style={{ width: '20px', height: '20px' }} />
                <span style={{ display: 'none' }}>Enviar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className={styles.grid3} style={{ marginTop: '48px' }}>
          <div className={styles.card} style={{ textAlign: 'center' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              background: 'rgba(16, 185, 129, 0.1)',
              borderRadius: 'var(--radius-full)',
              marginBottom: '12px'
            }}>
              <CheckCircle2 style={{ width: '24px', height: '24px', color: 'var(--color-success)' }} />
            </div>
            <h3 className={styles.cardHeader}>Respuesta Inmediata</h3>
            <p className={styles.cardContent}>Asistente disponible 24/7</p>
          </div>
          <div className={styles.card} style={{ textAlign: 'center' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              background: 'var(--color-primary-light)',
              borderRadius: 'var(--radius-full)',
              marginBottom: '12px'
            }}>
              <User style={{ width: '24px', height: '24px', color: 'var(--color-primary)' }} />
            </div>
            <h3 className={styles.cardHeader}>Agentes Humanos</h3>
            <p className={styles.cardContent}>Escalado cuando lo necesites</p>
          </div>
          <div className={styles.card} style={{ textAlign: 'center' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              background: 'rgba(139, 92, 246, 0.1)',
              borderRadius: 'var(--radius-full)',
              marginBottom: '12px'
            }}>
              <MessageCircle style={{ width: '24px', height: '24px', color: '#8b5cf6' }} />
            </div>
            <h3 className={styles.cardHeader}>Historial Guardado</h3>
            <p className={styles.cardContent}>Accede a tus conversaciones</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
