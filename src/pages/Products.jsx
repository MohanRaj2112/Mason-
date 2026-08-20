import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { initialToolsData, toolCategories } from '../data/tools';
import { ToolCard } from '../components/ToolCard';
<<<<<<< HEAD
import { RentalModal } from '../components/RentalModal';
=======
>>>>>>> 1db21cd3fbb8d2a56e53f3cfdb93a3fa06e2b6a7
import { AddToolModal } from '../components/AddToolModal';
import { useToast } from '../context/ToastContext';

export const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();

  const [tools, setTools] = useState(() => {
    try {
      const cached = sessionStorage.getItem('mm_cached_products');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return initialToolsData;
  });

  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('cat') || 'all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [sortBy, setSortBy] = useState('recommended');
<<<<<<< HEAD
  
  // Modals state
  const [selectedRentalTool, setSelectedRentalTool] = useState(null);
  const [showRentalModal, setShowRentalModal] = useState(false);
=======
>>>>>>> 1db21cd3fbb8d2a56e53f3cfdb93a3fa06e2b6a7
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Sync category with URL
  useEffect(() => {
    const urlCat = searchParams.get('cat');
    if (urlCat) {
      setSelectedCategory(urlCat);
    }
  }, [searchParams]);

  // Load from backend API if available
  useEffect(() => {
    const fetchTools = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
<<<<<<< HEAD
=======
            // Merge with local rich fields if needed
>>>>>>> 1db21cd3fbb8d2a56e53f3cfdb93a3fa06e2b6a7
            const merged = data.map(item => {
              const localMatch = initialToolsData.find(t => t.name === item.name || t._id === item._id);
              return {
                ...localMatch,
                ...item,
                image: item.image || localMatch?.image || '',
                desc: item.description || item.desc || localMatch?.desc || 'Professional construction tool.',
                specs: item.specs || localMatch?.specs || '',
<<<<<<< HEAD
                period: item.period || 'Day',
=======
                period: item.period || 'Per Day',
>>>>>>> 1db21cd3fbb8d2a56e53f3cfdb93a3fa06e2b6a7
                availabilityStatus: item.availabilityStatus || (item.available ? 'Available' : 'Rented')
              };
            });
            setTools(merged);
            sessionStorage.setItem('mm_cached_products', JSON.stringify(merged));
          }
        }
      } catch (err) {
        console.warn('API sync fallback to cached catalog:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTools();
  }, []);

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    if (catId === 'all') {
      searchParams.delete('cat');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ ...Object.fromEntries(searchParams.entries()), cat: catId });
    }
  };

<<<<<<< HEAD
  const handleOpenRental = (tool) => {
    setSelectedRentalTool(tool);
    setShowRentalModal(true);
  };

=======
>>>>>>> 1db21cd3fbb8d2a56e53f3cfdb93a3fa06e2b6a7
  const handleAddNewTool = async (newTool) => {
    const updated = [newTool, ...tools];
    setTools(updated);
    sessionStorage.setItem('mm_cached_products', JSON.stringify(updated));

    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newTool.name,
          category: newTool.category,
          price: newTool.price,
          description: newTool.desc,
          icon: newTool.icon || '🔨',
          available: newTool.availabilityStatus === 'Available',
          image: newTool.image || ''
        })
      });
    } catch (err) {
      console.warn('Backend tool sync failed (local state preserved):', err);
    }
  };

  // Filtered and Sorted Tools
  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        tool.name?.toLowerCase().includes(q) ||
        tool.desc?.toLowerCase().includes(q) ||
        tool.category?.toLowerCase().includes(q) ||
        tool.specs?.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
      if (sortBy === 'name-asc') return (a.name || '').localeCompare(b.name || '');
      if (sortBy === 'availability') {
        const aAvail = (a.availabilityStatus || (a.available ? 'Available' : 'Rented')) === 'Available' ? 1 : 0;
        const bAvail = (b.availabilityStatus || (b.available ? 'Available' : 'Rented')) === 'Available' ? 1 : 0;
        return bAvail - aAvail;
      }
<<<<<<< HEAD
      return 0;
=======
      // 'recommended' - featured first, then rating
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return (b.rating || 0) - (a.rating || 0);
>>>>>>> 1db21cd3fbb8d2a56e53f3cfdb93a3fa06e2b6a7
    });
  }, [tools, selectedCategory, searchQuery, sortBy]);

  return (
<<<<<<< HEAD
    <div className="tools-rental-page" style={{ background: 'var(--bg-main)', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* ── SIMPLE & CLEAN HEADER ── */}
      <section className="tools-simple-header">
        <div className="container">
          <div className="tools-header-content">
            <span className="section-eyebrow">EQUIPMENT CATALOG</span>
            <h1 className="tools-header-title">TOOLS RENTAL</h1>
            <p className="tools-header-subtitle">
              Construction tools &amp; equipment available for rental.
=======
    <div className="products-page">
      {/* ── HERO BANNER ── */}
      <section className="hero" style={{ padding: '60px 0 72px' }}>
        <div className="container">
          <div className="hero-content">
            <span className="section-eyebrow">EQUIPMENT MARKETPLACE</span>
            <h1 style={{ fontSize: '2.8rem', marginBottom: '16px' }}>
              Construction Tools &amp; Machinery Rentals
            </h1>
            <p className="hero-desc">
              High-performance concrete mixers, demolition rotary hammers, modular scaffolding, and safety gear. Direct job site delivery with operator support available.
>>>>>>> 1db21cd3fbb8d2a56e53f3cfdb93a3fa06e2b6a7
            </p>
          </div>
        </div>
      </section>

<<<<<<< HEAD
      {/* ── MAIN TOOLS SECTION ── */}
      <section className="container" style={{ marginTop: '24px' }}>
        
        {/* Search Bar & Toolbar */}
        <div className="tools-search-toolbar">
          <div className="tools-search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="tools-search-input"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="tools-search-field"
            />
            {searchQuery && (
              <button 
                type="button" 
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="tools-toolbar-controls">
            <div className="tools-sort-wrap">
              <span className="sort-label">Sort:</span>
              <select 
                className="tools-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                id="tools-sort-select"
              >
                <option value="recommended">Featured / Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="availability">Available First</option>
              </select>
            </div>

            <button
              type="button"
              className="btn btn-outline btn-sm btn-add-tool-compact"
              onClick={() => setShowAddModal(true)}
              title="Add new equipment item"
              id="add-tool-btn"
            >
              ＋ Add Tool
            </button>
          </div>
        </div>

        {/* Category Pills: [ All ] [ Power Tools ] [ Concrete ] [ Scaffolding ] ... */}
        <div className="tools-category-pills" id="tools-category-filters">
          {toolCategories.map(cat => {
            const isActive = selectedCategory === cat.id;
            const count = cat.id === 'all'
              ? tools.length
              : tools.filter(t => t.category === cat.id).length;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(cat.id)}
                className={`tools-cat-pill ${isActive ? 'active' : ''}`}
                id={`cat-pill-${cat.id}`}
              >
                <span className="cat-icon">{cat.icon}</span>
                <span className="cat-label">{cat.label}</span>
                <span className="cat-count">{count}</span>
              </button>
            );
          })}
        </div>

        <div className="tools-divider" />

        {/* Tools Grid: [ Tool Card ] [ Tool Card ] [ Tool Card ] */}
        {filteredTools.length === 0 ? (
          <div className="tools-empty-state">
            <div className="empty-icon">🛠️</div>
            <h3>No tools found</h3>
            <p>
              We couldn't find any equipment matching "{searchQuery || selectedCategory}".
            </p>
            <button 
              type="button"
              className="btn btn-accent"
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="tools-grid-clean">
            {filteredTools.map(tool => (
              <ToolCard 
                key={tool._id || tool.id} 
                tool={tool} 
                onRentNow={handleOpenRental}
              />
            ))}
          </div>
        )}

      </section>

      {/* ── RENTAL TRANSACTION MODAL ── */}
      <RentalModal
        isOpen={showRentalModal}
        onClose={() => {
          setShowRentalModal(false);
          setSelectedRentalTool(null);
        }}
        tool={selectedRentalTool}
      />

      {/* ── ADD TOOL MODAL (ADMIN / INVENTORY) ── */}
      <AddToolModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddTool={handleAddNewTool}
      />

=======
      {/* ── MAIN MARKETPLACE SECTION ── */}
      <section className="section" style={{ paddingTop: '40px' }}>
        <div className="container">
          {/* Header Row: Title, Subtitle, and "+ Add Tools" Action */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
            <div>
              <span className="section-eyebrow">EQUIPMENT CATALOG</span>
              <h2 style={{ fontSize: '1.85rem', color: 'var(--text-main)' }}>
                Browse Construction Equipment
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
                Showing {filteredTools.length} of {tools.length} verified machines &amp; tools available for site rental.
              </p>
            </div>

            <button 
              className="btn btn-add-tool"
              onClick={() => setShowAddModal(true)}
              id="add-equipment-btn"
            >
              <span className="plus-icon">＋</span> Add Tools to Inventory
            </button>
          </div>

          {/* Search & Sorting Toolbar */}
          <div className="catalog-toolbar" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: '16px', 
            background: 'var(--bg-surface)',
            padding: '16px 20px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '24px'
          }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: 1, minWidth: '280px', maxWidth: '540px' }}>
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '40px' }}
                placeholder="Search tools by name, power rating, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '1rem', pointerEvents: 'none' }}>
                🔍
              </span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem' }}
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Control */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                Sort By:
              </label>
              <select
                className="form-control"
                style={{ width: 'auto', padding: '10px 16px', fontWeight: 600 }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recommended">⭐ Recommended</option>
                <option value="price-low">💰 Price: Low → High</option>
                <option value="price-high">💎 Price: High → Low</option>
                <option value="name-asc">🔤 Name: A → Z</option>
                <option value="availability">🟢 In Stock (Availability)</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div 
            className="filter-pills" 
            style={{ 
              display: 'flex', 
              gap: '10px', 
              overflowX: 'auto', 
              paddingBottom: '8px', 
              marginBottom: '36px',
              scrollbarWidth: 'thin'
            }}
          >
            {toolCategories.map(cat => {
              const isActive = selectedCategory === cat.id;
              const count = cat.id === 'all' 
                ? tools.length 
                : tools.filter(t => t.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`btn btn-sm ${isActive ? 'btn-accent' : 'btn-outline'}`}
                  style={{ 
                    whiteSpace: 'nowrap', 
                    borderRadius: '50px', 
                    padding: '8px 18px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span style={{ 
                    fontSize: '0.72rem', 
                    padding: '1px 6px', 
                    borderRadius: '50px', 
                    background: isActive ? 'rgba(255,255,255,0.25)' : 'var(--bg-main)',
                    color: isActive ? '#fff' : 'var(--text-muted)',
                    marginLeft: '2px'
                  }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Tools Grid */}
          {filteredTools.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '64px 24px', background: 'var(--bg-surface)' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>🛠️</div>
              <h3 style={{ color: 'var(--primary)', marginBottom: '8px', fontSize: '1.4rem' }}>
                No Equipment Found
              </h3>
              <p style={{ color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto 24px' }}>
                No tools matched "{searchQuery || selectedCategory}". Try changing your search query or selecting a different equipment category.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  className="btn btn-outline"
                  onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                >
                  Reset All Filters
                </button>
                <button
                  className="btn btn-accent"
                  onClick={() => setShowAddModal(true)}
                >
                  ＋ Add This Tool to Catalog
                </button>
              </div>
            </div>
          ) : (
            <div className="grid-3" style={{ rowGap: '32px' }}>
              {filteredTools.map(tool => (
                <ToolCard key={tool._id || tool.id} tool={tool} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── WHY RENT FROM US BANNER ── */}
      <section className="section section-alt" style={{ padding: '64px 0' }}>
        <div className="container">
          <div className="grid-3">
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Direct Job Site Delivery</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.55' }}>
                Prompt 2-hour dispatch for emergency requests across Salem, Erode, and Coimbatore metropolitan sites.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Calibrated &amp; Tested</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.55' }}>
                Every diesel mixer, poker needle, and rotary breaker is mechanically serviced and safety-checked before dispatch.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Flexible Commercial Terms</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.55' }}>
                Pay as you go with discounted weekly and monthly rental packages. Zero security deposit for verified builders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Add Tool Modal */}
      <AddToolModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        onAddTool={handleAddNewTool}
      />
>>>>>>> 1db21cd3fbb8d2a56e53f3cfdb93a3fa06e2b6a7
    </div>
  );
};
