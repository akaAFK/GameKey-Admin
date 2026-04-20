import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext(null);

const INITIAL_PRODUCTS = [
  { id: 1, name: 'Cyberpunk 2077', category: 'RPG', price: 17.99, stock: 50, description: 'Futuristic RPG with open world and deep story.' },
  { id: 2, name: 'GTA V', category: 'Action', price: 14.99, stock: 120, description: 'Open-world action game with online mode.' },
  { id: 3, name: 'Elden Ring', category: 'RPG', price: 17.99, stock: 0, description: 'Dark fantasy RPG with challenging gameplay.' },
  { id: 4, name: 'Red Dead Redemption 2', category: 'Action', price: 29.99, stock: 30, description: 'Story-driven western adventure.' },
  { id: 5, name: 'ARC RAIDERS', category: 'Action', price: 21.99, stock: 75, description: 'Co-op sci-fi shooter with intense battles.' },
  { id: 6, name: 'Forza Horizon 5', category: 'Action', price: 19.99, stock: 60, description: 'Realistic racing with open maps.' },
  { id: 7, name: 'Starfield', category: 'RPG', price: 24.99, stock: 45, description: 'Next-gen space RPG with exploration and story.' },
  { id: 8, name: 'Resident Evil Village', category: 'Horror', price: 14.55, stock: 90, description: 'Survival horror with intense atmosphere.' },
];

const INITIAL_EMPLOYEES = [
  { id: 1, name: 'Alex Johnson', position: 'Frontend Developer', department: 'Engineering', email: 'alex@gamekeystore.com', status: 'Active' },
  { id: 2, name: 'Maria Garcia', position: 'Product Manager', department: 'Management', email: 'maria@gamekeystore.com', status: 'Active' },
  { id: 3, name: 'Ivan Petrov', position: 'Backend Developer', department: 'Engineering', email: 'ivan@gamekeystore.com', status: 'Active' },
  { id: 4, name: 'Sophie Lee', position: 'UI/UX Designer', department: 'Design', email: 'sophie@gamekeystore.com', status: 'Inactive' },
  { id: 5, name: 'Omar Hassan', position: 'Support Agent', department: 'Support', email: 'omar@gamekeystore.com', status: 'Active' },
];

export function AppProvider({ children }) {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('gks_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('gks_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [activityLog, setActivityLog] = useState(() => {
    const saved = localStorage.getItem('gks_activity');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState([]);

  useEffect(() => { localStorage.setItem('gks_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('gks_employees', JSON.stringify(employees)); }, [employees]);
  useEffect(() => { localStorage.setItem('gks_activity', JSON.stringify(activityLog)); }, [activityLog]);

  const addNotification = useCallback((message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 3500);
  }, []);

  const logActivity = useCallback((action) => {
    const entry = { id: Date.now(), action, timestamp: new Date().toISOString() };
    setActivityLog(prev => [entry, ...prev].slice(0, 100));
  }, []);

  // Products CRUD
  const addProduct = useCallback((product) => {
    const newProduct = { ...product, id: Date.now() };
    setProducts(prev => [...prev, newProduct]);
    addNotification(`Product "${product.name}" added successfully`);
    logActivity(`Added product: ${product.name}`);
  }, [addNotification, logActivity]);

  const updateProduct = useCallback((id, updated) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
    addNotification(`Product "${updated.name}" updated`);
    logActivity(`Updated product: ${updated.name}`);
  }, [addNotification, logActivity]);

  const deleteProduct = useCallback((id) => {
    const product = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    addNotification(`Product "${product?.name}" deleted`, 'danger');
    logActivity(`Deleted product: ${product?.name}`);
  }, [products, addNotification, logActivity]);

  // Employees CRUD
  const addEmployee = useCallback((emp) => {
    const newEmp = { ...emp, id: Date.now() };
    setEmployees(prev => [...prev, newEmp]);
    addNotification(`Employee "${emp.name}" added`);
    logActivity(`Added employee: ${emp.name}`);
  }, [addNotification, logActivity]);

  const updateEmployee = useCallback((id, updated) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...updated } : e));
    addNotification(`Employee "${updated.name}" updated`);
    logActivity(`Updated employee: ${updated.name}`);
  }, [addNotification, logActivity]);

  const deleteEmployee = useCallback((id) => {
    const emp = employees.find(e => e.id === id);
    setEmployees(prev => prev.filter(e => e.id !== id));
    addNotification(`Employee "${emp?.name}" deleted`, 'danger');
    logActivity(`Deleted employee: ${emp?.name}`);
  }, [employees, addNotification, logActivity]);

  return (
    <AppContext.Provider value={{
      products, addProduct, updateProduct, deleteProduct,
      employees, addEmployee, updateEmployee, deleteEmployee,
      activityLog, notifications, addNotification, logActivity,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);