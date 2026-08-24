import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';
import { processChatMessage, ChatMessage } from '../../utils/chatbotEngine';
import { formatCurrency } from '../../utils/formatters';

export const NexusAiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { products } = useProducts();
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_1',
      sender: 'bot',
      text: `Hello ${user ? user.first_name : 'there'}! 👋 I am **NexusAI**, your 24/7 intelligent shopping assistant.\n\nHow can I assist you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickReplies: ['🔥 Deals & Offers', '💻 Find Laptops', '📱 Find Phones', '📦 Track My Order', '🎟️ Promo Codes'],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = (textToSend?: string) => {
    const messageContent = textToSend || inputText;
    if (!messageContent.trim()) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = processChatMessage(messageContent, products, user?.first_name);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9990,
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            color: 'white',
            border: 'none',
            boxShadow: '0 8px 24px rgba(79, 70, 229, 0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          title="Chat with NexusAI Assistant"
        >
          <MessageSquare size={26} />
          <span
            style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '16px',
              height: '16px',
              backgroundColor: '#10b981',
              borderRadius: '50%',
              border: '2px solid white',
            }}
          />
        </button>
      )}

      {/* Expandable Chat Window */}
      {isOpen && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            width: '380px',
            maxWidth: 'calc(100vw - 32px)',
            height: '560px',
            maxHeight: 'calc(100vh - 48px)',
            backgroundColor: 'white',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Chat Header */}
          <div
            style={{
              padding: '1rem 1.25rem',
              background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <Bot size={22} />
                <span
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    border: '1.5px solid white',
                  }}
                />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  NexusAI Assistant <Sparkles size={14} color="#fde047" />
                </div>
                <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Online • Instant Support</div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Chat Body */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1rem',
              backgroundColor: '#f8fafc',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '0.75rem 1rem',
                    borderRadius: msg.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                    backgroundColor: msg.sender === 'user' ? 'var(--primary)' : 'white',
                    color: msg.sender === 'user' ? 'white' : 'var(--text-main)',
                    boxShadow: 'var(--shadow-sm)',
                    fontSize: '0.875rem',
                    lineHeight: '1.45',
                    whiteSpace: 'pre-wrap',
                    border: msg.sender === 'user' ? 'none' : '1px solid var(--border-light)',
                  }}
                >
                  {msg.text}
                </div>

                {/* Product Recommendations within chat */}
                {msg.products && msg.products.length > 0 && (
                  <div style={{ width: '100%', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {msg.products.map(p => (
                      <Link
                        key={p.product_id}
                        to={`/product/${p.product_id}`}
                        onClick={() => setIsOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px',
                          background: 'white',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-color)',
                          boxShadow: 'var(--shadow-sm)',
                          textDecoration: 'none',
                          color: 'inherit',
                        }}
                      >
                        <img
                          src={p.product_image}
                          alt={p.product_title}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';
                          }}
                          style={{ width: '42px', height: '42px', objectFit: 'contain', borderRadius: '4px', background: '#f8fafc' }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.8125rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {p.product_title}
                          </div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>
                            {formatCurrency(p.product_price)}
                          </div>
                        </div>
                        <ArrowRight size={14} color="var(--text-muted)" />
                      </Link>
                    ))}
                  </div>
                )}

                {/* Action Links */}
                {msg.actionLinks && (
                  <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                    {msg.actionLinks.map((link, i) => (
                      <Link
                        key={i}
                        to={link.url}
                        onClick={() => setIsOpen(false)}
                        className="btn btn-sm btn-outline"
                        style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                      >
                        {link.label} <ArrowRight size={12} />
                      </Link>
                    ))}
                  </div>
                )}

                {/* Quick Reply Chips */}
                {msg.quickReplies && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                    {msg.quickReplies.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(chip)}
                        style={{
                          background: 'white',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-full)',
                          padding: '4px 10px',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          color: 'var(--primary)',
                          cursor: 'pointer',
                          boxShadow: 'var(--shadow-sm)',
                        }}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}

                <span style={{ fontSize: '0.6875rem', color: 'var(--text-light)', marginTop: '2px' }}>
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px', background: 'white', borderRadius: '12px', width: 'fit-content' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)', animation: 'pulse-subtle 1s infinite' }} />
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)', animation: 'pulse-subtle 1s infinite 0.2s' }} />
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)', animation: 'pulse-subtle 1s infinite 0.4s' }} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{
              padding: '0.75rem',
              backgroundColor: 'white',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              placeholder="Ask anything (e.g. 'Show laptops')..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{
                flex: 1,
                padding: '8px 14px',
                borderRadius: 'var(--radius-full)',
                border: '1.5px solid var(--border-color)',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: inputText.trim() ? 'var(--primary)' : 'var(--bg-subtle)',
                color: inputText.trim() ? 'white' : 'var(--text-muted)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: inputText.trim() ? 'pointer' : 'default',
                transition: 'background 0.2s',
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
