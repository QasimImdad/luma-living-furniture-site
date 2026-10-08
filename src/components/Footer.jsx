import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sofa, Send } from 'lucide-react';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [signupNotice, setSignupNotice] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSignupNotice(true);
    }
  };

  return (
    <footer className="footer-site">
      {/* Main Footer Links */}
      <div className="footer-main-body">
        <div className="footer-container">
          {/* Brand Info Column */}
          <div className="footer-col brand-col">
            <Link to="/" className="footer-logo">
              <Sofa size={24} className="footer-logo-icon" />
              <span>LUMA LIVING</span>
            </Link>
            <p className="footer-desc">
              Crafting architectural furniture and timeless living elements. Built with sustainable woods, premium bouclé, and artisan leather for sophisticated interiors.
            </p>
            <div className="footer-socials">
              <span className="social-pill">Instagram</span>
              <span className="social-pill">Pinterest</span>
              <span className="social-pill">Architectural Digest</span>
            </div>
          </div>

          {/* Collections Column */}
          <div className="footer-col">
            <h4 className="footer-heading">Collections</h4>
            <ul className="footer-menu">
              <li><Link to="/shop?category=Living Room">Living Room</Link></li>
              <li><Link to="/shop?category=Bedroom">Bedroom</Link></li>
              <li><Link to="/shop?category=Dining">Dining Room</Link></li>
              <li><Link to="/shop?category=Office">Home Office</Link></li>
              <li><Link to="/shop?category=Sofas">Modular Sofas</Link></li>
              <li><Link to="/shop?category=Chairs">Accent Chairs</Link></li>
            </ul>
          </div>

          {/* Customer Care Column */}
          <div className="footer-col">
            <h4 className="footer-heading">Customer Care</h4>
            <ul className="footer-menu">
              <li><Link to="/contact">Contact Support</Link></li>
              <li><Link to="/about">Our Philosophy</Link></li>
              <li><Link to="/shop">Store Catalogue</Link></li>
              <li><Link to="/cart">Shopping Cart</Link></li>
              <li><a href="#delivery">White-Glove Service</a></li>
              <li><a href="#warranty">Warranty & Returns</a></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="footer-col newsletter-col">
            <h4 className="footer-heading">Join The Collector's Club</h4>
            <p className="newsletter-text">
              Receive private collection previews, interior design lookbooks, and exclusive seasonal invitations.
            </p>

            <form onSubmit={handleSubscribe} className="newsletter-form">
                <input
                  type="email"
                  required
                  aria-label="Email address for newsletter updates"
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setSignupNotice(false);
                  }}
                  className="newsletter-input"
                />
                <button type="submit" className="newsletter-submit-btn" title="Subscribe">
                  <Send size={16} />
                </button>
            </form>
            {signupNotice && (
              <p className="newsletter-text" role="status">
                Online sign-up is not available yet. Please{' '}
                <Link to="/contact">contact our team</Link> to join.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="footer-bottom-bar">
        <div className="footer-container bottom-flex">
          <p className="copyright-text">
            &copy; {new Date().getFullYear()} Luma Living Studio Ltd. All Rights Reserved.
          </p>
          <div className="legal-links">
            <a href="#privacy">Privacy Policy</a>
            <span className="dot">•</span>
            <a href="#terms">Terms of Service</a>
            <span className="dot">•</span>
            <a href="#accessibility">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
