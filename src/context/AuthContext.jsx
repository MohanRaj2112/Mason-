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
<<<<<<< HEAD
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('mm_auth_token') || null;
    } catch {
      return null;
    }
  });
=======
>>>>>>> f6a00e4559b3961fd783765ab8ac059602ce3ac7

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

<<<<<<< HEAD
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
=======
  const login = (user) => {
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('cp_user');
>>>>>>> f6a00e4559b3961fd783765ab8ac059602ce3ac7
    } catch {}
  };

  const isAdmin = currentUser?.role === 'admin' || 
                  currentUser?.username?.toLowerCase() === 'admin' || 
<<<<<<< HEAD
                  currentUser?.email?.toLowerCase() === 'admin@srmakash.com' ||
                  currentUser?.email?.toLowerCase() === 'admin@masonmate.in';

  return (
    <AuthContext.Provider value={{ currentUser, token, login, logout, isAdmin }}>
=======
                  currentUser?.email?.toLowerCase() === 'admin@srmakash.com';

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAdmin }}>
>>>>>>> f6a00e4559b3961fd783765ab8ac059602ce3ac7
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
