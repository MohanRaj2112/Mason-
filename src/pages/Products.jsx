import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { initialToolsData, toolCategories } from '../data/tools';
import { ToolCard } from '../components/ToolCard';
import { RentalModal } from '../components/RentalModal';
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
  
  // Modals state
  const [selectedRentalTool, setSelectedRentalTool] = useState(null);
  const [showRentalModal, setShowRentalModal] = useState(false);
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
            const merged = data.map(item => {
              const localMatch = initialToolsData.find(t => t.name === item.name || t._id === item._id);
              return {
                ...localMatch,
                ...item,
                image: item.image || localMatch?.image || '',
                desc: item.description || item.desc || localMatch?.desc || 'Professional construction tool.',
                specs: item.specs || localMatch?.specs || '',
                period: item.period || 'Day',
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

  const handleOpenRental = (tool) => {
    setSelectedRentalTool(tool);
    setShowRentalModal(true);
  };

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
      return 0;
    });
  }, [tools, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="tools-rental-page" style={{ background: 'var(--bg-main)', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* ── SIMPLE & CLEAN HEADER ── */}
      <section className="tools-simple-header">
        <div className="container">
          <div className="tools-header-content">
            <span className="section-eyebrow">EQUIPMENT CATALOG</span>
            <h1 className="tools-header-title">TOOLS RENTAL</h1>
            <p className="tools-header-subtitle">
              Construction tools &amp; equipment available for rental.
            </p>
          </div>
        </div>
      </section>

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

    </div>
  );
};
