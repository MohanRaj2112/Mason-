import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export const CartSidebar = () => {
  const { cart, isCartOpen, closeCart, updateCartQty, removeFromCart, totalDailyRent, totalCount } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleProceedBooking = () => {
    closeCart();
    navigate('/booking?type=tools');
  };

  return (
    <>
      <div className="cart-backdrop active" onClick={closeCart} />
      <div className="cart-sidebar active" id="cartSidebar">
        <div className="cart-header">
          <div className="flex gap-8" style={{ alignItems: 'center' }}>
            <span style={{ fontSize: '1.4rem' }}>🛒</span>
            <div>
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Rental Equipment Cart</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {totalCount} item{totalCount !== 1 ? 's' : ''} selected
              </span>
            </div>
          </div>
          <button className="cart-close" onClick={closeCart} title="Close Cart">✕</button>
        </div>

        <div className="cart-items" id="cartItems">
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🛒</div>
              <p style={{ fontWeight: 600, marginBottom: '8px' }}>Your rental cart is empty</p>
              <p style={{ fontSize: '0.85rem' }}>Browse our heavy machinery and professional power tools catalog.</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item._id} className="cart-item">
                <div style={{ fontSize: '2rem', flexShrink: 0 }}>{item.icon || '🔨'}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.name}
                  </h4>
                  <div style={{ fontSize: '0.82rem', color: 'var(--accent)', fontWeight: 700 }}>
                    ₹{item.price}/day
                  </div>
                  <div className="cart-qty-ctrl" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                    <button
                      onClick={() => updateCartQty(item._id, -1)}
                      style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid var(--border-light)', background: '#fff', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      -
                    </button>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.qty || 1}</span>
                    <button
                      onClick={() => updateCartQty(item._id, 1)}
                      style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid var(--border-light)', background: '#fff', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item._id)}
                  style={{ background: 'transparent', border: 'none', color: '#DC2626', cursor: 'pointer', fontSize: '1rem', padding: '4px' }}
                  title="Remove"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="flex justify-between" style={{ marginBottom: '8px', fontSize: '0.9rem' }}>
              <span>Daily Equipment Rent:</span>
              <strong style={{ color: 'var(--primary)' }}>₹{totalDailyRent.toLocaleString('en-IN')}/day</strong>
            </div>
            <div className="flex justify-between" style={{ marginBottom: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>Delivery &amp; On-Site Support:</span>
              <span>Calculated at checkout</span>
            </div>
            <button className="btn btn-accent btn-full btn-lg" onClick={handleProceedBooking}>
              📅 Proceed to Site Booking →
            </button>
          </div>
        )}
      </div>
    </>
  );
};
