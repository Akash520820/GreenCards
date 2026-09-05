import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSellerAuth } from '../../context/SellerAuthContext';
import SellerAuthHeader from '../../Seller/SellerComponent/SellerAuthHeader';
import SellerAuthForm from '../../Seller/SellerComponent/SellerAuthForm';
import ErrorMessage from '../../Seller/SellerComponent/ErrorMessage';
import './SellerAuthPage.css';

const SellerAuthPage = () => {
  const navigate = useNavigate();
  const { sellerLogin, sellerSignup } = useSellerAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    shopName: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Memoized change handler
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  }, []);

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;
      if (isLogin) {
        result = await sellerLogin(formData.email, formData.password);
      } else {
        result = await sellerSignup(
          formData.name,
          formData.email,
          formData.password,
          formData.shopName,
          formData.phone
        );
      }

      if (result.success) {
        navigate('/seller/dashboard');
      } else {
        setError(result.error || 'Authentication failed');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle between login and signup
  const toggleMode = useCallback(() => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      name: '',
      email: '',
      password: '',
      shopName: '',
      phone: ''
    });
  }, [isLogin]);

  return (
    <div className="seller-auth-page">
      <div className="seller-auth-container">
        <div className="seller-auth-content">
          {/* Header Component */}
          <SellerAuthHeader isLogin={isLogin} />

          {/* Error Message Component */}
          <ErrorMessage error={error} />

          {/* Form Component */}
          <SellerAuthForm 
            isLogin={isLogin}
            formData={formData}
            loading={loading}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            toggleMode={toggleMode}
          />
        </div>
      </div>
    </div>
  );
};

export default SellerAuthPage;