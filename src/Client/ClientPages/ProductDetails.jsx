import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { useClientAuth } from '../../context/ClientAuthContext';
import AuthModal from '../ClientsComponent/LogInSignIn/AuthModal';
import toast, { Toaster } from 'react-hot-toast';
import './ProductDetails.css';

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { getProductById, getProductsByCategory } = useProducts();
  const { addToCart, cartItems } = useCart();
  const { isAuthenticated } = useClientAuth();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isInCart, setIsInCart] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const foundProduct = getProductById(productId);
    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedImage(0);
      
      // Get related products from same category
      const related = getProductsByCategory(foundProduct.category)
        .filter(p => p._id !== productId)
        .slice(0, 4);
      setRelatedProducts(related);
    } else {
      navigate('/AllProduct');
    }
  }, [productId, getProductById, navigate]);

  useEffect(() => {
    if (product) {
      const inCart = cartItems.some(item => item._id === product._id);
      setIsInCart(inCart);
    }
  }, [cartItems, product]);

  if (!product) {
    return (
      <div className="pd-loading">
        <div className="pd-spinner"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  const discountPercentage = product.offerPrice 
    ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
    : 0;

  const currentPrice = product.offerPrice || product.price;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    if (isInCart) {
      navigate('/cart');
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }

    toast.success(`${product.name} added to cart!`, {
      duration: 2000,
      position: 'top-center',
      style: {
        background: '#48bb78',
        color: '#fff',
        padding: '16px',
        borderRadius: '8px',
      },
    });
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    if (!isInCart) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
    }
    navigate('/cart');
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleRelatedProductClick = (relatedProductId) => {
    navigate(`/product/${relatedProductId}`);
  };

  return (
    <>
      <Toaster />
      <div className="pd-page">
        <div className="container">
          

          {/* Product Details Section */}
          <div className="pd-container">
            {/* Image Gallery */}
            <div className="pd-gallery">
              <div className="pd-main-image">
                <img 
                  src={product.image[selectedImage]} 
                  alt={product.name}
                />
                {discountPercentage > 0 && (
                  <span className="pd-discount-badge">{discountPercentage}% OFF</span>
                )}
              </div>
              <div className="pd-thumbnail-images">
                {product.image.map((img, index) => (
                  <div 
                    key={index}
                    className={`pd-thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={img} alt={`${product.name} ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="pd-info">
              <div className="pd-category">{product.category}</div>
              <h1 className="pd-name">{product.name}</h1>
              
              {/* Rating */}
              <div className="pd-rating">
                {[...Array(4)].map((_, index) => (
                  <svg key={index} width="20" height="20" viewBox="0 0 24 24" fill="#48bb78">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#e2e8f0">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span className="pd-rating-count">(4.0) · 124 Reviews</span>
              </div>

              {/* Price */}
              <div className="pd-price-section">
                <div className="pd-price-row">
                  <span className="pd-current-price">₹{currentPrice}</span>
                  {product.offerPrice && (
                    <>
                      <span className="pd-original-price">₹{product.price}</span>
                      <span className="pd-save-amount">Save ₹{product.price - product.offerPrice}</span>
                    </>
                  )}
                </div>
                <p className="pd-tax-info">Inclusive of all taxes</p>
              </div>

              {/* Stock Status */}
              <div className="pd-stock-status">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#48bb78" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <span>In Stock</span>
              </div>

              {/* Quantity Selector */}
              <div className="pd-quantity-section">
                <label>Quantity:</label>
                <div className="pd-quantity-controls">
                  <button 
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </button>
                  <span className="pd-quantity-value">{quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 10}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19"/>
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pd-actions">
                <button 
                  className={`pd-add-to-cart-btn ${isInCart ? 'in-cart' : ''}`}
                  onClick={handleAddToCart}
                >
                  {isInCart ? (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                      </svg>
                      Go to Cart
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="9" cy="21" r="1"/>
                        <circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                      </svg>
                      Add to Cart
                    </>
                  )}
                </button>
                <button className="pd-buy-now-btn" onClick={handleBuyNow}>
                  Buy Now
                </button>
              </div>

              {/* Features */}
              <div className="pd-features">
                <div className="pd-feature-item">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#48bb78" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <span>100% Authentic</span>
                </div>
                <div className="pd-feature-item">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#48bb78" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span>Fast Delivery</span>
                </div>
                <div className="pd-feature-item">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#48bb78" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>Quality Assured</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Description */}
          <div className="pd-description-section">
            <h2>Product Description</h2>
            <div className="pd-description-content">
              {product.description && product.description.length > 0 ? (
                <ul>
                  {product.description.map((desc, index) => (
                    <li key={index}>{desc}</li>
                  ))}
                </ul>
              ) : (
                <p>This is a premium quality {product.name} from the {product.category} category. Perfect for your daily needs.</p>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="pd-related-section">
              <h2>Related Products</h2>
              <div className="pd-related-grid">
                {relatedProducts.map((relatedProduct) => {
                  const relatedDiscount = relatedProduct.offerPrice 
                    ? Math.round(((relatedProduct.price - relatedProduct.offerPrice) / relatedProduct.price) * 100)
                    : 0;

                  return (
                    <div 
                      key={relatedProduct._id} 
                      className="pd-related-card"
                      onClick={() => handleRelatedProductClick(relatedProduct._id)}
                    >
                      <div className="pd-related-image">
                        <img src={relatedProduct.image[0]} alt={relatedProduct.name} />
                        {relatedDiscount > 0 && (
                          <span className="pd-related-discount-badge">{relatedDiscount}% OFF</span>
                        )}
                      </div>
                      <div className="pd-related-info">
                        <p className="pd-related-category">{relatedProduct.category}</p>
                        <h3 className="pd-related-name">{relatedProduct.name}</h3>
                        <div className="pd-related-price">
                          <span className="pd-related-current-price">₹{relatedProduct.offerPrice || relatedProduct.price}</span>
                          {relatedProduct.offerPrice && (
                            <span className="pd-related-original-price">₹{relatedProduct.price}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <AuthModal 
        show={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        pendingProduct={product}
      />
    </>
  );
};

export default ProductDetails;