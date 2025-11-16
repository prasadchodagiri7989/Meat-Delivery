// API Configuration
export const API_CONFIG = {
  // Change this to your actual backend URL
  BASE_URL: 'http://localhost:5000/api',
  DELIVERY_BASE: 'http://localhost:5000/api/delivery',
  TIMEOUT: 30000, // 30 seconds
};

// For production, use your actual backend URL
export const getApiUrl = () => {
  // You can configure this based on environment
  return API_CONFIG.DELIVERY_BASE;
};
