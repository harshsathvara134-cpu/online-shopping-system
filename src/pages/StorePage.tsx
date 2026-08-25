import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Filter,
  Grid as GridIcon,
  List as ListIcon,
  SlidersHorizontal,
  RotateCcw,
  Search,
  Check,
  ChevronRight,
  ShoppingBag,
  Star,
  X,
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { ProductCard } from '../components/store/ProductCard';
import { QuickViewModal } from '../components/common/QuickViewModal';
import { Product } from '../types';
import { formatCurrency } from '../utils/formatters';
import { useLanguage } from '../context/LanguageContext';

export const StorePage: React.FC = () => {
  const { products, categories, brands } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useLanguage();

  // URL state sync
  const urlCat = searchParams.get('cat') ? Number(searchParams.get('cat')) : null;
  const urlBrand = searchParams.get('brand') ? Number(searchParams.get('brand')) : null;
  const urlSearch = searchParams.get('search') || '';

  const [selectedCat, setSelectedCat] = useState<number | null>(urlCat);
  const [selectedBrand, setSelectedBrand] = useState<number | null>(urlBrand);
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [priceLimit, setPriceLimit] = useState<number>(150000);
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc' | 'rating'>('default');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Sync state when URL params change
  useEffect(() => {
    if (urlCat !== null) setSelectedCat(urlCat);
    if (urlBrand !== null) setSelectedBrand(urlBrand);
    if (urlSearch) setSearchQuery(urlSearch);
  }, [urlCat, urlBrand, urlSearch]);

  const handleResetFilters = () => {
    setSelectedCat(null);
    setSelectedBrand(null);
    setSearchQuery('');
    setPriceLimit(150000);
    setMinRating(0);
    setInStockOnly(false);
    setSortBy('default');
    setSearchParams({});
  };

  // Filter and Sort Pipeline
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCat !== null && p.product_cat !== selectedCat) return false;
      // Brand filter
      if (selectedBrand !== null && p.product_brand !== selectedBrand) return false;
      // Price limit
      if (p.product_price > priceLimit) return false;
      // Rating filter
      if (minRating > 0 && (p.rating || 0) < minRating) return false;
      // Stock filter
      if (inStockOnly && p.product_qty <= 0) return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.product_title.toLowerCase().includes(q);
        const matchesDesc = p.product_desc.toLowerCase().includes(q);
        const matchesKey = p.product_keywords.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesKey) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.product_price - b.product_price;
      if (sortBy === 'price_desc') return b.product_price - a.product_price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });
  }, [products, selectedCat, selectedBrand, priceLimit, minRating, inStockOnly, searchQuery, sortBy]);

  const selectedCategoryObj = categories.find(c => c.cat_id === selectedCat);
  const selectedBrandObj = brands.find(b => b.brand_id === selectedBrand);

  const getTranslatedCategoryTitle = (catTitle: string) => {
    switch (catTitle) {
      case 'Electronics': return t('electronics');
      case 'Ladies Wears': return t('ladiesWears');
      case 'Mens Wear': return t('mensWear');
      case 'Kids Wear': return t('kidsWear');
      case 'Furnitures': return t('furnitures');
      case 'Home Appliances': return t('homeAppliances');
      case 'Sports': return t('sports');
      default: return catTitle;
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 4rem' }}>
      {/* Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{t('home')}</Link>
        <ChevronRight size={14} />
        <Link to="/store" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{t('store')}</Link>
        {selectedCategoryObj && (
          <>
            <ChevronRight size={14} />
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{getTranslatedCategoryTitle(selectedCategoryObj.cat_title)}</span>
          </>
        )}
      </div>

      {/* Mobile Horizontal Swipeable Category Pills */}
      <div className="show-mobile-only" style={{ marginBottom: '1.25rem' }}>
        <div className="mobile-horizontal-scroll">
          <button
            onClick={() => setSelectedCat(null)}
            className={`btn btn-sm ${selectedCat === null ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 'var(--radius-full)', flexShrink: 0 }}
          >
            {t('allCategories')}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.cat_id}
              onClick={() => setSelectedCat(cat.cat_id)}
              className={`btn btn-sm ${selectedCat === cat.cat_id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-full)', flexShrink: 0 }}
            >
              {getTranslatedCategoryTitle(cat.cat_title)}
            </button>
          ))}
        </div>
      </div>

      {/* Header Title & Controls Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.5rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
            {selectedCategoryObj ? selectedCategoryObj.cat_title : t('productCatalog')}
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Showing <strong>{filteredProducts.length}</strong> items found
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowMobileFilter(true)}
            className="btn btn-secondary btn-sm show-mobile-only"
            style={{ borderRadius: 'var(--radius-full)', gap: '6px' }}
          >
            <Filter size={15} /> {t('filters')}
            {(selectedCat !== null || selectedBrand !== null || searchQuery || priceLimit < 150000 || minRating > 0 || inStockOnly) && (
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
            )}
          </button>

          {/* Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }} className="hide-mobile">
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                padding: '6px 10px',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--border-color)',
                backgroundColor: 'white',
                fontSize: '0.8125rem',
                fontWeight: 600,
                outline: 'none',
              }}
            >
              <option value="default">Featured / Default</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div style={{ display: 'flex', border: '1.5px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }} className="hide-mobile">
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '6px 10px',
                background: viewMode === 'grid' ? 'var(--primary-light)' : 'white',
                color: viewMode === 'grid' ? 'var(--primary)' : 'var(--text-muted)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <GridIcon size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '6px 10px',
                background: viewMode === 'list' ? 'var(--primary-light)' : 'white',
                color: viewMode === 'list' ? 'var(--primary)' : 'var(--text-muted)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <ListIcon size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar + Products */}
      <div className="store-layout-grid">
        {/* Left Sidebar Filter (Desktop) */}
        <aside
          className="card hide-mobile"
          style={{
            position: 'sticky',
            top: '90px',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '1rem' }}>
              <SlidersHorizontal size={18} color="var(--primary)" /> {t('filters')}
            </div>
            {(selectedCat !== null || selectedBrand !== null || searchQuery || priceLimit < 150000 || minRating > 0 || inStockOnly) && (
              <button
                onClick={handleResetFilters}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <RotateCcw size={12} /> {t('clearFilters')}
              </button>
            )}
          </div>

          {/* Search Box in Sidebar */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="input-label" style={{ marginBottom: '6px', display: 'block' }}>Search Keywords</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '2.2rem', fontSize: '0.8125rem' }}
              />
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-muted)' }} />
            </div>
          </div>

          {/* Categories List */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>{t('allCategories')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <button
                onClick={() => setSelectedCat(null)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '6px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  backgroundColor: selectedCat === null ? 'var(--primary-light)' : 'transparent',
                  color: selectedCat === null ? 'var(--primary)' : 'var(--text-main)',
                  fontWeight: selectedCat === null ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span>{t('allCategories')}</span>
                <span>{products.length}</span>
              </button>
              {categories.map((c) => {
                const count = products.filter(p => p.product_cat === c.cat_id).length;
                const isSelected = selectedCat === c.cat_id;
                return (
                  <button
                    key={c.cat_id}
                    onClick={() => setSelectedCat(isSelected ? null : c.cat_id)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '6px 8px',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      backgroundColor: isSelected ? 'var(--primary-light)' : 'transparent',
                      color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                      fontWeight: isSelected ? 700 : 500,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span>{getTranslatedCategoryTitle(c.cat_title)}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brands Filter */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>Brands</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {brands.map((b) => {
                const isSelected = selectedBrand === b.brand_id;
                const count = products.filter(p => p.product_brand === b.brand_id).length;
                return (
                  <button
                    key={b.brand_id}
                    onClick={() => setSelectedBrand(isSelected ? null : b.brand_id)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '6px 8px',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      backgroundColor: isSelected ? 'var(--primary-light)' : 'transparent',
                      color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                      fontWeight: isSelected ? 700 : 500,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span>{b.brand_title}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider */}
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Max Price</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
                {formatCurrency(priceLimit)}
              </span>
            </div>
            <input
              type="range"
              min="1000"
              max="150000"
              step="2000"
              value={priceLimit}
              onChange={(e) => setPriceLimit(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              <span>₹1,000</span>
              <span>₹1,50,000+</span>
            </div>
          </div>

          {/* Customer Rating Filter */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem' }}>Rating</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {[4, 3].map((star) => (
                <button
                  key={star}
                  onClick={() => setMinRating(minRating === star ? 0 : star)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '5px 8px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    backgroundColor: minRating === star ? 'var(--primary-light)' : 'transparent',
                    color: minRating === star ? 'var(--primary)' : 'var(--text-main)',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', color: '#f59e0b' }}>
                    {[...Array(star)].map((_, i) => <Star key={i} size={14} fill="#f59e0b" />)}
                  </div>
                  <span>& above</span>
                </button>
              ))}
            </div>
          </div>

          {/* In-Stock Toggle */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* Right Product Grid/List View */}
        <div>
          {/* Active Filter Badges */}
          {(selectedCategoryObj || selectedBrandObj || searchQuery || minRating > 0 || inStockOnly) && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78125rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Filters:</span>
              {selectedCategoryObj && (
                <span className="badge badge-primary" style={{ cursor: 'pointer' }} onClick={() => setSelectedCat(null)}>
                  Category: {selectedCategoryObj.cat_title} ✕
                </span>
              )}
              {selectedBrandObj && (
                <span className="badge badge-primary" style={{ cursor: 'pointer' }} onClick={() => setSelectedBrand(null)}>
                  Brand: {selectedBrandObj.brand_title} ✕
                </span>
              )}
              {searchQuery && (
                <span className="badge badge-primary" style={{ cursor: 'pointer' }} onClick={() => setSearchQuery('')}>
                  Search: "{searchQuery}" ✕
                </span>
              )}
              {minRating > 0 && (
                <span className="badge badge-primary" style={{ cursor: 'pointer' }} onClick={() => setMinRating(0)}>
                  Rating: {minRating}★+ ✕
                </span>
              )}
              {inStockOnly && (
                <span className="badge badge-primary" style={{ cursor: 'pointer' }} onClick={() => setInStockOnly(false)}>
                  In Stock Only ✕
                </span>
              )}
            </div>
          )}

          {/* No products matched */}
          {filteredProducts.length === 0 ? (
            <div
              className="card"
              style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)',
                }}
              >
                <ShoppingBag size={40} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700 }}>No products matched your criteria</h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', maxWidth: '400px' }}>
                Try adjusting your search terms, removing filters, or widening the price range.
              </p>
              <button onClick={handleResetFilters} className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                <RotateCcw size={16} /> Reset All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="store-products-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.product_id}
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          ) : (
            /* List View */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {filteredProducts.map((product) => (
                <div
                  key={product.product_id}
                  className="card card-interactive"
                  style={{ display: 'grid', gridTemplateColumns: '200px 1fr auto', gap: '1.5rem', alignItems: 'center' }}
                >
                  <div style={{ height: '160px', background: '#f8fafc', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                      src={product.product_image}
                      alt={product.product_title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';
                      }}
                      style={{ maxHeight: '140px', maxWidth: '90%', objectFit: 'contain' }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
                      <span className="badge badge-primary">{categories.find(c => c.cat_id === product.product_cat)?.cat_title}</span>
                      <span className="badge badge-neutral">{brands.find(b => b.brand_id === product.product_brand)?.brand_title}</span>
                    </div>
                    <Link to={`/product/${product.product_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>{product.product_title}</h3>
                    </Link>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {product.product_desc}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Star size={14} fill="#f59e0b" color="#f59e0b" />
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{product.rating || 4.5}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({product.review_count || 12} reviews)</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '140px' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                      {formatCurrency(product.product_price)}
                    </div>
                    <Link to={`/product/${product.product_id}`} className="btn btn-primary btn-sm">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Bottom Sheet Drawer */}
      {showMobileFilter && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div
            onClick={() => setShowMobileFilter(false)}
            style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}
          />

          <div
            className="mobile-filter-drawer animate-slide-up"
            style={{ position: 'relative', zIndex: 1, maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
          >
            {/* Drawer Header */}
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Filter size={18} color="var(--primary)" /> Filters & Refinements
              </div>
              <button
                onClick={() => setShowMobileFilter(false)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div style={{ overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
              {/* Categories */}
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>Category</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  <button
                    onClick={() => setSelectedCat(null)}
                    className={`btn btn-sm ${selectedCat === null ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ borderRadius: 'var(--radius-full)' }}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.cat_id}
                      onClick={() => setSelectedCat(cat.cat_id)}
                      className={`btn btn-sm ${selectedCat === cat.cat_id ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ borderRadius: 'var(--radius-full)' }}
                    >
                      {cat.cat_title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>Brand</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  <button
                    onClick={() => setSelectedBrand(null)}
                    className={`btn btn-sm ${selectedBrand === null ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ borderRadius: 'var(--radius-full)' }}
                  >
                    All Brands
                  </button>
                  {brands.map((b) => (
                    <button
                      key={b.brand_id}
                      onClick={() => setSelectedBrand(b.brand_id)}
                      className={`btn btn-sm ${selectedBrand === b.brand_id ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ borderRadius: 'var(--radius-full)' }}
                    >
                      {b.brand_title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Limit Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  <span>Max Price:</span>
                  <span style={{ color: 'var(--primary)' }}>{formatCurrency(priceLimit)}</span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={150000}
                  step={2000}
                  value={priceLimit}
                  onChange={(e) => setPriceLimit(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary)' }}
                />
              </div>

              {/* Rating */}
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>Customer Rating</h4>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[4, 3, 2].map((star) => (
                    <button
                      key={star}
                      onClick={() => setMinRating(minRating === star ? 0 : star)}
                      className={`btn btn-sm ${minRating === star ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ borderRadius: 'var(--radius-full)', gap: '4px' }}
                    >
                      {star}★+
                    </button>
                  ))}
                </div>
              </div>

              {/* In Stock Only */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                  />
                  <span>In Stock Products Only</span>
                </label>
              </div>
            </div>

            {/* Drawer Footer CTA */}
            <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '10px', background: 'white' }}>
              <button onClick={handleResetFilters} className="btn btn-secondary" style={{ flex: 1 }}>
                Reset
              </button>
              <button onClick={() => setShowMobileFilter(false)} className="btn btn-primary" style={{ flex: 2 }}>
                {t('applyFilters')} ({filteredProducts.length} Items)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};
