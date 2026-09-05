// ProductCard.jsx - Updated with click navigation
import React, { useState, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 Add this
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useClientAuth } from '../../context/ClientAuthContext';
import './ProductCard.css';

const ProductCard = memo(({ product, onLoginRequired }) => {
  const navigate = useNavigate(); // 👈 Add this
  const { addToCart, cartItems } = useCart();
  const { isAuthenticated } = useClientAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  // Check if product is in cart
  useEffect(() => {
    const inCart = cartItems.some(item => item._id === product._id);
    setIsInCart(inCart);
  }, [cartItems, product._id]);

  const handleAddToCart = (e) => {
    e.stopPropagation(); // 👈 Prevent card click when clicking button
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Trigger login modal with this product
      if (onLoginRequired) {
        onLoginRequired(product);
      }
      return;
    }

    if (isInCart) return; // Don't add if already in cart
    
    setIsAdding(true);
    addToCart(product);
    
    // Reset button state after animation
    setTimeout(() => {
      setIsAdding(false);
    }, 600);
  };

  // 👈 Add click handler to navigate to product details
  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  const discountPercentage = product.offerPrice 
    ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
    : 0;

  return (
    <motion.div
      className="product-card-bestseller"
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      role="link"
      tabIndex={0}
      aria-label={`View ${product.name}`}
      style={{ cursor: 'pointer' }}
      whileHover={{ y: -6, boxShadow: '0 12px 24px rgba(0,0,0,0.12)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="product-card-image-container">
        <img 
          src={product.image[0]} 
          alt={product.name} 
          className="product-card-image"
        />
        {discountPercentage > 0 && (
          <span className="product-card-discount-badge">
            {discountPercentage}% OFF
          </span>
        )}
        {isInCart && (
          <div className="product-card-in-cart-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
            Added
          </div>
        )}
      </div>
      
      <div className="product-card-content">
        <p className="product-card-category">{product.category}</p>
        <h3 className="product-card-name">{product.name}</h3>
        
        {/* Star Rating */}
        <div className="product-card-rating" aria-hidden="true">
          {[...Array(4)].map((_, index) => (
            <svg 
              key={index} 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="#48bb78"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          ))}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#e2e8f0">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span className="product-card-rating-count">(4)</span>
        </div>
        
        <div className="product-card-footer">
          <div className="product-card-pricing">
            {product.offerPrice ? (
              <>
                <span className="product-card-price-offer">₹{product.offerPrice}</span>
                <span className="product-card-price-original">₹{product.price}</span>
              </>
            ) : (
              <span className="product-card-price-offer">₹{product.price}</span>
            )}
          </div>
          
          <button 
            className={`product-card-add-btn ${isAdding ? 'adding' : ''} ${isInCart ? 'in-cart' : ''}`}
            onClick={handleAddToCart} // 👈 Updated to use new handler with stopPropagation
            disabled={isAdding || isInCart}
          >
            {isInCart ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
                Added
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"/>
                  <circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                {isAdding ? 'Adding…' : 'Add'}
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;