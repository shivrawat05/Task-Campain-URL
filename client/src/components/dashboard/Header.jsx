import React from 'react';
import { Link2, Plus, RefreshCw } from 'lucide-react';
import { useCampaign } from '../../context/CampaignContext';

export function Header({ onOpenCreateModal }) {
  const { fetchCampaigns, fetchStats, loading } = useCampaign();

  const handleRefresh = async () => {
    await Promise.all([fetchCampaigns(), fetchStats()]);
  };

  return (
    <header className="header">
      <div className="brand-wrapper">
        <div className="brand-logo">
          <Link2 size={24} />
        </div>
        <div>
          <h1 className="brand-title">Campaign URL Manager</h1>
          <p className="brand-subtitle">High-performance link management, tracking & click analytics</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          className="btn btn-secondary"
          onClick={handleRefresh}
          disabled={loading}
          title="Refresh campaigns and statistics"
        >
          <RefreshCw size={16} className={loading ? 'spin' : ''} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          <span>Refresh</span>
        </button>

        <button
          id="btn-create-campaign"
          className="btn btn-primary"
          onClick={onOpenCreateModal}
        >
          <Plus size={18} />
          <span>New Campaign</span>
        </button>
      </div>
    </header>
  );
}
