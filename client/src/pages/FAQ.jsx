import React, { useState } from 'react';
import { RiAddLine, RiSubtractLine } from 'react-icons/ri';
import { useSettings } from '../context/SettingsContext';
import './FAQ.css';

const FAQ = () => {
  const { settings } = useSettings();
  const [openIdx, setOpenIdx] = useState(null);

  const faqs = [
    {
      q: 'How does the rental process work?',
      a: 'Browse our online catalog to view pricing and dimensions. Once you identify the props you want, click "Inquire on WhatsApp" or call us to confirm date availability for your location. We will send over a custom proposal and agreement to finalize your booking manually.'
    },
    {
      q: 'Is setup and installation included in the price?',
      a: 'Yes, for backdrops, flower walls, and larger installations, setup and assembly on-site are included in the rental price to ensure they are safely weighted and positioned. Delivery costs are calculated separately based on DFW venue distance.'
    },
    {
      q: 'Do you deliver outside of the Dallas area?',
      a: 'We primary serve the Dallas-Fort Worth metroplex (including Plano, Frisco, McKinney, Fort Worth, Arlington, and surrounding cities). If your event is outside this zone, please contact us directly, and we will check schedule feasibility.'
    },
    {
      q: 'How far in advance should I book?',
      a: 'We recommend booking at least 2-4 weeks in advance, especially for weekend events during peak seasons (spring and fall). However, feel free to call us for last-minute bookings as we will always try our best to accommodate you.'
    },
    {
      q: 'What is your cancellation and deposit policy?',
      a: 'We require a 50% non-refundable booking deposit to reserve your dates and secure props in our calendar. The remaining balance is due 7 days before your scheduled setup. Cancellations made within 7 days of the event are subject to full rental billing.'
    },
    {
      q: 'Can I request custom balloon garland colors or floral adjustments?',
      a: 'Absolutely! Our balloon decorations are fully customized to match your theme. For flower walls and arches, we can incorporate specific colors or accents (like pampas grass, green eucalyptus, or custom neon signage) for an additional custom design fee.'
    }
  ];

  const toggleFAQ = (idx) => {
    if (openIdx === idx) {
      setOpenIdx(null);
    } else {
      setOpenIdx(idx);
    }
  };

  return (
    <div className="faq-page">
      <div className="faq-hero">
        <div className="container">
          <span className="section-label">Questions & Answers</span>
          <h1>Frequently Asked Questions</h1>
          <p>Everything you need to know about our home decor rentals, setups, and manual booking flow.</p>
        </div>
      </div>

      <section className="faq-main section-padding container">
        <div className="faq-grid-layout">
          <div className="faq-intro-sidebar">
            <h2>Need immediate assistance?</h2>
            <p>If you don't find the answer you need here, please feel free to reach out directly. We are happy to walk you through our services.</p>
            <div className="sidebar-contact-card">
              <p><strong>Call Us:</strong> {settings.phone}</p>
              <p><strong>Hours:</strong> {settings.hours}</p>
              <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer" className="sidebar-wa-btn">
                Inquire on WhatsApp
              </a>
            </div>
          </div>

          <div className="faq-accordion-panel">
            {faqs.map((faq, idx) => (
              <div key={idx} className={`faq-accordion-item ${openIdx === idx ? 'open' : ''}`}>
                <button className="faq-question-btn" onClick={() => toggleFAQ(idx)}>
                  <span>{faq.q}</span>
                  {openIdx === idx ? <RiSubtractLine size={20} className="icon-gold" /> : <RiAddLine size={20} />}
                </button>
                <div className="faq-answer-container">
                  <div className="faq-answer-content">
                    <p>{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
