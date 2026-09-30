import React, { useState } from "react";
import { useCampaign } from "../../context/CampaignContext";
import { truncateUrl, formatDate } from "../../utils/formatters";
import {
  ExternalLink,
  Copy,
  Check,
  Edit2,
  Trash2,
  Play,
  Pause,
  MousePointerClick,
  Calendar,
} from "lucide-react";

export function CampaignGrid({ onEdit, onDelete, onSelectAnalytics }) {
  const { campaigns, loading, toggleStatus, showToast } = useCampaign();
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (campaign) => {
    const trackingUrl =
      campaign.tracking_url ||
      `${window.location.origin}/r/${campaign.campaign_id}`;
    navigator.clipboard.writeText(trackingUrl);
    setCopiedId(campaign.id);
    showToast(`Copied tracking URL for "${campaign.name}"!`, "success");
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading && campaigns.length === 0) return null;

  return (
    <div className="campaign-grid">
      {campaigns.map((campaign) => {
        const isCopied = copiedId === campaign.id;
        const trackingUrl =
          campaign.tracking_url ||
          `${window.location.origin}/r/${campaign.campaign_id}`;

        return (
          <div key={campaign.id} className="grid-card">
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "12px",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "var(--text-main)",
                      marginBottom: "4px",
                    }}
                  >
                    {campaign.name}
                  </h3>
                  <div className="campaign-id-badge">
                    <span>ID:</span>
                    <code>{campaign.campaign_id}</code>
                  </div>
                </div>
                <span className={`status-pill ${campaign.status}`}>
                  <span className="status-dot"></span>
                  {campaign.status}
                </span>
              </div>

              <div style={{ marginBottom: "14px" }}>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--text-subtle)",
                    textTransform: "uppercase",
                    marginBottom: "3px",
                  }}
                >
                  Destination URL
                </div>
                <div className="url-cell" style={{ maxWidth: "100%" }}>
                  <a
                    href={campaign.destination_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="url-text"
                  >
                    {truncateUrl(campaign.destination_url, 35)}
                  </a>
                  <ExternalLink
                    size={13}
                    style={{ color: "var(--text-subtle)" }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "18px" }}>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--text-subtle)",
                    textTransform: "uppercase",
                    marginBottom: "4px",
                  }}
                >
                  Tracking Link
                </div>
                <div
                  className="tracking-url-pill"
                  style={{ width: "100%", justifyContent: "space-between" }}
                >
                  <a
                    href={trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tracking-url-link"
                    style={{ maxWidth: "240px" }}
                  >
                    /r/{campaign.campaign_id}
                  </a>
                  <button
                    className="copy-button"
                    onClick={() => handleCopy(campaign)}
                    title="Copy full tracking URL"
                  >
                    {isCopied ? (
                      <Check size={14} color="#34d399" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: "16px",
                borderTop: "1px solid var(--border-subtle)",
                marginTop: "12px",
              }}
            >
              <button
                className="clicks-count-pill"
                onClick={() => onSelectAnalytics(campaign)}
                title="View click history"
              >
                <MousePointerClick size={14} color="#818cf8" />
                <span>{campaign.total_clicks || 0} Clicks</span>
              </button>

              <div className="actions-cell">
                <button
                  className="btn-icon"
                  onClick={() => toggleStatus(campaign.id, campaign.status)}
                  title={
                    campaign.status === "active"
                      ? "Pause Campaign"
                      : "Activate Campaign"
                  }
                  style={{
                    color: campaign.status === "active" ? "#fbbf24" : "#34d399",
                  }}
                >
                  {campaign.status === "active" ? (
                    <Pause size={16} />
                  ) : (
                    <Play size={16} />
                  )}
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
                  style={{ color: "#f87171" }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
