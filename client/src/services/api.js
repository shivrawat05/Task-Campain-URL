const API_BASE = '/api/v1/campaigns';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = result.message || `Request failed with status ${response.status}`;
      const err = new Error(errorMsg);
      err.errors = result.errors;
      err.status = response.status;
      throw err;
    }

    return result.data;
  } catch (error) {
    console.error(`API Error on ${url}:`, error);
    throw error;
  }
}

export const api = {
  getCampaigns: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.status && filters.status !== 'all') params.append('status', filters.status);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return request(`/${queryString}`);
  },

  getOverviewStats: () => {
    return request('/overview/stats');
  },

  getCampaign: (id) => {
    return request(`/${id}`);
  },

  createCampaign: (payload) => {
    return request('', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  updateCampaign: (id, payload) => {
    return request(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  },

  toggleStatus: (id, status) => {
    return request(`/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  deleteCampaign: (id) => {
    return request(`/${id}`, {
      method: 'DELETE'
    });
  },

  getAnalytics: (id) => {
    return request(`/${id}/analytics`);
  }
};
