import React, { useState } from "react";
import { GiShoppingCart } from "react-icons/gi";
import { Link } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import { useClientAuth } from "../../../context/ClientAuthContext";
import AuthModal from "../LogInSignIn/AuthModal";
import "./CartBadge.css";

const CartBadge = () => {
  const { getTotalItems } = useCart();
  const { isAuthenticated } = useClientAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const cartCount = getTotalItems();

  const handleCartClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setShowAuthModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowAuthModal(false);
  };

  return (
    <>
      <Link 
        to="/cart" 
        className="position-relative text-decoration-none"
        onClick={handleCartClick}
      >
        <GiShoppingCart color="green" size={31} />
        {cartCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill cartcount">
            {cartCount}
          </span>
        )}
      </Link>

      <AuthModal 
        show={showAuthModal} 
        onClose={handleCloseModal}
        redirectTo="/cart"
      />
    </>
  );
};

export default CartBadge;