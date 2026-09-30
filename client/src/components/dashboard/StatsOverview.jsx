import React from 'react';
import { Layers, Activity, PauseCircle, MousePointerClick, TrendingUp } from 'lucide-react';
import { useCampaign } from '../../context/CampaignContext';
import { formatNumber } from '../../utils/formatters';

export function StatsOverview() {
  const { stats } = useCampaign();

  if (!stats) return null;

  const cards = [
    {
      label: 'Total Campaigns',
      value: formatNumber(stats.totalCampaigns),
      icon: Layers,
      color: '#6366f1',
      bgColor: 'rgba(99, 102, 241, 0.15)',
      subtext: 'Configured campaign links'
    },
    {
      label: 'Active Campaigns',
      value: formatNumber(stats.activeCampaigns),
      icon: Activity,
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.15)',
      subtext: 'Actively redirecting traffic'
    },
    {
      label: 'Paused Campaigns',
      value: formatNumber(stats.pausedCampaigns),
      icon: PauseCircle,
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.15)',
      subtext: 'Temporarily disabled links'
    },
    {
      label: 'Total Clicks Recorded',
      value: formatNumber(stats.totalClicks),
      icon: MousePointerClick,
      color: '#a855f7',
      bgColor: 'rgba(168, 85, 247, 0.15)',
      subtext: stats.topCampaign ? `Top: "${stats.topCampaign.name}" (${stats.topCampaign.clicks} clicks)` : 'Across all campaigns'
    }
  ];

  return (
    <div className="stats-grid">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div key={index} className="stat-card">
            <div className="stat-header">
              <span className="stat-label">{card.label}</span>
              <div className="stat-icon-wrapper" style={{ background: card.bgColor, color: card.color }}>
                <IconComponent size={20} />
              </div>
            </div>
            <div className="stat-value">{card.value}</div>
            <div className="stat-subtext">{card.subtext}</div>
          </div>
        );
      })}
    </div>
  );
}
