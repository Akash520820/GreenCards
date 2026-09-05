import React, { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import FormInput from './FormInput';
import AuthToggleText from './AuthToggleText';
import { useClientAuth } from '../../../context/ClientAuthContext';

const AuthForm = ({ isLogin, onToggleMode, onClose, onAuthSuccess, hasPendingProduct }) => {
  const { login, register, verifyOtp, resendOtp } = useClientAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    userName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Once registration sends an OTP, we switch into this step to collect it.
  const [awaitingOtp, setAwaitingOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleAvatarChange = (e) => {
    setAvatarFile(e.target.files[0] || null);
  };

  const resetForm = () => {
    setFormData({ fullName: '', userName: '', email: '', phone: '', password: '' });
    setAvatarFile(null);
    setAwaitingOtp(false);
    setOtp('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // The login field accepts either an email or a username
        const identifier = formData.email;
        const result = await login(identifier, formData.password);
        if (!result.success) {
          toast.error(result.error || 'Login failed');
          return;
        }
        resetForm();
        if (onAuthSuccess) {
          onAuthSuccess();
        } else {
          onClose();
        }
        return;
      }

      // Signup — step 1: send OTP
      if (!avatarFile) {
        toast.error('Please choose a profile photo to continue');
        return;
      }

      const payload = new FormData();
      payload.append('fullName', formData.fullName);
      payload.append('userName', formData.userName);
      payload.append('email', formData.email);
      payload.append('phone', formData.phone);
      payload.append('password', formData.password);
      payload.append('avatar', avatarFile);

      const result = await register(payload);
      if (!result.success) {
        toast.error(result.error || 'Registration failed');
        return;
      }

      toast.success('OTP sent to your email!');
      setPendingEmail(result.email || formData.email);
      setAwaitingOtp(true);
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await verifyOtp(pendingEmail, otp);
      if (!result.success) {
        toast.error(result.error || 'Invalid OTP');
        return;
      }
      toast.success('Account created! 🎉');
      resetForm();
      if (onAuthSuccess) {
        onAuthSuccess();
      } else {
        onClose();
      }
    } catch (err) {
      toast.error(err.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    const result = await resendOtp(pendingEmail);
    if (result.success) {
      toast.success('OTP resent!');
    } else {
      toast.error(result.error || 'Failed to resend OTP');
    }
  };

  if (awaitingOtp) {
    return (
      <form onSubmit={handleVerifyOtp}>
        <div style={{
          padding: '0.75rem',
          marginBottom: '1rem',
          backgroundColor: '#e7f5ec',
          borderRadius: '8px',
          border: '1px solid #4CAF50',
          fontSize: '0.85rem',
          color: '#2E7D32',
          textAlign: 'center'
        }}>
          Enter the OTP sent to {pendingEmail}
        </div>

        <FormInput
          label="OTP"
          type="text"
          name="otp"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="6-digit code"
          autoComplete="one-time-code"
          inputMode="numeric"
        />

        <button type="submit" className="auth-form-submit-btn" disabled={loading}>
          {loading ? 'Verifying…' : 'Verify & Create Account'}
        </button>

        <button
          type="button"
          onClick={handleResendOtp}
          style={{
            width: '100%',
            marginTop: '0.5rem',
            background: 'none',
            border: 'none',
            color: '#4CAF50',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Resend OTP
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {hasPendingProduct && (
        <div style={{
          padding: '0.75rem',
          marginBottom: '1rem',
          backgroundColor: '#e7f5ec',
          borderRadius: '8px',
          border: '1px solid #4CAF50',
          fontSize: '0.85rem',
          color: '#2E7D32',
          textAlign: 'center'
        }}>
          ✓ Login to add this product to your cart
        </div>
      )}

      {!isLogin && (
        <>
          <FormInput
            label="Full Name"
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="type here"
            autoComplete="name"
          />
          <FormInput
            label="Username"
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            placeholder="type here"
            autoComplete="username"
          />
          <FormInput
            label="Phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="10-digit number"
            autoComplete="tel"
            inputMode="tel"
          />
        </>
      )}

      <FormInput
        label={isLogin ? 'Email or Username' : 'Email'}
        type={isLogin ? 'text' : 'email'}
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="type here"
        autoComplete={isLogin ? 'username' : 'email'}
        inputMode={isLogin ? undefined : 'email'}
      />

      <FormInput
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="type here"
        autoComplete={isLogin ? 'current-password' : 'new-password'}
      />

      {!isLogin && (
        <div className="auth-form-input-group">
          <label>Profile Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="auth-form-input"
            required
          />
        </div>
      )}

      <AuthToggleText 
        isLogin={isLogin}
        onToggle={onToggleMode}
      />

      <button type="submit" className="auth-form-submit-btn" disabled={loading}>
        {loading ? 'Please wait…' : isLogin ? 'Login' : 'Create Account'}
      </button>
    </form>
  );
};

export default React.memo(AuthForm);
