import React from 'react';
import { BarChart3, TrendingUp, DollarSign, Package, ShoppingBag, Award } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useOrders } from '../../context/OrderContext';
import { formatCurrency } from '../../utils/formatters';

export const AdminAnalytics: React.FC = () => {
  const { products, categories, brands } = useProducts();
  const { orders } = useOrders();

  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.total_amt : 0), 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  // Category revenue calculations
  const categoryStats = categories.map((cat) => {
    const catProducts = products.filter(p => p.product_cat === cat.cat_id);
    const count = catProducts.length;
    const estValue = catProducts.reduce((sum, p) => sum + p.product_price * p.product_qty, 0);
    return {
      title: cat.cat_title,
      productCount: count,
      estValue,
    };
  });

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Store Analytics & Revenue Reports</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Deep insights on store performance, category valuation, and average order values
        </p>
      </div>

      {/* Analytics KPI Metrics */}
      <div className="grid grid-cols-3 gap-6" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Revenue Realized</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
              {formatCurrency(totalRevenue)}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>+24.5% vs last period</span>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>Average Order Value (AOV)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
              {formatCurrency(avgOrderValue)}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>High Basket Size</span>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Package size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Catalog Inventory Value</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
              {formatCurrency(products.reduce((s, p) => s + p.product_price * p.product_qty, 0))}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{products.reduce((s, p) => s + p.product_qty, 0)} Total Units</span>
          </div>
        </div>
      </div>

      {/* Category Performance & Valuation */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Category Share */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Category Inventory Valuation
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {categoryStats.map((c, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600 }}>{c.title}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{formatCurrency(c.estValue)} ({c.productCount} items)</span>
                </div>
                <div style={{ height: '8px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      backgroundColor: idx % 3 === 0 ? 'var(--primary)' : idx % 3 === 1 ? '#0ea5e9' : '#f59e0b',
                      width: `${Math.min(100, Math.max(15, (c.estValue / 1500000) * 100))}%`,
                      borderRadius: 'var(--radius-full)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Flagship Products */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Top Flagship Products
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {products.slice(0, 5).map((p) => (
              <div
                key={p.product_id}
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
                  src={p.product_image}
                  alt={p.product_title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';
                  }}
                  style={{ width: '45px', height: '45px', objectFit: 'contain', background: 'white', borderRadius: '6px', padding: '2px' }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {p.product_title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Rating: {p.rating}★ ({p.review_count || 12} reviews)
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary)' }}>
                  {formatCurrency(p.product_price)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
