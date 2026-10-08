import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth-context';

const initialForm = {
  name: '',
  phone: '',
  email: '',
  gender: '',
  address: '',
  password: '',
};

export default function SignupPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(form);
      navigate('/login?registered=1', { replace: true });
    } catch (registrationError) {
      setError(registrationError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card auth-card-wide">
        <span className="auth-eyebrow">Join Luma Living</span>
        <h1>Create your account</h1>
        <p>Your saved address will be used for delivery when placing an order.</p>
        {error && <p className="auth-error" role="alert">{error}</p>}
        <form onSubmit={handleSubmit} className="auth-form auth-form-grid">
          <label htmlFor="signup-name">Full name</label>
          <input id="signup-name" name="name" autoComplete="name" value={form.name} onChange={updateField} required />
          <label htmlFor="signup-phone">Phone</label>
          <input id="signup-phone" name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={updateField} required />
          <label htmlFor="signup-email">Email address</label>
          <input id="signup-email" name="email" type="email" autoComplete="email" value={form.email} onChange={updateField} required />
          <label htmlFor="signup-gender">Gender</label>
          <select id="signup-gender" name="gender" value={form.gender} onChange={updateField} required>
            <option value="">Select an option</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>
          <label htmlFor="signup-address">Delivery address</label>
          <textarea id="signup-address" name="address" autoComplete="street-address" value={form.address} onChange={updateField} required />
          <label htmlFor="signup-password">Password</label>
          <input id="signup-password" name="password" type="password" autoComplete="new-password" value={form.password} onChange={updateField} required />
          <button type="submit" className="btn-auth-submit" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p className="auth-switch">Already registered? <Link to="/login">Log in</Link></p>
      </section>
    </main>
  );
}
