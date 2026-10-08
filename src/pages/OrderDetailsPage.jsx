import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../context/auth-context';
import { apiRequest, formatUsd } from '../lib/api';

const paymentMethodLabels = {
  bank_transfer: 'Bank account',
  paypal: 'PayPal',
  cod: 'Cash on delivery',
};

export default function OrderDetailsPage() {
  const { id } = useParams();
  return <OrderDetailsContent key={id} id={id} />;
}

function OrderDetailsContent({ id }) {
  const { token } = useAuth();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    apiRequest(`/orders/${encodeURIComponent(id)}`, { token })
      .then((result) => {
        if (!result.order) throw new Error('The API response did not contain order details.');
        if (active) setOrder(result.order);
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
  }, [id, token]);

  return (
    <main className="order-page">
      <section className="order-card">
        {loading ? (
          <p role="status">Loading order…</p>
        ) : error ? (
          <div className="auth-error" role="alert">
            <p>Unable to load this order: {error}</p>
            <Link to="/cart">Return to your cart</Link>
          </div>
        ) : (
          <>
            <span className="auth-eyebrow">Order #{order.id}</span>
            <h1>Order placed</h1>
            <p className="order-pending-notice">
              Payment is pending. This order was created but no payment method was charged.
            </p>
            {location.state?.cartRefreshFailed && (
              <p className="auth-error" role="alert">
                Your order was placed, but the cart could not be refreshed. Reload the cart before placing another order.
              </p>
            )}
            <div className="order-summary">
              <p><span>Status</span><strong>{order.status}</strong></p>
              <p><span>Total</span><strong>{formatUsd(order.total)}</strong></p>
              {(location.state?.paymentMethod || order.payment_method) && (
                <p>
                  <span>Payment method</span>
                  <strong>
                    {paymentMethodLabels[location.state?.paymentMethod || order.payment_method]
                      || location.state?.paymentMethod
                      || order.payment_method}
                  </strong>
                </p>
              )}
              <p><span>Delivery address</span><strong>{order.shipping_address}</strong></p>
            </div>
            {Array.isArray(order.items) && order.items.length > 0 && (
              <ul className="order-items">
                {order.items.map((item) => (
                  <li key={`${item.product_id}-${item.sku || item.product_name}`}>
                    <span>{item.product_name} × {item.quantity}</span>
                    <strong>{formatUsd(Number(item.unit_price) * Number(item.quantity))}</strong>
                  </li>
                ))}
              </ul>
            )}
            <Link to="/shop" className="btn-auth-submit order-continue">Continue shopping</Link>
          </>
        )}
      </section>
    </main>
  );
}
