import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem('access_token') ? JSON.parse(localStorage.getItem('access_token')) : null
  );
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/token/`, {
        username,
        password,
      });
      if (response.status !== 200) {
        throw new Error('Login failed');
      }
      setAuthTokens(response.data);
      localStorage.setItem('access_token', JSON.stringify(response.data));
      setUser(response.data.user);
      console.log('Login Response:', response.data);
    } catch (err) {
      console.error('Login Error:', err);
      throw err; // Re-throw the error to handle it in the component
    }
  };

  const logout = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem('access_token');
  };

  const updateToken = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/token/refresh/`, {
        refresh: authTokens.refresh, // Ensure you are using the correct refresh token
      });
      setAuthTokens(response.data);
      localStorage.setItem('access_token', JSON.stringify(response.data));
      console.log('Refresh Token Response:', response.data);
    } catch (err) {
      console.error('Refresh Token Error:', err);
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
        console.log('User Profile Response:', response.data);
      } catch (err) {
        console.error('Get Profile Error:', err);
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