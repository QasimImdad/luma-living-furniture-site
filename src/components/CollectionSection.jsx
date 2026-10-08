import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';

export default function CollectionSection({ collection }) {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(
    () => typeof window !== 'undefined' && !('IntersectionObserver' in window),
  );

  useEffect(() => {
    const element = sectionRef.current;
    if (!element || isVisible) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px 0px' },
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, [isVisible]);

  return (
    <section className="collection-section" ref={sectionRef}>
      <div className="section-container">
        <div className="section-header">
          <div>
            <span className="section-eyebrow">Shop by collection</span>
            <h2 className="section-title">{collection.name}</h2>
          </div>
          <Link
            to={`/shop?collection=${encodeURIComponent(collection.name)}`}
            className="view-all-link"
          >
            <span>View all {collection.products.length} pieces</span>
            <ArrowRight size={16} />
          </Link>
        </div>
        {isVisible ? (
          <div className="products-grid-4col">
            {collection.products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="collection-placeholder" aria-hidden="true" />
        )}
      </div>
    </section>
  );
}
