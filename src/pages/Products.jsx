import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
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
      showToast(`Added ${newTool.name} to inventory!`, 'success');
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
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return (b.rating || 0) - (a.rating || 0);
    });
  }, [tools, selectedCategory, searchQuery, sortBy]);

  return (
            </p>
          </div>
        </div>
      </section>

