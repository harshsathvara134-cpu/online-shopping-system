import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Grid, Heart, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

export const MobileNav: React.FC = () => {
  const { toggleCart, itemCount: cartCount } = useCart();
  const { itemCount: wishCount } = useWishlist();
  const { isAuthenticated } = useAuth();

  return (
    <nav
      className="show-mobile-only"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--border-color)',
        padding: '8px 12px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 9000,
        boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.05)',
      }}
    >
      <NavLink
        to="/"
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          color: isActive ? 'var(--primary)' : 'var(--text-muted)',
          fontSize: '0.6875rem',
          fontWeight: 600,
          textDecoration: 'none',
        })}
      >
        <Home size={20} />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/store"
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          color: isActive ? 'var(--primary)' : 'var(--text-muted)',
          fontSize: '0.6875rem',
          fontWeight: 600,
          textDecoration: 'none',
        })}
      >
        <Grid size={20} />
        <span>Store</span>
      </NavLink>

      <NavLink
        to="/wishlist"
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          color: isActive ? 'var(--primary)' : 'var(--text-muted)',
          fontSize: '0.6875rem',
          fontWeight: 600,
          position: 'relative',
          textDecoration: 'none',
        })}
      >
        <Heart size={20} />
        {wishCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-4px',
              right: '2px',
              background: '#ef4444',
              color: 'white',
              borderRadius: '50%',
              width: '15px',
              height: '15px',
              fontSize: '0.6rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {wishCount}
          </span>
        )}
        <span>Wishlist</span>
      </NavLink>

      <button
        onClick={toggleCart}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          color: 'var(--text-muted)',
          fontSize: '0.6875rem',
          fontWeight: 600,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          position: 'relative',
        }}
      >
        <ShoppingBag size={20} />
        {cartCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-4px',
              right: '2px',
              background: 'var(--primary)',
              color: 'white',
              borderRadius: '50%',
              width: '15px',
              height: '15px',
              fontSize: '0.6rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {cartCount}
          </span>
        )}
        <span>Cart</span>
      </button>

      <NavLink
        to={isAuthenticated ? '/my-profile' : '/login'}
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          color: isActive ? 'var(--primary)' : 'var(--text-muted)',
          fontSize: '0.6875rem',
          fontWeight: 600,
          textDecoration: 'none',
        })}
      >
        <User size={20} />
        <span>{isAuthenticated ? 'Profile' : 'Login'}</span>
      </NavLink>
    </nav>
  );
};
