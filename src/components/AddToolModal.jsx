import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';

export const AddToolModal = ({ isOpen, onClose, onAddTool }) => {
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: '',
    category: 'power-tools',
    price: '',
    period: 'Per Day',
    status: 'Available',
    contact: 'Site Delivery',
    icon: '🔨',
    image: '',
    desc: '',
    specs: ''
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

    const newTool = {
      _id: 'tool_' + Date.now(),
      name: form.name.trim(),
      category: form.category,
      price: parseInt(form.price),
      period: form.period || 'Per Day',
      availabilityStatus: form.status,
      available: form.status === 'Available',
      contactOption: form.contact,
      icon: form.icon || '🔨',
      image: imagePreview || form.image || '',
      specs: form.specs || 'Standard commercial site specifications',
      desc: form.desc.trim() || 'Professional construction tool calibrated for dependable heavy-duty job site performance.'
    };

    try {
      if (onAddTool) {
        await onAddTool(newTool);
      }
      showToast(`Added "${newTool.name}" to Tools Rental marketplace! 🎉`, 'success');
      onClose();
      // Reset form
      setForm({
        name: '',
        category: 'power-tools',
        price: '',
        period: 'Per Day',
        status: 'Available',
        contact: 'Site Delivery',
        icon: '🔨',
        image: '',
        desc: '',
        specs: ''
      });
      setImagePreview('');
    } catch (err) {
      showToast('Failed to save equipment. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div 
        className="modal modal-add-tool"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="modal-close" 
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        <div style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
          <span className="section-eyebrow">EQUIPMENT INVENTORY</span>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)' }}>
            ➕ Add Equipment to Rental Catalog
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            List a new construction tool or heavy machinery for reliable site rental.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tool / Equipment Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Bosch Professional 11kg Demolition Breaker"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                className="form-control"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="power-tools">🔨 Power Tools</option>
                <option value="mixing">🪣 Concrete &amp; Mixing</option>
                <option value="roofing">🏗️ Scaffolding &amp; Roofing</option>
                <option value="plumbing">🔧 Plumbing &amp; Pumps</option>
                <option value="safety">🦺 Safety Gear</option>
                <option value="sanitary">🚿 Sanitary &amp; Hardware</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Daily Rental Rate (₹) *</label>
              <input
                type="number"
                className="form-control"
                placeholder="e.g. 650"
                min="50"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Availability Status</label>
              <select
                className="form-control"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="Available">🟢 Available in Stock</option>
                <option value="Rented">🟡 Currently On Site (Rented)</option>
                <option value="Maintenance">🔴 In Calibration / Maintenance</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Delivery Option</label>
              <select
                className="form-control"
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
              >
                <option value="Site Delivery">🚚 Site Delivery Available</option>
                <option value="Pickup from Yard">🏢 Pickup from Yard</option>
                <option value="Urgent 2-Hr Express">⚡ Urgent 2-Hr Express</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Photo Upload or Image URL</label>
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
                placeholder="Or paste image URL (https://...)"
                value={form.image}
                onChange={(e) => {
                  setForm({ ...form, image: e.target.value });
                  setImagePreview(e.target.value);
                }}
              />
            </div>
            {imagePreview && (
              <div style={{ marginTop: '10px', height: '100px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Key Specifications</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. 1800W motor, 45 Joules impact, 30mm HEX chuck"
              value={form.specs}
              onChange={(e) => setForm({ ...form, specs: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Equipment Description</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Explain ideal applications, power source, and safety precautions..."
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
            />
          </div>

          <div className="flex gap-12 justify-between" style={{ marginTop: '24px' }}>
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
              {isSubmitting ? 'Saving...' : '💾 Add to Marketplace'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
