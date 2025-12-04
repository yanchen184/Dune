// Configuration management using localStorage
import { decryptKey } from './encryption';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL?: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export interface AppConfig {
  firebase: FirebaseConfig;
  openaiApiKey: string;
}

const CONFIG_KEY = 'dune_app_config';

// Default configuration (can be committed to git)
// Firebase config is in plaintext (protected by Firebase security rules)
// OpenAI API Key is encrypted using character shift (+1)
const DEFAULT_CONFIG = {
  firebase: {
    apiKey: 'AIzaSyCPYykTmxJu9znACHIXw0XvOUFozBGZA3M',
    authDomain: 'dune-7e2b9.firebaseapp.com',
    databaseURL: 'https://dune-7e2b9-default-rtdb.asia-southeast1.firebasedatabase.app',
    projectId: 'dune-7e2b9',
    storageBucket: 'dune-7e2b9.firebasestorage.app',
    messagingSenderId: '173857146074',
    appId: '1:173857146074:web:5825bf6bb4e1ce2bde91e3',
    measurementId: 'G-DRYHX3SV1T',
  },
  // OpenAI API Key should be provided via Settings page or environment variables
  // DO NOT commit real API keys to git
  encryptedOpenAIKey: '',
};

// Get configuration from localStorage or environment variables
export function getConfig(): AppConfig | null {
  // First try localStorage
  const stored = localStorage.getItem(CONFIG_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse stored config:', e);
    }
  }

  // Second fallback: environment variables (if available)
  if (import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_OPENAI_API_KEY) {
    return {
      firebase: {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
        measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
      },
      openaiApiKey: import.meta.env.VITE_OPENAI_API_KEY,
    };
  }

  // Third fallback: Firebase only (no OpenAI key)
  // User must configure OpenAI API Key via Settings page
  console.log('⚠️ OpenAI API Key not configured. Please go to Settings page.');
  return null;
}

// Save configuration to localStorage
export function saveConfig(config: AppConfig): void {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

// Clear configuration from localStorage
export function clearConfig(): void {
  localStorage.removeItem(CONFIG_KEY);
}

// Check if configuration is complete
export function isConfigured(): boolean {
  const config = getConfig();
  if (!config) return false;

  const { firebase, openaiApiKey } = config;
  return !!(
    firebase.apiKey &&
    firebase.authDomain &&
    firebase.projectId &&
    firebase.storageBucket &&
    firebase.messagingSenderId &&
    firebase.appId &&
    openaiApiKey
  );
}
