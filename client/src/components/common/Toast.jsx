import React from 'react';
import { useCampaign } from '../../context/CampaignContext';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useCampaign();

  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast ${toast.type}`}>
          {toast.type === 'success' ? (
            <CheckCircle2 size={18} color="#34d399" />
          ) : (
            <AlertCircle size={18} color="#f87171" />
          )}
          <span style={{ flex: 1 }}>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 2 }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
