/**
 * DreamDrive Central Configuration
 * Centralizes all API base URLs and environment-specific settings.
 */

const getEnvVar = (key: string, defaultValue: string): string => {
  return (import.meta.env[key] as string) || defaultValue;
};

export const CONFIG = {
  // Backend Node.js API (Main features, auth, wishlist, bookings)
  NODE_API_URL: getEnvVar("VITE_NODE_API_URL", "http://localhost:5001/api"),
  
  // Python FastAPI ML Service (AI Recommendations)
  PYTHON_API_URL: getEnvVar("VITE_PYTHON_API_URL", "http://localhost:8000/predict"),
  
  // App Metadata
  APP_NAME: "DreamDrive",
  BASE_PATH: import.meta.env.BASE_URL || "/Cars_Recommendation_model/",
};

export default CONFIG;
