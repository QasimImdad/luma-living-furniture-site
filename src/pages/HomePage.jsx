import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/products-context';
import CollectionSection from '../components/CollectionSection';
import { getProductImageUrl } from '../lib/api';
import { getProductCollections } from '../lib/productCollections';
import { ArrowRight, Sparkles, Compass, ShieldCheck, Heart, ArrowUpRight, Truck, Leaf, Clock3 } from 'lucide-react';

export const HomePage = () => {
  const { products, loading, error, refreshProducts } = useProducts();
  const collections = useMemo(() => getProductCollections(products), [products]);
  const categories = useMemo(
    () => collections.map(({ name, products: collectionProducts }) => ({
      name,
      product: collectionProducts.find((item) => item.image),
      count: collectionProducts.length,
    })),
    [collections],
  );

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-overlay"></div>
        <img
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1440&q=75"
          alt="Luxury interior design hero"
          className="hero-bg-image"
          fetchPriority="high"
          decoding="async"
        />
        <div className="hero-content-container">
          <div className="hero-badge">
            <Sparkles size={14} />
            <span>Autumn 2026 Architectural Collection</span>
          </div>

          <h1 className="hero-title">
            Architectural Living <br />
            <em>Refined Craftsmanship</em>
          </h1>

          <p className="hero-subtitle">
            Curated furniture crafted from FSC-certified timber, textured bouclé, and fine Italian leathers designed for distinguished modern homes.
          </p>

          <div className="hero-actions">
            <Link to="/shop" className="btn-hero-primary">
              <span>Explore Collection</span>
              <ArrowRight size={18} />
            </Link>

            <a href="#featured-section" className="btn-hero-secondary">
              <span>View All Collections</span>
            </a>
          </div>

          <div className="hero-stats-row">
            <div className="stat-item">
              <span className="stat-num">100%</span>
              <span className="stat-label">Sustainable Hardwood</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-num">10-Yr</span>
              <span className="stat-label">Structural Guarantee</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-num">4.9 ★</span>
              <span className="stat-label">500+ Verified Reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid Section */}
      <section className="categories-section">
        <div className="section-container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">Curated Spaces</span>
              <h2 className="section-title">Explore by Category</h2>
            </div>
            <Link to="/shop" className="view-all-link">
              <span>All Collections</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <p className="api-state" role="status">Loading collections…</p>
          ) : error ? (
            <div className="api-state api-state-error" role="alert">
              <p>Collections could not be loaded: {error}</p>
              <button type="button" onClick={refreshProducts}>Try again</button>
            </div>
          ) : categories.length > 0 ? (
            <div className="category-cards-grid">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  className="category-card"
                  to={`/shop?collection=${encodeURIComponent(cat.name)}`}
                  aria-label={`Shop ${cat.name}, ${cat.count} ${cat.count === 1 ? 'piece' : 'pieces'}`}
                >
                  {cat.product?.image && (
                    <img
                      src={getProductImageUrl(cat.product.image, 'card')}
                      alt={cat.name}
                      className="cat-card-img"
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                  <div className="cat-card-overlay">
                    <div className="cat-card-info">
                      <h3>{cat.name}</h3>
                      <span className="cat-explore-text">
                        {cat.count} {cat.count === 1 ? 'piece' : 'pieces'} <ArrowUpRight size={16} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="api-state">There are no products to organize into collections yet.</p>
          )}
        </div>
      </section>

      <section id="featured-section" className="featured-section">
        {!loading && !error && (collections.length > 0 ? (
          collections.map((collection) => (
            <CollectionSection key={collection.name} collection={collection} />
          ))
        ) : (
          <div className="section-container">
            <p className="api-state">There are no products in the catalogue yet.</p>
          </div>
        ))}
      </section>

      {/* Craftsmanship Lookbook Banner */}
      <section className="lookbook-section">
        <div className="lookbook-container">
          <div className="lookbook-image-wrap">
            <img
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80"
              alt="Artisan furniture craftsmanship"
              className="lookbook-img"
              loading="lazy"
              decoding="async"
            />
            <div className="lookbook-badge">
              <Compass size={18} />
              <span>Handcrafted Excellence</span>
            </div>
          </div>

          <div className="lookbook-content">
            <span className="lookbook-eyebrow">Our Design Philosophy</span>
            <h2 className="lookbook-title">
              Designed to endure, <br />
              crafted to inspire.
            </h2>
            <p className="lookbook-text">
              Every Luma Living design begins in our European studios where master artisans combine ancestral woodworking techniques with modern ergonomic engineering. We prioritize solid FSC-certified hardwoods, non-toxic organic finishes, and custom upholstery woven for longevity.
            </p>

            <div className="lookbook-highlights">
              <div className="highlight-box">
                <ShieldCheck size={24} className="hl-icon" />
                <div>
                  <h4>Zero Particleboard</h4>
                  <p>Only solid kiln-dried walnut, oak, and birch frames.</p>
                </div>
              </div>

              <div className="highlight-box">
                <Heart size={24} className="hl-icon" />
                <div>
                  <h4>Tactile Comfort</h4>
                  <p>Stain-defying organic bouclé and silk velvet fabrics.</p>
                </div>
              </div>
            </div>

            <Link to="/about" className="btn-lookbook">
              Discover Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonial / Press Quote Section */}
      <section className="testimonials-section">
        <div className="section-container">
          <div className="testimonial-card">
            <div className="stars-row">★★★★★</div>
            <blockquote className="testimonial-quote">
              "Luma Living has elevated our living sanctuary completely. The Aura Modular Sofa is not only a work of modern architectural art, but the most comfortable seating experience we've ever owned."
            </blockquote>
            <div className="testimonial-author">
              <span className="author-name">Architectural Digest Studio</span>
              <span className="author-role">Design Review 2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="cta-banner-section">
        <div className="cta-container">
          <h2>Transform Your Home Into A Sanctuary</h2>
          <p>Explore our complete autumn catalog with white-glove delivery included.</p>
          <Link to="/shop" className="btn-cta-primary">
            <span>Shop Furniture Catalogue</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="brand-promise-strip" aria-label="Brand promises">
        <div className="brand-promise-grid">
          <div className="promise-item">
            <Truck size={26} className="promise-icon" />
            <div>
              <h3>White-Glove Delivery</h3>
              <p>In-room assembly &amp; packaging removal</p>
            </div>
          </div>

          <div className="promise-item">
            <ShieldCheck size={26} className="promise-icon" />
            <div>
              <h3>10-Year Warranty</h3>
              <p>Guaranteed structural craftsmanship</p>
            </div>
          </div>

          <div className="promise-item">
            <Leaf size={26} className="promise-icon" />
            <div>
              <h3>FSC-Certified Timber</h3>
              <p>Sustainably harvested hardwoods</p>
            </div>
          </div>

          <div className="promise-item">
            <Clock3 size={26} className="promise-icon" />
            <div>
              <h3>30-Day Home Trial</h3>
              <p>Risk-free trial in your own space</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
