import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Grid, Heart, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useLanguage } from '../../context/LanguageContext';

export const MobileNav: React.FC = () => {
  const { toggleCart, itemCount: cartCount } = useCart();
  const { itemCount: wishCount } = useWishlist();
  const { t } = useLanguage();

  return (
    <nav
      className="show-mobile-only"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(226, 232, 240, 0.8)',
        padding: '6px 10px calc(env(safe-area-inset-bottom, 0px) + 8px)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 9000,
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.06)',
      }}
    >
      {/* Home Tab */}
      <NavLink
        to="/"
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3px',
          padding: '5px 12px',
          borderRadius: '12px',
          backgroundColor: isActive ? '#eef2ff' : 'transparent',
          color: isActive ? '#4f46e5' : '#64748b',
          fontSize: '0.6875rem',
          fontWeight: isActive ? 700 : 600,
          textDecoration: 'none',
          transition: 'all 0.2s ease',
          transform: isActive ? 'scale(1.04)' : 'scale(1)',
          minWidth: '58px',
        })}
      >
        <Home size={20} strokeWidth={2.2} />
        <span>{t('navHome')}</span>
      </NavLink>

      {/* Store Catalog Tab */}
      <NavLink
        to="/store"
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3px',
          padding: '5px 12px',
          borderRadius: '12px',
          backgroundColor: isActive ? '#eef2ff' : 'transparent',
          color: isActive ? '#4f46e5' : '#64748b',
          fontSize: '0.6875rem',
          fontWeight: isActive ? 700 : 600,
          textDecoration: 'none',
          transition: 'all 0.2s ease',
          transform: isActive ? 'scale(1.04)' : 'scale(1)',
          minWidth: '58px',
        })}
      >
        <Grid size={20} strokeWidth={2.2} />
        <span>{t('navStore')}</span>
      </NavLink>

      {/* Wishlist Tab */}
      <NavLink
        to="/wishlist"
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3px',
          padding: '5px 12px',
          borderRadius: '12px',
          backgroundColor: isActive ? '#eef2ff' : 'transparent',
          color: isActive ? '#4f46e5' : '#64748b',
          fontSize: '0.6875rem',
          fontWeight: isActive ? 700 : 600,
          position: 'relative',
          textDecoration: 'none',
          transition: 'all 0.2s ease',
          transform: isActive ? 'scale(1.04)' : 'scale(1)',
          minWidth: '58px',
        })}
      >
        <div style={{ position: 'relative' }}>
          <Heart size={20} strokeWidth={2.2} />
          {wishCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-5px',
                right: '-8px',
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: 'white',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                fontSize: '0.625rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 5px rgba(239, 68, 68, 0.4)',
                animation: 'pulse-subtle 2s infinite',
              }}
            >
              {wishCount > 9 ? '9+' : wishCount}
            </span>
          )}
        </div>
        <span>{t('navWishlist')}</span>
      </NavLink>

      {/* Cart Drawer Trigger */}
      <button
        onClick={toggleCart}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3px',
          padding: '5px 12px',
          borderRadius: '12px',
          backgroundColor: 'transparent',
          color: cartCount > 0 ? '#4f46e5' : '#64748b',
          fontSize: '0.6875rem',
          fontWeight: 600,
          border: 'none',
          cursor: 'pointer',
          position: 'relative',
          transition: 'all 0.2s ease',
          minWidth: '58px',
        }}
      >
        <div style={{ position: 'relative' }}>
          <ShoppingBag size={20} strokeWidth={2.2} />
          {cartCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-5px',
                right: '-8px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                color: 'white',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                fontSize: '0.625rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(79, 70, 229, 0.4)',
              }}
            >
              {cartCount > 9 ? '9+' : cartCount}
            </span>
          )}
        </div>
        <span>{t('navCart')}</span>
      </button>

      {/* Account Tab */}
      <NavLink
        to="/my-profile"
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3px',
          padding: '5px 12px',
          borderRadius: '12px',
          backgroundColor: isActive ? '#eef2ff' : 'transparent',
          color: isActive ? '#4f46e5' : '#64748b',
          fontSize: '0.6875rem',
          fontWeight: isActive ? 700 : 600,
          textDecoration: 'none',
          transition: 'all 0.2s ease',
          transform: isActive ? 'scale(1.04)' : 'scale(1)',
          minWidth: '58px',
        })}
      >
        <User size={20} strokeWidth={2.2} />
        <span>{t('myProfile')}</span>
      </NavLink>
    </nav>
  );
};

export default MobileNav;
