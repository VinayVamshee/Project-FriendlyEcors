import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  RiWhatsappLine, RiSunLine, RiMoonLine, RiMenu4Line, RiCloseLine,
  RiHome5Line, RiStore2Line, RiGalleryLine, RiCustomerService2Line, RiQuestionAnswerLine 
} from 'react-icons/ri';
import { useSettings } from '../context/SettingsContext';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { settings, theme, toggleTheme } = useSettings();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);



  return (
    <nav className={`navbar-wrapper ${scrolled ? 'scrolled' : ''}`}>
      <div className={`navbar-inner glass-effect container`}>
        <Link to="/" className="navbar-logo">
          Friendly<span>Ecors</span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
          <Link to="/products" className={`nav-link ${location.pathname === '/products' ? 'active' : ''}`}>Rentals</Link>
          <Link to="/gallery" className={`nav-link ${location.pathname === '/gallery' ? 'active' : ''}`}>Gallery</Link>
          <Link to="/services" className={`nav-link ${location.pathname === '/services' ? 'active' : ''}`}>Services</Link>
          <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>About</Link>
          <Link to="/faq" className={`nav-link ${location.pathname === '/faq' ? 'active' : ''}`}>FAQ</Link>
        </div>

        <div className="navbar-actions">
          {/* Light/Dark mode switcher */}
          <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === 'dark' ? <RiSunLine size={20} /> : <RiMoonLine size={20} />}
          </button>

          <a
            href={`https://wa.me/${settings.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="navbar-whatsapp-cta"
          >
            <RiWhatsappLine size={16} />
            <span>Consultation</span>
          </a>

          <button className="navbar-mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <RiCloseLine size={22} /> : <RiMenu4Line size={22} />}
          </button>
        </div>
      </div>

      {/* Floating Glass mobile menu panel */}
      <div className={`navbar-mobile-overlay glass-effect ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-links">
          <Link to="/">Home</Link>
          <Link to="/products">Rentals</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/services">Services</Link>
          <Link to="/about">About</Link>
          <Link to="/faq">FAQ</Link>
          <a
            href={`https://wa.me/${settings.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-cta-btn"
          >
            <RiWhatsappLine size={18} />
            <span>WhatsApp Direct</span>
          </a>
        </div>
      </div>

      {/* Floating Glass Bottom Nav Bar for Mobile Screens */}
      <div className="navbar-bottom-bar glass-effect">
        <Link to="/" className={`bottom-nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          <RiHome5Line size={20} />
          <span>Home</span>
        </Link>
        <Link to="/products" className={`bottom-nav-item ${location.pathname === '/products' ? 'active' : ''}`}>
          <RiStore2Line size={20} />
          <span>Rentals</span>
        </Link>
        <Link to="/gallery" className={`bottom-nav-item ${location.pathname === '/gallery' ? 'active' : ''}`}>
          <RiGalleryLine size={20} />
          <span>Gallery</span>
        </Link>
        <Link to="/services" className={`bottom-nav-item ${location.pathname === '/services' ? 'active' : ''}`}>
          <RiCustomerService2Line size={20} />
          <span>Services</span>
        </Link>
        <Link to="/faq" className={`bottom-nav-item ${location.pathname === '/faq' ? 'active' : ''}`}>
          <RiQuestionAnswerLine size={20} />
          <span>FAQ</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
