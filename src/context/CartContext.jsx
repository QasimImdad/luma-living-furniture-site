import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from './auth-context';
import { CartContext } from './cart-context';
import { apiRequest } from '../lib/api';

export function CartProvider({ children }) {
  const { token } = useAuth();
  const [cartState, setCartState] = useState({
    token: null,
    cart: [],
    loading: true,
    error: '',
  });
  const cart = cartState.token === token ? cartState.cart : [];
  const loading = Boolean(token) && (
    cartState.token !== token || cartState.loading
  );
  const error = cartState.token === token ? cartState.error : '';
  const [toastMessage, setToastMessage] = useState('');
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const requestVersion = useRef(0);
  const toastTimeout = useRef(0);

  const showToast = useCallback((message) => {
    setToastMessage(message);
    window.clearTimeout(toastTimeout.current);
    toastTimeout.current = window.setTimeout(() => setToastMessage(''), 3500);
  }, []);

  useEffect(() => () => window.clearTimeout(toastTimeout.current), []);

  const refreshCart = useCallback(async () => {
    if (!token) {
      return false;
    }

    const version = ++requestVersion.current;
    setCartState((current) => ({
      token,
      cart: current.token === token ? current.cart : [],
      loading: true,
      error: '',
    }));
    try {
      const result = await apiRequest('/cart', { token });
      if (!Array.isArray(result.cart)) {
        throw new Error('The API response did not contain cart items.');
      }
      if (version !== requestVersion.current) return false;
      setCartState({ token, cart: result.cart, loading: false, error: '' });
      return true;
    } catch (requestError) {
      if (version !== requestVersion.current) return false;
      setCartState((current) => ({
        token,
        cart: current.token === token ? current.cart : [],
        loading: false,
        error: requestError.message,
      }));
      return false;
    }
  }, [token]);

  useEffect(() => {
    let active = true;
    const version = ++requestVersion.current;

    if (!token) return undefined;

    apiRequest('/cart', { token })
      .then((result) => {
        if (!Array.isArray(result.cart)) {
          throw new Error('The API response did not contain cart items.');
        }
        if (active && version === requestVersion.current) {
          setCartState({ token, cart: result.cart, loading: false, error: '' });
        }
      })
      .catch((requestError) => {
        if (active && version === requestVersion.current) {
          setCartState({
            token,
            cart: [],
            loading: false,
            error: requestError.message,
          });
        }
      });

    return () => {
      active = false;
    };
  }, [token]);

  const runCartMutation = async (request, successMessage) => {
    if (!token) {
      const message = 'Please log in to manage your cart.';
      setCartState((current) => ({
        ...current,
        token,
        error: message,
      }));
      showToast(message);
      return false;
    }

    setCartState((current) => ({
      ...current,
      token,
      cart: current.token === token ? current.cart : [],
      loading: true,
      error: '',
    }));
    requestVersion.current += 1;
    try {
      await request();
      const refreshed = await refreshCart();
      if (!refreshed) return false;
      showToast(successMessage);
      return true;
    } catch (requestError) {
      setCartState((current) => ({
        token,
        cart: current.token === token ? current.cart : [],
        loading: false,
        error: requestError.message,
      }));
      showToast(requestError.message);
      return false;
    }
  };

  const addToCart = (product, quantity = 1) =>
    runCartMutation(
      () => apiRequest('/cart/add', {
        method: 'POST',
        token,
        body: { product_id: product.id, quantity },
      }),
      `"${product.name}" added to your cart.`,
    );

  const updateQuantity = (itemId, quantity) =>
    runCartMutation(
      () => apiRequest(`/cart/items/${encodeURIComponent(itemId)}`, {
        method: 'PATCH',
        token,
        body: { quantity },
      }),
      'Cart quantity updated.',
    );

  const removeFromCart = (itemId) =>
    runCartMutation(
      () => apiRequest(`/cart/items/${encodeURIComponent(itemId)}`, {
        method: 'DELETE',
        token,
      }),
      'Item removed from your cart.',
    );

  const cartCount = cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const subtotal = cart.reduce(
    (total, item) => total + Number(item.price || 0) * Number(item.quantity || 0),
    0,
  );

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      error,
      refreshCart,
      addToCart,
      updateQuantity,
      removeFromCart,
      cartCount,
      subtotal,
      toastMessage,
      showToast,
      isCartDrawerOpen,
      setIsCartDrawerOpen,
      toggleCartDrawer: () => setIsCartDrawerOpen((open) => !open),
    }}>
      {children}
    </CartContext.Provider>
  );
}
