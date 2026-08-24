import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';

export const WishlistPage: React.FC = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (item: typeof wishlistItems[0]) => {
    addToCart(item.product, 1);
    removeFromWishlist(item.p_id);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: '#fef2f2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            color: '#ef4444',
          }}
        >
          <Heart size={48} />
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>Your Wishlist is Empty</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '450px', margin: '0 auto 2rem' }}>
          Explore our store and tap the heart icon on your favorite items to save them here for later.
        </p>
        <Link to="/store" className="btn btn-primary btn-lg" style={{ borderRadius: 'var(--radius-full)' }}>
          Explore Products <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>My Saved Wishlist</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            {wishlistItems.length} saved item(s) ready to be moved to your cart
          </p>
        </div>

        <button onClick={clearWishlist} className="btn btn-outline" style={{ color: 'var(--danger)' }}>
          <Trash2 size={16} /> Clear Wishlist
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {wishlistItems.map((item) => (
          <div
            key={item.id}
            className="card card-interactive"
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '1.25rem',
              position: 'relative',
            }}
          >
            <button
              onClick={() => removeFromWishlist(item.p_id)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'white',
                border: '1px solid var(--border-color)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--danger)',
                boxShadow: 'var(--shadow-sm)',
              }}
              title="Remove from Wishlist"
            >
              <Trash2 size={16} />
            </button>

            <Link to={`/product/${item.product.product_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div
                style={{
                  width: '100%',
                  height: '180px',
                  backgroundColor: '#f8fafc',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <img
                  src={item.product.product_image}
                  alt={item.product.product_title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';
                  }}
                  style={{ maxHeight: '150px', maxWidth: '90%', objectFit: 'contain' }}
                />
              </div>

              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.product.product_title}
              </h3>
            </Link>

            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
              {formatCurrency(item.product.product_price)}
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleMoveToCart(item)}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.65rem' }}
              >
                <ShoppingBag size={18} /> Move to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
