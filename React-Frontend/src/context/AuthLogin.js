import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [driverToken, setDriverToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("driverToken");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setDriverToken(storedToken);
    }

    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    setDriverToken(token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('driverToken', token);
  };

  const logout = () => {
    setUser(null);
    setDriverToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('driverToken');
  };

  return (
    <AuthContext.Provider value={{ user, driverToken, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
