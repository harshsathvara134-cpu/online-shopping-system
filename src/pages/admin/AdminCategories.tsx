import React, { useState } from 'react';
import { Layers, Plus, Trash2, Edit2, Check } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { sanitizeInput } from '../../utils/security';

export const AdminCategories: React.FC = () => {
  const { categories, products, addCategory, deleteCategory } = useProducts();
  const [newCatTitle, setNewCatTitle] = useState('');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatTitle.trim()) return;
    addCategory(sanitizeInput(newCatTitle.trim()));
    setNewCatTitle('');
  };

  return (
    <div style={{ maxWidth: '850px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Category Manager</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Create and organize store product categories
        </p>
      </div>

      {/* Add Category Form */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Add New Category</h3>
        <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            required
            placeholder="e.g. Gaming & VR, Beauty & Health..."
            value={newCatTitle}
            onChange={(e) => setNewCatTitle(e.target.value)}
            className="input-field"
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-primary" style={{ gap: '6px' }}>
            <Plus size={16} /> Add Category
          </button>
        </form>
      </div>

      {/* Category List Card */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
              <th style={{ padding: '12px 16px' }}>ID</th>
              <th style={{ padding: '12px 16px' }}>Category Name</th>
              <th style={{ padding: '12px 16px' }}>Total Products</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => {
              const productCount = products.filter(p => p.product_cat === c.cat_id).length;

              return (
                <tr key={c.cat_id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-muted)' }}>
                    #{c.cat_id}
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, fontSize: '0.95rem' }}>
                    {c.cat_title}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className="badge badge-primary">{productCount} Products</span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete category "${c.cat_title}"?`)) {
                          deleteCategory(c.cat_id);
                        }
                      }}
                      className="btn btn-sm btn-secondary btn-icon"
                      style={{ color: 'var(--danger)' }}
                      title="Delete Category"
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
