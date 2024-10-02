import React, {createContext, useState} from 'react';

export const AuthContext = createContext();

export function AuthProvider({children}) {
  const [authTokens, setAuthTokens] = useState(() => {
    const token = localStorage.getItem('token');
    return token ? JSON.parse(token) : null;
  });

  const [user, setUser] = useState(() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  });

  const login = (tokens, userData) => {
    localStorage.setItem('token', JSON.stringify(tokens));
    localStorage.setItem('user', JSON.stringify(userData));
    setAuthTokens(tokens);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthTokens(null);
    setUser(null);
  };

  const value = {
    authTokens,
    user,
    setAuthTokens,
    setUser,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
