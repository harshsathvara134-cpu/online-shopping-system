import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  CornerDownRight,
  ShieldCheck,
  Plus,
  X,
  Send,
  Sparkles,
  ExternalLink,
  ThumbsUp,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { Review } from '../../types';
import { StarRating } from '../../components/common/StarRating';
import { formatDate, getProductImageUrl } from '../../utils/formatters';
import { sanitizeInput } from '../../utils/security';

export const AdminReviews: React.FC = () => {
  const { reviews, products, replyToReview, deleteReview, updateReviewStatus, addReview } = useProducts();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRating, setFilterRating] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterProduct, setFilterProduct] = useState<string>('ALL');

  // Modals
  const [replyingReview, setReplyingReview] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState('');
  const [adminName, setAdminName] = useState('JAYVEER Support Team');
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);

  // New Review Form State
  const [newProductId, setNewProductId] = useState<number>(products[0]?.product_id || 5);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [newIsVerified, setNewIsVerified] = useState(true);
  const [newAdminReply, setNewAdminReply] = useState('');

  // Quick Canned Templates for Admin Reply
  const cannedReplies = [
    'Thank you so much for your positive feedback! We are delighted you loved the product.',
    'We appreciate your business and kind review! Hope to serve you again soon.',
    'Thank you for reaching out. We have noted your suggestion and our team is continuously improving.',
    'We apologize for the inconvenience. Please contact support@jayveermart.com and we will make it right immediately.',
  ];

  // Stats calculation
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1) : '5.0';
  const verifiedCount = reviews.filter(r => r.is_verified_purchase).length;
  const repliedCount = reviews.filter(r => r.admin_reply && r.admin_reply.trim().length > 0).length;
  const pendingReplyCount = totalReviews - repliedCount;

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter(rev => {
      const prod = products.find(p => p.product_id === rev.product_id);
      const prodTitle = prod ? prod.product_title.toLowerCase() : '';
      const matchesSearch =
        rev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rev.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rev.review.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prodTitle.includes(searchQuery.toLowerCase());

      const matchesRating = filterRating === 'ALL' || rev.rating.toString() === filterRating;
      const matchesStatus = filterStatus === 'ALL' || (rev.status || 'Approved') === filterStatus;
      const matchesProduct = filterProduct === 'ALL' || rev.product_id.toString() === filterProduct;

      return matchesSearch && matchesRating && matchesStatus && matchesProduct;
    });
  }, [reviews, products, searchQuery, filterRating, filterStatus, filterProduct]);

  const handleOpenReplyModal = (rev: Review) => {
    setReplyingReview(rev);
    setReplyText(rev.admin_reply || '');
    setAdminName(rev.admin_name || 'JAYVEER Support Team');
  };

  const handleSaveReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingReview || !replyText.trim()) return;

    replyToReview(replyingReview.review_id, sanitizeInput(replyText.trim()), sanitizeInput(adminName.trim()));
    setReplyingReview(null);
    setReplyText('');
  };

  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newReviewText.trim()) return;

    addReview({
      product_id: Number(newProductId),
      name: sanitizeInput(newName.trim()),
      email: sanitizeInput(newEmail.trim().toLowerCase() || 'customer@jayveermart.com'),
      rating: newRating,
      review: sanitizeInput(newReviewText.trim()),
      is_verified_purchase: newIsVerified,
      status: 'Approved',
      admin_reply: newAdminReply.trim() ? sanitizeInput(newAdminReply.trim()) : null,
      admin_name: newAdminReply.trim() ? 'JAYVEER Store Manager' : null,
      admin_reply_at: newAdminReply.trim() ? new Date().toISOString().replace('T', ' ').substring(0, 19) : null,
    });

    setIsAddReviewOpen(false);
    setNewName('');
    setNewEmail('');
    setNewReviewText('');
    setNewAdminReply('');
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MessageSquare color="#4f46e5" size={28} /> Customer Reviews Management
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '4px' }}>
            Moderate ratings, respond as store owner, and maintain customer trust.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setIsAddReviewOpen(true)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.625rem 1.25rem' }}
          >
            <Plus size={18} /> Add Review / Testimonial
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Total Reviews</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}>
              <MessageSquare size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0f172a' }}>{totalReviews}</div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, marginTop: '4px' }}>
            ✓ {verifiedCount} Verified Buyer Purchases
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Average Rating</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
              <Star size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {avgRating} <span style={{ fontSize: '1rem', color: '#f59e0b' }}>★</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
            Across all active catalog products
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Admin Replied</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
              <CornerDownRight size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0f172a' }}>
            {repliedCount} <span style={{ fontSize: '1rem', color: '#64748b', fontWeight: 500 }}>({totalReviews > 0 ? Math.round((repliedCount / totalReviews) * 100) : 0}%)</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600, marginTop: '4px' }}>
            Official Store Owner Responses
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Pending Reply</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
              <AlertTriangle size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0f172a' }}>{pendingReplyCount}</div>
          <div style={{ fontSize: '0.75rem', color: pendingReplyCount > 0 ? '#ef4444' : '#10b981', fontWeight: 600, marginTop: '4px' }}>
            {pendingReplyCount > 0 ? 'Awaiting merchant response' : 'All reviews answered!'}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        style={{
          backgroundColor: 'white',
          padding: '1.25rem',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          marginBottom: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', flex: '1 1 300px', alignItems: 'center', backgroundColor: '#f8fafc', padding: '8px 14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <Search size={18} color="#94a3b8" style={{ marginRight: '8px' }} />
          <input
            type="text"
            placeholder="Search by customer, email, text or product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.875rem' }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
              <X size={16} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
          {/* Rating Filter */}
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', backgroundColor: 'white', cursor: 'pointer' }}
          >
            <option value="ALL">All Star Ratings</option>
            <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
            <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
            <option value="3">⭐⭐⭐ (3 Stars)</option>
            <option value="2">⭐⭐ (2 Stars)</option>
            <option value="1">⭐ (1 Star)</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', backgroundColor: 'white', cursor: 'pointer' }}
          >
            <option value="ALL">All Moderation Status</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Flagged">Flagged</option>
            <option value="Rejected">Rejected</option>
          </select>

          {/* Product Filter */}
          <select
            value={filterProduct}
            onChange={(e) => setFilterProduct(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', backgroundColor: 'white', cursor: 'pointer', maxWidth: '200px' }}
          >
            <option value="ALL">All Products</option>
            {products.map(p => (
              <option key={p.product_id} value={p.product_id.toString()}>
                {p.product_title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <div style={{ backgroundColor: 'white', padding: '4rem 2rem', borderRadius: '16px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
          <MessageSquare size={48} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>No Reviews Found</h3>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            No reviews match your current filters or search criteria.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterRating('ALL');
              setFilterStatus('ALL');
              setFilterProduct('ALL');
            }}
            className="btn btn-secondary"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredReviews.map((rev) => {
            const product = products.find(p => p.product_id === rev.product_id);

            return (
              <div
                key={rev.review_id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  border: rev.status === 'Flagged' ? '1.5px solid #f59e0b' : '1px solid #e2e8f0',
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                {/* Header: Product details + Status + Actions */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid #f1f5f9',
                    marginBottom: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {product && (
                      <img
                        src={getProductImageUrl(product.product_image)}
                        alt={product.product_title}
                        style={{
                          width: '52px',
                          height: '52px',
                          objectFit: 'contain',
                          backgroundColor: '#f8fafc',
                          borderRadius: '8px',
                          padding: '4px',
                          border: '1px solid #e2e8f0',
                        }}
                      />
                    )}
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>PRODUCT</div>
                      <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>
                        {product ? product.product_title : `Product ID #${rev.product_id}`}
                      </div>
                      {product && (
                        <Link
                          to={`/product/${product.product_id}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ fontSize: '0.75rem', color: '#4f46e5', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}
                        >
                          View on live store <ExternalLink size={11} />
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Actions & Status Tag */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {/* Moderation Status Dropdown */}
                    <select
                      value={rev.status || 'Approved'}
                      onChange={(e) => updateReviewStatus(rev.review_id, e.target.value as any)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        border: '1px solid #cbd5e1',
                        backgroundColor:
                          (rev.status || 'Approved') === 'Approved'
                            ? '#dcfce7'
                            : (rev.status || 'Approved') === 'Flagged'
                            ? '#fef3c7'
                            : '#fee2e2',
                        color:
                          (rev.status || 'Approved') === 'Approved'
                            ? '#166534'
                            : (rev.status || 'Approved') === 'Flagged'
                            ? '#92400e'
                            : '#991b1b',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="Approved">✓ Approved</option>
                      <option value="Pending">⏳ Pending</option>
                      <option value="Flagged">⚠️ Flagged</option>
                      <option value="Rejected">✕ Rejected</option>
                    </select>

                    <button
                      onClick={() => handleOpenReplyModal(rev)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        backgroundColor: rev.admin_reply ? '#e0e7ff' : '#4f46e5',
                        color: rev.admin_reply ? '#4338ca' : 'white',
                        border: 'none',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                      }}
                    >
                      <MessageSquare size={14} />
                      {rev.admin_reply ? 'Edit Admin Reply' : 'Reply as Store Admin'}
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this customer review?')) {
                          deleteReview(rev.review_id);
                        }
                      }}
                      title="Delete Review"
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        backgroundColor: '#fee2e2',
                        color: '#b91c1c',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Customer Review Info */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9375rem' }}>{rev.name}</span>
                      <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>({rev.email})</span>
                      {rev.is_verified_purchase && (
                        <span style={{ fontSize: '0.75rem', backgroundColor: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: '4px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={12} /> Verified Buyer
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {formatDate(rev.datetime)}
                    </span>
                  </div>

                  <div style={{ marginBottom: '8px' }}>
                    <StarRating rating={rev.rating} size={16} />
                  </div>

                  <p style={{ color: '#334155', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                    "{rev.review}"
                  </p>
                </div>

                {/* Admin Reply Display (If exists) */}
                {rev.admin_reply && (
                  <div
                    style={{
                      backgroundColor: '#f8fafc',
                      borderRadius: '12px',
                      borderLeft: '4px solid #4f46e5',
                      padding: '1rem 1.25rem',
                      marginTop: '1rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ShieldCheck size={16} color="#4f46e5" />
                        <span style={{ fontWeight: 700, color: '#4f46e5', fontSize: '0.8125rem' }}>
                          {rev.admin_name || 'JAYVEER Official Store Response'}
                        </span>
                      </div>
                      {rev.admin_reply_at && (
                        <span style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>
                          {formatDate(rev.admin_reply_at)}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                      {rev.admin_reply}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Reply as Admin */}
      {replyingReview && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              maxWidth: '600px',
              width: '100%',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              overflow: 'hidden',
              animation: 'slide-in-right 0.25s ease',
            }}
          >
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck color="#4f46e5" size={24} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Reply to Customer Review</h3>
              </div>
              <button
                onClick={() => setReplyingReview(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveReply} style={{ padding: '1.5rem' }}>
              {/* Review Snippet */}
              <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '12px', marginBottom: '1.25rem', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{replyingReview.name}</span>
                  <StarRating rating={replyingReview.rating} size={13} />
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', fontStyle: 'italic', margin: 0 }}>
                  "{replyingReview.review}"
                </p>
              </div>

              {/* Admin Signature */}
              <div className="input-group" style={{ marginBottom: '1rem' }}>
                <label className="input-label" style={{ fontSize: '0.8125rem' }}>Admin Display Title</label>
                <input
                  type="text"
                  required
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder="e.g. JAYVEER Store Manager, Support Team"
                  className="input-field"
                />
              </div>

              {/* Canned Responses Helper */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                  <Sparkles size={13} color="#4f46e5" /> Quick Response Templates:
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {cannedReplies.map((template, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setReplyText(template)}
                      style={{
                        padding: '4px 8px',
                        fontSize: '0.75rem',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                        backgroundColor: '#f1f5f9',
                        color: '#334155',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      {template.substring(0, 42)}...
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Area */}
              <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                <label className="input-label" style={{ fontSize: '0.8125rem' }}>Official Response Message</label>
                <textarea
                  required
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write your official response to this customer..."
                  className="input-field"
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setReplyingReview(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Send size={16} /> Publish Response
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add New Review / Testimonial */}
      {isAddReviewOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              maxWidth: '650px',
              width: '100%',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus color="#4f46e5" size={24} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Add Customer Review / Testimonial</h3>
              </div>
              <button
                onClick={() => setIsAddReviewOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddReviewSubmit} style={{ padding: '1.5rem', maxHeight: '80vh', overflowY: 'auto' }}>
              {/* Product Selector */}
              <div className="input-group" style={{ marginBottom: '1rem' }}>
                <label className="input-label">Select Target Product</label>
                <select
                  value={newProductId}
                  onChange={(e) => setNewProductId(Number(e.target.value))}
                  className="input-field"
                  required
                >
                  {products.map((p) => (
                    <option key={p.product_id} value={p.product_id}>
                      {p.product_title} (ID #{p.product_id})
                    </option>
                  ))}
                </select>
              </div>

              {/* Customer Name & Email */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="input-group">
                  <label className="input-label">Customer Full Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Rajesh Patel"
                    className="input-field"
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Customer Email</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="customer@example.com"
                    className="input-field"
                  />
                </div>
              </div>

              {/* Rating */}
              <div className="input-group" style={{ marginBottom: '1rem' }}>
                <label className="input-label">Star Rating (1 - 5)</label>
                <StarRating rating={newRating} size={26} interactive onRatingChange={(r) => setNewRating(r)} />
              </div>

              {/* Review Text */}
              <div className="input-group" style={{ marginBottom: '1rem' }}>
                <label className="input-label">Customer Review Text</label>
                <textarea
                  required
                  rows={3}
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  placeholder="What did the customer say about this product?"
                  className="input-field"
                />
              </div>

              {/* Verified Buyer Checkbox */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <input
                  type="checkbox"
                  id="isVerified"
                  checked={newIsVerified}
                  onChange={(e) => setNewIsVerified(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#4f46e5' }}
                />
                <label htmlFor="isVerified" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>
                  Mark as Verified Purchase Buyer
                </label>
              </div>

              {/* Optional Admin Reply */}
              <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                <label className="input-label">Optional Admin Reply (Pre-attached)</label>
                <textarea
                  rows={2}
                  value={newAdminReply}
                  onChange={(e) => setNewAdminReply(e.target.value)}
                  placeholder="Thank you for your order! - JAYVEER Support"
                  className="input-field"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddReviewOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
