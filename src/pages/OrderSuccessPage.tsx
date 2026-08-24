import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Printer, ArrowRight, Package, Home, ShieldCheck } from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { formatCurrency, formatDate } from '../utils/formatters';

export const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrderById } = useOrders();

  const order = getOrderById(Number(orderId));

  if (!order) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Order Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          We could not locate this order details.
        </p>
        <Link to="/store" className="btn btn-primary">
          Back to Store
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 6rem', maxWidth: '850px' }}>
      {/* Header Banner */}
      <div
        className="card"
        style={{
          textAlign: 'center',
          padding: '3rem 2rem',
          marginBottom: '2rem',
          background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)',
          border: '1px solid #bbf7d0',
        }}
      >
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#22c55e',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            boxShadow: '0 10px 25px rgba(34, 197, 94, 0.3)',
          }}
        >
          <CheckCircle size={48} />
        </div>

        <span className="badge badge-success" style={{ marginBottom: '0.75rem', fontSize: '0.85rem' }}>
          Payment & Order Confirmed
        </span>

        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Thank You For Your Order!
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '540px', margin: '0 auto 1.5rem' }}>
          Your order has been placed successfully and is being prepped for express dispatch. An invoice confirmation has been sent to <strong>{order.email}</strong>.
        </p>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', background: 'white', padding: '8px 20px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Order Reference:</span>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>#{order.order_id}</span>
        </div>
      </div>

      {/* Invoice Details Card */}
      <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '4px' }}>Invoice Receipt</h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Placed on: {formatDate(order.created_at)}</p>
          </div>
          <button onClick={handlePrint} className="btn btn-outline btn-sm hide-print" style={{ gap: '6px' }}>
            <Printer size={16} /> Print Receipt
          </button>
        </div>

        {/* Shipping & Payment Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Delivery Address
            </h4>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{order.f_name}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {order.address}<br />
              {order.city}, {order.state} - {order.zip}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Payment Information
            </h4>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
              {order.payment_method === 'Card' ? 'Credit / Debit Card' : order.payment_method === 'COD' ? 'Cash on Delivery (COD)' : order.payment_method === 'UPI' ? 'Instant UPI Payment' : 'Net Banking'}
            </div>
            {order.cardnumber && (
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{order.cardnumber}</div>
            )}
            <div style={{ fontSize: '0.8125rem', color: 'var(--success)', fontWeight: 600, marginTop: '4px' }}>
              Status: Verified & Confirmed
            </div>
          </div>
        </div>

        {/* Ordered Items Table */}
        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem' }}>Items in this Order</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {order.items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={item.product_image}
                    alt={item.product_title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';
                    }}
                    style={{ width: '48px', height: '48px', objectFit: 'contain', background: '#f8fafc', borderRadius: '6px' }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.product_title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Qty: {item.qty}</div>
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                  {formatCurrency(item.amt)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calculation Total */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.875rem', maxWidth: '280px', marginLeft: 'auto' }}>
          {order.discount_amt && order.discount_amt > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)', fontWeight: 600 }}>
              <span>Promo Discount ({order.coupon_code})</span>
              <span>-{formatCurrency(order.discount_amt)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
            <span>Total Paid</span>
            <span>{formatCurrency(order.total_amt)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <Link to="/my-orders" className="btn btn-primary btn-lg" style={{ borderRadius: 'var(--radius-full)' }}>
          <Package size={18} /> Track Delivery Status in My Orders
        </Link>
        <Link to="/store" className="btn btn-secondary btn-lg" style={{ borderRadius: 'var(--radius-full)' }}>
          <Home size={18} /> Continue Shopping
        </Link>
      </div>
    </div>
  );
};
