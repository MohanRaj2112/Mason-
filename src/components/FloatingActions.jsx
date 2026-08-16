import React, { useState, useEffect } from 'react';

export const FloatingActions = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openWhatsApp = () => {
    const phone = '919159687408';
    const text = encodeURIComponent('Hello Mason Mate, I would like to inquire about residential construction and equipment rentals.');
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <div className="floating-actions" style={{ position: 'fixed', bottom: '24px', right: '24px', display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 990 }}>
        {/* WhatsApp Button */}
        <button
          onClick={openWhatsApp}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: '#25D366',
            color: 'white',
            border: 'none',
            fontSize: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)',
            transition: 'transform 0.2s'
          }}
          title="Chat on WhatsApp"
        >
          💬
        </button>

        {/* Scroll To Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="scroll-top visible"
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              fontSize: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-lg)'
            }}
            title="Scroll to top"
          >
            ↑
          </button>
        )}
      </div>
    </>
  );
};
