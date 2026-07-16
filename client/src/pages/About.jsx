import React from 'react';
import { useSettings } from '../context/SettingsContext';
import './About.css';

const About = () => {
  const { settings } = useSettings();

  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="container">
          <span className="section-label">Our Story</span>
          <h1>About FriendlyEcors</h1>
          <p>We craft upscale, photogenic backdrops and organic balloon styling for the Dallas-Fort Worth DFW events community.</p>
        </div>
      </div>

      <section className="about-story-section section-padding container">
        <div className="story-grid">
          <div className="story-content">
            <span className="section-label">Aesthetic Standards</span>
            <h2>Sophisticated Decor Handcrafted in Dallas</h2>
            <p>
              Founded with a passion for modern styling, FriendlyEcors began with a single flower wall and a desire to bypass generic, plastic event decor. Today, we supply custom-built arches, aesthetic neon settings, and custom-styled props to families and event managers across DFW.
            </p>
            <p>
              We operate under the philosophy that event decor should not feel temporary or synthetic. Our team sources realistic touch silk roses, sturdy metal frames, and biodegradable balloons, assembling them on-site with meticulous care.
            </p>
            <div className="mission-vision-box">
              <div className="mission-item">
                <h3>Our Mission</h3>
                <p>To deliver modern, premium event backdrops and installations, handling the logistical stress so you can focus entirely on celebration.</p>
              </div>
              <div className="mission-item">
                <h3>Our Vision</h3>
                <p>To lead luxury rental decor styling in Dallas, promoting sustainable materials and bespoke client interactions.</p>
              </div>
            </div>
          </div>
          <div className="story-image-panel">
            <img
              src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800"
              alt="Dallas Premium Event Props Setup"
              className="about-story-img"
            />
          </div>
        </div>
      </section>

      {/* Core Values / Why Us */}
      <section className="about-values-section section-padding">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-label">Design Ethos</span>
            <h2>Our Core Principles</h2>
          </div>

          <div className="values-grid">
            <div className="value-card">
              <span className="val-number">01</span>
              <h3>Quality First</h3>
              <p>We inspect every prop, wash all flower walls, and test neon light outputs before every delivery. Quality is our trademark.</p>
            </div>
            <div className="value-card">
              <span className="val-number">02</span>
              <h3>Tailored Concepts</h3>
              <p>No two events are identical. We adjust sizes, floral densities, and color tones to seamlessly align with your venue.</p>
            </div>
            <div className="value-card">
              <span className="val-number">03</span>
              <h3>DFW Local Care</h3>
              <p>We are a family-owned business in Dallas. We understand the community, climate, and venue restrictions locally.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
