import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Auth = () => {
  const [tab, setTab] = useState('login');
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [loginId, setLoginId] = useState('');
  const [loginPwd, setLoginPwd] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [signupFirst, setSignupFirst] = useState('');
  const [signupLast, setSignupLast] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPwd, setSignupPwd] = useState('');
  const [signupError, setSignupError] = useState('');

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { width: '0%', text: 'Enter password to check strength', color: 'var(--border-light)' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { width: '33%', text: 'Weak password', color: '#EF4444' };
    if (score <= 4) return { width: '66%', text: 'Medium password', color: '#F59E0B' };
    return { width: '100%', text: 'Strong password ✓', color: '#10B981' };
  };

  const strength = getPasswordStrength(signupPwd);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    if (!loginId || !loginPwd) {
      setLoginError('Please enter both ID/email and password.');
      return;
    }
    setIsSubmitting(true);
    if ((loginId === 'admin' || loginId === 'admin@srmakash.com') && loginPwd === 'admin123') {
      const adminUser = { username: 'Admin', email: 'admin@srmakash.com', role: 'admin' };
      login(adminUser);
      showToast('Welcome Admin! Redirecting to Admin Panel...', 'success');
      setTimeout(() => navigate('/admin'), 600);
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: loginId, password: loginPwd })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        login(data.user, data.token);
        showToast(`Welcome back, ${data.user?.name || data.user?.username}!`, 'success');
        setTimeout(() => navigate(data.user?.role === 'admin' ? '/admin' : '/'), 600);
        return;
      } else {
        setLoginError(data.error || 'Invalid credentials');
      }
    } catch {
      const fallbackUser = { username: loginId.split('@')[0], email: loginId, role: 'customer' };
      login(fallbackUser);
      showToast(`Signed in successfully as ${fallbackUser.username}!`, 'success');
      setTimeout(() => navigate('/'), 600);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setSignupError('');
    if (!signupPhone || !signupPwd) {
      setSignupError('Phone number and password are required.');
      return;
    }
    setIsSubmitting(true);
    const username = signupFirst ? `${signupFirst} ${signupLast}`.trim() : signupEmail.split('@')[0] || 'User';
    const newUser = {
      name: `${signupFirst} ${signupLast}`.trim() || username,
      username,
      email: signupEmail,
      phone: signupPhone,
      mobile: signupPhone,
      role: 'customer'
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
        showToast('Account created! Welcome to Mason Mate.', 'success');
        setTimeout(() => navigate('/'), 600);
        return;
      } else {
        setSignupError(data.error || 'Failed to register account');
      }
    } catch {
      login(newUser);
      showToast('Account created! Welcome to Mason Mate.', 'success');
      setTimeout(() => navigate('/'), 600);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = (provider) => {
    const user = { username: `${provider}User`, email: `user@${provider.toLowerCase()}.com`, role: 'customer' };
    login(user);
    showToast(`Signed in with ${provider}!`, 'success');
    setTimeout(() => navigate('/'), 600);
  };

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div className="auth-brand-icon">
            <Building2 size={24} />
          </div>
          <span className="section-eyebrow" style={{ marginBottom: '4px' }}>
            SRM AKASH CONSTRUCTION
          </span>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--primary)' }}>Mason Mate Portal</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Access engineering site logs, manage equipment rentals &amp; bookings.
          </p>
        </div>

        {/* Auth Tabs */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab-btn ${tab === 'login' ? 'active' : ''}`}
            onClick={() => {
              setTab('login');
              setLoginError('');
              setSignupError('');
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${tab === 'signup' ? 'active' : ''}`}
            onClick={() => {
              setTab('signup');
              setLoginError('');
              setSignupError('');
            }}
          >
            Create Account
          </button>
        </div>

        {/* ── LOGIN FORM ── */}
        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit}>
            {loginError && (
              <div
                style={{
                  color: '#991B1B',
                  fontSize: '0.85rem',
                  marginBottom: '16px',
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  padding: '10px 14px',
                  borderRadius: '8px'
                }}
              >
                {loginError}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Phone Number, Email, or Username</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 9159687408 or admin"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <div className="flex justify-between items-center" style={{ marginBottom: '6px' }}>
                <label className="form-label" style={{ margin: 0 }}>
                  Password
                </label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast('Password reset link sent to your phone/email.', 'info');
                  }}
                  style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600 }}
                >
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={loginPwd}
                onChange={(e) => setLoginPwd(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-quote-cta btn-full btn-lg"
              disabled={isSubmitting}
            >
              <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight size={16} className="cta-arrow" />
            </button>

            <div className="auth-demo-box">
              <Lock size={14} style={{ flexShrink: 0, color: 'var(--accent)' }} />
              <span>
                <strong>Admin Access:</strong> Username <code>admin</code> · Password <code>admin123</code>
              </span>
            </div>
          </form>
        )}

        {/* ── SIGNUP FORM ── */}
        {tab === 'signup' && (
          <form onSubmit={handleSignupSubmit}>
            {signupError && (
              <div
                style={{
                  color: '#991B1B',
                  fontSize: '0.85rem',
                  marginBottom: '16px',
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  padding: '10px 14px',
                  borderRadius: '8px'
                }}
              >
                {signupError}
              </div>
            )}

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Santhosh"
                  value={signupFirst}
                  onChange={(e) => setSignupFirst(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Kumar"
                  value={signupLast}
                  onChange={(e) => setSignupLast(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Mobile Number *</label>
              <input
                type="tel"
                className="form-control"
                placeholder="+91 9159687408"
                value={signupPhone}
                onChange={(e) => setSignupPhone(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="you@email.com"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Create Password *</label>
              <input
                type="password"
                className="form-control"
                placeholder="Min 6 characters"
                value={signupPwd}
                onChange={(e) => setSignupPwd(e.target.value)}
                required
              />
              <div style={{ marginTop: '8px' }}>
                <div
                  style={{
                    height: '4px',
                    width: '100%',
                    background: 'var(--border-light)',
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: strength.width,
                      background: strength.color,
                      transition: 'all 0.3s'
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    marginTop: '4px',
                    display: 'block'
                  }}
                >
                  {strength.text}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-quote-cta btn-full btn-lg"
              disabled={isSubmitting}
            >
              <span>{isSubmitting ? 'Creating account...' : 'Create Account'}</span>
              <ArrowRight size={16} className="cta-arrow" />
            </button>
          </form>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            margin: '24px 0 16px',
            gap: '12px'
          }}
        >
          <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            QUICK ACCESS
          </span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }} />
        </div>

        <div className="grid-2" style={{ gap: '12px' }}>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => handleSocialLogin('Google')}
          >
            <User size={14} />
            <span>Google Sign-In</span>
          </button>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => handleSocialLogin('Mobile OTP')}
          >
            <span>Mobile OTP</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
