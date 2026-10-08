import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';

const initialFormData = {
  name: '',
  email: '',
  phone: '',
  subject: 'General Inquiry',
  message: '',
};

export const ContactPage = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [submissionNotice, setSubmissionNotice] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setSubmissionNotice(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmissionNotice(true);
  };

  return (
    <div className="contact-page">
      <header className="contact-header">
        <div className="contact-container">
          <span className="contact-eyebrow">Design Advisory & Assistance</span>
          <h1 className="contact-title">We Are Here To Assist You</h1>
          <p className="contact-subtitle">
            Whether you need custom furniture sizing, interior design consultation, or order tracking, our specialists are at your service.
          </p>
        </div>
      </header>

      <main className="contact-main">
        <div className="contact-container">
          <div className="contact-grid">
            {/* Contact Form */}
            <div className="contact-form-card">
              <h2 className="form-card-title">Send Us A Message</h2>

              <form onSubmit={handleSubmit} className="contact-form">
                  {submissionNotice && (
                    <p className="auth-error" role="status">
                      Online message delivery is not configured yet. Email us at{' '}
                      <a href="mailto:concierge@lumaliving.com">concierge@lumaliving.com</a>.
                    </p>
                  )}
                  <div className="form-row-2col">
                    <div className="form-field">
                      <label htmlFor="contact-name">Your Name *</label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        required
                        placeholder="Sophia Laurent"
                        value={formData.name}
                        onChange={updateField}
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor="contact-email">Email Address *</label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        placeholder="sophia@example.com"
                        value={formData.email}
                        onChange={updateField}
                      />
                    </div>
                  </div>

                  <div className="form-row-2col">
                    <div className="form-field">
                      <label htmlFor="contact-phone">Phone Number (Optional)</label>
                      <input
                        id="contact-phone"
                        name="phone"
                        type="tel"
                        placeholder="+1 (555) 234-5678"
                        value={formData.phone}
                        onChange={updateField}
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor="contact-subject">Subject</label>
                      <select
                        id="contact-subject"
                        name="subject"
                        value={formData.subject}
                        onChange={updateField}
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Custom Upholstery">Custom Upholstery Request</option>
                        <option value="Trade & Interior Design">Trade & Interior Design Program</option>
                        <option value="Order Status">Existing Order Status</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="contact-message">How can we help? *</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      required
                      placeholder="Tell us about your space or questions..."
                      value={formData.message}
                      onChange={updateField}
                    />
                  </div>

                  <button type="submit" className="btn-send-contact">
                    <span>Send Message</span>
                    <Send size={16} />
                  </button>
              </form>
            </div>

            {/* Showroom & Info Column */}
            <div className="contact-info-column">
              <div className="info-card">
                <h3>Flagship Atelier Showrooms</h3>

                <div className="showroom-item">
                  <MapPin size={20} className="info-icon" />
                  <div>
                    <h4>New York Studio</h4>
                    <p>450 Madison Avenue, Suite 1200<br />New York, NY 10022</p>
                  </div>
                </div>

                <div className="showroom-item">
                  <MapPin size={20} className="info-icon" />
                  <div>
                    <h4>London Showroom</h4>
                    <p>88 Bond Street, Mayfair<br />London W1S 1SR, UK</p>
                  </div>
                </div>

                <hr className="info-divider" />

                <div className="contact-details-list">
                  <div className="detail-item">
                    <Phone size={18} className="detail-icon" />
                    <span>+1 (800) 845-9831</span>
                  </div>

                  <div className="detail-item">
                    <Mail size={18} className="detail-icon" />
                    <a href="mailto:concierge@lumaliving.com">concierge@lumaliving.com</a>
                  </div>

                  <div className="detail-item">
                    <Clock size={18} className="detail-icon" />
                    <span>Mon - Sat: 9:00 AM - 7:00 PM EST</span>
                  </div>
                </div>
              </div>

              {/* Trade Program Card */}
              <div className="trade-program-card">
                <MessageSquare size={24} className="trade-icon" />
                <h4>Are you an Interior Designer?</h4>
                <p>Join our Trade Program for exclusive designer discounts, fabric swatch kits, and dedicated account managers.</p>
                <span className="trade-link">Apply For Trade Access →</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactPage;
