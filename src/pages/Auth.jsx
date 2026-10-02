import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HardHat, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Auth = () => {
  const [tab, setTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [loginId, setLoginId] = useState('');
  const [loginPwd, setLoginPwd] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPwd, setSignupPwd] = useState('');
  const [signupError, setSignupError] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    if (!loginId.trim() || !loginPwd) {
      setLoginError('Please enter both Email / Mobile and Password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: loginId.trim(), password: loginPwd })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        login(data.user, data.token);
        const isAdminRole = data.user?.role === 'admin';
        showToast(
          isAdminRole
            ? 'Administrator verified. Redirecting to Admin Dashboard...'
            : `Welcome back, ${data.user?.name || data.user?.username || 'Client'}!`,
          'success'
        );
        setTimeout(() => {
          navigate(isAdminRole ? '/admin' : '/booking');
        }, 400);
        return;
      } else {
        setLoginError(data.error || 'Invalid credentials. Please verify your Email/Mobile and Password.');
      }
    } catch {
      setLoginError('Unable to reach authentication server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setSignupError('');
    if (!signupName.trim() || !signupPhone.trim() || !signupPwd) {
      setSignupError('Full name, mobile number, and password are required.');
      return;
    }

    setIsSubmitting(true);
    const newUser = {
      name: signupName.trim(),
      username: signupName.trim().toLowerCase().replace(/\s+/g, ''),
      email: signupEmail.trim(),
      phone: signupPhone.trim(),
      mobile: signupPhone.trim(),
      role: 'user'
    };

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newUser, password: signupPwd })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        login(data.user, data.token);
        showToast('Account created successfully! Welcome to MasonMate.', 'success');
        setTimeout(() => navigate('/booking'), 400);
        return;
      } else {
        setSignupError(data.error || 'Could not create account. Please try again.');
      }
    } catch {
      setSignupError('Unable to reach registration server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-center-wrap">
        {/* Top Brand Identity Header */}
        <div className="auth-brand-header">
          <div className="auth-brand-icon">
            <HardHat size={24} />
          </div>
          <div className="auth-company-title">SRM AKASH CONSTRUCTION</div>
          <div className="auth-brand-divider" aria-hidden="true">|</div>
          <h1 className="auth-portal-heading">MasonMate Login</h1>
        </div>

        {/* Centered Login Card */}
        <div className="card auth-card">
          <div className="auth-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'login'}
              className={`auth-tab-btn ${tab === 'login' ? 'active' : ''}`}
              onClick={() => {
                setTab('login');
                setLoginError('');
                setSignupError('');
              }}
            >
              Login
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'signup'}
              className={`auth-tab-btn ${tab === 'signup' ? 'active' : ''}`}
              onClick={() => {
                setTab('signup');
                setLoginError('');
                setSignupError('');
              }}
            >
              Register
            </button>
          </div>

          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} noValidate>
              {loginError && (
                <div className="auth-error-alert" role="alert">
                  {loginError}
                </div>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="auth-login-id">
                  Email / Mobile
                </label>
                <input
                  id="auth-login-id"
                  type="text"
                  className="form-control"
                  placeholder="Enter email, mobile number, or username"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="auth-login-pwd">
                  Password
                </label>
                <div className="auth-password-field">
                  <input
                    id="auth-login-pwd"
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    placeholder="Enter your password"
                    value={loginPwd}
                    onChange={(e) => setLoginPwd(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="auth-pwd-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-quote-cta btn-full btn-lg auth-submit-btn"
                disabled={isSubmitting}
              >
                <span>{isSubmitting ? 'AUTHENTICATING...' : 'LOGIN'}</span>
                <ArrowRight size={17} className="cta-arrow" />
              </button>

              <div className="auth-forgot-row">
                <button
                  type="button"
                  className="auth-forgot-link"
                  onClick={() =>
                    showToast(
                      'Password reset instructions have been sent to your registered email/mobile.',
                      'info'
                    )
                  }
                >
                  Forgot Password?
                </button>
              </div>

              <div className="auth-demo-box">
                <Lock size={14} style={{ flexShrink: 0, color: 'var(--accent)' }} />
                <span>
                  <strong>Role Credentials:</strong> Admin (<code>admin</code> / <code>admin123</code>) · Customer (<code>9159687408</code> / <code>user123</code>)
                </span>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} noValidate>
              {signupError && (
                <div className="auth-error-alert" role="alert">
                  {signupError}
                </div>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="auth-signup-name">
                  Full Name *
                </label>
                <input
                  id="auth-signup-name"
                  type="text"
                  className="form-control"
                  placeholder="Enter your full name"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="auth-signup-phone">
                  Mobile Number *
                </label>
                <input
                  id="auth-signup-phone"
                  type="tel"
                  className="form-control"
                  placeholder="+91 9159687408"
                  value={signupPhone}
                  onChange={(e) => setSignupPhone(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="auth-signup-email">
                  Email Address (Optional)
                </label>
                <input
                  id="auth-signup-email"
                  type="email"
                  className="form-control"
                  placeholder="you@domain.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="auth-signup-pwd">
                  Password *
                </label>
                <input
                  id="auth-signup-pwd"
                  type="password"
                  className="form-control"
                  placeholder="Minimum 6 characters"
                  value={signupPwd}
                  onChange={(e) => setSignupPwd(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-quote-cta btn-full btn-lg auth-submit-btn"
                disabled={isSubmitting}
              >
                <span>{isSubmitting ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}</span>
                <ArrowRight size={17} className="cta-arrow" />
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
};

export default Auth;
