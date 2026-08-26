import React from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  AlertTriangle,
  Users,
  ArrowRight,
  Plus,
  CheckCircle2,
  Clock,
  MessageSquare,
  Star,
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useOrders } from '../../context/OrderContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const AdminDashboard: React.FC = () => {
  const { products, reviews } = useProducts();
  const { orders } = useOrders();

  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.total_amt : 0), 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1) : '5.0';
  const lowStockProducts = products.filter(p => p.product_qty <= 5);

  const recentOrders = orders.slice(0, 5);
  const recentReviews = reviews.slice(0, 4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Welcome Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Live performance overview, inventory alerts, and order processing
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/admin/products" className="btn btn-primary btn-sm" style={{ gap: '6px' }}>
            <Plus size={16} /> Add Product
          </Link>
          <Link to="/admin/orders" className="btn btn-secondary btn-sm">
            View All Orders
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TrendingUp size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Revenue</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
              {formatCurrency(totalRevenue)}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>+18.4% this month</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              backgroundColor: '#ecfdf5',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShoppingBag size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Orders</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
              {totalOrders}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>100% Fulfilled</span>
          </div>
        </div>

        {/* Products */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              backgroundColor: '#fef3c7',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Package size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>Catalog Items</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
              {totalProducts}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Across 7 categories</span>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              backgroundColor: lowStockProducts.length > 0 ? '#fef2f2' : '#f0fdf4',
              color: lowStockProducts.length > 0 ? '#ef4444' : '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AlertTriangle size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>Low Stock Alerts</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: lowStockProducts.length > 0 ? 'var(--danger)' : 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
              {lowStockProducts.length}
            </div>
            <span style={{ fontSize: '0.75rem', color: lowStockProducts.length > 0 ? 'var(--danger)' : 'var(--success)' }}>
              {lowStockProducts.length > 0 ? 'Action required' : 'All stocks healthy'}
            </span>
          </div>
        </div>
        {/* Customer Reviews KPI */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              backgroundColor: '#ede9fe',
              color: '#7c3aed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MessageSquare size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>Customer Reviews</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {totalReviews} <span style={{ fontSize: '0.9rem', color: '#f59e0b', fontWeight: 700 }}>({avgRating}★)</span>
            </div>
            <Link to="/admin/reviews" style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
              Manage & Reply →
            </Link>
          </div>
        </div>
      </div>

      {/* Main 2-Column Dashboard Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: '2rem', alignItems: 'start' }}>
        {/* Recent Orders Table */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Recent Customer Orders</h2>
            <Link to="/admin/orders" style={{ fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px' }}>Order ID</th>
                  <th style={{ padding: '10px' }}>Customer</th>
                  <th style={{ padding: '10px' }}>Items</th>
                  <th style={{ padding: '10px' }}>Total</th>
                  <th style={{ padding: '10px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.order_id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '12px 10px', fontWeight: 700, color: 'var(--primary)' }}>
                      #{order.order_id}
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <div style={{ fontWeight: 600 }}>{order.f_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.city}</div>
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      {order.prod_count} item(s)
                    </td>
                    <td style={{ padding: '12px 10px', fontWeight: 700 }}>
                      {formatCurrency(order.total_amt)}
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <span className="badge badge-primary">{order.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Inventory Alerts & Latest Reviews */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Low Stock Warning List */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
              <AlertTriangle size={20} color="var(--warning)" />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Inventory Alerts</h2>
            </div>

            {lowStockProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                ✓ All inventory items are adequately stocked.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {lowStockProducts.map((p) => (
                  <div
                    key={p.product_id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      backgroundColor: 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <div style={{ minWidth: 0, flex: 1, paddingRight: '8px' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.product_title}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--danger)', fontWeight: 700 }}>
                        Only {p.product_qty} in stock
                      </span>
                    </div>

                    <Link
                      to="/admin/products"
                      className="btn btn-sm btn-secondary"
                      style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                    >
                      Restock
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Latest Reviews Widget */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Star size={20} color="#f59e0b" fill="#f59e0b" />
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Latest Reviews</h2>
              </div>
              <Link to="/admin/reviews" style={{ fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: 600 }}>
                Manage All →
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentReviews.map((rev) => (
                <div
                  key={rev.review_id}
                  style={{
                    padding: '10px 12px',
                    backgroundColor: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-md)',
                    borderLeft: rev.admin_reply ? '3px solid var(--primary)' : '3px solid #cbd5e1',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.8125rem' }}>{rev.name}</span>
                    <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 700 }}>{rev.rating} ★</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    "{rev.review}"
                  </p>
                  {rev.admin_reply && (
                    <div style={{ fontSize: '0.6875rem', color: 'var(--primary)', fontWeight: 600, marginTop: '4px' }}>
                      ✓ Replied by Store
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
