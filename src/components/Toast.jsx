import { useCart } from '../context/cart-context';
import { CheckCircle2 } from 'lucide-react';

export const Toast = () => {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="toast-container" role="alert" aria-live="polite">
      <div className="toast-content">
        <div className="toast-icon">
          <CheckCircle2 size={18} />
        </div>
        <span className="toast-text">{toastMessage}</span>
      </div>
    </div>
  );
};
export default Toast;
