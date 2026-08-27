import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('admin_token')));
  useEffect(() => {
    const expire = () => { setAdmin(null); setLoading(false); };
    window.addEventListener('auth:expired', expire);
    if (localStorage.getItem('admin_token')) api('/auth/me').then(setAdmin).catch(expire).finally(() => setLoading(false));
    return () => window.removeEventListener('auth:expired', expire);
  }, []);
  const login = async (credentials) => { const data = await api('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }); localStorage.setItem('admin_token', data.token); setAdmin(data.admin); };
  const logout = () => { localStorage.removeItem('admin_token'); setAdmin(null); };
  return <AuthContext.Provider value={{ admin, loading, login, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
