import React, { useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  RefreshCw,
  Award,
  ChevronRight,
  Check,
  MessageSquarePlus,
  ZoomIn,
  CheckCircle2,
  CornerDownRight,
  Trash2,
  MessageSquare,
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { ProductCard } from '../components/store/ProductCard';
import { StarRating } from '../components/common/StarRating';
import { formatCurrency, formatDate, getProductImageUrl } from '../utils/formatters';
import { useLanguage } from '../context/LanguageContext';
import { sanitizeInput } from '../utils/security';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id || '0', 10);
  const navigate = useNavigate();

  const { getProductById, getCategoryById, getBrandById, getProductReviews, addReview, replyToReview, deleteReview, products } = useProducts();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const { t } = useLanguage();

  const product = getProductById(productId);
  const reviews = getProductReviews(productId);

  const [activeImg, setActiveImg] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');
  const [addedAnim, setAddedAnim] = useState(false);
  const [wishlistAnim, setWishlistAnim] = useState(false);

  const handleWishlistToggle = () => {
    if (!product) return;
    setWishlistAnim(true);
    toggleWishlist(product);
    setTimeout(() => setWishlistAnim(false), 300);
  };

  // Interactive Image Zoom State
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomPos({ x, y });
  };

  // Review Form State
  const [newRating, setNewRating] = useState(5);
  const [reviewerName, setReviewerName] = useState(user ? `${user.first_name} ${user.last_name}` : '');
  const [reviewerEmail, setReviewerEmail] = useState(user ? user.email : '');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [activeReplyReviewId, setActiveReplyReviewId] = useState<number | null>(null);
  const [activeReplyText, setActiveReplyText] = useState('');

  if (!product) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Product Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          The product you are looking for does not exist or has been removed.
        </p>
        <Link to="/store" className="btn btn-primary">
          Back to Store
        </Link>
      </div>
    );
  }

  const category = getCategoryById(product.product_cat);
  const brand = getBrandById(product.product_brand);
  const inWishlist = isInWishlist(product.product_id);
  const isOutOfStock = product.product_qty <= 0;
  const currentImage = activeImg || product.product_image;

  const allImages = [
    product.product_image,
    product.product_image2,
    product.product_image3,
  ].filter(Boolean) as string[];

  const relatedProducts = products
    .filter(p => p.product_cat === product.product_cat && p.product_id !== product.product_id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1500);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;

    addReview({
      product_id: product.product_id,
      name: sanitizeInput(reviewerName.trim()),
      email: sanitizeInput(reviewerEmail.trim().toLowerCase()),
      rating: Math.max(1, Math.min(5, Math.round(Number(newRating) || 5))),
      review: sanitizeInput(reviewComment.trim()),
    });

    setReviewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 5rem' }}>
      {/* Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
        <Link to="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
        <ChevronRight size={14} />
        <Link to="/store" style={{ color: 'var(--text-muted)' }}>Store</Link>
        {category && (
          <>
            <ChevronRight size={14} />
            <Link to={`/store?cat=${category.cat_id}`} style={{ color: 'var(--text-muted)' }}>{category.cat_title}</Link>
          </>
        )}
        <ChevronRight size={14} />
        <span style={{ color: 'var(--primary)', fontWeight: 600, maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {product.product_title}
        </span>
      </div>

      {/* Main Details Showcase */}
      <div className="product-detail-grid" style={{ marginBottom: '3.5rem' }}>
        {/* Left Column: Image Gallery */}
        <div>
          <div
            ref={imageContainerRef}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseMove={handleImageMouseMove}
            onMouseLeave={() => setIsZoomed(false)}
            style={{
              width: '100%',
              height: '420px',
              backgroundColor: 'white',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              position: 'relative',
              overflow: 'hidden',
              marginBottom: '1rem',
              boxShadow: 'var(--shadow-sm)',
              cursor: isZoomed ? 'crosshair' : 'zoom-in',
              touchAction: 'none',
            }}
          >
            <img
              src={getProductImageUrl(currentImage)}
              alt={product.product_title}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';
              }}
              style={{
                maxHeight: '350px',
                maxWidth: '90%',
                objectFit: 'contain',
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                transform: isZoomed ? 'scale(2.3)' : 'scale(1)',
                transition: isZoomed ? 'transform-origin 0.05s ease-out, transform 0.2s ease-out' : 'transform 0.3s ease-out',
                pointerEvents: 'none',
                willChange: 'transform, transform-origin',
              }}
            />
            {product.featured && (
              <span className="badge badge-primary" style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 2, pointerEvents: 'none' }}>
                Featured Choice
              </span>
            )}
            {/* Zoom Hint Floating Badge */}
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                right: '12px',
                backgroundColor: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(6px)',
                color: 'white',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                pointerEvents: 'none',
                opacity: isZoomed ? 0 : 0.85,
                transition: 'opacity 0.2s ease',
                zIndex: 2,
              }}
            >
              <ZoomIn size={13} /> Hover to Zoom
            </div>
          </div>

          {/* Thumbnail Gallery */}
          {allImages.length > 1 && (
            <div
              style={{
                display: 'flex',
                gap: '10px',
                overflowX: 'auto',
                paddingBottom: '4px',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImg(img)}
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: 'var(--radius-md)',
                    border: currentImage === img ? '2.5px solid var(--primary)' : '1px solid var(--border-color)',
                    background: 'white',
                    padding: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: currentImage === img ? '0 0 0 3px rgba(79, 70, 229, 0.15)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <img src={getProductImageUrl(img)} alt="Thumbnail" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Information & Actions */}
        <div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span className="badge badge-primary">{category?.cat_title}</span>
            {brand && <span className="badge badge-neutral">{brand.brand_title}</span>}
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem', lineHeight: 1.25 }}>
            {product.product_title}
          </h1>

          {/* Ratings Summary */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
            <StarRating rating={product.rating || 4.5} size={18} showValue />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              • ({reviews.length || product.review_count || 12} Verified Customer Reviews)
            </span>
          </div>

          {/* Price Box */}
          <div
            style={{
              padding: '1.25rem 1.5rem',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '1.75rem',
              display: 'flex',
              alignItems: 'baseline',
              gap: '12px',
            }}
          >
            <span style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
              {formatCurrency(product.product_price)}
            </span>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              (Inclusive of all taxes & GST)
            </span>
          </div>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
            {product.product_desc}
          </p>

          {/* Stock Indicator */}
          <div style={{ marginBottom: '1.5rem' }}>
            {isOutOfStock ? (
              <span className="badge badge-danger" style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
                Currently Out of Stock
              </span>
            ) : product.product_qty <= 5 ? (
              <span className="badge badge-warning" style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
                ⚡ Only {product.product_qty} Units Left in Stock - Order Soon
              </span>
            ) : (
              <span className="badge badge-success" style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
                ✓ In Stock & Ready for Same-Day Dispatch ({product.product_qty} available)
              </span>
            )}
          </div>

          {/* Quantity Counter & Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.9375rem', fontWeight: 600 }}>Quantity:</span>
              <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '1rem' }}
                >
                  -
                </button>
                <span style={{ padding: '8px 16px', fontWeight: 700, minWidth: '40px', textAlign: 'center' }}>
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.product_qty, quantity + 1))}
                  style={{ padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '1rem' }}
                >
                  +
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`btn btn-lg ${addedAnim ? 'btn-success' : 'btn-primary'}`}
                style={{ flex: '1 1 200px' }}
              >
                {addedAnim ? (
                  <>
                    <Check size={20} /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag size={20} /> {t('addToCart')}
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="btn btn-lg btn-secondary"
                style={{ flex: '1 1 200px', backgroundColor: '#0f172a', color: 'white' }}
              >
                <Zap size={20} color="#fbbf24" /> {t('buyNow')}
              </button>

              <button
                type="button"
                onClick={handleWishlistToggle}
                className="btn btn-lg"
                title={inWishlist ? 'Remove from Wishlist' : 'Save to Wishlist'}
                aria-label={inWishlist ? 'Remove from Wishlist' : 'Save to Wishlist'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  backgroundColor: inWishlist ? '#fef2f2' : 'white',
                  border: inWishlist ? '1px solid #fca5a5' : '1px solid var(--border-color)',
                  color: inWishlist ? '#ef4444' : 'var(--text-main)',
                  padding: '0.875rem 1.5rem',
                  borderRadius: 'var(--radius-md)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  transform: wishlistAnim ? 'scale(0.95)' : 'scale(1)',
                }}
              >
                <Heart
                  size={20}
                  fill={inWishlist ? '#ef4444' : 'none'}
                  color={inWishlist ? '#ef4444' : 'currentColor'}
                  style={{
                    transition: 'transform 0.2s ease',
                    transform: inWishlist ? 'scale(1.1)' : 'scale(1)',
                  }}
                />
                <span style={{ fontSize: '0.9375rem', fontWeight: 600 }}>
                  {inWishlist ? 'Saved' : 'Wishlist'}
                </span>
              </button>
            </div>
          </div>

          {/* Guarantees Box */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1.25rem', backgroundColor: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Truck size={20} color="var(--primary)" />
              <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Free Express Delivery</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <RefreshCw size={20} color="var(--primary)" />
              <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>7-Day Easy Returns</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={20} color="var(--primary)" />
              <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>100% Genuine Product</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Award size={20} color="var(--primary)" />
              <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Official Manufacturer Warranty</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description, Specs, Reviews */}
      <div className="card" style={{ marginBottom: '4rem', padding: '2rem' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', gap: '1.5rem', marginBottom: '2rem' }}>
          <button
            onClick={() => setActiveTab('desc')}
            style={{
              padding: '0.75rem 0.5rem',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'desc' ? '3px solid var(--primary)' : '3px solid transparent',
              color: activeTab === 'desc' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            Description & Highlights
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            style={{
              padding: '0.75rem 0.5rem',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'reviews' ? '3px solid var(--primary)' : '3px solid transparent',
              color: activeTab === 'reviews' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            Customer Reviews ({reviews.length})
          </button>
        </div>

        {activeTab === 'desc' && (
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Product Overview</h3>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              {product.product_desc}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Category</div>
                <div style={{ fontWeight: 700 }}>{category?.cat_title || 'General'}</div>
              </div>
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Brand</div>
                <div style={{ fontWeight: 700 }}>{brand?.brand_title || 'JAYVEERMart'}</div>
              </div>
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Stock Availability</div>
                <div style={{ fontWeight: 700 }}>{product.product_qty} Units in Stock</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '3rem' }}>
              {/* Existing Reviews List */}
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>
                  Customer Reviews ({reviews.length})
                </h3>
                {reviews.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    No reviews yet. Be the first to share your experience with this product!
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {reviews.map((rev) => (
                      <div
                        key={rev.review_id}
                        style={{
                          padding: '1.25rem',
                          backgroundColor: 'var(--bg-subtle)',
                          borderRadius: 'var(--radius-lg)',
                          border: '1px solid var(--border-light)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{rev.name}</span>
                            {rev.is_verified_purchase && (
                              <span style={{ fontSize: '0.75rem', backgroundColor: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: '4px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <CheckCircle2 size={12} /> Verified Buyer
                              </span>
                            )}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatDate(rev.datetime)}</span>
                            {user?.role === 'admin' && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm('Delete this review as admin?')) {
                                    deleteReview(rev.review_id);
                                  }
                                }}
                                title="Delete Review (Admin)"
                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </div>

                        <div style={{ marginBottom: '0.75rem' }}>
                          <StarRating rating={rev.rating} size={14} />
                        </div>

                        <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: 1.6, marginBottom: rev.admin_reply ? '1rem' : '0.5rem' }}>
                          "{rev.review}"
                        </p>

                        {/* Official Store Admin Reply */}
                        {rev.admin_reply && (
                          <div
                            style={{
                              backgroundColor: 'white',
                              borderRadius: 'var(--radius-md)',
                              borderLeft: '3px solid var(--primary)',
                              padding: '0.875rem 1rem',
                              marginTop: '0.75rem',
                              boxShadow: 'var(--shadow-sm)',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <ShieldCheck size={14} color="var(--primary)" />
                                <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.8125rem' }}>
                                  {rev.admin_name || 'Official JAYVEER Store Response'}
                                </span>
                              </div>
                              {rev.admin_reply_at && (
                                <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                                  {formatDate(rev.admin_reply_at)}
                                </span>
                              )}
                            </div>
                            <p style={{ fontSize: '0.8125rem', color: 'var(--text-main)', lineHeight: 1.5, margin: 0 }}>
                              {rev.admin_reply}
                            </p>
                          </div>
                        )}

                        {/* Admin Inline Quick Reply Trigger */}
                        {user?.role === 'admin' && !rev.admin_reply && activeReplyReviewId !== rev.review_id && (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveReplyReviewId(rev.review_id);
                              setActiveReplyText('');
                            }}
                            style={{
                              marginTop: '0.5rem',
                              background: 'none',
                              border: 'none',
                              color: 'var(--primary)',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <MessageSquare size={12} /> Reply as Admin
                          </button>
                        )}

                        {/* Admin Inline Reply Box */}
                        {activeReplyReviewId === rev.review_id && (
                          <div style={{ marginTop: '0.75rem', backgroundColor: 'white', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary)' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '4px' }}>
                              Post Official Admin Response:
                            </div>
                            <textarea
                              rows={2}
                              value={activeReplyText}
                              onChange={(e) => setActiveReplyText(e.target.value)}
                              placeholder="Write reply..."
                              className="input-field"
                              style={{ fontSize: '0.8125rem', marginBottom: '6px' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                              <button
                                type="button"
                                onClick={() => setActiveReplyReviewId(null)}
                                className="btn btn-secondary btn-sm"
                                style={{ fontSize: '0.75rem', padding: '3px 8px' }}
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (activeReplyText.trim()) {
                                    replyToReview(rev.review_id, activeReplyText.trim(), 'JAYVEER Store Manager');
                                    setActiveReplyReviewId(null);
                                    setActiveReplyText('');
                                  }
                                }}
                                className="btn btn-primary btn-sm"
                                style={{ fontSize: '0.75rem', padding: '3px 8px' }}
                              >
                                Post Reply
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add New Review Form */}
              <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                  <MessageSquarePlus size={20} color="var(--primary)" />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Write a Review</h3>
                </div>

                {reviewSubmitted ? (
                  <div style={{ padding: '1.5rem', backgroundColor: 'var(--success-light)', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--success)' }}>
                    <Check size={32} style={{ margin: '0 auto 8px' }} />
                    <div style={{ fontWeight: 700 }}>Thank you for your review!</div>
                    <div style={{ fontSize: '0.8125rem' }}>Your rating has been recorded.</div>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit}>
                    <div className="input-group">
                      <label className="input-label">Your Rating</label>
                      <StarRating rating={newRating} size={24} interactive onRatingChange={(r) => setNewRating(r)} />
                    </div>

                    <div className="input-group">
                      <label className="input-label">Your Full Name</label>
                      <input
                        type="text"
                        required
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="input-field"
                      />
                    </div>

                    <div className="input-group">
                      <label className="input-label">Email Address</label>
                      <input
                        type="email"
                        required
                        value={reviewerEmail}
                        onChange={(e) => setReviewerEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="input-field"
                      />
                    </div>

                    <div className="input-group">
                      <label className="input-label">Your Review</label>
                      <textarea
                        required
                        rows={4}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="What did you like or dislike about this product?"
                        className="input-field"
                        style={{ resize: 'vertical' }}
                      />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                      Submit Customer Review
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.25rem' }}>
            Customers Also Viewed
          </h2>
          <div className="store-products-grid">
            {relatedProducts.map((p) => (
              <ProductCard key={p.product_id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky Mobile Bottom Buy Bar */}
      <div
        className="mobile-sticky-buy-bar show-mobile-only"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid var(--border-color)',
          padding: '8px 12px calc(env(safe-area-inset-bottom, 0px) + 8px)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 9005,
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div style={{ flex: '0 0 auto' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1.1, fontFamily: 'var(--font-heading)' }}>
            {formatCurrency(product.product_price)}
          </div>
          <div style={{ fontSize: '0.625rem', color: '#15803d', fontWeight: 700 }}>
            {isOutOfStock ? 'Out of stock' : '✓ Free Delivery'}
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`btn btn-secondary ${addedAnim ? 'btn-success' : ''}`}
          style={{ flex: 1, padding: '9px 8px', fontSize: '0.8125rem', fontWeight: 700, borderRadius: '10px' }}
        >
          {addedAnim ? '✓ Added' : t('addToCart')}
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className="btn btn-primary"
          style={{ flex: 1.1, padding: '9px 8px', fontSize: '0.8125rem', fontWeight: 800, borderRadius: '10px', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', border: 'none' }}
        >
          <Zap size={15} color="#fbbf24" style={{ display: 'inline', marginRight: '4px' }} /> {t('buyNow')}
        </button>
      </div>
    </div>
  );
};
