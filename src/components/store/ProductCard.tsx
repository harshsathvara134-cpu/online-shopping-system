import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Check } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useProducts } from '../../context/ProductContext';
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
      className="card card-interactive"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '1rem',
        position: 'relative',
        background: 'white',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Top Badges */}
      <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 3, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {product.featured && <span className="badge badge-primary">Featured</span>}
        {isOutOfStock && <span className="badge badge-danger">Out of Stock</span>}
        {isLowStock && !isOutOfStock && <span className="badge badge-warning">Only {product.product_qty} Left</span>}
      </div>

      {/* Action Buttons Floating */}
      <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 3, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={handleWishlistToggle}
          title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
          style={{
            background: 'white',
            border: '1px solid var(--border-color)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
            color: inWishlist ? '#ef4444' : 'var(--text-muted)',
            transition: 'transform 0.2s, color 0.2s',
          }}
        >
          <Heart size={18} fill={inWishlist ? '#ef4444' : 'none'} />
        </button>

        {onQuickView && (
          <button
            onClick={handleQuickView}
            title="Quick View"
            style={{
              background: 'white',
              border: '1px solid var(--border-color)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              color: 'var(--text-muted)',
            }}
          >
            <Eye size={18} />
          </button>
        )}
      </div>

      {/* Image Container */}
      <Link to={`/product/${product.product_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div
          style={{
            width: '100%',
            height: '210px',
            borderRadius: 'var(--radius-md)',
            background: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            marginBottom: '1rem',
            position: 'relative',
          }}
        >
          <img
            src={product.product_image}
            alt={product.product_title}
            onError={(e) => {
              // Fallback placeholder image if not found
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';
            }}
            style={{
              maxHeight: '180px',
              maxWidth: '90%',
              objectFit: 'contain',
              transition: 'transform 0.4s ease',
            }}
          />
        </div>
      </Link>

      {/* Meta Content */}
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {category?.cat_title || 'General'}
          </span>
          {brand && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {brand.brand_title}
            </span>
          )}
        </div>

        <Link to={`/product/${product.product_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              marginBottom: '0.5rem',
              lineHeight: '1.35',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              height: '2.7rem',
            }}
            title={product.product_title}
          >
            {product.product_title}
          </h3>
        </Link>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.75rem' }}>
          <StarRating rating={product.rating || 4.5} size={14} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            ({product.review_count || 12})
          </span>
        </div>

        {/* Price & Action */}
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--border-light)' }}>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
              {formatCurrency(product.product_price)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`btn btn-sm ${addedAnim ? 'btn-success' : 'btn-primary'}`}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              opacity: isOutOfStock ? 0.6 : 1,
            }}
          >
            {addedAnim ? (
              <>
                <Check size={16} /> Added
              </>
            ) : (
              <>
                <ShoppingBag size={16} /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
