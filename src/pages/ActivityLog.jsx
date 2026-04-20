import { useApp } from '../context/AppContext';

export default function ActivityLog() {
  const { activityLog, logActivity } = useApp();

  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const getIcon = (action) => {
    if (action.startsWith('Added')) return '➕';
    if (action.startsWith('Updated')) return '✏️';
    if (action.startsWith('Deleted')) return '🗑️';
    return '📋';
  };

  const getColor = (action) => {
    if (action.startsWith('Added')) return '#22c55e';
    if (action.startsWith('Updated')) return '#3b82f6';
    if (action.startsWith('Deleted')) return '#ef4444';
    return '#888';
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24 }}>Activity Log</h1>
        <span style={{ color: '#666', fontSize: 13 }}>{activityLog.length} entries</span>
      </div>

      {activityLog.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#555', background: '#1a1a1a', borderRadius: 12 }}>
          No activity yet. Start by adding or editing products and employees.
        </div>
      ) : (
        <div style={{ background: '#1a1a1a', borderRadius: 10, overflow: 'hidden' }}>
          {activityLog.map((entry, i) => (
            <div key={entry.id} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 20px',
              borderBottom: i < activityLog.length - 1 ? '1px solid #222' : 'none',
            }}>
              <span style={{ fontSize: 16 }}>{getIcon(entry.action)}</span>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 14, color: getColor(entry.action) }}>{entry.action}</p>
              </div>
              <span style={{ fontSize: 12, color: '#555', whiteSpace: 'nowrap' }}>{formatTime(entry.timestamp)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}