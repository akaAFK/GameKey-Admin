import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Employees from './pages/Employees';
import ActivityLog from './pages/ActivityLog';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="employees" element={<Employees />} />
            <Route path="activity" element={<ActivityLog />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}