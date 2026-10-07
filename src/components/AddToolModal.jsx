import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { toolCategories } from '../data/tools';

export const AddToolModal = ({ isOpen, onClose, onAddTool }) => {
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: '',
    category: 'power-tools',
    price: '',
    period: 'Per Day',
    status: 'Available',
    contact: 'Site Delivery',
    image: '',
    desc: '',
    // Structured specifications fields
    material: '',
    weight: '',
    power: '',
    capacity: '',
    type: '',
    customSpecs: ''
  });

  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleImageFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
        setForm(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) {
      showToast('Please enter both the tool name and rental rate.', 'error');
      return;
    }

    setIsSubmitting(true);

    // Build structured specifications object with only provided fields
    const structuredSpecs = {};
    if (form.material.trim()) structuredSpecs.Material = form.material.trim();
    if (form.weight.trim()) structuredSpecs.Weight = form.weight.trim();
    if (form.power.trim()) structuredSpecs.Power = form.power.trim();
    if (form.capacity.trim()) structuredSpecs.Capacity = form.capacity.trim();
    if (form.type.trim()) structuredSpecs.Type = form.type.trim();

    // Parse custom specs if key: value format
    if (form.customSpecs.trim()) {
      const parts = form.customSpecs.split(/[\n,;]+/).map(s => s.trim()).filter(Boolean);
      for (const p of parts) {
        const cIdx = p.indexOf(':');
        if (cIdx > 0) {
          const k = p.substring(0, cIdx).trim();
          const v = p.substring(cIdx + 1).trim();
          if (k && v) structuredSpecs[k] = v;
        } else {
          structuredSpecs.Features = p;
        }
      }
    }

    // Build formatted specs string for compatibility
    const specsSummaryList = [];
    if (form.material.trim()) specsSummaryList.push(`Material: ${form.material.trim()}`);
    if (form.weight.trim()) specsSummaryList.push(`Weight: ${form.weight.trim()}`);
    if (form.power.trim()) specsSummaryList.push(`Power: ${form.power.trim()}`);
    if (form.capacity.trim()) specsSummaryList.push(`Capacity: ${form.capacity.trim()}`);
    if (form.type.trim()) specsSummaryList.push(`Type: ${form.type.trim()}`);
    if (form.customSpecs.trim()) specsSummaryList.push(form.customSpecs.trim());

    const specsSummary = specsSummaryList.join(', ') || 'Heavy-duty certified construction equipment';

    const newTool = {
      _id: 'tool_' + Date.now(),
      name: form.name.trim(),
      category: form.category,
      price: parseInt(form.price, 10),
      pricePerDay: parseInt(form.price, 10),
      period: form.period || 'Per Day',
      availabilityStatus: form.status,
      available: form.status === 'Available',
      contactOption: form.contact,
      image: imagePreview || form.image || '',
      specifications: Object.keys(structuredSpecs).length > 0 ? structuredSpecs : null,
      specs: specsSummary,
      desc: form.desc.trim() || 'Professional construction tool calibrated for dependable heavy-duty job site performance.'
    };

    try {
      if (onAddTool) {
        await onAddTool(newTool);
      }
      showToast(`Added "${newTool.name}" to Tools Rental marketplace!`, 'success');
      onClose();
      // Reset form
      setForm({
        name: '',
        category: 'power-tools',
        price: '',
        period: 'Per Day',
        status: 'Available',
        contact: 'Site Delivery',
        image: '',
        desc: '',
        material: '',
        weight: '',
        power: '',
        capacity: '',
        type: '',
        customSpecs: ''
      });
      setImagePreview('');
    } catch (err) {
      showToast('Failed to save equipment. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay active" onClick={onClose} style={{ zIndex: 1000 }}>
      <div 
        className="modal modal-add-tool"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <button 
          className="modal-close" 
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        <div style={{ marginBottom: '18px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
          <span className="section-eyebrow">EQUIPMENT INVENTORY</span>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginTop: '2px' }}>
            Add Equipment to Catalog
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            List a new construction tool or machinery with structured specifications for easy client scanning.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Tool Name */}
          <div className="form-group">
            <label className="form-label">Tool / Equipment Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Rotary Hammer Drill 800W or Commercial Cement Mixer"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          {/* Category (NO Emojis) & Price */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                className="form-control"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {toolCategories.filter(c => c.id !== 'all').map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Daily Rental Rate (₹) *</label>
              <input
                type="number"
                className="form-control"
                placeholder="e.g. 450"
                min="50"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Status & Delivery */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Availability Status</label>
              <select
                className="form-control"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="Available">Available in Stock</option>
                <option value="Rented">Currently On Site (In Use)</option>
                <option value="Maintenance">In Calibration / Maintenance</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Delivery Logistics</label>
              <select
                className="form-control"
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
              >
                <option value="Site Delivery">Site Delivery (Salem &amp; Coimbatore)</option>
                <option value="Pickup from Yard">Yard Pickup</option>
                <option value="2-Hour Express">2-Hour Express Dispatch</option>
              </select>
            </div>
          </div>

          {/* Structured Specifications Section */}
          <div style={{ background: 'var(--bg-main)', padding: '14px', borderRadius: 'var(--radius-md)', margin: '14px 0', border: '1px solid var(--border-light)' }}>
            <div style={{ marginBottom: '10px' }}>
              <strong style={{ fontSize: '0.88rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Tool Specifications
              </strong>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Fill only the specifications that apply to this tool (only non-empty fields will appear on the card).
              </p>
            </div>

            <div className="grid-2" style={{ gap: '10px' }}>
              <div>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Material</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Drop-Forged Steel"
                  value={form.material}
                  onChange={(e) => setForm({ ...form, material: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Weight / Load</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 2 kg or 180 kg load"
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: e.target.value })}
                />
              </div>
            </div>

            <div className="grid-2" style={{ gap: '10px', marginTop: '8px' }}>
              <div>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Power / Voltage</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 800W / 220V"
                  value={form.power}
                  onChange={(e) => setForm({ ...form, power: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Capacity / Volume</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 200 Litres or 110L"
                  value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                />
              </div>
            </div>

            <div className="grid-2" style={{ gap: '10px', marginTop: '8px' }}>
              <div>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Type / Standard</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Heavy Duty or ISI Class-C"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Other Specs (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Chuck: SDS-Plus"
                  value={form.customSpecs}
                  onChange={(e) => setForm({ ...form, customSpecs: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="form-group">
            <label className="form-label">Tool Photo</label>
            <div className="grid-2" style={{ alignItems: 'center' }}>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={handleImageFile}
              />
              <input
                type="url"
                className="form-control"
                placeholder="Or paste image URL"
                value={form.image}
                onChange={(e) => {
                  setForm({ ...form, image: e.target.value });
                  setImagePreview(e.target.value);
                }}
              />
            </div>
            {imagePreview && (
              <div style={{ marginTop: '10px', height: '110px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
          </div>

          {/* Description (Preserved for View Details Modal) */}
          <div className="form-group">
            <label className="form-label">Complete Description (Displayed in "View Details" modal)</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Detailed job site applications, contractor usage guidelines, engine/safety notes..."
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
            />
          </div>

          <div className="flex gap-12 justify-between" style={{ marginTop: '20px' }}>
            <button 
              type="button" 
              className="btn btn-outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-accent btn-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Add Equipment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddToolModal;
