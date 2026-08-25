import React, { useState } from 'react';
import { Tag, Plus, Trash2 } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { sanitizeInput } from '../../utils/security';

export const AdminBrands: React.FC = () => {
  const { brands, products, addBrand, deleteBrand } = useProducts();
  const [newBrandTitle, setNewBrandTitle] = useState('');

  const handleAddBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandTitle.trim()) return;
    addBrand(sanitizeInput(newBrandTitle.trim()));
    setNewBrandTitle('');
  };

  return (
    <div style={{ maxWidth: '850px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Brand Manager</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Manage manufacturer and fashion brand partnerships
        </p>
      </div>

      {/* Add Brand Form */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Add New Brand</h3>
        <form onSubmit={handleAddBrand} style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            required
            placeholder="e.g. Sony, Nike, ASUS..."
            value={newBrandTitle}
            onChange={(e) => setNewBrandTitle(e.target.value)}
            className="input-field"
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-primary" style={{ gap: '6px' }}>
            <Plus size={16} /> Add Brand
          </button>
        </form>
      </div>

      {/* Brand List Card */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
              <th style={{ padding: '12px 16px' }}>ID</th>
              <th style={{ padding: '12px 16px' }}>Brand Name</th>
              <th style={{ padding: '12px 16px' }}>Total Products</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((b) => {
              const productCount = products.filter(p => p.product_brand === b.brand_id).length;

              return (
                <tr key={b.brand_id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-muted)' }}>
                    #{b.brand_id}
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, fontSize: '0.95rem' }}>
                    {b.brand_title}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className="badge badge-neutral">{productCount} Products</span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete brand "${b.brand_title}"?`)) {
                          deleteBrand(b.brand_id);
                        }
                      }}
                      className="btn btn-sm btn-secondary btn-icon"
                      style={{ color: 'var(--danger)' }}
                      title="Delete Brand"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
