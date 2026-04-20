import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Notifications from './Notifications';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/products', label: 'Products', icon: '🎮' },
  { path: '/employees', label: 'Employees', icon: '👥' },
  { path: '/activity', label: 'Activity Log', icon: '📋' },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { notifications } = useApp();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0d0d0d', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
      {/* SIDEBAR */}
      <aside style={{
        width: sidebarOpen ? 220 : 64,
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.25s ease',
        overflow: 'hidden',
        flexShrink: 0,
        borderRight: '1px solid #1a1a1a',
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid #1a1a1a', whiteSpace: 'nowrap' }}>
          {sidebarOpen
            ? <span style={{ fontSize: 20, fontWeight: 'bold' }}>GameKey<span style={{ color: '#e50914' }}>Admin</span></span>
            : <span style={{ fontSize: 20 }}>🎮</span>
          }
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px' }}>
          {NAV_ITEMS.map(item => (
            <NavLink key={item.path} to={item.path} style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 8,
              marginBottom: 4,
              textDecoration: 'none',
              color: isActive ? '#fff' : '#aaa',
              background: isActive ? '#e50914' : 'transparent',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            })}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
              {sidebarOpen && <span style={{ fontSize: 14 }}>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Toggle */}
        <button onClick={() => setSidebarOpen(o => !o)} style={{
          margin: 12, padding: 10, background: '#1a1a1a', border: 'none',
          borderRadius: 8, color: '#aaa', cursor: 'pointer', fontSize: 14,
        }}>
          {sidebarOpen ? '◀ Collapse' : '▶'}
        </button>
      </aside>

      {/* MAIN */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* NAVBAR */}
        <header style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 28px', background: '#000', borderBottom: '1px solid #1a1a1a',
          position: 'sticky', top: 0, zIndex: 100,
        }}>
          <h2 style={{ fontSize: 16, fontWeight: 'bold', color: '#ccc', margin: 0 }}>Admin Dashboard</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <a href="/" target="_blank" style={{ color: '#e50914', fontSize: 13, textDecoration: 'none' }}>← Back to Store</a>
            <span style={{ fontSize: 13, color: '#777' }}>Admin</span>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#e50914', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 'bold' }}>A</div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main style={{ flex: 1, padding: 28, overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>

      {/* NOTIFICATIONS */}
      <Notifications notifications={notifications} />
    </div>
  );
}