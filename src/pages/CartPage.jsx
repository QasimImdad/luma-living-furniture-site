import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart-context';
import { formatUsd, getProductImageUrl } from '../lib/api';
import {
  BadgePercent,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';

export const CartPage = () => {
  const {
    cart,
    cartCount,
    loading,
    error,
    refreshCart,
    updateQuantity,
    removeFromCart,
    subtotal,
  } = useCart();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState('');
  const itemCount = cartCount;

  const handleApplyCoupon = (event) => {
    event.preventDefault();
    setCouponMessage(
      couponCode.trim()
        ? 'Coupon validation is not available yet. No discount was applied.'
        : 'Enter a coupon code to apply it.',
    );
  };

  return (
    <div className="cart-page">
      <div className="cart-page-container">
        <div className="cart-heading-bar">
          <div>
            <Link to="/shop" className="cart-back-link">
              <ArrowLeft size={16} /> Continue Shopping
            </Link>
            <h1 className="cart-main-title">Shopping Cart</h1>
          </div>
          <span className="cart-total-badge">
            {cartCount} Items
          </span>
        </div>

        {error && (
          <div className="api-state api-state-error" role="alert">
            <p>Your cart could not be updated: {error}</p>
            <button type="button" onClick={refreshCart} disabled={loading}>Try again</button>
          </div>
        )}

        {loading ? (
          <p className="api-state" role="status">Loading your cart…</p>
        ) : error ? (
          <p className="api-state api-state-error">Cart contents are unavailable until the request succeeds.</p>
        ) : cart.length > 0 ? (
          <div className="cart-layout-grid">
            <div className="cart-items-column">
              <div className="cart-table-header">
                <span>Product Details</span>
                <span>Quantity</span>
                <span>Subtotal</span>
              </div>

              <div className="cart-items-list">
                {cart.map((item) => {
                  const itemPrice = Number(item.price || 0);
                  const itemSubtotal = itemPrice * Number(item.quantity || 0);

                  return (
                    <article key={item.id} className="cart-item-card">
                      <div className="cart-item-product-info">
                        <Link to={`/products/details/${item.product_id}`} className="cart-item-img-wrap">
                          <img
                            src={getProductImageUrl(item.image)}
                            alt={item.name}
                            className="cart-item-img"
                          />
                        </Link>
                        <div className="cart-item-details">
                          <h3 className="cart-item-name">
                            <Link to={`/products/details/${item.product_id}`}>{item.name}</Link>
                          </h3>
                          <span className="cart-item-unit-price">{formatUsd(itemPrice)} each</span>
                          <button
                            type="button"
                            className="btn-remove-item"
                            onClick={() => removeFromCart(item.id)}
                            disabled={loading}
                            title="Remove item"
                          >
                            <Trash2 size={14} /> Remove Item
                          </button>
                        </div>
                      </div>

                      <div className="cart-item-qty-col">
                        <div className="qty-picker">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, Number(item.quantity) - 1)}
                            disabled={loading || Number(item.quantity) <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="qty-num">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, Number(item.quantity) + 1)}
                            disabled={loading || Number(item.quantity) >= Number(item.stock)}
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="cart-item-total-col">
                        <span className="cart-item-row-total">{formatUsd(itemSubtotal)}</span>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="cart-bottom-actions">
                <Link to="/shop" className="btn-continue-browsing">Browse More Furniture</Link>
              </div>
            </div>

            <aside className="order-summary-column">
              <div className="order-summary-card">
                <h2 className="summary-title">Order Summary</h2>
                <p className="summary-intro">
                  A few final details before you place your order.
                </p>
                <div className="summary-rows-group">
                  <div className="summary-row">
                    <span>Subtotal <span className="summary-item-count">({itemCount} items)</span></span>
                    <span className="summary-val">{formatUsd(subtotal)}</span>
                  </div>
                  <hr className="summary-divider" />
                  <div className="summary-row total">
                    <span>Order total</span>
                    <strong className="summary-grand-total">{formatUsd(subtotal)}</strong>
                  </div>
                </div>
                <form className="promo-box" onSubmit={handleApplyCoupon}>
                  <label className="promo-label" htmlFor="cart-coupon-code">
                    <BadgePercent size={17} />
                    Have a coupon code?
                  </label>
                  <div className="promo-form">
                    <input
                      id="cart-coupon-code"
                      className="promo-input"
                      type="text"
                      value={couponCode}
                      onChange={(event) => {
                        setCouponCode(event.target.value);
                        setCouponMessage('');
                      }}
                      placeholder="Enter code"
                      autoComplete="off"
                    />
                    <button type="submit" className="btn-apply-promo">
                      Apply
                    </button>
                  </div>
                  {couponMessage && (
                    <p className="promo-msg" role="status">{couponMessage}</p>
                  )}
                </form>
                <button
                  type="button"
                  className="btn-proceed-checkout"
                  onClick={() => navigate('/checkout')}
                  disabled={loading}
                >
                  <span>Checkout</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </aside>
          </div>
        ) : (
          <div className="empty-cart-view">
            <div className="empty-cart-card">
              <ShoppingBag size={56} className="empty-cart-icon" />
              <h2>Your Cart is Currently Empty</h2>
              <p>There are no items in your account cart.</p>
              <Link to="/shop" className="btn-shop-now-empty">
                <span>Browse Furniture Collections</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default CartPage;
