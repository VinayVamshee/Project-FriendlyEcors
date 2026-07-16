import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RiSearchLine, RiWhatsappLine, RiArrowRightUpLine } from 'react-icons/ri';
import { useSettings, API_BASE_URL } from '../context/SettingsContext';
import './Products.css';

const Products = () => {
  const { settings } = useSettings();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || '';
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/categories`);
        const result = await res.json();
        if (result.success) setCategories(result.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `${API_BASE_URL}/products`;
        const params = [];
        if (activeCategory) params.push(`category=${activeCategory}`);
        if (search) params.push(`search=${search}`);
        
        if (params.length > 0) {
          url += `?${params.join('&')}`;
        }

        const res = await fetch(url);
        const result = await res.json();
        if (result.success) setProducts(result.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [activeCategory, search]);

  const handleCategoryChange = (slug) => {
    if (slug) {
      setSearchParams({ category: slug });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="products-page">
      <div className="products-hero container">
        <span className="section-label">The Catalog</span>
        <h1>Curated Rental Collection</h1>
        <p>A highly polished collection of props, floral arches, neon backdrops, and installations available for manual booking in Dallas-Fort Worth.</p>
      </div>

      <div className="products-main container">
        {/* Modern Sidebar with Glass Accents */}
        <div className="filter-sidebar">
          <div className="search-box glass-effect">
            <RiSearchLine className="search-icon" />
            <input
              type="text"
              placeholder="Search props..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="category-filters-container glass-effect">
            <h3>Categories</h3>
            <div className="category-filter-list">
              <button
                className={`filter-btn ${activeCategory === '' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('')}
              >
                All Collections
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  className={`filter-btn ${activeCategory === cat.slug ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(cat.slug)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="booking-notice-card glass-effect">
            <h4>Bespoke Consultations</h4>
            <p>Our rentals include dedicated assembly and positioning services. Direct inquiries are handled manually over WhatsApp or phone call.</p>
            <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer" className="sidebar-inquiry-btn">
              <RiWhatsappLine size={16} />
              <span>WhatsApp Direct</span>
            </a>
          </div>
        </div>

        {/* Product Catalog - Editorial Layout */}
        <div className="catalog-panel">
          {loading ? (
            <div className="loading-state">
              <p>Fetching design objects...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <p>No objects match your requirements. Try adjusting your query filters.</p>
            </div>
          ) : (
            <div className="editorial-catalog-grid">
              <AnimatePresence mode="popLayout">
                {products.map((prod, idx) => (
                  <motion.div
                    key={prod._id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    transition={{ duration: 0.6, delay: idx * 0.05 }}
                    className={`editorial-product-card card-height-${idx % 3}`}
                  >
                    <Link to={`/products/${prod._id}`} className="card-image-link">
                      <div className="card-image-frame">
                        <img src={prod.images[0]} alt={prod.title} loading="lazy" />
                        <div className="card-floating-price glass-effect">
                          ${prod.price} <span className="term">/ {prod.duration}</span>
                        </div>
                      </div>
                    </Link>
                    <div className="card-content-block">
                      <span className="card-cat-label">{prod.category?.name}</span>
                      <Link to={`/products/${prod._id}`}>
                        <h3>{prod.title}</h3>
                      </Link>
                      <p>{prod.description.slice(0, 100)}...</p>
                      
                      <div className="card-meta-actions">
                        <Link to={`/products/${prod._id}`} className="examine-btn">
                          <span>Examine Object</span>
                          <RiArrowRightUpLine size={16} />
                        </Link>
                        <a
                          href={`https://wa.me/${settings.whatsapp}?text=Hi! I am inquiring about the "${encodeURIComponent(prod.title)}"`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="whatsapp-quick-btn"
                          aria-label="WhatsApp Inquiry"
                        >
                          <RiWhatsappLine size={18} />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
