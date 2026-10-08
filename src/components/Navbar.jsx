import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart-context';
import { useAuth } from '../context/auth-context';
import { ShoppingBag, Menu, X, Sofa, ChevronRight, Search, LogOut } from 'lucide-react';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const scrollFrame = useRef(0);
  const { cartCount, toggleCartDrawer } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Handle scroll detection for navbar elevation
  useEffect(() => {
    const handleScroll = () => {
      if (scrollFrame.current) return;
      scrollFrame.current = window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20);
        scrollFrame.current = 0;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.cancelAnimationFrame(scrollFrame.current);
    };
  }, []);

  return (
    <>
      {/* Announcement Top Bar */}
      <aside className="announcement-bar">
        <div className="announcement-content">
          <span>✨ Complimentary White-Glove Delivery on Orders over $1,500</span>
          <span className="announcement-divider">•</span>
          <span>Designed & Crafted in Europe</span>
        </div>
      </aside>

      {/* Main Navbar */}
      <header className={`main-navbar ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="nav-container">
          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="mobile-toggle-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Brand Logo */}
          <Link to="/" className="brand-logo">
            <span className="brand-icon-wrap">
              <Sofa size={22} className="brand-icon" />
            </span>
            <div className="brand-text">
              <span className="brand-title">LUMA LIVING</span>
              <span className="brand-tagline">LUXURY INTERIORS</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="desktop-nav-links">
            <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Home
            </NavLink>
            <NavLink to="/shop" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Shop Collections
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              About Us
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Contact
            </NavLink>
          </nav>

          {/* Nav Right Actions */}
          <div className="nav-actions">
            <Link to="/shop" className="nav-icon-btn search-btn" title="Search Collections">
              <Search size={20} />
            </Link>

            <button
              type="button"
              className="nav-icon-btn cart-btn-wrap"
              onClick={() => {
                if (!isAuthenticated) {
                  navigate(`/login?redirect=${encodeURIComponent('/cart')}`);
                  return;
                }
                toggleCartDrawer();
              }}
              aria-label={`View cart with ${cartCount} items`}
            >
              <ShoppingBag size={22} />
              {cartCount > 0 && <span className="cart-badge-count">{cartCount}</span>}
            </button>
            {isAuthenticated ? (
              <button type="button" className="nav-auth-link" onClick={logout} aria-label="Log out">
                <LogOut size={16} /> Log out
              </button>
            ) : (
              <div className="nav-auth-links">
                <Link to="/login" className="nav-auth-link">Log in</Link>
                <Link to="/signup" className="nav-auth-link nav-auth-signup">Sign up</Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer Overlay */}
        <div
          id="mobile-navigation"
          className={`mobile-nav-drawer ${isMobileMenuOpen ? 'is-open' : ''}`}
          aria-hidden={!isMobileMenuOpen}
        >
          <div className="mobile-nav-content">
            <div className="mobile-nav-header">
              <span className="mobile-menu-title">Navigation</span>
              <button
                type="button"
                className="mobile-close-icon"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close navigation menu"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mobile-links-list">
              <NavLink to="/" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
                <span>Home</span>
                <ChevronRight size={18} />
              </NavLink>
              <NavLink to="/shop" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
                <span>Shop Collections</span>
                <ChevronRight size={18} />
              </NavLink>
              <NavLink to="/cart" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
                <span>Shopping Cart ({cartCount})</span>
                <ChevronRight size={18} />
              </NavLink>
              {isAuthenticated ? (
                <button
                  type="button"
                  className="mobile-link mobile-auth-button"
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <span>Log out</span>
                  <LogOut size={18} />
                </button>
              ) : (
                <>
                  <NavLink to="/login" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
                    <span>Log in</span>
                    <ChevronRight size={18} />
                  </NavLink>
                  <NavLink to="/signup" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
                    <span>Sign up</span>
                    <ChevronRight size={18} />
                  </NavLink>
                </>
              )}
              <NavLink to="/about" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
                <span>About Us</span>
                <ChevronRight size={18} />
              </NavLink>
              <NavLink to="/contact" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
                <span>Contact</span>
                <ChevronRight size={18} />
              </NavLink>
            </div>

            <div className="mobile-nav-footer">
              <p className="mobile-footer-text">Luma Living Studio</p>
              <p className="mobile-footer-sub">Handcrafted European Luxury</p>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
