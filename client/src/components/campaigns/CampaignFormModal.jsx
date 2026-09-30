import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useCampaign } from '../../context/CampaignContext';
import { ExternalLink, Sparkles } from 'lucide-react';

export function CampaignFormModal({ isOpen, onClose, initialData = null }) {
  const { createCampaign, updateCampaign } = useCampaign();
  const isEditing = Boolean(initialData);

  const [formData, setFormData] = useState({
    name: '',
    campaign_id: '',
    destination_url: '',
    status: 'active'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        campaign_id: initialData.campaign_id || '',
        destination_url: initialData.destination_url || '',
        status: initialData.status || 'active'
      });
    } else {
      setFormData({
        name: '',
        campaign_id: '',
        destination_url: '',
        status: 'active'
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setFormData(prev => {
      const updated = { ...prev, name: newName };
      if (!isEditing && (!prev.campaign_id || prev.campaign_id === slugify(prev.name))) {
        updated.campaign_id = slugify(newName);
      }
      return updated;
    });
  };

  const slugify = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_-]/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 40);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Campaign name is required (min 2 characters).';
    }

    if (!isEditing) {
      const idRegex = /^[a-zA-Z0-9_-]{2,50}$/;
      if (!formData.campaign_id.trim()) {
        newErrors.campaign_id = 'Campaign ID is required.';
      } else if (!idRegex.test(formData.campaign_id.trim())) {
        newErrors.campaign_id = 'Use 2-50 characters: letters, numbers, hyphens, and underscores only.';
      }
    }

    try {
      const url = new URL(formData.destination_url.trim());
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        newErrors.destination_url = 'Destination URL must start with http:// or https://';
      }
    } catch (_) {
      newErrors.destination_url = 'Please enter a valid URL (e.g., https://example.com/promo).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      if (isEditing) {
        await updateCampaign(initialData.id, {
          name: formData.name.trim(),
          destination_url: formData.destination_url.trim(),
          status: formData.status
        });
      } else {
        await createCampaign({
          name: formData.name.trim(),
          campaign_id: formData.campaign_id.trim(),
          destination_url: formData.destination_url.trim(),
          status: formData.status
        });
      }
      onClose();
    } catch (err) {
      if (err.errors) {
        setErrors(err.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewTrackingUrl = `${window.location.origin}/r/${formData.campaign_id || 'your-campaign-id'}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Campaign' : 'Create New Campaign'}
    >
      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Campaign Name *</label>
            <input
              type="text"
              className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder="e.g. Summer Promo 2026"
              value={formData.name}
              onChange={handleNameChange}
              autoFocus
            />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Campaign ID (Slug) *</label>
              {!isEditing && (
                <span style={{ fontSize: '11px', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Sparkles size={12} /> Auto-generated
                </span>
              )}
            </div>
            <input
              type="text"
              className={`form-input ${errors.campaign_id ? 'error' : ''}`}
              placeholder="e.g. summer-promo-2026"
              value={formData.campaign_id}
              disabled={isEditing}
              style={isEditing ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
              onChange={(e) => setFormData(prev => ({ ...prev, campaign_id: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') }))}
            />
            {errors.campaign_id && <div className="form-error">{errors.campaign_id}</div>}
            <div className="form-help">
              Unique identifier used in your tracking URL.
            </div>
          </div>

          <div style={{
            background: 'rgba(99, 102, 241, 0.08)',
            border: '1px dashed rgba(99, 102, 241, 0.3)',
            borderRadius: '10px',
            padding: '12px 14px',
            marginBottom: '20px'
          }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>
              Tracking URL Preview
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#c7d2fe', wordBreak: 'break-all' }}>
              {previewTrackingUrl}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Destination URL *</label>
            <input
              type="url"
              className={`form-input ${errors.destination_url ? 'error' : ''}`}
              placeholder="https://yourwebsite.com/landing-page"
              value={formData.destination_url}
              onChange={(e) => setFormData(prev => ({ ...prev, destination_url: e.target.value }))}
            />
            {errors.destination_url && <div className="form-error">{errors.destination_url}</div>}
            <div className="form-help">
              Visitors will be redirected (302) to this destination URL.
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Campaign Status</label>
            <select
              className="form-select"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="active">Active (Redirecting & Recording Clicks)</option>
              <option value="paused">Paused (Temporarily Halts Clicks)</option>
            </select>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Campaign')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
