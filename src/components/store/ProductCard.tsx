import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Check } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useProducts } from '../../context/ProductContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatCurrency } from '../../utils/formatters';
import { StarRating } from '../common/StarRating';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { getCategoryById, getBrandById } = useProducts();
  const { t } = useLanguage();
  const [addedAnim, setAddedAnim] = React.useState(false);

  const category = getCategoryById(product.product_cat);
  const brand = getBrandById(product.product_brand);
  const inWishlist = isInWishlist(product.product_id);
  const isOutOfStock = product.product_qty <= 0;
  const isLowStock = product.product_qty > 0 && product.product_qty <= 5;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1200);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  return (
    <div
      className="card card-interactive product-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        background: 'white',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        transition: 'all 0.25s ease',
        overflow: 'hidden',
      }}
    >
      {/* Top Badges */}
      <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 3, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {product.featured && <span className="badge badge-primary" style={{ fontSize: '0.6875rem', padding: '2px 8px' }}>{t('featured')}</span>}
        {isOutOfStock && <span className="badge badge-danger" style={{ fontSize: '0.6875rem', padding: '2px 8px' }}>{t('outOfStock')}</span>}
        {isLowStock && !isOutOfStock && <span className="badge badge-warning" style={{ fontSize: '0.6875rem', padding: '2px 8px' }}>Only {product.product_qty} Left</span>}
      </div>

      {/* Action Buttons Floating */}
      <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 3, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <button
          type="button"
          onClick={handleWishlistToggle}
          title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(4px)',
            border: '1px solid var(--border-color)',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
            color: inWishlist ? '#ef4444' : 'var(--text-muted)',
            transition: 'transform 0.2s, color 0.2s',
          }}
        >
          <Heart size={16} fill={inWishlist ? '#ef4444' : 'none'} />
        </button>

        {onQuickView && (
          <button
            type="button"
            onClick={handleQuickView}
            title="Quick View"
            className="hide-mobile"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(4px)',
              border: '1px solid var(--border-color)',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
              color: 'var(--text-muted)',
            }}
          >
            <Eye size={16} />
          </button>
        )}
      </div>

      {/* Image Container */}
      <Link to={`/product/${product.product_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div
          className="product-card-img-wrap"
          style={{
            width: '100%',
            height: '190px',
            background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            position: 'relative',
            padding: '0.75rem',
          }}
        >
          <img
            src={product.product_image}
            alt={product.product_title}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';
            }}
            style={{
              maxHeight: '100%',
              maxWidth: '92%',
              objectFit: 'contain',
              transition: 'transform 0.35s ease',
            }}
          />
        </div>
      </Link>

      {/* Meta Content */}
      <div className="product-card-body" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
          <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {category?.cat_title || 'General'}
          </span>
          {brand && (
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
              {brand.brand_title}
            </span>
          )}
        </div>

        <Link to={`/product/${product.product_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3
            className="product-card-title"
            style={{
              fontSize: '0.9375rem',
              fontWeight: 600,
              marginBottom: '0.35rem',
              lineHeight: '1.3',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              height: '2.5rem',
            }}
            title={product.product_title}
          >
            {product.product_title}
          </h3>
        </Link>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '0.5rem' }}>
          <StarRating rating={product.rating || 4.5} size={13} />
          <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
            ({product.review_count || 12})
          </span>
        </div>

        {/* Price & Action */}
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--border-light)' }}>
          <div>
            <span className="product-card-price" style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
              {formatCurrency(product.product_price)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`btn btn-sm ${addedAnim ? 'btn-success' : 'btn-primary'}`}
            style={{
              padding: '0.4rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.75rem',
              fontWeight: 700,
              opacity: isOutOfStock ? 0.6 : 1,
            }}
          >
            {addedAnim ? (
              <>
                <Check size={14} /> Added
              </>
            ) : (
              <>
                <ShoppingBag size={14} /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
