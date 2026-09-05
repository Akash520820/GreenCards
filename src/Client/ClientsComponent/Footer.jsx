import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";

const Footer = () => {
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
                  <a href="#home" className="footer-link">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#bestsellers" className="footer-link">
                    Best Sellers
                  </a>
                </li>
                <li>
                  <a href="#offers" className="footer-link">
                    Offers & Deals
                  </a>
                </li>
                <li>
                  <a href="#contact" className="footer-link">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#faqs" className="footer-link">
                    FAQs
                  </a>
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
                  <a href="#delivery" className="footer-link">
                    Delivery Information
                  </a>
                </li>
                <li>
                  <a href="#return" className="footer-link">
                    Return & Refund Policy
                  </a>
                </li>
                <li>
                  <a href="#payment" className="footer-link">
                    Payment Methods
                  </a>
                </li>
                <li>
                  <a href="#track" className="footer-link">
                    Track your Order
                  </a>
                </li>
                <li>
                  <a href="#contact-us" className="footer-link">
                    Contact Us
                  </a>
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
