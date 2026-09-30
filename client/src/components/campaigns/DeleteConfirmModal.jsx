import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useCampaign } from '../../context/CampaignContext';
import { AlertTriangle } from 'lucide-react';

export function DeleteConfirmModal({ isOpen, onClose, campaign }) {
  const { deleteCampaign } = useCampaign();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!campaign) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteCampaign(campaign.id);
      onClose();
    } catch (err) {
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Campaign">
      <div className="modal-body">
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'var(--danger-bg)',
            color: 'var(--danger)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <AlertTriangle size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: '#ffffff' }}>
              Are you sure you want to delete this campaign?
            </h4>
            <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.5, marginBottom: '12px' }}>
              You are about to permanently delete <strong>{campaign.name}</strong> (<code>{campaign.campaign_id}</code>).
            </p>
            <p style={{ fontSize: '13px', color: '#f87171' }}>
              ⚠️ This will delete all <strong>{campaign.total_clicks || 0}</strong> recorded click analytics. This action cannot be undone.
            </p>
          </div>
        </div>
      </div>

      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isDeleting}>
          Cancel
        </button>
        <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? 'Deleting...' : 'Delete Campaign'}
        </button>
      </div>
    </Modal>
  );
}
