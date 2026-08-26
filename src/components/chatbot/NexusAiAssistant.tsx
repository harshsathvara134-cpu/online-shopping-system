import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  Tag,
  Check,
  Package,
  Truck,
  CheckCircle2,
  Star,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';
import { useCart } from '../../context/CartContext';
import { processChatMessage, ChatMessage } from '../../utils/chatbotEngine';
import { formatCurrency } from '../../utils/formatters';

export const NexusAiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { products } = useProducts();
  const { user } = useAuth();
  const { orders } = useOrders();
  const { addToCart, applyCoupon } = useCart();

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [addedItemAnim, setAddedItemAnim] = useState<number | null>(null);
  const [couponAppliedToast, setCouponAppliedToast] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_1',
      sender: 'bot',
      text: `Hello ${user ? user.first_name : 'there'}! 👋 I am **JAYVEER AI**, your smart personal shopping assistant.\n\nAsk me anything in **English**, **Hindi**, or **Hinglish**:\n• 🔍 *"Show gaming laptops under 75k"*\n• 📱 *"Compare Samsung S25 and iPhone 15"*\n• 📦 *"Track my recent order"*\n• 🎟️ *"What coupons are available?"*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickReplies: ['🔥 Trending Deals', '📱 Phones Under 25k', '💻 Gaming Laptops', '⚖️ Compare Flagships', '🎟️ Available Coupons', '📦 Track My Order'],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText(transcript);
          handleSendMessage(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Voice input is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Speech recognition error:', err);
      }
    }
  };

  const handleSpeakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*•#_]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

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
      // Strictly scope order visibility to authenticated user only (prevents chatbot IDOR/PII leak)
      const userOrders = user ? orders.filter((o) => o.user_id === user.user_id) : [];
      const botResponse = processChatMessage(messageContent, products, userOrders, user?.first_name);
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 550);
  };

  const handleAddToCartDirect = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedItemAnim(product.product_id);
    setTimeout(() => setAddedItemAnim(null), 1500);
  };

  const handleApplyCouponDirect = (code: string) => {
    const res = applyCoupon(code);
    setCouponAppliedToast(res.message);
    setTimeout(() => setCouponAppliedToast(null), 3500);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `welcome_${Date.now()}`,
        sender: 'bot',
        text: `Fresh chat started! 👋 How can I assist you with your shopping today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickReplies: ['🔥 Trending Deals', '💻 Laptops', '📱 Smartphones', '🎟️ Available Coupons', '📦 Track Order'],
      },
    ]);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="chatbot-launcher-btn"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9990,
            width: '62px',
            height: '62px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            color: 'white',
            border: 'none',
            boxShadow: '0 10px 28px rgba(79, 70, 229, 0.45)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
          title="Chat with JAYVEER AI Smart Assistant"
        >
          <MessageSquare size={28} />
          <span
            style={{
              position: 'absolute',
              top: '0px',
              right: '0px',
              width: '16px',
              height: '16px',
              backgroundColor: '#10b981',
              borderRadius: '50%',
              border: '2.5px solid white',
            }}
          />
        </button>
      )}

      {/* Expandable Chat Window */}
      {isOpen && (
        <div
          className="animate-fade-in chatbot-window-responsive"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            width: isExpanded ? '640px' : '420px',
            maxWidth: 'calc(100vw - 32px)',
            height: isExpanded ? '720px' : '580px',
            maxHeight: 'calc(100vh - 48px)',
            backgroundColor: 'white',
            borderRadius: 'var(--radius-xl)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* Chat Header */}
          <div
            style={{
              padding: '1rem 1.25rem',
              background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <Bot size={24} color="#a5b4fc" />
                <span
                  style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '-2px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    border: '1.5px solid #1e1b4b',
                  }}
                />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  JAYVEER AI Smart Assistant <Sparkles size={14} color="#fde047" />
                </div>
                <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                  Multilingual AI • Instant Support
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={handleClearHistory}
                style={{ background: 'rgba(255, 255, 255, 0.12)', border: 'none', borderRadius: '8px', padding: '6px', color: 'white', cursor: 'pointer' }}
                title="Restart Conversation"
              >
                <RotateCcw size={15} />
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                style={{ background: 'rgba(255, 255, 255, 0.12)', border: 'none', borderRadius: '8px', padding: '6px', color: 'white', cursor: 'pointer' }}
                title={isExpanded ? 'Collapse' : 'Expand'}
              >
                {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                style={{ background: 'rgba(255, 255, 255, 0.12)', border: 'none', borderRadius: '8px', padding: '6px', color: 'white', cursor: 'pointer' }}
                title="Close Assistant"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Toast Alert for Coupon Application */}
          {couponAppliedToast && (
            <div
              className="animate-fade-in"
              style={{
                backgroundColor: '#ecfdf5',
                color: '#065f46',
                padding: '8px 14px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                borderBottom: '1px solid #a7f3d0',
              }}
            >
              <Check size={16} /> {couponAppliedToast}
            </div>
          )}

          {/* Chat Body Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1.25rem',
              backgroundColor: '#f8fafc',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
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
                    maxWidth: '90%',
                    padding: '0.85rem 1.15rem',
                    borderRadius: msg.sender === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                    backgroundColor: msg.sender === 'user' ? 'var(--primary)' : 'white',
                    color: msg.sender === 'user' ? 'white' : 'var(--text-main)',
                    boxShadow: 'var(--shadow-sm)',
                    fontSize: '0.875rem',
                    lineHeight: '1.55',
                    whiteSpace: 'pre-wrap',
                    border: msg.sender === 'user' ? 'none' : '1px solid var(--border-light)',
                    position: 'relative',
                  }}
                >
                  {msg.text}

                  {msg.sender === 'bot' && (
                    <button
                      onClick={() => handleSpeakMessage(msg.text)}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '2px',
                      }}
                      title="Listen to response"
                    >
                      <Volume2 size={14} />
                    </button>
                  )}
                </div>

                {/* 1-Click Auto Coupon Application Button */}
                {msg.couponToApply && (
                  <div style={{ marginTop: '8px' }}>
                    <button
                      onClick={() => handleApplyCouponDirect(msg.couponToApply!)}
                      className="btn btn-sm btn-primary"
                      style={{ borderRadius: 'var(--radius-full)', gap: '6px', fontSize: '0.78125rem' }}
                    >
                      <Tag size={14} /> Auto-Apply '{msg.couponToApply}' to Cart
                    </button>
                  </div>
                )}

                {/* Live Order Tracking Timeline Card */}
                {msg.order && (
                  <div
                    style={{
                      width: '100%',
                      marginTop: '10px',
                      backgroundColor: 'white',
                      borderRadius: 'var(--radius-lg)',
                      border: '1.5px solid var(--border-color)',
                      padding: '1rem',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', borderBottom: '1px solid var(--border-light)', paddingBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '0.9rem' }}>
                        <Package size={16} color="var(--primary)" /> Order #{msg.order.order_id}
                      </div>
                      <span className={`badge ${msg.order.status === 'Delivered' ? 'badge-success' : msg.order.status === 'Shipped' ? 'badge-primary' : 'badge-warning'}`}>
                        {msg.order.status}
                      </span>
                    </div>

                    {/* Progress Milestone Bar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span style={{ fontWeight: 600, color: 'var(--success)' }}>✓ Placed</span>
                      <span>→</span>
                      <span style={{ fontWeight: 600, color: msg.order.status !== 'Pending' ? 'var(--primary)' : 'inherit' }}>
                        {msg.order.status === 'Pending' ? 'Processing' : '✓ Packed'}
                      </span>
                      <span>→</span>
                      <span style={{ fontWeight: 600, color: msg.order.status === 'Shipped' || msg.order.status === 'Delivered' ? 'var(--primary)' : 'inherit' }}>
                        {msg.order.status === 'Delivered' ? '✓ Delivered' : msg.order.status === 'Shipped' ? '🚚 In Transit' : 'Delivery'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', paddingTop: '6px', borderTop: '1px dashed var(--border-light)', fontSize: '0.8125rem' }}>
                      <span>Total: <strong>{formatCurrency(msg.order.total_amt)}</strong></span>
                      <Link to="/my-orders" onClick={() => setIsOpen(false)} style={{ color: 'var(--primary)', fontWeight: 700 }}>
                        View Full Details →
                      </Link>
                    </div>
                  </div>
                )}

                {/* Product Comparison Card */}
                {msg.comparison && (
                  <div
                    style={{
                      width: '100%',
                      marginTop: '10px',
                      backgroundColor: 'white',
                      borderRadius: 'var(--radius-lg)',
                      border: '1.5px solid var(--border-color)',
                      padding: '1rem',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '8px' }}>
                      <div style={{ padding: '8px', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.8125rem', height: '2.4rem', overflow: 'hidden' }}>{msg.comparison.product1.product_title}</div>
                        <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.9rem' }}>{formatCurrency(msg.comparison.product1.product_price)}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rating: {msg.comparison.product1.rating}★</div>
                        <button
                          onClick={(e) => handleAddToCartDirect(msg.comparison!.product1, e)}
                          className="btn btn-sm btn-primary"
                          style={{ width: '100%', marginTop: '6px', fontSize: '0.75rem', padding: '4px' }}
                        >
                          + Add to Cart
                        </button>
                      </div>

                      <div style={{ padding: '8px', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.8125rem', height: '2.4rem', overflow: 'hidden' }}>{msg.comparison.product2.product_title}</div>
                        <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.9rem' }}>{formatCurrency(msg.comparison.product2.product_price)}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rating: {msg.comparison.product2.rating}★</div>
                        <button
                          onClick={(e) => handleAddToCartDirect(msg.comparison!.product2, e)}
                          className="btn btn-sm btn-primary"
                          style={{ width: '100%', marginTop: '6px', fontSize: '0.75rem', padding: '4px' }}
                        >
                          + Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Product Recommendation Cards with 1-Click "Add to Cart" */}
                {msg.products && msg.products.length > 0 && (
                  <div style={{ width: '100%', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {msg.products.map(p => (
                      <div
                        key={p.product_id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 12px',
                          background: 'white',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-color)',
                          boxShadow: 'var(--shadow-sm)',
                        }}
                      >
                        <Link to={`/product/${p.product_id}`} onClick={() => setIsOpen(false)}>
                          <img
                            src={p.product_image}
                            alt={p.product_title}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';
                            }}
                            style={{ width: '48px', height: '48px', objectFit: 'contain', borderRadius: '6px', background: '#f8fafc', padding: '2px' }}
                          />
                        </Link>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <Link
                            to={`/product/${p.product_id}`}
                            onClick={() => setIsOpen(false)}
                            style={{ fontSize: '0.85rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', textDecoration: 'none', color: 'inherit' }}
                          >
                            {p.product_title}
                          </Link>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                            <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--primary)' }}>
                              {formatCurrency(p.product_price)}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {p.rating}★
                            </span>
                          </div>
                        </div>

                        {/* Quick Add to Cart button */}
                        <button
                          onClick={(e) => handleAddToCartDirect(p, e)}
                          className={`btn btn-sm ${addedItemAnim === p.product_id ? 'btn-success' : 'btn-primary'}`}
                          style={{ padding: '5px 10px', fontSize: '0.75rem', gap: '4px' }}
                        >
                          {addedItemAnim === p.product_id ? (
                            <>
                              <Check size={13} /> Added
                            </>
                          ) : (
                            <>
                              <ShoppingBag size={13} /> Add
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Links */}
                {msg.actionLinks && (
                  <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
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

                {/* Quick Reply Suggestion Chips */}
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
                          padding: '5px 12px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: 'var(--primary)',
                          cursor: 'pointer',
                          boxShadow: 'var(--shadow-sm)',
                          transition: 'all 0.2s',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 14px', background: 'white', borderRadius: '14px', width: 'fit-content', border: '1px solid var(--border-light)' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', animation: 'pulse-subtle 1s infinite' }} />
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', animation: 'pulse-subtle 1s infinite 0.2s' }} />
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', animation: 'pulse-subtle 1s infinite 0.4s' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '4px' }}>JAYVEER AI is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar with Voice Support */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'white',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            <button
              type="button"
              onClick={toggleVoiceInput}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: isListening ? '#ef4444' : 'var(--bg-subtle)',
                color: isListening ? 'white' : 'var(--text-muted)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              title={isListening ? 'Listening... Speak now' : 'Voice Input (Click to speak)'}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            <input
              type="text"
              placeholder={isListening ? 'Listening to your voice...' : "Ask in English or Hinglish (e.g. 'Phones under 25k')..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{
                flex: 1,
                padding: '9px 14px',
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

export const JayveerAiAssistant = NexusAiAssistant;
export default NexusAiAssistant;
