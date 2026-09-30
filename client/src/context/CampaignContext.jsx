import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const CampaignContext = createContext();

export function CampaignProvider({ children }) {
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const fetchCampaignsList = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getCampaigns({
        search: searchTerm,
        status: statusFilter
      });
      setCampaigns(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load campaigns');
      showToast(err.message || 'Failed to load campaigns', 'error');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, showToast]);

  const fetchStats = useCallback(async () => {
    try {
      const data = await api.getOverviewStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load overview stats:', err);
    }
  }, []);

  useEffect(() => {
    fetchCampaignsList();
  }, [fetchCampaignsList]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleCreate = async (payload) => {
    try {
      const created = await api.createCampaign(payload);
      showToast(`Campaign "${created.name}" created successfully!`, 'success');
      await Promise.all([fetchCampaignsList(), fetchStats()]);
      return created;
    } catch (err) {
      showToast(err.message || 'Failed to create campaign', 'error');
      throw err;
    }
  };

  const handleUpdate = async (id, payload) => {
    try {
      const updated = await api.updateCampaign(id, payload);
      showToast(`Campaign updated successfully!`, 'success');
      await Promise.all([fetchCampaignsList(), fetchStats()]);
      return updated;
    } catch (err) {
      showToast(err.message || 'Failed to update campaign', 'error');
      throw err;
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'paused' : 'active';
    try {
      setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: nextStatus } : c));
      await api.toggleStatus(id, nextStatus);
      showToast(`Campaign status changed to ${nextStatus}`, 'success');
      fetchStats();
    } catch (err) {
      setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: currentStatus } : c));
      showToast(err.message || 'Failed to update campaign status', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteCampaign(id);
      showToast('Campaign deleted successfully', 'success');
      await Promise.all([fetchCampaignsList(), fetchStats()]);
    } catch (err) {
      showToast(err.message || 'Failed to delete campaign', 'error');
      throw err;
    }
  };

  return (
    <CampaignContext.Provider
      value={{
        campaigns,
        stats,
        loading,
        error,
        statusFilter,
        setStatusFilter,
        searchTerm,
        setSearchTerm,
        toasts,
        showToast,
        removeToast,
        fetchCampaigns: fetchCampaignsList,
        fetchStats,
        createCampaign: handleCreate,
        updateCampaign: handleUpdate,
        toggleStatus: handleToggleStatus,
        deleteCampaign: handleDelete
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
}

export function useCampaign() {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error('useCampaign must be used within a CampaignProvider');
  }
  return context;
}
