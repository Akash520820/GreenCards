import React from 'react';
import PasswordInput from './PasswordInput';

const SellerAuthForm = ({ 
  isLogin, 
  formData, 
  loading, 
  handleChange, 
  handleSubmit, 
  toggleMode 
}) => {
  return (
    <form onSubmit={handleSubmit}>
      {/* Name Field - Only for Signup */}
      {!isLogin && (
        <div className="auth-form-input-group">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className="auth-form-input"
            required
          />
        </div>
      )}

      {/* Email Field */}
      <div className="auth-form-input-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          className="auth-form-input"
          required
        />
      </div>

      {/* Password Field with Show/Hide Toggle */}
      <PasswordInput
        id="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Enter your password"
        label="Password"
        required
      />

      {/* Shop Name & Phone - Only for Signup */}
      {!isLogin && (
        <>
          <div className="auth-form-input-group">
            <label htmlFor="shopName">Shop Name</label>
            <input
              id="shopName"
              type="text"
              name="shopName"
              value={formData.shopName}
              onChange={handleChange}
              placeholder="Enter your shop name"
              className="auth-form-input"
              required
            />
          </div>

          <div className="auth-form-input-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="auth-form-input"
              required
            />
          </div>
        </>
      )}

      {/* Toggle Text */}
      <div className="auth-form-toggle-text">
        {isLogin ? (
          <>
            Don't have an account?{' '}
            <button 
              type="button" 
              className="auth-form-toggle-link" 
              onClick={toggleMode}
            >
              Sign up here
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button 
              type="button" 
              className="auth-form-toggle-link" 
              onClick={toggleMode}
            >
              Login here
            </button>
          </>
        )}
      </div>

      {/* Submit Button */}
      <button 
        type="submit" 
        className="auth-form-submit-btn"
        disabled={loading}
      >
        {loading ? 'Please wait…' : (isLogin ? 'Login' : 'Create Account')}
      </button>
    </form>
  );
};

export default SellerAuthForm;