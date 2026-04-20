import { useState, useMemo } from 'react';

export function useSearch(items, fields) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(item =>
      fields.some(f => String(item[f] ?? '').toLowerCase().includes(q))
    );
  }, [items, query, fields]);
  return { query, setQuery, filtered };
}

export function useSort(items) {
  const [sortKey, setSortKey] = useState('');
  const [sortDir, setSortDir] = useState('asc');

  const sorted = useMemo(() => {
    if (!sortKey) return items;
    return [...items].sort((a, b) => {
      const va = a[sortKey], vb = b[sortKey];
      if (typeof va === 'number') return sortDir === 'asc' ? va - vb : vb - va;
      return sortDir === 'asc'
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va));
    });
  }, [items, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  return { sorted, sortKey, sortDir, toggleSort };
}

export function usePagination(items, pageSize = 5) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = items.slice((safePage - 1) * pageSize, safePage * pageSize);
  return { paginated, page: safePage, setPage, totalPages };
}

export function useProductFilters(products) {
  const [category, setCategory] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [stockFilter, setStockFilter] = useState('all');

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (category !== 'all' && p.category !== category) return false;
      if (minPrice !== '' && p.price < parseFloat(minPrice)) return false;
      if (maxPrice !== '' && p.price > parseFloat(maxPrice)) return false;
      if (stockFilter === 'in' && p.stock === 0) return false;
      if (stockFilter === 'out' && p.stock > 0) return false;
      return true;
    });
  }, [products, category, minPrice, maxPrice, stockFilter]);

  const resetFilters = () => {
    setCategory('all'); setMinPrice(''); setMaxPrice(''); setStockFilter('all');
  };

  return { filtered, category, setCategory, minPrice, setMinPrice, maxPrice, setMaxPrice, stockFilter, setStockFilter, resetFilters };
}