import { useCallback, useEffect, useState } from 'react';
import { apiRequest } from '../lib/api';
import { ProductsContext } from './products-context';

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const result = await apiRequest('/products');
        if (!Array.isArray(result.products)) {
          throw new Error('The API response did not contain a product list.');
        }
        if (active) setProducts(result.products);
      } catch (requestError) {
        if (active) setError(requestError.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProducts();
    return () => {
      active = false;
    };
  }, [refreshKey]);

  const refreshProducts = useCallback(() => setRefreshKey((key) => key + 1), []);

  return (
    <ProductsContext.Provider value={{ products, loading, error, refreshProducts }}>
      {children}
    </ProductsContext.Provider>
  );
}
