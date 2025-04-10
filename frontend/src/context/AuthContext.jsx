import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem('access') ? JSON.parse(localStorage.getItem('access')) : null
  );
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/token/`, {
        username,
        password,
      });
      setAuthTokens(response.data);
      localStorage.setItem('access', JSON.stringify(response.data));
      setUser(response.data.user);
    } catch (err) {
      console.error(err);
      throw err; // Re-throw the error to handle it in the component
    }
  };

  const logout = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem('access');
  };

  const updateToken = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/token/refresh/`, {
        refresh: localStorage.getItem('refresh'),
      });
      setAuthTokens(response.data);
      localStorage.setItem('access', JSON.stringify(response.data));
    } catch (err) {
      console.error(err);
      logout();
    }
  };

  useEffect(() => {
    const fourMinutes = 1000 * 60 * 4;
    let interval = null;

    if (authTokens) {
      interval = setInterval(() => {
        if (authTokens) {
          updateToken();
        }
      }, fourMinutes);
    }

    return () => clearInterval(interval);
  }, [authTokens]);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/me/`, {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        });
        setUser(response.data);
      } catch (err) {
        console.error(err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    if (authTokens) {
      getProfile();
    } else {
      setLoading(false);
    }
  }, [authTokens]);

  const contextData = {
    authTokens,
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {!loading && children}
    </AuthContext.Provider>
  );
};