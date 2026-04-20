import { useApp } from '../context/AppContext';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#e50914', '#ff6b35', '#f7c948', '#22c55e', '#3b82f6', '#a855f7'];

export default function Dashboard() {
  const { products, employees } = useApp();

  const totalRevenue = products.reduce((s, p) => s + p.price * p.stock, 0);
  const inStock = products.filter(p => p.stock > 0).length;
  const activeEmp = employees.filter(e => e.status === 'Active').length;

  // Products by category
  const catMap = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});
  const catData = Object.entries(catMap).map(([name, value]) => ({ name, value }));

  // Employees by department
  const deptMap = employees.reduce((acc, e) => {
    acc[e.department] = (acc[e.department] || 0) + 1;
    return acc;
  }, {});
  const deptData = Object.entries(deptMap).map(([name, count]) => ({ name, count }));

  const cards = [
    { label: 'Total Products', value: products.length, color: '#e50914' },
    { label: 'In Stock', value: inStock, color: '#22c55e' },
    { label: 'Employees', value: employees.length, color: '#3b82f6' },
    { label: 'Active Staff', value: activeEmp, color: '#f7c948' },
    { label: 'Est. Inventory Value', value: `$${totalRevenue.toFixed(0)}`, color: '#a855f7' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 26, marginBottom: 24 }}>Dashboard</h1>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 36 }}>
        {cards.map(c => (
          <div key={c.label} style={{ background: '#1a1a1a', borderRadius: 12, padding: '20px 16px', borderLeft: `3px solid ${c.color}` }}>
            <p style={{ fontSize: 12, color: '#888', margin: '0 0 6px' }}>{c.label}</p>
            <p style={{ fontSize: 26, fontWeight: 'bold', margin: 0, color: c.color }}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
        {/* Bar Chart - Employees by Dept */}
        <div style={{ background: '#1a1a1a', borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontSize: 15, marginBottom: 16, color: '#ccc' }}>Employees by Department</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={deptData}>
              <XAxis dataKey="name" tick={{ fill: '#888', fontSize: 12 }} />
              <YAxis tick={{ fill: '#888', fontSize: 12 }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: '#222', border: '1px solid #333', color: '#fff' }} />
              <Bar dataKey="count" fill="#e50914" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Products by Category */}
        <div style={{ background: '#1a1a1a', borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontSize: 15, marginBottom: 16, color: '#ccc' }}>Products by Category</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={catData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {catData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#222', border: '1px solid #333', color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}