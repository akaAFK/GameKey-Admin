import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useSearch, useSort, usePagination, useProductFilters } from '../hooks/useFilters';
import Modal from '../components/Modal';
import { exportToCSV } from '../utils/exportCSV';

const EMPTY_FORM = { name: '', category: 'Action', price: '', stock: '', description: '' };
const CATEGORIES = ['Action', 'RPG', 'Horror'];
const PAGE_SIZE = 5;

function SortHeader({ label, field, sortKey, sortDir, onSort }) {
  return (
    <th onClick={() => onSort(field)} style={{ cursor: 'pointer', padding: '10px 12px', textAlign: 'left', color: '#888', fontSize: 13, userSelect: 'none', whiteSpace: 'nowrap' }}>
      {label} {sortKey === field ? (sortDir === 'asc' ? '▲' : '▼') : ''}
    </th>
  );
}

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { filtered: afterFilter, category, setCategory, minPrice, setMinPrice, maxPrice, setMaxPrice, stockFilter, setStockFilter, resetFilters } = useProductFilters(products);
  const { query, setQuery, filtered: afterSearch } = useSearch(afterFilter, ['name', 'category', 'description']);
  const { sorted, sortKey, sortDir, toggleSort } = useSort(afterSearch);
  const { paginated, page, setPage, totalPages } = usePagination(sorted, PAGE_SIZE);

  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setShowForm(true); };
  const openEdit = (p) => { setForm({ name: p.name, category: p.category, price: p.price, stock: p.stock, description: p.description }); setEditId(p.id); setShowForm(true); };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) };
    if (editId) updateProduct(editId, data); else addProduct(data);
    setShowForm(false);
  };

  const confirmDelete = () => {
    deleteProduct(deleteTarget.id);
    setDeleteTarget(null);
  };

  const inputStyle = { width: '100%', padding: '9px 12px', background: '#222', border: '1px solid #333', borderRadius: 6, color: '#fff', fontSize: 14, boxSizing: 'border-box' };
  const labelStyle = { fontSize: 13, color: '#aaa', display: 'block', marginBottom: 5 };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <h1 style={{ fontSize: 24 }}>Products</h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => exportToCSV(products, 'products.csv')} style={{ padding: '9px 16px', background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, color: '#ccc', cursor: 'pointer', fontSize: 13 }}>📥 Export CSV</button>
          <button onClick={openAdd} style={{ padding: '9px 16px', background: '#e50914', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 'bold' }}>+ Add Product</button>
        </div>
      </div>

      {/* FILTERS */}
      <div style={{ background: '#1a1a1a', borderRadius: 10, padding: '16px 20px', marginBottom: 20, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div>
          <label style={labelStyle}>Search</label>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products..." style={{ ...inputStyle, width: 200 }} />
        </div>
        <div>
          <label style={labelStyle}>Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)} style={{ ...inputStyle, width: 140 }}>
            <option value="all">All</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Min Price</label>
          <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="0" style={{ ...inputStyle, width: 90 }} />
        </div>
        <div>
          <label style={labelStyle}>Max Price</label>
          <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="∞" style={{ ...inputStyle, width: 90 }} />
        </div>
        <div>
          <label style={labelStyle}>Stock</label>
          <select value={stockFilter} onChange={e => setStockFilter(e.target.value)} style={{ ...inputStyle, width: 130 }}>
            <option value="all">All</option>
            <option value="in">In Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>
        <button onClick={resetFilters} style={{ padding: '9px 14px', background: 'transparent', border: '1px solid #444', borderRadius: 6, color: '#aaa', cursor: 'pointer', fontSize: 13 }}>Reset</button>
      </div>

      {/* TABLE */}
      <div style={{ background: '#1a1a1a', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ borderBottom: '1px solid #2a2a2a' }}>
            <tr>
              <th style={{ padding: '10px 12px', textAlign: 'left', color: '#888', fontSize: 13 }}>ID</th>
              <SortHeader label="Name" field="name" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
              <SortHeader label="Category" field="category" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
              <SortHeader label="Price" field="price" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
              <SortHeader label="Stock" field="stock" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
              <th style={{ padding: '10px 12px', textAlign: 'left', color: '#888', fontSize: 13 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: '12px', color: '#666', fontSize: 13 }}>#{p.id}</td>
                <td style={{ padding: '12px', fontSize: 14 }}>{p.name}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ background: '#2a2a2a', padding: '3px 10px', borderRadius: 20, fontSize: 12, color: '#aaa' }}>{p.category}</span>
                </td>
                <td style={{ padding: '12px', color: '#e50914', fontWeight: 'bold' }}>${p.price.toFixed(2)}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ color: p.stock > 0 ? '#22c55e' : '#ef4444', fontSize: 13 }}>
                    {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                  </span>
                </td>
                <td style={{ padding: '12px', display: 'flex', gap: 8 }}>
                  <button onClick={() => openEdit(p)} style={{ padding: '5px 12px', background: '#2563eb', border: 'none', borderRadius: 6, color: '#fff', cursor: 'pointer', fontSize: 12 }}>Edit</button>
                  <button onClick={() => setDeleteTarget(p)} style={{ padding: '5px 12px', background: '#7f1d1d', border: 'none', borderRadius: 6, color: '#fff', cursor: 'pointer', fontSize: 12 }}>Delete</button>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#555' }}>No products found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 16 }}>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '6px 14px', background: '#1a1a1a', border: '1px solid #333', borderRadius: 6, color: page === 1 ? '#555' : '#fff', cursor: page === 1 ? 'default' : 'pointer' }}>◀</button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => setPage(i + 1)} style={{ padding: '6px 12px', background: page === i + 1 ? '#e50914' : '#1a1a1a', border: '1px solid #333', borderRadius: 6, color: '#fff', cursor: 'pointer' }}>{i + 1}</button>
        ))}
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: '6px 14px', background: '#1a1a1a', border: '1px solid #333', borderRadius: 6, color: page === totalPages ? '#555' : '#fff', cursor: page === totalPages ? 'default' : 'pointer' }}>▶</button>
      </div>

      {/* ADD/EDIT MODAL */}
      {showForm && (
        <Modal title={editId ? 'Edit Product' : 'Add Product'} onClose={() => setShowForm(false)}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[['name', 'Name', 'text'], ['price', 'Price ($)', 'number'], ['stock', 'Stock', 'number']].map(([field, label, type]) => (
              <div key={field}>
                <label style={labelStyle}>{label}</label>
                <input type={type} value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} required style={inputStyle} step={field === 'price' ? '0.01' : '1'} min="0" />
              </div>
            ))}
            <div>
              <label style={labelStyle}>Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={inputStyle}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ ...inputStyle, resize: 'vertical', minHeight: 70 }} />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: '9px 20px', background: 'transparent', border: '1px solid #444', borderRadius: 8, color: '#aaa', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" style={{ padding: '9px 20px', background: '#e50914', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
                {editId ? 'Save Changes' : 'Add Product'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* DELETE CONFIRM MODAL */}
      {deleteTarget && (
        <Modal title="Confirm Deletion" onClose={() => setDeleteTarget(null)} width={380}>
          <p style={{ color: '#ccc', marginBottom: 20 }}>Delete <strong style={{ color: '#fff' }}>{deleteTarget.name}</strong>? This cannot be undone.</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={() => setDeleteTarget(null)} style={{ padding: '9px 20px', background: 'transparent', border: '1px solid #444', borderRadius: 8, color: '#aaa', cursor: 'pointer' }}>Cancel</button>
            <button onClick={confirmDelete} style={{ padding: '9px 20px', background: '#e50914', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}