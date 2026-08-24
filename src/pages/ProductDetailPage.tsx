import React, { useState } from 'react';
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
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { ProductCard } from '../components/store/ProductCard';
import { StarRating } from '../components/common/StarRating';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useLanguage } from '../context/LanguageContext';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const productId = Number(id);

  const { getProductById, getCategoryById, getBrandById, getProductReviews, addReview, products } = useProducts();
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

  // Review Form State
  const [newRating, setNewRating] = useState(5);
  const [reviewerName, setReviewerName] = useState(user ? `${user.first_name} ${user.last_name}` : '');
  const [reviewerEmail, setReviewerEmail] = useState(user ? user.email : '');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

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
      name: reviewerName.trim(),
      email: reviewerEmail.trim(),
      rating: newRating,
      review: reviewComment.trim(),
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
            }}
          >
            <img
              src={currentImage}
              alt={product.product_title}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';
              }}
              style={{
                maxHeight: '350px',
                maxWidth: '90%',
                objectFit: 'contain',
                transition: 'transform 0.3s ease',
              }}
            />
            {product.featured && (
              <span className="badge badge-primary" style={{ position: 'absolute', top: '16px', left: '16px' }}>
                Featured Choice
              </span>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {allImages.length > 1 && (
            <div style={{ display: 'flex', gap: '12px' }}>
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImg(img)}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: 'var(--radius-md)',
                    border: currentImage === img ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    background: 'white',
                    padding: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img src={img} alt="Thumbnail" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
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
                onClick={() => toggleWishlist(product)}
                className="btn btn-outline btn-lg btn-icon"
                title="Save to Wishlist"
              >
                <Heart size={22} fill={inWishlist ? '#ef4444' : 'none'} color={inWishlist ? '#ef4444' : 'inherit'} />
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
                <div style={{ fontWeight: 700 }}>{brand?.brand_title || 'NexusMart'}</div>
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
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{rev.name}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatDate(rev.datetime)}</span>
                        </div>
                        <div style={{ marginBottom: '0.75rem' }}>
                          <StarRating rating={rev.rating} size={14} />
                        </div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                          {rev.review}
                        </p>
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
      <div className="mobile-sticky-buy-bar show-mobile-only">
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`btn btn-secondary ${addedAnim ? 'btn-success' : ''}`}
          style={{ flex: 1, padding: '10px', fontSize: '0.875rem' }}
        >
          {addedAnim ? '✓ Added' : t('addToCart')}
        </button>

        <button
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className="btn btn-primary"
          style={{ flex: 1, padding: '10px', fontSize: '0.875rem' }}
        >
          {t('buyNow')} ⚡
        </button>
      </div>
    </div>
  );
};
