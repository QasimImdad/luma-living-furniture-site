import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart-context';
import { useAuth } from '../context/auth-context';
import { useProducts } from '../context/products-context';
import { apiRequest, formatUsd, getProductImageUrl } from '../lib/api';
import ProductCard from '../components/ProductCard';
import {
  Star,
  ShoppingBag,
  Plus,
  Minus,
  CheckCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
  ChevronRight,
} from 'lucide-react';

export const ProductDetailsPage = () => {
  const { id } = useParams();
  return <ProductDetailsContent key={id} id={id} />;
};

const ProductDetailsContent = ({ id }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { products } = useProducts();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'shipping' | 'care'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    apiRequest(`/products/${encodeURIComponent(id)}`)
      .then((result) => {
        if (!result.product) throw new Error('The API response did not contain product details.');
        if (active) {
          setProduct(result.product);
          setSelectedImage(result.product.image);
          setQuantity(1);
          window.scrollTo(0, 0);
        }
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return <div className="product-not-found-page"><div className="container"><p role="status">Loading product details…</p></div></div>;
  }

  if (error || !product) {
    return (
      <div className="product-not-found-page">
        <div className="container">
          <h2>{error ? 'Unable to load product' : 'Product Not Found'}</h2>
          <p>{error || 'The furniture piece you are searching for might have been moved or updated.'}</p>
          <Link to="/shop" className="btn-back-shop">
            Back to Furniture Collections
          </Link>
        </div>
      </div>
    );
  }

  const price = Number(product.price || 0);
  const comparePrice = Number(product.compare_price || 0);
  const hasComparePrice = comparePrice > 0 && comparePrice > price;
  const discount = hasComparePrice
    ? Math.round(((comparePrice - price) / comparePrice) * 100)
    : 0;
  const stockCount = Number(product.stock || 0);
  const inStock = stockCount > 0;

  const imagesList = [
    product.image,
    ...(Array.isArray(product.additionalImages) ? product.additionalImages : []),
  ].filter(Boolean);

  const relatedProducts = products.filter(
    (item) => item.category === product.category && String(item.id) !== String(product.id)
  ).slice(0, 4);

  const productDetailContent = (() => {
    const lowerName = String(product.name || '').toLowerCase();
    const type = lowerName.includes('sofa') ? 'sofa'
      : lowerName.includes('bed') ? 'bed'
      : lowerName.includes('table') ? 'table'
      : lowerName.includes('chair') ? 'chair'
      : 'furniture';

    const materialMap = {
      sofa: ['Solid walnut frame', 'Italian leather upholstery', 'Brushed brass detail'],
      bed: ['Solid oak frame', 'Linen headboard', 'Premium timber slats'],
      table: ['Solid maple top', 'Solid ash legs', 'Hand-finished edges'],
      chair: ['Solid ash frame', 'Bouclé upholstery', 'Cane accent detailing'],
      furniture: ['Solid hardwood build', 'Premium upholstery', 'Fine detailing'],
    };

    const qualityMap = {
      sofa: ['Deep, supportive seating', 'Precision joinery', 'Built for everyday longevity'],
      bed: ['Sturdy support structure', 'Comfort-led design', 'Made to last for years'],
      table: ['Stable, balanced base', 'Durable finish', 'Crafted for everyday use'],
      chair: ['Ergonomic support', 'Hand-finished detailing', 'Comfort-first silhouette'],
      furniture: ['Refined craftsmanship', 'Durable materials', 'Modern comfort focus'],
    };

    const description = product.description || `The ${product.name} is designed to bring a refined sense of comfort and character into your everyday living space. Thoughtful materials and considered proportions create a calm, elevated experience for modern interiors.`;

    return {
      description,
      materials: [...new Set([product.material, ...materialMap[type], product.color].filter(Boolean))],
      quality: qualityMap[type],
    };
  })();

  const renderStars = (rating = 0) => {
    const safeRating = Number(rating) || 0;
    return (
      <div className="stars-wrapper" aria-label={`Rated ${safeRating} out of 5 stars`}>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < Math.round(safeRating) ? 'star-icon filled' : 'star-icon empty'}
          />
        ))}
      </div>
    );
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent('/cart')}`);
      return;
    }
    addToCart(product, quantity);
  };

  return (
    <div className="pdetails-page">
      {/* Breadcrumbs */}
      <div className="breadcrumb-bar">
        <div className="pdetails-container">
          <nav className="breadcrumb-nav" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={14} />
            <Link to="/shop">Shop</Link>
            <ChevronRight size={14} />
            <Link to={`/shop?category=${encodeURIComponent(product.category)}`}>
              {product.category}
            </Link>
            <ChevronRight size={14} />
            <span className="current-crumb">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Details Section */}
      <main className="pdetails-main">
        <div className="pdetails-container">
          <div className="pdetails-grid">
            {/* Left Image Gallery Column */}
            <div className="pdetails-gallery-col">
              <div className="main-image-viewport">
                <img src={getProductImageUrl(selectedImage || product.image, 'detail')} alt={product.name} className="main-pimg" />

                <div className="gallery-badges">
                  {Number(product.featured) === 1 && <span className="badge badge-featured">Featured</span>}
                  {discount > 0 && <span className="badge badge-discount">-{discount}%</span>}
                  {!inStock && <span className="badge badge-outofstock">Sold Out</span>}
                </div>
              </div>

              {/* Thumbnail selector */}
              {imagesList.length > 1 && (
                <div className="thumbnails-row">
                  {imagesList.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`thumb-btn ${selectedImage === imgUrl ? 'active' : ''}`}
                      onClick={() => setSelectedImage(imgUrl)}
                    >
                      <img
                        src={getProductImageUrl(imgUrl, 'card')}
                        alt={`${product.name} view ${idx + 1}`}
                        loading="lazy"
                        decoding="async"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Product Info Column */}
            <div className="pdetails-info-col">
              <div className="category-meta-tags">
                <span className="meta-tag category">{product.category}</span>
                {product.subcategory && (
                  <span className="meta-tag subcategory">{product.subcategory}</span>
                )}
              </div>

              <h1 className="pdetails-title">{product.name}</h1>

              <div className="pdetails-rating-row">
                {renderStars(product.rating)}
                {product.rating != null && <span className="rating-score">{Number(product.rating).toFixed(1)}</span>}
                {product.review_count != null && <span className="review-count">({product.review_count} customer reviews)</span>}
              </div>

              <div className="pdetails-price-row">
                <span className="pdetails-price-current">{formatUsd(price)}</span>
                {hasComparePrice && (
                  <span className="pdetails-price-compare">{formatUsd(comparePrice)}</span>
                )}
                {discount > 0 && <span className="save-pill">Save {discount}%</span>}
              </div>

              <p className="pdetails-short-desc">{product.description}</p>

              {/* Stock Status Indicator */}
              <div className="stock-indicator-box">
                {inStock ? (
                  <span className="stock-in">
                    <CheckCircle size={16} /> In Stock ({stockCount} units available)
                  </span>
                ) : (
                  <span className="stock-out">Out of Stock</span>
                )}
              </div>

              {/* Quantity Picker & Add to Cart */}
              <div className="add-to-cart-box">
                <div className="quantity-selector">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || !inStock}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="qty-value">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(stockCount, q + 1))}
                    disabled={quantity >= stockCount || !inStock}
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  type="button"
                  className="btn-pdetails-addcart"
                  onClick={handleAddToCart}
                  disabled={!inStock}
                >
                  <ShoppingBag size={18} />
                  <span>{inStock ? `Add To Cart • ${formatUsd(price * quantity)}` : 'Sold Out'}</span>
                </button>
              </div>

              {/* Guarantees List */}
              <div className="guarantees-grid">
                <div className="guarantee-item">
                  <Truck size={20} className="g-icon" />
                  <div>
                    <h5>White-Glove Delivery</h5>
                    <p>Free in-home placement & setup</p>
                  </div>
                </div>
                <div className="guarantee-item">
                  <ShieldCheck size={20} className="g-icon" />
                  <div>
                    <h5>10-Year Warranty</h5>
                    <p>Guaranteed timber craftsmanship</p>
                  </div>
                </div>
                <div className="guarantee-item">
                  <RotateCcw size={20} className="g-icon" />
                  <div>
                    <h5>30-Day Home Trial</h5>
                    <p>Easy returns & full refunds</p>
                  </div>
                </div>
              </div>

              <div className="expanded-details-content">
                {[
                  ['Material', product.material],
                  ['Color / Finish', product.color],
                  ['Dimensions', product.dimensions],
                ].filter(([, value]) => value).map(([label, value]) => (
                  <div className="spec-item-row" key={label}>
                    <span className="spec-label">{label}</span>
                    <span className="spec-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Specifications & Info Tabs */}
      <section className="specifications-section">
        <div className="pdetails-container">
          <div className="tabs-header-bar">
            <button
              type="button"
              className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
              onClick={() => setActiveTab('specs')}
            >
              Specifications & Material
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'shipping' ? 'active' : ''}`}
              onClick={() => setActiveTab('shipping')}
            >
              White-Glove Shipping
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'care' ? 'active' : ''}`}
              onClick={() => setActiveTab('care')}
            >
              Care & Maintenance
            </button>
          </div>

          <div className="tab-content-panel">
            {activeTab === 'specs' && (
              <div className="specs-tab-body">
                <div className="specs-intro">
                  <h3>Crafted For Living</h3>
                  <p>{productDetailContent.description}</p>
                </div>

                <div className="specs-grid-boxes">
                  <div className="spec-box-card spec-box-wide">
                    <h4>Description</h4>
                    <p>{productDetailContent.description}</p>
                  </div>

                  <div className="spec-box-card">
                    <h4>Materials</h4>
                    <ul className="spec-card-list">
                      {productDetailContent.materials.map((value, index) => (
                        <li key={`${value}-${index}`}>{value}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="spec-box-card">
                    <h4>Quality</h4>
                    <ul className="spec-card-list">
                      {productDetailContent.quality.map((value, index) => (
                        <li key={`${value}-${index}`}>{value}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="spec-box-card spec-box-full">
                    <h4>Finish</h4>
                    <p>{product.color || 'Natural finish'}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="shipping-tab-body">
                <h3>White-Glove Delivery Experience</h3>
                <p>
                  Every order over $1,500 includes complimentary White-Glove service. Our logistics specialists deliver to your room of choice, handle complete unboxing and professional assembly, and dispose of all packaging materials.
                </p>
              </div>
            )}

            {activeTab === 'care' && (
              <div className="care-tab-body">
                <h3>Preserving Your Luxury Furniture</h3>
                <p>
                  To clean solid wood surfaces, wipe gently with a soft damp cloth followed by dry microfiber. Avoid harsh chemical cleaners. Upholstery fabrics are pre-treated with stain defense; spot clean with warm water and mild organic soap.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <section className="related-products-section">
          <div className="pdetails-container">
            <div className="section-header">
              <h2 className="section-title">You May Also Like</h2>
              <Link to="/shop" className="view-all-link">
                View All <ChevronRight size={16} />
              </Link>
            </div>

            <div className="products-grid-4col">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailsPage;
