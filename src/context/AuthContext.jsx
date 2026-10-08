import { useState } from 'react';
import { apiRequest } from '../lib/api';
import { AuthContext } from './auth-context';

const TOKEN_STORAGE_KEY = 'luma_living_token';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));

  const login = async (email, password) => {
    const result = await apiRequest('/user/login', {
      method: 'POST',
      body: { email, pass: password },
    });

    if (!result.token) {
      throw new Error('The login response did not include an authentication token.');
    }

    localStorage.setItem(TOKEN_STORAGE_KEY, result.token);
    setToken(result.token);
    return result.User;
  };

  const register = (details) =>
    apiRequest('/user/register', {
      method: 'POST',
      body: details,
    });

  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: Boolean(token), login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
