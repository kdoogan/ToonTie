import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async (storedToken) => {
      try {
        // Test the token with a simple API call
        const response = await fetch('https://api.spotify.com/v1/me', {
          headers: { 'Authorization': `Bearer ${storedToken}` }
        });

        if (!response.ok) {
          // If token is invalid, remove it and return false
          localStorage.removeItem('spotify_token');
          setToken(null);
          return false;
        }
        return true;
      } catch (error) {
        console.error('Token validation error:', error);
        localStorage.removeItem('spotify_token');
        setToken(null);
        return false;
      }
    };

    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('spotify_token');
      if (storedToken) {
        const isValid = await validateToken(storedToken);
        if (isValid) {
          setToken(storedToken);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (newToken) => {
    // Validate the new token before setting it
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: { 'Authorization': `Bearer ${newToken}` }
      });

      if (response.ok) {
        localStorage.setItem('spotify_token', newToken);
        setToken(newToken);
        return true;
      } else {
        console.error('Invalid token received');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('spotify_token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, loading }}>
      {!loading && children}
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