// PriceBreakdown.jsx - Memoized Price Display Component
import React, { memo } from 'react';

const PriceBreakdown = memo(({ subtotal, tax, total }) => {
  return (
    <>
      <div className="cart-summary-row">
        <span>Subtotal</span> 
        <span>₹{subtotal.toFixed(2)}</span>
      </div>
      
      <div className="cart-summary-row">
        <span>Shipping Fee</span>
        <span className="cart-summary-free">FREE</span>
      </div>
      
      <div className="cart-summary-row">
        <span>Tax (2%)</span>
        <span>₹{tax.toFixed(2)}</span>
      </div>
      
      <div className="cart-summary-divider"></div>
      
      <div className="cart-summary-row cart-summary-total">
        <span>Total Amount:</span>
        <span>₹{total.toFixed(2)}</span>
      </div>
    </>
  );
});

PriceBreakdown.displayName = 'PriceBreakdown';

export default PriceBreakdown;