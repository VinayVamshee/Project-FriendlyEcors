import React from 'react';
import { Link } from 'react-router-dom';
import { RiInstagramLine, RiFacebookCircleLine, RiPhoneLine, RiWhatsappLine } from 'react-icons/ri';
import { useSettings } from '../context/SettingsContext';
import './Footer.css';

const Footer = () => {
  const { settings } = useSettings();

  return (
    <footer className="footer">
      <div className="footer-top container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            Friendly<span>Ecors</span>
          </Link>
          <p className="footer-desc">
            Premium home decor rentals and bespoke event design services based in Dallas, Texas. Elevate your milestones with our curated aesthetics.
          </p>
          <div className="footer-socials">
            <a href={`https://instagram.com/${settings.instagram}`} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <RiInstagramLine size={20} />
            </a>
            <a href={`https://facebook.com/${settings.facebook}`} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <RiFacebookCircleLine size={20} />
            </a>
          </div>
        </div>

        <div className="footer-links-col">
          <h4>Explore</h4>
          <Link to="/products">Rental Catalog</Link>
          <Link to="/gallery">Previous Work</Link>
          <Link to="/services">Event Services</Link>
        </div>

        <div className="footer-links-col">
          <h4>Client Care</h4>
          <Link to="/faq">FAQs</Link>
          <Link to="/faq#booking-process">Booking Flow</Link>
          <Link to="/admin">Admin Portal</Link>
        </div>

        <div className="footer-contact-col">
          <h4>Dallas Studio</h4>
          <p className="contact-item">
            <span className="contact-label">Location:</span> {settings.address}
          </p>
          <p className="contact-item">
            <span className="contact-label">Hours:</span> {settings.hours}
          </p>
          <div className="footer-contact-links">
            <a href={`tel:${settings.phone}`} className="contact-link">
              <RiPhoneLine size={16} />
              <span>{settings.phone}</span>
            </a>
            <a href={`https://wa.me/${settings.whatsapp}`} className="contact-link whatsapp">
              <RiWhatsappLine size={16} />
              <span>WhatsApp Chat</span>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom container">
        <p>&copy; {new Date().getFullYear()} FriendlyEcors. All Rights Reserved. Designed with refinement.</p>
      </div>
    </footer>
  );
};

export default Footer;
