import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('cp_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('mm_auth_token') || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('cp_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('cp_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      if (token) {
        localStorage.setItem('mm_auth_token', token);
      } else {
        localStorage.removeItem('mm_auth_token');
      }
    } catch (e) {
      console.error(e);
    }
  }, [token]);

  // Login action with user payload & optional token
  const login = (user, authToken = null) => {
    setCurrentUser(user);
    if (authToken) {
      setToken(authToken);
    }
  };

  // Logout action
  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    try {
      localStorage.removeItem('cp_user');
      localStorage.removeItem('mm_auth_token');
    } catch {}
  };

  const isAdmin = currentUser?.role === 'admin' || 
                  currentUser?.username?.toLowerCase() === 'admin' || 
                  currentUser?.email?.toLowerCase() === 'admin@srmakash.com' ||
                  currentUser?.email?.toLowerCase() === 'admin@masonmate.in';

  return (
    <AuthContext.Provider value={{ currentUser, token, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

