import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Plus, SlidersHorizontal, Truck } from 'lucide-react';
import { initialToolsData, toolCategories } from '../data/tools';
import { ToolCard } from '../components/ToolCard';
import { AddToolModal } from '../components/AddToolModal';
import { useToast } from '../context/ToastContext';
import heroBgImg from '../assets/images/hero_construction_site_1790694659406.jpg';
import equipmentImg from '../assets/images/equipment_rental_fleet_1790694712199.jpg';

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
              ...item,
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
                desc:
                  item.description ||
                  item.desc ||
                  localMatch?.desc ||
                  'Professional construction tool.',
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
          icon: enrichedTool.icon || '🔨',
          available: enrichedTool.availabilityStatus === 'Available',
          image: enrichedTool.image
        })
      });
      showToast(`Added ${enrichedTool.name} to inventory!`, 'success');
    } catch (err) {
      console.warn('Backend tool sync failed (local state preserved):', err);
    }
  };

  const filteredTools = useMemo(() => {
    return tools
      .filter((tool) => {
        const matchesCategory =
          selectedCategory === 'all' || tool.category === selectedCategory;
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          tool.name?.toLowerCase().includes(q) ||
          tool.desc?.toLowerCase().includes(q) ||
          tool.category?.toLowerCase().includes(q) ||
          tool.specs?.toLowerCase().includes(q);
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
        if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
        if (sortBy === 'name-asc') return (a.name || '').localeCompare(b.name || '');
        if (sortBy === 'availability') {
          const aAvail =
            (a.availabilityStatus || (a.available ? 'Available' : 'Rented')) === 'Available'
              ? 1
              : 0;
          const bAvail =
            (b.availabilityStatus || (b.available ? 'Available' : 'Rented')) === 'Available'
              ? 1
              : 0;
          return bAvail - aAvail;
        }
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (b.rating || 0) - (a.rating || 0);
      });
  }, [tools, selectedCategory, searchQuery, sortBy]);

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
              <span>EQUIPMENT &amp; MACHINERY FLEET</span>
              <span aria-hidden="true">·</span>
              <span>EXPRESS SITE DELIVERY</span>
            </div>
            <h1>Commercial Tool &amp; Equipment Rentals</h1>
            <p className="hero-desc">
              Browse heavy power tools, diesel concrete mixers, tubular steel scaffolding frames, and de-watering pumps available for daily, weekly, or monthly site rentals.
            </p>
          </div>
        </div>
      </section>

      {/* ── MAIN CATALOG SECTION ── */}
      <section className="section">
        <div className="container">
          <div className="catalog-top-header">
            <div>
              <span className="section-eyebrow">RENTAL INVENTORY</span>
              <h2 style={{ fontSize: '2rem', marginBottom: '4px' }}>Site-Ready Construction Equipment</h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                Calibrated and safety-inspected machinery ready for immediate dispatch.
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

          {/* Filter Bar */}
          <div className="filter-bar">
            <div className="search-box">
              <Search size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <input
                type="text"
                id="searchInput"
                placeholder="Search power drills, mixers, scaffolding..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="cat-filters" id="catFilters">
              {toolCategories.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  className={`cat-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => handleCategorySelect(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="sort-select-wrap">
              <SlidersHorizontal size={15} style={{ color: 'var(--text-muted)' }} />
              <select
                className="sort-select"
                id="sortSelect"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recommended">Sort: Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-asc">Name: A–Z</option>
                <option value="availability">Availability First</option>
              </select>
            </div>
          </div>

          <div className="catalog-meta-bar">
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Showing{' '}
              <strong id="countDisplay" className="tabular-nums" style={{ color: 'var(--primary)' }}>
                {filteredTools.length}
              </strong>{' '}
              equipment units in catalog
            </p>
            <div className="catalog-delivery-tag">
              <Truck size={16} />
              <span>2-Hour Express Site Delivery Across Salem &amp; Coimbatore</span>
            </div>
          </div>

          {/* Products Grid */}
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
            <div className="products-grid" id="productsGrid">
              {filteredTools.map((tool) => (
                <ToolCard key={tool._id || tool.id} tool={tool} />
              ))}
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
