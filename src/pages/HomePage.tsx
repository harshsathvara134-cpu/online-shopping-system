import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  TrendingUp,
  Award,
  Laptop,
  ShoppingBag,
  Star,
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useLanguage } from '../context/LanguageContext';
import { ProductCard } from '../components/store/ProductCard';
import { QuickViewModal } from '../components/common/QuickViewModal';
import { Product } from '../types';

export const HomePage: React.FC = () => {
  const { products, brands } = useProducts();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'trending' | 'featured' | 'deals'>('trending');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const trendingProducts = products.filter(p => p.trending);
  const featuredProducts = products.filter(p => p.featured);
  const dealsProducts = products.slice(0, 4);

  const displayedProducts =
    activeTab === 'trending' ? trendingProducts :
    activeTab === 'featured' ? featuredProducts : dealsProducts;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', paddingBottom: '2rem' }}>
      {/* Hero Showcase Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          padding: '4.5rem 0',
        }}
      >
        {/* Ambient Glows */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, rgba(99, 102, 241, 0) 70%)',
            filter: 'blur(50px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            left: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(244, 63, 94, 0.3) 0%, rgba(244, 63, 94, 0) 70%)',
            filter: 'blur(50px)',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '3rem', alignItems: 'center' }}>
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(8px)',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#a5b4fc',
                  marginBottom: '1.5rem',
                }}
              >
                <Sparkles size={16} color="#fbbf24" />
                <span>Next-Generation E-Commerce Experience</span>
              </div>

              <h1
                style={{
                  fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
                  fontWeight: 900,
                  color: 'white',
                  lineHeight: 1.15,
                  marginBottom: '1.25rem',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                {t('heroTitle')}
              </h1>

              <p style={{ fontSize: '1.1rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '560px' }}>
                {t('heroSubtitle')}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                <Link
                  to="/store"
                  className="btn btn-primary btn-lg"
                  style={{ borderRadius: 'var(--radius-full)', padding: '0.85rem 2rem', fontSize: '1.05rem' }}
                >
                  {t('explore')} <ArrowRight size={20} />
                </Link>

                <Link
                  to="/store?cat=1"
                  className="btn btn-outline btn-lg"
                  style={{
                    borderRadius: 'var(--radius-full)',
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    padding: '0.85rem 1.75rem',
                  }}
                >
                  <Laptop size={18} /> {t('electronics')}
                </Link>
              </div>

              {/* Trust Metrics */}
              <div
                style={{
                  display: 'flex',
                  gap: '2.5rem',
                  marginTop: '3rem',
                  paddingTop: '2rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-heading)' }}>50,000+</div>
                  <div style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>Happy Customers</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-heading)' }}>100%</div>
                  <div style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>Authentic Brands</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fbbf24', fontFamily: 'var(--font-heading)' }}>4.9 / 5</div>
                  <div style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>Store Rating</div>
                </div>
              </div>
            </div>

            {/* Hero Image Showcase Card */}
            <div className="hide-mobile" style={{ display: 'flex', justifyContent: 'center' }}>
              <div
                className="glass-panel"
                style={{
                  padding: '1.5rem',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                  width: '100%',
                  maxWidth: '420px',
                  borderRadius: 'var(--radius-xl)',
                  position: 'relative',
                }}
              >
                <div style={{ position: 'relative', height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-lg)', marginBottom: '1rem', overflow: 'hidden' }}>
                  <img
                    src="/product_images/1772203299_1770809937_samsung-galaxy-s25-ultra-front-and-back-2.png"
                    alt="Featured S25 Ultra"
                    style={{ maxHeight: '240px', maxWidth: '90%', objectFit: 'contain' }}
                  />
                  <div style={{ position: 'absolute', top: '12px', right: '12px', background: '#f59e0b', color: '#0f172a', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>
                    HOT LAUNCH
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ color: 'white', fontSize: '1.15rem', fontWeight: 700 }}>Samsung Galaxy S25 Ultra</h4>
                    <p style={{ color: '#a5b4fc', fontSize: '0.85rem' }}>AI Flagship • 200MP Camera</p>
                  </div>
                  <Link
                    to="/product/5"
                    className="btn btn-primary btn-sm"
                    style={{ borderRadius: 'var(--radius-full)' }}
                  >
                    View <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured & Trending Products Showcase */}
      <section className="container">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
            {t('forYou')}
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.25rem' }}>{t('featuredProducts')}</h2>

          {/* Switcher Tabs */}
          <div
            style={{
              display: 'inline-flex',
              padding: '4px',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-color)',
            }}
          >
            <button
              onClick={() => setActiveTab('trending')}
              style={{
                padding: '8px 20px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                backgroundColor: activeTab === 'trending' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'trending' ? 'white' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <TrendingUp size={16} /> {t('trending')}
            </button>
            <button
              onClick={() => setActiveTab('featured')}
              style={{
                padding: '8px 20px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                backgroundColor: activeTab === 'featured' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'featured' ? 'white' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Award size={16} /> {t('featured')}
            </button>
            <button
              onClick={() => setActiveTab('deals')}
              style={{
                padding: '8px 20px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                backgroundColor: activeTab === 'deals' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'deals' ? 'white' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Zap size={16} /> Special Offers
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {displayedProducts.map((product) => (
            <ProductCard
              key={product.product_id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="container">
        <div
          style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%)',
            borderRadius: 'var(--radius-xl)',
            padding: '3.5rem 2.5rem',
            color: 'white',
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '2rem',
            alignItems: 'center',
            boxShadow: 'var(--shadow-xl)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ zIndex: 2 }}>
            <span
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(8px)',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8125rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                display: 'inline-block',
                marginBottom: '1rem',
              }}
            >
              Limited Time Promo
            </span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 900, color: 'white', marginBottom: '1rem' }}>
              Mega Electronics Festival
            </h2>
            <p style={{ fontSize: '1rem', opacity: 0.9, lineHeight: 1.6, marginBottom: '1.75rem', maxWidth: '480px' }}>
              Upgrade your setup with Intel Core i7 laptops, RTX graphics cards, and 5G smartphones with instant discounts up to ₹5,000 using promo code <strong>SUPER20</strong>.
            </p>
            <Link
              to="/store?cat=1"
              className="btn btn-secondary btn-lg"
              style={{
                backgroundColor: 'white',
                color: '#4f46e5',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
              }}
            >
              Shop Electronics Now <ArrowRight size={18} />
            </Link>
          </div>

          <div className="hide-mobile" style={{ display: 'flex', justifyContent: 'center', zIndex: 2 }}>
            <img
              src="/product_images/1772203508_1770813469_669025df1d73a44bd21c762c-hp-pavilion-15-6-fhd-touchscreen.png"
              alt="Promo Laptop"
              style={{ maxHeight: '240px', maxWidth: '100%', objectFit: 'contain', filter: 'drop-shadow(0 20px 25px rgba(0,0,0,0.3))' }}
            />
          </div>
        </div>
      </section>

      {/* Brand Partners Strip */}
      <section className="container">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Authorized Brand Partners
          </h3>
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '2.5rem',
            padding: '1.5rem',
            background: 'white',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
          }}
        >
          {brands.map((brand) => (
            <Link
              key={brand.brand_id}
              to={`/store?brand=${brand.brand_id}`}
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: 'var(--text-muted)',
                textDecoration: 'none',
                fontFamily: 'var(--font-heading)',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              {brand.brand_title}
            </Link>
          ))}
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="container">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Customer Feedback
          </div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Loved by Shoppers Across India</h2>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', color: '#f59e0b' }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#f59e0b" />)}
            </div>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-main)', lineHeight: 1.6, fontStyle: 'italic' }}>
              "Ordered the Samsung Galaxy S25 Ultra on Friday and received it securely packed by Sunday morning. The AI features and display are phenomenal!"
            </p>
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--primary)' }}>
                AV
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Ananya Verma</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified Buyer • Bengaluru</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', color: '#f59e0b' }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#f59e0b" />)}
            </div>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-main)', lineHeight: 1.6, fontStyle: 'italic' }}>
              "The NexusAI assistant helped me choose between HP Omen and Acer Nitro gaming laptops in seconds. Super smooth checkout experience."
            </p>
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#d97706' }}>
                KP
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Karan Patel</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified Buyer • Ahmedabad</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', color: '#f59e0b' }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#f59e0b" />)}
            </div>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-main)', lineHeight: 1.6, fontStyle: 'italic' }}>
              "Exceptional customer service and live order timeline tracking. The furniture quality is top-notch solid wood. 10/10 recommendation!"
            </p>
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#059669' }}>
                PS
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Priya Sundaram</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified Buyer • Chennai</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};
