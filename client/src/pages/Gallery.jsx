import React, { useState, useEffect } from 'react';
import { RiCloseLine, RiArrowLeftSLine, RiArrowRightSLine, RiMapPinLine, RiCalendarLine } from 'react-icons/ri';
import { API_BASE_URL } from '../context/SettingsContext';
import './Gallery.css';

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [lightboxIdx, setLightboxIdx] = useState(null);
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
    const fetchGallery = async () => {
      setLoading(true);
      try {
        let url = `${API_BASE_URL}/gallery`;
        if (activeCategory) {
          url += `?category=${activeCategory}`;
        }
        const res = await fetch(url);
        const result = await res.json();
        if (result.success) setGalleryItems(result.data);
      } catch (err) {
        console.error('Error fetching gallery:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, [activeCategory]);

  const openLightbox = (index) => {
    setLightboxIdx(index);
    document.body.style.overflow = 'hidden'; // Lock scrolling
  };

  const closeLightbox = () => {
    setLightboxIdx(null);
    document.body.style.overflow = 'auto'; // Unlock scrolling
  };

  const navigateLightbox = (direction) => {
    if (lightboxIdx === null) return;
    
    let nextIdx = lightboxIdx + direction;
    if (nextIdx < 0) nextIdx = galleryItems.length - 1;
    if (nextIdx >= galleryItems.length) nextIdx = 0;
    
    setLightboxIdx(nextIdx);
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIdx === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIdx, galleryItems]);

  return (
    <div className="gallery-page">
      <div className="gallery-hero">
        <div className="container">
          <span className="section-label">Our Portfolios</span>
          <h1>Previous Work Gallery</h1>
          <p>Explore real-world events we have styled across Dallas-Fort Worth. Get inspired for your setup.</p>
        </div>
      </div>

      <div className="gallery-main container">
        {/* Category Filter Pill Bar */}
        <div className="gallery-filters-bar">
          <button
            className={`gallery-filter-pill ${activeCategory === '' ? 'active' : ''}`}
            onClick={() => setActiveCategory('')}
          >
            All Work
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              className={`gallery-filter-pill ${activeCategory === cat._id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat._id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Masonry Layout Grid */}
        {loading ? (
          <div className="gallery-loading">
            <p>Loading inspiration gallery...</p>
          </div>
        ) : galleryItems.length === 0 ? (
          <div className="gallery-empty">
            <p>No event setups in this category yet. Check back soon!</p>
          </div>
        ) : (
          <div className="gallery-masonry-grid">
            {galleryItems.map((item, idx) => (
              <div
                key={item._id}
                className="gallery-item-card"
                onClick={() => openLightbox(idx)}
              >
                <img src={item.imageUrl} alt={item.eventName} loading="lazy" />
                <div className="gallery-item-hover">
                  <div className="hover-info">
                    <span className="hover-cat">{item.category?.name}</span>
                    <h3>{item.eventName}</h3>
                    <p className="hover-loc">{item.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Overlay */}
      {lightboxIdx !== null && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox} aria-label="Close lightbox">
            <RiCloseLine size={32} />
          </button>

          <button className="lightbox-nav prev" onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }} aria-label="Previous image">
            <RiArrowLeftSLine size={36} />
          </button>

          <div className="lightbox-content-box" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-image-container">
              <img
                src={galleryItems[lightboxIdx].imageUrl}
                alt={galleryItems[lightboxIdx].eventName}
              />
            </div>
            <div className="lightbox-info-panel">
              <span className="info-cat">{galleryItems[lightboxIdx].category?.name}</span>
              <h2>{galleryItems[lightboxIdx].eventName}</h2>
              <div className="info-meta">
                <span className="meta-item">
                  <RiMapPinLine size={14} />
                  <span>{galleryItems[lightboxIdx].location}</span>
                </span>
                {galleryItems[lightboxIdx].date && (
                  <span className="meta-item">
                    <RiCalendarLine size={14} />
                    <span>{new Date(galleryItems[lightboxIdx].date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <button className="lightbox-nav next" onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }} aria-label="Next image">
            <RiArrowRightSLine size={36} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Gallery;
