import React, { useState } from 'react';
import ProductCard from './ProductCard';
import AuthModal from './LogInSignIn/AuthModal';
import { useProducts } from '../../context/ProductContext';
import './BestSeller.css';

const BestSeller = () => {
  const { getAvailableProducts, loading } = useProducts();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingProduct, setPendingProduct] = useState(null);

  const bestSellers = getAvailableProducts().slice(0, 8);

  const handleLoginRequired = (product) => {
    setPendingProduct(product);
    setShowAuthModal(true);
  };

  const handleCloseModal = () => {
    setShowAuthModal(false);
    // Don't clear pending product immediately - let AuthModal handle it
  };

  if (!loading && bestSellers.length === 0) {
    return null;
  }

  return (
    <>
      <div className="bestseller-section">
        <div className="container">
          <h2 className="bestseller-title">Best Sellers</h2>
          
          <div className="bestseller-grid">
            {bestSellers.map((product) => (
              <ProductCard 
                key={product._id} 
                product={product}
                onLoginRequired={handleLoginRequired}
              />
            ))}
          </div>
        </div>
      </div>

      <AuthModal 
        show={showAuthModal} 
        onClose={handleCloseModal}
        pendingProduct={pendingProduct}
        onProductAdded={() => setPendingProduct(null)}
      />
    </>
  );
};

export default BestSeller;