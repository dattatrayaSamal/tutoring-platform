import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);  // Track loading state

  // Login function to authenticate the user
  const login = async (formData) => {
    setLoading(true);  // Set loading to true before sending request
    try {
      const res = await axios.post('/auth/login', formData);
      console.log('Login Response:', res.data);
      localStorage.setItem('token', res.data.token); // Save token to localStorage
      
      await fetchUser();  // Fetch user data after login
      setLoading(false);  // Stop loading after setting the user data
    } catch (error) {
      setLoading(false);  // Stop loading if error occurs
      console.error('Login error:', error);
      throw error;  // Propagate the error
    }
  };


  const logout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    setUser(null); // Reset user state
  };

  // Fetch user data after login (using stored token)
  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null); // No token, reset user state
      return;
    }

    try {
      setLoading(true);  // Set loading to true while fetching user data
      const res = await axios.get('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in Authorization header
        },
      });
      console.log("Fetched user data:", res.data);
      setUser(res.data); // Set user data
      setLoading(false);  // Stop loading after fetching user data
    } catch (error) {
      setLoading(false);  // Stop loading if error occurs
      console.error('Error fetching user:', error);
      logout();  // If fetching fails, log out the user
    }
  };

  // Handle user registration - call this after registration is successful
  const register = async (formData) => {
    setLoading(true);  // Set loading to true before sending request
    try {
      const res = await axios.post('/auth/register', formData);
      console.log('Registration Response:', res.data);
      
      // Save the token to localStorage
      localStorage.setItem('token', res.data.token);
      
      // Fetch the user after successful registration
      await fetchUser();  // Call the same fetchUser function that gets the logged-in user
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Registration error:', error);
      throw error;  // Propagate the error
    }
  };

  // Check token in localStorage on component mount and fetch user data
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) fetchUser();  // Fetch user if token exists
  }, []);  // This useEffect runs once on component mount

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
