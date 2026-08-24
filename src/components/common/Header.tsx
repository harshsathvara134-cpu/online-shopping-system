import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  Menu,
  X,
  ShieldCheck,
  Package,
  LogOut,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useProducts } from '../../context/ProductContext';
import { formatCurrency } from '../../utils/formatters';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '../../context/LanguageContext';

export const Header: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { toggleCart, itemCount: cartCount, total: cartTotal } = useCart();
  const { itemCount: wishCount } = useWishlist();
  const { products, categories } = useProducts();
  const { t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter products for search preview
  const searchResults = searchQuery.trim().length > 1
    ? products.filter(p =>
        p.product_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.product_keywords.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchDropdown(false);
      navigate(`/store?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 9000, backgroundColor: 'white', borderBottom: '1px solid var(--border-color)' }}>
      {/* Top Banner Bar */}
      <div
        style={{
          background: 'linear-gradient(90deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
          color: 'white',
          fontSize: '0.78125rem',
          padding: '0.4rem 1.5rem',
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ backgroundColor: '#f59e0b', color: '#0f172a', padding: '2px 6px', borderRadius: '4px', fontWeight: 800, fontSize: '0.6875rem' }}>
              OFFER
            </span>
            <span>Get 20% OFF with code <strong>SUPER20</strong> • Free Shipping on orders ₹1,000+</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }} className="hide-mobile">
            <Link to="/my-orders" style={{ color: '#cbd5e1' }}>Track Order</Link>
            <span style={{ opacity: 0.3 }}>|</span>
            <Link to="/store" style={{ color: '#cbd5e1' }}>Explore Store</Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)',
            }}
          >
            <ShoppingBag size={22} />
          </div>
          <div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.03em', fontFamily: 'var(--font-heading)', color: '#0f172a' }}>
              Nexus<span style={{ color: 'var(--primary)' }}>Mart</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.625rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '-4px' }}>
              Enterprise Store
            </span>
          </div>
        </Link>

        {/* Live Search Bar */}
        <div ref={searchRef} style={{ position: 'relative', flex: 1, maxWidth: '520px' }} className="hide-mobile">
          <form onSubmit={handleSearchSubmit}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                className="input-field"
                style={{
                  paddingLeft: '2.75rem',
                  paddingRight: '5rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.875rem',
                }}
              />
              <Search
                size={18}
                style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }}
              />
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                style={{
                  position: 'absolute',
                  right: '5px',
                  borderRadius: 'var(--radius-full)',
                  padding: '5px 14px',
                }}
              >
                Search
              </button>
            </div>
          </form>

          {/* Search Live Preview Dropdown */}
          {showSearchDropdown && searchResults.length > 0 && (
            <div
              className="glass-panel animate-fade-in"
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '8px',
                backgroundColor: 'white',
                zIndex: 9999,
                padding: '0.5rem',
                boxShadow: 'var(--shadow-xl)',
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', padding: '6px 12px', borderBottom: '1px solid var(--border-light)' }}>
                Matching Products
              </div>
              {searchResults.map((prod) => (
                <Link
                  key={prod.product_id}
                  to={`/product/${prod.product_id}`}
                  onClick={() => setShowSearchDropdown(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <img
                    src={prod.product_image}
                    alt={prod.product_title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';
                    }}
                    style={{ width: '36px', height: '36px', objectFit: 'contain', background: '#f1f5f9', borderRadius: '4px' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {prod.product_title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>
                      {formatCurrency(prod.product_price)}
                    </div>
                  </div>
                </Link>
              ))}
              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '4px', textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8125rem', fontWeight: 600, padding: '6px', cursor: 'pointer' }}
                >
                  View all results for "{searchQuery}"
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Language Selector (Next to Search Bar) */}
        <div className="hide-mobile">
          <LanguageSelector />
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Wishlist Button */}
          <Link
            to="/wishlist"
            className="btn btn-outline btn-icon"
            style={{ position: 'relative', border: 'none' }}
            title="Wishlist"
          >
            <Heart size={22} />
            {wishCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '0px',
                  right: '0px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {wishCount}
              </span>
            )}
          </Link>

          {/* Cart Button */}
          <button
            onClick={toggleCart}
            className="btn btn-primary"
            style={{ padding: '0.5rem 0.9rem', gap: '8px', borderRadius: 'var(--radius-full)' }}
          >
            <div style={{ position: 'relative' }}>
              <ShoppingBag size={19} />
              {cartCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-8px',
                    backgroundColor: '#f59e0b',
                    color: '#0f172a',
                    borderRadius: '50%',
                    width: '17px',
                    height: '17px',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hide-mobile" style={{ fontWeight: 700, fontSize: '0.875rem' }}>
              {cartTotal > 0 ? formatCurrency(cartTotal) : 'Cart'}
            </span>
          </button>

          {/* User Profile Dropdown */}
          <div ref={userMenuRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="btn btn-secondary btn-icon"
              style={{
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0.4rem 0.75rem',
              }}
            >
              <UserIcon size={18} />
              <span className="hide-mobile" style={{ fontSize: '0.85rem', fontWeight: 600, maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user ? user.first_name : 'Sign In'}
              </span>
              <ChevronDown size={14} />
            </button>

            {showUserMenu && (
              <div
                className="glass-panel animate-fade-in"
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  width: '220px',
                  backgroundColor: 'white',
                  zIndex: 9999,
                  padding: '0.5rem',
                  boxShadow: 'var(--shadow-xl)',
                }}
              >
                {isAuthenticated ? (
                  <>
                    <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-light)' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>
                        {user?.first_name} {user?.last_name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {user?.email}
                      </div>
                    </div>

                    <Link
                      to="/my-profile"
                      onClick={() => setShowUserMenu(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', fontSize: '0.875rem', borderRadius: 'var(--radius-sm)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <UserIcon size={16} /> My Profile
                    </Link>

                    <Link
                      to="/my-orders"
                      onClick={() => setShowUserMenu(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', fontSize: '0.875rem', borderRadius: 'var(--radius-sm)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <Package size={16} /> My Orders
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setShowUserMenu(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 600 }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <ShieldCheck size={16} /> Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        fontSize: '0.875rem',
                        color: 'var(--danger)',
                        background: 'none',
                        border: 'none',
                        borderTop: '1px solid var(--border-light)',
                        marginTop: '4px',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '6px' }}>
                    <Link
                      to="/login"
                      onClick={() => setShowUserMenu(false)}
                      className="btn btn-primary btn-sm"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/login?tab=register"
                      onClick={() => setShowUserMenu(false)}
                      className="btn btn-secondary btn-sm"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      Create Account
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-secondary btn-icon show-mobile-only"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Navigation Category Bar */}
      <nav style={{ backgroundColor: 'var(--bg-subtle)', borderTop: '1px solid var(--border-light)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', overflowX: 'auto', padding: '0.5rem 1.5rem' }}>
          <Link
            to="/store"
            style={{
              fontSize: '0.875rem',
              fontWeight: 700,
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
            }}
          >
            <Sparkles size={16} /> All Categories
          </Link>

          {categories.map((cat) => (
            <Link
              key={cat.cat_id}
              to={`/store?cat=${cat.cat_id}`}
              style={{
                fontSize: '0.875rem',
                fontWeight: location.search.includes(`cat=${cat.cat_id}`) ? 700 : 500,
                color: location.search.includes(`cat=${cat.cat_id}`) ? 'var(--primary)' : 'var(--text-main)',
                whiteSpace: 'nowrap',
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              {cat.cat_title}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Search Bar Drop */}
      <div className="show-mobile-only" style={{ padding: '0.5rem 1rem', background: 'white', borderTop: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <form onSubmit={handleSearchSubmit} style={{ flex: 1 }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '2.5rem', borderRadius: 'var(--radius-full)', fontSize: '0.8125rem' }}
            />
            <Search size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
          </div>
        </form>
        <LanguageSelector />
      </div>
    </header>
  );
};
