import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { api } from '../../services/api';
import { formatDate } from '../../utils/formatters';
import { MousePointerClick, Calendar, Globe, Monitor, ExternalLink, ShieldCheck } from 'lucide-react';

export function ClickAnalyticsModal({ isOpen, onClose, campaign }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && campaign) {
      setLoading(true);
      setError(null);
      api.getAnalytics(campaign.id)
        .then(res => setData(res))
        .catch(err => setError(err.message || 'Failed to load click analytics'))
        .finally(() => setLoading(false));
    } else {
      setData(null);
    }
  }, [isOpen, campaign]);

  if (!campaign) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Click Analytics: ${campaign.name}`}
      maxWidth={720}
    >
      <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>Campaign ID</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600, color: '#c7d2fe' }}>
              {campaign.campaign_id}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>Current Status</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: campaign.status === 'active' ? '#34d399' : '#fbbf24' }}>
              {campaign.status.toUpperCase()}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>Total Clicks</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>
              {campaign.total_clicks || 0}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>Last Visited</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {formatDate(campaign.last_clicked_at)}
            </div>
          </div>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            Loading click history records...
          </div>
        )}

        {error && (
          <div style={{ padding: '16px', borderRadius: '10px', background: 'var(--danger-bg)', color: '#f87171' }}>
            {error}
          </div>
        )}

        {!loading && data && (
          <>
            <h4 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-subtle)', marginBottom: '12px' }}>
              Recent Click Stream ({data.recent_clicks?.length || 0} Events)
            </h4>

            {data.recent_clicks?.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-subtle)', border: '1px dashed var(--border-subtle)', borderRadius: '12px' }}>
                <MousePointerClick size={32} style={{ opacity: 0.4, marginBottom: '8px' }} />
                <p>No clicks recorded yet for this campaign tracking URL.</p>
                <p style={{ fontSize: '12px', marginTop: '4px' }}>Visit the tracking URL to see live clicks appear here!</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto', border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255, 255, 255, 0.03)', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' }}>
                      <th style={{ padding: '10px 14px', color: 'var(--text-subtle)', fontWeight: 600 }}>Time</th>
                      <th style={{ padding: '10px 14px', color: 'var(--text-subtle)', fontWeight: 600 }}>IP Address</th>
                      <th style={{ padding: '10px 14px', color: 'var(--text-subtle)', fontWeight: 600 }}>Referer</th>
                      <th style={{ padding: '10px 14px', color: 'var(--text-subtle)', fontWeight: 600 }}>User Agent / Device</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recent_clicks.map((clk) => (
                      <tr key={clk.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '10px 14px', whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>
                          {formatDate(clk.clicked_at)}
                        </td>
                        <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#c7d2fe' }}>
                          {clk.ip_address || '127.0.0.1'}
                        </td>
                        <td style={{ padding: '10px 14px', color: 'var(--text-main)', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {clk.referer || 'Direct'}
                        </td>
                        <td style={{ padding: '10px 14px', color: 'var(--text-subtle)', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '12px' }} title={clk.user_agent}>
                          {clk.user_agent || 'Unknown'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
      </div>
    </Modal>
  );
}
