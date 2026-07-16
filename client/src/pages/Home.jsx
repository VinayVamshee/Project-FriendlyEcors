import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiWhatsappLine, RiPhoneLine, RiStarFill, RiArrowRightDownLine } from 'react-icons/ri';
import { useSettings, API_BASE_URL } from '../context/SettingsContext';
import './Home.css';

const Home = () => {
  const { settings } = useSettings();
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [featuredReviews, setFeaturedReviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes, revRes] = await Promise.all([
          fetch(`${API_BASE_URL}/categories`),
          fetch(`${API_BASE_URL}/products?featured=true`),
          fetch(`${API_BASE_URL}/reviews?featured=true`),
        ]);

        const catData = await catRes.json();
        const prodData = await prodRes.json();
        const revData = await revRes.json();

        if (catData.success) setCategories(catData.data);
        if (prodData.success) setFeaturedProducts(prodData.data);
        if (revData.success) setFeaturedReviews(revData.data);
      } catch (error) {
        console.error('Error fetching home data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="home-page">
      {/* 1. Cinematic Hero Section */}
      <section className="hero-editorial container">
        <div className="hero-text-block">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="hero-tag"
          >
            Dallas, DFW
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="hero-title-large"
          >
            Milestones, <br />
            <em>Architectured</em>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="hero-para"
          >
            Bespoke backdrop rentals, luxury floral installations, and organic balloon styling designed to turn gatherings into contemporary visual narratives.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="hero-buttons"
          >
            <Link to="/products" className="btn-editorial-primary">View Rentals</Link>
            <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn-editorial-link">
              <span>Book Consultation</span>
              <RiArrowRightDownLine size={18} />
            </a>
          </motion.div>
        </div>

        <div className="hero-image-block">
          <div className="hero-img-wrapper">
            <img 
              src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200" 
              alt="Luxury Wedding Arch Design DFW" 
            />
          </div>
          {/* Subtle floating glass panel overlay */}
          <div className="hero-floating-card glass-effect">
            <span className="card-lbl">Featured Setup</span>
            <h4>Ethereal Blossom Hoop</h4>
            <p>Dallas Ritz-Carlton Reception</p>
          </div>
        </div>
      </section>

      {/* 2. Brand Introduction (Asymmetrical & Overlapping) */}
      <section className="about-overlapping section-padding container">
        <div className="overlap-grid">
          <div className="overlap-img-col">
            <img 
              src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=900" 
              alt="Luxury Dining Centerpieces Dallas" 
              className="about-overlap-img"
            />
          </div>
          <div className="overlap-text-col glass-effect">
            <span className="section-label">Design Studio Philosophy</span>
            <h2>Quiet Sophistication</h2>
            <p>
              We bypass loud, repetitive layouts in favor of architectural balance, organic pampas layers, and real-touch floral walls. Every backdrop is hand-weighted, securely aligned, and styled in-situ.
            </p>
            <p className="secondary-para">
              Our flow is direct. Select your rental piece, evaluate pricing openly, and text or call our Dallas studio. We handle transport, alignment, and final teardowns.
            </p>
            <Link to="/about" className="link-outline">Our Philosophy &rarr;</Link>
          </div>
        </div>
      </section>

      {/* 3. Category Carousel/Grid (Asymmetrical Heights) */}
      <section className="collections-asymmetrical section-padding">
        <div className="container">
          <div className="section-intro">
            <span className="section-label">The Catalog</span>
            <h2>Curated Collections</h2>
          </div>

          <div className="collections-masonry">
            {categories.slice(0, 3).map((cat, idx) => (
              <Link 
                to={`/products?category=${cat.slug}`} 
                key={cat._id} 
                className={`collection-editorial-card card-size-${idx}`}
              >
                <div className="col-img-box">
                  <img src={cat.coverImage || 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=800'} alt={cat.name} />
                  <div className="col-overlay-grad"></div>
                </div>
                <div className="col-card-meta">
                  <h3>{cat.name}</h3>
                  <span>Browse Category &rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Rentals Spotlight (Alternating Rows for breathing room) */}
      <section className="spotlight-section section-padding container">
        <div className="section-intro flex-intro">
          <div>
            <span className="section-label">Selected Objects</span>
            <h2>Prop Spotlight</h2>
          </div>
          <Link to="/products" className="editorial-text-link">Full Catalog &rarr;</Link>
        </div>

        <div className="editorial-spotlight-list">
          {featuredProducts.slice(0, 3).map((prod, idx) => (
            <div key={prod._id} className={`spotlight-row ${idx % 2 === 1 ? 'reversed' : ''}`}>
              <div className="spotlight-image-col">
                <div className="spotlight-img-frame">
                  <img src={prod.images[0]} alt={prod.title} />
                  <div className="floating-price-tag glass-effect">
                    ${prod.price} <span className="term">/ {prod.duration}</span>
                  </div>
                </div>
              </div>
              <div className="spotlight-info-col">
                <span className="spotlight-tag">{prod.category?.name}</span>
                <h3>{prod.title}</h3>
                <p>{prod.description}</p>
                {prod.dimensions && <p className="spec">Dimensions: {prod.dimensions}</p>}
                <div className="spotlight-actions">
                  <Link to={`/products/${prod._id}`} className="btn-editorial-outline">Examine Object</Link>
                  <a 
                    href={`https://wa.me/${settings.whatsapp}?text=Hi! I am inquiring about the availability of the ${encodeURIComponent(prod.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-editorial-wa"
                  >
                    <RiWhatsappLine size={18} />
                    <span>Inquire</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Floating Reviews Grid */}
      {featuredReviews.length > 0 && (
        <section className="reviews-section section-padding">
          <div className="container">
            <div className="section-intro text-center">
              <span className="section-label">Endorsements</span>
              <h2>Client Appreciations</h2>
            </div>
            
            <div className="reviews-floating-grid">
              {featuredReviews.map((rev) => (
                <div key={rev._id} className="review-floating-card glass-effect">
                  <div className="rating">
                    {[...Array(5)].map((_, i) => (
                      <RiStarFill key={i} className={i < rev.rating ? 'active-star' : 'muted-star'} />
                    ))}
                  </div>
                  <p className="text">"{rev.comment}"</p>
                  <span className="author">{rev.author}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Contact & Dallas Google Maps (Glass Floating UI) */}
      <section className="contact-editorial section-padding container">
        <div className="contact-editorial-card glass-effect">
          <div className="contact-form-side">
            <span className="section-label">Calendar Reservation</span>
            <h2>Book Your Space</h2>
            <p>Our installations require careful logistics plotting. We recommend reserving 3-4 weeks prior to your event.</p>
            
            <div className="studio-contact-actions">
              <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer" className="action-button-wa">
                <RiWhatsappLine size={20} />
                <div>
                  <span className="lbl">Text Studio</span>
                  <span className="val">WhatsApp Consult</span>
                </div>
              </a>
              
              <a href={`tel:${settings.phone}`} className="action-button-tel">
                <RiPhoneLine size={20} />
                <div>
                  <span className="lbl">Call Designer</span>
                  <span className="val">{settings.phone}</span>
                </div>
              </a>
            </div>

            <div className="meta-studio-details">
              <p><span>Studio Location:</span> {settings.address}</p>
              <p><span>Hours of Care:</span> {settings.hours}</p>
            </div>
          </div>

          <div className="contact-map-side">
            <iframe
              title="FriendlyEcors Dallas Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d107134.62939225722!2d-96.8712759929285!3d32.82092928509172!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864c1e7f0b782b5d%3A0x673c683072224d45!2sDallas%2C%20TX!5e0!3m2!1sen!2sus!4v1715000000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
