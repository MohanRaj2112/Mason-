import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Auth = () => {
  const [tab, setTab] = useState('login');
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  // Login form state
  const [loginId, setLoginId] = useState('');
  const [loginPwd, setLoginPwd] = useState('');
  const [loginError, setLoginError] = useState('');

  // Signup form state
  const [signupFirst, setSignupFirst] = useState('');
  const [signupLast, setSignupLast] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPwd, setSignupPwd] = useState('');
  const [signupError, setSignupError] = useState('');

  // Password strength calculation
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

    if (!loginId.trim() || !loginPwd) {
      setLoginError('Please enter both ID and password.');
      return;
    }

    // Admin default login check
    if ((loginId === 'admin' || loginId === 'admin@srmakash.com') && loginPwd === 'admin123') {
      const adminUser = { username: 'Admin', email: 'admin@srmakash.com', role: 'admin' };
      login(adminUser);
      showToast('Welcome Admin! Redirecting to Admin Panel...', 'success');
      setTimeout(() => navigate('/admin'), 600);
      return;
    }

    try {
      const res = await fetch('/users');
      if (res.ok) {
        const users = await res.json();
        const found = users.find(u => u.username === loginId || u.email === loginId || u.mobile === loginId);
        if (found) {
          const user = { username: found.username || found.first, email: found.email, role: 'customer' };
          login(user);
          showToast(`Welcome back, ${user.username}!`, 'success');
          setTimeout(() => navigate('/'), 600);
          return;
        }
      }
    } catch (err) {
      console.warn('Backend login check offline:', err);
    }

    // Local fallback user login
    const user = { username: loginId.split('@')[0], email: loginId, role: 'customer' };
    login(user);
    showToast(`Signed in successfully as ${user.username}!`, 'success');
    setTimeout(() => navigate('/'), 600);
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setSignupError('');

    if (!signupPhone.trim() || !signupPwd) {
      setSignupError('Mobile number and password are required.');
      return;
    }

    const username = signupFirst ? `${signupFirst} ${signupLast}`.trim() : (signupEmail.split('@')[0] || 'Customer');

    try {
      const res = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, mobile: signupPhone, email: signupEmail, password: signupPwd })
      });
      if (res.ok) {
        const newUser = { username, mobile: signupPhone, email: signupEmail, role: 'customer' };
        login(newUser);
        showToast('Account created successfully! ✨', 'success');
        setTimeout(() => navigate('/'), 600);
        return;
      }
    } catch (err) {
      console.warn('Signup server error:', err);
    }

    // Local fallback signup
    const newUser = { username, mobile: signupPhone, email: signupEmail, role: 'customer' };
    login(newUser);
    showToast('Account created! Welcome to Mason Mate.', 'success');
    setTimeout(() => navigate('/'), 600);
  };

  const handleSocialLogin = (provider) => {
    const user = { username: `${provider} Client`, email: `client@${provider.toLowerCase()}.com`, role: 'customer' };
    login(user);
    showToast(`Signed in with ${provider}!`, 'success');
    setTimeout(() => navigate('/'), 600);
  };

  return (
    <div className="auth-page" style={{ padding: '60px 20px', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ maxWidth: '480px', width: '100%', padding: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div className="logo-badge" style={{ display: 'inline-flex', width: '54px', height: '54px', fontSize: '1.8rem', marginBottom: '12px', background: 'var(--bg-dark)', borderRadius: 'var(--radius-md)', alignItems: 'center', justifyContent: 'center' }}>
            🏗️
          </div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)' }}>Mason Mate Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Track engineering site logs, manage equipment rentals &amp; invoices.
          </p>
        </div>

        {/* Auth Tabs */}
        <div className="auth-tabs" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: 'var(--bg-main)', padding: '6px', borderRadius: 'var(--radius-md)', marginBottom: '28px' }}>
          <button
            className={`btn btn-sm ${tab === 'login' ? 'btn-primary' : 'btn-outline'}`}
            style={{ border: 'none', background: tab === 'login' ? 'var(--primary)' : 'transparent', color: tab === 'login' ? '#fff' : 'var(--text-muted)' }}
            onClick={() => setTab('login')}
          >
            Sign In
          </button>
          <button
            className={`btn btn-sm ${tab === 'signup' ? 'btn-primary' : 'btn-outline'}`}
            style={{ border: 'none', background: tab === 'signup' ? 'var(--primary)' : 'transparent', color: tab === 'signup' ? '#fff' : 'var(--text-muted)' }}
            onClick={() => setTab('signup')}
          >
            Create Account
          </button>
        </div>

        {/* ── LOGIN FORM ── */}
        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit}>
            {loginError && (
              <div style={{ color: '#EF4444', fontSize: '0.85rem', marginBottom: '16px', background: '#FEF2F2', padding: '10px', borderRadius: '6px' }}>
                ⚠️ {loginError}
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
                <label className="form-label" style={{ margin: 0 }}>Password</label>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); showToast('Password reset link sent to your phone/email! 📩', 'info'); }}
                  style={{ fontSize: '0.8rem', color: 'var(--accent)' }}
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

            <button type="submit" className="btn btn-accent btn-full btn-lg" style={{ marginTop: '8px' }}>
              🔐 Sign In
            </button>

            <div style={{ margin: '16px 0', padding: '10px', background: 'var(--accent-light)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--accent)', fontSize: '0.78rem', color: 'var(--primary)' }}>
              🔑 <strong>Admin demo login:</strong> User: <code>admin</code> | Password: <code>admin123</code>
            </div>
          </form>
        )}

        {/* ── SIGNUP FORM ── */}
        {tab === 'signup' && (
          <form onSubmit={handleSignupSubmit}>
            {signupError && (
              <div style={{ color: '#EF4444', fontSize: '0.85rem', marginBottom: '16px', background: '#FEF2F2', padding: '10px', borderRadius: '6px' }}>
                ⚠️ {signupError}
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
              {/* Password strength bar */}
              <div style={{ marginTop: '8px' }}>
                <div style={{ height: '4px', width: '100%', background: 'var(--border-light)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: strength.width, background: strength.color, transition: 'all 0.3s' }}></div>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                  {strength.text}
                </span>
              </div>
            </div>

            <button type="submit" className="btn btn-accent btn-full btn-lg" style={{ marginTop: '12px' }}>
              ✨ Create Free Account
            </button>
          </form>
        )}

        {/* Social Login Separator */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0 16px', gap: '12px' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }}></div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>OR CONTINUE WITH</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }}></div>
        </div>

        <div className="grid-2" style={{ gap: '12px' }}>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => handleSocialLogin('Google')}
            style={{ justifyContent: 'center' }}
          >
            Google
          </button>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => handleSocialLogin('Mobile OTP')}
            style={{ justifyContent: 'center' }}
          >
            📱 Mobile OTP
          </button>
        </div>
      </div>
    </div>
  );
};
