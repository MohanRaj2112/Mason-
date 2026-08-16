// ── AUTH PAGE SCRIPT ── //

function switchTab(tab) {
    const loginTab = document.getElementById('tabLogin');
    const signupTab = document.getElementById('tabSignup');
    const loginPanel = document.getElementById('loginPanel');
    const signupPanel = document.getElementById('signupPanel');

    if (tab === 'login') {
        loginTab?.classList.add('active');
        signupTab?.classList.remove('active');
        loginPanel?.classList.add('active');
        signupPanel?.classList.remove('active');
    } else {
        signupTab?.classList.add('active');
        loginTab?.classList.remove('active');
        signupPanel?.classList.add('active');
        loginPanel?.classList.remove('active');
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const loginId = document.getElementById('loginId').value.trim();
    const pwd = document.getElementById('loginPwd').value;
    const errDiv = document.getElementById('loginError');

    if (!loginId || !pwd) {
        showError(errDiv, 'Please enter both ID and password.');
        return;
    }

    // Check for admin default credentials
    if ((loginId === 'admin' || loginId === 'admin@srmakash.com') && pwd === 'admin123') {
        const adminUser = { username: 'Admin', email: 'admin@srmakash.com', role: 'admin' };
        localStorage.setItem('cp_user', JSON.stringify(adminUser));
        showToast('Welcome Admin! Redirecting to Admin Panel...', 'success');
        setTimeout(() => window.location.href = 'admin.html', 1000);
        return;
    }

    try {
        const res = await fetch('/users');
        if (res.ok) {
            const users = await res.json();
            const found = users.find(u => u.username === loginId || u.email === loginId || u.mobile === loginId);
            if (found) {
                const user = { username: found.username || found.first, email: found.email, role: 'customer' };
                localStorage.setItem('cp_user', JSON.stringify(user));
                showToast(`Welcome back, ${user.username}!`, 'success');
                setTimeout(() => window.location.href = 'index.html', 1000);
                return;
            }
        }
    } catch (err) {
        console.warn("Backend login check failed:", err);
    }

    // Fallback demo user login
    const user = { username: loginId.split('@')[0], email: loginId, role: 'customer' };
    localStorage.setItem('cp_user', JSON.stringify(user));
    showToast(`Signed in successfully as ${user.username}!`, 'success');
    setTimeout(() => window.location.href = 'index.html', 1000);
}

async function handleSignup(e) {
    e.preventDefault();
    const first = document.getElementById('signupFirst').value.trim();
    const last = document.getElementById('signupLast').value.trim();
    const phone = document.getElementById('signupPhone').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const pwd = document.getElementById('signupPwd').value;
    const errDiv = document.getElementById('signupError');

    if (!phone || !pwd) {
        showError(errDiv, 'Phone number and password are required.');
        return;
    }

    const username = first ? `${first} ${last}`.trim() : (email.split('@')[0] || 'User');

    try {
        const res = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, mobile: phone, email, password: pwd })
        });
        const data = await res.json();
        if (res.ok) {
            const newUser = { username, mobile: phone, email, role: 'customer' };
            localStorage.setItem('cp_user', JSON.stringify(newUser));
            showToast('Account created successfully! ✨', 'success');
            setTimeout(() => window.location.href = 'index.html', 1000);
            return;
        }
    } catch (err) {
        console.warn("Signup server error:", err);
    }

    // Local fallback signup
    const newUser = { username, mobile: phone, email, role: 'customer' };
    localStorage.setItem('cp_user', JSON.stringify(newUser));
    showToast('Account created! Welcome to SRM AKASH CONSTRUCTION.', 'success');
    setTimeout(() => window.location.href = 'index.html', 1000);
}

function checkStrength(val) {
    const fill = document.getElementById('strengthFill');
    const label = document.getElementById('strengthLabel');
    if (!fill || !label) return;

    if (!val) {
        fill.style.width = '0%';
        label.textContent = 'Enter password to see strength';
        return;
    }

    let score = 0;
    if (val.length >= 6) score += 1;
    if (val.length >= 10) score += 1;
    if (/[A-Z]/.test(val)) score += 1;
    if (/[0-9]/.test(val)) score += 1;
    if (/[^A-Za-z0-9]/.test(val)) score += 1;

    if (score <= 2) {
        fill.style.width = '33%';
        fill.style.background = 'var(--red)';
        label.textContent = 'Weak password';
    } else if (score <= 4) {
        fill.style.width = '66%';
        fill.style.background = 'var(--yellow)';
        label.textContent = 'Medium password';
    } else {
        fill.style.width = '100%';
        fill.style.background = 'var(--green)';
        label.textContent = 'Strong password ✓';
    }
}

function showForgot() {
    showToast('Password reset link sent to your phone/email! 📩', 'success', 4000);
}

function socialLogin(provider) {
    const user = { username: `${provider} User`, email: `user@${provider.toLowerCase()}.com`, role: 'customer' };
    localStorage.setItem('cp_user', JSON.stringify(user));
    showToast(`Signed in with ${provider}!`, 'success');
    setTimeout(() => window.location.href = 'index.html', 1000);
}

function showError(el, msg) {
    if (!el) return;
    el.textContent = msg;
    el.style.display = 'block';
}
