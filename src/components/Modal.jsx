export default function Modal({ title, onClose, children, width = 480 }) {
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#111', borderRadius: 12, padding: 28,
        width, maxWidth: '95vw', border: '1px solid #2a2a2a',
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 18 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#aaa', fontSize: 20, cursor: 'pointer' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}