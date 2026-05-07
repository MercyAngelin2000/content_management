import { createContext, useMemo, useState } from 'react';
import { authService } from '../services/auth.service.js';
import { storage } from '../utils/storage.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(storage.getUser());
  const [loading, setLoading] = useState(false);

  const login = async (payload) => {
    setLoading(true);
    try {
      const result = await authService.login(payload);
      storage.setToken(result.token);
      storage.setUser(result.user);
      setUser(result.user);
      return result.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    storage.clearAll();
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };
