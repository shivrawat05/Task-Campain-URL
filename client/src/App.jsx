import React, { useState } from "react";
import { CampaignProvider, useCampaign } from "./context/CampaignContext";
import { Header } from "./components/dashboard/Header";
import { StatsOverview } from "./components/dashboard/StatsOverview";
import { CampaignTable } from "./components/campaigns/CampaignTable";
import { CampaignGrid } from "./components/campaigns/CampaignCard";
import { CampaignFormModal } from "./components/campaigns/CampaignFormModal";
import { DeleteConfirmModal } from "./components/campaigns/DeleteConfirmModal";
import { ClickAnalyticsModal } from "./components/campaigns/ClickAnalyticsModal";
import { ToastContainer } from "./components/common/Toast";
import { Search, LayoutGrid, List, Filter, X } from "lucide-react";

function DashboardContent() {
  const { statusFilter, setStatusFilter, searchTerm, setSearchTerm } =
    useCampaign();
  const [viewMode, setViewMode] = useState("table");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [deletingCampaign, setDeletingCampaign] = useState(null);
  const [analyticsCampaign, setAnalyticsCampaign] = useState(null);

  const handleOpenCreate = () => {
    setEditingCampaign(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (campaign) => {
    setEditingCampaign(campaign);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCampaign(null);
  };

  return (
    <div className="app-container">
      <Header onOpenCreateModal={handleOpenCreate} />

      <StatsOverview />

      <div className="control-bar">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, ID, or destination URL..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "var(--text-subtle)",
                cursor: "pointer",
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="filter-group">
          <div className="filter-tabs">
            {["all", "active", "paused"].map((tab) => (
              <button
                key={tab}
                className={`filter-tab ${statusFilter === tab ? "active" : ""}`}
                onClick={() => setStatusFilter(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="view-toggle">
            <button
              className={viewMode === "table" ? "active" : ""}
              onClick={() => setViewMode("table")}
              title="Table view"
              aria-label="Table view"
            >
              <List size={16} />
            </button>
            <button
              className={viewMode === "grid" ? "active" : ""}
              onClick={() => setViewMode("grid")}
              title="Grid card view"
              aria-label="Grid card view"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className={viewMode === "table" ? "data-panel" : ""}>
        {viewMode === "table" ? (
          <CampaignTable
            onEdit={handleOpenEdit}
            onDelete={setDeletingCampaign}
            onSelectAnalytics={setAnalyticsCampaign}
          />
        ) : (
          <CampaignGrid
            onEdit={handleOpenEdit}
            onDelete={setDeletingCampaign}
            onSelectAnalytics={setAnalyticsCampaign}
          />
        )}
      </div>

      <CampaignFormModal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        initialData={editingCampaign}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deletingCampaign)}
        onClose={() => setDeletingCampaign(null)}
        campaign={deletingCampaign}
      />

      <ClickAnalyticsModal
        isOpen={Boolean(analyticsCampaign)}
        onClose={() => setAnalyticsCampaign(null)}
        campaign={analyticsCampaign}
      />

      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <CampaignProvider>
      <DashboardContent />
    </CampaignProvider>
  );
}
