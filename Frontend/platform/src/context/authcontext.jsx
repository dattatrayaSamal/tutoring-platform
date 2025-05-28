import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (formData) => {
    const res = await axios.post('/auth/login', formData);
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // const fetchUser = async () => {
  //   const res = await axios.get('/auth/me');
  //   setUser(res.data);
  // };

  const fetchUser = async () => {
  const token = localStorage.getItem('token');
  
  if (!token) return; // Don't try to fetch user if no token exists
  
  try {
    const res = await axios.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
    setUser(res.data); // Set user data if request is successful
  } catch (error) {
    console.error('Error fetching user:', error);
    // Optional: If the token is invalid or expired, clear it
    logout(); // Log out the user if fetching fails
  }
};


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
