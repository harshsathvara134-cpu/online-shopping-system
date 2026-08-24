import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Check,
  Package,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';

export const AdminProducts: React.FC = () => {
  const { products, categories, brands, addProduct, updateProduct, deleteProduct } = useProducts();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [catId, setCatId] = useState<number>(categories[0]?.cat_id || 1);
  const [brandId, setBrandId] = useState<number>(brands[0]?.brand_id || 1);
  const [price, setPrice] = useState<number>(999);
  const [qty, setQty] = useState<number>(10);
  const [image, setImage] = useState<string>('/product_images/1772203299_1770809937_samsung-galaxy-s25-ultra-front-and-back-2.png');
  const [keywords, setKeywords] = useState('');
  const [description, setDescription] = useState('');
  const [featured, setFeatured] = useState(false);
  const [trending, setTrending] = useState(false);

  const openAddModal = () => {
    setEditingProduct(null);
    setTitle('');
    setCatId(categories[0]?.cat_id || 1);
    setBrandId(brands[0]?.brand_id || 1);
    setPrice(1999);
    setQty(15);
    setImage('/product_images/1772203299_1770809937_samsung-galaxy-s25-ultra-front-and-back-2.png');
    setKeywords('');
    setDescription('');
    setFeatured(false);
    setTrending(false);
    setModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setTitle(p.product_title);
    setCatId(p.product_cat);
    setBrandId(p.product_brand);
    setPrice(p.product_price);
    setQty(p.product_qty);
    setImage(p.product_image);
    setKeywords(p.product_keywords);
    setDescription(p.product_desc);
    setFeatured(!!p.featured);
    setTrending(!!p.trending);
    setModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        product_title: title.trim(),
        product_cat: Number(catId),
        product_brand: Number(brandId),
        product_price: Number(price),
        product_qty: Number(qty),
        product_image: image.trim(),
        product_keywords: keywords.trim(),
        product_desc: description.trim(),
        featured,
        trending,
      });
    } else {
      addProduct({
        product_title: title.trim(),
        product_cat: Number(catId),
        product_brand: Number(brandId),
        product_price: Number(price),
        product_qty: Number(qty),
        product_image: image.trim(),
        product_keywords: keywords.trim(),
        product_desc: description.trim(),
        featured,
        trending,
      });
    }

    setModalOpen(false);
  };

  const filteredProducts = products.filter((p) => {
    if (selectedCat !== null && p.product_cat !== selectedCat) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.product_title.toLowerCase().includes(q) || p.product_keywords.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Product Catalog Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Add, update inventory quantities, and manage catalog items
          </p>
        </div>

        <button onClick={openAddModal} className="btn btn-primary" style={{ gap: '6px' }}>
          <Plus size={18} /> Add New Product
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 300px' }}>
          <input
            type="text"
            placeholder="Search products by title or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '2.5rem' }}
          />
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
        </div>

        <select
          value={selectedCat || ''}
          onChange={(e) => setSelectedCat(e.target.value ? Number(e.target.value) : null)}
          style={{
            padding: '8px 14px',
            borderRadius: 'var(--radius-md)',
            border: '1.5px solid var(--border-color)',
            backgroundColor: 'white',
            fontWeight: 600,
            fontSize: '0.875rem',
            outline: 'none',
          }}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.cat_id} value={c.cat_id}>
              {c.cat_title}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 16px' }}>Product</th>
                <th style={{ padding: '12px 16px' }}>Category</th>
                <th style={{ padding: '12px 16px' }}>Brand</th>
                <th style={{ padding: '12px 16px' }}>Price</th>
                <th style={{ padding: '12px 16px' }}>Stock Qty</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => {
                const cat = categories.find(c => c.cat_id === p.product_cat);
                const brand = brands.find(b => b.brand_id === p.product_brand);

                return (
                  <tr key={p.product_id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={p.product_image}
                          alt={p.product_title}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';
                          }}
                          style={{ width: '48px', height: '48px', objectFit: 'contain', backgroundColor: '#f8fafc', borderRadius: '6px', padding: '4px' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{p.product_title}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: #{p.product_id}</div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '12px 16px' }}>
                      <span className="badge badge-primary">{cat?.cat_title || 'General'}</span>
                    </td>

                    <td style={{ padding: '12px 16px', fontWeight: 500 }}>
                      {brand?.brand_title || 'Generic'}
                    </td>

                    <td style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--primary)' }}>
                      {formatCurrency(p.product_price)}
                    </td>

                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          onClick={() => updateProduct({ ...p, product_qty: Math.max(0, p.product_qty - 1) })}
                          style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'white', cursor: 'pointer', fontWeight: 700 }}
                        >
                          -
                        </button>
                        <span style={{ fontWeight: 700, minWidth: '24px', textAlign: 'center', color: p.product_qty <= 5 ? 'var(--danger)' : 'inherit' }}>
                          {p.product_qty}
                        </span>
                        <button
                          onClick={() => updateProduct({ ...p, product_qty: p.product_qty + 1 })}
                          style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'white', cursor: 'pointer', fontWeight: 700 }}
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          onClick={() => openEditModal(p)}
                          className="btn btn-sm btn-secondary btn-icon"
                          title="Edit Product"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete "${p.product_title}"?`)) {
                              deleteProduct(p.product_id);
                            }
                          }}
                          className="btn btn-sm btn-secondary btn-icon"
                          style={{ color: 'var(--danger)' }}
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            className="animate-fade-in"
            style={{
              backgroundColor: 'white',
              borderRadius: 'var(--radius-xl)',
              maxWidth: '650px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2rem',
              position: 'relative',
              boxShadow: 'var(--shadow-xl)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group" style={{ gridColumn: 'span 2' }}>
                  <label className="input-label">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input-field"
                    placeholder="e.g. Samsung Galaxy S25 Ultra"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Category</label>
                  <select
                    value={catId}
                    onChange={(e) => setCatId(Number(e.target.value))}
                    className="input-field"
                  >
                    {categories.map((c) => (
                      <option key={c.cat_id} value={c.cat_id}>
                        {c.cat_title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Brand</label>
                  <select
                    value={brandId}
                    onChange={(e) => setBrandId(Number(e.target.value))}
                    className="input-field"
                  >
                    {brands.map((b) => (
                      <option key={b.brand_id} value={b.brand_id}>
                        {b.brand_title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Price (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="input-field"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="input-field"
                  />
                </div>

                <div className="input-group" style={{ gridColumn: 'span 2' }}>
                  <label className="input-label">Image Path or URL *</label>
                  <input
                    type="text"
                    required
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="input-field"
                    placeholder="/product_images/filename.jpg or https://..."
                  />
                </div>

                <div className="input-group" style={{ gridColumn: 'span 2' }}>
                  <label className="input-label">Search Keywords</label>
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="input-field"
                    placeholder="mobile 5g flagship smartphone camera"
                  />
                </div>

                <div className="input-group" style={{ gridColumn: 'span 2' }}>
                  <label className="input-label">Description</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input-field"
                    placeholder="Provide detailed product specifications and features..."
                  />
                </div>

                <div style={{ display: 'flex', gap: '2rem', gridColumn: 'span 2', marginTop: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                    />
                    Featured Product
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={trending}
                      onChange={(e) => setTrending(e.target.checked)}
                      style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                    />
                    Trending Deal
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '2rem' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
