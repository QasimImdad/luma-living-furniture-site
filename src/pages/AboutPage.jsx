import { Link } from 'react-router-dom';
import { Award, Compass, ShieldCheck } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="about-page">
      {/* About Header */}
      <section className="about-hero-section">
        <div className="about-hero-container">
          <span className="about-eyebrow">Our Heritage & Craftsmanship</span>
          <h1 className="about-title">
            Redefining Modern Living Through <br />
            <em>Architectural Purity</em>
          </h1>
          <p className="about-lead">
            Founded with a vision to create heirloom-quality furniture that transcends fleeting trends. Every piece is handcrafted by master artisans using FSC-certified hardwoods, organic textiles, and sustainable practices.
          </p>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="about-story-section">
        <div className="about-container">
          <div className="story-grid">
            <div className="story-image-wrap">
              <img
                src="https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=1000&q=80"
                alt="Furniture artisan at work"
                className="story-img"
              />
            </div>
            <div className="story-content">
              <span className="section-eyebrow">The Luma Atelier</span>
              <h2 className="section-title">Where Artistry Meets Ergonomic Engineering</h2>
              <p>
                At Luma Living, we believe furniture should be a seamless expression of form, function, and emotional resonance. Our design studios bring together sculptors, master joiners, and textile experts to engineer pieces that elevate daily living into a ritual of comfort.
              </p>
              <p>
                From hand-curved bouclé sofas to solid black walnut dining tables, every material is responsibly harvested and meticulously assembled to endure for generations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="about-values-section">
        <div className="about-container">
          <div className="section-header text-center">
            <span className="section-eyebrow">Our Core Principles</span>
            <h2 className="section-title">Crafted With Intent</h2>
          </div>

          <div className="values-grid">
            <div className="value-card">
              <Award size={32} className="v-icon" />
              <h3>Uncompromised Materials</h3>
              <p>We source only solid FSC-certified hardwoods, non-toxic organic varnishes, and top-grain Italian aniline leather.</p>
            </div>

            <div className="value-card">
              <Compass size={32} className="v-icon" />
              <h3>Architectural Design</h3>
              <p>Clean geometric proportions, organic curves, and subtle tactile details designed for modern luxury interiors.</p>
            </div>

            <div className="value-card">
              <ShieldCheck size={32} className="v-icon" />
              <h3>10-Year Guarantee</h3>
              <p>Every frame undergo rigorous stress testing to ensure structural integrity and decade-long durability.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta-section">
        <div className="about-container text-center">
          <h2>Experience Luma Living In Your Space</h2>
          <p>Explore our curated collections with complimentary white-glove assembly.</p>
          <Link to="/shop" className="btn-about-cta">
            Browse Furniture Collections
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
