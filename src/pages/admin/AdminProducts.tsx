import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Plus,
  Search,
  SlidersHorizontal,
  X,
  MoreVertical,
  Edit2,
  Trash2,
  Copy,
  ExternalLink,
  Star,
  ChevronLeft,
  ChevronRight,
  Calendar,
  RotateCw,
  Check,
  Package,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { sanitizeInput, sanitizeUrl } from '../../utils/security';

export const AdminProducts: React.FC = () => {
  const { products, categories, brands, addProduct, updateProduct, deleteProduct } = useProducts();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'non_active'>('all');
  const [selectedCatIds, setSelectedCatIds] = useState<number[]>([]);
  const [selectedBrandIds, setSelectedBrandIds] = useState<number[]>([]);
  const [priceFrom, setPriceFrom] = useState<number>(0);
  const [priceTo, setPriceTo] = useState<number>(200000);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [availability, setAvailability] = useState<'all' | 'in_stock' | 'out_of_stock'>('all');
  const [showFiltersSidebar, setShowFiltersSidebar] = useState(true);

  // Pagination States
  const [pageSize, setPageSize] = useState<number>(8);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Card Action Dropdown State
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Modal State for Add / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [catId, setCatId] = useState<number>(categories[0]?.cat_id || 1);
  const [brandId, setBrandId] = useState<number>(brands[0]?.brand_id || 1);
  const [price, setPrice] = useState<number>(999);
  const [qty, setQty] = useState<number>(10);
  const [image, setImage] = useState<string>('/product_images/1772203299_1770809937_samsung-galaxy-s25-ultra-front-and-back-2.png');
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [keywords, setKeywords] = useState('');
  const [description, setDescription] = useState('');
  const [featured, setFeatured] = useState(false);
  const [trending, setTrending] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image file size should be less than 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Color Swatches for Filter
  const colorOptions = [
    { name: 'Coral', bg: '#ef4444' },
    { name: 'Orange', bg: '#f97316' },
    { name: 'Amber', bg: '#f59e0b' },
    { name: 'Teal', bg: '#14b8a6' },
    { name: 'Indigo', bg: '#6366f1' },
    { name: 'Slate', bg: '#475569' },
    { name: 'Purple', bg: '#a855f7' },
    { name: 'White', bg: '#f8fafc', border: '#cbd5e1' },
    { name: 'Green', bg: '#10b981' },
  ];

  // Close card 3-dots menu on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Category toggle
  const toggleCategory = (id: number) => {
    setSelectedCatIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    setCurrentPage(1);
  };

  // Brand toggle
  const toggleBrand = (id: number) => {
    setSelectedBrandIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    setCurrentPage(1);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setActiveTab('all');
    setSelectedCatIds([]);
    setSelectedBrandIds([]);
    setPriceFrom(0);
    setPriceTo(200000);
    setSelectedColor(null);
    setAvailability('all');
    setCurrentPage(1);
  };

  // Filter Pipeline
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Tab filter
      if (activeTab === 'active' && p.product_qty <= 0) return false;
      if (activeTab === 'non_active' && p.product_qty > 0) return false;

      // Category filter
      if (selectedCatIds.length > 0 && !selectedCatIds.includes(p.product_cat)) return false;

      // Brand filter
      if (selectedBrandIds.length > 0 && !selectedBrandIds.includes(p.product_brand)) return false;

      // Price filter
      if (p.product_price < priceFrom || p.product_price > priceTo) return false;

      // Availability filter
      if (availability === 'in_stock' && p.product_qty <= 0) return false;
      if (availability === 'out_of_stock' && p.product_qty > 0) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.product_title.toLowerCase().includes(q);
        const matchesKeywords = p.product_keywords.toLowerCase().includes(q);
        const matchesDesc = p.product_desc.toLowerCase().includes(q);
        if (!matchesTitle && !matchesKeywords && !matchesDesc) return false;
      }

      return true;
    });
  }, [products, activeTab, selectedCatIds, selectedBrandIds, priceFrom, priceTo, availability, searchQuery]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  // Modal Handlers
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
    setOpenMenuId(null);
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
    setOpenMenuId(null);
  };

  const handleDuplicate = (p: Product) => {
    addProduct({
      product_title: `${p.product_title} (Copy)`,
      product_cat: p.product_cat,
      product_brand: p.product_brand,
      product_price: p.product_price,
      product_qty: p.product_qty,
      product_image: p.product_image,
      product_keywords: p.product_keywords,
      product_desc: p.product_desc,
      featured: p.featured,
      trending: p.trending,
    });
    setOpenMenuId(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
    setOpenMenuId(null);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const safeTitle = sanitizeInput(title.trim());
    const safePrice = Math.max(1, Math.round(Number(price) || 1));
    const safeQty = Math.max(0, Math.floor(Number(qty) || 0));
    const safeImage = sanitizeUrl(image.trim());
    const safeKeywords = sanitizeInput(keywords.trim());
    const safeDesc = sanitizeInput(description.trim());

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        product_title: safeTitle,
        product_cat: Number(catId),
        product_brand: Number(brandId),
        product_price: safePrice,
        product_qty: safeQty,
        product_image: safeImage,
        product_keywords: safeKeywords,
        product_desc: safeDesc,
        featured,
        trending,
      });
    } else {
      addProduct({
        product_title: safeTitle,
        product_cat: Number(catId),
        product_brand: Number(brandId),
        product_price: safePrice,
        product_qty: safeQty,
        product_image: safeImage,
        product_keywords: safeKeywords,
        product_desc: safeDesc,
        featured,
        trending,
      });
    }

    setModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontFamily: 'inherit' }}>
      {/* Top Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
            Product list page
          </h1>
        </div>

        {/* Date Update Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '7px 14px',
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            fontSize: '0.8125rem',
            color: '#475569',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
          }}
        >
          <Calendar size={15} color="#64748b" />
          <span>Last updated: <strong>Feb 28, 2026</strong></span>
          <button
            onClick={() => window.location.reload()}
            title="Refresh"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', color: '#64748b' }}
          >
            <RotateCw size={13} />
          </button>
        </div>
      </div>

      {/* Main Grid: Left Filters Sidebar + Right Content Area */}
      <div style={{ display: 'grid', gridTemplateColumns: showFiltersSidebar ? '280px 1fr' : '1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left Sidebar Filter Card */}
        {showFiltersSidebar && (
          <aside
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '1.25rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
          >
            {/* Filter Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Filters</h3>
              <button
                onClick={resetFilters}
                title="Clear All Filters"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px', display: 'flex', alignItems: 'center' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Type / Category Section */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e293b' }}>Type</span>
                <span style={{ color: '#94a3b8', cursor: 'pointer' }}><X size={14} /></span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px' }}>
                {categories.map((cat) => {
                  const isChecked = selectedCatIds.includes(cat.cat_id);
                  return (
                    <label
                      key={cat.cat_id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.8125rem',
                        color: isChecked ? '#0f172a' : '#475569',
                        fontWeight: isChecked ? 600 : 400,
                        cursor: 'pointer',
                        userSelect: 'none',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleCategory(cat.cat_id)}
                        style={{
                          width: '15px',
                          height: '15px',
                          borderRadius: '4px',
                          accentColor: '#e11d48',
                          cursor: 'pointer',
                        }}
                      />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {cat.cat_title}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Brands Section */}
            <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e293b' }}>Brands</span>
                <span style={{ color: '#94a3b8', cursor: 'pointer' }}><X size={14} /></span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '150px', overflowY: 'auto', paddingRight: '4px' }}>
                {brands.map((b) => {
                  const isChecked = selectedBrandIds.includes(b.brand_id);
                  const count = products.filter((p) => p.product_brand === b.brand_id).length;
                  return (
                    <label
                      key={b.brand_id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.8125rem',
                        color: isChecked ? '#0f172a' : '#475569',
                        fontWeight: isChecked ? 600 : 400,
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleBrand(b.brand_id)}
                          style={{
                            width: '15px',
                            height: '15px',
                            borderRadius: '4px',
                            accentColor: '#e11d48',
                            cursor: 'pointer',
                          }}
                        />
                        <span>{b.brand_title}</span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>({count})</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Price Section */}
            <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e293b' }}>Price</span>
                <span style={{ color: '#94a3b8', cursor: 'pointer' }}><X size={14} /></span>
              </div>

              {/* From / To Inputs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '4px' }}>From</span>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '5px 8px',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                    }}
                  >
                    <span>₹</span>
                    <input
                      type="number"
                      value={priceFrom}
                      onChange={(e) => setPriceFrom(Number(e.target.value) || 0)}
                      style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', paddingLeft: '4px', fontSize: '0.8125rem', fontWeight: 600 }}
                    />
                  </div>
                </div>

                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '4px' }}>To</span>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '5px 8px',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                    }}
                  >
                    <span>₹</span>
                    <input
                      type="number"
                      value={priceTo}
                      onChange={(e) => setPriceTo(Number(e.target.value) || 200000)}
                      style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', paddingLeft: '4px', fontSize: '0.8125rem', fontWeight: 600 }}
                    />
                  </div>
                </div>
              </div>

              {/* Interactive Range Slider */}
              <input
                type="range"
                min="0"
                max="200000"
                step="1000"
                value={priceTo}
                onChange={(e) => setPriceTo(Number(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: '#e11d48',
                  cursor: 'pointer',
                  height: '4px',
                }}
              />
            </div>

            {/* Colors Options Section */}
            <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e293b' }}>Colors Options</span>
                <span style={{ color: '#94a3b8', cursor: 'pointer' }}><X size={14} /></span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                {colorOptions.map((c) => {
                  const isSelected = selectedColor === c.name;
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(isSelected ? null : c.name)}
                      title={c.name}
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        backgroundColor: c.bg,
                        border: c.border ? `1px solid ${c.border}` : 'none',
                        outline: isSelected ? '2px solid #e11d48' : 'none',
                        outlineOffset: '2px',
                        cursor: 'pointer',
                        padding: 0,
                        flexShrink: 0,
                        transition: 'transform 0.15s ease',
                        transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Availability Section */}
            <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e293b' }}>Availability</span>
                <span style={{ color: '#94a3b8', cursor: 'pointer' }}><X size={14} /></span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: '#475569', cursor: 'pointer', userSelect: 'none' }}>
                  <input
                    type="checkbox"
                    checked={availability === 'in_stock'}
                    onChange={() => setAvailability(availability === 'in_stock' ? 'all' : 'in_stock')}
                    style={{ width: '15px', height: '15px', borderRadius: '4px', accentColor: '#e11d48', cursor: 'pointer' }}
                  />
                  <span>In Stock</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: '#475569', cursor: 'pointer', userSelect: 'none' }}>
                  <input
                    type="checkbox"
                    checked={availability === 'out_of_stock'}
                    onChange={() => setAvailability(availability === 'out_of_stock' ? 'all' : 'out_of_stock')}
                    style={{ width: '15px', height: '15px', borderRadius: '4px', accentColor: '#e11d48', cursor: 'pointer' }}
                  />
                  <span>Out of Stock</span>
                </label>
              </div>
            </div>
          </aside>
        )}

        {/* Right Content Area: Single Unified White Container Card */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '1.25rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            minWidth: 0,
          }}
        >
          {/* Action Header: Tabs on Left + Search/Filter/New Product on Right */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              paddingBottom: '0.25rem',
            }}
          >
            {/* Segmented Pill Tabs: All | Active | Non Active */}
            <div
              style={{
                display: 'inline-flex',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '3px',
                gap: '2px',
              }}
            >
              {(['all', 'active', 'non_active'] as const).map((tab) => {
                const label = tab === 'all' ? 'All' : tab === 'active' ? 'Active' : 'Non Active';
                const isSelected = activeTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab);
                      setCurrentPage(1);
                    }}
                    style={{
                      border: 'none',
                      borderRadius: '8px',
                      padding: '6px 14px',
                      fontSize: '0.8125rem',
                      fontWeight: isSelected ? 700 : 500,
                      backgroundColor: isSelected ? 'white' : 'transparent',
                      color: isSelected ? '#0f172a' : '#64748b',
                      boxShadow: isSelected ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Right Controls: Search + Filter Button + New Product */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {/* Search Product Input */}
              <div style={{ position: 'relative', minWidth: '220px' }}>
                <input
                  type="text"
                  placeholder="Search product"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{
                    width: '100%',
                    padding: '7px 12px 7px 32px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    fontSize: '0.8125rem',
                    color: '#1e293b',
                    outline: 'none',
                  }}
                />
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
              </div>

              {/* Filter Toggle Button */}
              <button
                type="button"
                onClick={() => setShowFiltersSidebar((prev) => !prev)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: showFiltersSidebar ? '#f8fafc' : 'white',
                  color: '#475569',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <SlidersHorizontal size={14} />
                <span>Filter</span>
              </button>

              {/* + New Product Button */}
              <button
                type="button"
                onClick={openAddModal}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#1e293b',
                  color: 'white',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(30, 41, 59, 0.2)',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0f172a')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1e293b')}
              >
                <Plus size={15} />
                <span>New Product</span>
              </button>
            </div>
          </div>

          {/* Product Cards Grid (4 columns) */}
          {paginatedProducts.length === 0 ? (
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '4rem 2rem',
                textAlign: 'center',
                color: '#64748b',
                minHeight: '400px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Package size={48} style={{ margin: '0 auto 1rem', color: '#cbd5e1' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>No products found</h3>
              <p style={{ fontSize: '0.875rem', maxWidth: '350px', margin: '0 auto 1.5rem' }}>
                Try adjusting your search keywords, price limits, or category filters.
              </p>
              <button onClick={resetFilters} className="btn btn-secondary btn-sm">
                Reset All Filters
              </button>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '1.25rem',
                minHeight: '540px',
                alignContent: 'start',
              }}
            >
              {paginatedProducts.map((p) => {
                const isOutOfStock = p.product_qty <= 0;
                const isMenuOpen = openMenuId === p.product_id;

                return (
                  <div
                    key={p.product_id}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '16px',
                      border: '1px solid #f1f5f9',
                      padding: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      height: '240px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.06)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)';
                    }}
                  >
                    {/* Card Top: Small Red/Green Status Pill + 3-dots Menu Button */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span
                          style={{
                            width: '14px',
                            height: '5px',
                            borderRadius: '3px',
                            backgroundColor: isOutOfStock ? '#ef4444' : '#f97316',
                            display: 'inline-block',
                          }}
                        />
                        <span style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>••</span>
                      </div>

                      {/* 3-dots Menu Trigger */}
                      <div style={{ position: 'relative' }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(isMenuOpen ? null : p.product_id);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '3px',
                            borderRadius: '4px',
                            color: '#64748b',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <MoreVertical size={16} />
                        </button>

                        {/* Action Popup Dropdown */}
                        {isMenuOpen && (
                          <div
                            ref={menuRef}
                            className="animate-fade-in"
                            style={{
                              position: 'absolute',
                              top: '100%',
                              right: 0,
                              zIndex: 100,
                              backgroundColor: 'white',
                              borderRadius: '10px',
                              border: '1px solid #e2e8f0',
                              boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                              padding: '4px',
                              minWidth: '140px',
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => openEditModal(p)}
                              style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '7px 10px',
                                fontSize: '0.8125rem',
                                color: '#1e293b',
                                border: 'none',
                                background: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                textAlign: 'left',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            >
                              <Edit2 size={13} color="#4f46e5" /> Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDuplicate(p)}
                              style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '7px 10px',
                                fontSize: '0.8125rem',
                                color: '#1e293b',
                                border: 'none',
                                background: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                textAlign: 'left',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            >
                              <Copy size={13} color="#0284c7" /> Duplicate
                            </button>

                            <a
                              href={`/product/${p.product_id}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '7px 10px',
                                fontSize: '0.8125rem',
                                color: '#1e293b',
                                textDecoration: 'none',
                                borderRadius: '6px',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            >
                              <ExternalLink size={13} color="#10b981" /> View Store
                            </a>

                            <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '4px 0' }} />

                            <button
                              type="button"
                              onClick={() => handleDelete(p.product_id)}
                              style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '7px 10px',
                                fontSize: '0.8125rem',
                                color: '#ef4444',
                                border: 'none',
                                background: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                textAlign: 'left',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fef2f2')}
                              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            >
                              <Trash2 size={13} color="#ef4444" /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Centered Product Image */}
                    <div
                      style={{
                        height: '110px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f8fafc',
                        borderRadius: '12px',
                        marginBottom: '8px',
                        overflow: 'hidden',
                        padding: '6px',
                      }}
                    >
                      <img
                        src={p.product_image}
                        alt={p.product_title}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';
                        }}
                        style={{
                          maxHeight: '95px',
                          maxWidth: '90%',
                          objectFit: 'contain',
                          transition: 'transform 0.3s ease',
                        }}
                      />
                    </div>

                    {/* Product Title */}
                    <h4
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#1e293b',
                        marginBottom: '6px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        lineHeight: 1.3,
                      }}
                      title={p.product_title}
                    >
                      {p.product_title}
                    </h4>

                    {/* Price & Rating Row */}
                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a' }}>
                        {formatCurrency(p.product_price)}
                      </span>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.8125rem', fontWeight: 700, color: '#f59e0b' }}>
                        <Star size={13} fill="#f59e0b" color="#f59e0b" />
                        <span>{p.rating || 4.6}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom Pagination Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              paddingTop: '0.5rem',
            }}
          >
            {/* Show Per Page Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: '#64748b' }}>
              <span>Show</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: 'white',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  outline: 'none',
                }}
              >
                <option value={8}>8</option>
                <option value={12}>12</option>
                <option value={16}>16</option>
                <option value={24}>24</option>
              </select>
              <span>Per Page</span>
            </div>

            {/* Pagination Controls (< 1 2 3 >) with strict identical dimensions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                style={{
                  boxSizing: 'border-box',
                  width: '32px',
                  height: '32px',
                  minWidth: '32px',
                  minHeight: '32px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                  color: currentPage <= 1 ? '#cbd5e1' : '#475569',
                  padding: 0,
                }}
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    style={{
                      boxSizing: 'border-box',
                      width: '32px',
                      height: '32px',
                      minWidth: '32px',
                      minHeight: '32px',
                      borderRadius: '8px',
                      border: isActive ? '1px solid #1e293b' : '1px solid #e2e8f0',
                      backgroundColor: isActive ? '#1e293b' : 'white',
                      color: isActive ? 'white' : '#475569',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                style={{
                  boxSizing: 'border-box',
                  width: '32px',
                  height: '32px',
                  minWidth: '32px',
                  minHeight: '32px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                  color: currentPage >= totalPages ? '#cbd5e1' : '#475569',
                  padding: 0,
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
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
            className="animate-scale-up"
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '2rem',
              width: '100%',
              maxWidth: '620px',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group" style={{ gridColumn: 'span 2' }}>
                  <label className="input-label" style={{ fontWeight: 600, fontSize: '0.8125rem' }}>Product Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input-field"
                    placeholder="e.g. Apple AirPods Pro 2nd"
                    style={{ borderRadius: '8px', padding: '8px 12px' }}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label" style={{ fontWeight: 600, fontSize: '0.8125rem' }}>Category</label>
                  <select
                    value={catId}
                    onChange={(e) => setCatId(Number(e.target.value))}
                    className="input-field"
                    style={{ borderRadius: '8px', padding: '8px 12px' }}
                  >
                    {categories.map((c) => (
                      <option key={c.cat_id} value={c.cat_id}>
                        {c.cat_title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label" style={{ fontWeight: 600, fontSize: '0.8125rem' }}>Brand</label>
                  <select
                    value={brandId}
                    onChange={(e) => setBrandId(Number(e.target.value))}
                    className="input-field"
                    style={{ borderRadius: '8px', padding: '8px 12px' }}
                  >
                    {brands.map((b) => (
                      <option key={b.brand_id} value={b.brand_id}>
                        {b.brand_title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label" style={{ fontWeight: 600, fontSize: '0.8125rem' }}>Price (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="input-field"
                    style={{ borderRadius: '8px', padding: '8px 12px' }}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label" style={{ fontWeight: 600, fontSize: '0.8125rem' }}>Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="input-field"
                    style={{ borderRadius: '8px', padding: '8px 12px' }}
                  />
                </div>

                <div className="input-group" style={{ gridColumn: 'span 2' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label className="input-label" style={{ fontWeight: 600, fontSize: '0.8125rem', margin: 0 }}>
                      Product Image *
                    </label>
                    <div style={{ display: 'flex', gap: '4px', backgroundColor: '#f1f5f9', padding: '2px', borderRadius: '6px' }}>
                      <button
                        type="button"
                        onClick={() => setImageInputMode('upload')}
                        style={{
                          padding: '3px 10px',
                          fontSize: '0.75rem',
                          fontWeight: imageInputMode === 'upload' ? 700 : 500,
                          backgroundColor: imageInputMode === 'upload' ? 'white' : 'transparent',
                          color: imageInputMode === 'upload' ? '#0f172a' : '#64748b',
                          borderRadius: '4px',
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: imageInputMode === 'upload' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                        }}
                      >
                        Upload Image
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageInputMode('url')}
                        style={{
                          padding: '3px 10px',
                          fontSize: '0.75rem',
                          fontWeight: imageInputMode === 'url' ? 700 : 500,
                          backgroundColor: imageInputMode === 'url' ? 'white' : 'transparent',
                          color: imageInputMode === 'url' ? '#0f172a' : '#64748b',
                          borderRadius: '4px',
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: imageInputMode === 'url' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                        }}
                      >
                        Image URL / Path
                      </button>
                    </div>
                  </div>

                  {imageInputMode === 'upload' ? (
                    <div
                      style={{
                        display: 'flex',
                        gap: '14px',
                        alignItems: 'center',
                        padding: '14px',
                        border: '1.5px dashed #cbd5e1',
                        borderRadius: '10px',
                        backgroundColor: '#f8fafc',
                      }}
                    >
                      {/* Image Thumbnail Preview */}
                      <div
                        style={{
                          width: '74px',
                          height: '74px',
                          borderRadius: '10px',
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          flexShrink: 0,
                          padding: '4px',
                        }}
                      >
                        {image ? (
                          <img
                            src={image}
                            alt="Product Preview"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';
                            }}
                            style={{ maxHeight: '64px', maxWidth: '64px', objectFit: 'contain' }}
                          />
                        ) : (
                          <ImageIcon size={28} color="#94a3b8" />
                        )}
                      </div>

                      {/* Upload Button & Format Info */}
                      <div style={{ flex: 1 }}>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/png, image/jpeg, image/webp, image/svg+xml, image/avif"
                          onChange={handleFileUpload}
                          style={{ display: 'none' }}
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '7px 14px',
                            backgroundColor: '#1e293b',
                            color: 'white',
                            borderRadius: '8px',
                            fontSize: '0.8125rem',
                            fontWeight: 700,
                            border: 'none',
                            cursor: 'pointer',
                            marginBottom: '6px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          }}
                        >
                          <Upload size={14} /> Choose Image to Upload
                        </button>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          Upload device photos (PNG, JPG, WebP, SVG up to 5MB)
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="text"
                        required
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        className="input-field"
                        placeholder="/product_images/filename.jpg or https://..."
                        style={{ borderRadius: '8px', padding: '8px 12px', flex: 1 }}
                      />
                      {image && (
                        <img
                          src={image}
                          alt="Preview"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';
                          }}
                          style={{
                            width: '40px',
                            height: '40px',
                            objectFit: 'contain',
                            borderRadius: '6px',
                            border: '1px solid #e2e8f0',
                            backgroundColor: '#f8fafc',
                            padding: '2px',
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>

                <div className="input-group" style={{ gridColumn: 'span 2' }}>
                  <label className="input-label" style={{ fontWeight: 600, fontSize: '0.8125rem' }}>Search Keywords</label>
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="input-field"
                    placeholder="earbuds wireless bluetooth audio"
                    style={{ borderRadius: '8px', padding: '8px 12px' }}
                  />
                </div>

                <div className="input-group" style={{ gridColumn: 'span 2' }}>
                  <label className="input-label" style={{ fontWeight: 600, fontSize: '0.8125rem' }}>Description</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input-field"
                    placeholder="Provide product specifications..."
                    style={{ borderRadius: '8px', padding: '8px 12px' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '2rem', gridColumn: 'span 2', marginTop: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      style={{ width: '16px', height: '16px', accentColor: '#1e293b' }}
                    />
                    Featured Product
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={trending}
                      onChange={(e) => setTrending(e.target.checked)}
                      style={{ width: '16px', height: '16px', accentColor: '#1e293b' }}
                    />
                    Trending Deal
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.75rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn btn-secondary btn-sm"
                  style={{ borderRadius: '8px', padding: '8px 16px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  style={{ borderRadius: '8px', padding: '8px 20px', backgroundColor: '#1e293b', borderColor: '#1e293b' }}
                >
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
