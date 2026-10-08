import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Plus, SlidersHorizontal, Truck, X } from 'lucide-react';
import { initialToolsData, toolCategories } from '../data/tools';
import { ToolCard } from '../components/ToolCard';
import { AddToolModal } from '../components/AddToolModal';
import { useToast } from '../context/ToastContext';
import heroBgImg from '../assets/images/srm_hero_site_1791445418459.jpg';
import equipmentImg from '../assets/images/srm_equipment_rental_1791445442334.jpg';

export const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();

  const [tools, setTools] = useState(() => {
    try {
      const cached = sessionStorage.getItem('mm_cached_products');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item) => {
            const localMatch = initialToolsData.find(
              (t) => t.name === item.name || t._id === item._id
            );
            return {
              ...localMatch,
              ...item,
              specifications: item.specifications || localMatch?.specifications || null,
              image:
                item.image && !item.image.includes('unsplash.com')
                  ? item.image
                  : localMatch?.image || equipmentImg
            };
          });
        }
      }
    } catch {}
    return initialToolsData;
  });

  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('cat') || 'all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [sortBy, setSortBy] = useState('recommended');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const urlCat = searchParams.get('cat');
    if (urlCat) {
      setSelectedCategory(urlCat);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const merged = data.map((item) => {
              const localMatch = initialToolsData.find(
                (t) => t.name === item.name || t._id === item._id || t._id === item.toolId
              );
              const validImg =
                item.image && !item.image.includes('unsplash.com')
                  ? item.image
                  : localMatch?.image || equipmentImg;
              return {
                ...localMatch,
                ...item,
                image: validImg,
                specifications: item.specifications || localMatch?.specifications || null,
                desc:
                  item.description ||
                  item.desc ||
                  localMatch?.desc ||
                  'Professional construction tool calibrated for reliable on-site performance.',
                specs: item.specs || localMatch?.specs || '',
                period: item.period || 'Day',
                availabilityStatus:
                  item.availabilityStatus || (item.available ? 'Available' : 'Rented')
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

  const handleAddNewTool = async (newTool) => {
    const enrichedTool = {
      ...newTool,
      image: newTool.image || equipmentImg
    };
    const updated = [enrichedTool, ...tools];
    setTools(updated);
    sessionStorage.setItem('mm_cached_products', JSON.stringify(updated));

    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: enrichedTool.name,
          category: enrichedTool.category,
          price: enrichedTool.price,
          description: enrichedTool.desc,
          specs: enrichedTool.specs,
          specifications: enrichedTool.specifications,
          available: enrichedTool.availabilityStatus === 'Available',
          image: enrichedTool.image
        })
      });
      showToast(`Added ${enrichedTool.name} to inventory!`, 'success');
    } catch (err) {
      console.warn('Backend tool sync failed (local state preserved):', err);
    }
  };

  // Curate recommended tools based on genuine availability, featured flag, and high rating
  const recommendedTools = useMemo(() => {
    const candidatePool = selectedCategory === 'all'
      ? tools
      : tools.filter((t) => t.category === selectedCategory);

    const matches = candidatePool.filter((t) => {
      const isAvail = (t.availabilityStatus || (t.available ? 'Available' : 'Rented')) === 'Available';
      return isAvail && (t.featured || Number(t.rating) >= 4.8);
    });

    // Fallback to top featured if pool has few
    const finalSelection = matches.length >= 2
      ? matches
      : candidatePool.filter((t) => t.featured || Number(t.rating) >= 4.8);

    return finalSelection.slice(0, 4);
  }, [tools, selectedCategory]);

  // Search filter and professional sorting
  const filteredTools = useMemo(() => {
    return tools
      .filter((tool) => {
        const matchesCategory =
          selectedCategory === 'all' || tool.category === selectedCategory;
        const q = searchQuery.toLowerCase().trim();

        const matchesSearch =
          !q ||
          tool.name?.toLowerCase().includes(q) ||
          tool.category?.toLowerCase().includes(q) ||
          (tool.specs && tool.specs.toLowerCase().includes(q)) ||
          (tool.specifications && Object.values(tool.specifications).some((v) => String(v).toLowerCase().includes(q)));

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        const priceA = Number(a.price || a.pricePerDay || 0);
        const priceB = Number(b.price || b.pricePerDay || 0);

        if (sortBy === 'price-low') return priceA - priceB;
        if (sortBy === 'price-high') return priceB - priceA;
        if (sortBy === 'name-asc') return (a.name || '').localeCompare(b.name || '');
        if (sortBy === 'name-desc') return (b.name || '').localeCompare(a.name || '');
        if (sortBy === 'newest') {
          return (b._id || '').localeCompare(a._id || '');
        }
        if (sortBy === 'availability') {
          const aAvail = (a.availabilityStatus || (a.available ? 'Available' : 'Rented')) === 'Available' ? 1 : 0;
          const bAvail = (b.availabilityStatus || (b.available ? 'Available' : 'Rented')) === 'Available' ? 1 : 0;
          return bAvail - aAvail;
        }

        // Default 'recommended': featured first, then highest rating
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (Number(b.rating) || 0) - (Number(a.rating) || 0);
      });
  }, [tools, selectedCategory, searchQuery, sortBy]);

  const currentCategoryLabel = toolCategories.find((c) => c.id === selectedCategory)?.label || 'All';

  return (
    <div className="products-page">
      {/* ── HERO BANNER ── */}
      <section
        className="hero page-hero"
        style={{
          backgroundImage: `linear-gradient(115deg, rgba(10, 14, 23, 0.92) 0%, rgba(15, 23, 42, 0.82) 55%, rgba(168, 42, 16, 0.36) 100%), url(${heroBgImg})`
        }}
      >
        <div className="container">
          <div className="hero-content">
            <div className="hero-kicker">
              <span>SRM AKASH CONSTRUCTION</span>
              <span aria-hidden="true">·</span>
              <span>EQUIPMENT RENTALS</span>
            </div>
            <h1>Commercial Tool &amp; Equipment Rentals</h1>
            <p className="hero-desc">
              Browse calibrated power tools, diesel concrete mixers, tubular steel scaffolding, and excavation equipment available for daily or monthly site rentals.
            </p>
          </div>
        </div>
      </section>

      {/* ── MAIN TOOLS SECTION ── */}
      <section className="section" id="tools-catalog">
        <div className="container">
          <div className="catalog-top-header">
            <div>
              <span className="section-eyebrow">EQUIPMENT INVENTORY</span>
              <h2 style={{ fontSize: '2rem', marginBottom: '4px' }}>Tools &amp; Equipment Fleet</h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                Certified and safety-inspected machinery ready for rapid on-site deployment.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              id="openAddToolBtn"
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={16} />
              <span>Add Equipment</span>
            </button>
          </div>

          {/* Clean Professional Category Filter & Search/Sort Bar */}
          <div className="tools-filter-panel">
            {/* Search + Sort Controls Row */}
            <div className="tools-controls-row">
              {/* Search Box */}
              <div className="search-box">
                <Search size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                <input
                  type="text"
                  id="searchInput"
                  placeholder="Search tools, equipment, or specifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}
                    title="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Compact Professional Sort Control */}
              <div className="sort-control-container">
                <label htmlFor="sortSelect" className="sort-label">Sort by:</label>
                <div className="sort-select-box">
                  <SlidersHorizontal size={14} className="sort-icon" />
                  <select
                    className="sort-select"
                    id="sortSelect"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    aria-label="Sort tools"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="name-asc">Name: A → Z</option>
                    <option value="name-desc">Name: Z → A</option>
                    <option value="price-low">Price: Low → High</option>
                    <option value="price-high">Price: High → Low</option>
                    <option value="newest">Newest</option>
                    <option value="availability">Availability</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Minimal Text-Only Category Navigation (Strictly NO Emojis) */}
            <div className="tools-category-nav" id="catFilters" role="tablist" aria-label="Tool Categories">
              {toolCategories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    type="button"
                    key={cat.id}
                    role="tab"
                    aria-selected={isActive}
                    className={`tools-cat-pill ${isActive ? 'active' : ''}`}
                    onClick={() => handleCategorySelect(cat.id)}
                  >
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Meta Bar */}
          <div className="catalog-meta-bar">
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Showing{' '}
              <strong id="countDisplay" className="tabular-nums" style={{ color: 'var(--primary)' }}>
                {filteredTools.length}
              </strong>{' '}
              equipment units in catalog
              {selectedCategory !== 'all' && (
                <span> &bull; Category: <em>{currentCategoryLabel}</em></span>
              )}
            </p>
            <div className="catalog-delivery-tag">
              <Truck size={16} />
              <span>Express Site Delivery Across Salem &amp; Coimbatore</span>
            </div>
          </div>

          {/* Content Loading & Empty States */}
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              Loading equipment catalog...
            </div>
          ) : filteredTools.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
              <h3 style={{ marginBottom: '8px' }}>No equipment found matching your criteria</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                Try clearing your search query or selecting a different equipment category.
              </p>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="tools-display-layout">
              {/* ── RECOMMENDED TOOLS SECTION (When no search active and recommended tools exist) ── */}
              {!searchQuery && recommendedTools.length > 0 && (
                <div className="tools-block recommended-block">
                  <div className="tools-block-header">
                    <h3 className="tools-block-title">Recommended Tools</h3>
                    <span className="tools-block-caption">
                      Frequently rented &bull; Calibrated site favorites
                    </span>
                  </div>
                  <div className="products-grid">
                    {recommendedTools.map((tool) => (
                      <ToolCard
                        key={`rec-${tool._id || tool.id || tool.toolId}`}
                        tool={tool}
                        isRecommended={true}
                      />
                    ))}
                  </div>
                  <div className="tools-section-divider" />
                </div>
              )}

              {/* ── ALL TOOLS SECTION ── */}
              <div className="tools-block all-tools-block">
                <div className="tools-block-header">
                  <h3 className="tools-block-title">
                    {searchQuery
                      ? `Search Results (${filteredTools.length})`
                      : selectedCategory !== 'all'
                      ? `${currentCategoryLabel} Equipment (${filteredTools.length})`
                      : `All Tools (${filteredTools.length})`}
                  </h3>
                  <span className="tools-block-caption">
                    Complete inventory catalog with live availability
                  </span>
                </div>
                <div className="products-grid" id="productsGrid">
                  {filteredTools.map((tool) => (
                    <ToolCard
                      key={tool._id || tool.id || tool.toolId}
                      tool={tool}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <AddToolModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddTool={handleAddNewTool}
      />
    </div>
  );
};

export default Products;
