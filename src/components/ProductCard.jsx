import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart-context';
import { useAuth } from '../context/auth-context';
import { formatUsd, getProductImageUrl } from '../lib/api';
import { Star, ShoppingBag, Eye } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!product) return null;

  const price = Number(product.price || 0);
  const comparePrice = Number(product.compare_price || 0);
  const hasComparePrice = comparePrice > 0 && comparePrice > price;
  const discount = hasComparePrice
    ? Math.round(((comparePrice - price) / comparePrice) * 100)
    : 0;
  const stockCount = Number(product.stock || 0);
  const inStock = stockCount > 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent('/cart')}`);
      return;
    }
    addToCart(product, 1);
  };

  const renderStars = (rating = 0) => {
    const safeRating = Number(rating) || 0;
    return (
      <div className="stars-wrapper" aria-label={`Rated ${safeRating} out of 5 stars`}>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={i < Math.round(safeRating) ? 'star-icon filled' : 'star-icon empty'}
          />
        ))}
      </div>
    );
  };

  return (
    <article className="product-card-container">
      <div className="product-card">
        {/* Card Header & Image */}
        <Link
          to={`/products/details/${product.id}`}
          className="product-image-wrap"
          aria-label={`View details for ${product.name}`}
        >
          <img
            src={getProductImageUrl(product.image, 'card')}
            alt=""
            className="product-card-image"
            loading="lazy"
            decoding="async"
          />
          <div className="product-card-badges">
            {Number(product.featured) === 1 && <span className="badge badge-featured">Featured</span>}
            {discount > 0 && <span className="badge badge-discount">-{discount}%</span>}
            {!inStock && <span className="badge badge-outofstock">Sold Out</span>}
            {inStock && stockCount <= 5 && (
              <span className="badge badge-lowstock">Only {stockCount} left</span>
            )}
          </div>

          <span className="quick-view-overlay-btn" aria-hidden="true">
            <Eye size={16} /> Quick View
          </span>
        </Link>

        {/* Product Info */}
        <div className="product-card-body">
          <div className="product-meta-tags">
            {product.category && <span className="tag-category">{product.category}</span>}
            {product.subcategory && <span className="tag-subcategory">{product.subcategory}</span>}
          </div>

          <h3 className="product-card-title">
            <Link to={`/products/details/${product.id}`}>{product.name}</Link>
          </h3>

          <div className="product-card-rating">
            {product.rating != null && (
              <>
                {renderStars(product.rating)}
                <span className="rating-num">{Number(product.rating).toFixed(1)}</span>
                {product.review_count != null && <span className="review-num">({product.review_count})</span>}
              </>
            )}
          </div>

          <div className="product-card-price-row">
            <span className="price-current">{formatUsd(price)}</span>
            {hasComparePrice && (
              <span className="price-compare">{formatUsd(comparePrice)}</span>
            )}
          </div>

          {/* Action buttons */}
          <div className="product-card-actions">
            <button
              type="button"
              className="btn-add-cart"
              onClick={handleAddToCart}
              disabled={!inStock}
            >
              <ShoppingBag size={16} />
              <span>{inStock ? 'Add to Cart' : 'Sold Out'}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
