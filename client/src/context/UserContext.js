import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// import { api } from '../utilities/apiHelper';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const navigate = useNavigate();

  const signInUser = async (credentials) => {
    try {
      // Make an API call to authenticate the user
      const response = await axios.get('http://localhost:5001/api/users', {
        auth: {
          username: credentials.emailAddress,
          password: credentials.password,
        },
      });

      if (response.status === 200) {
        // Assuming the API returns the authenticated user object
        const user = response.data;
        user.password = credentials.password;
        
        setAuthUser(user);

        // Save user data to local storage for persistent authentication
        localStorage.setItem('authenticatedUser', JSON.stringify(user));

        // Navigate to the home page or the previous page
        navigate('/');
       
        return user;
      } else {
        // Handle other response statuses
        throw new Error('Authentication failed');
      }
    } catch (error) {
      // Handle authentication errors
      console.error('Authentication failed', error);
      return null;
    }
  };

  const signOutUser = () => {
    // Clear the authenticated user from the context and local storage
    setAuthUser(null);
    localStorage.removeItem('authenticatedUser');

    // Navigate to the home page
    navigate('/');
  };

  // Check for authenticated user in local storage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('authenticatedUser');
    if (storedUser) {
      setAuthUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <UserContext.Provider value={{ authUser, signIn: signInUser, signOut: signOutUser }}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export { UserProvider, useUser };
