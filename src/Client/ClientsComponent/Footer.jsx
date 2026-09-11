import React from "react";
import "./Footer.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { assets } from "../../assets/assets";

const ComingSoonLink = ({ children }) => {
  const handleClick = (e) => {
    e.preventDefault();
    toast("Coming soon!", { icon: "🚧" });
  };
  return (
    <a href="#" className="footer-link" onClick={handleClick}>
      {children}
    </a>
  );
};

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToBestSellers = (e) => {
    e.preventDefault();
    if (location.pathname === "/") {
      document.getElementById("bestsellers")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/#bestsellers");
    }
  };

  return (
    <footer className="footer">
      <div className="container py-4">
        <div className="row g-4">
          {/* Brand Section */}
          <div className="col-lg-4 col-md-6">
            <div className="footer-brand mb-3">
              <h2 className="brand-name mb-2">
                <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
                  <img src={assets.logo} alt="GreenCards logo" className="navbar-logo" />
                  <span className="navbar-brand-text">GreenCards</span>
                </Link>
              </h2>
              <p className="footer-description">
                We deliver fresh groceries and snacks straight to your door.
                Trusted by thousands, we aim to make your shopping experience
                simple and affordable.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 col-6">
            <div className="footer-links">
              <h5 className="footer-heading mb-3">Quick Links</h5>
              <ul className="list-unstyled">
                <li>
                  <Link to="/" className="footer-link">
                    Home
                  </Link>
                </li>
                <li>
                  <a href="#bestsellers" className="footer-link" onClick={scrollToBestSellers}>
                    Best Sellers
                  </a>
                </li>
                <li>
                  <Link to="/flash-sale" className="footer-link">
                    Offers & Deals
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="footer-link">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <ComingSoonLink>FAQs</ComingSoonLink>
                </li>
              </ul>
            </div>
          </div>

          {/* Need Help */}
          <div className="col-lg-3 col-md-6 col-6">
            <div className="footer-links">
              <h5 className="footer-heading mb-3">Need help?</h5>
              <ul className="list-unstyled">
                <li>
                  <ComingSoonLink>Delivery Information</ComingSoonLink>
                </li>
                <li>
                  <ComingSoonLink>Return & Refund Policy</ComingSoonLink>
                </li>
                <li>
                  <ComingSoonLink>Payment Methods</ComingSoonLink>
                </li>
                <li>
                  <Link to="/my-orders" className="footer-link">
                    Track your Order
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="footer-link">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Follow Us */}
          <div className="col-lg-3 col-md-6">
            <div className="footer-social">
              <h5 className="footer-heading mb-3">Follow Us</h5>
              <ul className="list-unstyled">
                <li>
                  <a
                    href="https://instagram.com"
                    className="footer-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com"
                    className="footer-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="https://facebook.com"
                    className="footer-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="https://youtube.com"
                    className="footer-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    YouTube
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="footer-divider my-4" />

        {/* Copyright */}
        <div className="row">
          <div className="col-12">
            <p className="footer-copyright text-center mb-0">
              Copyright 2026 © GreenCards. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;