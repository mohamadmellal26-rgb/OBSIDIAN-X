'use client';

import React, { useState, useRef } from 'react';
import { Mail, Lock, User, ArrowRight, X, CheckCircle2, Check, AlertCircle } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';
import './AuthModal.css';

export interface UserData {
  name: string;
  email: string;
  token?: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (userData: UserData) => void;
}

const ALLOWED_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'outlook.com',
  'hotmail.com',
  'icloud.com',
  'live.com',
  'protonmail.com',
];

// مسار الباك إند Go Fiber
// ✅ صحيح: يقرأ المتغير السحابي من Vercel ويلحق به مسار auth
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL 
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth` 
  : 'http://localhost:8080/api/v1/auth';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  // Form States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Validation & Server Errors
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [captchaError, setCaptchaError] = useState('');
  const [serverError, setServerError] = useState('');

  // CAPTCHA State & Ref
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  if (!isOpen) return null;

  // قواعد التحقق من كلمة المرور
  const isLengthValid = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const isPasswordSecure = isLengthValid && hasNumber && hasSpecialChar;

  const isAllowedEmail = (emailStr: string): boolean => {
    const domain = emailStr.split('@')[1]?.toLowerCase();
    return ALLOWED_DOMAINS.includes(domain);
  };

  const clearErrors = () => {
    setEmailError('');
    setPasswordError('');
    setCaptchaError('');
    setServerError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    let hasError = false;

    // 1. Validating Email Domain
    if (!isAllowedEmail(email)) {
      setEmailError(`Only email address from global providers (${ALLOWED_DOMAINS.slice(0, 4).join(', ')}, etc.) are allowed.`);
      hasError = true;
    }

    // 2. Validating Password for Sign Up
    if (isSignUp) {
      if (!isPasswordSecure) {
        setPasswordError('Password must meet all security requirements below.');
        hasError = true;
      } else if (password !== confirmPassword) {
        setPasswordError('Passwords do not match.');
        hasError = true;
      }
    }

    // 3. Validating Captcha
    if (!captchaToken) {
      setCaptchaError('Please complete the verification check.');
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);

    try {
      const endpoint = isSignUp ? `${API_BASE_URL}/register` : `${API_BASE_URL}/login`;
      const payload = isSignUp
        ? { name: fullName, email, password, captcha_token: captchaToken }
        : { email, password, captcha_token: captchaToken };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // التحقق من نوع الاستجابة تجنباً لأخطاء Parsing
      const contentType = response.headers.get('content-type');
      let data: any;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const textError = await response.text();
        throw new Error(textError || `Server error (${response.status})`);
      }

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      // بناء كائن بيانات المستخدم
      const userData: UserData = {
        name: data.user?.name || (isSignUp ? fullName : email.split('@')[0]),
        email: email,
        token: data.token,
      };

      // 1. حفظ البيانات في الـ localStorage لإبقاء الجلسة قائمة بعد Refresh
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      localStorage.setItem('user', JSON.stringify(userData));

      // 2. تحديث State في الواجهة للأب
      if (onLoginSuccess) {
        onLoginSuccess(userData);
      }

      onClose();
    } catch (err: any) {
      setServerError(err.message || 'Failed to connect to the server.');
      recaptchaRef.current?.reset();
      setCaptchaToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
    if (token) setCaptchaError('');
  };

  const resetForm = (signUpMode: boolean) => {
    setIsSignUp(signUpMode);
    setCaptchaToken(null);
    clearErrors();
    recaptchaRef.current?.reset();
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="auth-header">
          <h2>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
          <p>
            {isSignUp
              ? 'Join OBSIDIAN-X for exclusive access & order tracking'
              : 'Sign in to access your saved items and account settings'}
          </p>
        </div>

        {/* Switcher Tabs */}
        <div className="auth-tabs">
          <button
            className={`tab-btn ${!isSignUp ? 'active' : ''}`}
            onClick={() => resetForm(false)}
            disabled={isLoading}
          >
            Sign In
          </button>
          <button
            className={`tab-btn ${isSignUp ? 'active' : ''}`}
            onClick={() => resetForm(true)}
            disabled={isLoading}
          >
            Register
          </button>
        </div>

        {/* Global Server Error Display */}
        {serverError && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#fff5f5', border: '1px solid #feb2b2', padding: '10px 12px', borderRadius: '6px', color: '#c53030', fontSize: '13px', marginBottom: '12px' }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{serverError}</span>
          </div>
        )}

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="auth-form">
          {isSignUp && (
            <div className="input-group">
              <label>Full Name</label>
              <div className="input-icon-wrapper">
                <User className="field-icon" size={18} />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          <div className="input-group">
            <label>Email Address</label>
            <div className="input-icon-wrapper">
              <Mail className="field-icon" size={18} />
              <input
                type="email"
                placeholder="name@gmail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError('');
                }}
                required
                disabled={isLoading}
              />
            </div>
            {emailError && (
              <span className="field-error-message" style={{ color: '#e53e3e', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                {emailError}
              </span>
            )}
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-icon-wrapper">
              <Lock className="field-icon" size={18} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError('');
                }}
                required
                disabled={isLoading}
              />
            </div>

            {/* إرشادات كلمة المرور التفاعلية عند التسجيل */}
            {isSignUp && (
              <div style={{ marginTop: '8px', padding: '8px 12px', backgroundColor: '#f8f9fa', borderRadius: '6px', fontSize: '12px' }}>
                <div style={{ color: isLengthValid ? '#2e7d32' : '#718096', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  {isLengthValid ? <Check size={14} /> : <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1px solid #cbd5e0' }} />}
                  <span>At least 8 characters long</span>
                </div>
                <div style={{ color: hasNumber ? '#2e7d32' : '#718096', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  {hasNumber ? <Check size={14} /> : <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1px solid #cbd5e0' }} />}
                  <span>Contains at least 1 number (0-9)</span>
                </div>
                <div style={{ color: hasSpecialChar ? '#2e7d32' : '#718096', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {hasSpecialChar ? <Check size={14} /> : <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1px solid #cbd5e0' }} />}
                  <span>Contains at least 1 symbol (@, #, $, etc.)</span>
                </div>
              </div>
            )}
          </div>

          {isSignUp && (
            <div className="input-group">
              <label>Confirm Password</label>
              <div className="input-icon-wrapper">
                <Lock className="field-icon" size={18} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {passwordError && (
            <span className="field-error-message" style={{ color: '#e53e3e', fontSize: '12px', marginTop: '2px', display: 'block' }}>
              {passwordError}
            </span>
          )}

          {!isSignUp && (
            <div className="forgot-password-row">
              <a href="#">Forgot password?</a>
            </div>
          )}

          {/* reCAPTCHA Component */}
          <div className="recaptcha-wrapper" style={{ margin: '16px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey="6LePobktAAAAAF9vjRtvArRYu5Tuwzq3ay6UH6P-"
              onChange={handleCaptchaChange}
            />
            {captchaError && (
              <span className="field-error-message" style={{ color: '#e53e3e', fontSize: '12px', marginTop: '6px' }}>
                {captchaError}
              </span>
            )}
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            <span>{isLoading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Bottom Feature Badges */}
        <div className="auth-features">
          <div className="feature-item">
            <CheckCircle2 size={16} />
            <span>Fast Express Delivery</span>
          </div>
          <div className="feature-item">
            <CheckCircle2 size={16} />
            <span>100% Secure Checkout</span>
          </div>
        </div>

      </div>
    </div>
  );
}