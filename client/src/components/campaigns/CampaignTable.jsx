import React, { useState } from 'react';
import { useCampaign } from '../../context/CampaignContext';
import { truncateUrl } from '../../utils/formatters';
import {
  ExternalLink,
  Copy,
  Check,
  Edit2,
  Trash2,
  Play,
  Pause,
  MousePointerClick,
  Sparkles,
  Search
} from 'lucide-react';

export function CampaignTable({ onEdit, onDelete, onSelectAnalytics }) {
  const { campaigns, loading, toggleStatus, showToast } = useCampaign();
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (campaign) => {
    const trackingUrl = campaign.tracking_url || `${window.location.origin}/r/${campaign.campaign_id}`;
    navigator.clipboard.writeText(trackingUrl);
    setCopiedId(campaign.id);
    showToast(`Copied tracking URL for "${campaign.name}"!`, 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading && campaigns.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
        <p>Loading campaigns...</p>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <Search size={28} />
        </div>
        <h3 className="empty-title">No campaigns found</h3>
        <p className="empty-desc">
          No matching campaigns were found. Try adjusting your search or create a new campaign to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="campaign-table">
        <thead>
          <tr>
            <th>Campaign</th>
            <th>Destination URL</th>
            <th>Tracking URL</th>
            <th>Status</th>
            <th>Total Clicks</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign) => {
            const isCopied = copiedId === campaign.id;
            const trackingUrl = campaign.tracking_url || `${window.location.origin}/r/${campaign.campaign_id}`;

            return (
              <tr key={campaign.id}>
                <td>
                  <div className="campaign-identity">
                    <span className="campaign-name-title">{campaign.name}</span>
                    <span className="campaign-id-badge">
                      <span>ID:</span>
                      <code>{campaign.campaign_id}</code>
                    </span>
                  </div>
                </td>

                <td>
                  <div className="url-cell" title={campaign.destination_url}>
                    <a
                      href={campaign.destination_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="url-text"
                    >
                      {truncateUrl(campaign.destination_url, 30)}
                    </a>
                    <a
                      href={campaign.destination_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--text-subtle)', display: 'inline-flex' }}
                    >
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </td>

                <td>
                  <div className="tracking-url-pill">
                    <a
                      href={trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tracking-url-link"
                      title="Test Tracking Link (Will record click and redirect)"
                    >
                      /r/{campaign.campaign_id}
                    </a>
                    <button
                      className="copy-button"
                      onClick={() => handleCopy(campaign)}
                      title="Copy full tracking URL"
                      aria-label="Copy tracking URL"
                    >
                      {isCopied ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
                    </button>
                  </div>
                </td>

                <td>
                  <span className={`status-pill ${campaign.status}`}>
                    <span className="status-dot"></span>
                    {campaign.status}
                  </span>
                </td>

                <td>
                  <button
                    className="clicks-count-pill"
                    onClick={() => onSelectAnalytics(campaign)}
                    title="Click to view detailed visitor analytics"
                  >
                    <MousePointerClick size={14} color="#818cf8" />
                    <span>{campaign.total_clicks || 0}</span>
                  </button>
                </td>

                <td>
                  <div className="actions-cell" style={{ justifyContent: 'flex-end' }}>
                    <button
                      className="btn-icon"
                      onClick={() => toggleStatus(campaign.id, campaign.status)}
                      title={campaign.status === 'active' ? 'Pause Campaign' : 'Activate Campaign'}
                      style={{
                        color: campaign.status === 'active' ? '#fbbf24' : '#34d399'
                      }}
                    >
                      {campaign.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                    </button>

                    <button
                      className="btn-icon"
                      onClick={() => onEdit(campaign)}
                      title="Edit Campaign"
                    >
                      <Edit2 size={16} />
                    </button>

                    <button
                      className="btn-icon"
                      onClick={() => onDelete(campaign)}
                      title="Delete Campaign"
                      style={{ color: '#f87171' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
