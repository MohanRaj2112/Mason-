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

  const login = (user) => {
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('cp_user');
    } catch {}
  };

  const isAdmin = currentUser?.role === 'admin' || 
                  currentUser?.username?.toLowerCase() === 'admin' || 
                  currentUser?.email?.toLowerCase() === 'admin@srmakash.com';

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAdmin }}>
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
