import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, CheckCircle2, Clock, XCircle, ArrowRight, ShoppingBag } from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate, getProductImageUrl } from '../utils/formatters';
import { OrderStatus } from '../types';

export const MyOrdersPage: React.FC = () => {
  const { user } = useAuth();
  const { getUserOrders } = useOrders();

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return <span className="badge badge-success">Delivered</span>;
      case 'Shipped':
      case 'Out for Delivery':
        return <span className="badge badge-primary">{status}</span>;
      case 'Processing':
        return <span className="badge badge-neutral" style={{ color: '#4f46e5', background: '#e0e7ff' }}>Processing</span>;
      case 'Cancelled':
        return <span className="badge badge-danger">Cancelled</span>;
      default:
        return <span className="badge badge-warning">Pending</span>;
    }
  };

  const getStepIndex = (status: OrderStatus): number => {
    switch (status) {
      case 'Pending': return 0;
      case 'Processing': return 1;
      case 'Shipped': return 2;
      case 'Out for Delivery': return 3;
      case 'Delivered': return 4;
      case 'Cancelled': return -1;
      default: return 0;
    }
  };

  const timelineSteps = [
    { label: 'Order Placed', desc: 'Received' },
    { label: 'Processing', desc: 'Packed at Hub' },
    { label: 'Shipped', desc: 'In Transit' },
    { label: 'Out for Delivery', desc: 'Courier Assigned' },
    { label: 'Delivered', desc: 'Completed' },
  ];

  const userOrders = user ? getUserOrders(user.user_id) : [];

  if (userOrders.length === 0) {
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
          <Package size={48} />
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>No Orders Placed Yet</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '450px', margin: '0 auto 2rem' }}>
          When you place an order, you will see real-time milestone delivery tracking and downloadable invoices right here.
        </p>
        <Link to="/store" className="btn btn-primary btn-lg" style={{ borderRadius: 'var(--radius-full)' }}>
          Start Shopping <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>My Orders & Delivery Tracking</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          View order milestones, item breakdowns, and downloadable invoices
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {userOrders.map((order) => {
          const currentStep = getStepIndex(order.status);
          const isCancelled = order.status === 'Cancelled';

          return (
            <div key={order.order_id} className="card" style={{ padding: '2rem', overflow: 'hidden' }}>
              {/* Order Header */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                  paddingBottom: '1.25rem',
                  borderBottom: '1px solid var(--border-color)',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--primary-light)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Package size={22} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Order #{order.order_id}</h3>
                      {getStatusBadge(order.status)}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      Placed on {formatDate(order.created_at)} • Payment: <strong>{order.payment_method}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                    {formatCurrency(order.total_amt)}
                  </div>
                  <Link
                    to={`/order-success/${order.order_id}`}
                    style={{ fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: 600, textDecoration: 'underline' }}
                  >
                    View Full Invoice
                  </Link>
                </div>
              </div>

              {/* Live Milestone Tracking Timeline */}
              {!isCancelled ? (
                <div style={{ padding: '1rem 0 2rem', borderBottom: '1px solid var(--border-light)', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
                    {/* Background track line */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '18px',
                        left: '10%',
                        right: '10%',
                        height: '4px',
                        backgroundColor: 'var(--border-color)',
                        zIndex: 1,
                      }}
                    >
                      {/* Active progress track */}
                      <div
                        style={{
                          height: '100%',
                          backgroundColor: 'var(--primary)',
                          width: `${(Math.min(currentStep, 4) / 4) * 100}%`,
                          transition: 'width 0.4s ease',
                        }}
                      />
                    </div>

                    {timelineSteps.map((step, idx) => {
                      const isCompleted = idx <= currentStep;
                      const isCurrent = idx === currentStep;

                      return (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            zIndex: 2,
                            position: 'relative',
                            textAlign: 'center',
                          }}
                        >
                          <div
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '50%',
                              backgroundColor: isCompleted ? (idx === 4 ? 'var(--success)' : 'var(--primary)') : 'white',
                              border: isCompleted ? 'none' : '2px solid var(--border-color)',
                              color: isCompleted ? 'white' : 'var(--text-muted)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '0.85rem',
                              boxShadow: isCurrent ? '0 0 0 6px var(--primary-glow)' : 'none',
                              marginBottom: '8px',
                              transition: 'all 0.3s',
                            }}
                          >
                            {isCompleted ? <CheckCircle2 size={18} /> : idx + 1}
                          </div>
                          <div style={{ fontSize: '0.8125rem', fontWeight: isCurrent ? 700 : 500, color: isCurrent ? 'var(--primary)' : 'var(--text-main)' }}>
                            {step.label}
                          </div>
                          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }} className="hide-mobile">
                            {step.desc}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div style={{ padding: '1rem', backgroundColor: 'var(--danger-light)', borderRadius: 'var(--radius-md)', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
                  <XCircle size={20} /> This order was cancelled.
                </div>
              )}

              {/* Items Preview */}
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem' }}>
                  Order Items ({order.items.length})
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px',
                        backgroundColor: 'var(--bg-subtle)',
                        borderRadius: 'var(--radius-md)',
                      }}
                    >
                      <img
                        src={getProductImageUrl(item.product_image)}
                        alt={item.product_title}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';
                        }}
                        style={{ width: '50px', height: '50px', objectFit: 'contain', background: 'white', borderRadius: '6px', padding: '4px' }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Link
                          to={`/product/${item.product_id}`}
                          style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', textDecoration: 'none', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                        >
                          {item.product_title}
                        </Link>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Qty: {item.qty} • {formatCurrency(item.amt)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
