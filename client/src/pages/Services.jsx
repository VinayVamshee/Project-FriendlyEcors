import React from 'react';
import { RiPaintBrushLine, RiTruckLine, RiHammerLine, RiMessage2Line } from 'react-icons/ri';
import { useSettings } from '../context/SettingsContext';
import './Services.css';

const Services = () => {
  const { settings } = useSettings();

  return (
    <div className="services-page">
      <div className="services-hero">
        <div className="container">
          <span className="section-label">What We Do</span>
          <h1>Our Event Decoration Services</h1>
          <p>We provide full-service styling, premium prop rentals, and custom decor setups in the Dallas-Fort Worth region.</p>
        </div>
      </div>

      {/* Services Breakdown */}
      <section className="services-list-section section-padding container">
        <div className="services-grid">
          <div className="service-detail-card">
            <div className="icon-box"><RiHammerLine size={28} /></div>
            <h2>Home Decor Rentals</h2>
            <p>
              Browse our premium collection of flower walls, LED neon signs, modern backdrops, table styling elements, and balloon garlands. Rent individual pieces to complement your layout, or pair multiple items for a high-impact photo zone.
            </p>
            <p className="sub-text">Includes basic instructions and mounting weights where applicable.</p>
          </div>

          <div className="service-detail-card">
            <div className="icon-box"><RiPaintBrushLine size={28} /></div>
            <h2>On-Site Custom Styling</h2>
            <p>
              Our professional design team works with you to coordinate color schemes, floral textures, and balloon placement. On the day of your celebration, we handle complete decoration assembly, secure alignments, and final touches.
            </p>
            <p className="sub-text">Best for weddings, milestone birthdays, and corporate events.</p>
          </div>

          <div className="service-detail-card">
            <div className="icon-box"><RiTruckLine size={28} /></div>
            <h2>Delivery & Tear Down</h2>
            <p>
              Skip the transport logistics. We coordinate direct delivery to your Dallas venue or residence, assemble the backdrops securely, and return at the end of your rental period to dismantle and retrieve the items.
            </p>
            <p className="sub-text">DFW-wide service. Delivery rates computed by travel mileage.</p>
          </div>

          <div className="service-detail-card">
            <div className="icon-box"><RiMessage2Line size={28} /></div>
            <h2>Decoration Consultations</h2>
            <p>
              Unsure about backdrop dimensions or floral compatibility? Connect directly with our lead designer. Send us venue snapshots and reference Pinterest boards, and we will advise on the best configurations to fit your space.
            </p>
            <p className="sub-text">Complimentary consultation via phone call or WhatsApp message.</p>
          </div>
        </div>
      </section>

      {/* Booking Process Block */}
      <section className="booking-process-section section-padding">
        <div className="container text-center">
          <span className="section-label">Step-by-Step</span>
          <h2>Our Simple Booking Process</h2>
          <p className="proc-desc">Because our rentals are premium and calendar slots fill quickly, we handle reservations manually to provide bespoke care.</p>
          
          <div className="process-flow-grid">
            <div className="process-step">
              <span className="step-num">01</span>
              <h3>Browse Catalog</h3>
              <p>Explore our rental items and pricing details on our website.</p>
            </div>
            <div className="process-step">
              <span className="step-num">02</span>
              <h3>Connect with Us</h3>
              <p>WhatsApp or Call us with your items list, date, and venue location.</p>
            </div>
            <div className="process-step">
              <span className="step-num">03</span>
              <h3>Confirm & Reserve</h3>
              <p>Receive your quote, sign the agreement, and secure your event date.</p>
            </div>
            <div className="process-step">
              <span className="step-num">04</span>
              <h3>Setup & Styling</h3>
              <p>Our team arrives at the scheduled time to transform your space.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="services-cta-section section-padding container">
        <div className="service-cta-card">
          <h2>Have a custom concept in mind?</h2>
          <p>We love creating unique setups tailored to your specific color codes and design themes.</p>
          <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn-whatsapp-services">
            WhatsApp Inquiry
          </a>
        </div>
      </section>
    </div>
  );
};

export default Services;
