import { createContext, useState, useEffect } from 'react';

// 🔑 Create Context
export const AuthContext = createContext();

// 🧠 Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Will hold: { _id, name, token, role }

  // ✅ Load from localStorage on refresh
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored user:', e);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // ✅ Login and persist to localStorage
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // ✅ Logout and clean storage
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
