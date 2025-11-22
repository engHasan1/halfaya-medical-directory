// Configuration for API endpoints
const API_CONFIG = {
  BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000/api'
  : 'https://halfaya-medical-directory.onrender.com/api',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      ME: '/auth/me'
    },
    DOCTORS: '/doctors',
    PHARMACIES: '/pharmacies',
    PHARMACISTS: '/pharmacists'
  }
};

// Helper function to get auth token from localStorage
function getAuthToken() {
  return localStorage.getItem('authToken');
}

// Helper function to set auth token in localStorage
function setAuthToken(token) {
  localStorage.setItem('authToken', token);
}

// Helper function to remove auth token from localStorage
function removeAuthToken() {
  localStorage.removeItem('authToken');
}

// Helper function to check if user is logged in
function isLoggedIn() {
  return !!getAuthToken();
}

// Helper function to get headers with auth token
function getAuthHeaders() {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
}

