import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth-context';
import { useCart } from '../context/cart-context';
import { apiRequest, formatUsd, getProductImageUrl } from '../lib/api';
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  CheckCircle,
  CreditCard,
  Landmark,
  LockKeyhole,
  MapPin,
  PackageCheck,
  ShieldCheck,
  WalletCards,
} from 'lucide-react';

const paymentMethods = [
  {
    id: 'bank_transfer',
    label: 'Bank account',
    description: 'Pay by bank transfer',
    Icon: Landmark,
  },
  {
    id: 'paypal',
    label: 'PayPal',
    description: 'Continue with PayPal',
    Icon: WalletCards,
  },
  {
    id: 'cod',
    label: 'Cash on delivery',
    description: 'Pay when your order arrives',
    Icon: Banknote,
  },
];

const emptyContact = {
  name: '',
  email: '',
  phone: '',
  address: '',
};

export default function CheckoutPage() {
  const { token } = useAuth();
  const { cart, cartCount, loading, error: cartError, refreshCart, subtotal } = useCart();
  const navigate = useNavigate();
  const [contact, setContact] = useState(emptyContact);
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const updateContact = (event) => {
    setContact((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const result = await apiRequest('/orders', {
        method: 'POST',
        token,
        body: {
          name: contact.name.trim(),
          email: contact.email.trim(),
          phone: contact.phone.trim(),
          shipping_address: contact.address.trim(),
          payment_method: paymentMethod,
        },
      });

      if (!result.order?.id) {
        throw new Error('The API response did not contain an order ID.');
      }

      const cartRefreshed = await refreshCart();
      navigate(`/orders/${encodeURIComponent(result.order.id)}`, {
        replace: true,
        state: {
          paymentMethod,
          cartRefreshFailed: !cartRefreshed,
        },
      });
    } catch (requestError) {
      setError(requestError.message);
      setSubmitting(false);
    }
  };

  if (loading) {
    return <main className="checkout-page"><p className="api-state" role="status">Loading your cart…</p></main>;
  }

  if (cartError) {
    return (
      <main className="checkout-page">
        <div className="checkout-error-card" role="alert">
          <h1>We couldn’t load your cart</h1>
          <p>{cartError}</p>
          <button type="button" className="btn-apply-promo" onClick={refreshCart}>Try again</button>
        </div>
      </main>
    );
  }

  if (!cart.length) {
    return (
      <main className="checkout-page">
        <div className="checkout-error-card">
          <PackageCheck size={34} />
          <h1>Your cart is empty</h1>
          <p>Add something you love before continuing to checkout.</p>
          <Link to="/shop" className="checkout-back-link">Continue shopping</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-topbar">
          <Link to="/cart" className="checkout-back-link">
            <ArrowLeft size={16} /> Back to cart
          </Link>
          <div className="checkout-trust-label">
            <LockKeyhole size={15} /> Secure checkout
          </div>
        </div>

        <header className="checkout-header">
          <span className="checkout-eyebrow">Luma Living checkout</span>
          <h1>Almost yours.</h1>
          <p>Enter your delivery details and choose how you’d like to pay.</p>
        </header>

        <div className="checkout-progress" aria-label="Checkout steps">
          <div className="checkout-progress-step complete">
            <span><CheckCircle size={17} /></span>
            <div><strong>Cart</strong><small>Items confirmed</small></div>
          </div>
          <div className="checkout-progress-line" />
          <div className="checkout-progress-step current" aria-current="step">
            <span>2</span>
            <div><strong>Delivery & payment</strong><small>Almost there</small></div>
          </div>
          <div className="checkout-progress-line" />
          <div className="checkout-progress-step">
            <span>3</span>
            <div><strong>Confirmation</strong><small>Order placed</small></div>
          </div>
        </div>

        <form className="checkout-layout" onSubmit={handleSubmit}>
          <div className="checkout-form-column">
            <section className="checkout-section-card">
              <div className="checkout-section-heading">
                <span className="checkout-section-icon"><MapPin size={19} /></span>
                <div>
                  <h2>Contact information</h2>
                  <p>So we can keep you updated about your delivery.</p>
                </div>
              </div>
              <div className="checkout-fields-grid">
                <label className="checkout-field checkout-field-full" htmlFor="checkout-name">
                  <span>Full name</span>
                  <input
                    id="checkout-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={contact.name}
                    onChange={updateContact}
                    placeholder="Alex Morgan"
                    required
                  />
                </label>
                <label className="checkout-field" htmlFor="checkout-email">
                  <span>Email address</span>
                  <input
                    id="checkout-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={contact.email}
                    onChange={updateContact}
                    placeholder="alex@example.com"
                    required
                  />
                </label>
                <label className="checkout-field" htmlFor="checkout-phone">
                  <span>Phone number</span>
                  <input
                    id="checkout-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={contact.phone}
                    onChange={updateContact}
                    placeholder="+1 (555) 000-0000"
                    required
                  />
                </label>
                <label className="checkout-field checkout-field-full" htmlFor="checkout-address">
                  <span>Delivery address</span>
                  <textarea
                    id="checkout-address"
                    name="address"
                    autoComplete="street-address"
                    value={contact.address}
                    onChange={updateContact}
                    placeholder="Street address, apartment, city, state and ZIP code"
                    rows={3}
                    required
                  />
                </label>
              </div>
            </section>

            <section className="checkout-section-card">
              <div className="checkout-section-heading">
                <span className="checkout-section-icon"><CreditCard size={19} /></span>
                <div>
                  <h2>Payment method</h2>
                  <p>Choose your preferred way to pay.</p>
                </div>
              </div>
              <fieldset className="checkout-payment-options">
                <legend className="checkout-visually-hidden">Choose a payment method</legend>
                {paymentMethods.map(({ id, label, description, Icon }) => (
                  <label
                    key={id}
                    className={`checkout-payment-option${paymentMethod === id ? ' selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value={id}
                      checked={paymentMethod === id}
                      onChange={() => setPaymentMethod(id)}
                      disabled={submitting}
                    />
                    <Icon size={21} aria-hidden="true" />
                    <span className="checkout-payment-copy">
                      <strong>{label}</strong>
                      <small>{description}</small>
                    </span>
                    <span className="checkout-radio-indicator" aria-hidden="true" />
                  </label>
                ))}
              </fieldset>
              <p className="checkout-payment-note">
                Your payment method is saved with the order. This storefront does not process payments.
              </p>
            </section>

            {error && <p className="auth-error" role="alert">{error}</p>}
          </div>

          <aside className="checkout-order-column">
            <section className="checkout-order-card">
              <div className="checkout-order-heading">
                <div>
                  <span className="checkout-eyebrow">Your selection</span>
                  <h2>Order summary</h2>
                </div>
                <span className="checkout-order-count">{cartCount} items</span>
              </div>

              <div className="checkout-order-items">
                {cart.map((item) => (
                  <div className="checkout-order-item" key={item.id}>
                    <div className="checkout-order-image-wrap">
                      <img src={getProductImageUrl(item.image, 'card')} alt="" />
                      <span>{item.quantity}</span>
                    </div>
                    <div className="checkout-order-item-copy">
                      <strong>{item.name}</strong>
                      <small>{formatUsd(item.price)} each</small>
                    </div>
                    <strong className="checkout-order-item-price">
                      {formatUsd(Number(item.price) * Number(item.quantity))}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="checkout-cost-breakdown">
                <div><span>Subtotal</span><span>{formatUsd(subtotal)}</span></div>
                <div><span>Shipping</span><span className="checkout-shipping-included">Calculated by store</span></div>
                <div className="checkout-total-row"><strong>Order total</strong><strong>{formatUsd(subtotal)}</strong></div>
                <small className="checkout-total-caption">
                  Shipping and any applicable taxes are confirmed by the store.
                </small>
              </div>

              <button type="submit" className="checkout-submit-button" disabled={submitting}>
                <span>{submitting ? 'Placing your order…' : 'Place order'}</span>
                {submitting ? <span className="checkout-button-spinner" aria-hidden="true" /> : <ArrowRight size={19} />}
              </button>
              <div className="checkout-secure-note">
                <ShieldCheck size={16} />
                <span>Your details are used to complete this order.</span>
              </div>
            </section>
            <p className="checkout-help-note">
              Need help? <Link to="/contact">Contact our team</Link>
            </p>
          </aside>
        </form>
      </div>
    </main>
  );
}
