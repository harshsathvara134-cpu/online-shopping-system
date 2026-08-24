import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Tag,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency, AVAILABLE_COUPONS } from '../utils/formatters';

export const CartPage: React.FC = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    tax,
    shipping,
    total,
    discountAmount,
    couponCode,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const navigate = useNavigate();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const res = applyCoupon(inputCoupon);
    setCouponMsg({ text: res.message, isError: !res.success });
    if (res.success) setInputCoupon('');
  };

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            color: 'var(--text-muted)',
          }}
        >
          <ShoppingBag size={48} />
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>Your Shopping Cart is Empty</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '450px', margin: '0 auto 2rem' }}>
          Explore our wide selection of high-performance electronics, trendy apparel, and luxury home essentials.
        </p>
        <Link to="/store" className="btn btn-primary btn-lg" style={{ borderRadius: 'var(--radius-full)' }}>
          Start Shopping <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>
        Shopping Cart ({cartItems.reduce((s, i) => s + i.qty, 0)} Items)
      </h1>

      <div className="cart-layout-grid">
        {/* Left Column: Cart Items List */}
        <div>
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '100px 1fr auto auto',
                    gap: '1.5rem',
                    alignItems: 'center',
                    paddingBottom: '1.5rem',
                    borderBottom: '1px solid var(--border-light)',
                  }}
                >
                  <div
                    style={{
                      width: '100px',
                      height: '100px',
                      backgroundColor: '#f8fafc',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '8px',
                    }}
                  >
                    <img
                      src={item.product.product_image}
                      alt={item.product.product_title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';
                      }}
                      style={{ maxHeight: '80px', maxWidth: '100%', objectFit: 'contain' }}
                    />
                  </div>

                  <div>
                    <Link
                      to={`/product/${item.product.product_id}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '4px' }}>
                        {item.product.product_title}
                      </h3>
                    </Link>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      Unit Price: <strong>{formatCurrency(item.product.product_price)}</strong>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>
                      ✓ In Stock
                    </span>
                  </div>

                  {/* Quantity */}
                  <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                    <button
                      onClick={() => updateQuantity(item.id, item.qty - 1)}
                      style={{ padding: '6px 12px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ padding: '6px 12px', fontWeight: 700, minWidth: '32px', textAlign: 'center' }}>
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.qty + 1)}
                      style={{ padding: '6px 12px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Subtotal & Delete */}
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                      {formatCurrency(item.product.product_price * item.qty)}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--danger)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.8125rem',
                      }}
                    >
                      <Trash2 size={15} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
              <Link to="/store" className="btn btn-outline" style={{ gap: '6px' }}>
                <ArrowLeft size={16} /> Continue Shopping
              </Link>

              <button onClick={clearCart} className="btn btn-secondary" style={{ color: 'var(--danger)' }}>
                <Trash2 size={16} /> Clear Cart
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Coupons */}
        <div>
          {/* Promo Coupon Card */}
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Tag size={18} color="var(--primary)" /> Have a Promo Code?
            </h3>

            {couponCode ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--success-light)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #a7f3d0',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--success)', fontSize: '0.9rem' }}>
                    Code '{couponCode}' Applied!
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    Saved {formatCurrency(discountAmount)}
                  </div>
                </div>
                <button
                  onClick={removeCoupon}
                  style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontWeight: 700, fontSize: '0.8125rem' }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Enter coupon code..."
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value)}
                  className="input-field"
                  style={{ textTransform: 'uppercase' }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '0.625rem 1.25rem' }}>
                  Apply
                </button>
              </form>
            )}

            {couponMsg && (
              <p style={{ fontSize: '0.8125rem', marginTop: '6px', color: couponMsg.isError ? 'var(--danger)' : 'var(--success)' }}>
                {couponMsg.text}
              </p>
            )}

            {/* Quick Available Coupons list */}
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Available Coupons
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {Object.entries(AVAILABLE_COUPONS).map(([code, info]) => (
                  <div
                    key={code}
                    onClick={() => applyCoupon(code)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '6px 10px',
                      backgroundColor: 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      fontSize: '0.8125rem',
                    }}
                  >
                    <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{code}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{info.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Total Card */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>Order Summary</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9375rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Subtotal ({cartItems.reduce((s, i) => s + i.qty, 0)} items)</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)', fontWeight: 600 }}>
                  <span>Coupon Discount</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Estimated GST Tax (5%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Express Shipping</span>
                <span>{shipping === 0 ? <strong style={{ color: 'var(--success)' }}>FREE</strong> : formatCurrency(shipping)}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  paddingTop: '1rem',
                  borderTop: '1.5px solid var(--border-color)',
                  marginTop: '0.5rem',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                <span>Total Amount</span>
                <span style={{ color: 'var(--primary)' }}>{formatCurrency(total)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', borderRadius: 'var(--radius-md)', fontWeight: 700 }}
            >
              Proceed to Checkout <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
