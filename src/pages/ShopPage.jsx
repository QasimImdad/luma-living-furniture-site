import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../context/products-context';
import ProductCard from '../components/ProductCard';
import {
  getProductCollectionNames,
  getProductCollections,
  normalizeCollectionName,
} from '../lib/productCollections';
import { Search, SlidersHorizontal, RotateCcw, LayoutGrid } from 'lucide-react';

export const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading, error, refreshProducts } = useProducts();
  const selectedCollection = searchParams.get('collection') || searchParams.get('category');
  const selectedCategory = selectedCollection
    ? normalizeCollectionName(selectedCollection)
    : 'all';
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [visibleCount, setVisibleCount] = useState(16);
  const collections = useMemo(() => getProductCollections(products), [products]);
  const collectionNames = useMemo(
    () => new Map(products.map((product) => [
      String(product.id),
      getProductCollectionNames(product),
    ])),
    [products],
  );

  const handleCategorySelect = (catId) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('category');
    if (catId === 'all') {
      nextParams.delete('collection');
    } else {
      nextParams.set('collection', catId);
    }
    setSearchParams(nextParams);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category Filter
      if (
        selectedCategory !== 'all'
        && !collectionNames.get(String(product.id))?.includes(selectedCategory)
      ) {
        return false;
      }

      // Stock Filter
      if (onlyInStock && Number(product.stock) <= 0) {
        return false;
      }

      // Search Query Filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name?.toLowerCase().includes(q) || false;
        const matchesCat = (collectionNames.get(String(product.id)) || [])
          .some((collection) => collection.toLowerCase().includes(q));
        const matchesMat = product.material?.toLowerCase().includes(q) || false;
        const matchesDesc = product.description?.toLowerCase().includes(q) || false;
        if (!matchesName && !matchesCat && !matchesMat && !matchesDesc) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return Number(a.price) - Number(b.price);
      if (sortBy === 'price-high') return Number(b.price) - Number(a.price);
      if (sortBy === 'rating') return Number(b.rating || 0) - Number(a.rating || 0);
      // Default featured
      return Number(b.featured || 0) - Number(a.featured || 0);
    });
  }, [products, collectionNames, selectedCategory, searchQuery, sortBy, onlyInStock]);

  const resetFilters = () => {
    setSearchQuery('');
    setSortBy('featured');
    setOnlyInStock(false);
    setVisibleCount(16);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('category');
    nextParams.delete('collection');
    setSearchParams(nextParams);
  };

  return (
    <div className="shop-page">
      {/* Page Header */}
      <header className="shop-header">
        <div className="shop-header-container">
          <span className="shop-eyebrow">The Furniture Atelier</span>
          <h1 className="shop-title">
            {selectedCategory === 'all' ? 'Furniture Collections' : `${selectedCategory} Collection`}
          </h1>
          <p className="shop-subtitle">
            Explore our architecturally refined pieces crafted for modern residential and luxury office interiors.
          </p>
        </div>
      </header>

      {/* Main Shop Container */}
      <main className="shop-main-container">
        {/* Category Pills Navigation */}
        <nav className="category-pills-bar" aria-label="Furniture collections navigation">
          {[{ id: 'all', name: 'All Collections' }, ...collections.map(({ name }) => ({
            id: name,
            name,
          }))].map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`cat-pill ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => handleCategorySelect(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </nav>

        {/* Toolbar (Search, Filter, Sort) */}
        <div className="shop-toolbar">
          {/* Search Box */}
          <div className="search-box-wrap">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, material, or room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button type="button" className="clear-search-btn" onClick={() => setSearchQuery('')}>
                ×
              </button>
            )}
          </div>

          <div className="toolbar-controls">
            {/* Stock Filter Checkbox */}
            <label className="stock-filter-toggle">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
              />
              <span>In Stock Only</span>
            </label>

            {/* Sort Dropdown */}
            <div className="sort-dropdown-wrap">
              <SlidersHorizontal size={16} className="sort-icon" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select-input"
                aria-label="Sort products"
              >
                <option value="featured">Featured Items</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Customer Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Info & Reset */}
        {error && (
          <div className="api-state api-state-error" role="alert">
            <p>Products could not be loaded: {error}</p>
            <button type="button" onClick={refreshProducts}>Try again</button>
          </div>
        )}
        {loading && <p className="api-state" role="status">Loading furniture collections…</p>}

        {!loading && !error && <div className="results-info-bar">
          <span className="results-count">
            Showing <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'piece' : 'pieces'}
            {selectedCategory !== 'all' ? ` in ${selectedCategory}` : ''}
          </span>

          {(selectedCategory !== 'all' || searchQuery || onlyInStock || sortBy !== 'featured') && (
            <button type="button" className="btn-reset-filters" onClick={resetFilters}>
              <RotateCcw size={14} /> Reset Filters
            </button>
          )}
        </div>}

        {/* Product Grid */}
        {!loading && !error && filteredProducts.length > 0 ? (
          <>
            <div className="products-grid-4col">
              {filteredProducts.slice(0, visibleCount).map((product) => (
              <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {visibleCount < filteredProducts.length && (
              <button
                type="button"
                className="btn-reset-large shop-load-more"
                onClick={() => setVisibleCount((count) => count + 16)}
              >
                Load more products
              </button>
            )}
          </>
        ) : !loading && !error ? (
          <div className="empty-shop-state">
            <LayoutGrid size={48} className="empty-state-icon" />
            <h3>{products.length === 0 ? 'No products available' : 'No products found'}</h3>
            <p>{products.length === 0
              ? 'There are no products in the catalogue yet.'
              : "We couldn't find any furniture pieces matching your criteria."}</p>
            <button type="button" className="btn-reset-large" onClick={resetFilters}>
              View All Collections
            </button>
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default ShopPage;
