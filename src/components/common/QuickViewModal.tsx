import React, { useState } from 'react';
import { X, ShoppingBag, Heart, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useProducts } from '../../context/ProductContext';
import { formatCurrency } from '../../utils/formatters';
import { StarRating } from './StarRating';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { getCategoryById, getBrandById } = useProducts();
  const [qty, setQty] = useState(1);
  const [addedAnim, setAddedAnim] = useState(false);

  if (!product) return null;

  const category = getCategoryById(product.product_cat);
  const brand = getBrandById(product.product_brand);
  const inWishlist = isInWishlist(product.product_id);
  const isOutOfStock = product.product_qty <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, qty);
    setAddedAnim(true);
    setTimeout(() => {
      setAddedAnim(false);
      onClose();
    }, 1000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '750px',
          background: 'white',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: 'var(--shadow-xl)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'var(--bg-subtle)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
          }}
        >
          <X size={20} color="var(--text-muted)" />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', padding: '2rem' }}>
          {/* Image Column */}
          <div
            style={{
              background: '#f8fafc',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
              minHeight: '320px',
            }}
          >
            <img
              src={product.product_image}
              alt={product.product_title}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';
              }}
              style={{
                maxHeight: '260px',
                maxWidth: '100%',
                objectFit: 'contain',
              }}
            />
          </div>

          {/* Details Column */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span className="badge badge-primary">{category?.cat_title}</span>
              {brand && <span className="badge badge-neutral">{brand.brand_title}</span>}
            </div>

            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', lineHeight: 1.3 }}>
              {product.product_title}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <StarRating rating={product.rating || 4.5} size={16} showValue />
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                • ({product.review_count || 15} reviews)
              </span>
            </div>

            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
              {formatCurrency(product.product_price)}
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem', maxHeight: '90px', overflowY: 'auto' }}>
              {product.product_desc}
            </p>

            {/* Quantity Selector & Add to Cart */}
            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Quantity:</span>
                <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                  <button
                    type="button"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    style={{ padding: '6px 14px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                  >
                    -
                  </button>
                  <span style={{ padding: '6px 12px', fontWeight: 600, minWidth: '32px', textAlign: 'center' }}>{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty(Math.min(product.product_qty, qty + 1))}
                    style={{ padding: '6px 14px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                  >
                    +
                  </button>
                </div>
                <span style={{ fontSize: '0.8125rem', color: product.product_qty > 0 ? 'var(--success)' : 'var(--danger)' }}>
                  {product.product_qty > 0 ? `${product.product_qty} in stock` : 'Out of stock'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`btn ${addedAnim ? 'btn-success' : 'btn-primary'}`}
                  style={{ flex: 1, padding: '0.75rem' }}
                >
                  {addedAnim ? (
                    <>
                      <Check size={18} /> Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} /> Add to Cart
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className="btn"
                  title={inWishlist ? 'Remove from Wishlist' : 'Save to Wishlist'}
                  aria-label={inWishlist ? 'Remove from Wishlist' : 'Save to Wishlist'}
                  style={{
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    backgroundColor: inWishlist ? '#fef2f2' : 'var(--bg-subtle)',
                    border: inWishlist ? '1px solid #fca5a5' : '1px solid var(--border-color)',
                    color: inWishlist ? '#ef4444' : 'var(--text-main)',
                    borderRadius: 'var(--radius-md)',
                    transition: 'all 0.2s ease',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                >
                  <Heart
                    size={18}
                    fill={inWishlist ? '#ef4444' : 'none'}
                    color={inWishlist ? '#ef4444' : 'currentColor'}
                  />
                  <span>{inWishlist ? 'Saved' : 'Wishlist'}</span>
                </button>
              </div>

              <Link
                to={`/product/${product.product_id}`}
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  fontSize: '0.875rem',
                  color: 'var(--primary)',
                  fontWeight: 600,
                  marginTop: '4px',
                }}
              >
                View Complete Specifications & Reviews <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
