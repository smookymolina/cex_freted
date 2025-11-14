import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageCircle, Clock, CheckCircle2 } from 'lucide-react';
import styles from '../../styles/components/common.module.css';
import chatStyles from '../../styles/pages/chat.module.css';

const classNames = (...classes) => classes.filter(Boolean).join(' ');

const QUICK_RESPONSES = [
  '¿Cuál es el estado de mi pedido?',
  '¿Cómo funciona la garantía?',
  '¿Qué grades de productos tienen?',
  'Quiero vender mi dispositivo',
  'Necesito soporte técnico',
];

const BOT_RESPONSES = {
  estado: {
    message:
      'Para consultar el estado de tu pedido, necesito tu número de orden. ¿Puedes proporcionarlo?',
    delay: 1000,
  },
  garantia: {
    message:
      'Nuestra garantía premium de 12 meses cubre defectos de fabricación y fallas técnicas. Puedes hacerla válida contactándonos por teléfono al +34 900 000 111 o desde tu cuenta en la sección "Mis pedidos".',
    delay: 1500,
  },
  grades: {
    message:
      `Trabajamos con 3 grades:

- Grade A+: Como nuevo, excelente estado cosmético
- Grade A: Muy buen estado, micro rayones imperceptibles
- Grade B: Buen estado, señales de uso menores

Todos funcionan al 100% y tienen la misma garantía.`,
    delay: 1800,
  },
  vender: {
    message:
      `¡Genial! Para vender tu dispositivo:

1. Ve a "Cotizar dispositivo" en el menú
2. Selecciona tu dispositivo
3. Describe su estado
4. Recibe una oferta instantánea
5. Si aceptas, te enviamos guía de envío prepagada

El pago lo recibes en 24-48 horas después de verificar el dispositivo.`,
    delay: 2000,
  },
  soporte: {
    message:
      'Estoy conectándote con un agente de soporte técnico. Por favor espera un momento...',
    delay: 1200,
    escalate: true,
  },
  default: {
    message:
      'Entiendo tu consulta. ¿Puedes darme más detalles para ayudarte mejor? También puedo conectarte con un agente humano si prefieres.',
    delay: 1000,
  },
};

const normalizeText = (value) => value.normalize('NFD').replace(/[̀-ͯ]/g, '');

function ChatMessage({ message, isBot, timestamp }) {
  const messageClassName = classNames(
    chatStyles.chatMessage,
    !isBot && chatStyles.chatMessageUser
  );
  const avatarClassName = classNames(
    chatStyles.avatar,
    isBot ? chatStyles.avatarBot : chatStyles.avatarUser
  );
  const bodyClassName = classNames(
    chatStyles.messageBody,
    isBot ? chatStyles.messageBodyBot : chatStyles.messageBodyUser
  );
  const bubbleClassName = classNames(
    chatStyles.messageBubble,
    isBot ? chatStyles.messageBubbleBot : chatStyles.messageBubbleUser
  );

  return (
    <div className={messageClassName}>
      <div className={avatarClassName}>
        {isBot ? (
          <Bot className={chatStyles.iconSmall} aria-hidden="true" />
        ) : (
          <User className={chatStyles.iconSmall} aria-hidden="true" />
        )}
      </div>
      <div className={bodyClassName}>
        <div className={bubbleClassName}>
          <p className={chatStyles.messageText}>{message}</p>
        </div>
        <span className={chatStyles.timestamp}>{timestamp}</span>
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
      timestamp: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [agentConnected, setAgentConnected] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const detectIntent = (message) => {
    const normalized = normalizeText(message.toLowerCase());
    if (normalized.includes('pedido') || normalized.includes('orden') || normalized.includes('estado')) {
      return 'estado';
    }
    if (normalized.includes('garantia')) {
      return 'garantia';
    }
    if (normalized.includes('grade') || normalized.includes('calidad')) {
      return 'grades';
    }
    if (normalized.includes('vender') || normalized.includes('cotizar') || normalized.includes('cotizacion')) {
      return 'vender';
    }
    if (normalized.includes('soporte') || normalized.includes('tecnico') || normalized.includes('agente') || normalized.includes('humano')) {
      return 'soporte';
    }
    return 'default';
  };

  const connectAgent = () => {
    setAgentConnected(true);
    const agentMessage = {
      id: Date.now() + 2,
      text: '👋 Hola, soy María del equipo de soporte técnico. Ya revisé tu consulta, ¿ cómo puedo ayudarte específicamente?',
      isBot: true,
      timestamp: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, agentMessage]);
  };

  const handleSendMessage = (messageText = null) => {
    const text = messageText || inputMessage.trim();
    if (!text) return;

    const userMessage = {
      id: Date.now(),
      text,
      isBot: false,
      timestamp: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
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
        timestamp: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);

      if (response.escalate) {
        setTimeout(connectAgent, 2000);
      }
    }, response.delay);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageInner}>
        <div className={styles.pageHeader}>
          <div className={styles.iconWrapper}>
            <MessageCircle className={chatStyles.iconMedium} aria-hidden="true" />
          </div>
          <h1 className={styles.pageTitle}>Chat de soporte 24/7</h1>
          <p className={styles.pageSubtitle}>Asistencia inmediata para todas tus consultas</p>
        </div>

        <div className={chatStyles.chatStatus} role="status">
          {agentConnected ? (
            <>
              <span className={classNames(chatStyles.statusDot, chatStyles.statusDotSuccess)} aria-hidden="true" />
              <span className={classNames(chatStyles.statusLabel, chatStyles.statusLabelSuccess)}>
                Conectado con agente en vivo
              </span>
            </>
          ) : (
            <>
              <span className={classNames(chatStyles.statusDot, chatStyles.statusDotPrimary)} aria-hidden="true" />
              <span className={chatStyles.statusLabel}>Asistente virtual disponible</span>
            </>
          )}
        </div>

        <div className={chatStyles.chatContainer}>
          <div className={chatStyles.chatHeader}>
            <div className={chatStyles.chatHeaderTop}>
              <div>
                <h2 className={chatStyles.chatHeaderTitle}>
                  {agentConnected ? 'María - Soporte técnico' : 'Asistente virtual CEX'}
                </h2>
                <div className={chatStyles.chatHeaderMeta}>
                  <span className={chatStyles.chatHeaderMetaDot} aria-hidden="true" />
                  <span>En línea</span>
                </div>
              </div>
              <div className={chatStyles.chatHeaderMeta}>
                <Clock className={chatStyles.iconTiny} aria-hidden="true" />
                <span>24/7</span>
              </div>
            </div>
          </div>

          <div className={chatStyles.messagesArea}>
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg.text}
                isBot={msg.isBot}
                timestamp={msg.timestamp}
              />
            ))}

            {isTyping && (
              <div className={chatStyles.typingIndicator}>
                <div className={chatStyles.typingAvatar}>
                  <Bot className={chatStyles.iconSmall} aria-hidden="true" />
                </div>
                <div className={chatStyles.typingBubble} aria-live="polite">
                  <div className={chatStyles.typingDots}>
                    <span className={chatStyles.typingDot} />
                    <span className={chatStyles.typingDot} />
                    <span className={chatStyles.typingDot} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

            {messages.length <= 1 && (
            <div className={chatStyles.quickResponses}>
              <p className={chatStyles.quickResponsesLabel}>Respuestas rápidas:</p>
              <div className={chatStyles.quickResponsesList}>
                {QUICK_RESPONSES.map((response, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSendMessage(response)}
                    className={chatStyles.quickResponseButton}
                  >
                    {response}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className={chatStyles.inputArea}>
            <div className={chatStyles.inputRow}>
              <input
                type="text"
                value={inputMessage}
                onChange={(event) => setInputMessage(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu mensaje..."
                className={styles.input}
              />
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim()}
                className={classNames(styles.btnPrimary, chatStyles.sendButton)}
                aria-label="Enviar mensaje"
              >
                <Send className={chatStyles.iconSmall} aria-hidden="true" />
                <span className={chatStyles.srOnly}>Enviar</span>
              </button>
            </div>
          </div>
        </div>

        <div className={classNames(styles.grid3, chatStyles.infoSection)}>
          <div className={classNames(styles.card, chatStyles.infoCard)}>
            <div className={classNames(chatStyles.infoIcon, chatStyles.infoIconSuccess)}>
              <CheckCircle2 className={chatStyles.iconMedium} aria-hidden="true" />
            </div>
            <h3 className={styles.cardHeader}>Respuesta inmediata</h3>
            <p className={styles.cardContent}>Asistente disponible 24/7</p>
          </div>
          <div className={classNames(styles.card, chatStyles.infoCard)}>
            <div className={classNames(chatStyles.infoIcon, chatStyles.infoIconPrimary)}>
              <User className={chatStyles.iconMedium} aria-hidden="true" />
            </div>
            <h3 className={styles.cardHeader}>Agentes humanos</h3>
            <p className={styles.cardContent}>Escalado cuando lo necesites</p>
          </div>
          <div className={classNames(styles.card, chatStyles.infoCard)}>
            <div className={classNames(chatStyles.infoIcon, chatStyles.infoIconAccent)}>
              <MessageCircle className={chatStyles.iconMedium} aria-hidden="true" />
            </div>
            <h3 className={styles.cardHeader}>Historial guardado</h3>
            <p className={styles.cardContent}>Accede a tus conversaciones</p>
          </div>
        </div>
      </div>
    </div>
  );
}
