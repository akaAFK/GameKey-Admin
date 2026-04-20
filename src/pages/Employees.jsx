import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useSearch, useSort, usePagination } from '../hooks/useFilters';
import Modal from '../components/Modal';

const EMPTY_FORM = { name: '', position: '', department: 'Engineering', email: '', status: 'Active' };
const DEPARTMENTS = ['Engineering', 'Design', 'Management', 'Support', 'Marketing'];
const PAGE_SIZE = 6;

export default function Employees() {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { query, setQuery, filtered: afterSearch } = useSearch(employees, ['name', 'position', 'department', 'email']);
  const { sorted, sortKey, sortDir, toggleSort } = useSort(afterSearch);
  const { paginated, page, setPage, totalPages } = usePagination(sorted, PAGE_SIZE);

  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setShowForm(true); };
  const openEdit = (e) => { setForm({ name: e.name, position: e.position, department: e.department, email: e.email, status: e.status }); setEditId(e.id); setShowForm(true); };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (editId) updateEmployee(editId, form); else addEmployee(form);
    setShowForm(false);
  };

  const inputStyle = { width: '100%', padding: '9px 12px', background: '#222', border: '1px solid #333', borderRadius: 6, color: '#fff', fontSize: 14, boxSizing: 'border-box' };
  const labelStyle = { fontSize: 13, color: '#aaa', display: 'block', marginBottom: 5 };

  const SortTh = ({ label, field }) => (
    <th onClick={() => toggleSort(field)} style={{ cursor: 'pointer', padding: '10px 12px', textAlign: 'left', color: '#888', fontSize: 13, userSelect: 'none' }}>
      {label} {sortKey === field ? (sortDir === 'asc' ? '▲' : '▼') : ''}
    </th>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <h1 style={{ fontSize: 24 }}>Employees</h1>
        <button onClick={openAdd} style={{ padding: '9px 16px', background: '#e50914', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 'bold' }}>+ Add Employee</button>
      </div>

      {/* SEARCH */}
      <div style={{ marginBottom: 20 }}>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name, position, department..." style={{ ...inputStyle, maxWidth: 340 }} />
      </div>

      {/* TABLE */}
      <div style={{ background: '#1a1a1a', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ borderBottom: '1px solid #2a2a2a' }}>
            <tr>
              <SortTh label="Name" field="name" />
              <SortTh label="Position" field="position" />
              <SortTh label="Department" field="department" />
              <th style={{ padding: '10px 12px', textAlign: 'left', color: '#888', fontSize: 13 }}>Email</th>
              <SortTh label="Status" field="status" />
              <th style={{ padding: '10px 12px', textAlign: 'left', color: '#888', fontSize: 13 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(e => (
              <tr key={e.id} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#e50914', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 'bold', flexShrink: 0 }}>
                    {e.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <span style={{ fontSize: 14 }}>{e.name}</span>
                </td>
                <td style={{ padding: '12px', fontSize: 13, color: '#ccc' }}>{e.position}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ background: '#2a2a2a', padding: '3px 10px', borderRadius: 20, fontSize: 12, color: '#aaa' }}>{e.department}</span>
                </td>
                <td style={{ padding: '12px', fontSize: 13, color: '#888' }}>{e.email}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ color: e.status === 'Active' ? '#22c55e' : '#ef4444', fontSize: 13 }}>● {e.status}</span>
                </td>
                <td style={{ padding: '12px', display: 'flex', gap: 8 }}>
                  <button onClick={() => openEdit(e)} style={{ padding: '5px 12px', background: '#2563eb', border: 'none', borderRadius: 6, color: '#fff', cursor: 'pointer', fontSize: 12 }}>Edit</button>
                  <button onClick={() => setDeleteTarget(e)} style={{ padding: '5px 12px', background: '#7f1d1d', border: 'none', borderRadius: 6, color: '#fff', cursor: 'pointer', fontSize: 12 }}>Delete</button>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#555' }}>No employees found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '6px 14px', background: '#1a1a1a', border: '1px solid #333', borderRadius: 6, color: page === 1 ? '#555' : '#fff', cursor: 'pointer' }}>◀</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} style={{ padding: '6px 12px', background: page === i + 1 ? '#e50914' : '#1a1a1a', border: '1px solid #333', borderRadius: 6, color: '#fff', cursor: 'pointer' }}>{i + 1}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: '6px 14px', background: '#1a1a1a', border: '1px solid #333', borderRadius: 6, color: page === totalPages ? '#555' : '#fff', cursor: 'pointer' }}>▶</button>
        </div>
      )}

      {/* ADD/EDIT MODAL */}
      {showForm && (
        <Modal title={editId ? 'Edit Employee' : 'Add Employee'} onClose={() => setShowForm(false)}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[['name', 'Full Name', 'text'], ['position', 'Position', 'text'], ['email', 'Email', 'email']].map(([field, label, type]) => (
              <div key={field}>
                <label style={labelStyle}>{label}</label>
                <input type={type} value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} required style={inputStyle} />
              </div>
            ))}
            <div>
              <label style={labelStyle}>Department</label>
              <select value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} style={inputStyle}>
                {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} style={inputStyle}>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: '9px 20px', background: 'transparent', border: '1px solid #444', borderRadius: 8, color: '#aaa', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" style={{ padding: '9px 20px', background: '#e50914', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
                {editId ? 'Save Changes' : 'Add Employee'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* DELETE CONFIRM */}
      {deleteTarget && (
        <Modal title="Confirm Deletion" onClose={() => setDeleteTarget(null)} width={380}>
          <p style={{ color: '#ccc', marginBottom: 20 }}>Delete <strong style={{ color: '#fff' }}>{deleteTarget.name}</strong>?</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={() => setDeleteTarget(null)} style={{ padding: '9px 20px', background: 'transparent', border: '1px solid #444', borderRadius: 8, color: '#aaa', cursor: 'pointer' }}>Cancel</button>
            <button onClick={() => { deleteEmployee(deleteTarget.id); setDeleteTarget(null); }} style={{ padding: '9px 20px', background: '#e50914', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}