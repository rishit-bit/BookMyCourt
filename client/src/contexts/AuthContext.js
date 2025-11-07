import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  SIGNUP_START: 'SIGNUP_START',
  SIGNUP_SUCCESS: 'SIGNUP_SUCCESS',
  SIGNUP_FAILURE: 'SIGNUP_FAILURE',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Initial state
const initialState = {
  user: JSON.parse(localStorage.getItem('bookmycourt_user') || 'null'),
  token: localStorage.getItem('bookmycourt_token'),
  isAuthenticated: !!localStorage.getItem('bookmycourt_token'),
  isLoading: false,
  error: null
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.SIGNUP_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    
    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.SIGNUP_SUCCESS:
      // Store user data in localStorage
      localStorage.setItem('bookmycourt_user', JSON.stringify(action.payload.user));
      localStorage.setItem('bookmycourt_token', action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    
    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.SIGNUP_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };
    
    case AUTH_ACTIONS.LOGOUT:
      // Clear user data from localStorage
      localStorage.removeItem('bookmycourt_user');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
    
    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: action.payload
      };
    
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set up axios defaults
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
      localStorage.setItem('bookmycourt_token', state.token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('bookmycourt_token');
    }
  }, [state.token]);

  // Check token validity on app start
  useEffect(() => {
    const checkTokenValidity = async () => {
      if (state.token) {
        try {
          // Set token in headers before verification
          axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
          
          const response = await axios.post(`${API_BASE_URL}/auth/verify-token`, {
            token: state.token
          });
          
          if (response.data.success) {
            dispatch({
              type: AUTH_ACTIONS.LOGIN_SUCCESS,
              payload: {
                user: response.data.data.user,
                token: state.token
              }
            });
          } else {
            console.warn('Token invalid or expired');
            dispatch({ type: AUTH_ACTIONS.LOGOUT });
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      }
    };

    checkTokenValidity();
  }, [state.token]);

  // Login function
  const login = async (email, password) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    
    // Ensure email and password are properly trimmed
    const trimmedEmail = email?.trim() || '';
    const trimmedPassword = password?.trim() || '';
    
    // Client-side validation before making API call
    if (trimmedEmail.length === 0 || trimmedPassword.length === 0) {
      const errorMessage = 'Please provide both email and password';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage
      });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
    
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: trimmedEmail,
        password: trimmedPassword
      });

      if (response.data.success) {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: response.data.data
        });
        toast.success(response.data.message || 'Login successful!');
        return { success: true };
      } else {
        // Handle case where success is false but no error was thrown
        const errorMessage = response.data.message || 'Login failed. Please try again.';
        dispatch({
          type: AUTH_ACTIONS.LOGIN_FAILURE,
          payload: errorMessage
        });
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle rate limiting (429) errors
      if (error.response?.status === 429) {
        const errorMessage = error.response?.data?.message || 'Too many login attempts. Please wait 15 minutes before trying again.';
        dispatch({
          type: AUTH_ACTIONS.LOGIN_FAILURE,
          payload: errorMessage
        });
        toast.error(errorMessage, { duration: 5000 });
        return { success: false, error: errorMessage };
      }
      
      // Handle unauthorized (401) errors
      if (error.response?.status === 401) {
        const errorMessage = error.response?.data?.message || 'Invalid email or password. Please check your credentials and try again.';
        const needsVerification = error.response?.data?.needsVerification;
        dispatch({
          type: AUTH_ACTIONS.LOGIN_FAILURE,
          payload: errorMessage
        });
        toast.error(errorMessage);
        return { success: false, error: errorMessage, needsVerification };
      }
      
      // Handle network errors (no response from server)
      if (!error.response) {
        const isLocalhost = API_BASE_URL.includes('localhost');
        const errorMessage = isLocalhost 
          ? 'Cannot connect to server. Make sure the backend is running on localhost:5000'
          : 'Cannot connect to server. Please check your internet connection and try again. If the problem persists, the API server may be down.';
        dispatch({
          type: AUTH_ACTIONS.LOGIN_FAILURE,
          payload: errorMessage
        });
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
      
      // Handle other errors
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your connection and try again.';
      const needsVerification = error.response?.data?.needsVerification;
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage
      });
      toast.error(errorMessage);
      return { success: false, error: errorMessage, needsVerification };
    }
  };

  // Signup function
  const signup = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.SIGNUP_START });
    
    // Client-side validation before making API call
    const requiredFields = ['firstName', 'lastName', 'email', 'password'];
    const missingFields = requiredFields.filter(field => {
      const value = userData[field]?.trim() || '';
      return value.length === 0;
    });
    
    if (missingFields.length > 0) {
      const errorMessage = `Please provide ${missingFields.join(', ')}`;
      dispatch({
        type: AUTH_ACTIONS.SIGNUP_FAILURE,
        payload: errorMessage
      });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
    
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);

      if (response.data.success) {
        dispatch({
          type: AUTH_ACTIONS.SIGNUP_SUCCESS,
          payload: response.data.data
        });
        toast.success(response.data.message);
        return { success: true, needsVerification: response.data.data.needsVerification };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Signup failed. Please try again.';
      dispatch({
        type: AUTH_ACTIONS.SIGNUP_FAILURE,
        payload: errorMessage
      });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    const currentUser = state.user || JSON.parse(localStorage.getItem('bookmycourt_user') || 'null');
    const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'super_admin';
    
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    
    // Show different messages for admin vs regular users
    if (isAdmin) {
      toast.success('Admin logged out successfully! 👋');
    } else {
      toast.success('Logged out successfully! See you on the court! 🏟️');
    }
  };

  // Update user profile
  const updateUser = async (userData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/users/profile`, userData);
      
      if (response.data.success) {
        dispatch({
          type: AUTH_ACTIONS.UPDATE_USER,
          payload: response.data.data.user
        });
        toast.success(response.data.message);
        return { success: true };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Profile update failed.';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    ...state,
    login,
    signup,
    logout,
    updateUser,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
