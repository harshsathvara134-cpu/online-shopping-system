import React, { useState } from 'react';
import { ShoppingBag, Eye, Trash2, X, CheckCircle, Package } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { Order, OrderStatus } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus, deleteOrder } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredOrders = orders.filter((o) => {
    if (filterStatus !== 'all' && o.status !== filterStatus) return false;
    return true;
  });

  const statuses: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Customer Order Fulfillment</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Process incoming orders and update delivery dispatch milestones
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilterStatus('all')}
            className={`btn btn-sm ${filterStatus === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          >
            All Orders ({orders.length})
          </button>
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`btn btn-sm ${filterStatus === st ? 'btn-primary' : 'btn-secondary'}`}
            >
              {st} ({orders.filter(o => o.status === st).length})
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 16px' }}>Order ID</th>
                <th style={{ padding: '12px 16px' }}>Customer</th>
                <th style={{ padding: '12px 16px' }}>Date</th>
                <th style={{ padding: '12px 16px' }}>Payment</th>
                <th style={{ padding: '12px 16px' }}>Total Amount</th>
                <th style={{ padding: '12px 16px' }}>Fulfillment Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.order_id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--primary)' }}>
                    #{order.order_id}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 700 }}>{order.f_name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.email}</div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    {formatDate(order.created_at)}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className="badge badge-neutral">{order.payment_method}</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 800 }}>
                    {formatCurrency(order.total_amt)}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.order_id, e.target.value as OrderStatus)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: 700,
                        fontSize: '0.8125rem',
                        border: '1.5px solid var(--border-color)',
                        backgroundColor:
                          order.status === 'Delivered' ? 'var(--success-light)' :
                          order.status === 'Cancelled' ? 'var(--danger-light)' :
                          order.status === 'Pending' ? 'var(--warning-light)' : 'var(--primary-light)',
                        color:
                          order.status === 'Delivered' ? 'var(--success)' :
                          order.status === 'Cancelled' ? 'var(--danger)' :
                          order.status === 'Pending' ? 'var(--warning)' : 'var(--primary)',
                      }}
                    >
                      {statuses.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="btn btn-sm btn-secondary btn-icon"
                        title="View Order Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete Order #${order.order_id}?`)) {
                            deleteOrder(order.order_id);
                          }
                        }}
                        className="btn btn-sm btn-secondary btn-icon"
                        style={{ color: 'var(--danger)' }}
                        title="Delete Order"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Inspection Details Modal */}
      {selectedOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="animate-fade-in"
            style={{
              backgroundColor: 'white',
              borderRadius: 'var(--radius-xl)',
              maxWidth: '650px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2rem',
              position: 'relative',
              boxShadow: 'var(--shadow-xl)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
                  Order Details #{selectedOrder.order_id}
                </h2>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  Placed on {formatDate(selectedOrder.created_at)}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Customer & Address */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem', backgroundColor: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-lg)' }}>
              <div>
                <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Customer Contact</h4>
                <div style={{ fontWeight: 700 }}>{selectedOrder.f_name}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{selectedOrder.email}</div>
              </div>
              <div>
                <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Shipping Address</h4>
                <div style={{ fontSize: '0.85rem' }}>
                  {selectedOrder.address}<br />
                  {selectedOrder.city}, {selectedOrder.state} {selectedOrder.zip}
                </div>
              </div>
            </div>

            {/* Ordered Items */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.75rem' }}>Line Items</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={item.product_image}
                        alt={item.product_title}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';
                        }}
                        style={{ width: '40px', height: '40px', objectFit: 'contain', background: '#f8fafc', borderRadius: '4px' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.product_title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Quantity: {item.qty}</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                      {formatCurrency(item.amt)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Payment Method: <strong>{selectedOrder.payment_method}</strong>
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)' }}>
                Total: {formatCurrency(selectedOrder.total_amt)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
