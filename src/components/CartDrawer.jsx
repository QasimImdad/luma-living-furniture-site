import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart-context';
import { formatUsd, getProductImageUrl } from '../lib/api';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

export const CartDrawer = () => {
  const {
    cart,
    cartCount,
    loading,
    error,
    refreshCart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeFromCart,
    subtotal
  } = useCart();
  const navigate = useNavigate();

  if (!isCartDrawerOpen) return null;

  return (
    <div className="cart-drawer-overlay" onClick={() => setIsCartDrawerOpen(false)}>
      <div className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title-wrap">
            <ShoppingBag size={20} className="drawer-icon" />
            <h2>Your Shopping Cart</h2>
            <span className="drawer-item-count">
              ({cartCount})
            </span>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={() => setIsCartDrawerOpen(false)}
            aria-label="Close cart drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="drawer-body">
          {error ? (
            <div className="api-state api-state-error" role="alert">
              <p>Your cart could not be loaded: {error}</p>
              <button type="button" onClick={refreshCart} disabled={loading}>Try again</button>
            </div>
          ) : loading ? (
            <p className="api-state" role="status">Loading your cart…</p>
          ) : cart.length > 0 ? (
            <div className="drawer-cart-list">
              {cart.map((item) => (
                <div key={item.id} className="drawer-cart-item">
                  <img src={getProductImageUrl(item.image, 'card')} alt={item.name} className="drawer-item-img" />
                  <div className="drawer-item-info">
                    <div className="drawer-item-top">
                      <h4 className="drawer-item-title">{item.name}</h4>
                      <button
                        type="button"
                        className="drawer-item-remove"
                        onClick={() => removeFromCart(item.id)}
                        disabled={loading}
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="drawer-item-meta">
                      <span className="drawer-item-price">{formatUsd(item.price)}</span>
                    </div>

                    <div className="drawer-item-bottom">
                      <div className="qty-picker">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, Number(item.quantity) - 1)}
                          disabled={loading || Number(item.quantity) <= 1}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, Number(item.quantity) + 1)}
                          disabled={loading || Number(item.quantity) >= Number(item.stock)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <span className="drawer-item-total">
                        {formatUsd(Number(item.price) * Number(item.quantity))}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="drawer-empty-state">
              <ShoppingBag size={48} className="empty-icon" />
              <h3>Your cart is empty</h3>
              <p>Discover our curated luxury collections for your home.</p>
              <button
                type="button"
                className="btn-browse-furniture"
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  navigate('/shop');
                }}
              >
                Browse Furniture
              </button>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {!loading && !error && cart.length > 0 && (
          <div className="drawer-footer">
            <div className="drawer-summary-row">
              <span>Subtotal</span>
              <span className="drawer-subtotal-val">{formatUsd(subtotal)}</span>
            </div>
            <p className="shipping-note">Order totals are calculated from the items in your account cart.</p>

            <div className="drawer-action-btns">
              <button
                type="button"
                className="btn-view-full-cart"
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  navigate('/cart');
                }}
              >
                View Full Cart
              </button>

              <button
                type="button"
                className="btn-drawer-checkout"
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  navigate('/cart');
                }}
              >
                <span>Checkout</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
