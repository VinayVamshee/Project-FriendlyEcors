import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { RiWhatsappLine, RiPhoneLine, RiCalendarCheckLine, RiTruckLine, RiFileList2Line } from 'react-icons/ri';
import { useSettings, API_BASE_URL } from '../context/SettingsContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const { settings } = useSettings();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/products/${id}`);
        const result = await res.json();
        
        if (result.success && result.data) {
          setProduct(result.data);
          setActiveImageIdx(0);
          
          // Fetch related products in same category
          const categoryId = result.data.category?._id || result.data.category;
          const relatedRes = await fetch(`${API_BASE_URL}/products?category=${result.data.category?.slug || ''}`);
          const relatedResult = await relatedRes.json();
          if (relatedResult.success) {
            // Exclude current product
            setRelatedProducts(relatedResult.data.filter(p => p._id !== id).slice(0, 3));
          }
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="product-detail-loading">
        <p>Loading curated product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-error container">
        <h2>Product Not Found</h2>
        <p>We couldn't locate this item in our catalog.</p>
        <Link to="/products" className="btn-back">Return to Rentals</Link>
      </div>
    );
  }

  return (
    <div className="product-detail-page container">
      {/* Back button */}
      <Link to="/products" className="back-link-btn">&larr; Back to Rentals</Link>

      <div className="product-detail-grid">
        {/* Gallery Column */}
        <div className="detail-gallery-column">
          <div className="main-image-viewport">
            <img src={product.images[activeImageIdx]} alt={product.title} />
          </div>
          {product.images.length > 1 && (
            <div className="thumbnail-list">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  className={`thumb-btn ${idx === activeImageIdx ? 'active' : ''}`}
                  onClick={() => setActiveImageIdx(idx)}
                >
                  <img src={img} alt={`Preview ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info Column */}
        <div className="detail-info-column">
          <span className="info-cat">{product.category?.name}</span>
          <h1>{product.title}</h1>
          <p className="info-price">${product.price} <span className="duration">/ {product.duration} rental</span></p>

          <div className="info-description">
            <p>{product.description}</p>
          </div>

          {/* Sizing & Dimensions */}
          {product.dimensions && (
            <div className="info-spec-row">
              <span className="spec-label">Dimensions:</span>
              <span className="spec-value">{product.dimensions}</span>
            </div>
          )}

          {/* Included Items list */}
          {product.included && product.included.length > 0 && (
            <div className="info-included-section">
              <h3>What's Included:</h3>
              <ul>
                {product.included.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Booking / Details guidelines */}
          <div className="info-features-cards">
            <div className="feature-card-item">
              <RiCalendarCheckLine size={20} className="icon" />
              <div>
                <h4>Manually Styled & Setup</h4>
                <p>Includes complete assembly, structural positioning, and secure lockweights.</p>
              </div>
            </div>
            <div className="feature-card-item">
              <RiTruckLine size={20} className="icon" />
              <div>
                <h4>Dallas Delivery Area</h4>
                <p>We deliver and tear down setups across DFW. Delivery fees vary based on location.</p>
              </div>
            </div>
          </div>

          {/* Booking CTAs */}
          <div className="booking-cta-box">
            <h3>Ready to reserve this prop?</h3>
            <p>Direct bookings are handled manually on WhatsApp or Phone to verify date availability.</p>
            <div className="cta-buttons-container">
              <a
                href={`https://wa.me/${settings.whatsapp}?text=Hi! I would like to inquire about availability for renting the "${encodeURIComponent(product.title)}" for an event.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp-booking"
              >
                <RiWhatsappLine size={22} />
                <span>Inquire on WhatsApp</span>
              </a>
              <a href={`tel:${settings.phone}`} className="btn-phone-booking">
                <RiPhoneLine size={20} />
                <span>Call Studio</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="related-products-section">
          <h2>Related Collections</h2>
          <div className="products-grid">
            {relatedProducts.map((prod) => (
              <div key={prod._id} className="product-card">
                <div className="prod-img-wrapper">
                  <img src={prod.images[0]} alt={prod.title} />
                </div>
                <div className="prod-info">
                  <span className="prod-cat">{prod.category?.name}</span>
                  <h3>{prod.title}</h3>
                  <p className="prod-price">${prod.price} <span className="duration">/ {prod.duration}</span></p>
                  <div className="prod-actions">
                    <Link to={`/products/${prod._id}`} className="btn-view-details">View Details</Link>
                    <a
                      href={`https://wa.me/${settings.whatsapp}?text=Hi! I am interested in renting the ${encodeURIComponent(prod.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-whatsapp-icon"
                      aria-label="Inquire on WhatsApp"
                    >
                      <RiWhatsappLine size={20} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
