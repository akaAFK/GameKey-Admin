export default function Notifications({ notifications }) {
  return (
    <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {notifications.map(n => (
        <div key={n.id} style={{
          padding: '12px 18px',
          borderRadius: 8,
          background: n.type === 'danger' ? '#7f1d1d' : '#14532d',
          color: '#fff',
          fontSize: 14,
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          animation: 'slideIn 0.3s ease',
          minWidth: 260,
          borderLeft: `3px solid ${n.type === 'danger' ? '#e50914' : '#22c55e'}`,
        }}>
          {n.type === 'danger' ? '❌' : '✅'} {n.message}
        </div>
      ))}
      <style>{`@keyframes slideIn { from { transform: translateX(60px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </div>
  );
}